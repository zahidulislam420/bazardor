import Link from 'next/link'
import type { Product } from '@/lib/types'
import { Container, Content } from '@/components/ui/container'
import { formatTaka, formatPrice } from '@/lib/utils/format-price'
import { unitLabel, unitWithTaka } from '@/lib/utils/unit-label'
import { changeSentenceBn } from '@/lib/utils/change'
import { avgPrice, marketAverage, maxPrice, minPrice } from '@/lib/utils/stats'
import { toBanglaDecimal } from '@/lib/utils/bengali-numeral'
import { ChangeBadge } from '@/components/product/change-badge'

export function Breadcrumbs({ product }: { product: Product }) {
  return (
    <nav aria-label="ব্রেডক্রাম্ব" className="py-2">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link href="/" className="hover:text-link-primary hover:underline">
            হোম
          </Link>
        </li>
        {[
          { label: product.categoryNameBn, href: `/category/${product.category}` },
          { label: product.nameBn, href: null },
        ].map((crumb) => (
          <li key={crumb.label} className="flex items-center gap-2">
            <svg aria-hidden="true" viewBox="0 0 6 8" className="size-1.5 fill-none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1L5 4L1 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-link-primary hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium" aria-current="page">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function ProductHeader({ product }: { product: Product }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-base-200 text-4xl"
        >
          {product.image}
        </span>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{product.nameBn}</h1>
          <p className="mt-1 text-sm text-base-content/70">
            {unitLabel(product.unit)} · {product.categoryNameBn}
          </p>
          <p className="mt-2 text-sm">
            {changeSentenceBn(product.change.dir, product.today - product.yesterday, formatPrice)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-start gap-1 rounded-2xl bg-base-200 p-4 sm:items-center">
        <span className="text-sm text-base-content/70">আজকের দাম</span>
        <span className="text-3xl font-bold tabular-nums">{formatPrice(product.today)}</span>
        <span className="text-sm">{unitWithTaka(product.unit)}</span>
        <ChangeBadge dir={product.change.dir} pct={product.change.pct} className="mt-1 text-sm" />
      </div>
    </div>
  )
}

function StatTile({
  label,
  value,
  caption,
  tone = 'text-base-content',
}: {
  label: string
  value: string
  caption: string
  tone?: string
}) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-200 px-6 py-4">
      <p className="text-sm font-bold">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${tone}`}>{value}</p>
      <p className="mt-1 text-xs text-base-content/70">{caption}</p>
    </div>
  )
}

export function PriceSummary({ product }: { product: Product }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-white p-5">
      <h2 className="text-lg font-bold">দামের সারসংক্ষেপ</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {/* The design codes the extremes so they scan at a glance: the worst price a
            buyer can meet reads red, the best reads green. Same up=red rule as the
            change badges, so a rise never looks like a bargain. */}
        <StatTile
          label="সর্বনিম্ন দাম"
          value={formatTaka(minPrice(product))}
          caption="সবচেয়ে কম দামের বাজার"
          tone="text-success"
        />
        <StatTile
          label="সর্বাধিক দাম"
          value={formatTaka(maxPrice(product))}
          caption="সবচেয়ে বেশি দামের বাজার"
          tone="text-error"
        />
        <StatTile
          label="গড় দাম"
          value={formatTaka(avgPrice(product))}
          caption={`${unitLabel(product.unit)}-এর হিসাবে`}
          tone="text-success"
        />
      </div>
    </div>
  )
}

export function MarketTable({ product }: { product: Product }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-white p-5">
      <h2 className="text-lg font-bold">বাজারভিত্তিক আজকের দাম</h2>

      {/* Table on wide screens; stacked cards below sm, where 5 columns is unreadable. */}
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-base-300 text-left font-bold">
              <th scope="col" className="px-4 py-3">বাজার</th>
              <th scope="col" className="px-4 py-3">বিভাগ</th>
              <th scope="col" className="px-4 py-3">সর্বনিম্ন</th>
              <th scope="col" className="px-4 py-3">সর্বাধিক</th>
              <th scope="col" className="px-4 py-3">গড়</th>
            </tr>
          </thead>
          <tbody>
            {product.markets.map((market) => (
              <tr key={market.market} className="border-b border-base-300 last:border-0">
                <td className="px-4 py-3 font-medium">{market.market}</td>
                <td className="px-4 py-3 text-base-content/70">{market.division}</td>
                <td className="px-4 py-3 tabular-nums">{formatTaka(market.min)}</td>
                <td className="px-4 py-3 tabular-nums">{formatTaka(market.max)}</td>
                <td className="px-4 py-3 tabular-nums">{formatTaka(marketAverage(market))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-4 space-y-3 md:hidden">
        {product.markets.map((market) => (
          <li key={market.market} className="rounded-xl border border-base-300 p-4">
            <p className="font-medium">{market.market}</p>
            <p className="text-xs text-base-content/70">{market.division}</p>
            <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div>
                <dt className="text-[11px] text-base-content/60">সর্বনিম্ন</dt>
                <dd className="text-sm font-semibold tabular-nums">{formatTaka(market.min)}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-base-content/60">সর্বাধিক</dt>
                <dd className="text-sm font-semibold tabular-nums">{formatTaka(market.max)}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-base-content/60">গড়</dt>
                <dd className="text-sm font-semibold tabular-nums">
                  {toBanglaDecimal(marketAverage(market))} টাকা
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ProductDetail({ product }: { product: Product }) {
  return (
    <Container>
      <Content className="space-y-6 py-8">
        <Breadcrumbs product={product} />
        <ProductHeader product={product} />
        <PriceSummary product={product} />
        <MarketTable product={product} />
      </Content>
    </Container>
  )
}
