// src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyOtp } from '@/lib/sms'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const schema = z.object({
  phone: z.string().regex(/^\+91[6-9]\d{9}$/),
  otp: z.string().length(6),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phone, otp } = schema.parse(body)

    const isValid = await verifyOtp(phone, otp)
    if (!isValid) {
      return NextResponse.json({ error: 'Galat OTP. Dobara koshish karo.' }, { status: 400 })
    }

    // Get or create user
    let user = await prisma.user.findUnique({ where: { phone } })
    const isNewUser = !user

    if (!user) {
      user = await prisma.user.create({
        data: { phone, role: 'CUSTOMER' },
      })
    }

    // Set session
    const session = await getSession()
    session.userId = user.id
    session.phone = user.phone
    session.isLoggedIn = true
    await session.save()

    return NextResponse.json({
      success: true,
      isNewUser,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        aadhaarVerified: user.aadhaarVerified,
      },
    })
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Verify OTP error:', error)
    return NextResponse.json({ error: 'Server error. Try again.' }, { status: 500 })
  }
}
