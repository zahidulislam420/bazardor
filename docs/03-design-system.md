# 03 — Design system

Source of truth: `public/Bazardor -Assignment-07.penpot` (Penpot export of the Figma file).
Every value below was extracted from that file, not guessed. Tailwind v4 only — no DaisyUI/HeroUI.

**Extracted facts**
- Design tokens live in the Penpot export at `tokens.json` → `Bazardor/Color/Light`
- Typeface is **Hind Siliguri** (`fontId: gfont-hind-siliguri`). SF Pro / Inter appear only for
  emoji runs and a couple of Latin glyphs — do **not** load them.
- 7 artboards, 1440 px wide: `Home` (3141 tall), `Product Details` (1489), `Sign Up` (1014),
  `Profile` (1047), `Category` (892), `Sign In` (900), `Home - User Menu Open` (900)

---

## 1. Colour tokens (verbatim from the Penpot file)

| Token | Value | Use |
|---|---|---|
| `primary` | `rgb(5, 137, 62)` → `#05893e` | primary buttons, eyebrow pill text |
| `primary.strong` | `rgb(4, 127, 57)` → `#047f39` | primary hover |
| `primary-content` | `rgb(243, 251, 244)` → `#f3fbf4` | text on primary |
| `hover.primary-border` | `rgb(3, 115, 51)` → `#037333` | button border hover |
| `link-primary` | `rgb(2, 100, 43)` → `#02642b` | inline links |
| `success` | `rgb(26, 153, 81)` → `#1a9951` | price **up**, green badge text |
| `error` | `rgb(208, 55, 57)` → `#d03739` | price **down**, red badge text |
| `error-bg` / `error-content` | `#bd3133` / `#fff6f5` | error surfaces |
| `base-100` | `rgb(250, 252, 250)` → `#fafcfa` | page background |
| `base-200` | `rgb(240, 245, 240)` → `#f0f5f0` | card / muted surface |
| `base-300` | `rgb(225, 232, 225)` → `#e1e8e1` | borders, skeletons |
| `base-content` | `rgb(29, 39, 31)` → `#1d271f` | **primary text colour** |
| `white` | `#ffffff` | cards |
| `hover.neutral-bg` | `#dadeda` | hover on neutral |
| `hover.neutral-border` | `#ccd0cc` | neutral borders |

```css
@theme {
  --color-primary: #05893e;
  --color-primary-strong: #047f39;
  --color-primary-content: #f3fbf4;
  --color-success: #1a9951;
  --color-error: #d03739;
  --color-base-100: #fafcfa;
  --color-base-200: #f0f5f0;
  --color-base-300: #e1e8e1;
  --color-base-content: #1d271f;
}
```

There is **no** muted/secondary ink token in the design. All body copy is `#1d271f` at weight
400/500. Do not invent a grey text colour — the design does not use one.

---

## 2. Typography scale (Hind Siliguri)

Sizes below are the exact values present in the artboards.

| Role | Size / weight | Colour |
|---|---|---|
| Page title (sign in/up, profile) | 24 / 700 | `#1d271f` |
| Product detail title, today price | 30 / 700 | `#1d271f` |
| Section heading (দামের সারসংক্ষেপ, সব পণ্য, আজ দাম বেড়েছে) | 18–20 / 700 | `#1d271f` |
| Hero headline | 28 / 700 | `#1d271f` |
| Product card name | 16 / 600 | `#1d271f` |
| Product card price | 20 / 700 | `#1d271f` |
| Card unit, card label, ticker item | 12–14 / 400 | `#1d271f` |
| Badge percentage | 12 / 600 | up `#1a9951` · down `#d03739` · flat `#1d271f` |
| Card stat value (min/max/avg) | 24 / 700 | `#1d271f` |
| Card stat caption | 12 / 400 | `#1d271f` |
| Form label | 14 / 500 | `#1d271f` |
| Button label | 14 / 600 | on primary `#f3fbf4` |
| Eyebrow pill text | 14 / 500 | `#05893e` |

```ts
import { Hind_Siliguri } from 'next/font/google'
const bangla = Hind_Siliguri({ subsets: ['bengali'], weight: ['400','500','600','700'], variable: '--font-bangla', display: 'swap' })
```
`--font-bangla` is bound to `--font-sans` in `@theme`. Remove the scaffold's Geist fonts.

---

## 3. Measured layout (1440 px artboard)

Page shell, from the `Main → Stack` chain:

