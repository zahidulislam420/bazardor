import { Suspense } from 'react'
import { AuthShell } from '../signin/components/auth-shell'
import { AuthForm } from '../signin/components/auth-form'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = { title: 'সাইন আপ — বাজার দর' }

export default function SignUpPage() {
  return (
    <AuthShell
      title="অ্যাকাউন্ট তৈরি করুন"
      subtitle="বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।"
    >
      <Suspense fallback={<AuthSkeleton />}>
        <AuthForm mode="signup" />
      </Suspense>
    </AuthShell>
  )
}

function AuthSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
