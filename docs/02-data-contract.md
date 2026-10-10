# 02 — Data contract

## 1. Endpoints

```
BASE_URL_1 = https://api.api-store.workers.dev/api/bazardor   (primary)
BASE_URL_2 = https://api.abcz.workers.dev/api/bazardor        (fallback mirror)
```

### 1.1 The API is self-describing

`GET /` returns a manifest with `count`, `item`, `filterExample` and `filterableFields`:

```json
{ "namespace": "bazardor",
  "datasets": {
    "categories": { "count": 8, "filterableFields": ["id","slug","nameBn","icon"] },
    "products":   { "count": 33, "filterableFields": ["id","slug","nameBn","category",
                   "categoryNameBn","categoryIcon","unit","image","today","yesterday",
                   "lastWeek","lastMonth"] } } }
```

`markets` and `change` are deliberately **not** filterable. No `sort`, `order` or `limit` is
supported (`/products?limit=3` returns `[]`, not the first three).

### 1.2 Verified endpoint matrix

| Call | Status | Result |
|---|---|---|
| `GET /` | 200 | manifest |
| `GET /products` | 200 | array, 33 |
| `GET /products/1` … `/products/33` | 200 | object |
| `GET /products/0`, `/products/34` | **404** | `{"error":"Not found"}` — ids are 1-based, 1..33 |
| `GET /products?slug=sorno-machi-chal` | 200 | **array of 1** |
| `GET /products?slug=nope` | 200 | **empty array, not 404** |
| `GET /products?category=sobji` | 200 | array of 5 |
| `GET /products?unit=dozen` | 200 | array of 1 (ডিম) |
| `GET /products?category=chal&unit=kg` | 200 | array of 4 — filters **combine with AND** |
| `GET /products?id=5` | 200 | array of 1 |
| `GET /categories` | 200 | array, 8 |
| `GET /categories/chal` | 200 | object |
| `GET /categories?slug=chal` | 200 | array of 1 |
| `GET /categories/invalid` | **404** | `{"error":"Not found"}` |
| `GET /products/sorno-machi-chal` | **404** | there is **no** path-slug endpoint |
| `/health`, `/stats`, `/market`, `/product/1` | 404 | no other datasets exist |

---

## 2. Critical finding — slug resolution

Two facts that shape the detail page:

1. **`/products/{slug}` returns 404.** The path form is id-only (`/products/1`), ids are 1-based
   and bounded to 1..33.
2. **`/products?slug=…` works** and returns an **array**, not an object — an unknown slug returns
   `[]` with status 200, so a 404 check on the HTTP code is not enough; check `length`.

```ts
export async function getProductBySlug(slug: string): Promise<Product | null> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  const products = await getAllProducts()
  return products.find((p) => p.slug === slug) ?? null
}
```

Resolving from the **cached full list** is preferred over `?slug=` even though the query works:

- one cache entry serves home, category, detail and `generateStaticParams` — the filtered call would
  be a separate cache key per slug (33 keys instead of 1)
- after the first request the payload is 0 bytes either way
- `generateStaticParams` and `notFound()` need the full list anyway

Keep `?category=` / `?slug=` documented here as the reason the full-list approach was chosen; the
mirror at `api.abcz.workers.dev` exposes the identical surface.

---

## 3. Types (`src/lib/types.ts`)

```ts
export type ChangeDir = 'up' | 'down' | 'flat'

export interface Market {
  market: string      // "গ্রীন মার্কেট, মিরপুর"
  division: string    // "ঢাকা"
  min: number         // 143
  max: number         // 159
}

export type Unit = 'kg' | 'litre' | 'dozen' | 'piece'

export interface Product {
  id: number          // 1..33, 1-based, no id 0
  slug: string
  nameBn: string      // "স্বর্ণমাছি চাল"
  category: string    // "chal"
  categoryNameBn: string  // "চাল"
  categoryIcon: string    // "🍚"
  unit: Unit
  image: string       // emoji used as the card thumbnail
  today: number
  yesterday: number
  lastWeek: number
  lastMonth: number
  change: { dir: ChangeDir; pct: number }   // pct signed: up +2.1, down -2.9, flat 0
  markets: Market[]   // always 12 entries across 6 divisions
}

export interface Category {
  id: string
  slug: string
  nameBn: string   // "চাল"
  icon: string     // "🍚"
}

export type SortOrder = 'default' | 'price-asc' | 'price-desc'
```

Real data anchors used as regression checks:
`id 1 sorno-machi-chal 148 up 2.1` · `id 2 miniket-chal 99 down -2.9` · `id 3 nazir-chal 74 flat 0` ·
`id 13 peyaj 54 up 12.5` (largest rise) · `id 14 kaccha-moric 92 down -12.4` (largest fall) ·
`id 24 khasir-mangsho 1290 down -3` · `id 26 dim 158 dozen` · `id 29 mokhhan 145 piece`.

