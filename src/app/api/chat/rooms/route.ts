// src/app/api/chat/rooms/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rooms = await prisma.chatRoom.findMany({
    where: {
      OR: [
        { user1Id: session.userId },
        { user2Id: session.userId },
      ],
    },
    include: {
      user1: { select: { id: true, name: true, workerProfile: { select: { trade: true, tradeEmoji: true } } } },
      user2: { select: { id: true, name: true, workerProfile: { select: { trade: true, tradeEmoji: true } } } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const formatted = rooms.map(room => {
    const isUser1 = room.user1Id === session.userId
    const other = isUser1 ? room.user2 : room.user1
    const unreadCount = room.messages.filter(
      m => m.receiverId === session.userId && !m.isRead
    ).length

    return {
      id: room.id,
      otherUser: {
        id: other.id,
        name: other.name,
        trade: other.workerProfile?.trade,
        emoji: other.workerProfile?.tradeEmoji,
      },
      lastMessage: room.messages[0] || null,
      unreadCount,
    }
  })

  return NextResponse.json({ rooms: formatted })
}
