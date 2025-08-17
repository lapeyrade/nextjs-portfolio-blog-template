import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'
import { getAllBlogPosts } from '@/lib/blog'
import { routing } from '@/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await getAllBlogPosts()
    const nowIso = new Date().toISOString()

    // Only include canonical localized routes, not redirect routes
    const staticRoutes: MetadataRoute.Sitemap = []
    
    // Add localized static pages
    routing.locales.forEach((locale) => {
        const localePrefix = locale === routing.defaultLocale ? '' : `/${locale}`
        
        const pages = [
            '',
            '/blog',
            '/contact',
            '/terms',
            '/privacy',
        ]
        
        pages.forEach((path) => {
            staticRoutes.push({
                url: `${siteUrl}${localePrefix}${path}`,
                lastModified: nowIso,
                changeFrequency: 'weekly',
                priority: path === '' ? 1 : 0.7,
                alternates: {
                    languages: routing.locales.reduce((acc, lang) => {
                        const langPrefix = lang === routing.defaultLocale ? '' : `/${lang}`
                        acc[lang] = `${siteUrl}${langPrefix}${path}`
                        return acc
                    }, {} as Record<string, string>)
                }
            })
        })
    })

    // Add localized blog posts
    const blogRoutes: MetadataRoute.Sitemap = []
    posts.forEach((post) => {
        routing.locales.forEach((locale) => {
            const localePrefix = locale === routing.defaultLocale ? '' : `/${locale}`
            blogRoutes.push({
                url: `${siteUrl}${localePrefix}/blog/${post.slug}`,
                lastModified: post.lastModified || post.date || nowIso,
                changeFrequency: 'monthly',
                priority: 0.6,
                alternates: {
                    languages: routing.locales.reduce((acc, lang) => {
                        const langPrefix = lang === routing.defaultLocale ? '' : `/${lang}`
                        acc[lang] = `${siteUrl}${langPrefix}/blog/${post.slug}`
                        return acc
                    }, {} as Record<string, string>)
                }
            })
        })
    })

    return [...staticRoutes, ...blogRoutes]
}


