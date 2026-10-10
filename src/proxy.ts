import { NextResponse, type NextRequest } from 'next/server'
import { safeRedirect } from '@/lib/auth/safe-redirect'

/**
 * Better Auth prefixes the cookie with `__Secure-` whenever it is served over https, which
 * in practice means every production request. Checking only the bare name makes the guard
 * read a signed-in visitor as logged out and bounce them back to /signin forever — the
 * page behind the guard never loads, so it looks like sign-in itself failed.
 */
const SESSION_COOKIES = ['__Secure-better-auth.session_token', 'better-auth.session_token']

const PROTECTED = ['/product', '/profile', '/update']
const AUTH_PAGES = ['/signin', '/signup']

/**
 * First line of defence for protected routes. Runs before the page renders so a
 * logged-out visitor never sees the detail page flash.
 *
 * This is UX, not security: a matcher can be bypassed by a request that skips it, so
 * every protected page also calls requireSession() on the server.
 *
 * Only `matcher` may be configured — Next 16 rejects a `runtime` key in a proxy file.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const hasSession = SESSION_COOKIES.some((name) => Boolean(request.cookies.get(name)?.value))

  // A signed-in visitor has no business on /signin or /signup — send them where they were
  // originally headed, or home. Without this the auth pages stay reachable after login and
  // a second sign-in is possible. Redirecting here rather than in the page means the bounce
  // happens before anything renders.
  if (AUTH_PAGES.some((page) => pathname.startsWith(page))) {
    if (hasSession) {
      const url = new URL(safeRedirect(searchParams.get('redirect')), request.url)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  const isProtected = PROTECTED.some((prefix) => pathname.startsWith(prefix))

  if (isProtected && !hasSession) {
    const url = new URL('/signin', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/product/:path*', '/profile/:path*', '/update/:path*', '/signin', '/signup'],
}
