// src/lib/pusher.ts
import Pusher from 'pusher'
import PusherJS from 'pusher-js'

// ── Server-side Pusher (for triggering events from API routes) ────────────────
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
})

// ── Client-side Pusher singleton ─────────────────────────────────────────────
let pusherClient: PusherJS | null = null

export function getPusherClient(): PusherJS {
  if (!pusherClient) {
    pusherClient = new PusherJS(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher/auth',
    })
  }
  return pusherClient
}

// ── Channel naming helpers ────────────────────────────────────────────────────
export function chatChannel(chatRoomId: string) {
  return `private-chat-${chatRoomId}`
}

export function userChannel(userId: string) {
  return `private-user-${userId}`
}
