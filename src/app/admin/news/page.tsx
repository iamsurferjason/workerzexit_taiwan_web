'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type News = { id: string; title: string; slug: string; status: string; publishedAt: string | null; createdAt: string }

const inputCls = 'w-full bg-[#262626] border border-[#2A2A2A] text-[#EDEDED] px-3 py-2.5 text-sm focus:outline-none focus:border-[#FFFFFF]'

export default function AdminNewsPage() {
  const [items, setItems] = useState<News[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<News | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', content: '', coverImage: '', status: 'DRAFT' })

  async function load() {
    const res = await fetch('/api/admin/news')
    setItems(await res.json())
  }
  useEffect(() => {
    async function loadNews() {
      const res = await fetch('/api/admin/news')
      const data: News[] = await res.json()
      setItems(data)
    }

    void loadNews()
  }, [])

  function generateSlug(title: string) {
    return `news-${Date.now()}-${title.slice(0, 10).replace(/\s+/g, '-')}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const body = { ...form, slug: form.slug || generateSlug(form.title) }
    const url = editItem ? `/api/admin/news/${editItem.id}` : '/api/admin/news'
    const method = editItem ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setLoading(false)
    if (res.ok) { toast.success(editItem ? '已更新' : '已新增'); load(); setShowModal(false) }
    else toast.error('儲存失敗')
  }

  async function deleteItem(id: string) {
    if (!confirm('確定刪除？')) return
    await fetch(`/api/admin/news/${id}`, { method: 'DELETE' })
    toast.success('已刪除'); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold text-[#EDEDED]">最新消息</h1></div>
        <button onClick={() => { setEditItem(null); setForm({ title: '', slug: '', content: '', coverImage: '', status: 'DRAFT' }); setShowModal(true) }} className="flex items-center gap-2 bg-[#FFFFFF] text-[#0F0F0F] px-4 py-2 text-sm font-bold hover:bg-[#CCCCCC]">
          <Plus size={16} />新增消息
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A]">
        <table className="w-full">
          <thead><tr className="border-b border-[#2A2A2A]">
            {['標題', '狀態', '發布日期', '操作'].map((h) => <th key={h} className="px-5 py-3 text-left text-xs text-[#555555] uppercase tracking-wider">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {items.map((n) => (
              <tr key={n.id} className="hover:bg-[#262626]">
                <td className="px-5 py-3 text-sm text-[#EDEDED] max-w-xs truncate">{n.title}</td>
                <td className="px-5 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 ${n.status === 'PUBLISHED' ? 'bg-green-900/30 text-green-400' : 'bg-[#333] text-[#888]'}`}>{n.status === 'PUBLISHED' ? '已發布' : '草稿'}</span></td>
                <td className="px-5 py-3 text-xs text-[#555555]">{n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('zh-TW') : '—'}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditItem(n); setForm({ title: n.title, slug: n.slug, content: '', coverImage: '', status: n.status }); setShowModal(true) }} className="p-1.5 text-[#888888] hover:text-[#FFFFFF]"><Pencil size={14} /></button>
                    <button onClick={() => deleteItem(n.id)} className="p-1.5 text-[#888888] hover:text-[#D94F3D]"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1A1A1A] px-6 py-4 border-b border-[#2A2A2A] flex items-center justify-between">
              <h2 className="text-base font-bold text-[#EDEDED]">{editItem ? '編輯消息' : '新增消息'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#888888]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">標題 *</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} /></div>
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">封面圖 URL</label><input type="url" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} className={inputCls} placeholder="https://..." /></div>
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">內容（支援 HTML）*</label>
                <textarea required rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={inputCls + ' resize-y'} /></div>
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">狀態</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
                  <option value="DRAFT">草稿</option>
                  <option value="PUBLISHED">立即發布</option>
                </select></div>
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
