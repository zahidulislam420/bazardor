import type { Product, SortOrder } from '@/lib/types'

/**
 * Sort by numeric value, never by string: '99' > '148' as strings, which would
 * misplace every 9x/1xx price. Always spreads — the input array is a cached shared reference.
 */
export function sortProducts(products: Product[], order: SortOrder): Product[] {
  switch (order) {
    case 'price-asc':
      return [...products].sort((a, b) => a.today - b.today)
    case 'price-desc':
      return [...products].sort((a, b) => b.today - a.today)
    default:
      return [...products]
  }
}
