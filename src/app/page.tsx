import { Suspense } from 'react'
import { getAllCategories, getAllProducts } from '@/lib/api/products'
import { Navbar } from '@/components/layout/navbar'
import { CategoryNav } from '@/components/layout/category-nav'
import { PriceTicker } from '@/components/layout/price-ticker'
import { Footer } from '@/components/layout/footer'
import { Container, Content } from '@/components/ui/container'
import { Hero } from './components/hero'
import { PriceMovers } from './components/price-movers'
import { AllProductsSection } from './components/all-products'
import { todayBn } from '@/lib/utils/date-bn'

async function SiteHeader({ date }: { date: string }) {
  const [products, categories] = await Promise.all([getAllProducts(), getAllCategories()])

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      <Navbar date={date} />
      <CategoryNav categories={categories} />
      <PriceTicker products={products} />
    </header>
  )
}

async function PageContent({ date }: { date: string }) {
  return (
    <main className="flex-1 py-8">
      <Container>
        <Content className="space-y-12">
          <Hero date={date} />
          <PriceMovers />
          <AllProductsSection />
        </Content>
      </Container>
    </main>
  )
}

/**
 * The date is read once here and handed to both the navbar and the hero eyebrow, so the two
 * can never disagree and no client component has to recompute it.
 */
async function HomeContent() {
  const date = await todayBn()

  return (
    <>
      <SiteHeader date={date} />
      <PageContent date={date} />
    </>
  )
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <HomeContent />
      </Suspense>

      <Footer />
    </>
  )
}
