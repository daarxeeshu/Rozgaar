// src/app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { pusherServer, userChannel } from '@/lib/pusher'
import { z } from 'zod'

const createSchema = z.object({
  workerProfileId: z.string(),
  serviceId: z.string(),
  scheduledAt: z.string().datetime(),
  paymentMethod: z.enum(['CASH', 'UPI']),
  notes: z.string().optional(),
})

// GET: My bookings
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.userId },
    include: {
      service: true,
      workerProfile: {
        include: {
          user: { select: { id: true, name: true, phone: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ bookings })
}

// POST: Create booking
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Pehle login karo' }, { status: 401 })
    }

    const body = await req.json()
    const data = createSchema.parse(body)

    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
      include: { workerProfile: { include: { user: true } } },
    })
    if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })

    // Create or find chat room between customer and worker
    const workerId = service.workerProfile.user.id
    const [u1, u2] = [session.userId, workerId].sort()
    
    const chatRoom = await prisma.chatRoom.upsert({
      where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
      create: { user1Id: u1, user2Id: u2 },
      update: {},
    })

    const booking = await prisma.booking.create({
      data: {
        customerId: session.userId,
        workerProfileId: data.workerProfileId,
        serviceId: data.serviceId,
        scheduledAt: new Date(data.scheduledAt),
        paymentMethod: data.paymentMethod,
        amount: service.price,
        notes: data.notes,
        chatRoomId: chatRoom.id,
      },
      include: {
        service: true,
        workerProfile: { include: { user: { select: { name: true, phone: true } } } },
      },
    })

    // Send real-time notification to worker
    await pusherServer.trigger(
      userChannel(workerId),
      'new-booking',
      {
        bookingId: booking.id,
        customerName: (await prisma.user.findUnique({ where: { id: session.userId } }))?.name,
        serviceName: service.name,
        scheduledAt: booking.scheduledAt,
        amount: booking.amount,
      }
    )

    return NextResponse.json({ success: true, booking })
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Booking failed. Try again.' }, { status: 500 })
  }
}
