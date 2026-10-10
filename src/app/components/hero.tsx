import Image from 'next/image'
import { Container, Content } from '@/components/ui/container'

/**
 * Hero copy is taken verbatim from the design file.
 * The CTA is an anchor, not a route — it scrolls to the #সব-পণ্য section on the same page.
 */
export function Hero({ date }: { date: string }) {
  return (
    <Container>
      <Content>
        <section className="overflow-hidden rounded-3xl bg-base-200">
          <div className="flex flex-col gap-8 p-6 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-[576px]">
              <span className="inline-block rounded-xl px-3 py-1 text-sm font-medium text-primary">
                {date}
              </span>
              <h1 className="mt-3 text-3xl font-bold md:text-4xl">
                আজকের বাজারের দাম এক নজরে
              </h1>
              <p className="mt-3 leading-relaxed">
                চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়,
                সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
              </p>
              <a
                href="#সব-পণ্য"
                className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-content transition-colors hover:bg-primary-strong focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                সব পণ্য দেখুন
              </a>
            </div>

            <Image
              src="/images/hero-basket.svg"
              alt=""
              aria-hidden="true"
              width={315}
              height={263}
              className="mx-auto shrink-0 md:mx-0"
            />
          </div>
        </section>
      </Content>
    </Container>
  )
}
