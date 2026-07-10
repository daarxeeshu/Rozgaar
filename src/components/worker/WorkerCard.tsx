'use client'
// src/components/worker/WorkerCard.tsx
import { useAppStore } from '@/lib/store'

interface Props {
  worker: {
    id: string
    user: { id: string; name: string | null; district: string | null; area: string | null; aadhaarVerified: boolean }
    trade: string
    tradeEmoji: string
    avgRating: number
    totalReviews: number
    isAvailable: boolean
    yearsExp: number | null
    services: { id: string; name: string; price: number; priceUnit: string }[]
  }
}

const PRICE_UNIT_SHORT: Record<string, string> = {
  PER_VISIT: '/visit',
  PER_HOUR:  '/hr',
  PER_DAY:   '/day',
  PER_ITEM:  '/item',
  PER_KM:    '/km',
}

const TRADE_BG: Record<string, string> = {
  Plumber:     '#EBF5FB',
  Electrician: '#FFFDE7',
  'Cab Driver':'#EAF4EC',
  Tailor:      '#FDEDEC',
  Carpenter:   '#FEF9E7',
  Gardener:    '#E8F8F5',
  Painter:     '#F5EEF8',
  default:     '#F0EDE8',
}

export default function WorkerCard({ worker }: Props) {
  const { setSelectedWorker, setActiveTab } = useAppStore()
  const bg = TRADE_BG[worker.trade] || TRADE_BG.default
  const minPrice = worker.services.length
    ? Math.min(...worker.services.map(s => s.price))
    : null
  const firstService = worker.services[0]

  function open() {
    setSelectedWorker(worker.id)
    setActiveTab('worker-detail')
  }

  return (
    <div
      onClick={open}
      className="bg-white rounded-3xl cursor-pointer transition-all btn-press"
      style={{ border: '1.5px solid var(--border)', padding: 16 }}
    >
      <div className="flex gap-3.5 items-start">
        {/* Avatar */}
        <div
          className="rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ background: bg, width: 56, height: 56 }}
        >
          {worker.tradeEmoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-black text-base leading-tight" style={{ color: 'var(--stone)' }}>
                {worker.user.name || 'Worker'}
                {worker.user.aadhaarVerified && (
                  <span className="ml-1 text-xs" title="Aadhaar verified">✅</span>
                )}
              </h3>
              <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--mist)' }}>
                {worker.trade} {worker.yearsExp ? `• ${worker.yearsExp} yrs` : ''}
              </p>
            </div>
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-full flex-shrink-0"
              style={{
                background: worker.isAvailable ? 'var(--dal-light)' : 'var(--saffron-light)',
                color: worker.isAvailable ? 'var(--dal)' : 'var(--saffron)',
              }}
            >
              {worker.isAvailable ? 'Open' : 'Busy'}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs font-bold" style={{ color: '#E67E22' }}>
              ⭐ {worker.avgRating > 0 ? worker.avgRating.toFixed(1) : 'New'}
              <span className="font-normal ml-0.5" style={{ color: 'var(--mist)' }}>
                {worker.totalReviews > 0 ? ` (${worker.totalReviews})` : ''}
              </span>
            </span>
            <span className="text-xs" style={{ color: 'var(--mist)' }}>
              📍 {worker.user.area || worker.user.district || 'Kashmir'}
            </span>
          </div>
        </div>
      </div>

      {/* Services strip */}
      {worker.services.length > 0 && (
        <div
          className="flex items-center gap-2 mt-3 pt-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
            {worker.services.slice(0, 2).map(s => (
              <span
                key={s.id}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: 'var(--cloud)', color: 'var(--stone)' }}
              >
                {s.name}
              </span>
            ))}
          </div>
          {minPrice !== null && (
            <span
              className="text-xs font-black px-2.5 py-1 rounded-lg flex-shrink-0"
              style={{ background: 'var(--chinar-light)', color: 'var(--chinar)' }}
            >
              from ₹{minPrice}{firstService ? PRICE_UNIT_SHORT[firstService.priceUnit] || '' : ''}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
