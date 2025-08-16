import { Inter } from 'next/font/google'
import './globals.css'
import WebVitals from '@/components/monitoring/WebVitals'
import ClientProviders from '@/components/ClientProviders'
import { siteUrl } from '@/lib/seo'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
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
  manifest: '/manifest.webmanifest',
}

export const viewport = {
  themeColor: '#8b5cf6',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html data-theme="ocean">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              url: siteUrl,
              name: 'Portfolio',
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <WebVitals />
        <ClientProviders />
        <Analytics />
        <SpeedInsights />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <script dangerouslySetInnerHTML={{
          __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
              fetch('/service-worker.js', { method: 'HEAD', cache: 'no-store' })
                .then(function (res) { if (res.ok) { return navigator.serviceWorker.register('/service-worker.js') } })
                .catch(function () {})
            })
          }
        ` }} />
      </body>
    </html>
  )
}
