import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/'],
                // Block redirect routes from being crawled
                disallow: [
                    '/blog$',      // Block root /blog (redirect route)
                    '/contact$',   // Block root /contact (redirect route) 
                    '/terms$',     // Block root /terms (redirect route)
                    '/privacy$',   // Block root /privacy (redirect route)
                    '/cgu$',       // Block root /cgu (redirect route)
                    '/api/',       // Block API routes
                    '/_next/',     // Block Next.js internals
                    '/_vercel/',   // Block Vercel internals
                ],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    }
}


