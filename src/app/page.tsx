import { Suspense } from 'react'
import { Container, Content } from '@/components/ui/container'
import { Hero } from './components/hero'
import { PriceMovers } from './components/price-movers'
import { AllProductsSection } from './components/all-products'

export default function HomePage() {
  return (
    <main className="flex-1 py-8">
      <Container>
        <Content className="space-y-12">
          <Suspense fallback={null}>
            <Hero />
          </Suspense>
          <Suspense fallback={null}>
            <PriceMovers />
          </Suspense>
          <AllProductsSection />
        </Content>
      </Container>
    </main>
  )
}
