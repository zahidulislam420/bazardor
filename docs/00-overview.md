# 00 — Overview

**Project:** বাজার দর (BazarDor) — B14-A7 assignment
**Repo:** `nh/rtl` · **Framework:** Next.js 16.4 (App Router) · **Deadline:** 60 marks → 10 Oct 2026 11:59 PM

---

## 1. What it is

A Bengali-first commodity price dashboard. Every day the app shows today's price for 33 essential
Bangladesh goods across 8 categories, sourced from a read-only public API, plus a per-market price
breakdown. Authentication (Better Auth + Turso) gates the product detail page.

**One sentence:** *প্রয়োজনীয় পণ্যের দাম এক নজরে* — see today's rate, whether it rose or fell, and
what each local bazar is charging.

---

## 2. Locked technology decisions

| Area | Decision | Why |
|---|---|---|
| Framework | Next.js 16.4 App Router, `cacheComponents` + `partialPrefetching` + `reactCompiler` | Already configured in the repo; PPR is the default under `cacheComponents` |
| Language | TypeScript, `strict: true`, alias `@/* → ./src/*` | Already configured |
| Styling | **Tailwind CSS v4 only** — no DaisyUI, no HeroUI | Zero extra deps; every badge/skeleton/dropdown hand-rolled in shared components |
| Font | **Hind Siliguri** (from the Figma file) | The scaffold's Geist cannot render Bengali conjuncts; Hind Siliguri is the typeface the design actually specifies |
| Data | External REST API + `"use cache"` / `cacheLife("hours")` | 33 rows; one cached fetch serves home, category, detail and `generateStaticParams` |
| Auth | Better Auth (email/password + Google + GitHub) on **Turso/libSQL** | Vercel's filesystem is read-only, so a `better-sqlite3` file breaks after deploy |
| Toasts | `react-hot-toast` | Assignment explicitly names `react-hot-toast` / `data-rht-toaster` |
| Route guard | `src/proxy.ts` (Next 16 rename of middleware) **plus** a server-side `auth.api.getSession` check | Proxy alone is not a security boundary — Server Functions/route handlers can bypass matchers |

---

## 3. Live API facts (verified against the running API)

- `GET /` returns a **self-describing manifest** with dataset counts and `filterableFields`
- `GET /products` → **33** products. `GET /categories` → **8** categories.
- Categories: `chal` 🍚 · `dal` 🫘 · `tel` 🛢️ · `sobji` 🥬 · `mach` 🐟 · `mangsho` 🍗 · `dim-dui` 🥛 · `mosla` 🌶️
- **Two slug facts that matter:** `/products/{slug}` returns 404 (the path form is id-only, ids are
  1-based and bounded 1..33), but `/products?slug=…` **works** and returns an **array** — an unknown
  slug yields `[]` with HTTP 200, so checking the status code alone is not enough.
- `/products?limit=3` and `?sort=` are **not** supported (they return `[]`), so all sorting and paging
  is done locally.
- Filters combine with AND: `?category=chal&unit=kg` → 4.
- `unit` ∈ `kg | litre | dozen | piece` — all four occur (`dozen` → ডিম, `piece` → মাখন).
- `change.dir` ∈ `up | down | flat`; `change.pct` is **signed** — `up → 2.1`, `down → -2.9`, `flat → 0`.
  Display the absolute value; the ▲/▼ glyph comes from `dir`, never from the sign.
- Every product carries `markets[]` — **12** bazaars across **6** divisions, each `{market, division, min, max}`.

Both mirrors are healthy: `api.api-store.workers.dev/api/bazardor` and the `api.abcz.workers.dev` fallback.

---

## 3.1 Design file facts (extracted from the Penpot/Figma export)

The `.fig` and `.penpot` files in `public/` are ZIP archives and were parsed directly rather than
guessed at. What came out:

- **7 artboards** at 1440 px: Home (3141 tall), Product Details (1489), Sign Up (1014), Profile (1047),
  Category (892), Sign In (900), Home – User Menu Open (900)
- **Full colour token set** exported in the Penpot file's `tokens.json` — primary `#05893e`,
  success `#1a9951`, error `#d03739`, base-content `#1d271f`, base-100 `#fafcfa`. Full table in
  `03-design-system.md` §1.
- **Typeface: Hind Siliguri** (`fontId: gfont-hind-siliguri`). SF Pro and Inter appear only on emoji
  runs and one Latin string — they do not need loading.
- **Exact copy deck** for every screen, including strings the assignment brief did not specify
  (see `04-pages-spec.md`). Two notable ones the brief missed: the hero subtitle and
  "মোট ৩৩টি পণ্য দেখানো হচ্ছে".
- **Measured layout**: 1152 px container / 1120 px content, 3-column card grid at 363×138 with a
  16 px gap, 32 px nav chips, 36 px ticker items, 69 px footer.
- **Assets recovered as vectors**: the `bazar-hero 1` illustration (16 paths) was rebuilt into
  `public/images/hero-basket.svg`, plus `google`, `chevron-down` and `chevron-right` icons.

---

## 4. Requirement → implementation traceability