| Element | Value |
|---|---|
| outer container | centred, **1152 px** wide (`Stack` at x=144 within a 1440 frame), side padding 16 |
| inner content | **1120 px** wide (x=160) |
| header | 1164 wide at x=138; row 1 = 68 px tall, row 2 (nav) = 49 px, ticker = 37 px |
| nav chip | 32 px tall, `rounded-lg`, padding `4px 13px`, gap 6, inner list gap 4 |
| ticker item | 36 px tall, padding `8px 17px`, gap 6 |
| hero | `rounded-3xl` (24), content padding **40 px**, height ≈ 283 |
| section spacing | 24 px vertical padding on the page stack; section gap ≈ 34 |
| product grid | 3 columns at 1440 → card **363 × 138**, gap **16**, `rounded-2xl` (16), border 1 |
| category page | card grid same 3-column layout |
| product detail | header card `rounded-2xl`, price panel 118 × 132 `rounded-2xl` |
| footer | 69 px tall, row padding `24px 16px` |
| auth pages | centred column **448 px** wide, card `rounded-2xl`, body padding 24 |

### Product card anatomy (exact)

```
Product Card  363x138  r16  border
  Card Body   padding 16
    Row (gap 12)
      Stack 48x48  r12   ← emoji 24px, muted surface
      Stack           ← nameBn 16/600
                       unit 12/400
    Row (gap 12, bottom)
      Stack           ← "আজকের দাম" 12/400
                       "১৪৮ টাকা" 20/700
      Price Change Badge  24 tall, r12, padding 4px 8px, gap 4
                       ← "▲" 16px + "২.১%" 12/600
```

The badge sits on the **right** of the price row, not under it.

---

## 4. Components (hand-rolled, matching the artboards)

- **`change-badge.tsx`** — 24 px tall, `rounded-xl`, `px-2 py-1`, gap 1, `▲/▼/—` at 16 px + pct at
  12 px/600. up → `text-success`, down → `text-error`, flat → `text-base-content`. No background fill.
- **`product-card.tsx`** — 3-column grid at `lg`, 2 at `sm`, 1 at base. Hover: `border-primary` +
  subtle lift. Whole card is one `<Link>`.
- **`price-ticker.tsx`** — two identical tracks, `-50%` loop, `aria-hidden` on the duplicate,
  pause on hover, disabled under `prefers-reduced-motion`. Item = emoji · name · `১৪৮ টাকা/কেজি` ·
  `▲ ২.১%`.
- **`category-chip.tsx`** — 32 px, `rounded-lg`, emoji + `nameBn`, active = `bg-primary` +
  `text-primary-content`; inactive = `bg-base-200 text-base-content`.
- **`skeleton.tsx`** — `animate-pulse rounded-lg bg-base-300`. `ProductGridSkeleton` mirrors the
  363×138 card box so nothing shifts on hydrate.
- **`empty-state.tsx`** — centred, `rounded-2xl bg-base-200`, 🧺, title, muted line, CTA.
- **`submit-button.tsx`** — 40 px tall, `rounded-lg`, full width in forms, spinner while pending.
- **`social-buttons.tsx`** — two side-by-side outline buttons, `public/icons/google.svg` inline.
- **`select.tsx`** — 32 px trigger, `rounded-lg`, `bg-base-200`, chevron `public/icons/chevron-down.svg`,
  rotates 180° when open.

---

## 5. Responsive contract

The artboards are 1440 px only, so breakpoints below follow the assignment requirement and the
measured ratios (1152 / 1120).

| Breakpoint | Container | Navbar | Hero | Grid |
|---|---|---|---|---|
| base | px-4 | row 1 stacks, chips scroll-x | stacked, image below | 1 col |
| `sm` | px-6 | chips scroll-x | stacked | 2 cols |
| `md` | px-6 | single row | 2 col, image right | 3 cols |
| `lg` | max-w-[1120px] | full | 2 col | 3 cols |

Rules: no horizontal scroll at 360 px · touch targets ≥ 40 px (design's own button height) ·
market table becomes stacked cards below `sm` · ticker never wraps.

---

## 6. Accessibility

`<html lang="bn">` · one `<h1>` per page · decorative emoji `aria-hidden` · `focus-visible:ring-2
ring-primary` everywhere · colour never the only signal (▲/▼/— carry meaning) ·
`prefers-reduced-motion` honoured on ticker and hover lift.

---

## 7. Assets shipped

| File | Origin |
|---|---|
| `public/images/hero-basket.svg` | rebuilt from the `bazar-hero 1` vector group (16 paths, 315×263) |
| `public/icons/google.svg` | from the design's `icon/Google` |
| `public/icons/chevron-down.svg` | from `_deco/chevron` (sort trigger) |
| `public/icons/chevron-right.svg` | from `icon/Breadcrumb Chevron` |
| `src/data/emoji.json` | all 33 product + 8 category emoji snapshotted from the live API, plus UI glyphs |
