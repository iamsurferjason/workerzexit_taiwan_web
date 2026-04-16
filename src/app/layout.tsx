import type { Metadata } from 'next'
import { Bebas_Neue, Noto_Sans_TC } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/sonner'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const notoSansTC = Noto_Sans_TC({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://workerzexit.tw'),
  title: {
    default: 'WORKERZ EXIT 台灣總代理 | 日本職人工具腰道具',
    template: '%s | WORKERZ EXIT 台灣',
  },
  description: '日本職人工具品牌 WORKERZ EXIT 台灣總代理。提供最高品質的工具腰袋、安全護具、EBISU 水平尺等專業工具配件。',
  keywords: ['WORKERZ EXIT', '腰道具', '工具袋', '日本職人工具', 'EBISU水平尺', '安全帶', '台灣'],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'WORKERZ EXIT 台灣總代理',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW" className={`${bebasNeue.variable} ${notoSansTC.variable}`}>
      <body className="antialiased min-h-screen">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <Toaster theme="dark" />
      </body>
    </html>
  )
}
