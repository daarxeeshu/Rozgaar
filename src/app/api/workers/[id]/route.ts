import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Worker ID missing' }, { status: 400 })
  }

  const worker = await prisma.workerProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          district: true,
          area: true,
          aadhaarVerified: true,
        },
      },
      services: {
        where: { isActive: true },
        orderBy: { price: 'asc' },
      },
      _count: { select: { bookings: true } },
    },
  })

  if (!worker) {
    return NextResponse.json({ error: 'Worker not found' }, { status: 404 })
  }

  let chatRoomId: string | null = null
  if (session.isLoggedIn && session.userId && session.userId !== worker.userId) {
    const [u1, u2] = [session.userId, worker.userId].sort()
    const chatRoom = await prisma.chatRoom.findUnique({
      where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
    })
    chatRoomId = chatRoom?.id || null
  }

  return NextResponse.json({ worker: { ...worker, chatRoomId } })
}