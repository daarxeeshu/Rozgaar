'use client'
// src/components/tabs/HomeTab.tsx
import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@/lib/store'
import WorkerCard from '@/components/worker/WorkerCard'
import { TRADES } from '@/types'

export default function HomeTab() {
  const { user } = useAuthStore()
  const [workers, setWorkers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState('all')

  const load = useCallback(async (q = '', trade = 'all') => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (trade !== 'all') params.set('trade', trade)
      const res = await fetch(`/api/workers?${params}`)
      const data = await res.json()
      setWorkers(data.workers || [])
    } catch {
      setWorkers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function handleSearch(val: string) {
    setQuery(val)
    const t = setTimeout(() => load(val, activeCat), 400)
    return () => clearTimeout(t)
  }

  function handleCat(cat: string) {
    setActiveCat(cat)
    load(query, cat)
  }

  const displayName = user?.name?.split(' ')[0] || 'aap'

  return (
    <div className="pb-24 overflow-y-auto" style={{ minHeight: '100dvh' }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 py-4 sticky top-0 z-50 bg-white"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <p className="font-black text-lg" style={{ color: 'var(--chinar)' }}>🍂 Rozgaar</p>
          <p className="text-xs font-semibold" style={{ color: 'var(--mist)' }}>
            📍 {user?.district || 'Kashmir'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center btn-press"
            style={{ background: 'var(--cloud)', border: 'none' }}
          >
            🔔
          </button>
        </div>
      </div>

      {/* Banner */}
      <div
        className="mx-5 mt-4 rounded-3xl p-5 relative overflow-hidden"
        style={{ background: 'var(--chinar)' }}
      >
        <div className="absolute right-4 top-2 text-5xl opacity-20">🏔️</div>
        <p className="font-black text-white text-lg leading-snug">
          Salaam {displayName}! 👋
        </p>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Kashmir ke behtareen kaarigars yahaan hain
        </p>
      </div>

      {/* Search */}
      <div className="mx-5 mt-4 relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'var(--mist)' }}>🔎</span>
        <input
          type="text"
          placeholder="Plumber, darzi, driver..."
          value={query}
          onChange={e => handleSearch(e.target.value)}
          className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold outline-none"
          style={{
            background: 'var(--cloud)',
            border: '1.5px solid var(--border)',
            fontFamily: 'var(--font-nunito)',
            color: 'var(--stone)',
          }}
        />
      </div>

      {/* Categories */}
      <div className="scroll-x px-5 mt-3 pb-1 flex gap-2">
        <button
          onClick={() => handleCat('all')}
          className="cat-pill-btn btn-press"
          style={{
            background: activeCat === 'all' ? 'var(--chinar)' : 'var(--cloud)',
            color: activeCat === 'all' ? 'white' : 'var(--stone)',
            border: `1.5px solid ${activeCat === 'all' ? 'var(--chinar)' : 'var(--border)'}`,
            borderRadius: 50, padding: '8px 16px', fontSize: 13, fontWeight: 700,
            whiteSpace: 'nowrap', fontFamily: 'var(--font-nunito)', flexShrink: 0,
          }}
        >
          🌟 Sab
        </button>
        {TRADES.slice(0, 10).map(t => (
          <button
            key={t.id}
            onClick={() => handleCat(t.label.split('/')[0].trim())}
            className="btn-press"
            style={{
              background: activeCat === t.label.split('/')[0].trim() ? 'var(--chinar)' : 'var(--cloud)',
              color: activeCat === t.label.split('/')[0].trim() ? 'white' : 'var(--stone)',
              border: `1.5px solid ${activeCat === t.label.split('/')[0].trim() ? 'var(--chinar)' : 'var(--border)'}`,
              borderRadius: 50, padding: '8px 16px', fontSize: 13, fontWeight: 700,
              whiteSpace: 'nowrap', fontFamily: 'var(--font-nunito)', flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            {t.emoji} {t.label.split('/')[0].trim()}
          </button>
        ))}
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between px-5 mt-4 mb-2">
        <h2 className="font-black text-sm" style={{ color: 'var(--stone)' }}>
          {loading ? 'Dhundh raha hai...' : `${workers.length} worker${workers.length !== 1 ? 's' : ''} mile`}
        </h2>
      </div>

      {/* Workers list */}
      <div className="px-5 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-3xl" />
          ))
        ) : workers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-bold" style={{ color: 'var(--mist)' }}>Koi nahi mila</p>
            <p className="text-sm mt-1" style={{ color: 'var(--mist)' }}>Alag search try karo</p>
          </div>
        ) : (
          workers.map(w => <WorkerCard key={w.id} worker={w} />)
        )}
      </div>
    </div>
  )
}
