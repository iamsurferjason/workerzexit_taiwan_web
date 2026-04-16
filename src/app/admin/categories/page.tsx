'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type Category = { id: string; name: string; slug: string; sortOrder: number; isActive: boolean }

const inputCls = 'w-full bg-[#262626] border border-[#2A2A2A] text-[#EDEDED] px-3 py-2.5 text-sm focus:outline-none focus:border-[#FFFFFF]'

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', sortOrder: '0', isActive: true })

  async function load() {
    const res = await fetch('/api/admin/categories')
    setItems(await res.json())
  }
  useEffect(() => { load() }, [])

  function generateSlug(name: string) {
    const map: Record<string, string> = { '腰道具 / 工具袋': 'waist-tools', '攜行收納': 'storage-bags', '水平測量工具': 'measuring-tools', '安全護具': 'safety-gear', '五金配件': 'accessories' }
    return map[name] || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const body = { ...form, sortOrder: parseInt(form.sortOrder) }
    const url = editItem ? `/api/admin/categories/${editItem.id}` : '/api/admin/categories'
    const method = editItem ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setLoading(false)
    if (res.ok) { toast.success(editItem ? '已更新' : '已新增'); load(); setShowModal(false) }
    else toast.error('儲存失敗')
  }

  async function deleteItem(id: string) {
    if (!confirm('確定刪除？（此分類下的商品也會受影響）')) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('已刪除'); load() }
    else toast.error('刪除失敗（請先移除此分類下的商品）')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold text-[#EDEDED]">分類管理</h1></div>
        <button onClick={() => { setEditItem(null); setForm({ name: '', slug: '', sortOrder: '0', isActive: true }); setShowModal(true) }} className="flex items-center gap-2 bg-[#FFFFFF] text-[#0F0F0F] px-4 py-2 text-sm font-bold hover:bg-[#CCCCCC]">
          <Plus size={16} />新增分類
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A]">
        <table className="w-full">
          <thead><tr className="border-b border-[#2A2A2A]">
            {['分類名稱', 'Slug', '排序', '狀態', '操作'].map((h) => <th key={h} className="px-5 py-3 text-left text-xs text-[#555555] uppercase tracking-wider">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {items.map((c) => (
              <tr key={c.id} className="hover:bg-[#262626]">
                <td className="px-5 py-3 text-sm text-[#EDEDED]">{c.name}</td>
                <td className="px-5 py-3 text-sm text-[#555555] font-mono">{c.slug}</td>
                <td className="px-5 py-3 text-sm text-[#888888]">{c.sortOrder}</td>
                <td className="px-5 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 ${c.isActive ? 'bg-green-900/30 text-green-400' : 'bg-[#333] text-[#666]'}`}>{c.isActive ? '啟用' : '停用'}</span></td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditItem(c); setForm({ name: c.name, slug: c.slug, sortOrder: c.sortOrder.toString(), isActive: c.isActive }); setShowModal(true) }} className="p-1.5 text-[#888888] hover:text-[#FFFFFF]"><Pencil size={14} /></button>
                    <button onClick={() => deleteItem(c.id)} className="p-1.5 text-[#888888] hover:text-[#D94F3D]"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] w-full max-w-md p-6">
            <h2 className="text-base font-bold text-[#EDEDED] mb-5">{editItem ? '編輯分類' : '新增分類'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">分類名稱 *</label>
                <input required value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) }) }} className={inputCls} /></div>
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">Slug (URL)</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} /></div>
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">排序</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className={inputCls} /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-[#FFFFFF]" />
                <span className="text-sm text-[#AAAAAA]">啟用分類</span>
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
