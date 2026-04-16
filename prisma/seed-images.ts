import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// slug → image URLs from Panrico
const imageMap: Record<string, string[]> = {
  'plier-bag-single': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTHD01BK_N2.jpg?v=1746171154',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTHD01BK_N.jpg?v=1746171154',
  ],
  'plier-bag-dual': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTHD02BK_N.jpg?v=1746171154',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTHD02LBK_N1.jpg?v=1746598680',
  ],
  'plier-bag-triple': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTHD02LBK_N1.jpg?v=1746598680',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/al3n4-cm4si.jpg?v=1747791787',
  ],
  'hammer-pouch-standard': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTHMBK_N1.jpg?v=1746429438',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTHMBK_N.jpg?v=1746429458',
  ],
  'hammer-pouch-large': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTHMLBK_N.jpg?v=1746429461',
  ],
  'level-pouch-s': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTLCSBK_N.jpg?v=1746514749',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTLCMBK_N.jpg?v=1746514543',
  ],
  'level-pouch-m': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTLCMBK_N2.jpg?v=1746514536',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTLCMBK_N.jpg?v=1746514543',
  ],
  'screwdriver-machine-holder': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTHDPDRBK_N.jpg?v=1747040357',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTHDPDRBK_N2.jpg?v=1747040359',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTHDPDRBK_A5.jpg?v=1747040369',
  ],
  'combination-plier-screwdriver-bag': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTHDDRBK_N.jpg?v=1747104791',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTHDDRBK_N2.jpg?v=1747104794',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTHDDRBK_A2.jpg?v=1747104798',
  ],
  'tool-bucket-s': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTDBSBK_N2.jpg?v=1747124427',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTDBSBK_N.jpg?v=1747792221',
  ],
  'tool-bucket-m': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTDBMBK_N.jpg?v=1747792221',
  ],
  'waist-bag-2layer': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTKB02SBK_N2.jpg?v=1747210335',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTKB02SBK_N.jpg?v=1747210335',
  ],
  'waist-bag-3layer': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTKB02MBK_N.jpg?v=1747210335',
  ],
  'nail-bag': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTKBBK_N.jpg?v=1747301204',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTKBBK_N2.jpg?v=1747301206',
  ],
  'slim-waist-bag-standard': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTUKB02SBK_N2.jpg?v=1747367731',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTUKB02SBK_N.jpg?v=1747367737',
  ],
  'slim-waist-bag-long': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTUKB02MBK_N.jpg?v=1747367740',
  ],
  'ebisu-level-pro': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTTBP-0.jpg?v=1747730011',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTTBPBK-0.jpg?v=1747730302',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTTBPRE-0_eaf98bcb-13a0-429b-adb4-3258507f89a0.jpg?v=1747730313',
  ],
  'safety-belt-one-touch': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/00_f2e1aa21-0928-4d35-abfe-781dd6857c93.jpg?v=1747788158',
  ],
  'back-support-belt': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/abxpy-92jjm.jpg?v=1747710915',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/aoxh6-ar583.jpg?v=1747710932',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/awgvh-68ba7.jpg?v=1747710932',
  ],
  'aluminum-single-hook': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTATH-0.jpg?v=1747793006',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/a6b64-g0dz4.jpg?v=1747793006',
  ],
  'aluminum-mounting-plate': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTADD-0.jpg?v=1747792807',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/a0s3e-fgjzy.jpg?v=1747792807',
  ],
  'stainless-back-plate-standard': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/avivq-rs8qb.jpg?v=1747727045',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/agteh-9o9hx.jpg?v=1747727045',
  ],
  'stainless-back-plate-large': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/fit_cover_w_920_h_920.jpg?v=1747727045',
  ],
  'ebisu-level-mini': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTTB2-0.jpg?v=1747728294',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTTB2BK-0.jpg?v=1747728052',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTTB2RE-0.jpg?v=1747728140',
  ],
  'y-type-shoulder-harness': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/a8rbk-sucq8.jpg?v=1747709100',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/ahyxt-cfehw.jpg?v=1747709309',
  ],
  'ebisu-level-zero': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-ZTB-0_c12748be-8e23-463f-a86e-55dacebcd266.jpg?v=1747731933',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-ZTBBK-0.jpg?v=1747731933',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-ZTBRE-0.jpg?v=1747731933',
  ],
  'belt-loops-4pack': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/15_36260c5e-ceb0-43ef-928f-f6b67063939f.jpg?v=1747707329',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/2025-05-20_101600.png?v=1747707383',
  ],
  'ebisu-level-aluminum': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTTBOX-0.jpg?v=1747731060',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTTBOXBK-0.jpg?v=1747731020',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXTTBOXRE-0.jpg?v=1747731037',
  ],
  'ebisu-level-mini-led': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXT16TBLM-0.jpg?v=1747729264',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXT16TBLMBK-0.jpg?v=1747729264',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-EXT16TBLMRE-0.jpg?v=1747729264',
  ],
  'back-carry-connection-kit': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/2024_YA_518.jpg?v=1748503797',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/a8fup-wqlye.jpg?v=1747712491',
  ],
  'parts-storage-bag': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/2024_YA_546_0.jpg?v=1756687158',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/2024_YA_449_0.jpg?v=1756687158',
  ],
  'parts-bag-small': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/2024_YA_446_0.jpg?v=1756687158',
  ],
  'parts-bag-large': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/2024_YA_546_0.jpg?v=1756687158',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/2024_YA_449_0.jpg?v=1756687158',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/2024_YA_446_0.jpg?v=1756687158',
  ],
  'fall-arrest-device-2pair': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/FB.jpg?v=1774318522',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-F2-HL-HW130.jpg?v=1774318522',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/1bffa49f15572582efdfb3baa3593da2.jpg?v=1775813490',
  ],
  'shoulder-cushion-pad': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-F3-KPCKRD-YBF.jpg?v=1763685878',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/4975364266170_1.jpg?v=1763685878',
  ],
  'tool-quick-clasp': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-F4-SF-MHLD.jpg?v=1763685797',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/4975364169143_1.jpg?v=1763685841',
  ],
  'safety-harness-5point': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-F1-TH521.jpg?v=1764052469',
  ],
  'fall-arrest-device-1pair': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-F2-HL-HS130.jpg?v=1774318522',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/1bffa49f15572582efdfb3baa3593da2.jpg?v=1775813490',
  ],
  'hook-stop-keeper': [
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-F1-TUBAKIMD2-A1.jpg?v=1775107493',
    'https://cdn.shopify.com/s/files/1/0779/8115/5604/files/M002NW-F1-TUBAKIMD2-A2.jpg?v=1775107493',
  ],
}

async function main() {
  console.log('Seeding product images...')

  for (const [slug, urls] of Object.entries(imageMap)) {
    const product = await prisma.product.findUnique({ where: { slug } })
    if (!product) {
      console.log(`  ⚠ Product not found: ${slug}`)
      continue
    }

    // Delete existing images first
    await prisma.productImage.deleteMany({ where: { productId: product.id } })

    for (let i = 0; i < urls.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: urls[i],
          alt: product.name,
          sortOrder: i,
        },
      })
    }
    console.log(`  ✓ ${product.name} (${urls.length} images)`)
  }

  console.log('\nDone!')
  await pool.end()
}

main().catch(console.error)
