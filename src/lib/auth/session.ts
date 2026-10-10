import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { cache } from 'react'
import { auth } from './auth'

export type Session = typeof auth.$Infer.Session

/**
 * Deduplicated per request so the layout, the page and any child can all call it
 * without re-reading headers or hitting the database repeatedly.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  return auth.api.getSession({ headers: await headers() })
})

/**
 * Server-side guard for protected routes.
 *
 * `proxy.ts` is the first line but is not a security boundary — a request that skips
 * the matcher would slip past it — so every protected page calls this too.
 */
export async function requireSession(redirectTo: string): Promise<Session> {
  // A protected route's output depends entirely on the request, so prerendering it is
  // meaningless anyway. Without this, Better Auth's expiry comparison (an internal
  // `new Date()`) is flagged during prerendering as an unstable value.
  await connection()

  const session = await getSession()

  if (!session) {
    redirect(`/signin?redirect=${encodeURIComponent(redirectTo)}`)
  }

  return session
}

/**
 * Only same-origin paths are accepted as a post-login destination.
 * `//evil.com` and `https://evil.com` are rejected, which blocks an open redirect.
 */
export function safeRedirect(value: string | null | undefined, fallback = '/'): string {
  if (!value) return fallback
  if (!value.startsWith('/')) return fallback
  if (value.startsWith('//')) return fallback
  return value
}
