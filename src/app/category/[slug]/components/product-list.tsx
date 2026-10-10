'use client'

import { useState } from 'react'
import type { Product, SortOrder } from '@/lib/types'
import { sortProducts } from '@/lib/utils/sort'
import { countLabel } from '@/lib/utils/count-bn'
import { ProductGrid } from '@/components/product/product-grid'
import { Select, type Option } from '@/components/ui/select'
import { Container, Content } from '@/components/ui/container'

const SORT_OPTIONS: Option<SortOrder>[] = [
  { value: 'default', label: 'ডিফল্ট' },
  { value: 'price-asc', label: 'দাম: কম থেকে বেশি' },
  { value: 'price-desc', label: 'দাম: বেশি থেকে কম' },
]

export function ProductList({ products }: { products: Product[] }) {
  const [order, setOrder] = useState<SortOrder>('default')

  // Numeric, never string: '99' > '148' as strings, which would misplace every 9x/1xx price.
  const sorted = sortProducts(products, order)

  return (
    <Container>
      <Content>
        <div className="mt-6">
          <div className="flex flex-col gap-3 rounded-2xl border border-base-300 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium">সাজান</span>
            <Select
              label="সাজান"
              value={order}
              options={SORT_OPTIONS}
              onChange={setOrder}
            />
          </div>

          <p aria-live="polite" className="mt-4 text-sm text-base-content/70">
            মোট {countLabel(sorted.length, 'টি পণ্য দেখানো হচ্ছে')}
          </p>

          <div className="mt-4">
            <ProductGrid products={sorted} />
          </div>
        </div>
      </Content>
    </Container>
  )
}
