import Link from 'next/link'
import { getAllBlogPosts, getAllTags, paginatePosts } from '@/lib/blog'
import { PageTransition, FadeInUp, ScrollReveal, StaggerContainer, StaggerItem, AnimatedButton } from '@/components/animations'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'

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
            <div className="min-h-screen theme-surface">
                {/* Navigation */}
                <SiteHeader variant="dark" activeBlog />

                {/* Hero Section */}
                <section className="px-6 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <FadeInUp delay={0.2}>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                                My{' '}
                                <span className="text-accent-gradient">
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
                                    className="inline-flex items-center gap-2 rounded-md border border-accent px-3 py-2 text-sm text-accent hover:bg-gray-800 focus-visible:outline-none"
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
                                    className="inline-flex items-center gap-2 rounded-md border border-accent px-3 py-2 text-sm text-accent hover:bg-gray-800 focus-visible:outline-none"
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
                                        className="px-3 py-1 text-sm bg-gray-800 text-accent-strong rounded-full hover:bg-gray-700 focus-visible:outline-none"
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
                                        className="inline-block btn-accent text-white px-6 py-3 rounded-lg font-semibold"
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
                                                <span>{post.readingTime} • {post.wordCount.toLocaleString()} words</span>
                                            </div>

                                            <h2 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
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
                                                            className="px-2 py-1 text-xs bg-gray-800 text-accent rounded-full hover:bg-gray-700"
                                                        >
                                                            {tag}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}

                                            <AnimatedButton
                                                href={`/blog/${post.slug}`}
                                                className="inline-flex items-center text-accent hover:opacity-90 transition-colors"
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
                                    className="inline-flex items-center rounded-md border border-accent px-3 py-2 text-sm text-accent hover:bg-gray-800"
                                >
                                    Next →
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                <Footer />
            </div>
        </PageTransition>
    )
}
