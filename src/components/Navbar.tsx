'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, ShoppingBag } from 'lucide-react'

const navLinks = [
  { href: '/products', label: '所有商品' },
  { href: '/collections/waist-tools', label: '腰道具' },
  { href: '/collections/measuring-tools', label: '水平儀' },
  { href: '/collections/safety-gear', label: '安全護具' },
  { href: '/about', label: '品牌介紹' },
  { href: '/news', label: '最新消息' },
  { href: '/contact', label: '聯絡我們' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-sm border-b border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="flex flex-col justify-center">
              <span className="font-display text-[22px] md:text-[26px] font-extrabold text-white tracking-[0.12em] leading-none mb-1 group-hover:text-[#CCCCCC] transition-colors duration-200">WORKERZ EXIT</span>
              <span className="text-[10px] md:text-[11px] text-[#888888] tracking-[0.25em] uppercase leading-none">Taiwan Official</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#AAAAAA] hover:text-[#FFFFFF] transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile menu */}
          <div className="flex items-center gap-3">
            <Link
              href="https://panricopro.com/collections/exit%E6%97%A5%E6%9C%AC%E8%81%B7%E4%BA%BA%E7%B3%BB%E5%88%97"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-[#FFFFFF] text-[#0F0F0F] px-4 py-2 text-sm font-bold tracking-wide hover:bg-[#CCCCCC] transition-colors duration-200"
            >
              <ShoppingBag size={14} />
              立即選購
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-[#EDEDED] hover:text-[#FFFFFF] transition-colors"
              aria-label="開啟選單"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#111111] border-t border-[#2A2A2A]">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 px-2 text-sm text-[#AAAAAA] hover:text-[#FFFFFF] border-b border-[#2A2A2A] last:border-0 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://panricopro.com/collections/exit%E6%97%A5%E6%9C%AC%E8%81%B7%E4%BA%BA%E7%B3%BB%E5%88%97"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 bg-[#FFFFFF] text-[#0F0F0F] py-3 font-bold tracking-wide"
            >
              <ShoppingBag size={14} />
              立即選購
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
