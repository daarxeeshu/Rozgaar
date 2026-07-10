// src/app/api/workers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const trade = searchParams.get('trade')
  const district = searchParams.get('district')
  const q = searchParams.get('q')

  const workers = await prisma.workerProfile.findMany({
    where: {
      ...(trade && trade !== 'all' ? { trade: { contains: trade, mode: 'insensitive' } } : {}),
      ...(district ? { user: { district } } : {}),
      ...(q ? {
        OR: [
          { trade: { contains: q, mode: 'insensitive' } },
          { user: { name: { contains: q, mode: 'insensitive' } } },
          { services: { some: { name: { contains: q, mode: 'insensitive' } } } },
        ]
      } : {}),
    },
    include: {
      user: { select: { id: true, name: true, phone: true, district: true, area: true, aadhaarVerified: true } },
      services: { where: { isActive: true }, take: 5 },
    },
    orderBy: { avgRating: 'desc' },
    take: 50,
  })

  return NextResponse.json({ workers })
}
