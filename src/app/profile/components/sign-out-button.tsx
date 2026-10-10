'use client'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authClient } from '@/lib/auth/auth-client'

export function SignOutButton() {
  const router = useRouter()

  async function handleClick() {
    const { error } = await authClient.signOut()
    if (error) {
      toast.error('সাইন আউট করা যায়নি')
      return
    }
    toast.success('সাইন আউট হয়েছে')
    router.push('/')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-base-300 bg-white px-4 text-sm font-semibold transition-colors hover:bg-base-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
    >
      <span aria-hidden="true">↩</span>
      সাইন আউট
    </button>
  )
}
