import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getAllProducts, getProductBySlug } from '@/lib/api/products'
import { requireSession } from '@/lib/auth/session'
import { ProductDetail } from './components/product-detail'
import { ProductGridSkeleton } from '@/components/ui/skeleton'

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((product) => ({ slug: product.slug }))
}

/**
 * `params` is a promise; awaiting it in the page body would block the instant shell,
 * so it is passed down and resolved inside the Suspense boundary.
 */
async function DetailBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Second guard: proxy.ts only improves UX, it is not the security boundary.
  await requireSession(`/product/${slug}`)

  const product = await getProductBySlug(slug)
  if (!product) notFound()

  return <ProductDetail product={product} />
}

export default function ProductPage(props: PageProps<'/product/[slug]'>) {
  return (
    <main className="flex-1">
      <Suspense fallback={<DetailSkeleton />}>
        <DetailBody params={props.params} />
      </Suspense>
    </main>
  )
}

function DetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1152px] px-4 py-8">
      <ProductGridSkeleton count={3} />
    </div>
  )
}
