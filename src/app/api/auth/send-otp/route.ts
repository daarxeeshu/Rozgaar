import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Valid Indian mobile number required'),
})

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phone } = schema.parse(body)

    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Invalidate old OTPs
    await prisma.otpLog.updateMany({
      where: { phone, used: false },
      data: { used: true },
    })

    // Save new OTP
    await prisma.otpLog.create({
      data: { phone, otp, expiresAt },
    })

    // 🔥 ALWAYS SHOW OTP IN TERMINAL
    console.log(`\n=============================`)
    console.log(`📲 OTP for ${phone}: ${otp}`)
    console.log(`=============================\n`)

    // Try SMS (but NEVER fail if it breaks)
    try {
      const twilio = require('twilio')
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      )

      await client.messages.create({
        to: phone,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: `Rozgaar OTP: ${otp}`,
      })
    } catch (err) {
      console.log('⚠️ SMS failed — using terminal OTP instead')
    }

    // ✅ ALWAYS SUCCESS RESPONSE
    return NextResponse.json({
      success: true,
      message: 'OTP generated',
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}