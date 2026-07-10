// src/app/api/auth/verify-otp/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { z } from 'zod'

const schema = z.object({
  phone: z.string().regex(/^\+91[6-9]\d{9}$/),
  otp: z.string().length(6),
})

const DEV_OTP = '123456'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phone, otp } = schema.parse(body)

    // ✅ Mock OTP
    if (otp !== DEV_OTP) {
      return NextResponse.json(
        {
          error: 'Invalid OTP',
        },
        {
          status: 400,
        }
      )
    }

    // Find or Create User
    let user = await prisma.user.findUnique({
      where: {
        phone,
      },
    })

    const isNewUser = !user

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          role: 'CUSTOMER',
        },
      })
    }

    // Create Session
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
      return NextResponse.json(
        {
          error: error.errors[0].message,
        },
        {
          status: 400,
        }
      )
    }

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
