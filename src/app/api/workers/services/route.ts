// src/app/api/workers/services/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(300).optional(),
  price: z.number().min(1).max(100000),
  priceUnit: z.enum(['PER_VISIT', 'PER_HOUR', 'PER_DAY', 'PER_ITEM', 'PER_KM']),
  durationMins: z.number().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const workerProfile = await prisma.workerProfile.findUnique({
    where: { userId: session.userId },
  })
  if (!workerProfile) {
    return NextResponse.json({ error: 'Worker profile nahi hai' }, { status: 404 })
  }

  const body = await req.json()
  const data = schema.parse(body)

  const service = await prisma.service.create({
    data: {
      workerProfileId: workerProfile.id,
      ...data,
    },
  })

  return NextResponse.json({ success: true, service })
}
