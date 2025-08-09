import Link from 'next/link'
import { getAllBlogPosts, getAllTags, paginatePosts } from '@/lib/blog'
import { PageTransition, FadeInUp, ScrollReveal, StaggerContainer, StaggerItem, AnimatedButton } from '@/components/animations'

export const metadata = {
    title: 'Blog',
    description: 'Thoughts, tutorials, and insights about web development',
}

const PAGE_SIZE = 6

export default function BlogPage() {
    const allPosts = getAllBlogPosts()
    const { posts, totalPages } = paginatePosts(allPosts, 1, PAGE_SIZE)
    const tags = getAllTags()

    return (
        <PageTransition>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                {/* Navigation */}
                <nav className="p-6">
                    <div className="max-w-6xl mx-auto flex justify-between items-center">
                        <Link href="/" className="text-2xl font-bold text-white hover:text-purple-400 transition-colors">
                            Portfolio
                        </Link>
                        <div className="hidden md:flex space-x-8">
                            <Link href="/#about" className="text-gray-300 hover:text-white transition-colors">About</Link>
                            <Link href="/#projects" className="text-gray-300 hover:text-white transition-colors">Projects</Link>
                            <Link href="/blog" className="text-purple-400 font-semibold">Blog</Link>
                            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="px-6 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <FadeInUp delay={0.2}>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                                My{' '}
                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Blog
                                </span>
                            </h1>
                        </FadeInUp>
                        <FadeInUp delay={0.4}>
                            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                                Thoughts, tutorials, and insights about web development, technology, and creative coding.
                            </p>
                        </FadeInUp>
                        <FadeInUp delay={0.5}>
                            <div className="flex items-center justify-center gap-3">
                                <a
                                    href="/rss.xml"
                                    rel="alternate"
                                    type="application/rss+xml"
                                    className="inline-flex items-center gap-2 rounded-md border border-purple-500/40 px-3 py-2 text-sm text-purple-300 hover:bg-purple-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                                    aria-label="Subscribe via RSS"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                                        <path d="M6.18 17.82a1.82 1.82 0 1 1-3.64 0 1.82 1.82 0 0 1 3.64 0Z" />
                                        <path d="M2.5 9.75a11.75 11.75 0 0 1 11.75 11.75h-2.5A9.25 9.25 0 0 0 2.5 12.25v-2.5Z" />
                                        <path d="M2.5 4a17.5 17.5 0 0 1 17.5 17.5h-2.5A15 15 0 0 0 2.5 6.5V4Z" />
                                    </svg>
                                    RSS
                                </a>
                                <a
                                    href="/feed.json"
                                    rel="alternate"
                                    type="application/feed+json"
                                    className="inline-flex items-center gap-2 rounded-md border border-purple-500/40 px-3 py-2 text-sm text-purple-300 hover:bg-purple-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                                    aria-label="Subscribe via JSON Feed"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                                        <path d="M4 4h16v16H4z" opacity=".2" />
                                        <path d="M7 7h10v2H7zM7 11h10v2H7zM7 15h10v2H7z" />
                                    </svg>
                                    JSON
                                </a>
                            </div>
                        </FadeInUp>
                    </div>
                </section>

                {/* Tag Filter + Blog Posts */}
                <section className="px-6 py-16">
                    <div className="max-w-6xl mx-auto">
                        {tags.length > 0 && (
                            <div className="mb-8 flex flex-wrap gap-2">
                                {tags.map(({ tag, count }) => (
                                    <Link
                                        key={tag}
                                        href={`/blog/tag/${encodeURIComponent(tag)}`}
                                        className="px-3 py-1 text-sm bg-purple-500/20 text-purple-300 rounded-full hover:bg-purple-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                                    >
                                        #{tag} <span className="opacity-70">({count})</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                        {posts.length === 0 ? (
                            <ScrollReveal>
                                <div className="text-center py-16">
                                    <h2 className="text-2xl font-bold text-white mb-4">Coming Soon!</h2>
                                    <p className="text-gray-300 mb-8">
                                        I&apos;m working on some exciting blog posts. Check back soon for updates!
                                    </p>
                                    <AnimatedButton
                                        href="/"
                                        className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold"
                                    >
                                        Back to Home
                                    </AnimatedButton>
                                </div>
                            </ScrollReveal>
                        ) : (
                            <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {posts.map((post) => (
                                    <StaggerItem key={post.slug}>
                                        <article className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-colors group">
                                            <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                                                <time dateTime={post.date}>
                                                    {new Date(post.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </time>
                                                <span>{post.readingTime}</span>
                                            </div>

                                            <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                                                <Link href={`/blog/${post.slug}`}>
                                                    {post.title}
                                                </Link>
                                            </h2>

                                            <p className="text-gray-300 mb-4 line-clamp-3">
                                                {post.description}
                                            </p>

                                            {post.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {post.tags.map((tag) => (
                                                        <Link
                                                            key={tag}
                                                            href={`/blog/tag/${encodeURIComponent(tag)}`}
                                                            className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full hover:bg-purple-500/30"
                                                        >
                                                            {tag}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}

                                            <AnimatedButton
                                                href={`/blog/${post.slug}`}
                                                className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                                            >
                                                Read more
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </AnimatedButton>
                                        </article>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        )}

                        {totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-4">
                                <span className="text-gray-400 text-sm">Page 1 of {totalPages}</span>
                                <Link
                                    href="/blog/page/2"
                                    className="inline-flex items-center rounded-md border border-purple-500/40 px-3 py-2 text-sm text-purple-300 hover:bg-purple-500/10"
                                >
                                    Next →
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="px-6 py-8 border-t border-gray-800">
                    <div className="max-w-6xl mx-auto text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Your Portfolio. Built with Next.js 15 and TailwindCSS.</p>
                    </div>
                </footer>
            </div>
        </PageTransition>
    )
}
