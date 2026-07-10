// src/app/api/payment/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { verifyRazorpaySignature } from '@/lib/payment'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json()

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: 'PAID',
        paymentMethod: 'UPI',
        upiTxnId: razorpay_payment_id,
        status: 'CONFIRMED',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Payment verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
