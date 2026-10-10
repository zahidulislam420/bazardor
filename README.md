# বাজার দর — BazarDor

> দেশের প্রতিটি বাজারের আজকের দাম এক নজরে

A Bengali-first commodity price dashboard. **33 essential goods across 8 categories**, every day,
with a per-bazar breakdown — which price rose, which fell, and what each local market is charging.

Built for the **B14-A7** assignment.

---

## ✨ Features

1. **Live market prices** — today's rate for 33 products in Bangla numerals, sourced from a public
   REST API with automatic fallback to a mirror, cached for an hour.
2. **Price movement** — top 6 risers and top 6 fallers ranked by percentage change, plus a badge on
   every card: green ▲, red ▼, grey — for unchanged.
3. **Bazar-wise breakdown** — each product lists its price across **12 bazaars in 6 divisions**,
   with the minimum, maximum and average.
4. **Full authentication** — email/password plus Google and GitHub OAuth, with a user menu,
   toast feedback and a working profile page.
5. **Protected detail pages** — product detail requires sign-in; a redirect preserves where you
   were headed and a toast explains why.
6. **Update your profile** — edit your name from a dedicated route and see it reflected everywhere.
7. **Fully responsive** — verified free of horizontal overflow at 360 / 390 / 768 / 1024 / 1440 px.
8. **Accessible by default** — keyboard-navigable sort dropdown, visible focus rings, ARIA labels,
   reduced-motion support, and Bengali numerals throughout.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16.4** (App Router) | UI and routing, with Cache Components / PPR |
| **React 19** | UI runtime |
| **TypeScript** (strict) | Type safety |
| **Tailwind CSS v4** | Styling — no component library, every component hand-rolled |
| **Hind Siliguri** | Bengali typeface, as specified in the design file |
| **Better Auth** | Email/password + Google + GitHub authentication |
| **Turso / libSQL** | Hosted database (local file in development) |
| **react-hot-toast** | Toast notifications |

---

## 🚀 Getting Started

```bash
npm install
cp .env.example .env.local     # then fill in the values below
node scripts/migrate.mjs       # create the auth tables
npm run dev
```

Open <http://localhost:3000>.

### Environment variables

| Variable | Required | Notes |
|---|---|---|
| `BETTER_AUTH_SECRET` | yes | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | yes | `http://localhost:3000` locally, your domain in production |
| `DATABASE_URL` | yes | `file:./local.db` locally, the Turso **`libsql://`** pooler URL in production |
| `DATABASE_AUTH_TOKEN` | production | Turso auth token |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | optional | Social login stays visible without them and toasts a helpful message |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | optional | As above |

For production, create a free database at [turso.tech](https://turso.tech), then:

```bash
DATABASE_URL='libsql://your-db.turso.io' DATABASE_AUTH_TOKEN='...' node scripts/migrate.mjs
```

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npx eslint .` | Lint (`next lint` no longer exists in Next 16) |
| `npx tsc --noEmit` | Type check |
| `node scripts/migrate.mjs` | Apply the auth schema (idempotent) |
| `node scripts/build-emoji.mjs` | Regenerate the emoji snapshot from the API |

---

## 🗂️ Project structure

```
src/
├── app/
│   ├── layout.tsx                 # fonts, shared shell, toaster
│   ├── page.tsx                   # home: hero + 3 sections
│   ├── components/                # home-only components
│   ├── category/[slug]/           # category page + sort control
│   ├── product/[slug]/            # protected detail page
│   ├── signin/ · signup/          # auth pages
│   ├── profile/ · profile/update/ # profile + update flow
│   ├── not-found.tsx · error.tsx  # 404 and error boundaries
│   └── api/auth/[...all]/         # Better Auth handler
├── components/                    # shared across 2+ routes
│   ├── layout/ · product/ · ui/
├── lib/
│   ├── api/                       # cached fetchers + mirror fallback
│   ├── auth/                      # Better Auth, session guards, schema
│   └── utils/                     # Bangla numerals, units, change, sort, stats
├── data/emoji.json                # emoji snapshot for offline fallback
└── proxy.ts                       # route protection (Next 16's middleware)
```

**Rule:** a component lives in `app/<page>/components/` only while exactly one page uses it. The
moment a second page needs it, it moves up to `src/components/`.

---

## 📚 Documentation

The full specification lives in [`docs/`](./docs), extracted from the assignment brief, the live API
and the Figma/Penpot design file:

| Doc | Contents |
|---|---|
| [00 — Overview](./docs/00-overview.md) | Scope, decisions, requirement traceability |
| [01 — Architecture](./docs/01-architecture.md) | Folder tree, DRY rules, data flow |
| [02 — Data contract](./docs/02-data-contract.md) | Endpoint matrix, types, formatters |
| [03 — Design system](./docs/03-design-system.md) | Extracted tokens, type scale, layout |
| [04 — Pages spec](./docs/04-pages-spec.md) | Route-by-route acceptance criteria |
| [05 — Auth plan](./docs/05-auth-plan.md) | Better Auth setup, route protection |
| [06 — Execution plan](./docs/06-execution-plan.md) | Commits, verification, deployment |

---

## ⚠️ Notes on Next.js 16

Built on Next 16 with **Cache Components**, which changes a few conventions. All of these were hit
during development and are documented in [00 — Overview](./docs/00-overview.md) §5:

- `params` / `searchParams` are promises — awaiting them in a page body **fails the build**
- reading cookies (any session check) must also happen inside `<Suspense>`
- `dynamicParams` no longer exists; use `generateStaticParams` + `notFound()`
- `middleware.ts` is now `proxy.ts`
- `new Date()` is synchronous IO and must be wrapped in `'use cache'`

---

## 📄 License

Assignment work. The price data comes from a public API and remains its property.
