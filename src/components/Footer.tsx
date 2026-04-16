import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#2A2A2A] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="font-display text-2xl text-[#FFFFFF] tracking-widest mb-2">WORKERZ EXIT</div>
            <p className="text-xs text-[#888888] tracking-widest mb-4">台灣總代理</p>
            <p className="text-sm text-[#888888] leading-relaxed">
              源自日本的頂級職人工具品牌，<br />
              為台灣工班師傅提供最高品質的<br />
              工具腰袋、安全護具與測量工具。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold text-[#EDEDED] mb-4 tracking-widest uppercase">商品分類</h4>
            <ul className="space-y-2">
              {[
                { href: '/collections/waist-tools', label: '腰道具 / 工具袋' },
                { href: '/collections/storage-bags', label: '攜行收納' },
                { href: '/collections/measuring-tools', label: '水平測量工具' },
                { href: '/collections/safety-gear', label: '安全護具' },
                { href: '/collections/accessories', label: '五金配件' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-[#888888] hover:text-[#FFFFFF] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-bold text-[#EDEDED] mb-4 tracking-widest uppercase">關於我們</h4>
            <ul className="space-y-2 mb-6">
              {[
                { href: '/about', label: '品牌故事' },
                { href: '/news', label: '最新消息' },
                { href: '/contact', label: '聯絡我們' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-[#888888] hover:text-[#FFFFFF] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="https://panricopro.com/collections/exit%E6%97%A5%E6%9C%AC%E8%81%B7%E4%BA%BA%E7%B3%BB%E5%88%97"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#FFFFFF] hover:text-[#CCCCCC] transition-colors"
            >
              <ExternalLink size={14} />
              前往 Panrico 購買
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#2A2A2A] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[#555555]">
            © {new Date().getFullYear()} WORKERZ EXIT 台灣總代理. All rights reserved.
          </p>
          <p className="text-xs text-[#555555]">
            日本職人品質 · 台灣在地服務
          </p>
        </div>
      </div>
    </footer>
  )
}
