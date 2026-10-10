import Link from 'next/link'
import type { Product } from '@/lib/types'
import { formatTaka } from '@/lib/utils/format-price'
import { unitLabel } from '@/lib/utils/unit-label'
import { ChangeBadge } from './change-badge'

/**
 * 363×138 card at 1440px, per the design: emoji tile 48×48 rounded-xl, name 16/600,
 * unit 12/400, then the price row with the badge on the right.
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-2xl border border-base-300 bg-white p-4 transition hover:border-primary hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-base-200 text-2xl"
        >
          {product.image}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{product.nameBn}</h3>
          <p className="text-xs text-base-content/70">{unitLabel(product.unit)}</p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-base-content/70">আজকের দাম</p>
          <p className="text-xl font-bold tabular-nums">{formatTaka(product.today)}</p>
        </div>
        <ChangeBadge dir={product.change.dir} pct={product.change.pct} />
      </div>
    </Link>
  )
}
