import type { Metadata } from 'next'
import { siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
    alternates: {
        types: {
            'application/rss+xml': `${siteUrl}/rss.xml`,
            'application/feed+json': `${siteUrl}/feed.json`,
        },
    },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return children
}


