'use client'
// src/components/chat/ChatWindow.tsx
import { useState, useEffect, useRef } from 'react'
import { getPusherClient, chatChannel } from '@/lib/pusher'
import { useAuthStore } from '@/lib/store'
import { ChatMessage } from '@/types'
import toast from 'react-hot-toast'

interface Props {
  chatRoomId: string
  otherUser: { id: string; name: string; trade?: string; emoji?: string }
  onBack: () => void
}

export default function ChatWindow({ chatRoomId, otherUser, onBack }: Props) {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load messages
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/chat?chatRoomId=${chatRoomId}`)
        const data = await res.json()
        setMessages(data.messages || [])
      } catch {
        toast.error('Messages load nahi hue')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [chatRoomId])

  // Subscribe to Pusher channel
  useEffect(() => {
    const pusher = getPusherClient()
    const channel = pusher.subscribe(chatChannel(chatRoomId))
    channel.bind('new-message', (msg: ChatMessage) => {
      setMessages(prev => {
        if (prev.find(m => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    })
    return () => {
      channel.unbind_all()
      pusher.unsubscribe(chatChannel(chatRoomId))
    }
  }, [chatRoomId])

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const content = input.trim()
    if (!content || sending) return
    setSending(true)
    setInput('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatRoomId, receiverId: otherUser.id, content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      // Optimistic — pusher will confirm
      setMessages(prev => [...prev, data.message])
    } catch {
      toast.error('Message nahi gaya')
      setInput(content)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: 'var(--snow)' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3.5"
        style={{ background: 'var(--chinar)', paddingTop: 'max(env(safe-area-inset-top), 14px)' }}
      >
        <button
          onClick={onBack}
          className="btn-press text-white font-black text-xl"
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ‹
        </button>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: 'rgba(255,255,255,0.2)' }}
        >
          {otherUser.emoji || '👤'}
        </div>
        <div className="flex-1">
          <p className="font-black text-white text-sm leading-tight">{otherUser.name}</p>
          {otherUser.trade && (
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{otherUser.trade}</p>
          )}
        </div>
        <div className="w-2 h-2 rounded-full bg-green-400" title="Online" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => (
              <div key={i} className={`skeleton h-10 rounded-2xl ${i % 2 === 0 ? 'ml-auto w-48' : 'w-56'}`} />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">💬</div>
            <p className="font-bold text-sm" style={{ color: 'var(--mist)' }}>
              Baat shuru karo
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--mist)' }}>
              Salaam ke saath shuru karo 👋
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.senderId === user?.id
            const showTime = i === 0 || 
              new Date(msg.createdAt).getMinutes() !== new Date(messages[i-1]?.createdAt).getMinutes()
            return (
              <div key={msg.id}>
                {showTime && (
                  <p className="text-center text-[10px] font-semibold my-2" style={{ color: 'var(--mist)' }}>
                    {formatTime(msg.createdAt)}
                  </p>
                )}
                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={isMe ? 'bubble-out' : 'bubble-in'}>
                    {msg.content}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="scroll-x px-4 pb-2 flex gap-2">
        {['Theek hai ✓', 'Kab aa sakte ho?', 'Rate kya hai?', 'Kal available?', 'Shukriya 🙏'].map(q => (
          <button
            key={q}
            onClick={() => { setInput(q); inputRef.current?.focus() }}
            className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 btn-press"
            style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--stone)', fontFamily: 'var(--font-nunito)' }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        className="flex gap-2 px-4 py-3"
        style={{
          background: 'white',
          borderTop: '1px solid var(--border)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Message likho..."
          className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold outline-none"
          style={{
            border: '1.5px solid var(--border)',
            background: 'var(--cloud)',
            color: 'var(--stone)',
            fontFamily: 'var(--font-nunito)',
          }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || sending}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black btn-press transition-all"
          style={{
            background: !input.trim() || sending ? 'var(--border)' : 'var(--chinar)',
            border: 'none',
            flexShrink: 0,
          }}
        >
          {sending ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  )
}
