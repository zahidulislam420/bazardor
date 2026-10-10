/**
 * Only same-origin paths are accepted as a post-login destination.
 * `//evil.com` and `https://evil.com` are rejected, which blocks an open redirect.
 *
 * Deliberately dependency-free so `proxy.ts` can import it — that file runs in the edge
 * runtime and cannot pull in the database or `next/headers`.
 */
export function safeRedirect(value: string | null | undefined, fallback = '/'): string {
  if (!value) return fallback
  if (!value.startsWith('/')) return fallback
  if (value.startsWith('//')) return fallback
  return value
}