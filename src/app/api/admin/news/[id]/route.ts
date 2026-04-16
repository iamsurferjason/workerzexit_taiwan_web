import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const news = await prisma.news.update({
    where: { id },
    data: {
      ...body,
      publishedAt: body.status === 'PUBLISHED' ? (await prisma.news.findUnique({ where: { id } }))?.publishedAt ?? new Date() : null,
    },
  })
  return NextResponse.json(news)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.news.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