Status legend: ☐ not started · ◐ in progress · ☑ done

### Basic requirements (everyone)

| Req | Where |
|---|---|
| Works on mobile/tablet/desktop | `03-design-system.md` §5 — one breakpoint contract applied everywhere |
| ≥ 8 git commits with clear messages | `06-execution-plan.md` §1 — 11 planned commits |
| No errors after deployment | `06-execution-plan.md` §3 — `next build` is the gate |
| README with name, description, tech, ≥ 5 features | `README.md` (committed in commit 11) |

### Main requirements (50 marks)

| # | Req | Where |
|---|---|---|
| 1 | Navbar: logo + 🛒 বাজার দর + Bangla date, category row, active highlight, সাইন ইন/সাইন আপ ↔ profile/logout, infinite price ticker | `src/components/layout/*`, spec `04-pages-spec.md` §1 |
| 2 | Hero: eyebrow, heading, subtitle, CTA → `#সব-পণ্য` anchor (not a route), image right | `src/app/components/hero.tsx` |
| 3 | Section A ▲ top-6 risers, Section B ▼ top-6 fallers, Section C `id="সব-পণ্য"` all products, responsive grid, full card anatomy, card → detail | `04-pages-spec.md` §2 |
| 4 | `/product/[slug]` **protected**; emoji+title, description, category tags, unit, min/max/avg price, bazar-wise table | `04-pages-spec.md` §3 |
| 5 | `/category/[slug]`: title+icon, sort dropdown, loading skeleton, product cards, empty state + "হোম পেজে ফিরে যান" | `04-pages-spec.md` §4 |
| 6 | `/signin`, `/signup`: title, Email+Password, cross-link, social buttons, Better Auth, toast on success/error, skeleton | `04-pages-spec.md` §5–6, `05-auth-plan.md` |
| 7 | Footer: left description, right disclaimer | `04-pages-spec.md` §8 |
| 8 | Responsive everywhere; 404 page; loading animation; auth/protect toasts; refresh-safe dynamic routes | `04-pages-spec.md` §7, `03-design-system.md` §5 |

### Challenge requirements (10 marks)

| Req | Where |
|---|---|
| C1 | Sort dropdown ডিফল্ট / দাম: কম থেকে বেশি / দাম: বেশি থেকে কম, chevron, **numeric** (not string) sort | `02-data-contract.md` §5, `04-pages-spec.md` §4 |
| C2 | Well-designed README.md | commit 11 |
| C3 | `/profile` → "আপডেট" button → `/profile/update` form with Name input → Better Auth `updateUser` | `04-pages-spec.md` §7, `05-auth-plan.md` §6 |

---

## 5. Next.js 16.4 constraints that shape the code

Verified against `node_modules/next/dist/docs/` in this repo — **not** from memory.

1. `params` and `searchParams` are **`Promise`**; sync access is fully removed.
   Use the generated helpers: `export default async function Page(props: PageProps<'/product/[slug]'>)`.
   **Never await them in the page body** — pass the promise into a `<Suspense>` child instead, or the
   route reports *"Next.js encountered URL data outside of `<Suspense>`"* and the build fails.
   This bit four routes: category, product, signin and (via `searchParams`) the redirect toast.
2. `dynamicParams` **fails the build** under `cacheComponents` → rely on `generateStaticParams` +
   `notFound()`. An empty `generateStaticParams` return is also a build error.
3. PPR is always on. Skeletons come from `<Suspense fallback>` placed near the data access,
   not from `loading.tsx` alone.
4. `middleware.ts` is renamed **`proxy.ts`**; export `proxy` or a default; the only config key is
   `matcher`; setting `runtime` throws.
5. `useSearchParams()` must sit inside a `<Suspense>` boundary — dev silently passes, production build fails.
6. `next lint` is removed. Lint with `eslint .`.
7. `revalidateTag` now needs a second argument.
8. **Reading cookies is uncached data.** Any page calling `getSession()`/`requireSession()` must do
   so inside a `<Suspense>` boundary, for the same reason as (1). Affects profile and update.
9. `new Date()` is synchronous IO and also fails the build — wrap it in `'use cache'` (see `date-bn.ts`).
10. Better Auth cannot infer a driver from a raw `@libsql/client`; pass an explicit Kysely
    `LibsqlDialect`, or it throws *"Failed to initialize database adapter"*.
11. The Better Auth CLI cannot load a TypeScript config file here — apply `schema.sql` with
    `scripts/migrate.mjs` instead.

---

## 6. Assumptions & open items

- **Resolved:** the Figma/Penpot files were parseable — they are ZIP archives containing the full
  object tree. Design tokens, fonts, copy and vector assets were extracted, so no screenshot export
  is needed. See §3.1.
- **Assumed:** social providers are wired in config but gated on env vars; without keys the buttons
  are visible (rubric requirement) and show a "not configured yet" toast instead of failing silently.
- **Needed from the user:** Turso `DATABASE_URL` + `DATABASE_AUTH_TOKEN`.
- **Not doing** (explicitly out of scope per the brief): email verification, forgot-password.
