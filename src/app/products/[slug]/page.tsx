import type { Metadata } from 'next'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, ArrowLeft } from 'lucide-react'
import ProductCard, { type ProductCardProduct } from '@/components/ProductCard'
import { cache } from 'react'
import { absoluteUrl, buildMetadata, truncateDescription } from '@/lib/seo'

const tagLabels: Record<string, string> = {
  NEW: 'NEW',
  SOLD_OUT: '已售完',
  FEATURED: '精選',
  SALE: '特價',
}

const getProduct = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
    },
  }).catch(() => null)
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return buildMetadata({
      title: '商品不存在',
      description: '找不到指定商品。',
      path: `/products/${slug}`,
      noIndex: true,
    })
  }

  return buildMetadata({
    title: product.name,
    description: truncateDescription(
      product.description ||
        `${product.category.name}商品頁，查看 WORKERZ EXIT ${product.name} 的規格、圖片與授權購買資訊。`
    ),
    path: `/products/${product.slug}`,
    image: product.images[0]?.url || null,
  })
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const product = await getProduct(slug)

  if (!product) notFound()

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 }, category: true },
    take: 4,
  }).catch(() => [])

  const isSoldOut = product.tags.includes('SOLD_OUT')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: product.images.map((image) => image.url),
            description:
              product.description ||
              `${product.category.name}商品頁，查看 ${product.name} 的圖片與授權購買資訊。`,
            brand: {
              '@type': 'Brand',
              name: 'WORKERZ EXIT',
            },
            category: product.category.name,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'TWD',
              price: product.price,
              availability: product.tags.includes('SOLD_OUT')
                ? 'https://schema.org/OutOfStock'
                : 'https://schema.org/InStock',
              url: absoluteUrl(`/products/${product.slug}`),
            },
          }),
        }}
      />
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#555555] mb-8">
        <Link href="/products" className="flex items-center gap-1 hover:text-[#FFFFFF] transition-colors">
          <ArrowLeft size={14} />
          所有商品
        </Link>
        <span>/</span>
        <Link href={`/collections/${product.category.slug}`} className="hover:text-[#FFFFFF] transition-colors">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-[#EDEDED]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden">
            {product.images[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                fill
                unoptimized
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-display text-6xl text-[#333333]">WE</span>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-square bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden">
                  <Image src={img.url} alt={img.alt || product.name} fill unoptimized sizes="25vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          {/* Tags */}
          <div className="flex gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className={`text-[10px] font-bold px-2 py-1 tracking-wider ${
                  tag === 'NEW' ? 'bg-[#FFFFFF] text-[#0F0F0F]' :
                  tag === 'SOLD_OUT' ? 'bg-[#555555] text-[#EDEDED]' :
                  tag === 'SALE' ? 'bg-[#D94F3D] text-white' :
                  'bg-[#FFFFFF]/20 text-[#FFFFFF]'
                }`}
              >
                {tagLabels[tag] || tag}
              </span>
            ))}
          </div>

          <div>
            <p className="text-[#FFFFFF] text-xs font-bold tracking-widest uppercase mb-2">
              {product.category.name}
            </p>
            <h1 className="text-3xl font-bold text-[#EDEDED] leading-snug">{product.name}</h1>
          </div>

          <div className="text-3xl font-bold text-[#FFFFFF]">
            NT${product.price.toLocaleString()}
          </div>

          <div className="border-t border-[#2A2A2A] pt-4">
            {product.description && (
              <p className="text-[#AAAAAA] leading-relaxed">{product.description}</p>
            )}
          </div>

          {/* CTA */}
          <div className="pt-2">
            <a
              href={isSoldOut ? undefined : product.externalUrl}
              target={isSoldOut ? undefined : '_blank'}
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full py-4 font-bold text-sm tracking-widest uppercase transition-colors ${
                isSoldOut
                  ? 'bg-[#333333] text-[#666666] cursor-not-allowed'
                  : 'bg-[#FFFFFF] text-[#0F0F0F] hover:bg-[#CCCCCC] cursor-pointer'
              }`}
            >
              {isSoldOut ? '已售完' : (
                <>前往 Panrico 購買 <ExternalLink size={14} /></>
              )}
            </a>
            <p className="text-xs text-[#555555] text-center mt-3">
              點擊後將跳轉至台灣授權代理 Panrico 選購頁面
            </p>
          </div>

          {/* Meta */}
          <div className="border-t border-[#2A2A2A] pt-4 space-y-2">
            <div className="flex gap-2 text-sm">
              <span className="text-[#555555] w-20">分類</span>
              <Link href={`/collections/${product.category.slug}`} className="text-[#FFFFFF] hover:text-[#CCCCCC]">
                {product.category.name}
              </Link>
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-[#555555] w-20">品牌</span>
              <span className="text-[#AAAAAA]">WORKERZ EXIT（日本原裝進口）</span>
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-[#555555] w-20">總經銷</span>
              <span className="text-[#AAAAAA]">百利世貿易有限公司</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-20">
          <div className="mb-6">
            <p className="text-[#FFFFFF] text-xs font-bold tracking-widest uppercase mb-1">RELATED</p>
            <h2 className="text-2xl font-bold text-[#EDEDED]">同系列商品</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p as ProductCardProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
