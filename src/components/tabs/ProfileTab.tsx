'use client'
// src/components/tabs/ProfileTab.tsx
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'

export default function ProfileTab() {
  const { user, logout } = useAuthStore()

  const menuItems = [
    { emoji: '✏️', label: 'Profile Edit Karo',    action: () => toast('Coming soon...') },
    { emoji: '🔔', label: 'Notifications',         action: () => toast('Notifications on hain') },
    { emoji: '🌐', label: 'Zaban / Language',      action: () => toast('Kashmiri • Urdu • Hindi • English') },
    { emoji: '💰', label: 'Payment Methods',       action: () => toast('UPI, Cash — dono supported') },
    { emoji: '⭐', label: 'Meri Reviews',          action: () => toast('Coming soon...') },
    { emoji: '🆘', label: 'Madad / Help',          action: () => toast('Help: rozgaar.help@gmail.com') },
    { emoji: 'ℹ️', label: 'App ke baare mein',     action: () => toast('Rozgaar v1.0 — Made in Kashmir 🍂') },
  ]

  return (
    <div className="pb-28 overflow-y-auto" style={{ minHeight: '100dvh' }}>
      {/* Hero */}
      <div className="flex flex-col items-center py-10 px-5" style={{ background: 'var(--chinar)' }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black border-4 mb-3"
          style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
        >
          {user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : '👤'}
        </div>
        <h1 className="text-xl font-black text-white">{user?.name || 'Guest'}</h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {user?.phone}
        </p>
        <div className="flex gap-2 mt-3">
          {user?.aadhaarVerified && (
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              ✅ Aadhaar Verified
            </span>
          )}
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
            {user?.role === 'WORKER' ? '🔨 Worker' : user?.role === 'BOTH' ? '⚡ Worker + Customer' : '🔍 Customer'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-5 -mt-5 bg-white rounded-3xl grid grid-cols-3 overflow-hidden relative z-10" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid var(--border)' }}>
        {[
          { num: '0', label: 'Bookings' },
          { num: '0', label: 'Reviews' },
          { num: user?.district || 'J&K', label: 'District' },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center py-4" style={{ borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
            <p className="text-lg font-black" style={{ color: 'var(--chinar)' }}>{stat.num}</p>
            <p className="text-[10px] font-bold mt-0.5" style={{ color: 'var(--mist)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="px-5 mt-6 space-y-2">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            className="w-full flex items-center gap-3.5 p-4 bg-white rounded-2xl btn-press text-left"
            style={{ border: '1.5px solid var(--border)', fontFamily: 'var(--font-nunito)' }}
          >
            <span className="text-xl">{item.emoji}</span>
            <span className="flex-1 font-bold text-sm" style={{ color: 'var(--stone)' }}>{item.label}</span>
            <span style={{ color: 'var(--mist)' }}>›</span>
          </button>
        ))}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3.5 p-4 rounded-2xl btn-press"
          style={{ border: '1.5px solid var(--chinar-light)', background: 'var(--chinar-light)', fontFamily: 'var(--font-nunito)' }}
        >
          <span className="text-xl">🚪</span>
          <span className="flex-1 font-bold text-sm" style={{ color: 'var(--chinar)' }}>Logout</span>
        </button>
      </div>
    </div>
  )
}
