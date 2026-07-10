import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const booking = await prisma.booking.findUnique({
    where: { id, customerId: session.userId },
  })
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status: 'CONFIRMED',
      paymentMethod: 'CASH',
      paymentStatus: 'PENDING',
    },
  })

  return NextResponse.json({ success: true, booking: updated })
}