'use client'

export function SubmitButton({
  isPending,
  children,
  variant = 'primary',
  className = '',
}: {
  isPending: boolean
  children: React.ReactNode
  variant?: 'primary' | 'outline'
  className?: string
}) {
  const base =
    'inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60'

  const styles =
    variant === 'primary'
      ? 'bg-primary text-primary-content hover:bg-primary-strong'
      : 'border border-base-300 bg-white text-base-content hover:bg-base-200'

  return (
    <button type="submit" disabled={isPending} aria-busy={isPending} className={`${base} ${styles} ${className}`}>
      {isPending && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current"
        />
      )}
      {isPending ? 'অপেক্ষা করুন…' : children}
    </button>
  )
}
