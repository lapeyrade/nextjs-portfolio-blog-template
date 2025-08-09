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

const blogDirectory = path.join(process.cwd(), 'src/content/blog')

export function getAllBlogPosts(): BlogPost[] {
    // Check if blog directory exists
    if (!fs.existsSync(blogDirectory)) {
        return []
    }

    const fileNames = fs.readdirSync(blogDirectory)
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.mdx'))
        .map((fileName) => {
            // Remove ".mdx" from file name to get slug
            const slug = fileName.replace(/\.mdx$/, '')

            // Read markdown file as string
            const fullPath = path.join(blogDirectory, fileName)
            const fileContents = fs.readFileSync(fullPath, 'utf8')

            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents)
            const stats = fs.statSync(fullPath)
            const fm = matterResult.data as BlogFrontmatter
            const updatedFromFm =
                normalizeToIsoString(fm.updated) ||
                normalizeToIsoString(fm.lastModified) ||
                normalizeToIsoString(fm.modified) ||
                normalizeToIsoString(fm.updateDate)
            const lastModified: string = updatedFromFm ?? stats.mtime.toISOString()

            // Calculate reading time
            const readingTimeResult = readingTime(matterResult.content)

            return {
                slug,
                title: fm.title || 'Untitled',
                description: fm.description || '',
                date: fm.date || new Date().toISOString(),
                author: fm.author || 'Anonymous',
                tags: fm.tags || [],
                readingTime: readingTimeResult.text,
                content: matterResult.content,
                lastModified,
            } as BlogPost
        })

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getBlogPost(slug: string): BlogPost | null {
    try {
        const fullPath = path.join(blogDirectory, `${slug}.mdx`)

        if (!fs.existsSync(fullPath)) {
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
        const readingTimeResult = readingTime(matterResult.content)

        return {
            slug,
            title: fm.title || 'Untitled',
            description: fm.description || '',
            date: fm.date || new Date().toISOString(),
            author: fm.author || 'Anonymous',
            tags: fm.tags || [],
            readingTime: readingTimeResult.text,
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

export function getPostsByTag(tag: string): BlogPost[] {
    const normalized = tag.trim().toLowerCase()
    return getAllBlogPosts().filter((post) =>
        (post.tags || []).some((t) => String(t).trim().toLowerCase() === normalized)
    )
}

export function getAllTags(): Array<{ tag: string; count: number }> {
    const counts = new Map<string, number>()
    for (const post of getAllBlogPosts()) {
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
