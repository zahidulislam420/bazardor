# 01 — Architecture

## 1. Hard DRY rules

1. **A component may live in `app/<page>/components/` only if exactly one page uses it.**
   The moment a second page needs it, it moves to `src/components/` and the page folder deletes it.
2. **`app/` never imports from another page's `components/` folder.** Cross-page reuse must go
   through `src/components/`. (Exception: a component in `src/components/` may import a page-local one
   only during a documented migration — avoid it entirely.)
3. **No formatting logic inside a component.** No `toLocaleString('bn-BD')`, no `.toFixed()`, no
   `Math.abs()` in JSX. Every number/date/unit goes through `src/lib/utils/*`.
4. **No `fetch` in a component or a client component.** All network access lives in
   `src/lib/api/*` and is consumed as server props.
5. **Server by default.** `"use client"` is added to the smallest possible leaf. A client component
   never imports the server `auth` instance.

---

## 2. Folder tree

```
rtl/
├── docs/                                  # these 7 specs
├── public/
│   ├── images/hero-basket.svg            # rebuilt from the design vector group
│   ├── icons/{google,chevron-down,chevron-right}.svg
│   ├── Bazardor _ Assignment-07.fig      # source design (ZIP)
│   └── Bazardor -Assignment-07.penpot    # source design (ZIP, has tokens.json)
└── src/
    ├── proxy.ts                          # Next 16 middleware — coarse auth redirect
    ├── data/
    │   └── emoji.json                     # 33 product + 8 category + UI + unit emoji
    ├── app/
    │   ├── layout.tsx                     # fonts, Toaster, Navbar + Ticker + Footer shell
    │   ├── globals.css                    # Tailwind v4 @theme tokens
    │   ├── not-found.tsx                  # global 404
    │   ├── page.tsx                       # home
    │   ├── components/                    # home-only: hero.tsx, risers.tsx, fallers.tsx,
    │   │                                  #   all-products.tsx
    │   ├── loading.tsx                    # home fallback
    │   ├── product/[slug]/
    │   │   ├── page.tsx
    │   │   └── components/                # breadcrumbs, product-header, price-summary,
    │   │                                  #   market-table
    │   ├── category/[slug]/
    │   │   ├── page.tsx
    │   │   └── components/                # category-header, sort-select, product-list
    │   ├── signin/
    │   │   ├── page.tsx
    │   │   └── components/auth-form.tsx   # reused by signup via props
    │   ├── signup/page.tsx                # ← thin wrapper, no own components folder
    │   ├── profile/
    │   │   ├── page.tsx
    │   │   ├── update/page.tsx
    │   │   └── components/                # profile-header, info-panel, update-name-form
    │   └── api/auth/[...all]/route.ts     # toNextJsHandler(auth)
    ├── components/                        # SHARED — used by 2+ routes
    │   ├── layout/
    │   │   ├── navbar.tsx                 # client — session + user menu
    │   │   ├── category-nav.tsx           # chips; only the active check is client
    │   │   ├── user-menu.tsx              # client — dropdown from the design's artboard
    │   │   ├── price-ticker.tsx           # client — marquee
    │   │   ├── auth-buttons.tsx           # client — signin/signup ↔ profile/logout
    │   │   └── footer.tsx                 # server
    │   ├── product/
    │   │   ├── product-card.tsx           # server — 363×138 card from the design
    │   │   ├── product-grid.tsx           # server — responsive grid wrapper
    │   │   └── change-badge.tsx           # server — ▲/▼/— + colour
    │   ├── ui/
    │   │   ├── container.tsx              # 1152 px outer / 1120 px inner
    │   │   ├── skeleton.tsx               # generic + product-grid-skeleton
    │   │   ├── empty-state.tsx            # 🧺 + CTA
    │   │   ├── submit-button.tsx          # client — pending state
    │   │   ├── social-buttons.tsx         # client — Google / GitHub
    │   │   ├── select.tsx                 # client — chevron dropdown (sort, C1)
    │   │   └── toaster.tsx                # client — react-hot-toast mount
    │   └── icons/                         # chevron, google — inline SVG components
    └── lib/
        ├── api/
        │   ├── client.ts                  # BASE_URL fallback + getJSON
        │   ├── products.ts                # 'use cache' getAllProducts / getProductBySlug /
        │   │                              #   getProductsByCategory / getRisers / getFallers
        │   └── categories.ts              # 'use cache' getAllCategories
        ├── auth/
        │   ├── auth.ts                    # server betterAuth instance
        │   ├── auth-client.ts             # createAuthClient (React)
        │   ├── session.ts                 # getSession, requireSession
        │   └── db.ts                      # libsql client (Turso | local file)
        ├── data.ts                        # emoji.json typed accessors
        ├── types.ts                       # Product, Category, Market, Unit, SortOrder
        └── utils/
            ├── bengali-numeral.ts         # toBanglaDigits + toBanglaNumber (Indian grouping)
            ├── format-price.ts            # formatPrice / formatTaka
            ├── unit-label.ts              # long / short / ticker labels
            ├── change.ts                  # changeGlyph, changeTone, formatChangePct
            ├── sort.ts                    # sortProducts (numeric, not string)
            ├── stats.ts                   # minPrice/maxPrice/avgPrice/marketAverage
            ├── count-bn.ts                # ৪টি পণ্য — Bangla pluralisation
            └── date-bn.ts                 # Bangla date, fixed Asia/Dhaka timezone
```

