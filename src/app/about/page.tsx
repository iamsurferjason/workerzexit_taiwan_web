import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: '品牌故事',
  description: '認識 WORKERZ EXIT 品牌故事、職人工藝理念與台灣授權總代理資訊。',
  path: '/about',
})

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[#0F0F0F] py-24 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFFFFF]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#FFFFFF] text-xs font-bold tracking-widest uppercase mb-2">ABOUT</p>
          <h1 className="font-display text-6xl sm:text-8xl text-[#EDEDED] leading-none mb-6">
            BRAND<br /><span className="text-[#FFFFFF]">STORY</span>
          </h1>
          <p className="text-lg text-[#AAAAAA] max-w-xl">
            源自日本的職人精神，為每一位台灣師傅打造最值得信賴的工作夥伴。
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <div className="w-8 h-0.5 bg-[#FFFFFF] mb-4" />
              <h2 className="text-2xl font-bold text-[#EDEDED] mb-4">關於 WORKERZ EXIT</h2>
              <div className="space-y-4 text-[#AAAAAA] leading-relaxed">
                <p>
                  WORKERZ EXIT 是來自日本的頂級職人工具配件品牌，專為現場工班師傅設計製造。每一件產品都經過日本職人的嚴格把關，採用優質人工皮革、尼龍及不鏽鋼五金配件，確保在高強度的工作環境中仍能保持卓越的耐久性與實用性。
                </p>
                <p>
                  品牌名稱「WORKERZ EXIT」代表著工作者的出路與突破——透過更好的工具，讓每一位師傅能夠更有效率、更安全地完成工作，走向更好的職人生涯。
                </p>
              </div>
            </div>

            <div>
              <div className="w-8 h-0.5 bg-[#FFFFFF] mb-4" />
              <h2 className="text-2xl font-bold text-[#EDEDED] mb-4">台灣總代理：百利世貿易</h2>
              <div className="space-y-4 text-[#AAAAAA] leading-relaxed">
                <p>
                  百利世貿易有限公司（Panrico）為 WORKERZ EXIT 品牌台灣官方授權總代理商，致力於將日本頂級職人工具帶進台灣市場，服務台灣各行業的工班師傅。
                </p>
                <p>
                  透過台灣授權代理通路選購，您可享有完整的商品品質保障、正品認證，以及在地化的服務支援。
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="w-8 h-0.5 bg-[#FFFFFF] mb-4" />
              <h2 className="text-2xl font-bold text-[#EDEDED] mb-6">品牌核心價值</h2>
            </div>
            {[
              { num: '01', title: '職人工藝', desc: '每件產品都承載著日本職人數十年的工藝傳承，細節精雕，品質如一。' },
              { num: '02', title: '耐久可靠', desc: '嚴選高品質材料，在惡劣工作環境下仍能持久耐用，陪伴師傅每一天。' },
              { num: '03', title: '實用設計', desc: '以工班師傅的實際需求為出發點，每項設計都有其功能性，沒有多餘裝飾。' },
              { num: '04', title: '安全保護', desc: '安全護具符合標準規範，從腰袋到安全帶，全方位保護師傅的工作安全。' },
            ].map((item) => (
              <div key={item.num} className="flex gap-6 p-5 border border-[#2A2A2A] hover:border-[#FFFFFF]/50 transition-colors">
                <span className="font-display text-3xl text-[#FFFFFF]/30 shrink-0">{item.num}</span>
                <div>
                  <h3 className="font-bold text-[#EDEDED] mb-1">{item.title}</h3>
                  <p className="text-sm text-[#888888] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#111111] border-t border-[#2A2A2A] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#EDEDED] mb-4">準備好選購了嗎？</h2>
          <p className="text-[#888888] mb-8">透過台灣授權代理通路，選購正品 WORKERZ EXIT 職人工具。</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products" className="inline-flex items-center gap-2 border border-[#FFFFFF] text-[#FFFFFF] px-8 py-3 font-bold text-sm tracking-widest uppercase hover:bg-[#FFFFFF]/10 transition-colors">
              瀏覽商品
            </Link>
            <Link
              href="https://panricopro.com/collections/exit%E6%97%A5%E6%9C%AC%E8%81%B7%E4%BA%BA%E7%B3%BB%E5%88%97"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#FFFFFF] text-[#0F0F0F] px-8 py-3 font-bold text-sm tracking-widest uppercase hover:bg-[#CCCCCC] transition-colors"
            >
              <ShoppingBag size={14} />
              立即選購
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
