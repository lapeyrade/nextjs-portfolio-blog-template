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

function getStaticPages(locale: string = 'en'): SearchItem[] {
    const basePages = [
        {
            url: '/',
            title: locale === 'fr' ? 'Accueil' : 'Home',
            description: locale === 'fr' ? 'Page d\'accueil du portfolio' : 'Portfolio home page',
            type: 'page' as const
        },
        {
            url: '/blog',
            title: 'Blog',
            description: locale === 'fr' ? 'Articles et tutoriels' : 'Articles and tutorials',
            type: 'page' as const
        },
        {
            url: '/contact',
            title: 'Contact',
            description: locale === 'fr' ? 'Entrer en contact' : 'Get in touch',
            type: 'page' as const
        },
        {
            url: '/terms',
            title: locale === 'fr' ? 'Conditions Générales' : 'Terms',
            description: locale === 'fr' ? 'Conditions Générales d\'Utilisation' : 'Terms and Conditions',
            type: 'page' as const
        },
        {
            url: '/privacy',
            title: locale === 'fr' ? 'Confidentialité' : 'Privacy',
            description: locale === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy',
            type: 'page' as const
        },
    ]

    // Use 'as-needed' URL strategy: no prefix for default locale (en), prefix for others
    if (locale !== 'en') {
        return basePages.map(page => ({
            ...page,
            url: page.url === '/' ? `/${locale}` : `/${locale}${page.url}`
        }))
    }

    return basePages
}

async function getBlogItems(locale: string = 'en'): Promise<SearchItem[]> {
    const posts = await getAllBlogPosts(locale)
    return posts.map((p) => {
        // Use 'as-needed' URL strategy: no prefix for default locale (en), prefix for others
        const urlPrefix = locale === 'en' ? '' : `/${locale}`
        return {
            url: `${urlPrefix}/blog/${p.slug}`,
            title: p.title,
            description: p.description,
            type: 'blog' as const,
            date: p.date,
            content: p.content,
        }
    })
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
    const locale = searchParams.get('locale') || 'en'

    // DEBUG: Let's see what posts we actually get
    const blogItems = await getBlogItems(locale)
    const staticPages = getStaticPages(locale)
    
    let results
    if (!q) {
        // When no query, show all pages first, then blog posts
        results = [...staticPages, ...blogItems]
    } else {
        // When searching, combine all items and score them
        const items = [...staticPages, ...blogItems]
        results = items
            .map((it) => ({ ...it, _score: scoreItem(it, q) }))
            .filter((it) => it._score > 0)
            .sort((a, b) => b._score - a._score)
            .slice(0, 12)
    }

    return NextResponse.json(results.map((it) => ({
        url: it.url,
        title: it.title,
        description: it.description,
        type: it.type,
        date: it.date,
    })))
}


