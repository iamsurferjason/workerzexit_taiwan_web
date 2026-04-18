import Link from 'next/link'
import { ArrowRight, ShoppingBag, Shield, Star, Truck } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import PromotionBlock from '@/components/PromotionBlock'
import HeroCarousel from '@/components/HeroCarousel'
import { absoluteUrl, buildMetadata, siteConfig } from '@/lib/seo'

export const metadata = buildMetadata({
  description:
    'WORKERZ EXIT 台灣總代理官網，提供日本職人工具腰袋、安全護具、水平測量工具與授權通路資訊。',
  path: '/',
})

export const revalidate = 60 // 每 60 秒重新驗證

const categoryEntries = [
  { slug: 'waist-tools', label: '腰道具 / 工具袋', en: 'WAIST TOOLS' },
  { slug: 'storage-bags', label: '攜行收納', en: 'STORAGE' },
  { slug: 'measuring-tools', label: '水平測量工具', en: 'MEASURING' },
  { slug: 'safety-gear', label: '安全護具', en: 'SAFETY' },
  { slug: 'accessories', label: '五金配件', en: 'ACCESSORIES' },
]

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 }, category: true },
      orderBy: { sortOrder: 'asc' },
      take: 6,
    })
  } catch {
    return []
  }
}

async function getActivePromotions() {
  try {
    const now = new Date()
    return await prisma.promotion.findMany({
      where: {
        isActive: true,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
      orderBy: { sortOrder: 'asc' },
    })
  } catch {
    return []
  }
}

async function getLatestNews() {
  try {
    return await prisma.news.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    })
  } catch {
    return []
  }
}

async function getActiveBanners() {
  try {
    return await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
  } catch {
    return []
  }
}

async function getHeroHeading() {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'hero_heading' } })
    return setting?.value || 'WORKERZ\nEXIT'
  } catch {
    return 'WORKERZ\nEXIT'
  }
}

export default async function HomePage() {
  const [featuredProducts, promotions, news, banners, heroHeading] = await Promise.all([
    getFeaturedProducts(),
    getActivePromotions(),
    getLatestNews(),
    getActiveBanners(),
    getHeroHeading(),
  ])

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${absoluteUrl()}/#organization`,
        name: siteConfig.name,
        url: absoluteUrl(),
        logo: absoluteUrl('/images/logo.jpg'),
        image: absoluteUrl(siteConfig.ogImage),
        description: siteConfig.description,
      },
      {
        '@type': 'WebSite',
        '@id': `${absoluteUrl()}/#website`,
        url: absoluteUrl(),
        name: siteConfig.name,
        inLanguage: 'zh-TW',
        publisher: {
          '@id': `${absoluteUrl()}/#organization`,
        },
      },
    ],
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* ── Hero Carousel ── */}
      <HeroCarousel banners={banners} heading={heroHeading} />

      {/* ── 商品分類 ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <p className="text-[#555555] text-[10px] font-bold tracking-[0.3em] uppercase mb-2">CATEGORIES</p>
          <h2 className="text-3xl font-bold text-[#EDEDED]">商品分類</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categoryEntries.map((cat) => (
            <Link key={cat.slug} href={`/collections/${cat.slug}`} className="card-industrial p-5 flex flex-col gap-2 group">
              <div className="text-[9px] text-[#555555] font-bold tracking-[0.25em] uppercase">{cat.en}</div>
              <div className="text-sm font-medium text-[#EDEDED] mt-1 group-hover:text-white transition-colors">{cat.label}</div>
              <ArrowRight size={13} className="text-[#3A3A3A] group-hover:text-[#AAAAAA] transition-colors mt-auto" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── 廣告文宣 ── */}
      {promotions.length > 0 && <PromotionBlock promotions={promotions} />}

      {/* ── 精選商品 ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#555555] text-[10px] font-bold tracking-[0.3em] uppercase mb-2">FEATURED</p>
            <h2 className="text-3xl font-bold text-[#EDEDED]">精選商品</h2>
          </div>
          <Link href="/products" className="text-xs text-[#555555] hover:text-[#AAAAAA] transition-colors flex items-center gap-1 tracking-widest uppercase">
            全部商品 <ArrowRight size={12} />
          </Link>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-[#2A2A2A]">
            <p className="text-[#555555]">商品即將上架，敬請期待</p>
          </div>
        )}
      </section>

      {/* ── 品牌價值 ── */}
      <section className="bg-[#111111] border-t border-b border-[#2A2A2A] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#2A2A2A]">
            {[
              { icon: <Star size={22} className="text-[#555555]" />, title: '日本職人品質', desc: '嚴選日本原廠製造，每件商品經過職人精心製作，品質保證耐用可靠。' },
              { icon: <Shield size={22} className="text-[#555555]" />, title: '台灣授權總代理', desc: '百利世貿易為 WORKERZ EXIT 台灣官方授權總代理，保障正品品質與售後服務。' },
              { icon: <Truck size={22} className="text-[#555555]" />, title: '台灣在地服務', desc: '在地化服務支援，快速配送，讓台灣師傅享受最便捷的採購體驗。' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-4 p-8">
                {item.icon}
                <h3 className="text-lg font-bold text-[#EDEDED]">{item.title}</h3>
                <p className="text-sm text-[#888888] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 最新消息 ── */}
      {news.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#555555] text-[10px] font-bold tracking-[0.3em] uppercase mb-2">NEWS</p>
              <h2 className="text-3xl font-bold text-[#EDEDED]">最新消息</h2>
            </div>
            <Link href="/news" className="text-sm text-[#888888] hover:text-[#FFFFFF] transition-colors flex items-center gap-1">
              查看全部 <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {news.map((item) => (
              <Link key={item.id} href={`/news/${item.slug}`} className="card-industrial p-5 group">
                {item.coverImage && (
                  <div className="aspect-video bg-[#262626] mb-4 overflow-hidden">
                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <p className="text-[9px] text-[#444444] mb-2 tracking-widest">
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('zh-TW') : ''}
                </p>
                <h3 className="text-sm font-bold text-[#CCCCCC] group-hover:text-white transition-colors line-clamp-2">{item.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── 代理商 CTA ── */}
      <section className="bg-[#111111] border-t border-[#2A2A2A] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#555555] text-[10px] font-bold tracking-[0.3em] uppercase mb-4">AUTHORIZED DEALER</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#EDEDED] mb-4">台灣授權總代理</h2>
          <p className="text-[#888888] mb-8 max-w-md mx-auto leading-relaxed">
            透過官方授權通路選購，享有完整商品保障與台灣在地服務支援。
          </p>
          <Link
            href="https://panricopro.com/collections/exit%E6%97%A5%E6%9C%AC%E8%81%B7%E4%BA%BA%E7%B3%BB%E5%88%97"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#0F0F0F] px-10 py-4 font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#EDEDED] transition-colors"
          >
            <ShoppingBag size={16} />
            前往 Panrico 選購
          </Link>
        </div>
      </section>
    </div>
  )
}
