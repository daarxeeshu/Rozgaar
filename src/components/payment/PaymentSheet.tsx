'use client'
// src/components/payment/PaymentSheet.tsx
import { useState } from 'react'
import toast from 'react-hot-toast'

declare global {
  interface Window { Razorpay: any }
}

interface Props {
  bookingId: string
  amount: number
  workerName: string
  serviceName: string
  onPaid: (method: 'UPI' | 'CASH') => void
  onClose: () => void
}

export default function PaymentSheet({ bookingId, amount, workerName, serviceName, onPaid, onClose }: Props) {
  const [method, setMethod] = useState<'UPI' | 'CASH'>('UPI')
  const [loading, setLoading] = useState(false)

  async function payViaUpi() {
    setLoading(true)
    try {
      // Load Razorpay script dynamically
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://checkout.razorpay.com/v1/checkout.js'
          s.onload = () => resolve()
          s.onerror = () => reject()
          document.head.appendChild(s)
        })
      }

      // Create order on server
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      })
      const order = await res.json()
      if (!res.ok) throw new Error(order.error)

      // Open Razorpay
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Rozgaar — روزگار',
        description: `${serviceName} by ${workerName}`,
        order_id: order.orderId,
        prefill: {},
        theme: { color: '#C0392B' },
        method: {
          upi: true,
          card: false,
          netbanking: false,
          wallet: false,
          emi: false,
        },
        handler: async (response: any) => {
          // Verify on server
          const vRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })
          if (vRes.ok) {
            toast.success('Payment ho gaya! ✅')
            onPaid('UPI')
          } else {
            toast.error('Payment verify nahi hua')
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      })
      rzp.open()
    } catch (e: any) {
      toast.error(e.message || 'Payment failed')
      setLoading(false)
    }
  }

  async function confirmCash() {
    setLoading(true)
    try {
      await fetch(`/api/bookings/${bookingId}/cash-confirm`, {
        method: 'POST',
      })
      toast.success('Cash booking confirm! 💵')
      onPaid('CASH')
    } catch {
      toast.error('Kuch gadbad hui')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-t-3xl w-full max-w-[430px] px-6 pt-6 pb-10 sheet-enter"
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--border)' }} />

        <h2 className="text-xl font-black mb-1" style={{ color: 'var(--stone)' }}>Payment</h2>
        <p className="text-sm mb-5" style={{ color: 'var(--mist)' }}>
          {serviceName} • {workerName}
        </p>

        {/* Amount */}
        <div
          className="rounded-2xl p-4 mb-5 flex items-center justify-between"
          style={{ background: 'var(--cloud)' }}
        >
          <span className="text-sm font-bold" style={{ color: 'var(--mist)' }}>Total amount</span>
          <span className="text-2xl font-black" style={{ color: 'var(--chinar)' }}>₹{amount}</span>
        </div>

        {/* Method selector */}
        <p className="text-xs font-black mb-3 uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
          Payment method chuniye
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { id: 'UPI',  emoji: '📱', label: 'UPI / PhonePe / GPay', sub: 'Instant & safe' },
            { id: 'CASH', emoji: '💵', label: 'Cash on service',      sub: 'Pay when done' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setMethod(opt.id as any)}
              className="flex flex-col items-center gap-1.5 py-4 px-3 rounded-2xl text-center transition-all btn-press"
              style={{
                background: method === opt.id ? (opt.id === 'UPI' ? 'var(--dal-light)' : 'var(--saffron-light)') : 'white',
                border: `2px solid ${method === opt.id ? (opt.id === 'UPI' ? 'var(--dal)' : 'var(--saffron)') : 'var(--border)'}`,
                fontFamily: 'var(--font-nunito)',
              }}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-xs font-black" style={{ color: 'var(--stone)' }}>{opt.label}</span>
              <span className="text-[10px] font-semibold" style={{ color: 'var(--mist)' }}>{opt.sub}</span>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={method === 'UPI' ? payViaUpi : confirmCash}
          disabled={loading}
          className="w-full py-4 rounded-2xl text-white font-black text-base btn-press"
          style={{
            background: loading ? 'var(--border)' : method === 'UPI' ? 'var(--dal)' : 'var(--saffron)',
            color: loading ? 'var(--mist)' : 'white',
          }}
        >
          {loading
            ? '⏳ Ruko...'
            : method === 'UPI'
            ? '📱 UPI se Pay Karo'
            : '💵 Cash se Book Karo'}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 py-3 rounded-2xl text-sm font-bold btn-press"
          style={{ background: 'var(--cloud)', border: 'none', color: 'var(--mist)', fontFamily: 'var(--font-nunito)' }}
        >
          Baad mein karo
        </button>
      </div>
    </div>
  )
}
