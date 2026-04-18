'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

type Banner = { id: string; title: string | null; imageUrl: string; ctaText: string | null; sortOrder: number; isActive: boolean }

const inputCls = 'w-full bg-[#262626] border border-[#2A2A2A] text-[#EDEDED] px-3 py-2.5 text-sm focus:outline-none focus:border-[#FFFFFF]'

export default function AdminBannersPage() {
  const [items, setItems] = useState<Banner[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Banner | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', imageMobile: '', ctaText: '', ctaUrl: '', sortOrder: '0', isActive: true })

  async function load() {
    const res = await fetch('/api/admin/banners')
    setItems(await res.json())
  }
  useEffect(() => {
    async function loadBanners() {
      const res = await fetch('/api/admin/banners')
      const data: Banner[] = await res.json()
      setItems(data)
    }

    void loadBanners()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const body = { ...form, sortOrder: parseInt(form.sortOrder) }
    const url = editItem ? `/api/admin/banners/${editItem.id}` : '/api/admin/banners'
    const method = editItem ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setLoading(false)
    if (res.ok) { toast.success(editItem ? '已更新' : '已新增'); load(); setShowModal(false) }
    else toast.error('儲存失敗')
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/banners/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !isActive }) })
    load()
  }

  async function deleteItem(id: string) {
    if (!confirm('確定刪除？')) return
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
    toast.success('已刪除'); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold text-[#EDEDED]">Banner 管理</h1><p className="text-sm text-[#555555] mt-1">管理首頁主視覺輪播 Banner</p></div>
        <button onClick={() => { setEditItem(null); setForm({ title: '', subtitle: '', imageUrl: '', imageMobile: '', ctaText: '', ctaUrl: '', sortOrder: '0', isActive: true }); setShowModal(true) }} className="flex items-center gap-2 bg-[#FFFFFF] text-[#0F0F0F] px-4 py-2 text-sm font-bold hover:bg-[#CCCCCC]">
          <Plus size={16} />新增 Banner
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {items.map((b) => (
          <div key={b.id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 flex items-center gap-4">
            <div className="relative w-24 h-14 bg-[#262626] shrink-0 overflow-hidden">
              {b.imageUrl && <Image src={b.imageUrl} alt={b.title || 'Banner preview'} fill unoptimized sizes="96px" className="object-cover" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#EDEDED]">{b.title || '（無標題）'}</p>
              <p className="text-xs text-[#555555] mt-0.5">{b.ctaText || '無 CTA'} · 排序 {b.sortOrder}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 shrink-0 ${b.isActive ? 'bg-green-900/30 text-green-400' : 'bg-[#333] text-[#666]'}`}>{b.isActive ? '顯示中' : '隱藏'}</span>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => {
                setEditItem(b); setForm({ title: b.title || '', subtitle: '', imageUrl: b.imageUrl, imageMobile: '', ctaText: b.ctaText || '', ctaUrl: '', sortOrder: b.sortOrder.toString(), isActive: b.isActive }); setShowModal(true)
              }} className="p-1.5 text-[#888888] hover:text-[#FFFFFF]"><Pencil size={14} /></button>
              <button onClick={() => toggleActive(b.id, b.isActive)} className="p-1.5 text-[#888888] hover:text-[#FFFFFF]">{b.isActive ? <EyeOff size={14} /> : <Eye size={14} />}</button>
              <button onClick={() => deleteItem(b.id)} className="p-1.5 text-[#888888] hover:text-[#D94F3D]"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-16 border border-[#2A2A2A] text-[#555555] text-sm">目前沒有 Banner，點擊右上角新增</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] w-full max-w-lg p-6">
            <h2 className="text-base font-bold text-[#EDEDED] mb-5">{editItem ? '編輯 Banner' : '新增 Banner'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">標題</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} /></div>
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">副標題</label><input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={inputCls} /></div>
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">圖片 URL（桌機）*</label><input required type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className={inputCls} placeholder="https://..." /></div>
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">圖片 URL（手機）</label><input type="url" value={form.imageMobile} onChange={(e) => setForm({ ...form, imageMobile: e.target.value })} className={inputCls} placeholder="https://..." /></div>
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">CTA 按鈕文字</label><input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} className={inputCls} /></div>
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">CTA 連結</label><input value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} className={inputCls} /></div>
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">排序</label><input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className={inputCls} /></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-[#FFFFFF]" /><span className="text-sm text-[#AAAAAA]">立即顯示</span></div>
              <div className="flex gap-3 pt-2 border-t border-[#2A2A2A]">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-[#2A2A2A] text-sm text-[#888888]">取消</button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-[#FFFFFF] text-[#0F0F0F] text-sm font-bold disabled:opacity-50">{loading ? '儲存中...' : '儲存'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
