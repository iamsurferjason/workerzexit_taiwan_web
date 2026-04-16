import { prisma } from '@/lib/prisma'
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export const metadata = { title: '聯絡我們' }

async function getSettings() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ['contact_email', 'contact_phone', 'contact_address', 'shop_url'] } },
    })
    return Object.fromEntries(settings.map((s) => [s.key, s.value]))
  } catch {
    return {}
  }
}

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <div>
      <section className="relative bg-[#0F0F0F] py-24 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFFFFF]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#FFFFFF] text-xs font-bold tracking-widest uppercase mb-2">CONTACT</p>
          <h1 className="font-display text-6xl sm:text-8xl text-[#EDEDED] leading-none">
            聯絡<span className="text-[#FFFFFF]">我們</span>
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="w-8 h-0.5 bg-[#FFFFFF] mb-6" />
            <h2 className="text-2xl font-bold text-[#EDEDED] mb-4">台灣授權總代理</h2>
            <p className="text-[#AAAAAA] leading-relaxed mb-8">
              百利世貿易有限公司（Panrico）為 WORKERZ EXIT 台灣官方授權總代理，如有商品、採購或代理合作等相關問題，歡迎與我們聯繫。
            </p>

            <div className="space-y-5">
              {settings.contact_email && (
                <div className="flex items-start gap-4 p-4 border border-[#2A2A2A]">
                  <Mail size={20} className="text-[#FFFFFF] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[#555555] mb-1 tracking-widest uppercase">Email</p>
                    <a href={`mailto:${settings.contact_email}`} className="text-[#EDEDED] hover:text-[#FFFFFF] transition-colors">
                      {settings.contact_email}
                    </a>
                  </div>
                </div>
              )}
              {settings.contact_phone && (
                <div className="flex items-start gap-4 p-4 border border-[#2A2A2A]">
                  <Phone size={20} className="text-[#FFFFFF] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[#555555] mb-1 tracking-widest uppercase">電話</p>
                    <a href={`tel:${settings.contact_phone}`} className="text-[#EDEDED] hover:text-[#FFFFFF] transition-colors">
                      {settings.contact_phone}
                    </a>
                  </div>
                </div>
              )}
              {settings.contact_address && (
                <div className="flex items-start gap-4 p-4 border border-[#2A2A2A]">
                  <MapPin size={20} className="text-[#FFFFFF] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[#555555] mb-1 tracking-widest uppercase">地址</p>
                    <p className="text-[#EDEDED]">{settings.contact_address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="w-8 h-0.5 bg-[#FFFFFF] mb-6" />
            <h2 className="text-2xl font-bold text-[#EDEDED] mb-4">線上選購</h2>
            <p className="text-[#AAAAAA] leading-relaxed mb-8">
              目前商品透過台灣授權代理通路 Panrico 進行銷售，點擊下方連結即可前往選購。
            </p>
            <a
              href="https://panricopro.com/collections/exit%E6%97%A5%E6%9C%AC%E8%81%B7%E4%BA%BA%E7%B3%BB%E5%88%97"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#FFFFFF] text-[#0F0F0F] px-8 py-4 font-bold text-sm tracking-widest uppercase hover:bg-[#CCCCCC] transition-colors"
            >
              前往 Panrico 選購
              <ExternalLink size={14} />
            </a>

            <div className="mt-10 p-6 border border-[#2A2A2A] bg-[#111111]">
              <h3 className="text-sm font-bold text-[#EDEDED] mb-3 tracking-widest uppercase">常見問題</h3>
              <div className="space-y-4 text-sm text-[#888888]">
                <p>Q：商品是日本品牌的正品嗎？<br />
                  <span className="text-[#AAAAAA]">A：是的，所有 WORKERZ EXIT 商品皆由日本原廠團隊親自設計研發，並由台灣總代理正式引進的原裝正品。</span>
                </p>
                <p>Q：如何確認是否有庫存？<br />
                  <span className="text-[#AAAAAA]">A：請前往 Panrico 選購頁面確認庫存狀況。</span>
                </p>
                <p>Q：是否提供大量採購優惠？<br />
                  <span className="text-[#AAAAAA]">A：如需大量採購，歡迎透過 Email 與我們聯繫詢價。</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
