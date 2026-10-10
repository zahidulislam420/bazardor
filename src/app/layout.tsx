import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Hind_Siliguri } from 'next/font/google'
import { SiteHeader } from '@/components/layout/site-header'
import { Footer } from '@/components/layout/footer'
import './globals.css'

const bangla = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bangla',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে',
  description:
    'দেশের প্রতিটি বাজারের আজকের দাম এক নজরে — চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম-দুধ ও মসলা।',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="bn" className={`${bangla.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <Suspense fallback={null}>
          <SiteHeader />
        </Suspense>
        {children}
        <Footer />
      </body>
    </html>
  )
}
