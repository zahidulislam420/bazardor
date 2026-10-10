# 05 — Auth plan (Better Auth)

---

## 1. Why Turso/libSQL

Vercel's filesystem is read-only — `better-sqlite3` writes work locally and fail after deploy.
Turso gives a free hosted libSQL database over HTTP with a pooler URL for serverless, and the same
client can open a local file when no env var is set (offline dev).

---

## 2. Install

```bash
npm i better-auth @libsql/client kysely-libsql
node scripts/migrate.mjs          # applies src/lib/auth/schema.sql
```

The schema is checked in rather than generated at install time, because the Better Auth CLI
cannot load this TypeScript config (see §3).

---

## 3. `src/lib/auth/db.ts`

```ts
import { createClient } from '@libsql/client'
import { LibsqlDialect } from 'kysely-libsql'

const url = process.env.DATABASE_URL ?? 'file:./local.db'
const authToken = process.env.DATABASE_AUTH_TOKEN

export const db = createClient(authToken ? { url, authToken } : { url })
export const dialect = new LibsqlDialect({ client: db })
```

`file:./local.db` is the dev fallback only; on Vercel the env vars are always present.

**Better Auth does not auto-detect `@libsql/client`.** Its Kysely adapter recognises a driver only
by shape — better-sqlite3 (`.aggregate`), pg (`.connect`), mysql2 (`.getConnection`), Bun
(`.fileControl`), node:sqlite (`.createSession`), D1 (`.batch` + `.exec` + `.prepare`). A libSQL
client matches none of them and throws `Failed to initialize database adapter`, so an explicit
dialect is required:

```ts
database: { dialect, type: 'sqlite' }
```

The option is `client`, **not** `db`, on `LibsqlDialect` — passing `db` gives
*"Please specify either `client` or `url` in the LibsqlDialect config"*.

**The Better Auth CLI cannot load this TypeScript config** (`Failed to initialize database
adapter`). The schema lives in `schema.sql`, generated from `getAuthTables()`, and is applied by
`node scripts/migrate.mjs` — idempotent, so it is safe to re-run.

---

## 4. `src/lib/auth/auth.ts`

```ts
import { betterAuth } from 'better-auth'
import { db } from './db'

const github = {
  clientId: process.env.GITHUB_CLIENT_ID ?? '',
  clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
}
const google = {
  clientId: process.env.GOOGLE_CLIENT_ID ?? '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
}

export const auth = betterAuth({
  database: db,
  secret: process.env.BETTER_AUTH_SECRET,     // openssl rand -base64 32
  baseURL: process.env.BETTER_AUTH_URL,       // http://localhost:3000 locally
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  socialProviders: { github, google },
  user: {
    additionalFields: { name: { type: 'string' } },
  },
})
```
Providers are always registered (so the buttons and the server flow exist), but the *client* hides
the failure: see §8.

---

## 5. Route handler + client

```ts
// src/app/api/auth/[...all]/route.ts
import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '@/lib/auth/auth'

export const { GET, POST } = toNextJsHandler(auth)
```

```ts
// src/lib/auth/auth-client.ts
import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import type { auth } from './auth'

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
})
export const { signIn, signUp, signOut, useSession, updateUser } = authClient
```
`auth-client.ts` is the only file a `"use client"` component may import; `auth.ts` is server-only.

---

## 6. Session helpers (`src/lib/auth/session.ts`)

```ts
export async function getSession()            // auth.api.getSession({ headers: await headers() })
export async function requireSession()       // null | session, redirect('/signin?redirect=…')
export function isSocialConfigured(provider) // !!clientId && !!clientSecret, server-only
```
`headers()` from `next/headers` — **never** inside a `"use cache"` function (`02-data-contract.md` §5).

---

## 7. Route protection — two layers

