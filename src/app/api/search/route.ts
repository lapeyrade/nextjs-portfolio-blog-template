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

    // Add locale prefix for French, keep English clean (as-needed strategy)
    if (locale === 'fr') {
        return basePages.map(page => ({
            ...page,
            url: page.url === '/' ? '/fr' : `/fr${page.url}`
        }))
    }

    return basePages
}

function getBlogItems(locale: string = 'en'): SearchItem[] {
    return getAllBlogPosts(locale).map((p) => ({
        url: `/${locale}/blog/${p.slug}`,
        title: p.title,
        description: p.description,
        type: 'blog' as const,
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
    const locale = searchParams.get('locale') || 'en'

    const items = [...getStaticPages(locale), ...getBlogItems(locale)]
    const results = (!q
        ? items.slice(0, 10)
        : items
            .map((it) => ({ ...it, _score: scoreItem(it, q) }))
            .filter((it) => it._score > 0)
            .sort((a, b) => b._score - a._score)
    ).slice(0, 12)

    return NextResponse.json(results.map(({ content, ...rest }) => rest))
}


