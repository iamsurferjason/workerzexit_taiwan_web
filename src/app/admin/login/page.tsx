'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      setError('帳號或密碼錯誤')
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="font-display text-3xl text-[#FFFFFF] tracking-widest mb-1">WORKERZ EXIT</div>
          <p className="text-xs text-[#555555] tracking-widest uppercase">後台管理系統</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1A1A1A] border border-[#2A2A2A] p-8 space-y-5">
          <div>
            <label className="block text-xs text-[#888888] mb-2 tracking-widest uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#262626] border border-[#2A2A2A] text-[#EDEDED] px-3 py-3 text-sm focus:outline-none focus:border-[#FFFFFF] transition-colors"
              placeholder="admin@workerzexit.tw"
            />
          </div>
          <div>
            <label className="block text-xs text-[#888888] mb-2 tracking-widest uppercase">密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#262626] border border-[#2A2A2A] text-[#EDEDED] px-3 py-3 text-sm focus:outline-none focus:border-[#FFFFFF] transition-colors"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="text-[#D94F3D] text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFFFFF] text-[#0F0F0F] py-3 font-bold text-sm tracking-widest uppercase hover:bg-[#CCCCCC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </form>
      </div>
    </div>
  )
}
