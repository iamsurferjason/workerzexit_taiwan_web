import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductCard, { type ProductCardProduct } from '@/components/ProductCard'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type SearchParams = { category?: string }

export const metadata: Metadata = buildMetadata({
  title: '所有商品',
  description: '瀏覽 WORKERZ EXIT 全系列商品，包含工具腰袋、收納袋、安全護具、水平測量工具與五金配件。',
  path: '/products',
})

async function getProducts(categorySlug?: string) {
  try {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        category: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
  } catch {
    return []
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const [products, categories] = await Promise.all([
    getProducts(params.category),
    getCategories(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[#FFFFFF] text-xs font-bold tracking-widest uppercase mb-1">PRODUCTS</p>
        <h1 className="text-4xl font-bold text-[#EDEDED]">所有商品</h1>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/products"
          className={`px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors ${
            !params.category
              ? 'bg-[#FFFFFF] text-[#0F0F0F]'
              : 'border border-[#2A2A2A] text-[#888888] hover:border-[#FFFFFF] hover:text-[#FFFFFF]'
          }`}
        >
          全部
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors ${
              params.category === cat.slug
                ? 'bg-[#FFFFFF] text-[#0F0F0F]'
                : 'border border-[#2A2A2A] text-[#888888] hover:border-[#FFFFFF] hover:text-[#FFFFFF]'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-[#2A2A2A] mb-8" />

      {/* Products grid */}
      {products.length > 0 ? (
        <>
          <p className="text-sm text-[#555555] mb-6">共 {products.length} 件商品</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as ProductCardProduct} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 border border-[#2A2A2A]">
          <p className="text-[#555555]">此分類目前無商品</p>
          <Link href="/products" className="mt-4 inline-block text-sm text-[#FFFFFF] hover:text-[#CCCCCC]">
            查看全部商品
          </Link>
        </div>
      )}
    </div>
  )
}
