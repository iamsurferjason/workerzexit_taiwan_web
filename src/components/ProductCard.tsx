import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export type ProductCardProduct = {
  id: string
  name: string
  slug: string
  price: number
  externalUrl: string
  tags: string[]
  images: { url: string; alt: string | null }[]
  category: { name: string }
}

const tagLabels: Record<string, { label: string; color: string }> = {
  NEW: { label: 'NEW', color: 'bg-white text-[#0F0F0F]' },
  SOLD_OUT: { label: '已售完', color: 'bg-[#2A2A2A] text-[#666666]' },
  FEATURED: { label: '精選', color: 'bg-white/10 text-white border border-white/20' },
  SALE: { label: '特價', color: 'bg-[#D94F3D] text-white' },
}

function ProductPlaceholder({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#141414] gap-2">
      <div className="font-display text-5xl text-white/10 leading-none select-none tracking-widest">WE</div>
      <div className="text-[9px] text-[#2A2A2A] font-bold tracking-widest text-center px-4 line-clamp-1 uppercase">{name}</div>
    </div>
  )
}

export default function ProductCard({ product }: { product: ProductCardProduct }) {
  const mainImage = product.images[0]?.url
  const isSoldOut = product.tags.includes('SOLD_OUT')

  return (
    <div className="card-industrial group flex flex-col">
      {/* Image → product detail */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square bg-[#141414] overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.images[0]?.alt || product.name}
              fill
              unoptimized
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <ProductPlaceholder name={product.name} />
          )}

          {/* Tags */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.tags.slice(0, 2).map((tag) => {
              const t = tagLabels[tag]
              return t ? (
                <span key={tag} className={`text-[9px] font-bold px-2 py-0.5 tracking-wider ${t.color}`}>
                  {t.label}
                </span>
              ) : null
            })}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] font-bold text-white tracking-[0.2em] uppercase bg-black/70 px-4 py-2 border border-white/20">
              查看詳情
            </span>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2 border-t border-[#1E1E1E]">
        <p className="text-[9px] text-[#444444] font-bold tracking-[0.25em] uppercase">
          {product.category.name}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-bold text-[#CCCCCC] leading-snug line-clamp-2 hover:text-white transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="text-base font-bold text-white tabular-nums">
            NT${product.price.toLocaleString()}
          </span>
          <a
            href={isSoldOut ? undefined : product.externalUrl}
            target={isSoldOut ? undefined : '_blank'}
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-2 tracking-widest uppercase transition-colors shrink-0 ${
              isSoldOut
                ? 'bg-[#1E1E1E] text-[#3A3A3A] cursor-not-allowed'
                : 'bg-white text-[#0F0F0F] hover:bg-[#EDEDED]'
            }`}
            onClick={isSoldOut ? (e) => e.preventDefault() : undefined}
          >
            {isSoldOut ? '已售完' : (
              <>前往購買 <ExternalLink size={10} /></>
            )}
          </a>
        </div>
      </div>
    </div>
  )
}
