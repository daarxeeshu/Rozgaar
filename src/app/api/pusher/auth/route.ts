// src/app/api/pusher/auth/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { pusherServer } from '@/lib/pusher'
import { getSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.text()
  const params = new URLSearchParams(body)
  const socketId = params.get('socket_id')!
  const channelName = params.get('channel_name')!

  // Only allow access to channels this user belongs to
  const isAllowed =
    channelName === `private-user-${session.userId}` ||
    channelName.startsWith('private-chat-')

  if (!isAllowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const authResponse = pusherServer.authorizeChannel(socketId, channelName)
  return NextResponse.json(authResponse)
}
