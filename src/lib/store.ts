// src/lib/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  phone: string
  name?: string
  role: 'CUSTOMER' | 'WORKER' | 'BOTH'
  district?: string
  area?: string
  aadhaarVerified: boolean
  workerProfile?: {
    id: string
    trade: string
    tradeEmoji: string
    isAvailable: boolean
  }
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (v: boolean) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: async () => {
        await fetch('/api/auth/me', { method: 'DELETE' })
        set({ user: null })
      },
    }),
    {
      name: 'rozgaar-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
)

interface AppStore {
  activeTab: string
  setActiveTab: (tab: string) => void
  selectedWorker: string | null
  setSelectedWorker: (id: string | null) => void
  activeChatRoom: string | null
  setActiveChatRoom: (id: string | null) => void
}

export const useAppStore = create<AppStore>()((set) => ({
  activeTab: 'home',
  setActiveTab: (activeTab) => set({ activeTab }),
  selectedWorker: null,
  setSelectedWorker: (selectedWorker) => set({ selectedWorker }),
  activeChatRoom: null,
  setActiveChatRoom: (activeChatRoom) => set({ activeChatRoom }),
}))
