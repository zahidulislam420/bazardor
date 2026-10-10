import { ProductGridSkeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="flex-1 py-8">
      <div className="mx-auto w-full max-w-[1152px] space-y-12 px-4">
        <div className="h-[283px] animate-pulse rounded-3xl bg-base-200" />
        <ProductGridSkeleton count={6} />
        <ProductGridSkeleton count={6} />
      </div>
    </main>
  )
}
