import type { ReactNode } from 'react'

/** Outer page column: 1152px, 16px gutters. */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto w-full max-w-[1152px] px-4 ${className}`}>{children}</div>
  )
}

/** Inner content column: 1120px inside the 1152px container. */
export function Content({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1120px] ${className}`}>{children}</div>
}
