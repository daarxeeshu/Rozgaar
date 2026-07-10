// src/app/api/auth/setup-profile/route.ts
// Aadhaar-based profile setup
// NOTE: For real Aadhaar OTP verification, integrate UIDAI's Auth API
// or a licensed AUA (Authentication User Agency) like Digio, Karza, or SignDesk.
// This implementation stores last-4 digits and name as entered by user,
// with a placeholder for official UIDAI verification.

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(60),
  aadhaarLast4: z.string().length(4).regex(/^\d{4}$/),
  role: z.enum(['CUSTOMER', 'WORKER', 'BOTH']),
  district: z.string(),
  area: z.string().optional(),
  trade: z.string().optional(),
  tradeEmoji: z.string().optional(),
  bio: z.string().optional(),
  yearsExp: z.number().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Pehle login karo' }, { status: 401 })
    }

    const body = await req.json()
    const data = schema.parse(body)

    // Update user profile
    const user = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: data.name,
        aadhaarLast4: data.aadhaarLast4,
        aadhaarVerified: true, // In production: verify via UIDAI/AUA
        role: data.role,
        district: data.district,
        area: data.area,
      },
    })

    // If worker, create worker profile
    if ((data.role === 'WORKER' || data.role === 'BOTH') && data.trade) {
      await prisma.workerProfile.upsert({
        where: { userId: session.userId },
        create: {
          userId: session.userId,
          trade: data.trade,
          tradeEmoji: data.tradeEmoji || '🔧',
          bio: data.bio,
          yearsExp: data.yearsExp,
        },
        update: {
          trade: data.trade,
          tradeEmoji: data.tradeEmoji || '🔧',
          bio: data.bio,
          yearsExp: data.yearsExp,
        },
      })
    }

    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Profile setup error:', error)
    return NextResponse.json({ error: 'Could not save profile' }, { status: 500 })
  }
}
