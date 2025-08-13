import Footer from '@/components/Footer'
import SiteHeader from '@/components/SiteHeader'
import Link from 'next/link'
import SiteNavLinks from '@/components/SiteNavLinks'
import Search from '@/components/Search'
import { notFound } from 'next/navigation'
import { getAllBlogPosts, paginatePosts, getAllTags } from '@/lib/blog'
import { PageTransition, ScrollReveal, StaggerContainer, StaggerItem, AnimatedButton } from '@/components/animations'
import MobileMenu from '@/components/MobileMenu'

const PAGE_SIZE = 6

interface Params {
    page: string
}

export function generateStaticParams() {
    const total = getAllBlogPosts().length
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    return Array.from({ length: totalPages - 1 }, (_, i) => ({ page: String(i + 2) }))
}

export default async function BlogPaginatedPage({ params }: { params: Promise<Params> }) {
    const { page } = await params

    const current = Number(page)
    if (!Number.isFinite(current) || current < 1) notFound()

    const allPosts = getAllBlogPosts()
    const { posts, totalPages } = paginatePosts(allPosts, current, PAGE_SIZE)
    if (current > totalPages) notFound()
    const tags = getAllTags()

    return (
        <PageTransition>
            <div className="min-h-screen theme-surface">
                <SiteHeader variant="dark" activeBlog />

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
                                    <h2 className="text-2xl font-bold text-white mb-4">No posts found</h2>
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
                                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                            </h2>
                                            <p className="text-gray-300 mb-4 line-clamp-3">{post.description}</p>
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
                                            <AnimatedButton href={`/blog/${post.slug}`} className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors">
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

                        <div className="mt-12 flex items-center justify-center gap-4">
                            {current > 1 && (
                                <Link href={`/blog/page/${current - 1}`} className="inline-flex items-center rounded-md border border-purple-500/40 px-3 py-2 text-sm text-purple-300 hover:bg-purple-500/10">
                                    ← Prev
                                </Link>
                            )}
                            <span className="text-gray-400 text-sm">Page {current} of {totalPages}</span>
                            {current < totalPages && (
                                <Link href={`/blog/page/${current + 1}`} className="inline-flex items-center rounded-md border border-purple-500/40 px-3 py-2 text-sm text-purple-300 hover:bg-purple-500/10">
                                    Next →
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </PageTransition>
    )
}


