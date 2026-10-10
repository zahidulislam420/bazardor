import type { Market, Product } from '@/lib/types'

/** Overall minimum across every market. */
export function minPrice(p: Product): number {
  return Math.min(...p.markets.map((m) => m.min))
}

/** Overall maximum across every market. */
export function maxPrice(p: Product): number {
  return Math.max(...p.markets.map((m) => m.max))
}

const mid = (m: Market) => (m.min + m.max) / 2

/** Rounded mean of the market midpoints — the summary tile's গড় দাম. */
export function avgPrice(p: Product): number {
  const mids = p.markets.map(mid)
  return Math.round(mids.reduce((a, b) => a + b, 0) / mids.length)
}

/** Per-market midpoint, rendered with two decimals: 65.5 → ৬৫.৫০ */
export function marketAverage(m: Market): number {
  return (m.min + m.max) / 2
}