**Layer 1 — `src/proxy.ts`** (Next 16's rename of middleware). Coarse UX redirect:

```ts
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC = ['/signin', '/signup', '/api/auth']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next()

  const hasSession = request.cookies.get('better-auth.session_token')
  if (pathname.startsWith('/product') && !hasSession) {
    const url = new URL('/signin', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/product/:path*', '/profile/:path*'],
}
```
Only `matcher` is allowed; setting `runtime` throws in Next 16.

**Layer 2 — the server check in the page.** Non-negotiable: a proxy matcher can be bypassed by a
request that skips it, so `/product/[slug]/page.tsx` and `/profile/**` also call `requireSession()`.

**Toast on redirect:** `/signin` reads `?redirect=` and, when present, fires
`toast('সাইন ইন করলে আপনি ফিরে যেতে পারবেন')` once on mount (guarded by a ref so React 19
double-invoked effects don't double-toast).

**Session cookie name:** Better Auth's default cookie is `better-auth.session_token`. If
`advanced.useSecureCookies` or a custom `advanced.cookies` block changes it, the proxy check must
change with it — verify against `/api/auth/get-session` in dev before shipping.

**`?redirect=` safety:** only allow same-origin paths — accept the value only if it starts with `/`
and not `//`, otherwise fall back to `/`. This blocks open-redirect.

**Form copy** comes from the design (`04-pages-spec.md` §5–6): the sign-in title is `সাইন ইন` and the
sign-up title is `অ্যাকাউন্ট তৈরি করুন` — they are deliberately different. The sign-up form has a
**confirm password** field the brief does not mention; keep it, since the design has it.

---

## 8. Social buttons when unconfigured

The rubric requires the buttons to exist, and the user has no OAuth keys. The design specifies both,
with exact labels: `Google দিয়ে চালিয়ে যান` and `GitHub দিয়ে চালিয়ে যান`, as two equal outline
buttons in a row below an `অথবা` divider.

- `social-buttons.tsx` renders both unconditionally, with `public/icons/google.svg` inline in the Google button
- on click, `signIn.social({ provider, callbackURL: '/', errorCallbackURL: '/signin' })` runs inside
  a `try/catch`; on failure → `toast.error('গুগল লগইন এখনো কনফিগার করা হয়নি। ইমেইল দিয়ে লগইন করুন।')`
- with keys present the same code performs the real OAuth round-trip — no other change needed

Adding keys later: GitHub → Settings → Developer settings → OAuth App, callback
`http://localhost:3000/api/auth/callback/github` and the Vercel equivalent. Google → Cloud Console →
APIs & Services → Credentials → OAuth client, same callback shape with `/callback/google`, plus
the authorised JS origin.

---

## 9. Update-user flow — challenge C3

Per Better Auth's user-accounts docs, the client exposes `updateUser`:

```ts
const { data, error } = await authClient.updateUser({ name: values.name })
```
- success → `toast.success('তথ্য আপডেট হয়েছে')` → `router.push('/profile')` + `router.refresh()`
- error → `toast.error('আপডেট করা যায়নি')` + inline message
- The session user comes from `useSession()` so the input pre-fills with the current name.

---

## 10. Environment variables

`.env.local` (gitignored) **and** the Vercel project settings — all six:

| Variable | Local value | Notes |
|---|---|---|
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` | ≥ 32 chars, high entropy |
| `BETTER_AUTH_URL` | `http://localhost:3000` | production: the Vercel domain |
| `DATABASE_URL` | Turso libsql URL | prod: the **`libsql://…` pooler**, not `https://` |
| `DATABASE_AUTH_TOKEN` | Turso token | required on Vercel, optional locally |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | empty until provided | optional — buttons degrade gracefully |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | empty until provided | optional |

`.env.example` is committed with all keys present but blank.

---

## 11. Deployment notes

- `node scripts/migrate.mjs` must run against the **production** Turso database before
  (or right after) the first deploy, otherwise sign-up hits a missing-table error.
- Better Auth sets `Secure` cookies in production; never disable that.
- The `/api/auth/[...all]` handler is a Node route handler — do not add `export const runtime = 'edge'`.
- Callback URLs must exactly match, including scheme and trailing path, or the provider errors.
