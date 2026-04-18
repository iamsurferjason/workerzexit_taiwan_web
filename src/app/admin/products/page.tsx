'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import ProductFormModal from '@/components/admin/ProductFormModal'
import type { ProductCardProduct } from '@/components/ProductCard'

type Product = ProductCardProduct & {
  id: string
  description: string | null
  categoryId: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  tags: string[]
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  async function loadProducts() {
    setLoading(true)
    const res = await fetch('/api/admin/products')
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    async function initialLoad() {
      const res = await fetch('/api/admin/products')
      const data: Product[] = await res.json()
      setProducts(data)
      setLoading(false)
    }

    void initialLoad()
  }, [])

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    loadProducts()
  }

  async function deleteProduct(id: string) {
    if (!confirm('確定要刪除此商品嗎？')) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    loadProducts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#EDEDED]">商品管理</h1>
          <p className="text-sm text-[#555555] mt-1">共 {products.length} 件商品</p>
        </div>
        <button
          onClick={() => { setEditProduct(null); setShowModal(true) }}
          className="flex items-center gap-2 bg-[#FFFFFF] text-[#0F0F0F] px-4 py-2 text-sm font-bold hover:bg-[#CCCCCC] transition-colors"
        >
          <Plus size={16} />
          新增商品
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-[#555555]">載入中...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {['商品圖', '名稱', '分類', '價格', '標籤', '狀態', '操作'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-[#555555] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#262626] transition-colors">
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-12 bg-[#262626] border border-[#2A2A2A] overflow-hidden shrink-0">
                        {p.images[0] ? (
                          <Image src={p.images[0].url} alt={p.name} fill unoptimized sizes="48px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-[#333] font-bold">WE</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#EDEDED] max-w-[200px] truncate">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-[#888888] whitespace-nowrap">{p.category.name}</td>
                    <td className="px-4 py-3 text-sm text-[#FFFFFF] whitespace-nowrap">NT${p.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map((tag) => (
                          <span key={tag} className="text-[9px] font-bold px-1.5 py-0.5 bg-[#FFFFFF]/10 text-[#FFFFFF]">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 ${p.isActive ? 'bg-green-900/30 text-green-400' : 'bg-[#333] text-[#666]'}`}>
                        {p.isActive ? '上架' : '下架'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditProduct(p); setShowModal(true) }}
                          className="p-1.5 text-[#888888] hover:text-[#FFFFFF] transition-colors"
                          title="編輯"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => toggleActive(p.id, p.isActive)}
                          className="p-1.5 text-[#888888] hover:text-[#FFFFFF] transition-colors"
                          title={p.isActive ? '下架' : '上架'}
                        >
                          {p.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-[#888888] hover:text-[#D94F3D] transition-colors"
                          title="刪除"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <ProductFormModal
          product={editProduct}
          onClose={() => { setShowModal(false); setEditProduct(null) }}
          onSaved={() => { loadProducts(); setShowModal(false); setEditProduct(null) }}
        />
      )}
    </div>
  )
}
