import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
    // Target modern browsers only (remove Baseline polyfills)
    forceSwcTransforms: false,
  },
  // Move serverComponentsExternalPackages to the correct location
  serverExternalPackages: [],
  
  // Configure webpack for better shiki support
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't treat shiki as external
      config.externals = config.externals || []
      if (Array.isArray(config.externals)) {
        config.externals = config.externals.filter((external: any) => {
          if (typeof external === 'string') {
            return !external.includes('shiki')
          }
          return true
        })
      }
    }
    return config
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  // Optimize for i18n performance
  poweredByHeader: false,
  generateEtags: true,
  compress: true,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Service-Worker-Allowed', value: '/' },
          // Cache static assets more aggressively
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache i18n messages for better performance
        source: '/messages/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ]
  },
  // No rewrite needed; service worker is served from public/
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

// Wrap MDX and Next.js config with each other
export default withNextIntl(withMDX(nextConfig))
