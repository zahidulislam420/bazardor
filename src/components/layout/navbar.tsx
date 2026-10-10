import Link from 'next/link'
import { Container } from '@/components/ui/container'

export function Navbar({ date }: { date: string }) {
  return (
    <header className="bg-white">
      <Container>
        <div className="flex h-[68px] items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-base-200 text-lg"
            >
              🛒
            </span>
            <span className="flex flex-col">
              <span className="text-xl font-bold">বাজার দর</span>
              <span className="text-sm font-medium text-primary">{date}</span>
            </span>
          </Link>

          {/* Auth buttons land with the Better Auth commit; logged-out links keep the layout honest now. */}
          <nav aria-label="প্রবেশ" className="flex items-center gap-2">
            <Link
              href="/signin"
              className="rounded-lg border border-base-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-base-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              সাইন ইন
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-content transition-colors hover:bg-primary-strong focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              সাইন আপ
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  )
}
