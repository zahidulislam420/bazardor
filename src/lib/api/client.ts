const BASE_URLS = (
  process.env.NEXT_PUBLIC_API_URL
    ? [process.env.NEXT_PUBLIC_API_URL]
    : [
        'https://api.api-store.workers.dev/api/bazardor',
        'https://api.abcz.workers.dev/api/bazardor',
      ]
).filter(Boolean)

const TIMEOUT_MS = 8000

/**
 * The only module that knows the API URLs. Tries each base in order and returns the first
 * successful response, so a single mirror outage does not take the site down.
 */
export async function getJSON<T>(path: string): Promise<T> {
  let lastError: unknown

  for (const base of BASE_URLS) {
    try {
      const res = await fetch(`${base}${path}`, {
        signal: AbortSignal.timeout(TIMEOUT_MS),
      })

      if (!res.ok) {
        lastError = new Error(`bazardor ${path} → ${res.status}`)
        continue
      }

      return (await res.json()) as T
    } catch (error) {
      lastError = error
    }
  }

  throw new Error(
    `bazardor: all base urls failed for ${path}`,
    { cause: lastError }
  )
}
