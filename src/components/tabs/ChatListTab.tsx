'use client'
// src/components/tabs/ChatListTab.tsx
import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import ChatWindow from '@/components/chat/ChatWindow'

export default function ChatListTab() {
  const { activeChatRoom, setActiveChatRoom } = useAppStore()
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/chat/rooms')
      .then(r => r.json())
      .then(d => setRooms(d.rooms || []))
      .finally(() => setLoading(false))
  }, [])

  if (activeChatRoom) {
    const room = rooms.find(r => r.id === activeChatRoom)
    return (
      <ChatWindow
        chatRoomId={activeChatRoom}
        otherUser={room?.otherUser || { id: '', name: 'Worker' }}
        onBack={() => setActiveChatRoom(null)}
      />
    )
  }

  return (
    <div className="pb-28 overflow-y-auto" style={{ minHeight: '100dvh' }}>
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <h1 className="text-xl font-black" style={{ color: 'var(--stone)' }}>💬 Messages</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--mist)' }}>Workers se directly baat karo</p>
      </div>

      <div className="px-5 pt-4 space-y-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-2xl" />
          ))
        ) : rooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">💬</div>
            <p className="font-bold" style={{ color: 'var(--mist)' }}>Koi chat nahi</p>
            <p className="text-sm mt-1" style={{ color: 'var(--mist)' }}>Kisi worker ko book karo toh chat khulega</p>
          </div>
        ) : (
          rooms.map((room: any) => (
            <div
              key={room.id}
              onClick={() => setActiveChatRoom(room.id)}
              className="flex items-center gap-3 p-3.5 bg-white rounded-2xl cursor-pointer btn-press"
              style={{ border: '1.5px solid var(--border)' }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'var(--cloud)' }}>
                {room.otherUser?.emoji || '👤'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-black text-sm" style={{ color: 'var(--stone)' }}>{room.otherUser?.name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--mist)' }}>
                    {room.lastMessage ? new Date(room.lastMessage.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}
                  </p>
                </div>
                <p className="text-xs truncate mt-0.5" style={{ color: 'var(--mist)' }}>
                  {room.lastMessage?.content || 'Chat shuru karo...'}
                </p>
              </div>
              {room.unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center flex-shrink-0" style={{ background: 'var(--chinar)' }}>
                  {room.unreadCount}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
