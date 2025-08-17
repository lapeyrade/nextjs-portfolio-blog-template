import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// Bundle analyzer configuration
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
    // Target modern browsers only (remove Baseline polyfills)
    forceSwcTransforms: false,
  },
  // Move serverComponentsExternalPackages to the correct location
  serverExternalPackages: [],
  
  // Enhanced image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 768, 1024, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

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
        ],
      },
      {
        // Cache static assets more aggressively
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2|ttf|eot)$',
        headers: [
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
      {
        // Cache API routes with shorter TTL
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
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
export default withBundleAnalyzer(withNextIntl(withMDX(nextConfig)))
