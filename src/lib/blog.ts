import fs from 'fs'
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

export function getAllBlogPosts(locale: string = 'en'): BlogPost[] {
    // Check if blog directory exists
    if (!fs.existsSync(blogDirectory)) {
        return []
    }

    let allPostsData: BlogPost[] = []

    if (locale === 'en') {
        // For English, only get posts from the root directory
        const fileNames = fs.readdirSync(blogDirectory)
        allPostsData = fileNames
            .filter((fileName) => fileName.endsWith('.mdx'))
            .map((fileName) => {
                // Remove ".mdx" from file name to get slug
                const slug = fileName.replace(/\.mdx$/, '')
                const fullPath = path.join(blogDirectory, fileName)
                return parsePostFile(fullPath, slug)
            })
    } else {
        // For other locales, get posts from locale-specific directory
        const localeDir = path.join(blogDirectory, locale)
        if (fs.existsSync(localeDir)) {
            const fileNames = fs.readdirSync(localeDir)
            allPostsData = fileNames
                .filter((fileName) => fileName.endsWith('.mdx'))
                .map((fileName) => {
                    // Remove ".mdx" from file name to get slug
                    const slug = fileName.replace(/\.mdx$/, '')
                    const fullPath = path.join(localeDir, fileName)
                    return parsePostFile(fullPath, slug)
                })
        }
    }

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

function parsePostFile(fullPath: string, slug: string): BlogPost {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    const stats = fs.statSync(fullPath)
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

export function getBlogPost(slug: string, locale: string = 'en'): BlogPost | null {
    try {
        // For French locale, prefer French-specific files first
        const localeDir = path.join(blogDirectory, locale)
        const localePath = path.join(localeDir, `${slug}.mdx`)
        const rootPath = path.join(blogDirectory, `${slug}.mdx`)

        let fullPath = ''

        // For French locale, check locale-specific directory first
        if (locale === 'fr' && fs.existsSync(localePath)) {
            fullPath = localePath
        }
        // For English or if French file doesn't exist, check root directory
        else if (fs.existsSync(rootPath)) {
            fullPath = rootPath
        }
        // Fallback to locale-specific directory
        else if (fs.existsSync(localePath)) {
            fullPath = localePath
        }
        else {
            return null
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)
        const stats = fs.statSync(fullPath)
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

export function getBlogPostSlugs(): string[] {
    if (!fs.existsSync(blogDirectory)) {
        return []
    }

    const fileNames = fs.readdirSync(blogDirectory)
    return fileNames
        .filter((fileName) => fileName.endsWith('.mdx'))
        .map((fileName) => fileName.replace(/\.mdx$/, ''))
}

export function getPostsByTag(tag: string, locale: string = 'en'): BlogPost[] {
    const normalized = tag.trim().toLowerCase()
    return getAllBlogPosts(locale).filter((post) =>
        (post.tags || []).some((t) => String(t).trim().toLowerCase() === normalized)
    )
}

export function getAllTags(locale: string = 'en'): Array<{ tag: string; count: number }> {
    const counts = new Map<string, number>()
    for (const post of getAllBlogPosts(locale)) {
        for (const tag of post.tags || []) {
            const key = String(tag).trim()
            if (!key) continue
            counts.set(key, (counts.get(key) || 0) + 1)
        }
    }
    return Array.from(counts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => (b.count - a.count) || a.tag.localeCompare(b.tag))
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
