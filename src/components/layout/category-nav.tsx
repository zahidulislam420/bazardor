'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Category } from '@/lib/types'

/**
 * Active chip = primary fill (per the design), inactive = base-200.
 * A client component because the active state depends on the current pathname.
 */
export function CategoryNav({ categories }: { categories: Category[] }) {
  const pathname = usePathname()

  return (
    <nav aria-label="ক্যাটাগরি" className="border-t border-base-300 bg-white">
      <div className="mx-auto w-full max-w-[1152px] px-4">
        <ul className="flex items-center gap-1 overflow-x-auto py-2 whitespace-nowrap">
          {categories.map((category) => {
            const href = `/category/${category.slug}`
            const isActive = pathname === href

            return (
              <li key={category.slug}>
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={
                    isActive
                      ? 'flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-sm text-primary-content focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none'
                      : 'flex items-center gap-1.5 rounded-lg bg-base-200 px-3 py-1 text-sm transition-colors hover:bg-primary hover:text-primary-content focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none'
                  }
                >
                  <span aria-hidden="true">{category.icon}</span>
                  {category.nameBn}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
