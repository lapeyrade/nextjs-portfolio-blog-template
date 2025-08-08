import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'
import { getAllBlogPosts } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllBlogPosts()
  const lastModified = new Date().toISOString()

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/blog',
    '/contact',
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogRoutes]
}


