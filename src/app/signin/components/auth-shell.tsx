import type { ReactNode } from 'react'
import Link from 'next/link'

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode
  title: string
  subtitle: string
}) {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-[448px]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-base-content/70">{subtitle}</p>
        </div>

        <div className="rounded-2xl border border-base-300 bg-white p-6">{children}</div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-link-primary hover:underline">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  )
}
