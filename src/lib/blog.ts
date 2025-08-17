import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

export interface BlogPost {
    slug: string
    title: string
    description: string
    date: string
    author: string
    tags: string[]
    readingTime: string
    readingTimeMinutes: number
    wordCount: number
    content: string
    lastModified: string
}

interface BlogFrontmatter {
    title?: string
    description?: string
    date?: string
    author?: string
    tags?: string[]
    updated?: string | number | Date
    lastModified?: string | number | Date
    modified?: string | number | Date
    updateDate?: string | number | Date
}

function normalizeToIsoString(input: string | number | Date | undefined): string | null {
    if (input === undefined) return null
    const date = input instanceof Date ? input : new Date(input)
    return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function computeReadingMetrics(content: string): { readingTimeText: string; readingTimeMinutes: number; wordCount: number } {
    const base = readingTime(content)
    // Heuristic: count markdown images and add ~12s each
    const imageMatches = content.match(/!\[[^\]]*\]\([^\)]+\)/g) || []
    const extraSeconds = imageMatches.length * 12
    const adjustedMinutes = base.minutes + extraSeconds / 60
    const readingTimeMinutes = Math.max(1, Math.round(adjustedMinutes))
    const readingTimeText = `${readingTimeMinutes} min read`
    return { readingTimeText, readingTimeMinutes, wordCount: base.words }
}

const blogDirectory = path.join(process.cwd(), 'src/content/blog')

// In-memory cache for process lifetime to avoid repeated disk reads
// Cache per locale to handle i18n correctly
const postsCacheByLocale: Map<string, BlogPost[]> = new Map()

// Function to clear cache (useful for development)
export function clearBlogCache(locale?: string) {
    if (locale) {
        postsCacheByLocale.delete(locale)
        console.log(`[DEBUG] Cleared cache for locale: ${locale}`)
    } else {
        postsCacheByLocale.clear()
        console.log(`[DEBUG] Cleared all blog cache`)
    }
}

export async function getAllBlogPosts(locale: string = 'en'): Promise<BlogPost[]> {
    // Check if we have cached posts for this locale
    if (postsCacheByLocale.has(locale)) {
        return postsCacheByLocale.get(locale)!
    }

    // Ensure blog directory exists
    try {
        await fs.stat(blogDirectory)
    } catch {
        return []
    }

    const allPostsData: BlogPost[] = []

    if (locale === 'en') {
        const fileNames = await fs.readdir(blogDirectory)
        for (const fileName of fileNames) {
            if (!fileName.endsWith('.mdx')) continue
            const slug = fileName.replace(/\.mdx$/, '')
            const fullPath = path.join(blogDirectory, fileName)
            const post = await parsePostFile(fullPath, slug)
            allPostsData.push(post)
        }
    } else {
        const localeDir = path.join(blogDirectory, locale)
        try {
            await fs.stat(localeDir)
            const fileNames = await fs.readdir(localeDir)
            for (const fileName of fileNames) {
                if (!fileName.endsWith('.mdx')) continue
                const slug = fileName.replace(/\.mdx$/, '')
                const fullPath = path.join(localeDir, fileName)
                const post = await parsePostFile(fullPath, slug)
                allPostsData.push(post)
            }
        } catch (error) {
            // locale dir missing, fall through - this might be the issue!
            console.error(`Error reading locale directory ${localeDir}:`, error)
        }
    }

    // Sort posts by date desc
    allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
    
    // Cache the results for this locale
    postsCacheByLocale.set(locale, allPostsData)
    return allPostsData
}

