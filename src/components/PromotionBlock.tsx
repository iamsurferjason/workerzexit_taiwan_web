'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

type Promotion = {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string | null
  imageMobile: string | null
  ctaText: string | null
  ctaUrl: string | null
  layout: string
}

export default function PromotionBlock({ promotions }: { promotions: Promotion[] }) {
  if (!promotions.length) return null

  const [first, ...rest] = promotions

  return (
    <section className="py-12">
      {/* ── Hero Banner (first promo, always full-width cinematic) ── */}
      <HeroBanner promo={first} />

      {/* ── Secondary Banners ── */}
      {rest.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className={`grid gap-4 ${rest.length >= 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {rest.map((promo) => (
              <SecondaryBanner key={promo.id} promo={promo} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

// ── Full-width cinematic hero banner ──────────────────────────────────────────
function HeroBanner({ promo }: { promo: Promotion }) {
  const inner = (
    <div className="relative w-full overflow-hidden" style={{ minHeight: '60vh' }}>
      {promo.imageUrl ? (
        <img
          src={promo.imageUrl}
          alt={promo.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-[#111111]" />
      )}

      {/* Multi-layer dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFFFFF]" />

      {/* Content */}
      <div className="relative z-10 flex items-center" style={{ minHeight: '60vh' }}>
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 w-full py-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-[#FFFFFF]" />
              <span className="text-[#FFFFFF] text-[10px] font-bold tracking-[0.3em] uppercase">
                WORKERZ EXIT TAIWAN
              </span>
            </div>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-none mb-5 tracking-wide">
              {promo.title}
            </h2>
            {promo.subtitle && (
              <p className="text-[#CCCCCC] text-base leading-relaxed mb-8 max-w-sm">
                {promo.subtitle}
              </p>
            )}
            {promo.ctaText && promo.ctaUrl && (
              <span className="inline-flex items-center gap-2 bg-[#FFFFFF] text-[#0F0F0F] px-7 py-3.5 text-sm font-bold tracking-widest uppercase hover:bg-white transition-colors duration-200">
                {promo.ctaText}
                <ArrowRight size={14} />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom brand watermark */}
      <div className="absolute right-8 bottom-6 hidden lg:block pointer-events-none select-none">
        <span className="font-display text-7xl text-white/5 leading-none tracking-widest">EXIT</span>
      </div>
    </div>
  )

  if (!promo.ctaUrl) return <div>{inner}</div>
  const isExternal = promo.ctaUrl.startsWith('http')
  if (isExternal) return <a href={promo.ctaUrl} target="_blank" rel="noopener noreferrer" className="block group">{inner}</a>
  return <Link href={promo.ctaUrl} className="block group">{inner}</Link>
}

// ── Secondary square/card banners ─────────────────────────────────────────────
function SecondaryBanner({ promo }: { promo: Promotion }) {
  const inner = (
    <div className="relative overflow-hidden group" style={{ minHeight: '320px' }}>
      {promo.imageUrl ? (
        <img
          src={promo.imageUrl}
          alt={promo.title}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <div className="absolute inset-0 bg-[#1A1A1A]" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      {/* Top-left accent */}
      <div className="absolute top-0 left-0 w-16 h-0.5 bg-[#FFFFFF]" />

      {/* Content anchored to bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <p className="text-[#FFFFFF] text-[9px] font-bold tracking-[0.3em] uppercase mb-2">
          WORKERZ EXIT
        </p>
        <h3 className="font-display text-3xl sm:text-4xl text-white leading-none mb-2 tracking-wide">
          {promo.title}
        </h3>
        {promo.subtitle && (
          <p className="text-[#AAAAAA] text-sm leading-relaxed mb-4 line-clamp-2">
            {promo.subtitle}
          </p>
        )}
        {promo.ctaText && promo.ctaUrl && (
          <span className="inline-flex items-center gap-1.5 text-[#FFFFFF] text-xs font-bold tracking-widest uppercase border-b border-[#FFFFFF] pb-0.5 group-hover:gap-3 transition-all duration-200">
            {promo.ctaText} <ArrowRight size={12} />
          </span>
        )}
      </div>
    </div>
  )

  if (!promo.ctaUrl) return <div>{inner}</div>
  const isExternal = promo.ctaUrl.startsWith('http')
  if (isExternal) return <a href={promo.ctaUrl} target="_blank" rel="noopener noreferrer" className="block">{inner}</a>
  return <Link href={promo.ctaUrl} className="block">{inner}</Link>
}
