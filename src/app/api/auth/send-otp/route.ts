import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Valid Indian mobile number required'),
})

// Mock OTP for development
const DEV_OTP = '123456'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phone } = schema.parse(body)

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Invalidate previous OTPs
    await prisma.otpLog.updateMany({
      where: {
        phone,
        used: false,
      },
      data: {
        used: true,
      },
    })

    // Store mock OTP
    await prisma.otpLog.create({
      data: {
        phone,
        otp: DEV_OTP,
        expiresAt,
      },
    })

    console.log('==============================')
    console.log(`📲 MOCK OTP for ${phone}: ${DEV_OTP}`)
    console.log('==============================')

    return NextResponse.json({
      success: true,
      message: 'Development OTP generated',
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: 'Server error',
      },
      {
        status: 500,
      }
    )
  }
}
