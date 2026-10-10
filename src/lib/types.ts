export type ChangeDir = 'up' | 'down' | 'flat'

export interface Market {
  market: string
  division: string
  min: number
  max: number
}

export type Unit = 'kg' | 'litre' | 'dozen' | 'piece'

export interface Product {
  id: number
  slug: string
  nameBn: string
  category: string
  categoryNameBn: string
  categoryIcon: string
  unit: Unit
  image: string
  today: number
  yesterday: number
  lastWeek: number
  lastMonth: number
  change: { dir: ChangeDir; pct: number }
  markets: Market[]
}

export interface Category {
  id: string
  slug: string
  nameBn: string
  icon: string
}

export type SortOrder = 'default' | 'price-asc' | 'price-desc'
