'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

type Promotion = {
  id: string; title: string; subtitle: string | null; layout: string
  ctaText: string | null; ctaUrl: string | null; isActive: boolean
  startsAt: string | null; endsAt: string | null; sortOrder: number
}

type PromotionForm = {
  title: string
  subtitle: string
  imageUrl: string
  ctaText: string
  ctaUrl: string
  layout: string
  isActive: boolean
  startsAt: string
  endsAt: string
  sortOrder: string
}

const inputCls = 'w-full bg-[#262626] border border-[#2A2A2A] text-[#EDEDED] px-3 py-2.5 text-sm focus:outline-none focus:border-[#FFFFFF]'

export default function AdminPromotionsPage() {
  const [items, setItems] = useState<Promotion[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Promotion | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<PromotionForm>({ title: '', subtitle: '', imageUrl: '', ctaText: '', ctaUrl: '', layout: 'FULL_WIDTH', isActive: true, startsAt: '', endsAt: '', sortOrder: '0' })

  function resetForm(p?: Promotion) {
    setForm({
      title: p?.title || '', subtitle: p?.subtitle || '', imageUrl: '',
      ctaText: p?.ctaText || '', ctaUrl: p?.ctaUrl || '', layout: p?.layout || 'FULL_WIDTH',
      isActive: p?.isActive ?? true, startsAt: p?.startsAt ? p.startsAt.slice(0, 10) : '',
      endsAt: p?.endsAt ? p.endsAt.slice(0, 10) : '', sortOrder: p?.sortOrder?.toString() || '0',
    })
  }

  async function load() {
    const res = await fetch('/api/admin/promotions')
    setItems(await res.json())
  }

  useEffect(() => {
    async function loadPromotions() {
      const res = await fetch('/api/admin/promotions')
      const data: Promotion[] = await res.json()
      setItems(data)
    }

    void loadPromotions()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const body = { ...form, sortOrder: parseInt(form.sortOrder), startsAt: form.startsAt || null, endsAt: form.endsAt || null }
    const url = editItem ? `/api/admin/promotions/${editItem.id}` : '/api/admin/promotions'
    const method = editItem ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setLoading(false)
    if (res.ok) { toast.success(editItem ? '已更新' : '已新增'); load(); setShowModal(false) }
    else toast.error('儲存失敗')
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/promotions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !isActive }) })
    load()
  }

  async function deleteItem(id: string) {
    if (!confirm('確定刪除？')) return
    await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold text-[#EDEDED]">廣告文宣</h1><p className="text-sm text-[#555555] mt-1">管理首頁廣告文宣區塊</p></div>
        <button onClick={() => { setEditItem(null); resetForm(); setShowModal(true) }} className="flex items-center gap-2 bg-[#FFFFFF] text-[#0F0F0F] px-4 py-2 text-sm font-bold hover:bg-[#CCCCCC]">
          <Plus size={16} />新增文宣
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A]">
        <table className="w-full">
          <thead><tr className="border-b border-[#2A2A2A]">
            {['標題', '版型', 'CTA', '顯示期限', '狀態', '操作'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs text-[#555555] uppercase tracking-wider">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {items.map((p) => (
              <tr key={p.id} className="hover:bg-[#262626]">
                <td className="px-4 py-3 text-sm text-[#EDEDED]">{p.title}</td>
                <td className="px-4 py-3 text-xs text-[#888888]">{p.layout === 'FULL_WIDTH' ? '全寬' : '雙欄'}</td>
                <td className="px-4 py-3 text-xs text-[#888888]">{p.ctaText || '—'}</td>
                <td className="px-4 py-3 text-xs text-[#555555]">
                  {p.startsAt ? p.startsAt.slice(0, 10) : '無限制'} ~ {p.endsAt ? p.endsAt.slice(0, 10) : '無限制'}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 ${p.isActive ? 'bg-green-900/30 text-green-400' : 'bg-[#333] text-[#666]'}`}>{p.isActive ? '顯示中' : '已停用'}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditItem(p); resetForm(p); setShowModal(true) }} className="p-1.5 text-[#888888] hover:text-[#FFFFFF]"><Pencil size={14} /></button>
                    <button onClick={() => toggleActive(p.id, p.isActive)} className="p-1.5 text-[#888888] hover:text-[#FFFFFF]">{p.isActive ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                    <button onClick={() => deleteItem(p.id)} className="p-1.5 text-[#888888] hover:text-[#D94F3D]"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1A1A1A] px-6 py-4 border-b border-[#2A2A2A] flex items-center justify-between">
              <h2 className="text-base font-bold text-[#EDEDED]">{editItem ? '編輯文宣' : '新增文宣'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#888888] hover:text-[#EDEDED]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {([
                { key: 'title', label: '標題 *', required: true },
                { key: 'subtitle', label: '副標題', required: false },
                { key: 'imageUrl', label: '圖片 URL', required: false },
                { key: 'ctaText', label: 'CTA 按鈕文字', required: false },
                { key: 'ctaUrl', label: 'CTA 連結', required: false },
              ] as const).map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">{f.label}</label>
                  <input required={f.required} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className={inputCls} />
                </div>
              ))}
              <div>
                <label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">版型</label>
                <select value={form.layout} onChange={(e) => setForm({ ...form, layout: e.target.value })} className={inputCls}>
                  <option value="FULL_WIDTH">全寬橫幅</option>
                  <option value="TWO_COLUMN">雙欄並排</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">開始日期</label>
                  <input type="date" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className={inputCls} /></div>
                <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">結束日期</label>
                  <input type="date" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} className={inputCls} /></div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActivePromo" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-[#FFFFFF]" />
                <label htmlFor="isActivePromo" className="text-sm text-[#AAAAAA]">立即顯示</label>
              </div>
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
