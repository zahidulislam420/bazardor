'use client'

import type { Product } from '@/lib/types'
import { tickerPrice } from '@/lib/utils/unit-label'
import { changeGlyph, formatChangePct } from '@/lib/utils/change'

const TONE = {
  up: 'text-success',
  down: 'text-error',
  flat: 'text-base-content/70',
} as const

function Track({ products, hidden }: { products: Product[]; hidden?: boolean }) {
  return (
    <ul className="flex shrink-0" aria-hidden={hidden || undefined}>
      {products.map((product) => (
        <li
          key={product.slug}
          className="flex shrink-0 items-center gap-1.5 px-4 text-sm whitespace-nowrap"
        >
          <span aria-hidden="true">{product.image}</span>
          <span>{product.nameBn}</span>
          <span>{tickerPrice(product.today, product.unit)}</span>
          <span className={TONE[product.change.dir]}>
            <span aria-hidden="true">{changeGlyph(product.change.dir)}</span>
            {formatChangePct(product.change.pct)}
          </span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Two identical tracks translated by -50% so the loop is seamless. The duplicate is
 * aria-hidden, and the animation stops under prefers-reduced-motion (see globals.css).
 */
export function PriceTicker({ products }: { products: Product[] }) {
  return (
    <div className="group overflow-hidden border-t border-base-300 bg-base-200 py-0.5">
      <div className="flex w-max animate-[ticker_40s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        <Track products={products} />
        <Track products={products} hidden />
      </div>
    </div>
  )
}
