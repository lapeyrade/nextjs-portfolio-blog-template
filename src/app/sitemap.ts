import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'
import { getAllBlogPosts } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllBlogPosts()
    const nowIso = new Date().toISOString()

    const staticRoutes: MetadataRoute.Sitemap = [
        '',
        '/blog',
        '/contact',
        '/terms',
        '/privacy',
    ].map((path) => ({
        url: `${siteUrl}${path}`,
        lastModified: nowIso,
        changeFrequency: 'weekly',
        priority: path === '' ? 1 : 0.7,
    }))

    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: post.lastModified || post.date || nowIso,
        changeFrequency: 'monthly',
        priority: 0.6,
    }))

    return [...staticRoutes, ...blogRoutes]
}


