import { getAllBlogPosts } from '@/lib/blog'
import { siteUrl } from '@/lib/seo'

export const revalidate = 3600 // Rebuild feed at most once per hour

function escapeCdata(text: string): string {
    return text.replace(/]]>/g, ']]]]><![CDATA[>')
}

export async function GET() {
  const posts = await getAllBlogPosts()

    const items = posts
        .map((post) => {
            const url = `${siteUrl}/blog/${post.slug}`
            const pubDate = new Date(post.date).toUTCString()
            const description = post.description || post.content.slice(0, 280)
            return `
      <item>
        <title><![CDATA[${escapeCdata(post.title)}]]></title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <description><![CDATA[${escapeCdata(description)}]]></description>
        <pubDate>${pubDate}</pubDate>
      </item>`
        })
        .join('\n')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Portfolio Blog</title>
    <link>${siteUrl}</link>
    <description>Articles from the Portfolio blog</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=600',
        },
    })
}


