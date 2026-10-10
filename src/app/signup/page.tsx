import { Suspense } from 'react'
import { AuthShell } from '../signin/components/auth-shell'
import { AuthForm } from '../signin/components/auth-form'
import { safeRedirect } from '@/lib/auth/session'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = { title: 'সাইন আপ — বাজার দর' }

/**
 * Carries `?redirect=` through from sign-up to sign-in, so the destination a protected
 * page asked for survives the extra hop instead of collapsing back to the home page.
 */
async function SignUpContent({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolved = await searchParams
  const raw = Array.isArray(resolved.redirect) ? resolved.redirect[0] : resolved.redirect

  return <AuthForm mode="signup" redirectTo={safeRedirect(raw)} />
}

export default function SignUpPage(props: PageProps<'/signup'>) {
  return (
    <AuthShell
      title="অ্যাকাউন্ট তৈরি করুন"
      subtitle="বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।"
    >
      <Suspense fallback={<AuthSkeleton />}>
        <SignUpContent searchParams={props.searchParams} />
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
