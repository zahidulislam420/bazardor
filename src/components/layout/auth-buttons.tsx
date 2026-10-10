'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authClient } from '@/lib/auth/auth-client'

export function AuthButtons() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Reactive, unlike a one-shot getSession() in an effect: the navbar lives in the root
  // layout, which does not remount on navigation, so it would otherwise keep showing the
  // logged-out state after a client-side sign-in.
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  async function handleSignOut() {
    const { error } = await authClient.signOut()
    if (error) {
      toast.error('সাইন আউট করা যায়নি')
      return
    }
    setOpen(false)
    toast.success('সাইন আউট হয়েছে')
    router.push('/')
    router.refresh()
  }

  if (isPending) {
    return <div aria-hidden="true" className="h-10 w-40 animate-pulse rounded-lg bg-base-200" />
  }

  if (!session?.user) {
    return (
      <nav aria-label="প্রবেশ" className="flex items-center gap-2">
        <Link
          href="/signin"
          className="rounded-lg border border-base-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-base-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          সাইন ইন
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-content transition-colors hover:bg-primary-strong focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          সাইন আপ
        </Link>
      </nav>
    )
  }

  const name = session.user.name ?? ''
  const email = session.user.email ?? ''
  const initial = (name || email).charAt(0).toUpperCase()

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-10 items-center gap-2 rounded-lg border border-base-300 px-2 pr-3 transition-colors hover:bg-base-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      >
        <span
          aria-hidden="true"
          className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-content"
        >
          {initial}
        </span>
        <span className="hidden max-w-[8rem] truncate text-sm font-medium sm:inline">
          {name || email}
        </span>
        <svg aria-hidden="true" viewBox="0 0 10 10" className={`size-2.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none">
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-1 w-64 overflow-hidden rounded-2xl border border-base-300 bg-white p-2.5 shadow-lg"
        >
          <div className="rounded-xl bg-base-200 px-3 py-2">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="truncate text-xs text-base-content/70">{email}</p>
          </div>

          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-base-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <span aria-hidden="true">👤</span>
            আমার প্রোফাইল
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-base-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <span aria-hidden="true">↩</span>
            সাইন আউট
          </button>
        </div>
      )}
    </div>
  )
}
