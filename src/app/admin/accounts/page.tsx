'use client'

import { useEffect, useState } from 'react'
import { Plus, UserCheck, UserX, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type Account = {
  id: string; name: string; email: string; role: string
  isActive: boolean; lastLoginAt: string | null; createdAt: string
}

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'EDITOR' })
  const [loading, setLoading] = useState(false)

  async function load() {
    const res = await fetch('/api/admin/accounts')
    setAccounts(await res.json())
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/accounts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) { toast.success('帳號已建立'); load(); setShowModal(false); setForm({ name: '', email: '', password: '', role: 'EDITOR' }) }
    else toast.error('建立失敗')
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/accounts/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !isActive }),
    })
    load()
  }

  async function deleteAccount(id: string) {
    if (!confirm('確定要刪除此帳號？')) return
    await fetch(`/api/admin/accounts/${id}`, { method: 'DELETE' })
    load()
  }

  const inputCls = 'w-full bg-[#262626] border border-[#2A2A2A] text-[#EDEDED] px-3 py-2.5 text-sm focus:outline-none focus:border-[#FFFFFF]'

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#EDEDED]">帳號管理</h1>
          <p className="text-sm text-[#555555] mt-1">管理後台登入帳號</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#FFFFFF] text-[#0F0F0F] px-4 py-2 text-sm font-bold hover:bg-[#CCCCCC]">
          <Plus size={16} />新增帳號
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              {['名稱', 'Email', '角色', '狀態', '最後登入', '操作'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs text-[#555555] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {accounts.map((a) => (
              <tr key={a.id} className="hover:bg-[#262626]">
                <td className="px-5 py-3 text-sm text-[#EDEDED]">{a.name}</td>
                <td className="px-5 py-3 text-sm text-[#888888]">{a.email}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 ${a.role === 'SUPER_ADMIN' ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#333] text-[#888]'}`}>
                    {a.role === 'SUPER_ADMIN' ? '超級管理員' : '編輯者'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 ${a.isActive ? 'bg-green-900/30 text-green-400' : 'bg-[#333] text-[#555]'}`}>
                    {a.isActive ? '啟用' : '停用'}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-[#555555]">
                  {a.lastLoginAt ? new Date(a.lastLoginAt).toLocaleString('zh-TW') : '—'}
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => toggleActive(a.id, a.isActive)} className="p-1.5 text-[#888888] hover:text-[#FFFFFF]" title={a.isActive ? '停用' : '啟用'}>
                      {a.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>
                    <button onClick={() => deleteAccount(a.id)} className="p-1.5 text-[#888888] hover:text-[#D94F3D]" title="刪除">
                      <Trash2 size={14} />
                    </button>
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
            <h2 className="text-base font-bold text-[#EDEDED] mb-5">新增管理帳號</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">姓名 *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">Email *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} /></div>
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">密碼 *</label>
                <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls} /></div>
              <div><label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">角色</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls}>
                  <option value="EDITOR">編輯者</option>
                  <option value="SUPER_ADMIN">超級管理員</option>
                </select></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-[#2A2A2A] text-sm text-[#888888]">取消</button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-[#FFFFFF] text-[#0F0F0F] text-sm font-bold disabled:opacity-50">
                  {loading ? '建立中...' : '建立帳號'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
