'use client'
// src/components/auth/OtpLogin.tsx
import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/lib/store'

interface Props {
  onSuccess: (isNewUser: boolean) => void
}

export default function OtpLogin({ onSuccess }: Props) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const { setUser } = useAuthStore()

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [countdown])

  const formattedPhone = '+91' + phone.replace(/\D/g, '').slice(-10)

  async function sendOtp() {
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10) {
      toast.error('10-digit mobile number dalo')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep('otp')
      setCountdown(60)
      toast.success('OTP bheja gaya! 📱')
      setTimeout(() => otpRefs.current[0]?.focus(), 200)
    } catch (e: any) {
      toast.error(e.message || 'OTP nahi gaya')
    } finally {
      setLoading(false)
    }
  }

  async function verifyOtp() {
    const code = otp.join('')
    if (code.length !== 6) { toast.error('6-digit OTP dalo'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone, otp: code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUser(data.user)
      toast.success('Login ho gaye! 🎉')
      onSuccess(data.isNewUser)
    } catch (e: any) {
      toast.error(e.message || 'Galat OTP')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  function handleOtpChange(i: number, val: string) {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[i] = val.slice(-1)
    setOtp(next)
    if (val && i < 5) otpRefs.current[i + 1]?.focus()
    if (next.every(d => d) ) {
      // auto-verify
      setTimeout(() => {
        const code = next.join('')
        if (code.length === 6) verifyOtp()
      }, 100)
    }
  }

  function handleOtpKey(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus()
    }
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--snow)' }}>
      {/* Header */}
      <div className="kashmiri-stripe" />
      <div
        className="flex flex-col items-center justify-center py-12 px-6"
        style={{ background: 'var(--chinar)' }}
      >
        <div className="text-7xl mb-3" style={{ animation: 'leafFall 2s ease-in-out infinite alternate' }}>🍂</div>
        <h1 className="text-4xl font-black text-white tracking-tight">Rozgaar</h1>
        <p className="font-urdu text-xl mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>روزگار</p>
        <p className="text-sm mt-3 text-center" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 260 }}>
          Kashmir's own platform for workers & daily earners
        </p>
      </div>

      <div className="flex-1 px-6 pt-8">
        {step === 'phone' ? (
          <>
            <h2 className="text-xl font-black mb-1" style={{ color: 'var(--stone)' }}>
              Apna number dalo
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--mist)' }}>
              OTP aapke phone pe aayega
            </p>

            <div className="flex gap-2 mb-4">
              <div
                className="flex items-center px-4 rounded-2xl font-bold text-sm"
                style={{ background: 'var(--cloud)', border: '1.5px solid var(--border)', color: 'var(--stone)' }}
              >
                🇮🇳 +91
              </div>
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                onKeyDown={e => e.key === 'Enter' && sendOtp()}
                className="flex-1 rounded-2xl px-4 py-4 text-lg font-bold outline-none"
                style={{
                  border: '1.5px solid var(--border)',
                  background: 'white',
                  color: 'var(--stone)',
                  fontFamily: 'var(--font-nunito)',
                }}
                autoFocus
                inputMode="numeric"
              />
            </div>

            <button
              onClick={sendOtp}
              disabled={loading || phone.replace(/\D/g,'').length !== 10}
              className="w-full py-4 rounded-2xl text-white font-black text-base btn-press transition-all"
              style={{
                background: loading || phone.replace(/\D/g,'').length !== 10
                  ? 'var(--border)' : 'var(--chinar)',
                color: loading || phone.replace(/\D/g,'').length !== 10 ? 'var(--mist)' : 'white',
              }}
            >
              {loading ? '⏳ Bhej raha hai...' : 'OTP Bhejo 📱'}
            </button>

            <p className="text-xs text-center mt-4" style={{ color: 'var(--mist)' }}>
              Login karke aap hamare Terms & Privacy se agree karte hain
            </p>
          </>
        ) : (
          <>
            <button
              onClick={() => setStep('phone')}
              className="flex items-center gap-2 mb-6 font-bold text-sm btn-press"
              style={{ color: 'var(--chinar)', background: 'none', border: 'none' }}
            >
              ‹ Wapas jao
            </button>

            <h2 className="text-xl font-black mb-1" style={{ color: 'var(--stone)' }}>
              OTP dalo
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--mist)' }}>
              +91 {phone} pe 6-digit code gaya
            </p>

            <div className="flex gap-2 justify-between mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el }}
                  className={`otp-input ${digit ? 'filled' : ''}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKey(i, e)}
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              disabled={loading || otp.join('').length !== 6}
              className="w-full py-4 rounded-2xl text-white font-black text-base btn-press transition-all"
              style={{
                background: loading || otp.join('').length !== 6
                  ? 'var(--border)' : 'var(--dal)',
                color: loading || otp.join('').length !== 6 ? 'var(--mist)' : 'white',
              }}
            >
              {loading ? '⏳ Check ho raha hai...' : '✅ Verify Karo'}
            </button>

            <div className="text-center mt-4">
              {countdown > 0 ? (
                <p className="text-sm" style={{ color: 'var(--mist)' }}>
                  Dobara bhejo {countdown}s mein
                </p>
              ) : (
                <button
                  onClick={sendOtp}
                  className="text-sm font-bold btn-press"
                  style={{ color: 'var(--chinar)', background: 'none', border: 'none' }}
                >
                  OTP dobara bhejo
                </button>
              )}
            </div>
          </>
        )}
      </div>
      <div className="kashmiri-stripe mb-0 mt-auto" />
    </div>
  )
}
