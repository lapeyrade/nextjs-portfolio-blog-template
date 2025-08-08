import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import WebVitals from '@/components/monitoring/WebVitals'
import { siteUrl } from '@/lib/seo'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Portfolio | Full-Stack Developer',
    template: '%s | Portfolio',
  },
  description: 'Personal portfolio showcasing projects, blog posts, and contact information.',
  applicationName: 'Portfolio',
  keywords: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Portfolio', 'Web Developer'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Portfolio | Full-Stack Developer',
    description: 'Personal portfolio showcasing projects, blog posts, and contact information.',
    siteName: 'Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | Full-Stack Developer',
    description: 'Personal portfolio showcasing projects, blog posts, and contact information.',
    creator: '@your_handle',
  },
  alternates: {
    canonical: '/',
  },
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
        <Analytics />
        <SpeedInsights />
        {children}
      </body>
    </html>
  )
}
