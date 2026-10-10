# 06 — Execution plan

## 1. Commit sequence

Each commit is buildable and lint-clean on its own. Messages follow Conventional Commits.

| # | Message | Contents | Gate |
|---|---|---|---|
| 1 | `chore: scaffold project structure and tailwind v4 theme` | folder tree, `globals.css` `@theme` tokens from the Penpot file, Hind Siliguri in the root layout, `Container` primitive, `src/data/emoji.json` + `scripts/build-emoji.mjs`, delete the scaffold SVGs | build |
| 2 | `feat: add typed bazardor api client with cached fetchers` | `lib/types.ts`, `lib/api/client.ts`, `products.ts`, `categories.ts`, all `lib/utils/*` | build |
| 3 | `feat: build shared ui kit with skeletons and toaster` | `Container`, `Skeleton` + `ProductGridSkeleton`, `ChangeBadge`, `EmptyState`, `SubmitButton`, `Select`, `Toaster` | build |
| 4 | `feat: add responsive navbar with category chips and price ticker` | `navbar`, `category-nav`, `user-menu`, `auth-buttons` (placeholder until commit 8), `price-ticker`, `footer`, root layout wiring | build |
| 5 | `feat: build home page hero and three product sections` | hero with `hero-basket.svg`, risers, fallers, `#সব-পণ্য` + Suspense skeletons, `loading.tsx` | build |
| 6 | `feat: add product card and protected product detail page` | `product-card`/`product-grid` promotion out of the home folder, `product/[slug]` with breadcrumbs, header, price summary, 12-row market table | build |
| 7 | `feat: add category page with sort control and empty state` | `category/[slug]`, numeric sort, dropdown a11y, `ProductGridSkeleton` | build |
| 8 | `feat: integrate better-auth with turso for sign in and signup` | db/auth/auth-client/session, `/api/auth/[...all]`, `proxy.ts`, `auth-form`, `social-buttons`, `/signin`, `/signup` | build |
| 9 | `feat: add profile and update-information flow` | `/profile`, `/profile/update`, `updateUser` + toasts | build |
| 10 | `feat: add 404 page and route error boundaries` | `app/not-found.tsx`, `product/[slug]/error.tsx` | build |
| 11 | `docs: add readme, architecture and deployment guide` | `README.md` (C2), `docs/*` | build |

11 commits ≥ the required 8.

---

## 2. Checklist per requirement

**Basic**
- [ ] Responsive at 375 / 768 / 1440 — no horizontal scroll
- [ ] `npm run build` clean
- [ ] `eslint .` clean, `tsc --noEmit` clean
- [ ] `README.md`: name, description, tech, ≥ 5 features

**Navbar** — logo + Bangla date · 8 category links · active highlight · sign-in/up ↔ profile/logout · infinite ticker
**Hero** — eyebrow, heading, subtitle, CTA, right-side image, `#সব-পণ্য` anchor (not a route)
**Sections** — A: 6 risers ▲ · B: 6 fallers ▼ · C: all 33 with `id="সব-পণ্য"` · grid 2→3→4 cols
**Card** — emoji · name · unit · `আজকের দাম` + Bangla digits + badge (green/red/gray) · links to detail
**Detail** — protected · emoji+title · description · category tags · unit · min/max/avg · 12 bazaars by division
**Category** — title+icon · sort dropdown · skeleton · same cards · empty state + "হোম পেজে ফিরে যান"
**Auth** — sign in & sign up forms · cross-links · social buttons · toasts on every outcome · skeleton · redirect home / redirect to login
**Footer** — left description · right disclaimer
**Responsive/robustness** — 404 page · loading skeletons · auth toasts · refresh-safe dynamic routes

**C1** — sort dropdown with chevron, default ডিফল্ট, numeric ordering
**C2** — README
**C3** — `/profile` → আপডেট → `/profile/update` → name input → `updateUser`

---

## 3. Verification gates

```bash
npm run build            # the real gate — fails on dynamicParams, missing Suspense, empty gSP
npx tsc --noEmit         # strict type check
npx eslint .             # next lint no longer exists in 16
node scripts/build-emoji.mjs   # confirms the emoji snapshot still matches the API
npm run dev              # manual pass over every route
```

Manual smoke list (dev):
1. `/` — hero CTA scrolls to `#সব-পণ্য`, heading clears the sticky header
2. `/` — A has 6 risers, B has 6 fallers, C has 33 cards and the line reads `মোট ৩৩টি পণ্য দেখানো হচ্ছে`
3. `/product/alu` logged out → `/signin?redirect=/product/alu` + toast; after login → back to the product
4. `/product/alu` — min/max/avg render, **12** market rows, each `গড়` shows two decimals, the delta
   sentence matches `today - yesterday`
5. `/product/nope` → 404 page
6. `/category/chal` — sort asc yields ৬৬, ৭৪, ৯৯, ১৪৮ (the string-sort bug would reorder these)
7. `/category/mosla` — header reads `৮টি পণ্যের আজকের দাম ও পরিবর্তন`
8. `/category/invalid` → empty state
9. `/signin`, `/signup` — validation errors toast; success redirects correctly
10. `/profile` → আপডেট → `/profile/update` → save → name persists after refresh
11. Logged in, the navbar shows the user pill and the dropdown has `আমার প্রোফাইল` + `সাইন আউট`
12. hard-refresh on `/product/alu`, `/category/chal`, `/signin?redirect=…` — no 404, no error
13. Visually diff against the design: primary `#05893e`, up `#1a9951`, down `#d03739`, card 3-up at 1440

---

## 4. Deployment (Vercel)

1. Push to GitHub; import in Vercel (framework auto-detects Next.js).
2. Add all env vars from `05-auth-plan.md` §10 — **`DATABASE_URL` must be the `libsql://` pooler URL**.
3. Run `node scripts/migrate.mjs` against the production DB.
4. Deploy, then re-run the whole §3 smoke list against the live URL.
5. Fill in the submission form: **Live Link** + **GitHub Repository Link**.

If Turso credentials are unavailable, deploy a build with auth disabled so the public pages still
work, and attach the credentials afterwards — never commit `.env.local`.

---

## 5. Risks

| Risk | Mitigation |
|---|---|
| `generateStaticParams` empty at build (API down) | `getAllProducts` falls back to the mirror URL; wrap in try/catch and return a minimal fallback so the build never hard-fails |
| Emoji snapshot drifts from the API | `node scripts/build-emoji.mjs` regenerates it; CI compares sizes |
| Bengali font missing from the Google font loader | `display: 'swap'` + a `--font-bangla` fallback stack of system Bengali fonts |
| Date hydration mismatch | compute the Bangla date server-side with a fixed `Asia/Dhaka` timezone, pass as prop |
| OAuth keys absent | buttons render and toast (`05-auth-plan.md` §8) |
| Turso unreachable in the serverless function | the db client throws a clear error surfaced as a Bangla toast; it must not crash the page |
| Design drift | `03-design-system.md` holds the extracted tokens and measurements; check §3 of the gate list |
