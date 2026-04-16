import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const products = await prisma.product.findMany({
    include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 }, category: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { imageUrl, imageAlt, ...rest } = body

  const product = await prisma.product.create({
    data: {
      ...rest,
      images: imageUrl ? { create: [{ url: imageUrl, alt: imageAlt || '', sortOrder: 0 }] } : undefined,
    },
    include: { images: true, category: true },
  })
  return NextResponse.json(product)
}
