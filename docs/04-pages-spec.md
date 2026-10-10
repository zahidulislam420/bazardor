# 04 — Pages spec

**Every Bangla string below is copied from the design file**, not invented. Where the assignment
brief and the design disagree, the design wins (it is what the examiner will compare against).
Sizes are the measured values from `03-design-system.md` §2.

Emoji always come from `product.image` / `category.icon`, never hardcoded in JSX. UI glyphs
(🛒 👤 ↩ ▲ ▼ — ▾) live in `src/data/emoji.json`.

---

## 1. Navbar (`src/components/layout/`) — requirement 1

Rendered by `src/app/layout.tsx`. The design has it as three stacked rows totalling 118 px:
row 1 = 68, row 2 = 49, ticker = 37.

**Row 1** (container 1164, `py-3 px-4`, gap 12)
- Left `Link` → `/`: a 40×40 `rounded-xl` `bg-base-200` tile holding 🛒 at 18 px, then a stack of
  - `বাজার দর` — the logo wordmark
  - `মঙ্গলবার, ৬ অক্টোবর, ২০২৬` — Bangla date, 14/500 `#05893e`
  - The date is computed **server-side** in `Asia/Dhaka` and passed as a prop.
- Right, logged out: `সাইন ইন` (ghost) + `সাইন আপ` (primary)
- Right, logged in: the `Button / Ghost` from the *Home – User Menu Open* artboard — a 36×36
  rounded-full Avatar, the first name, a `▾` chevron, all in one 40 px pill
- `md`+: one row. Below `md`: logo row + a sheet holding nav chips and auth actions.

**User menu** (`Home - User Menu Open` artboard) — 256 px wide, `rounded-2xl`, `p-2.5`:
- `Menu Title` block (`p-2 px-3`): display name + email
- `User Menu / Item` rows 33 px, `rounded-lg`, `px-3 py-1.5`, gap 8:
  `👤 আমার প্রোফাইল` → `/profile`, then `↩ সাইন আউট`
- closes on outside click, Escape, and route change

**Row 2 — category nav** (49 px tall, list `p-2` gap 4)
Eight `Nav / Category Chip`s, 32 px, `rounded-lg`, `px-[13px] py-1`, gap 6 — emoji + `nameBn`:
`🍚 চাল` `🫘 ডাল` `🛢️ তেল` `🥬 সবজি` `🐟 মাছ` `🍗 মাংস` `🥛 ডিম-দুধ` `🌶️ মসলা`
Active chip = `bg-primary text-primary-content`; inactive = `bg-base-200 text-base-content`.
The design uses **chips, not underline links** — match that.
Mobile: `overflow-x-auto whitespace-nowrap`.

**Row 3 — price ticker** (37 px) — see `03-design-system.md` §4.
Item format is confirmed by the design: `🍚 স্বর্ণমাছি চাল ১৪৮ টাকা/কেজি ▲ ২.১%`.

**Acceptance:** active chip highlighted; both auth states render; ticker loops seamlessly; no
horizontal page scroll at 360 px.

---

## 2. Home (`src/app/page.tsx`) — requirements 2 & 3

Order: **Hero → A → B → C**. All inside the 1120 px content column.

### Hero (`components/hero.tsx`, server)
`rounded-3xl`, inner padding 40, two columns — text left (576 px), image right (315×263).

- eyebrow pill (`rounded-xl`, `px-3 py-1`, 14/500 `#05893e`): the Bangla date, `মঙ্গলবার, ৬ অক্টোবর, ২০২৬`
- headline 28/700: `আজকের বাজারের দাম এক নজরে`
- subtitle 16/400, max 576 px:
  `চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।`
- CTA `Button / Primary` (40 px, `rounded-lg`, `#05893e` bg, `#f3fbf4` text 14/600): `সব পণ্য দেখুন`
  → **anchor**, not a route: `<a href="#সব-পণ্য">`. Give the target `scroll-mt` equal to the
  sticky header height so the heading is not hidden.
- image: `public/images/hero-basket.svg`, rebuilt from the design's `bazar-hero 1` vector group

### Section A — `▲ আজ দাম বেড়েছে`
Heading 20/700, the ▲ glyph as a sibling text node. `getRisers(all)` → 6 cards, 3 per row at 1440.
Live data starts: `peyaj ৫৪ টাকা ▲ ১২.৫%`, `ada ৮৫ টাকা ▲ ৯.০%`, `begun ৪৪ টাকা ▲ ৪.৮%`.

### Section B — `▼ আজ দাম কমেছে`
Same layout, red badges. Live data starts: `kaccha-moric ▼ ১২.৪%`, `roshun ▼ ৭.৪%`.

