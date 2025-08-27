import { getAllBlogPosts } from '@/lib/blog'
import { siteUrl } from '@/lib/seo'

export const revalidate = 3600

export async function GET() {
  const posts = await getAllBlogPosts()

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Portfolio Blog',
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed.json`,
    items: posts.map((post) => ({
      id: `${siteUrl}/blog/${post.slug}`,
      url: `${siteUrl}/blog/${post.slug}`,
      title: post.title,
      content_text: post.description || post.content,
      date_published: new Date(post.date).toISOString(),
      tags: post.tags,
      authors: post.author ? [{ name: post.author }] : undefined,
    })),
  }

  return Response.json(feed, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=600',
    },
  })
}
