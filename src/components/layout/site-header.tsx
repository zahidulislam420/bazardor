import { getAllCategories, getAllProducts } from '@/lib/api/products'
import { Navbar } from './navbar'
import { CategoryNav } from './category-nav'
import { PriceTicker } from './price-ticker'
import { todayBn } from '@/lib/utils/date-bn'

/**
 * Shared shell for every route. The Bangla date is read once here and handed to both
 * the navbar and the hero, so the two can never disagree and no client component
 * recomputes it.
 */
export async function SiteHeader() {
  const [products, categories, date] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    todayBn(),
  ])

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      <Navbar date={date} />
      <CategoryNav categories={categories} />
      <PriceTicker products={products} />
    </header>
  )
}