Emoji are snapshotted in `src/data/emoji.json` (33 products, 8 categories, UI glyphs, unit labels) so
the UI still renders during an API outage.

---

## 4. `lib/api/client.ts`

```ts
const BASE_URLS = [process.env.NEXT_PUBLIC_API_URL, 'https://api.api-store.workers.dev/api/bazardor',
                   'https://api.abcz.workers.dev/api/bazardor'].filter(Boolean) as string[]

export async function getJSON<T>(path: string, revalidate = 3600): Promise<T>
```

Behaviour:
- iterate `BASE_URLS`, `fetch` with `{ next: { revalidate }, signal: AbortSignal.timeout(8000) }`
- first non-`ok` response continues to the next base URL; all failing → throw
- `if (!res.ok) throw new Error(\`bazardor ${path} → ${res.status}\`)`
- typed generic, no `any`, response cast through a narrowing guard

This is the **only** module that knows the URL strings. No component ever sees a raw URL.

---

## 5. Caching (Next 16 `cacheComponents`)

`fetch` is **uncached by default** under `cacheComponents`. Every remote read is wrapped:

```ts
import { cacheLife, cacheTag } from 'next/cache'

export async function getAllProducts(): Promise<Product[]> {
  'use cache'
  cacheLife('hours')      // stale 5m · revalidate 1h · expire 1d
  cacheTag('products')
  return getJSON<Product[]>('/products')
}
```

Notes:
- `cacheLife` / `cacheTag` are imported from `next/cache` (not `unstable_*`, not `next/headers`).
- A `'use cache'` function **must be `async`** and its args/return must be serializable — `slug: string` is fine.
- Pages do **not** need `export const revalidate` (that segment config is removed under `cacheComponents`).
- Because the read is cached, it lands in the **static shell**; the `<Suspense>` fallbacks still exist
  for the uncached shell + cold-start case and satisfy the "loading animation" requirement.
- Never put `cookies()`/`headers()` inside a `'use cache'` function — the detail page reads the session
  *outside* the cached fetcher.

---

## 6. Derived selectors (all pure, all in `lib/utils`)

### `bengali-numeral.ts`
```ts
toBanglaDigits('148.5')        // '১৪৮.৫'
toBanglaNumber(148)            // '১৪৮'
toBanglaNumber(1850)           // '১,৮৫০'   ← Indian grouping, NOT '১,৮৫০' vs '১৮৫০'
```
Implementation: `replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[+d])`, then `Number.toLocaleString('en-IN')` for grouping
**before** digit substitution. `pct` keeps exactly one decimal: `2.1 → ২.১`, `9 → ৯.০`, `0 → ০.০`.

### `format-price.ts`
```ts
formatPrice(148)   // '১৪৮'
formatPrice(1850)  // '১,৮৫০'
formatTaka(148)    // '১৪৮ টাকা'
```

### `unit-label.ts`
```ts
kg → 'প্রতি কেজি'   litre → 'প্রতি লিটার'
dozen → 'প্রতি ডজন'  piece → 'প্রতি পিস'
```
Lookup table with a `?? 'প্রতি কেজি'` fallback for a future unit value.

### `change.ts`
```ts
changeGlyph('up')    // '▲'   changeGlyph('down') // '▼'   changeGlyph('flat') // '—'
changeTone('up')     // 'up' | 'down' | 'flat'   → drives the colour class
formatChangePct(2.1) // '২.১%'   formatChangePct(-2.9) // '২.৯%'   formatChangePct(0) // '০.০%'
```
**Rule:** the glyph and colour come from `change.dir`; only the magnitude is `Math.abs(pct)`. A
negative `pct` must never render as `▼ ২.৯%` in red *because of the minus sign* — it renders green
if `dir` were `up`. Display of the flat case is `— ০.০%`.

Colours come from the design tokens, not from a generic palette: up `#1a9951`, down `#d03739`,
flat `#1d271f`. The badge has **no background fill** — glyph and percentage are two sibling text
nodes in a single pill.

### `stats.ts`
```ts
minPrice(p)       // min over markets[].min                  → 132 for sorno-machi-chal
maxPrice(p)       // max over markets[].max                  → 165
avgPrice(p)       // round(mean of markets[].mid), mid=(min+max)/2
marketAverage(m)  // (m.min + m.max) / 2, rendered with 2 decimals: ৬৫.৫০ টাকা
```
The detail page's summary uses the **overall** min/max across all 12 markets, and each table row's
`গড়` is the per-market midpoint. The design confirms the formatting difference: summary values are
integers (`৫৯ টাকা`), table averages carry two decimals (`৬৫.৫০ টাকা`).

**No division grouping.** The design renders all 12 markets as one flat table with বিভাগ as its own
column — do not group into sections. `division` is still used for the `বিভাগ` cell.

