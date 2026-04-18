import 'dotenv/config'
import { PrismaClient, AdminRole, ProductTag } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 開始建立初始資料...')

  // ─── 管理帳號 ─────────────────────────────────────────────
  const superAdmin = await prisma.adminUser.upsert({
    where: { email: 'admin@workerzexit.tw' },
    update: {},
    create: {
      name: '超級管理員',
      email: 'admin@workerzexit.tw',
      passwordHash: await bcrypt.hash('WorkerzExit2024!', 12),
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  })
  console.log(`✅ 管理帳號建立: ${superAdmin.email}`)

  // ─── 商品分類 ─────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'waist-tools' },
      update: {},
      create: { name: '腰道具 / 工具袋', slug: 'waist-tools', sortOrder: 1, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'storage-bags' },
      update: {},
      create: { name: '攜行收納', slug: 'storage-bags', sortOrder: 2, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'measuring-tools' },
      update: {},
      create: { name: '水平測量工具', slug: 'measuring-tools', sortOrder: 3, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'safety-gear' },
      update: {},
      create: { name: '安全護具', slug: 'safety-gear', sortOrder: 4, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: { name: '五金配件', slug: 'accessories', sortOrder: 5, isActive: true },
    }),
  ])
  console.log(`✅ 商品分類建立: ${categories.length} 個`)

  const [waistTools, storageBags, measuringTools, safetyGear, accessories] = categories

  const BASE_URL = 'https://panricopro.com/collections/exit%E6%97%A5%E6%9C%AC%E8%81%B7%E4%BA%BA%E7%B3%BB%E5%88%97'

  // ─── 商品資料 ─────────────────────────────────────────────
  const productsData = [
    // 腰道具 / 工具袋
    {
      name: '單孔鉗袋',
      slug: 'plier-bag-single',
      description: '日本職人工藝，人工皮革製，耐用防磨，適合各式鉗類工具收納。不鏽鋼五金配件，專業級品質。',
      price: 2900,
      externalUrl: BASE_URL,
      categoryId: waistTools.id,
      tags: [ProductTag.NEW],
      isFeatured: true,
      sortOrder: 1,
    },
    {
      name: '雙孔鉗袋',
      slug: 'plier-bag-dual',
      description: '雙孔設計，可同時收納兩把鉗類工具，人工皮革製，耐用耐磨，不鏽鋼扣環。',
      price: 3500,
      externalUrl: BASE_URL,
      categoryId: waistTools.id,
      tags: [],
      isFeatured: false,
      sortOrder: 2,
    },
    {
      name: '三孔鉗袋',
      slug: 'plier-bag-triple',
      description: '三孔大容量設計，可收納多把鉗具，專業工班師傅首選，人工皮革製。',
      price: 4220,
      externalUrl: BASE_URL,
      categoryId: waistTools.id,
      tags: [],
      isFeatured: false,
      sortOrder: 3,
    },
    {
      name: '標準鎚袋',
      slug: 'hammer-pouch-standard',
      description: '標準尺寸鎚袋，人工皮革製造，安全扣環設計，防止工具掉落，適合各式鎚類工具。',
      price: 2600,
      externalUrl: BASE_URL,
      categoryId: waistTools.id,
      tags: [],
      isFeatured: false,
      sortOrder: 4,
    },
    {
      name: '大型鎚袋',
      slug: 'hammer-pouch-large',
      description: '加大尺寸，適合大型鐵鎚或特殊工具，加厚人工皮革，強化縫線設計。',
      price: 2820,
      externalUrl: BASE_URL,
      categoryId: waistTools.id,
      tags: [],
      isFeatured: false,
      sortOrder: 5,
    },
    {
      name: 'S 尺寸水平尺袋',
      slug: 'level-pouch-s',
      description: '小型水平尺專用收納袋，人工皮革製，保護水平尺不受碰撞，快速取放設計。',
      price: 2600,
      externalUrl: BASE_URL,
      categoryId: waistTools.id,
      tags: [],
      isFeatured: false,
      sortOrder: 6,
    },
    {
      name: 'M 尺寸水平尺袋',
      slug: 'level-pouch-m',
      description: '中型水平尺專用收納袋，加長設計，適合 300-600mm 水平尺，人工皮革製。',
      price: 2800,
      externalUrl: BASE_URL,
      categoryId: waistTools.id,
      tags: [],
      isFeatured: false,
      sortOrder: 7,
    },
    {
      name: '起子機腰掛',
      slug: 'screwdriver-machine-holder',
      description: '電動起子機專用腰掛架，快速插拔設計，人工皮革製，可調節卡扣，工作效率提升。',
      price: 3760,
      externalUrl: BASE_URL,
      categoryId: waistTools.id,
      tags: [ProductTag.NEW],
      isFeatured: true,
      sortOrder: 8,
    },
    {
      name: '鉗袋+起子袋 組合款',
      slug: 'combination-plier-screwdriver-bag',
      description: '鉗袋與起子收納袋一體設計，多功能收納，人工皮革製，不鏽鋼五金配件。',
      price: 4220,
      externalUrl: BASE_URL,
      categoryId: waistTools.id,
      tags: [],
      isFeatured: false,
      sortOrder: 9,
    },
    {
      name: '零件收納袋',
      slug: 'parts-storage-bag',
      description: '多格設計零件收納袋，螺絲、小零件分類收納，防塵防潮，尼龍材質。',
      price: 3760,
      externalUrl: BASE_URL,
      categoryId: waistTools.id,
      tags: [],
      isFeatured: false,
      sortOrder: 10,
    },

    // 攜行收納
    {
      name: 'S 尺寸工具桶',
      slug: 'tool-bucket-s',
      description: '小型工具桶，圓筒設計，適合放置零散工具，尼龍材質，附腰帶固定環。',
      price: 1280,
      externalUrl: BASE_URL,
      categoryId: storageBags.id,
      tags: [],
      isFeatured: false,
      sortOrder: 1,
    },
    {
      name: 'M 尺寸工具桶',
      slug: 'tool-bucket-m',
      description: '中型工具桶，加大容量設計，適合較長工具收納，尼龍材質，耐用防磨。',
      price: 1400,
      externalUrl: BASE_URL,
      categoryId: storageBags.id,
      tags: [],
      isFeatured: false,
      sortOrder: 2,
    },
    {
      name: '雙層腰袋',
      slug: 'waist-bag-2layer',
      description: '雙層大容量腰袋，前後雙側設計，可收納大量工具，人工皮革+尼龍材質。',
      price: 5640,
      externalUrl: BASE_URL,
      categoryId: storageBags.id,
      tags: [ProductTag.NEW],
      isFeatured: true,
      sortOrder: 3,
    },
    {
      name: '三層腰袋',
      slug: 'waist-bag-3layer',
      description: '三層超大容量腰袋，工班師傅旗艦款，全方位工具收納，人工皮革精製。',
      price: 7200,
      externalUrl: BASE_URL,
      categoryId: storageBags.id,
      tags: [],
      isFeatured: false,
      sortOrder: 4,
    },
    {
      name: '大型釘袋',
      slug: 'nail-bag',
      description: '大容量釘袋，多格分類設計，適合釘槍釘、螺絲等耗材大量收納，人工皮革製。',
      price: 7040,
      externalUrl: BASE_URL,
      categoryId: storageBags.id,
      tags: [],
      isFeatured: false,
      sortOrder: 5,
    },
    {
      name: '窄版腰袋（標準）',
      slug: 'slim-waist-bag-standard',
      description: '窄版設計，輕量舒適，適合空間有限的工作環境，人工皮革製，精緻做工。',
      price: 5640,
      externalUrl: BASE_URL,
      categoryId: storageBags.id,
      tags: [],
      isFeatured: false,
      sortOrder: 6,
    },
    {
      name: '窄版腰袋（加長）',
      slug: 'slim-waist-bag-long',
      description: '加長窄版腰袋，適合較長工具收納，纖薄設計不妨礙動作，人工皮革製。',
      price: 6360,
      externalUrl: BASE_URL,
      categoryId: storageBags.id,
      tags: [],
      isFeatured: false,
      sortOrder: 7,
    },
    {
      name: '零件袋（小）',
      slug: 'parts-bag-small',
      description: '小型零件收納袋，輕便攜帶，多格分類，適合電工、水電師傅日常使用。',
      price: 3760,
      externalUrl: BASE_URL,
      categoryId: storageBags.id,
      tags: [],
      isFeatured: false,
      sortOrder: 8,
    },
    {
      name: '零件袋（大）',
      slug: 'parts-bag-large',
      description: '大型零件收納袋，加大容量，多格設計，人工皮革製，不鏽鋼五金扣環。',
      price: 4300,
      externalUrl: BASE_URL,
      categoryId: storageBags.id,
      tags: [],
      isFeatured: false,
      sortOrder: 9,
    },

    // 水平測量工具（EBISU）
    {
      name: 'EBISU 水平尺 PRO 系列',
      slug: 'ebisu-level-pro',
      description: '日本 EBISU 品牌專業水平尺，PRO 系列高精度氣泡管，建築裝修工程必備，耐衝擊鋁合金框架。',
      price: 1600,
      externalUrl: BASE_URL,
      categoryId: measuringTools.id,
      tags: [ProductTag.NEW],
      isFeatured: true,
      sortOrder: 1,
    },
    {
      name: 'EBISU 水平尺 Mini',
      slug: 'ebisu-level-mini',
      description: '口袋型迷你水平尺，輕巧方便攜帶，精確測量，適合狹小空間使用，日本製造。',
      price: 1380,
      externalUrl: BASE_URL,
      categoryId: measuringTools.id,
      tags: [],
      isFeatured: false,
      sortOrder: 2,
    },
    {
      name: 'EBISU 水平尺 ZERO 系列',
      slug: 'ebisu-level-zero',
      description: 'ZERO 系列頂級水平尺，超高精度，附數位顯示，職人級專業測量工具，日本頂級品牌。',
      price: 6300,
      externalUrl: BASE_URL,
      categoryId: measuringTools.id,
      tags: [ProductTag.NEW],
      isFeatured: true,
      sortOrder: 3,
    },
    {
      name: 'EBISU 水平尺 鋁製系列',
      slug: 'ebisu-level-aluminum',
      description: '輕量化鋁合金水平尺，耐腐蝕防鏽，刻度清晰，適合長時間專業使用，日本製造。',
      price: 2050,
      externalUrl: BASE_URL,
      categoryId: measuringTools.id,
      tags: [],
      isFeatured: false,
      sortOrder: 4,
    },
    {
      name: 'EBISU 水平尺 Mini LED',
      slug: 'ebisu-level-mini-led',
      description: 'Mini 尺寸附 LED 燈照明，暗處施工也能清楚判讀，磁性吸附功能，日本 EBISU 製造。',
      price: 2340,
      externalUrl: BASE_URL,
      categoryId: measuringTools.id,
      tags: [],
      isFeatured: false,
      sortOrder: 5,
    },

    // 安全護具
    {
      name: '安全帶 ONE TOUCH 款',
      slug: 'safety-belt-one-touch',
      description: '快扣式 ONE TOUCH 安全帶，方便穿脫，符合台灣勞安法規，適合高空作業使用。',
      price: 1500,
      externalUrl: BASE_URL,
      categoryId: safetyGear.id,
      tags: [ProductTag.NEW],
      isFeatured: true,
      sortOrder: 1,
    },
    {
      name: '護背帶',
      slug: 'back-support-belt',
      description: '職業護背帶，長時間搬運或彎腰工作保護腰椎，透氣材質，可調節鬆緊，減少職業傷害。',
      price: 3240,
      externalUrl: BASE_URL,
      categoryId: safetyGear.id,
      tags: [],
      isFeatured: false,
      sortOrder: 2,
    },
    {
      name: 'Y 型肩帶',
      slug: 'y-type-shoulder-harness',
      description: 'Y 字型設計肩帶，分散工具重量至肩部，有效減輕腰部負擔，適合重型腰袋搭配使用。',
      price: 4400,
      externalUrl: BASE_URL,
      categoryId: safetyGear.id,
      tags: [],
      isFeatured: false,
      sortOrder: 3,
    },
    {
      name: '五點式安全帶',
      slug: 'safety-harness-5point',
      description: '五點式全身安全帶，符合高空作業安全規範，強化型固定點，適合鷹架、屋頂工程作業。',
      price: 7640,
      externalUrl: BASE_URL,
      categoryId: safetyGear.id,
      tags: [],
      isFeatured: false,
      sortOrder: 4,
    },
    {
      name: '自動收縮防墜器（單入）',
      slug: 'fall-arrest-device-1pair',
      description: '自動收縮防墜安全繩，高空作業必備，自動鎖定機制，有效防止墜落意外，單入組。',
      price: 4550,
      externalUrl: BASE_URL,
      categoryId: safetyGear.id,
      tags: [],
      isFeatured: false,
      sortOrder: 5,
    },
    {
      name: '自動收縮防墜器（雙入）',
      slug: 'fall-arrest-device-2pair',
      description: '自動收縮防墜安全繩雙入組，雙重防護保障，適合需要頻繁移動的高空作業環境。',
      price: 5990,
      externalUrl: BASE_URL,
      categoryId: safetyGear.id,
      tags: [],
      isFeatured: false,
      sortOrder: 6,
    },
    {
      name: '肩膀緩衝墊',
      slug: 'shoulder-cushion-pad',
      description: '腰袋肩帶專用緩衝墊，EVA 發泡材質，有效減輕肩部壓力，適合長時間工作使用。',
      price: 1780,
      externalUrl: BASE_URL,
      categoryId: safetyGear.id,
      tags: [],
      isFeatured: false,
      sortOrder: 7,
    },
    {
      name: '背負連結組',
      slug: 'back-carry-connection-kit',
      description: '腰袋背負連結配件組，將腰袋升級為背包式攜帶，有效分散重量，附連結帶與調節扣。',
      price: 1280,
      externalUrl: BASE_URL,
      categoryId: safetyGear.id,
      tags: [],
      isFeatured: false,
      sortOrder: 8,
    },

    // 五金配件
    {
      name: '鋁製單鉤',
      slug: 'aluminum-single-hook',
      description: '輕量鋁合金單鉤，配合腰袋或安全帶使用，承重耐用，防鏽處理，日本製造。',
      price: 840,
      externalUrl: BASE_URL,
      categoryId: accessories.id,
      tags: [],
      isFeatured: false,
      sortOrder: 1,
    },
    {
      name: '鋁製掛板',
      slug: 'aluminum-mounting-plate',
      description: '腰袋鋁製掛板，輕量耐用，適配各式腰袋固定環，快速更換工具袋組合。',
      price: 256,
      externalUrl: BASE_URL,
      categoryId: accessories.id,
      tags: [],
      isFeatured: false,
      sortOrder: 2,
    },
    {
      name: '不鏽鋼背板組（標準）',
      slug: 'stainless-back-plate-standard',
      description: '不鏽鋼腰袋背板組，強化腰袋結構，防止變形，適合重型工具收納使用。',
      price: 440,
      externalUrl: BASE_URL,
      categoryId: accessories.id,
      tags: [],
      isFeatured: false,
      sortOrder: 3,
    },
    {
      name: '不鏽鋼背板組（大型）',
      slug: 'stainless-back-plate-large',
      description: '大型不鏽鋼背板組，強化支撐，適合大型或重型腰袋使用，耐鏽抗腐蝕。',
      price: 1200,
      externalUrl: BASE_URL,
      categoryId: accessories.id,
      tags: [],
      isFeatured: false,
      sortOrder: 4,
    },
    {
      name: '皮帶環（4 入）',
      slug: 'belt-loops-4pack',
      description: '腰袋固定皮帶環 4 入組，強化尼龍材質，寬度 50mm，適配各式工作皮帶。',
      price: 440,
      externalUrl: BASE_URL,
      categoryId: accessories.id,
      tags: [],
      isFeatured: false,
      sortOrder: 5,
    },
    {
      name: '工具快扣',
      slug: 'tool-quick-clasp',
      description: '工具腰掛快速扣環，一扣即固定，輕鬆取用，適合錘子、螺絲起子等工具懸掛。',
      price: 530,
      externalUrl: BASE_URL,
      categoryId: accessories.id,
      tags: [],
      isFeatured: false,
      sortOrder: 6,
    },
    {
      name: '鉤扣止滑環',
      slug: 'hook-stop-keeper',
      description: '防止工具鉤脫落的止滑環，橡膠材質，裝設簡易，適配各式標準鉤環。',
      price: 180,
      externalUrl: BASE_URL,
      categoryId: accessories.id,
      tags: [],
      isFeatured: false,
      sortOrder: 7,
    },
  ]

  for (const productData of productsData) {
    const { tags, ...rest } = productData
    await prisma.product.upsert({
      where: { slug: rest.slug },
      update: {
        images: {
          deleteMany: {},
          create: [
            {
              url: `/製品/ホルダー系/2024_YA_351.jpg`, // 使用現有的圖片作為暫時占位圖
              alt: rest.name,
              sortOrder: 0
            }
          ]
        }
      },
      create: {
        ...rest,
        tags: tags,
        images: {
          create: [
            {
              url: `/製品/ホルダー系/2024_YA_351.jpg`, // 使用現有的圖片作為暫時占位圖
              alt: rest.name,
              sortOrder: 0
            }
          ]
        },
      },
    })
  }
  console.log(`✅ 商品建立完成: ${productsData.length} 件`)

  // ─── 預設網站設定 ─────────────────────────────────────────
  const settings = [
    { key: 'site_name', value: 'WORKERZ EXIT 台灣總代理' },
    { key: 'site_description', value: '日本職人工具腰道具品牌台灣總代理，提供最高品質的工具袋、安全護具、水平儀等專業工具配件。' },
    { key: 'hero_heading', value: '職人工具\n腰帶系統' },
    { key: 'contact_email', value: 'info@workerzexit.tw' },
    { key: 'contact_phone', value: '' },
    { key: 'contact_address', value: '台灣' },
    { key: 'instagram_url', value: '' },
    { key: 'facebook_url', value: '' },
    { key: 'line_url', value: '' },
    { key: 'shop_url', value: 'https://panricopro.com/collections/exit%E6%97%A5%E6%9C%AC%E8%81%B7%E4%BA%BA%E7%B3%BB%E5%88%97' },
  ]
  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: setting.key === 'hero_heading' ? { value: setting.value } : {},
      create: setting,
    })
  }
  console.log(`✅ 網站設定建立完成`)

  console.log('\n🎉 初始資料建立完成！')
  console.log('📧 管理員帳號: admin@workerzexit.tw')
  console.log('🔑 預設密碼: WorkerzExit2024!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await pool.end()
    await prisma.$disconnect()
  })