### Section C — `সব পণ্য`
- `<h2 id="সব-পণ্য" className="scroll-mt-28">সব পণ্য</h2>` — 20/700
- subtitle 14/400: `মোট ৩৩টি পণ্য দেখানো হচ্ছে` — the count is **computed**, not hardcoded,
  so it stays correct if the API changes
- 33 cards, `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, gap 16

### Loading
`app/loading.tsx` plus `<Suspense fallback={<ProductGridSkeleton count={6} />}>` around each of
A, B and C so the page streams progressively.

**Acceptance:** the CTA scrolls to `#সব-পণ্য` and clears the sticky header; A and B show 6 each;
C shows all 33 with the live count; every price is Bangla digits; every badge matches its `dir`.

---

## 3. Product detail (`src/app/product/[slug]/page.tsx`) — requirement 4 — **protected**

### Guard
`proxy.ts` redirects `/product/*` → `/signin?redirect=<path>` with no session cookie; the page
independently calls `auth.api.getSession()` and redirects again.

### Static params
`generateStaticParams` maps all 33 slugs. Unknown slug → `notFound()`. `dynamicParams` is not
exported (banned under `cacheComponents`) — Next serves the shell and resolves after navigation, so
a hard refresh on a valid slug never 404s.

### Layout, per the artboard

**Breadcrumbs** — `হোম / চাল / বাটাম সাইজ চাল`, separated by `icon/Breadcrumb Chevron`
(`public/icons/chevron-right.svg`), 14/500, `py-2 px-2`

**Header card** — `rounded-2xl`, `p-5`, three parts in a row with gap 16:
- emoji tile 80×80 `rounded-2xl` with the product emoji at 36 px
- middle stack: `nameBn` 30/700 · `প্রতি কেজি · চাল` 14/400 (unit · category) ·
  `গতকালের তুলনায় আজ দাম বেড়েছে · ২ টাকা` 14/400
  → the delta sentence is generated: pick বেড়েছে/কমেছে/অপরিবর্তিত from `change.dir` and
  `Math.abs(today - yesterday)` in Bangla digits
- price panel 118×132 `rounded-2xl` `p-4`: `আজকের দাম` · the number alone at 30/700 ·
  `টাকা / কেজি` · `▲ ৩.১%` badge

**Summary panel** — `rounded-2xl` `p-5`, heading `দামের সারসংক্ষেপ` 18/600, then three stat tiles
(`Price Summary Stat`, `rounded-2xl`, `p-[17px] px-6`, 351 wide, gap 12):

| Tile | label | value 24/700 | caption 12/400 |
|---|---|---|---|
| min | `সর্বনিম্ন দাম` | `৫৯ টাকা` | `সবচেয়ে কম দামের বাজার` |
| max | `সর্বাধিক দাম` | `৭৩ টাকা` | `সবচেয়ে বেশি দামের বাজার` |
| avg | `গড় দাম` | `৬৬ টাকা` | `প্রতি কেজি-এর হিসাবে` |

**Market table** — heading `বাজারভিত্তিক আজকের দাম` 18/600, then a `rounded-2xl` bordered table:
header cells `বাজার` · `বিভাগ` · `সর্বনিম্ন` · `সর্বাধিক` · `গড়` (14/700),
body cells 14/400, row height 46, cell padding `12px 16px`.
All **12** markets render as a single flat table in the given order (the design does **not** group by
division — division is its own column). `গড়` is per-row: `(min + max) / 2`, rendered with **two**
decimals (`৬৫.৫০ টাকা`) while min/max are integers.

Below `sm`, each row becomes a stacked card rather than a 5-column table.

**Acceptance:** `/product/alu` logged out lands on `/signin` with a toast and returns to the product
after login; the header, three stats and all 12 markets render; the delta sentence matches the data;
`/product/does-not-exist` renders the 404 page.

---

## 4. Category (`src/app/category/[slug]/page.tsx`) — requirement 5

**Header card** — `rounded-2xl` `p-5`, row gap 12:
- emoji at 36 px on the left
- right stack: `চাল` 24/700 · `৪টি পণ্যের আজকের দাম ও পরিবর্তন` 14/400
  → **the count is computed** and the verb set matches: 1 → `১টি`, otherwise `৪টি`

**Sort bar** — a `rounded-2xl` `p-4` row: label `সাজান` 14/400, then the select trigger.
`generateStaticParams` from `getAllCategories()`; unknown slug → empty state.

### Sort control — challenge C1 (`components/product-list.tsx`, client)
- trigger 32 px `rounded-lg` `bg-base-200`, shows the current value, chevron on the right
  (`public/icons/chevron-down.svg`, rotates 180° when open)
- options: `ডিফল্ট` · `দাম: কম থেকে বেশি` · `দাম: বেশি থেকে কম`
- a11y: `role="listbox"`/`option`, `aria-expanded`, `aria-selected`, Esc and click-outside close
- sorts with `sortProducts(products, order)` — **numeric**, never string (§5 of `02-data-contract.md`)

