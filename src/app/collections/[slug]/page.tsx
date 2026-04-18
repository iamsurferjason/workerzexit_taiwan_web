import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductCard, { type ProductCardProduct } from '@/components/ProductCard'
import Link from 'next/link'
import { cache } from 'react'
import { buildMetadata } from '@/lib/seo'

const getCategory = cache(async (slug: string) => {
  return prisma.category.findUnique({
    where: { slug, isActive: true },
    include: {
      products: {
        where: { isActive: true },
        include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 }, category: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      },
    },
  }).catch(() => null)
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return buildMetadata({
      title: '分類不存在',
      description: '找不到指定商品分類。',
      path: `/collections/${slug}`,
      noIndex: true,
    })
  }

  return buildMetadata({
    title: category.name,
    description: `瀏覽 WORKERZ EXIT ${category.name} 全系列商品，查看分類商品、圖片與授權購買資訊。`,
    path: `/collections/${category.slug}`,
    image: category.products[0]?.images[0]?.url || null,
  })
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const category = await getCategory(slug)

  if (!category) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <Link href="/products" className="text-xs text-[#555555] hover:text-[#FFFFFF] transition-colors tracking-widest uppercase">
          ← 所有商品
        </Link>
        <p className="text-[#FFFFFF] text-xs font-bold tracking-widest uppercase mb-1 mt-4">COLLECTION</p>
        <h1 className="text-4xl font-bold text-[#EDEDED]">{category.name}</h1>
      </div>
      <div className="border-t border-[#2A2A2A] mb-8" />
      {category.products.length > 0 ? (
        <>
          <p className="text-sm text-[#555555] mb-6">共 {category.products.length} 件商品</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product as ProductCardProduct} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 border border-[#2A2A2A]">
          <p className="text-[#555555]">此分類目前無商品，敬請期待</p>
        </div>
      )}
    </div>
  )
}
