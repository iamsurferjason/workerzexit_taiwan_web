import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cache } from 'react'
import { absoluteUrl, buildMetadata, stripHtml, truncateDescription } from '@/lib/seo'

const getNews = cache(async (slug: string) => {
  return prisma.news.findUnique({
    where: { slug, status: 'PUBLISHED' },
  }).catch(() => null)
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const news = await getNews(slug)

  if (!news) {
    return buildMetadata({
      title: '消息不存在',
      description: '找不到指定最新消息。',
      path: `/news/${slug}`,
      noIndex: true,
    })
  }

  return buildMetadata({
    title: news.title,
    description: truncateDescription(stripHtml(news.content)),
    path: `/news/${news.slug}`,
    image: news.coverImage || null,
  })
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const news = await getNews(slug)

  if (!news) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: news.title,
            datePublished: news.publishedAt?.toISOString(),
            dateModified: news.updatedAt.toISOString(),
            image: news.coverImage ? [news.coverImage] : undefined,
            description: truncateDescription(stripHtml(news.content)),
            mainEntityOfPage: absoluteUrl(`/news/${news.slug}`),
            publisher: {
              '@type': 'Organization',
              name: 'WORKERZ EXIT 台灣總代理',
              logo: {
                '@type': 'ImageObject',
                url: absoluteUrl('/images/logo.jpg'),
              },
            },
          }),
        }}
      />
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
