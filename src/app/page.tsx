'use client'
// src/app/page.tsx — Main entry point
import { useEffect, useState } from 'react'
import { useAuthStore, useAppStore } from '@/lib/store'
import OtpLogin from '@/components/auth/OtpLogin'
import AadhaarSetup from '@/components/auth/AadhaarSetup'
import MainApp from '@/components/MainApp'

export default function Home() {
  const { user, setUser, setLoading, isLoading } = useAuthStore()
  const [authStep, setAuthStep] = useState<'login' | 'setup' | 'app'>('login')

  useEffect(() => {
    // Check session on mount
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          setAuthStep(data.user.name ? 'app' : 'setup')
        } else {
          setAuthStep('login')
        }
      })
      .catch(() => setAuthStep('login'))
      .finally(() => setLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center" style={{ background: 'var(--chinar)' }}>
        <div className="text-7xl" style={{ animation: 'leafFall 1.5s ease-in-out infinite alternate' }}>🍂</div>
        <p className="text-white font-black text-2xl mt-4">Rozgaar</p>
        <p className="font-urdu text-lg mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>روزگار</p>
      </div>
    )
  }

  if (authStep === 'login') {
    return (
      <OtpLogin
        onSuccess={(isNewUser) => {
          setAuthStep(isNewUser ? 'setup' : 'app')
        }}
      />
    )
  }

  if (authStep === 'setup') {
    return <AadhaarSetup onSuccess={() => setAuthStep('app')} />
  }

  return <MainApp />
}
