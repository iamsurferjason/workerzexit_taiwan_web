import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.banner.deleteMany()

  await prisma.banner.createMany({
    data: [
      {
        title: 'TAIWAN OFFICIAL',
        subtitle: '百利世貿易 — WORKERZ EXIT 台灣官方授權總代理，正品保障、在地服務、快速出貨。',
        imageUrl: '/images/banners/banner-03.jpg',
        ctaText: '了解更多',
        ctaUrl: '/about',
        sortOrder: 0,
        isActive: true,
      },
      {
        title: 'COMPLETE SYSTEM',
        subtitle: '完整的工具腰帶系統，從鉗袋、釘袋到安全背帶，一次滿足職人的所有需求。',
        imageUrl: '/images/banners/banner-02.jpg',
        ctaText: '查看商品',
        ctaUrl: '/products',
        sortOrder: 1,
        isActive: true,
      },
      {
        title: '職人の裝備',
        subtitle: '源自日本的頂級腰道具品牌，為每一位台灣工班師傅打造最專業的工具攜帶系統。',
        imageUrl: '/images/banners/banner-01.jpg',
        ctaText: '立即選購',
        ctaUrl: 'https://panricopro.com/collections/exit%E6%97%A5%E6%9C%AC%E8%81%B7%E4%BA%BA%E7%B3%BB%E5%88%97',
        sortOrder: 2,
        isActive: true,
      },
    ],
  })

  console.log('✓ 3 banners seeded')
  await pool.end()
}

main().catch(console.error)
