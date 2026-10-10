import { cacheLife } from 'next/cache'

/**
 * Bangla date for the navbar and hero eyebrow: "মঙ্গলবার, ৬ অক্টোবর, ২০২৬".
 *
 * `timeZone` is pinned to Asia/Dhaka so the server render and the client render agree.
 * Call this on the server and pass the result down — never recompute it in a client component,
 * or the two renders can disagree and React will report a hydration mismatch.
 */
function formatToday(now: Date): string {
  return new Intl.DateTimeFormat('bn-BD', {
    timeZone: 'Asia/Dhaka',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now)
}

/**
 * `new Date()` is synchronous IO, which fails the build under `cacheComponents`.
 * Wrapping it in 'use cache' makes the read async and cached, so the build passes and
 * the value still refreshes on the next revalidation rather than freezing at build time.
 */
export async function todayBn(): Promise<string> {
  'use cache'
  cacheLife('hours')
  return formatToday(new Date())
}