Real check for `chal` (`৬৬ ৭৪ ৯৯ ১৪৮`):
`price-asc → বাটাম সাইজ চাল · নাজির চাল · মিনিকেট চাল · স্বর্ণমাছি চাল`, `price-desc` reversed.
A string sort would place `৯৯` after `১৪৮`.

**Count line** — `মোট ৪টি পণ্য দেখানো হচ্ছে`, same computed-count helper as the header.
**List** — identical cards to Home, 3 per row at 1440, in `<Suspense fallback={<ProductGridSkeleton count={8} />}>`
**Empty state** — 🧺, Bangla message, `হোম পেজে ফিরে যান` → `/`

---

## 5. Sign in (`src/app/signin/page.tsx`) — requirement 6

Centred **448 px** column, matching the artboard exactly.

- title `সাইন ইন` 24/700
- subtitle 14/400: `বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।`
- card `rounded-2xl` `p-6`, white, bordered
- fields (`Form Field` = label 14/500 above a 40 px `rounded-lg` input, `px-[13px] py-1`):
  - `ইমেইল` — placeholder `you@example.com`, `type="email"`, `autoComplete="email"`
  - `পাসওয়ার্ড` — placeholder `কমপক্ষে ৮ অক্ষর`, `minLength={8}`, `autoComplete="current-password"`
- primary button, full width: `সাইন ইন`
- `Divider` — `অথবা` between two hairlines
- social row, two buttons side by side: `Google দিয়ে চালিয়ে যান` (with `public/icons/google.svg`),
  `GitHub দিয়ে চালিয়ে যান`
- below the card, centred: `অ্যাকাউন্ট নেই? সাইন আপ করুন` → `/signup`
- at the bottom of the column: `← হোম পেজে ফিরে যান` → `/`
- success → `toast.success` → `router.push(redirect ?? '/')` + `router.refresh()`
- failure → `toast.error` **and** an inline message under the field, `aria-invalid` + red border
- `useSearchParams()` for `?redirect=` — must be inside `<Suspense>` or the production build fails

---

## 6. Sign up (`src/app/signup/page.tsx`)

Same 448 px column, `auth-form.tsx` with `mode="signup"`.

- title `অ্যাকাউন্ট তৈরি করুন` 24/700 — **not** "সাইন আপ"
- subtitle: `বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।`
- four fields, each 65 px tall:
  | label | placeholder |
  |---|---|
  | `নাম` | `যেমন: রহিম উদ্দিন` |
  | `ইমেইল` | `you@example.com` |
  | `পাসওয়ার্ড` | `কমপক্ষে ৮ অক্ষর` |
  | `পাসওয়ার্ড নিশ্চিত করুন` | `আবার লিখুন` |
- primary button: `অ্যাকাউন্ট তৈরি করুন`
- divider + the same two social buttons
- below: `অ্যাকাউন্ট আছে? সাইন ইন করুন` → `/signin`
- success → `toast.success` → `router.push('/signin')` (per the brief: register → login page)
- the confirm-password field must match, or show an inline Bangla error

---

## 7. Profile & update — challenge C3

`/profile` (server reads the session; redirect to `/signin?redirect=/profile`).
The artboard is titled `আমার প্রোফাইল` — use that, not "প্রোফাইল".

- title `আমার প্রোফাইল` 24/700 · subtitle `আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।`
- info row `rounded-2xl p-6`, gap 16: 80×70 Avatar · name 20/400 · email 16/400 ·
  outline button `↩ সাইন আউট`
- info panel `rounded-2xl p-5`, heading `তথ্য` 18/600
- **`আপডেট` button → `/profile/update`** ← the button the rubric asks for.
  The artboard puts it inline under the email field; the brief requires a separate route, so keep
  the route and style the button as the design's `Button / Primary`.

`/profile/update`:
- title `তথ্য আপডেট করুন`, one input `নাম` pre-filled from `session.user.name`
- `আপডেট করুন` submit button
- `authClient.updateUser({ name })` → `toast.success('তথ্য আপডেট হয়েছে')` → `/profile`
- error → `toast.error` + inline message

---

## 8. Footer (`src/components/layout/footer.tsx`) — requirement 7

69 px tall, row padding `24px 16px`, hairline top border, two ends:
- left 14/400: `বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।`
- right 14/400: `সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।`

---

## 9. 404 + error boundary

- 🧺, `পৃষ্ঠাটি খুঁজে পাওয়া যায়নি`, muted line, primary CTA `হোম পেজে ফিরে যান` → `/`
- covers `/category/invalid` and `/product/unknown` (both `notFound()`)
- `app/product/[slug]/error.tsx` → Bangla retry card calling `reset()`
