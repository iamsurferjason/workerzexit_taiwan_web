'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const FIELDS = [
  { key: 'site_name', label: '網站名稱' },
  { key: 'site_description', label: '網站描述 (SEO)' },
  { key: 'hero_heading', label: 'Banner 主標題（首頁大字）' },
  { key: 'contact_email', label: '聯絡 Email' },
  { key: 'contact_phone', label: '聯絡電話' },
  { key: 'contact_address', label: '地址' },
  { key: 'instagram_url', label: 'Instagram 連結' },
  { key: 'facebook_url', label: 'Facebook 連結' },
  { key: 'line_url', label: 'LINE 連結' },
  { key: 'shop_url', label: '購物連結（Panrico）' },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings').then((r) => r.json()).then(setSettings)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setLoading(false)
    if (res.ok) toast.success('設定已儲存')
    else toast.error('儲存失敗')
  }

  const inputCls = 'w-full bg-[#262626] border border-[#2A2A2A] text-[#EDEDED] px-3 py-2.5 text-sm focus:outline-none focus:border-[#FFFFFF]'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#EDEDED]">網站設定</h1>
        <p className="text-sm text-[#555555] mt-1">管理網站基本資訊與 SEO 設定</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 space-y-5 max-w-2xl">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-xs text-[#888888] mb-1.5 uppercase tracking-widest">{f.label}</label>
            {f.key === 'site_description' ? (
              <textarea
                rows={3}
                value={settings[f.key] || ''}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                className={inputCls + ' resize-none'}
              />
            ) : (
              <input
                type={f.key.includes('url') ? 'url' : f.key.includes('email') ? 'email' : 'text'}
                value={settings[f.key] || ''}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                className={inputCls}
              />
            )}
          </div>
        ))}
        <button type="submit" disabled={loading} className="bg-[#FFFFFF] text-[#0F0F0F] px-8 py-3 text-sm font-bold disabled:opacity-50 hover:bg-[#CCCCCC]">
          {loading ? '儲存中...' : '儲存設定'}
        </button>
      </form>
    </div>
  )
}
