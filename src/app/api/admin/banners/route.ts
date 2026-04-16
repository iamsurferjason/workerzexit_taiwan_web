import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(banners)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const banner = await prisma.banner.create({ data: body })
  return NextResponse.json(banner)
}
