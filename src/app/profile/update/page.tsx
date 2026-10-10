import Link from 'next/link'
import { Suspense } from 'react'
import { requireSession } from '@/lib/auth/session'
import { UpdateNameForm } from './components/update-name-form'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = { title: 'তথ্য আপডেট করুন — বাজার দর' }

/** Reading the session touches cookies, so it must sit inside a Suspense boundary. */
async function UpdateContent() {
  const session = await requireSession('/profile/update')

  return (
    <div className="w-full max-w-[448px]">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">তথ্য আপডেট করুন</h1>
        <p className="mt-2 text-sm text-base-content/70">
          আপনার নাম পরিবর্তন করে তথ্য আপডেট করুন।
        </p>
      </div>

      <div className="rounded-2xl border border-base-300 bg-white p-6">
        <UpdateNameForm initialName={session.user.name ?? ''} />
      </div>

      <div className="mt-6 text-center">
        <Link href="/profile" className="text-sm text-link-primary hover:underline">
          ← প্রোফাইলে ফিরে যান
        </Link>
      </div>
    </div>
  )
}

export default function UpdateProfilePage() {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-12">
      <Suspense fallback={<Skeleton className="h-72 w-full max-w-[448px] rounded-2xl" />}>
        <UpdateContent />
      </Suspense>
    </main>
  )
}
