'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'

type BannerItem = {
  id: string
  imageUrl: string
  imageMobile?: string | null
  title?: string | null
  ctaText?: string | null
  ctaUrl?: string | null
}

const FALLBACK_BANNERS: BannerItem[] = [
  { id: 'f1', imageUrl: '/images/banners/banner-03.jpg' },
  { id: 'f2', imageUrl: '/images/banners/banner-02.jpg' },
  { id: 'f3', imageUrl: '/images/banners/banner-01.jpg' },
]

const INTERVAL = 5000

export default function HeroCarousel({ banners: dbBanners, heading = 'WORKERZ\nEXIT' }: { banners?: BannerItem[]; heading?: string }) {
  const banners = dbBanners && dbBanners.length > 0 ? dbBanners : FALLBACK_BANNERS
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTransitioning(true)
      window.setTimeout(() => {
        setCurrent((prev) => (prev + 1) % banners.length)
        setTransitioning(false)
      }, 600)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [banners.length])

  function goTo(index: number) {
    if (index === current) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(index)
      setTransitioning(false)
    }, 600)
  }

  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#0F0F0F] overflow-hidden">
      {/* Banner images — crossfade */}
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? (transitioning ? 0 : 1) : 0 }}
        >
          <Image
            src={banner.imageUrl}
            alt="WORKERZ EXIT"
            fill
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* Dark overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15" />

      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-white/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-28 w-full">
        <div className="max-w-2xl">
          {/* Brand mark */}
          <div className="flex items-center gap-5 md:gap-6 mb-10 md:mb-14 mt-4">
            <Image
              src="/images/logo.jpg"
              alt="WORKERZ EXIT"
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20 shrink-0 object-contain mix-blend-screen opacity-95"
            />
            <div className="h-10 md:h-12 w-[2px] shrink-0 bg-white/40" />
            <div className="flex flex-col gap-1.5 md:gap-2">
              <span className="text-white/95 text-[11px] md:text-[14px] font-bold tracking-[0.35em] uppercase leading-none">
                Official of Taiwan
              </span>
              <span className="text-white/50 text-[9px] md:text-[11px] tracking-[0.2em] uppercase leading-none">
                Passionate workers for next generation
              </span>
            </div>
          </div>

          <h1 className="font-display text-7xl sm:text-8xl lg:text-[10rem] text-white leading-none mb-6 tracking-wide">
            {heading.split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </h1>

          <div className="w-12 h-px bg-white/30 mb-6" />

          <p className="text-sm text-white/60 mb-10 leading-relaxed max-w-md tracking-wide">
            源自日本的頂級職人工具品牌——為台灣工班師傅打造的工具腰袋、安全護具與精密測量工具。
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-[#0F0F0F] px-7 py-3.5 font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#EDEDED] transition-colors duration-200"
            >
              查看所有商品
              <ArrowRight size={14} />
            </Link>
            <Link
              href="https://panricopro.com/collections/exit%E6%97%A5%E6%9C%AC%E8%81%B7%E4%BA%BA%E7%B3%BB%E5%88%97"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/30 text-white/80 px-7 py-3.5 font-bold text-xs tracking-[0.2em] uppercase hover:border-white hover:text-white transition-all duration-200"
            >
              <ShoppingBag size={14} />
              立即選購
            </Link>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Banner ${i + 1}`}
            className={`h-px transition-all duration-300 ${
              i === current ? 'w-8 bg-white' : 'w-4 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Decorative watermark */}
      <div className="absolute right-0 bottom-0 hidden xl:block pointer-events-none select-none overflow-hidden">
        <div className="font-display text-[22vw] text-white/[0.025] leading-none tracking-widest translate-x-8 translate-y-4">EXIT</div>
      </div>
    </section>
  )
}
