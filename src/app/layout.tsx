import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import WebVitals from '@/components/monitoring/WebVitals'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'My personal portfolio website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
