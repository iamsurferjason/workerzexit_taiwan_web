'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'

type Category = { id: string; name: string }
type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  externalUrl: string
  categoryId: string
  tags: string[]
  isFeatured: boolean
  isActive: boolean
  sortOrder: number
  images: { url: string; alt: string | null }[]
  category: { name: string }
}

const TAG_OPTIONS = [
  { value: 'NEW', label: 'NEW（新品）' },
  { value: 'FEATURED', label: '精選' },
  { value: 'SALE', label: '特價' },
  { value: 'SOLD_OUT', label: '已售完' },
]

export default function ProductFormModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null
  onClose: () => void
  onSaved: () => void
}) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    externalUrl: product?.externalUrl || '',
    categoryId: product?.categoryId || '',
    tags: product?.tags || [],
    isFeatured: product?.isFeatured || false,
    isActive: product?.isActive ?? true,
    sortOrder: product?.sortOrder?.toString() || '0',
    imageUrl: product?.images[0]?.url || '',
    imageAlt: product?.images[0]?.alt || '',
  })

  useEffect(() => {
    fetch('/api/admin/categories').then((r) => r.json()).then(setCategories)
  }, [])

  function set(key: string, value: any) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleTag(tag: string) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }))
  }

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[\s\u4e00-\u9fff]+/g, '-').replace(/[^\w-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const body = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      description: form.description,
      price: parseInt(form.price),
      externalUrl: form.externalUrl,
      categoryId: form.categoryId,
      tags: form.tags,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      sortOrder: parseInt(form.sortOrder),
      imageUrl: form.imageUrl,
      imageAlt: form.imageAlt,
    }

    const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
    const method = product ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setLoading(false)
    if (res.ok) {
      toast.success(product ? '商品已更新' : '商品已新增')
      onSaved()
    } else {
      toast.error('儲存失敗，請再試一次')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A] sticky top-0 bg-[#1A1A1A]">
          <h2 className="text-base font-bold text-[#EDEDED]">{product ? '編輯商品' : '新增商品'}</h2>
          <button onClick={onClose} className="p-1 text-[#888888] hover:text-[#EDEDED]"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Field label="商品名稱 *">
            <input required value={form.name} onChange={(e) => { set('name', e.target.value); if (!product) set('slug', generateSlug(e.target.value)) }} className={inputCls} />
          </Field>
          <Field label="Slug (URL)">
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} className={inputCls} placeholder="auto-generated" />
          </Field>
          <Field label="分類 *">
            <select required value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className={inputCls}>
              <option value="">請選擇分類</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="價格 (NT$) *">
            <input required type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Panrico 商品連結 *">
            <input required type="url" value={form.externalUrl} onChange={(e) => set('externalUrl', e.target.value)} className={inputCls} placeholder="https://panricopro.com/..." />
          </Field>
          <Field label="商品描述">
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className={inputCls + ' resize-none'} />
          </Field>
          <Field label="商品圖片 URL">
            <input type="url" value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} className={inputCls} placeholder="https://..." />
            <input value={form.imageAlt} onChange={(e) => set('imageAlt', e.target.value)} className={inputCls + ' mt-2'} placeholder="圖片說明（alt）" />
          </Field>
          <Field label="標籤">
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((t) => (
                <button key={t.value} type="button" onClick={() => toggleTag(t.value)}
                  className={`text-xs font-bold px-3 py-1.5 border transition-colors ${form.tags.includes(t.value) ? 'bg-[#FFFFFF] text-[#0F0F0F] border-[#FFFFFF]' : 'border-[#2A2A2A] text-[#888888] hover:border-[#FFFFFF]'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="排序">
            <input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} className={inputCls} />
          </Field>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-[#AAAAAA] cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="accent-[#FFFFFF]" />
              精選商品（首頁顯示）
            </label>
            <label className="flex items-center gap-2 text-sm text-[#AAAAAA] cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} className="accent-[#FFFFFF]" />
              上架顯示
            </label>
          </div>

          <div className="flex gap-3 pt-2 border-t border-[#2A2A2A]">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[#2A2A2A] text-sm text-[#888888] hover:text-[#EDEDED] transition-colors">
              取消
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-[#FFFFFF] text-[#0F0F0F] text-sm font-bold disabled:opacity-50 hover:bg-[#CCCCCC] transition-colors">
              {loading ? '儲存中...' : '儲存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-[#888888] mb-1.5 tracking-widest uppercase">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full bg-[#262626] border border-[#2A2A2A] text-[#EDEDED] px-3 py-2.5 text-sm focus:outline-none focus:border-[#FFFFFF] transition-colors'
