'use client'
// src/components/MainApp.tsx
import { useAppStore } from '@/lib/store'
import BottomNav from '@/components/ui/BottomNav'
import HomeTab from '@/components/tabs/HomeTab'
import PostAdTab from '@/components/tabs/PostAdTab'
import BookingsTab from '@/components/tabs/BookingsTab'
import ChatListTab from '@/components/tabs/ChatListTab'
import ProfileTab from '@/components/tabs/ProfileTab'
import WorkerDetailTab from '@/components/tabs/WorkerDetailTab'

export default function MainApp() {
  const { activeTab } = useAppStore()

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--snow)' }}>
      <div className="kashmiri-stripe" />

      <div className="flex-1 relative">
        {activeTab === 'home'          && <HomeTab />}
        {activeTab === 'post'          && <PostAdTab />}
        {activeTab === 'bookings'      && <BookingsTab />}
        {activeTab === 'chat'          && <ChatListTab />}
        {activeTab === 'profile'       && <ProfileTab />}
        {activeTab === 'worker-detail' && <WorkerDetailTab />}
      </div>

      {activeTab !== 'worker-detail' && (
        <BottomNav />
      )}

      {/* Developer credit */}
      <div
        style={{
          position: 'fixed',
          bottom: 72,
          right: 12,
          zIndex: 999,
          background: 'rgba(74, 71, 68, 0.75)',
          color: 'white',
          fontSize: 9,
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: 20,
          letterSpacing: '0.3px',
          pointerEvents: 'none',
          backdropFilter: 'blur(4px)',
        }}
      >
        dev by Daarxeeshu
      </div>
    </div>
  )
}