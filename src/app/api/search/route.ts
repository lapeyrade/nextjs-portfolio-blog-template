import { NextRequest, NextResponse } from 'next/server'
import { getAllBlogPosts } from '@/lib/blog'

type SearchItem = {
    url: string
    title: string
    description?: string
    type: 'page' | 'blog'
    date?: string
    content?: string
}

function getStaticPages(): SearchItem[] {
    return [
        { url: '/', title: 'Home', description: 'Portfolio home page', type: 'page' },
        { url: '/blog', title: 'Blog', description: 'Articles and tutorials', type: 'page' },
        { url: '/contact', title: 'Contact', description: 'Get in touch', type: 'page' },
        { url: '/cgu', title: 'Terms', description: 'Terms and Conditions', type: 'page' },
        { url: '/privacy', title: 'Privacy', description: 'Privacy Policy', type: 'page' },
    ]
}

function getBlogItems(): SearchItem[] {
    return getAllBlogPosts().map((p) => ({
        url: `/blog/${p.slug}`,
        title: p.title,
        description: p.description,
        type: 'blog',
        date: p.date,
        content: p.content,
    }))
}

function scoreItem(item: SearchItem, q: string): number {
    const hayTitle = item.title.toLowerCase()
    const hayDesc = (item.description || '').toLowerCase()
    const hayContent = (item.content || '').toLowerCase()
    const query = q.toLowerCase().trim()
    if (!query) return 0

    let score = 0
    if (hayTitle.includes(query)) score += 6
    if (hayTitle.startsWith(query)) score += 2
    if (hayDesc.includes(query)) score += 3
    if (hayContent.includes(query)) score += 1
    // Recent boost for blogs
    if (item.type === 'blog' && item.date) score += 0.5
    return score
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''

    const items = [...getStaticPages(), ...getBlogItems()]
    const results = (!q
        ? items.slice(0, 10)
        : items
            .map((it) => ({ ...it, _score: scoreItem(it, q) }))
            .filter((it) => it._score > 0)
            .sort((a, b) => b._score - a._score)
    ).slice(0, 12)

    return NextResponse.json(results.map(({ content, ...rest }) => rest))
}


