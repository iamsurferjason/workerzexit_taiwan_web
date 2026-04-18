import type { Metadata } from 'next'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: '最新消息',
  description: '查看 WORKERZ EXIT 台灣總代理的最新消息、活動公告、到貨資訊與品牌更新。',
  path: '/news',
})

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
  }).catch(() => [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-[#FFFFFF] text-xs font-bold tracking-widest uppercase mb-1">NEWS</p>
        <h1 className="text-4xl font-bold text-[#EDEDED]">最新消息</h1>
      </div>
      <div className="border-t border-[#2A2A2A] mb-8" />
      {news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.slug}`} className="card-industrial group">
              {item.coverImage && (
                <div className="relative aspect-video overflow-hidden">
                  <Image src={item.coverImage} alt={item.title} fill unoptimized sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="p-5">
                <p className="text-xs text-[#FFFFFF] mb-2">
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('zh-TW') : ''}
                </p>
                <h2 className="text-base font-bold text-[#EDEDED] group-hover:text-[#FFFFFF] transition-colors line-clamp-2">
                  {item.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-[#2A2A2A]">
          <p className="text-[#555555]">最新消息即將更新，敬請期待</p>
        </div>
      )}
    </div>
  )
}
