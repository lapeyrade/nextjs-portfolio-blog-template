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

            // Calculate reading time
            const readingTimeResult = readingTime(matterResult.content)

            return {
                slug,
                title: matterResult.data.title || 'Untitled',
                description: matterResult.data.description || '',
                date: matterResult.data.date || new Date().toISOString(),
                author: matterResult.data.author || 'Anonymous',
                tags: matterResult.data.tags || [],
                readingTime: readingTimeResult.text,
                content: matterResult.content,
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
        const readingTimeResult = readingTime(matterResult.content)

        return {
            slug,
            title: matterResult.data.title || 'Untitled',
            description: matterResult.data.description || '',
            date: matterResult.data.date || new Date().toISOString(),
            author: matterResult.data.author || 'Anonymous',
            tags: matterResult.data.tags || [],
            readingTime: readingTimeResult.text,
            content: matterResult.content,
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
