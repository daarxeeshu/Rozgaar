'use client'
// src/components/tabs/WorkerDetailTab.tsx
import { useState, useEffect } from 'react'
import { useAuthStore, useAppStore } from '@/lib/store'
import PaymentSheet from '@/components/payment/PaymentSheet'
import toast from 'react-hot-toast'

const SLOTS = ['9:00', '10:00', '11:00', '12:00', '2:00', '3:00', '4:00', '5:00']
const TAKEN = ['10:00', '3:00']

export default function WorkerDetailTab() {
  const { user } = useAuthStore()
  const { selectedWorker, setActiveTab, setActiveChatRoom } = useAppStore()
  const [worker, setWorker] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [booking, setBooking] = useState<any>(null)
  const [booking_loading, setBookingLoading] = useState(false)

  useEffect(() => {
    if (!selectedWorker) return
    fetch(`/api/workers/${selectedWorker}`)
      .then(r => r.json())
      .then(d => {
        setWorker(d.worker)
        setSelectedService(d.worker?.services?.[0] || null)
      })
      .finally(() => setLoading(false))
  }, [selectedWorker])

  async function createBooking() {
    if (!selectedSlot) { toast.error('Slot chuniye pehle ⏰'); return }
    if (!selectedService) { toast.error('Service chuniye'); return }
    setBookingLoading(true)
    try {
      const scheduledAt = new Date()
      scheduledAt.setHours(parseInt(selectedSlot), 0, 0, 0)
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerProfileId: worker.id,
          serviceId: selectedService.id,
          scheduledAt: scheduledAt.toISOString(),
          paymentMethod: 'UPI',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBooking(data.booking)
      setShowPayment(true)
    } catch (e: any) {
      toast.error(e.message || 'Booking nahi hui')
    } finally {
      setBookingLoading(false)
    }
  }

  function openChat() {
    if (worker?.chatRoomId) {
      setActiveChatRoom(worker.chatRoomId)
    }
    setActiveTab('chat')
  }

  if (loading) {
    return (
      <div className="p-5 space-y-3">
        <div className="skeleton h-48 rounded-3xl" />
        <div className="skeleton h-24 rounded-2xl" />
        <div className="skeleton h-36 rounded-2xl" />
      </div>
    )
  }
  if (!worker) return <div className="p-10 text-center" style={{ color: 'var(--mist)' }}>Worker nahi mila</div>

  return (
    <div className="pb-4 overflow-y-auto" style={{ minHeight: '100dvh' }}>
      {/* Hero */}
      <div className="relative" style={{ background: 'var(--chinar)', padding: '52px 20px 28px' }}>
        <button
          onClick={() => setActiveTab('home')}
          className="absolute top-4 left-4 btn-press text-white font-black"
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 12, width: 38, height: 38, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ‹
        </button>

        <div className="flex flex-col items-center gap-2">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            {worker.tradeEmoji}
          </div>
          <h1 className="text-2xl font-black text-white">
            {worker.user?.name}
            {worker.user?.aadhaarVerified && <span className="ml-1 text-base">✅</span>}
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {worker.trade} • {worker.user?.area || worker.user?.district}
          </p>
          <div className="flex gap-2 mt-1">
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              ⭐ {worker.avgRating > 0 ? worker.avgRating.toFixed(1) : 'New'} ({worker.totalReviews})
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${worker.isAvailable ? 'bg-green-400 text-green-900' : 'bg-yellow-400 text-yellow-900'}`}>
              {worker.isAvailable ? '✅ Available' : '⏳ Busy'}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Chat button */}
        <button
          onClick={openChat}
          className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 btn-press"
          style={{ background: 'var(--cloud)', border: '1.5px solid var(--border)', color: 'var(--stone)', fontFamily: 'var(--font-nunito)' }}
        >
          💬 Direct chat karo {worker.user?.name?.split(' ')[0] || 'worker'} se
        </button>

        {/* Services */}
        <div>
          <p className="text-xs font-black uppercase tracking-wide mb-3" style={{ color: 'var(--mist)' }}>Services & Rates</p>
          <div className="space-y-2">
            {worker.services?.map((s: any) => (
              <div
                key={s.id}
                onClick={() => setSelectedService(s)}
                className="flex items-center justify-between p-4 rounded-2xl cursor-pointer btn-press transition-all"
                style={{
                  background: selectedService?.id === s.id ? 'var(--chinar-light)' : 'var(--cloud)',
                  border: `1.5px solid ${selectedService?.id === s.id ? 'var(--chinar)' : 'transparent'}`,
                }}
              >
                <div>
                  <p className="font-black text-sm" style={{ color: 'var(--stone)' }}>{s.name}</p>
                  {s.durationMins && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--mist)' }}>⏱ ~{s.durationMins} min</p>
                  )}
                </div>
                <p className="font-black text-base" style={{ color: 'var(--chinar)' }}>
                  ₹{s.price}
                  <span className="text-xs font-semibold" style={{ color: 'var(--mist)' }}>
                    /{s.priceUnit === 'PER_VISIT' ? 'visit' : s.priceUnit === 'PER_HOUR' ? 'hr' : 'day'}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <p className="text-xs font-black uppercase tracking-wide mb-3" style={{ color: 'var(--mist)' }}>Aaj ke Available Slots</p>
          <div className="grid grid-cols-4 gap-2">
            {SLOTS.map(slot => {
              const taken = TAKEN.includes(slot)
              return (
                <button
                  key={slot}
                  onClick={() => !taken && setSelectedSlot(slot)}
                  disabled={taken}
                  className="py-2.5 rounded-xl text-sm font-bold btn-press transition-all"
                  style={{
                    background: taken ? 'var(--border)' : selectedSlot === slot ? 'var(--chinar)' : 'var(--cloud)',
                    color: taken ? 'var(--mist)' : selectedSlot === slot ? 'white' : 'var(--stone)',
                    border: '1.5px solid transparent',
                    textDecoration: taken ? 'line-through' : 'none',
                    cursor: taken ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-nunito)',
                  }}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        </div>

        {/* About */}
        {worker.bio && (
          <div>
            <p className="text-xs font-black uppercase tracking-wide mb-2" style={{ color: 'var(--mist)' }}>Apne baare mein</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--stone)' }}>{worker.bio}</p>
          </div>
        )}

        {/* Book CTA */}
        <button
          onClick={createBooking}
          disabled={booking_loading || !selectedSlot}
          className="w-full py-4 rounded-2xl text-white font-black text-base btn-press"
          style={{
            background: booking_loading || !selectedSlot ? 'var(--border)' : 'var(--chinar)',
            color: booking_loading || !selectedSlot ? 'var(--mist)' : 'white',
            border: 'none',
          }}
        >
          {booking_loading ? '⏳ Booking ho rahi hai...' : !selectedSlot ? 'Pehle slot chuniye ⏰' : `📅 Book Karo — ₹${selectedService?.price || ''}`}
        </button>
      </div>

      {/* Payment sheet */}
      {showPayment && booking && (
        <PaymentSheet
          bookingId={booking.id}
          amount={booking.amount}
          workerName={worker.user?.name || 'Worker'}
          serviceName={selectedService?.name || 'Service'}
          onPaid={(method) => {
            setShowPayment(false)
            toast.success(method === 'UPI' ? 'UPI payment ho gaya! 🎉' : 'Cash booking confirm! 💵')
            setActiveTab('bookings')
          }}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  )
}
