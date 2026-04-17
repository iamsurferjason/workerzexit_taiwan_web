import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const adminEmail = process.env.ADMIN_EMAIL || 'admin@workerzexit.tw'
const adminPassword = process.env.ADMIN_PASSWORD || 'WorkerzExit2024!'
const adminName = process.env.ADMIN_NAME || '超級管理員'

async function ensureAdminUser() {
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    console.log(`[startup] Admin user already exists: ${adminEmail}`)
    return
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12)

  await prisma.adminUser.create({
    data: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  })

  console.log(`[startup] Created bootstrap admin user: ${adminEmail}`)
}

async function main() {
  try {
    await ensureAdminUser()
  } finally {
    await pool.end()
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error('[startup] Failed to prepare runtime data', error)
  process.exit(1)
})
