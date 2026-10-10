import { Suspense } from 'react'
import { getAllProducts } from '@/lib/api/products'
import { ProductGrid } from '@/components/product/product-grid'
import { ProductGridSkeleton } from '@/components/ui/skeleton'
import { countLabel } from '@/lib/utils/count-bn'

async function AllProducts() {
  const products = await getAllProducts()

  return (
    <section>
      <h2 id="সব-পণ্য" className="text-xl font-bold">
        সব পণ্য
      </h2>
      {/* Computed from the data, never hardcoded, so it stays correct if the API changes. */}
      <p className="mt-1 text-sm text-base-content/70">
        মোট {countLabel(products.length, 'টি পণ্য দেখানো হচ্ছে')}
      </p>
      <div className="mt-5">
        <ProductGrid products={products} />
      </div>
    </section>
  )
}

export function AllProductsSection() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={9} />}>
      <AllProducts />
    </Suspense>
  )
}
