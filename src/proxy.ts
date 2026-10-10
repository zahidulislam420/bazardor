import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE = 'better-auth.session_token'

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
  const { pathname } = request.nextUrl

  if (AUTH_PAGES.some((page) => pathname.startsWith(page))) {
    return NextResponse.next()
  }

  const isProtected = PROTECTED.some((prefix) => pathname.startsWith(prefix))
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value)

  if (isProtected && !hasSession) {
    const url = new URL('/signin', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/product/:path*', '/profile/:path*', '/update/:path*'],
}