### `count-bn.ts`
```ts
countBn(4)  // '৪'
countLabel(4, 'টি পণ্য')   // '৪টি পণ্য'
countLabel(1, 'টি পণ্য')   // '১টি পণ্য'
```
Used by the category header (`৪টি পণ্যের আজকের দাম ও পরিবর্তন`) and the list line
(`মোট ৪টি পণ্য দেখানো হচ্ছে`). Counts are computed, never hardcoded to 33/8.

### `sort.ts` — challenge requirement C1
```ts
export function sortProducts(products: Product[], order: SortOrder): Product[]
```
```ts
'default'    → [...products]                                    // untouched, API order
'price-asc'  → [...].sort((a, b) => a.today - b.today)          // numeric, NOT string
'price-desc' → [...].sort((a, b) => b.today - a.today)
```
**Why numeric matters:** `'99' > '148'` as strings. With string sort, price-asc would put
মিনিকেট চাল (99) after ইলিশ (1850) and group every `9x`/`1xx` price wrongly. The `today` values
`30, 36, 38, 43, 44, 46, 54, 66, 74, 85, 92, 99, 102, 120, 125, 135, 142, 145, 148, 158, 168, 1850,
192, 215, 225, 245, 265, 285, 330, 790, 1290` are the test set — 1290 must sort above 790.
Never mutate the input array: always spread first (the props array is a cached shared reference).

### `date-bn.ts`
Bangla date string, `মঙ্গলবার, ৬ অক্টোবর, ২০২৬` — weekday, day, month, year, all Bangla digits.
Use `Intl.DateTimeFormat('bn-BD', {...})` with an **explicit `timeZone: 'Asia/Dhaka'`** so server
render and client render agree (a hydration mismatch here would be visible on every page). The value
is computed on the server and passed as a prop; the client never recomputes it.
The same string appears twice — in the navbar and in the hero eyebrow pill — so both receive it as a
prop from one server-side call rather than formatting twice.

---

## 7. Section selectors

```ts
getRisers(all)   // filter dir==='up'   → sort by pct desc → slice(0, 6)
getFallers(all)  // filter dir==='down' → sort by pct asc  → slice(0, 6)
```
`pct` is signed so `sort((a,b) => b.change.pct - a.change.pct)` naturally ranks the biggest riser
first (`peyaj` +12.5) and `sort((a,b) => a.change.pct - b.change.pct)` ranks the biggest faller
first (`kaccha-moric` −12.4). Flat items are excluded from both sections by the filter.

Both helpers run inside the page and are wrapped in `"use cache"` together with the fetch, so the
top-6 lists are prerendered into the shell.

---

## 8. Static assets & the emoji map

Images and vectors live in `public/`; emoji live in `src/data/emoji.json`.

| Path | Origin |
|---|---|
| `public/images/hero-basket.svg` | rebuilt from the design's `bazar-hero 1` vector group — 16 paths, 315×263 |
| `public/icons/google.svg` | design's `icon/Google` |
| `public/icons/chevron-down.svg` | design's `_deco/chevron` (sort trigger) |
| `public/icons/chevron-right.svg` | design's `icon/Breadcrumb Chevron` |
| `src/data/emoji.json` | 33 products + 8 categories snapshotted from the live API, plus UI glyphs and unit labels |

### `emoji.json` shape
```jsonc
{
  "categories": { "chal": { "nameBn": "চাল", "icon": "🍚" }, … },   // 8
  "products":   { "alu":  { "nameBn": "আলু", "category": "sobji",
                           "unit": "kg", "image": "🥔" }, … },     // 33
  "ui":       { "logo": "🛒", "user": "👤", "signOut": "↩",
                "search": "🔍", "sortChevron": "▾",
                "trendUp": "▲", "trendDown": "▼", "trendFlat": "—" },
  "unit":     { "kg":    { "long": "প্রতি কেজি",   "short": "কেজি" },
                "litre": { "long": "প্রতি লিটার",  "short": "লিটার" },
                "dozen": { "long": "প্রতি ডজন",    "short": "ডজন" },
                "piece": { "long": "প্রতি পিস",     "short": "পিস" } }
}
```

**Priority rule:** live API values win. `product.image`, `product.categoryNameBn` and
`category.icon` always come from the fetched response; `emoji.json` is the **offline fallback** used
when a fetch fails, and the single source for `ui` and `unit`, which the API does not provide at all.

`unit.long` is what the card and detail header show (`প্রতি কেজি`); the ticker uses the short form
appended to the price: `১৪৮ টাকা/কেজি`.

**23 distinct product emoji** are in use, several sharing one: 🫘 for all four ডাল, 🐠 for ইলিশ/কাতলা,
🍗/🥩/🍖/🦆 for the four মাংস. 10 are category icons only (🥬 🥛 …) and appear on the category header.
Decorative emoji are `aria-hidden`; the product name carries the accessible text.

Regenerate the file with `node scripts/build-emoji.mjs` after any API schema change.
