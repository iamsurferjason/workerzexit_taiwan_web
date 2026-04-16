import { prisma } from '@/lib/prisma'
import { Package, FolderOpen, Megaphone, Newspaper } from 'lucide-react'

async function getStats() {
  try {
    const [products, categories, promotions, news] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.promotion.count({ where: { isActive: true } }),
      prisma.news.count({ where: { status: 'PUBLISHED' } }),
    ])
    return { products, categories, promotions, news }
  } catch {
    return { products: 0, categories: 0, promotions: 0, news: 0 }
  }
}

async function getRecentProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { category: true },
    })
  } catch {
    return []
  }
}

export default async function DashboardPage() {
  const [stats, recentProducts] = await Promise.all([getStats(), getRecentProducts()])

  const cards = [
    { label: '上架商品', value: stats.products, icon: Package, href: '/admin/products' },
    { label: '商品分類', value: stats.categories, icon: FolderOpen, href: '/admin/categories' },
    { label: '廣告文宣', value: stats.promotions, icon: Megaphone, href: '/admin/promotions' },
    { label: '已發布消息', value: stats.news, icon: Newspaper, href: '/admin/news' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#EDEDED]">總覽</h1>
        <p className="text-sm text-[#555555] mt-1">WORKERZ EXIT 台灣官網後台</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <a key={card.label} href={card.href} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 hover:border-[#FFFFFF]/50 transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <Icon size={20} className="text-[#FFFFFF]" />
              </div>
              <div className="text-3xl font-bold text-[#EDEDED] mb-1">{card.value}</div>
              <div className="text-xs text-[#555555] group-hover:text-[#888888] transition-colors">{card.label}</div>
            </a>
          )
        })}
      </div>

      {/* Recent Products */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A]">
        <div className="px-6 py-4 border-b border-[#2A2A2A] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#EDEDED] tracking-wide">最近新增商品</h2>
          <a href="/admin/products" className="text-xs text-[#FFFFFF] hover:text-[#CCCCCC]">查看全部</a>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              {['商品名稱', '分類', '價格', '狀態'].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs text-[#555555] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {recentProducts.map((p) => (
              <tr key={p.id} className="hover:bg-[#262626] transition-colors">
                <td className="px-6 py-3 text-sm text-[#EDEDED]">{p.name}</td>
                <td className="px-6 py-3 text-sm text-[#888888]">{p.category.name}</td>
                <td className="px-6 py-3 text-sm text-[#FFFFFF]">NT${p.price.toLocaleString()}</td>
                <td className="px-6 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 ${p.isActive ? 'bg-green-900/30 text-green-400' : 'bg-[#333] text-[#666]'}`}>
                    {p.isActive ? '上架' : '下架'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
