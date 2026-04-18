import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const syncVersion = process.env.CONTENT_SYNC_VERSION?.trim()

if (!syncVersion) {
  console.log('[content-sync] CONTENT_SYNC_VERSION is not set. Skipping content sync.')
  process.exit(0)
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const tsxCli = join(process.cwd(), 'node_modules', 'tsx', 'dist', 'cli.mjs')
const seedFiles = [
  'prisma/seed.ts',
  'prisma/seed-images.ts',
  'prisma/seed-banners.ts',
  'prisma/seed-promotions.ts',
]

function runSeed(file) {
  console.log(`[content-sync] Running ${file}...`)
  const result = spawnSync(process.execPath, [tsxCli, file], {
    stdio: 'inherit',
    env: process.env,
  })

  if (result.status !== 0) {
    throw new Error(`Seed failed for ${file} with exit code ${result.status ?? 'unknown'}`)
  }
}

async function main() {
  const currentVersion = await prisma.siteSetting
    .findUnique({ where: { key: 'content_sync_version' } })
    .catch(() => null)

  if (currentVersion?.value === syncVersion) {
    console.log(`[content-sync] Content already synced at version ${syncVersion}.`)
    return
  }

  console.log(`[content-sync] Syncing canonical content to version ${syncVersion}...`)

  for (const file of seedFiles) {
    runSeed(file)
  }

  await prisma.siteSetting.upsert({
    where: { key: 'content_sync_version' },
    update: { value: syncVersion },
    create: { key: 'content_sync_version', value: syncVersion },
  })

  console.log(`[content-sync] Content sync completed at version ${syncVersion}.`)
}

main()
  .catch((error) => {
    console.error('[content-sync] Failed to sync canonical content', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