async function parsePostFile(fullPath: string, slug: string): Promise<BlogPost> {
    const fileContents = await fs.readFile(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    const stats = await fs.stat(fullPath)
    const fm = matterResult.data as BlogFrontmatter
    const updatedFromFm =
        normalizeToIsoString(fm.updated) ||
        normalizeToIsoString(fm.lastModified) ||
        normalizeToIsoString(fm.modified) ||
        normalizeToIsoString(fm.updateDate)
    const lastModified: string = updatedFromFm ?? stats.mtime.toISOString()

    // Calculate reading metrics
    const { readingTimeText, readingTimeMinutes, wordCount } = computeReadingMetrics(matterResult.content)

    return {
        slug,
        title: fm.title || 'Untitled',
        description: fm.description || '',
        date: fm.date || new Date().toISOString(),
        author: fm.author || 'Anonymous',
        tags: fm.tags || [],
        readingTime: readingTimeText,
        readingTimeMinutes,
        wordCount,
        content: matterResult.content,
        lastModified,
    } as BlogPost
}

export async function getBlogPost(slug: string, locale: string = 'en'): Promise<BlogPost | null> {
    try {
        const localeDir = path.join(blogDirectory, locale)
        const localePath = path.join(localeDir, `${slug}.mdx`)
        const rootPath = path.join(blogDirectory, `${slug}.mdx`)

        let fullPath = ''

        // Prefer locale-specific file when present
        try {
            if (locale === 'fr') {
                await fs.stat(localePath)
                fullPath = localePath
            }
        } catch {
            // ignore
        }

        if (!fullPath) {
            try {
                await fs.stat(rootPath)
                fullPath = rootPath
            } catch {
                try {
                    await fs.stat(localePath)
                    fullPath = localePath
                } catch {
                    return null
                }
            }
        }

        const fileContents = await fs.readFile(fullPath, 'utf8')
        const matterResult = matter(fileContents)
        const stats = await fs.stat(fullPath)
        const fm = matterResult.data as BlogFrontmatter
        const updatedFromFm =
            normalizeToIsoString(fm.updated) ||
            normalizeToIsoString(fm.lastModified) ||
            normalizeToIsoString(fm.modified) ||
            normalizeToIsoString(fm.updateDate)
        const lastModified: string = updatedFromFm ?? stats.mtime.toISOString()
        const { readingTimeText, readingTimeMinutes, wordCount } = computeReadingMetrics(matterResult.content)

        return {
            slug,
            title: fm.title || 'Untitled',
            description: fm.description || '',
            date: fm.date || new Date().toISOString(),
            author: fm.author || 'Anonymous',
            tags: fm.tags || [],
            readingTime: readingTimeText,
            readingTimeMinutes,
            wordCount,
            content: matterResult.content,
            lastModified,
        }
    } catch (error) {
        console.error('Error reading blog post:', error)
        return null
    }
}

export async function getBlogPostSlugs(): Promise<string[]> {
    try {
        await fs.stat(blogDirectory)
    } catch {
        return []
    }

    const fileNames = await fs.readdir(blogDirectory)
    return fileNames.filter((fileName) => fileName.endsWith('.mdx')).map((fileName) => fileName.replace(/\.mdx$/, ''))
}

export async function getPostsByTag(tag: string, locale: string = 'en'): Promise<BlogPost[]> {
    const normalized = tag.trim().toLowerCase()
    const posts = await getAllBlogPosts(locale)
    return posts.filter((post) => (post.tags || []).some((t) => String(t).trim().toLowerCase() === normalized))
}

export async function getAllTags(locale: string = 'en'): Promise<Array<{ tag: string; count: number }>> {
    const counts = new Map<string, number>()
    const posts = await getAllBlogPosts(locale)
    for (const post of posts) {
        for (const tag of post.tags || []) {
            const key = String(tag).trim()
            if (!key) continue
            counts.set(key, (counts.get(key) || 0) + 1)
        }
    }
    return Array.from(counts.entries()).map(([tag, count]) => ({ tag, count })).sort((a, b) => (b.count - a.count) || a.tag.localeCompare(b.tag))
}

export interface PaginatedPosts {
    posts: BlogPost[]
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
}

export function paginatePosts(allPosts: BlogPost[], page: number, pageSize: number): PaginatedPosts {
    const totalItems = allPosts.length
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    const currentPage = Math.min(Math.max(1, page), totalPages)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const posts = allPosts.slice(startIndex, endIndex)
    return { posts, currentPage, totalPages, totalItems, pageSize }
}
