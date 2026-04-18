import type { Metadata } from 'next'
import { Bebas_Neue, Noto_Sans_TC } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/sonner'
import { absoluteUrl, getSiteUrl, siteConfig } from '@/lib/seo'

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
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'WORKERZ EXIT 台灣總代理 | 日本職人工具腰道具',
    template: '%s | WORKERZ EXIT 台灣',
  },
  description: siteConfig.description,
  keywords: ['WORKERZ EXIT', '腰道具', '工具袋', '日本職人工具', 'EBISU水平尺', '安全帶', '台灣'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: '/',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: absoluteUrl(siteConfig.ogImage),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [absoluteUrl(siteConfig.ogImage)],
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
