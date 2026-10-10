import { Container } from '@/components/ui/container'

export function Footer() {
  return (
    <footer className="border-t border-base-300 bg-white">
      <Container>
        <div className="flex h-[68px] flex-col items-center justify-between gap-2 py-4 text-sm sm:h-[69px] sm:flex-row sm:py-0">
          <p>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
          <p className="text-base-content/70">
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
        </div>
      </Container>
    </footer>
  )
}
