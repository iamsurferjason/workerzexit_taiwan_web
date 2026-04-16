import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const revalidate = 3600 // 每一小時重新產出 Sitemap

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://workerzexit.tw'

  // 動態獲取商品
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })
  } catch (e) {
    console.error("Failed to fetch products for sitemap")
  }

  // 動態獲取最新消息
  let news: any[] = []
  try {
    news = await prisma.news.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    })
  } catch (e) {
    console.error("Failed to fetch news for sitemap")
  }

  const productEntries = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const newsEntries = news.map((n) => ({
    url: `${baseUrl}/news/${n.slug}`,
    lastModified: n.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const staticRoutes = [
    '',
    '/products',
    '/collections/waist-tools',
    '/collections/storage-bags',
    '/collections/measuring-tools',
    '/collections/safety-gear',
    '/collections/accessories',
    '/news',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.9,
  }))

  return [...staticRoutes, ...productEntries, ...newsEntries]
}
