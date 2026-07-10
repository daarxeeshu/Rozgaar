'use client'
// src/components/ui/BottomNav.tsx
import { useAppStore } from '@/lib/store'

const TABS = [
  { id: 'home',     emoji: '🏠', label: 'Home' },
  { id: 'post',     emoji: '➕', label: 'Post Ad' },
  { id: 'bookings', emoji: '📋', label: 'Bookings' },
  { id: 'chat',     emoji: '💬', label: 'Chat' },
  { id: 'profile',  emoji: '👤', label: 'Profile' },
]

interface Props {
  unreadCount?: number
}

export default function BottomNav({ unreadCount = 0 }: Props) {
  const { activeTab, setActiveTab } = useAppStore()

  return (
    <nav className="bottom-nav">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className="flex-1 flex flex-col items-center gap-0.5 py-2.5 pb-1 btn-press transition-colors relative"
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === tab.id ? 'var(--chinar)' : 'var(--mist)',
            fontFamily: 'var(--font-nunito)',
          }}
        >
          <span className="text-xl leading-none">{tab.emoji}</span>
          <span className="text-[10px] font-bold leading-none mt-0.5">{tab.label}</span>
          {tab.id === 'chat' && unreadCount > 0 && (
            <span
              className="absolute top-1.5 right-4 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
              style={{ background: 'var(--chinar)' }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      ))}
    </nav>
  )
}
