'use client'

import { Container } from '@/components/ui/container'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <Container>
        <div className="mx-auto max-w-md rounded-2xl bg-base-200 px-6 py-16 text-center">
          <span aria-hidden="true" className="text-6xl">
            😕
          </span>
          <h1 className="mt-4 text-xl font-bold">কিছু একটা সমস্যা হয়েছে</h1>
          <p className="mt-2 text-sm text-base-content/70">
            দামের তথ্য আনতে সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-content transition-colors hover:bg-primary-strong focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </Container>
    </main>
  )
}
