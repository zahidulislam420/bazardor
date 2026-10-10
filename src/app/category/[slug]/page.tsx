import { Suspense } from 'react'
import {
  getAllCategories,
  getProductsByCategory,
} from '@/lib/api/products'
import { CategoryHeader } from './components/category-header'
import { ProductList } from './components/product-list'
import { EmptyState } from '@/components/ui/empty-state'
import { ProductGridSkeleton } from '@/components/ui/skeleton'
import { Container, Content } from '@/components/ui/container'

async function getCategory(slug: string) {
  const categories = await getAllCategories()
  return categories.find((c) => c.slug === slug) ?? null
}

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((category) => ({ slug: category.slug }))
}

async function CategoryBody({ slug }: { slug: string }) {
  const category = await getCategory(slug)

  if (!category) {
    return (
      <Container>
        <Content>
          <div className="py-12">
            <EmptyState
              title="এই ক্যাটাগরি পাওয়া যায়নি"
              description="যে ক্যাটাগরিটি আপনি খুঁজছেন সেটি সম্ভবত সরানো হয়েছে বা নামটি ভুল হয়েছে।"
            />
          </div>
        </Content>
      </Container>
    )
  }

  const products = await getProductsByCategory(slug)

  return (
    <>
      <div className="pt-8">
        <CategoryHeader category={category} count={products.length} />
      </div>

      {products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <Container>
          <Content>
            <div className="mt-6">
              <EmptyState
                title="এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি"
                description="এই মুহূর্তে এই ক্যাটাগরিতে কোনো পণ্য তালিকাভুক্ত নেই।"
              />
            </div>
          </Content>
        </Container>
      )}
    </>
  )
}

export default async function CategoryPage(props: PageProps<'/category/[slug]'>) {
  const { slug } = await props.params

  return (
    <main className="flex-1">
      <Suspense fallback={<CategorySkeleton />}>
        <CategoryBody slug={slug} />
      </Suspense>
    </main>
  )
}

function CategorySkeleton() {
  return (
    <Container>
      <Content>
        <div className="flex items-center gap-3 rounded-2xl border border-base-300 bg-white p-5">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-base-300" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-24 animate-pulse rounded-lg bg-base-300" />
            <div className="h-3 w-48 animate-pulse rounded-lg bg-base-300" />
          </div>
        </div>
        <div className="mt-6">
          <ProductGridSkeleton count={4} />
        </div>
      </Content>
    </Container>
  )
}
