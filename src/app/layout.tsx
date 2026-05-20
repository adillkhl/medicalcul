import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PwaRegister from '@/components/pwa-register'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Medicalcul — Calculateurs et scores médicaux',
  description: 'Calculateurs et scores médicaux pour les professionnels de santé. 30 spécialités, mise à jour selon les recommandations en vigueur.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Medicalcul' },
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.className}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-white text-zinc-900 antialiased">
        <PwaRegister />
        {children}
      </body>
    </html>
  )
}
