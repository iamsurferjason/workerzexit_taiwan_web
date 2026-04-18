'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import {
  LayoutDashboard, Package, FolderOpen, Image, Megaphone,
  Newspaper, Users, Settings, LogOut, Menu, X,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/admin/dashboard', label: '總覽', icon: LayoutDashboard },
  { href: '/admin/products', label: '商品管理', icon: Package },
  { href: '/admin/categories', label: '分類管理', icon: FolderOpen },
  { href: '/admin/banners', label: 'Banner 管理', icon: Image },
  { href: '/admin/promotions', label: '廣告文宣', icon: Megaphone },
  { href: '/admin/news', label: '最新消息', icon: Newspaper },
  { href: '/admin/accounts', label: '帳號管理', icon: Users },
  { href: '/admin/settings', label: '網站設定', icon: Settings },
]

export default function AdminSidebar({ user }: { user: Session['user'] }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebar = (
    <aside className="w-64 bg-[#111111] border-r border-[#2A2A2A] flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-[#2A2A2A]">
        <div className="font-display text-xl text-[#FFFFFF] tracking-widest">WORKERZ EXIT</div>
        <p className="text-xs text-[#555555] mt-1">後台管理</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-[#FFFFFF]/10 text-[#FFFFFF] border-l-2 border-[#FFFFFF]'
                  : 'text-[#888888] hover:text-[#EDEDED] hover:bg-[#1A1A1A]'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-[#2A2A2A]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#FFFFFF] flex items-center justify-center text-[#0F0F0F] text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-[#EDEDED] truncate">{user?.name}</p>
            <p className="text-[10px] text-[#555555] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#888888] hover:text-[#D94F3D] transition-colors"
        >
          <LogOut size={14} />
          登出
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#EDEDED]"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 z-40">{sidebar}</div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
          <div className="lg:hidden fixed left-0 top-0 bottom-0 z-50">{sidebar}</div>
        </>
      )}
    </>
  )
}
