import Link from 'next/link'
import emoji from '@/data/emoji.json'

/**
 * 404-style empty state. Used by the category page for an unknown or empty slug
 * and by the global not-found page.
 */
export function EmptyState({
  title,
  description,
  icon = emoji.ui.emptyState,
  action = { label: 'হোম পেজে ফিরে যান', href: '/' },
}: {
  title: string
  description: string
  icon?: string
  action?: { label: string; href: string }
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-base-200 px-6 py-16 text-center">
      <span aria-hidden="true" className="text-6xl">
        {icon}
      </span>
      <h2 className="mt-4 text-xl font-bold">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-base-content/70">{description}</p>
      <Link
        href={action.href}
        className="mt-6 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-content transition-colors hover:bg-primary-strong focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {action.label}
      </Link>
    </div>
  )
}
