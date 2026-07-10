'use client'
// src/components/auth/AadhaarSetup.tsx
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/lib/store'
import { TRADES, DISTRICTS, SRINAGAR_AREAS } from '@/types'

interface Props {
  onSuccess: () => void
}

export default function AadhaarSetup({ onSuccess }: Props) {
  const { user, setUser } = useAuthStore()
  const [step, setStep] = useState<'role' | 'personal' | 'worker'>('role')
  const [role, setRole] = useState<'CUSTOMER' | 'WORKER' | 'BOTH'>('CUSTOMER')
  const [form, setForm] = useState({
    name: '',
    aadhaarLast4: '',
    district: 'Srinagar',
    area: '',
    trade: '',
    tradeEmoji: '',
    bio: '',
    yearsExp: '',
  })
  const [loading, setLoading] = useState(false)

  function setField(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function submit() {
    if (!form.name.trim()) { toast.error('Naam dalo'); return }
    if (form.aadhaarLast4.length !== 4) { toast.error('Aadhaar ke aakhri 4 digits dalo'); return }
    if ((role === 'WORKER' || role === 'BOTH') && !form.trade) {
      toast.error('Apna hunar chuniye'); return
    }

    setLoading(true)
    try {
      const selected = TRADES.find(t => t.id === form.trade)
      const res = await fetch('/api/auth/setup-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          aadhaarLast4: form.aadhaarLast4,
          role,
          district: form.district,
          area: form.area,
          trade: selected?.label,
          tradeEmoji: selected?.emoji,
          bio: form.bio,
          yearsExp: form.yearsExp ? parseInt(form.yearsExp) : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUser({ ...user!, ...data.user })
      toast.success('Profile ban gayi! 🎉')
      onSuccess()
    } catch (e: any) {
      toast.error(e.message || 'Kuch gadbad hui')
    } finally {
      setLoading(false)
    }
  }

  const isWorker = role === 'WORKER' || role === 'BOTH'

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--snow)' }}>
      <div className="kashmiri-stripe" />

      {/* Header */}
      <div className="px-6 py-5" style={{ background: 'var(--chinar)' }}>
        <p className="text-xs font-bold mb-1" style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: 1 }}>
          PROFILE SETUP
        </p>
        <h1 className="text-2xl font-black text-white">Apni pehchaan batao</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Aadhaar se verified profile — zyada trust milta hai
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 px-6 py-4">
        {['role', 'personal', ...(isWorker ? ['worker'] : [])].map((s, i) => (
          <div
            key={s}
            className="h-1.5 flex-1 rounded-full transition-all"
            style={{
              background: step === s ? 'var(--chinar)' : 'var(--border)',
            }}
          />
        ))}
      </div>

      <div className="flex-1 px-6 pb-8 overflow-y-auto">
        {/* Step 1: Role */}
        {step === 'role' && (
          <>
            <h2 className="text-lg font-black mb-1" style={{ color: 'var(--stone)' }}>
              Aap kya karna chahte hain?
            </h2>
            <p className="text-sm mb-5" style={{ color: 'var(--mist)' }}>Baad mein bhi badal sakte hain</p>

            {[
              { val: 'CUSTOMER', emoji: '🔍', label: 'Worker dhundna hai', sub: 'Tailor, plumber, driver book karo' },
              { val: 'WORKER',   emoji: '🔨', label: 'Kaam karna hai',     sub: 'Apni services post karo, customers paao' },
              { val: 'BOTH',     emoji: '⚡', label: 'Dono karna hai',     sub: 'Kaam bhi karo, hire bhi karo' },
            ].map(opt => (
              <div
                key={opt.val}
                onClick={() => setRole(opt.val as any)}
                className="flex items-center gap-4 p-4 rounded-2xl mb-3 cursor-pointer transition-all btn-press"
                style={{
                  background: 'white',
                  border: `2px solid ${role === opt.val ? 'var(--chinar)' : 'var(--border)'}`,
                  boxShadow: role === opt.val ? '0 0 0 3px rgba(192,57,43,0.1)' : 'none',
                }}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <div>
                  <p className="font-black text-base" style={{ color: 'var(--stone)' }}>{opt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--mist)' }}>{opt.sub}</p>
                </div>
                {role === opt.val && (
                  <span className="ml-auto text-lg" style={{ color: 'var(--chinar)' }}>✓</span>
                )}
              </div>
            ))}

            <button
              onClick={() => setStep('personal')}
              className="w-full mt-4 py-4 rounded-2xl text-white font-black text-base btn-press"
              style={{ background: 'var(--chinar)' }}
            >
              Aage badhein →
            </button>
          </>
        )}

        {/* Step 2: Personal Info */}
        {step === 'personal' && (
          <>
            <button onClick={() => setStep('role')} className="flex items-center gap-1 mb-4 font-bold text-sm btn-press" style={{ color: 'var(--chinar)', background: 'none', border: 'none' }}>
              ‹ Wapas
            </button>
            <h2 className="text-lg font-black mb-4" style={{ color: 'var(--stone)' }}>Aapki jaankari</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Poora naam <span style={{ color: 'var(--chinar)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mohammad Yusuf Wani"
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  className="w-full rounded-2xl px-4 py-3.5 text-base font-semibold outline-none"
                  style={{ border: '1.5px solid var(--border)', background: 'white', fontFamily: 'var(--font-nunito)', color: 'var(--stone)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Aadhaar ke aakhri 4 digits <span style={{ color: 'var(--chinar)' }}>*</span>
                </label>
                <div className="flex items-center gap-3 p-3.5 rounded-2xl" style={{ border: '1.5px solid var(--border)', background: 'white' }}>
                  <span className="text-xl">🪪</span>
                  <span className="font-bold" style={{ color: 'var(--mist)' }}>XXXX XXXX</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="0000"
                    value={form.aadhaarLast4}
                    onChange={e => setField('aadhaarLast4', e.target.value.replace(/\D/g,'').slice(0,4))}
                    className="w-20 text-center font-black text-lg outline-none"
                    style={{ border: '2px solid var(--chinar)', borderRadius: 10, padding: '4px 8px', fontFamily: 'var(--font-nunito)', color: 'var(--stone)' }}
                  />
                </div>
                <p className="text-xs mt-1.5" style={{ color: 'var(--mist)' }}>
                  🔒 Sirf aakhri 4 digits — poora Aadhaar store nahi hota
                </p>
              </div>

              <div>
                <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Zila / District <span style={{ color: 'var(--chinar)' }}>*</span>
                </label>
                <select
                  value={form.district}
                  onChange={e => setField('district', e.target.value)}
                  className="w-full rounded-2xl px-4 py-3.5 text-base font-semibold outline-none"
                  style={{ border: '1.5px solid var(--border)', background: 'white', fontFamily: 'var(--font-nunito)', color: 'var(--stone)' }}
                >
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              {form.district === 'Srinagar' && (
                <div>
                  <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                    Mohalla / Area
                  </label>
                  <select
                    value={form.area}
                    onChange={e => setField('area', e.target.value)}
                    className="w-full rounded-2xl px-4 py-3.5 text-base font-semibold outline-none"
                    style={{ border: '1.5px solid var(--border)', background: 'white', fontFamily: 'var(--font-nunito)', color: 'var(--stone)' }}
                  >
                    <option value="">Chuniye...</option>
                    {SRINAGAR_AREAS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              )}
            </div>

            <button
              onClick={() => isWorker ? setStep('worker') : submit()}
              disabled={loading}
              className="w-full mt-6 py-4 rounded-2xl text-white font-black text-base btn-press"
              style={{ background: loading ? 'var(--border)' : 'var(--chinar)' }}
            >
              {loading ? '⏳ Save ho raha hai...' : isWorker ? 'Aage badhein →' : '✅ Profile Save Karo'}
            </button>
          </>
        )}

        {/* Step 3: Worker Info */}
        {step === 'worker' && (
          <>
            <button onClick={() => setStep('personal')} className="flex items-center gap-1 mb-4 font-bold text-sm btn-press" style={{ color: 'var(--chinar)', background: 'none', border: 'none' }}>
              ‹ Wapas
            </button>
            <h2 className="text-lg font-black mb-4" style={{ color: 'var(--stone)' }}>Aapka hunar</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Kaam / Trade <span style={{ color: 'var(--chinar)' }}>*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TRADES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setField('trade', t.id)}
                      className="flex flex-col items-center gap-1 py-3 px-2 rounded-2xl text-center transition-all btn-press"
                      style={{
                        background: form.trade === t.id ? 'var(--chinar-light)' : 'white',
                        border: `1.5px solid ${form.trade === t.id ? 'var(--chinar)' : 'var(--border)'}`,
                        fontFamily: 'var(--font-nunito)',
                      }}
                    >
                      <span className="text-2xl">{t.emoji}</span>
                      <span className="text-xs font-bold" style={{ color: form.trade === t.id ? 'var(--chinar)' : 'var(--stone)', lineHeight: 1.3 }}>
                        {t.label.split('/')[0].trim()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Tajurba (saal mein)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5"
                  value={form.yearsExp}
                  onChange={e => setField('yearsExp', e.target.value)}
                  className="w-full rounded-2xl px-4 py-3.5 text-base font-semibold outline-none"
                  style={{ border: '1.5px solid var(--border)', background: 'white', fontFamily: 'var(--font-nunito)', color: 'var(--stone)' }}
                  inputMode="numeric"
                />
              </div>

              <div>
                <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Apne baare mein kuch batao
                </label>
                <textarea
                  placeholder="Kitne saal ka tajurba hai, kya kya kaam karte ho..."
                  value={form.bio}
                  onChange={e => setField('bio', e.target.value)}
                  rows={3}
                  className="w-full rounded-2xl px-4 py-3.5 text-base font-semibold outline-none resize-none"
                  style={{ border: '1.5px solid var(--border)', background: 'white', fontFamily: 'var(--font-nunito)', color: 'var(--stone)' }}
                />
              </div>
            </div>

            <button
              onClick={submit}
              disabled={loading || !form.trade}
              className="w-full mt-6 py-4 rounded-2xl text-white font-black text-base btn-press"
              style={{ background: loading || !form.trade ? 'var(--border)' : 'var(--dal)', color: loading || !form.trade ? 'var(--mist)' : 'white' }}
            >
              {loading ? '⏳ Save ho raha hai...' : '✅ Profile Complete Karo'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
