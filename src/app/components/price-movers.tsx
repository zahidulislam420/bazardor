import { Suspense } from 'react'
import { getFallers, getRisers } from '@/lib/api/products'
import { ProductGrid } from '@/components/product/product-grid'
import { ProductGridSkeleton } from '@/components/ui/skeleton'

function Section({
  title,
  glyph,
  tone,
  children,
}: {
  title: string
  glyph: string
  tone: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-xl font-bold">
        <span aria-hidden="true" className={tone}>
          {glyph}
        </span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

async function Risers() {
  return (
    <Section title="আজ দাম বেড়েছে" glyph="▲" tone="text-error">
      <ProductGrid products={await getRisers()} />
    </Section>
  )
}

async function Fallers() {
  return (
    <Section title="আজ দাম কমেছে" glyph="▼" tone="text-success">
      <ProductGrid products={await getFallers()} />
    </Section>
  )
}

export function PriceMovers() {
  return (
    <div className="space-y-10">
      <Suspense fallback={<ProductGridSkeleton count={6} />}>
        <Risers />
      </Suspense>
      <Suspense fallback={<ProductGridSkeleton count={6} />}>
        <Fallers />
      </Suspense>
    </div>
  )
}