---

## 3. Data flow

```
API ──fetch──▶ lib/api/client.ts ──▶ lib/api/products.ts  ("use cache" + cacheLife("hours"))
                                             │
                    ┌────────────────────────┼─────────────────────────┐
                    ▼                        ▼                         ▼
        app/page.tsx (server)      app/category/[slug]        app/product/[slug]
        → hero (static)           → category-hero (static)    → auth.api.getSession (cookies)
        → <Suspense>              → <Suspense>                → redirect → /signin?redirect=
            <Risers/>                  <ProductList/>               <Suspense>
            <Fallers/>                    (client sort)               <ProductSummary/>
            <AllProducts/>                                               <PriceStats/>
                                                                     <MarketTable/>
                    │                        │                         │
                    └──── server components render cards as props ──────┘
                                             │
                                    components/product/product-card.tsx
                                    (pure, no client JS)
```

**Why cards stay server components:** the card is pure markup + a `<Link>`. Only the interactive
pieces (navbar session, ticker animation, sort dropdown, forms) become client components. This keeps
the home page's JS bundle small and lets the grid live inside the static shell.

---

## 4. Component inventory & boundaries

| Component | Kind | Why it is where it is |
|---|---|---|
| `navbar`, `category-nav`, `user-menu`, `price-ticker`, `footer` | `layout/` | Every route renders them from the root layout |
| `product-card`, `product-grid`, `change-badge` | `product/` | Used by home + category + (badge) detail |
| `container`, `skeleton`, `empty-state`, `submit-button`, `social-buttons`, `select`, `toaster` | `ui/` | Cross-cutting primitives |
| `auth-form` | `signin/components/` | Lives with its first consumer. `/signup` imports it **relatively** (`../signin/components/auth-form`) — allowed because it is the *same* shared form, not a second implementation. If a third page needs it, promote it to `components/ui/`. |
| `hero`, `risers`, `fallers`, `all-products` | `home/components/` | Home-only |
| `breadcrumbs`, `product-header`, `price-summary`, `market-table` | `product/[slug]/components/` | Detail-only |
| `category-header`, `sort-select`, `product-list` | `category/[slug]/components/` | Category-only |
| `profile-header`, `info-panel`, `update-name-form` | `profile/components/` | Profile-only |

---

## 5. Server / client boundary rules

- `"use client"` files are leaves. They receive serializable props only.
- `src/lib/auth/auth.ts` (server) **must never** be imported by a client component → the split is
  `auth.ts` / `auth-client.ts`.
- `useSearchParams()` → only inside `<Suspense>` (`signin` reads `?redirect=`, profile reads none).
- `reactCompiler: true` is enabled: no manual `useMemo`/`useCallback` for cheap derivations.

---

## 6. Error, loading and empty strategy

| Situation | Where handled | Behaviour |
|---|---|---|
| API unreachable | `lib/api/client.ts` throws → nearest `error.tsx` | Fallback base URL is tried first; if both fail the error boundary renders a Bangla retry card |
| Data loading | `<Suspense fallback={<ProductGridSkeleton/>}>` | Home, category, detail |
| Unknown slug | `notFound()` in the page | Global `app/not-found.tsx` with "হোম পেজে ফিরে যান" |
| Empty category | `components/ui/empty-state.tsx` | 404-style illustration + CTA |
| Unauthenticated on `/product/*` | `proxy.ts` + server check in the page | Redirect to `/signin?redirect=<path>` + toast |

`error.tsx` files are added only where a fetch can realistically fail (`/product/[slug]`).
Home and category use a cached fetch that falls back to the mirror URL, so a total failure is rare —
but the boundary still exists.
