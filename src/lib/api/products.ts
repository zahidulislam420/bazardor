import { cacheLife, cacheTag } from 'next/cache'
import type { Category, Product } from '@/lib/types'
import { getJSON } from './client'

/**
 * fetch is uncached by default under `cacheComponents`, so every remote read opts in explicitly.
 * All product selectors below read from this one cache entry — resolving a slug costs nothing
 * after the first request.
 */
export async function getAllProducts(): Promise<Product[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  return getJSON<Product[]>('/products')
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  const products = await getAllProducts()
  return products.find((p) => p.slug === slug) ?? null
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  const products = await getAllProducts()
  return products.filter((p) => p.category === category)
}

/** Top 6 risers. pct is signed, so descending order ranks the biggest rise first. */
export async function getRisers(limit = 6): Promise<Product[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  const products = await getAllProducts()
  return products
    .filter((p) => p.change.dir === 'up')
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, limit)
}

/** Top 6 fallers. pct is signed, so ascending order ranks the biggest fall first. */
export async function getFallers(limit = 6): Promise<Product[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  const products = await getAllProducts()
  return products
    .filter((p) => p.change.dir === 'down')
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, limit)
}

export async function getAllCategories(): Promise<Category[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('categories')
  return getJSON<Category[]>('/categories')
}
