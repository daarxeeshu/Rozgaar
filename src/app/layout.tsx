// src/app/layout.tsx

import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rozgaar — روزگار',
  description: "Kashmir's own platform for workers, artists and daily earners",
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#C0392B',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
        />
      </head>

      <body
        className={`${nunito.variable} font-sans bg-[#FAFAF8] text-stone antialiased`}
      >
        <div className="mx-auto max-w-[430px] min-h-screen relative overflow-x-hidden shadow-2xl">
          {children}
        </div>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#4A4744',
              color: '#fff',
              borderRadius: '50px',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: '700',
              fontSize: '13px',
              padding: '12px 20px',
            },
          }}
        />
      </body>
    </html>
  )
}
