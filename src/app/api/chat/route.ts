// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { pusherServer, chatChannel } from '@/lib/pusher'
import { z } from 'zod'

const sendSchema = z.object({
  chatRoomId: z.string(),
  receiverId: z.string(),
  content: z.string().min(1).max(1000),
})

// GET: Messages for a chat room
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const chatRoomId = searchParams.get('chatRoomId')
  if (!chatRoomId) return NextResponse.json({ error: 'chatRoomId required' }, { status: 400 })

  // Verify user belongs to this chat room
  const chatRoom = await prisma.chatRoom.findFirst({
    where: {
      id: chatRoomId,
      OR: [
        { user1Id: session.userId },
        { user2Id: session.userId },
      ],
    },
  })
  if (!chatRoom) return NextResponse.json({ error: 'Chat room not found' }, { status: 404 })

  const messages = await prisma.message.findMany({
    where: { chatRoomId },
    include: { sender: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'asc' },
    take: 100,
  })

  // Mark as read
  await prisma.message.updateMany({
    where: { chatRoomId, receiverId: session.userId, isRead: false },
    data: { isRead: true },
  })

  return NextResponse.json({ messages })
}

// POST: Send a message
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { chatRoomId, receiverId, content } = sendSchema.parse(body)

    // Verify chat room membership
    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        id: chatRoomId,
        OR: [{ user1Id: session.userId }, { user2Id: session.userId }],
      },
    })
    if (!chatRoom) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

    const message = await prisma.message.create({
      data: {
        chatRoomId,
        senderId: session.userId,
        receiverId,
        content,
      },
      include: { sender: { select: { id: true, name: true } } },
    })

    // Push real-time event
    await pusherServer.trigger(
      chatChannel(chatRoomId),
      'new-message',
      message
    )

    return NextResponse.json({ success: true, message })
  } catch (error: any) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Message not sent' }, { status: 500 })
  }
}
