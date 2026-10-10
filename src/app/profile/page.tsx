import Link from 'next/link'
import { Suspense } from 'react'
import { Container, Content } from '@/components/ui/container'
import { SignOutButton } from './components/sign-out-button'
import { requireSession } from '@/lib/auth/session'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = { title: 'আমার প্রোফাইল — বাজার দর' }

/**
 * Reading the session touches cookies, which is uncached data — it has to happen inside
 * a Suspense boundary or the route cannot be prerendered and the navigation stalls.
 */
async function ProfileContent() {
  const session = await requireSession('/profile')
  const user = session.user

  return (
    <Content className="max-w-[768px]">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
        <p className="mt-2 text-sm text-base-content/70">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-base-300 bg-white p-6">
        <span
          aria-hidden="true"
          className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-base-200 text-2xl font-bold"
        >
          {(user.name ?? '?').charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xl">{user.name}</p>
          <p className="truncate text-base-content/70">{user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-6 rounded-2xl border border-base-300 bg-white p-5">
        <h2 className="text-lg font-bold">তথ্য</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-base-content/70">ইমেইল</dt>
            <dd className="truncate">{user.email}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-base-content/70">নাম</dt>
            <dd className="truncate">{user.name}</dd>
          </div>
        </dl>
        {/* Challenge C3: this button leads to the dedicated update route. */}
        <Link
          href="/profile/update"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-content transition-colors hover:bg-primary-strong focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          আপডেট
        </Link>
      </div>
    </Content>
  )
}

export default function ProfilePage() {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-12">
      <Container>
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileContent />
        </Suspense>
      </Container>
    </main>
  )
}

function ProfileSkeleton() {
  return (
    <Content className="max-w-[768px]">
      <Skeleton className="mx-auto h-7 w-44" />
      <Skeleton className="mx-auto mt-3 h-4 w-64" />
      <Skeleton className="mt-6 h-24 w-full rounded-2xl" />
      <Skeleton className="mt-6 h-56 w-full rounded-2xl" />
    </Content>
  )
}
