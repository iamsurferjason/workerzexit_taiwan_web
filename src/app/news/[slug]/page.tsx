import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const news = await prisma.news.findUnique({
    where: { slug, status: 'PUBLISHED' },
  }).catch(() => null)

  if (!news) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/news" className="text-xs text-[#555555] hover:text-[#FFFFFF] transition-colors tracking-widest uppercase">
        ← 最新消息
      </Link>
      <div className="mt-8">
        <p className="text-xs text-[#FFFFFF] mb-3">
          {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('zh-TW') : ''}
        </p>
        <h1 className="text-3xl font-bold text-[#EDEDED] mb-8">{news.title}</h1>
        {news.coverImage && (
          <img src={news.coverImage} alt={news.title} className="w-full aspect-video object-cover mb-8" />
        )}
        <div
          className="prose prose-invert prose-sm max-w-none text-[#AAAAAA] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </div>
    </div>
  )
}
