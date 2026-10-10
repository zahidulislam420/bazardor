import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { AuthButtons } from './auth-buttons'

export function Navbar({ date }: { date: string }) {
  return (
    <header className="bg-white">
      <Container>
        <div className="flex h-[68px] items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
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

          <AuthButtons />
        </div>
      </Container>
    </header>
  )
}
