'use client'
// src/components/tabs/BookingsTab.tsx
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  CONFIRMED:   { bg: 'var(--dal-light)',     color: 'var(--dal)' },
  PENDING:     { bg: 'var(--saffron-light)', color: 'var(--saffron)' },
  COMPLETED:   { bg: '#e8f5e9',              color: '#2e7d32' },
  CANCELLED:   { bg: '#fce4ec',              color: '#c62828' },
  IN_PROGRESS: { bg: '#e3f2fd',              color: '#1565c0' },
}

export default function BookingsTab() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bookings')
      .then(r => r.json())
      .then(d => setBookings(d.bookings || []))
      .catch(() => toast.error('Bookings load nahi hui'))
      .finally(() => setLoading(false))
  }, [])

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
    })
  }

  return (
    <div className="pb-28 overflow-y-auto" style={{ minHeight: '100dvh' }}>
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <h1 className="text-xl font-black" style={{ color: 'var(--stone)' }}>📋 Meri Bookings</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--mist)' }}>Confirmed & upcoming</p>
      </div>

      <div className="px-5 pt-4 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-3xl" />
          ))
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📋</div>
            <p className="font-bold" style={{ color: 'var(--mist)' }}>Koi booking nahi</p>
            <p className="text-sm mt-1" style={{ color: 'var(--mist)' }}>Workers dhundho aur book karo</p>
          </div>
        ) : (
          bookings.map((b: any) => {
            const s = STATUS_STYLE[b.status] || STATUS_STYLE.PENDING
            return (
              <div key={b.id} className="bg-white rounded-3xl p-4" style={{ border: '1.5px solid var(--border)' }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'var(--cloud)' }}>
                    {b.workerProfile?.tradeEmoji || '🔧'}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-sm" style={{ color: 'var(--stone)' }}>{b.workerProfile?.user?.name}</p>
                    <p className="text-xs" style={{ color: 'var(--mist)' }}>{b.service?.name}</p>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                    {b.status}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm p-2.5 rounded-xl" style={{ background: 'var(--cloud)' }}>
                    <span style={{ color: 'var(--mist)' }}>📅 Date</span>
                    <span className="font-bold">{formatDate(b.scheduledAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm p-2.5 rounded-xl" style={{ background: 'var(--cloud)' }}>
                    <span style={{ color: 'var(--mist)' }}>💰 Amount</span>
                    <span className="font-bold" style={{ color: 'var(--chinar)' }}>
                      ₹{b.amount} • {b.paymentMethod === 'UPI' ? '📱 UPI' : '💵 Cash'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
