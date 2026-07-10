'use client'
// src/components/tabs/PostAdTab.tsx
import { useState } from 'react'
import { useAuthStore } from '@/lib/store'
import { TRADES, PRICE_UNITS } from '@/types'
import toast from 'react-hot-toast'

export default function PostAdTab() {
  const { user } = useAuthStore()
  const [form, setForm] = useState({
    name: '', description: '', price: '', priceUnit: 'PER_VISIT', durationMins: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function setField(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function submit() {
    if (!form.name.trim() || !form.price) { toast.error('Service ka naam aur rate dalo'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/workers/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseInt(form.price),
          priceUnit: form.priceUnit,
          durationMins: form.durationMins ? parseInt(form.durationMins) : undefined,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
      toast.success('Ad publish ho gaya! 🎉')
    } catch {
      toast.error('Ad publish nahi hua')
    } finally {
      setLoading(false)
    }
  }

  const isWorker = user?.role === 'WORKER' || user?.role === 'BOTH'

  if (!isWorker) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-20 text-center" style={{ minHeight: '80dvh' }}>
        <div className="text-5xl mb-4">🔨</div>
        <h2 className="text-xl font-black mb-2" style={{ color: 'var(--stone)' }}>Worker account chahiye</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--mist)' }}>
          Ad post karne ke liye apna account worker mein convert karo
        </p>
        <button
          onClick={() => toast('Profile tab se role change karo')}
          className="py-4 px-8 rounded-2xl text-white font-black btn-press"
          style={{ background: 'var(--chinar)', border: 'none', fontFamily: 'var(--font-nunito)' }}
        >
          Worker bano →
        </button>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-20 text-center" style={{ minHeight: '80dvh' }}>
        <div className="text-6xl mb-4" style={{ animation: 'bounceIn 0.5s ease' }}>🎉</div>
        <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--dal)' }}>Ad Publish Ho Gaya!</h2>
        <p className="text-sm mb-2" style={{ color: 'var(--mist)' }}>Customers ab aapko book kar sakte hain</p>
        <p className="text-sm mb-6" style={{ color: 'var(--mist)' }}>Notifications on rakho</p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: '', description: '', price: '', priceUnit: 'PER_VISIT', durationMins: '' }) }}
          className="py-3 px-8 rounded-2xl font-black btn-press"
          style={{ background: 'var(--cloud)', border: 'none', color: 'var(--stone)', fontFamily: 'var(--font-nunito)' }}
        >
          Aur ek service add karo
        </button>
      </div>
    )
  }

  return (
    <div className="pb-28 overflow-y-auto">
      {/* Header */}
      <div className="px-5 py-5" style={{ background: 'var(--chinar)' }}>
        <p className="text-xs font-bold mb-1 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.6)' }}>
          APNA KAAM BATAO
        </p>
        <h1 className="text-2xl font-black text-white">Service Post Karo</h1>
      </div>

      <div className="px-5 pt-5 space-y-4">
        {/* Worker info (read-only) */}
        <div
          className="flex items-center gap-3 p-3.5 rounded-2xl"
          style={{ background: 'var(--dal-light)', border: '1px solid var(--dal)' }}
        >
          <span className="text-2xl">{user?.workerProfile?.tradeEmoji || '🔨'}</span>
          <div>
            <p className="font-black text-sm" style={{ color: 'var(--dal)' }}>{user?.name}</p>
            <p className="text-xs" style={{ color: 'var(--dal)' }}>
              {user?.workerProfile?.trade} • ✅ Aadhaar verified
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
            Service ka naam <span style={{ color: 'var(--chinar)' }}>*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Tap fixing, Shirt silai, Airport drop..."
            value={form.name}
            onChange={e => setField('name', e.target.value)}
            className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none"
            style={{ border: '1.5px solid var(--border)', background: 'white', fontFamily: 'var(--font-nunito)', color: 'var(--stone)' }}
          />
        </div>

        <div>
          <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
            Description (optional)
          </label>
          <textarea
            placeholder="Kya kya kaam karta hoon, kya materials use karta hoon..."
            value={form.description}
            onChange={e => setField('description', e.target.value)}
            rows={3}
            className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none resize-none"
            style={{ border: '1.5px solid var(--border)', background: 'white', fontFamily: 'var(--font-nunito)', color: 'var(--stone)' }}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
              Rate (₹) <span style={{ color: 'var(--chinar)' }}>*</span>
            </label>
            <div className="flex items-center rounded-2xl overflow-hidden" style={{ border: '1.5px solid var(--border)', background: 'white' }}>
              <span className="px-3 font-black text-sm" style={{ color: 'var(--mist)' }}>₹</span>
              <input
                type="number"
                placeholder="150"
                value={form.price}
                onChange={e => setField('price', e.target.value)}
                inputMode="numeric"
                className="flex-1 py-3.5 pr-3 text-sm font-bold outline-none"
                style={{ fontFamily: 'var(--font-nunito)', color: 'var(--stone)' }}
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
              Per
            </label>
            <select
              value={form.priceUnit}
              onChange={e => setField('priceUnit', e.target.value)}
              className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none"
              style={{ border: '1.5px solid var(--border)', background: 'white', fontFamily: 'var(--font-nunito)', color: 'var(--stone)' }}
            >
              {PRICE_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
            Kitna waqt lagega (minutes, optional)
          </label>
          <input
            type="number"
            placeholder="e.g. 60"
            value={form.durationMins}
            onChange={e => setField('durationMins', e.target.value)}
            inputMode="numeric"
            className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none"
            style={{ border: '1.5px solid var(--border)', background: 'white', fontFamily: 'var(--font-nunito)', color: 'var(--stone)' }}
          />
        </div>

        {/* Preview */}
        {form.name && form.price && (
          <div className="p-4 rounded-2xl" style={{ background: 'var(--cloud)', border: '1px dashed var(--border)' }}>
            <p className="text-xs font-black uppercase tracking-wide mb-2" style={{ color: 'var(--mist)' }}>Preview</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-sm" style={{ color: 'var(--stone)' }}>{form.name}</p>
                {form.durationMins && <p className="text-xs mt-0.5" style={{ color: 'var(--mist)' }}>⏱ {form.durationMins} min</p>}
              </div>
              <p className="font-black" style={{ color: 'var(--chinar)' }}>
                ₹{form.price}/{PRICE_UNITS.find(u => u.value === form.priceUnit)?.label}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={submit}
          disabled={loading || !form.name || !form.price}
          className="w-full py-4 rounded-2xl text-white font-black text-base btn-press"
          style={{
            background: loading || !form.name || !form.price ? 'var(--border)' : 'var(--chinar)',
            color: loading || !form.name || !form.price ? 'var(--mist)' : 'white',
            border: 'none',
          }}
        >
          {loading ? '⏳ Publish ho raha hai...' : '✅ Ad Publish Karo'}
        </button>
      </div>
    </div>
  )
}
