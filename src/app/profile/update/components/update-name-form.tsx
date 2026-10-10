'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authClient } from '@/lib/auth/auth-client'
import { SubmitButton } from '@/components/ui/submit-button'

/**
 * Challenge C3 — update-user flow.
 * Better Auth exposes updateUser on the client; the session refresh afterwards makes
 * the navbar and profile pick up the new name without a full reload.
 */
export function UpdateNameForm({ initialName }: { initialName: string }) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmed = name.trim()
    if (!trimmed) {
      toast.error('নাম খালি রাখা যাবে না')
      return
    }

    setPending(true)
    try {
      const { error } = await authClient.updateUser({ name: trimmed })
      if (error) throw new Error(error.message ?? 'আপডেট করা যায়নি')
      toast.success('তথ্য আপডেট হয়েছে')
      router.push('/profile')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'আপডেট করা যায়নি')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          নাম
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="যেমন: রহিম উদ্দিন"
          autoComplete="name"
          required
          className="mt-2 h-10 w-full rounded-lg border border-base-300 bg-white px-3 text-sm outline-none transition-colors placeholder:text-base-content/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <SubmitButton isPending={pending}>তথ্য আপডেট করুন</SubmitButton>
    </form>
  )
}
