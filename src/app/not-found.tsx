import { EmptyState } from '@/components/ui/empty-state'
import emoji from '@/data/emoji.json'

export default function NotFound() {
  return (
    <main className="flex-1 py-12">
      <div className="mx-auto w-full max-w-[1152px] px-4">
        <EmptyState
          icon={emoji.ui.notFound}
          title="পৃষ্ঠাটি খুঁজে পাওয়া যায়নি"
          description="আপনি যে পাতাটি খুঁজছেন সেটি সম্ভবত সরানো হয়েছে বা ঠিকানাটি ভুল হয়েছে।"
        />
      </div>
    </main>
  )
}
