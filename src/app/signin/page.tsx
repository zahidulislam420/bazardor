import { Suspense } from 'react'
import { AuthShell } from './components/auth-shell'
import { AuthForm } from './components/auth-form'
import { ProtectedRouteToast } from '@/components/ui/protected-route-toast'
import { safeRedirect } from '@/lib/auth/session'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = { title: 'সাইন ইন — বাজার দর' }

/**
 * Both `searchParams` and the session read are uncached data under cacheComponents, so
 * both are resolved inside the Suspense boundary. Awaiting either in the page body
 * blocks the instant shell.
 */
async function SignInContent({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolved = await searchParams
  const raw = Array.isArray(resolved.redirect) ? resolved.redirect[0] : resolved.redirect

  // safeRedirect rejects //evil.com and absolute urls, so ?redirect= cannot become an open redirect.
  const redirectTo = safeRedirect(raw)

  return (
    <>
      {redirectTo !== '/' && <ProtectedRouteToast />}
      <AuthForm mode="signin" redirectTo={redirectTo} />
    </>
  )
}

export default function SignInPage(props: PageProps<'/signin'>) {
  return (
    <AuthShell
      title="সাইন ইন"
      subtitle="বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।"
    >
      <Suspense fallback={<AuthSkeleton />}>
        <SignInContent searchParams={props.searchParams} />
      </Suspense>
    </AuthShell>
  )
}

function AuthSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
