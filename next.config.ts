import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [{ key: 'Service-Worker-Allowed', value: '/' }],
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
export default withMDX(nextConfig)
