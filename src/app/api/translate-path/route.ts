import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getEquivalentSlug } from '@/lib/blogMapping'

export async function POST(req: NextRequest) {
    try {
        const { pathname = '/', targetLocale = 'en' } = await req.json()

        // If path is a blog post path like /fr/blog/slug or /blog/slug
        const match = pathname.match(/(?:\/fr|\/en)?\/blog\/(.+)/)
        if (!match) {
            // Not a blog post; just return a normalized path
            return NextResponse.json({ path: pathname })
        }

        const currentSlug = decodeURIComponent(match[1])

        // Use the blog slug mapping to find the equivalent slug in the target language
        const equivalentSlug = getEquivalentSlug(currentSlug, targetLocale)

        if (equivalentSlug) {
            // Found a translation
            return NextResponse.json({ path: `/blog/${equivalentSlug}` })
        }

        // No translation found, return the original path stripped of locale prefix
        const strippedPath = pathname.replace(/^\/(en|fr)/, '')
        return NextResponse.json({ path: strippedPath })
    } catch (err) {
        return NextResponse.json({ path: '/' })
    }
}
