import Footer from '@/components/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllTags, getPostsByTag, paginatePosts } from '@/lib/blog'
import { PageTransition, ScrollReveal, StaggerContainer, StaggerItem, AnimatedButton, FadeInUp } from '@/components/animations'
import SiteHeader from '@/components/SiteHeader'
import MobileMenu from '@/components/MobileMenu'

const PAGE_SIZE = 6

export function generateStaticParams() {
    // Return raw tag values; Next.js handles URL encoding in the path
    return getAllTags().map(({ tag }) => ({ tag }))
}

export default async function BlogTagPage({ params }: { params: Promise<{ tag: string }> }) {
    const { tag: raw } = await params
    const tag = decodeURIComponent(raw)
    const postsForTag = getPostsByTag(tag)
    if (postsForTag.length === 0) notFound()
    const { posts } = paginatePosts(postsForTag, 1, PAGE_SIZE)

    return (
        <PageTransition>
            <div className="min-h-screen theme-surface">
                <SiteHeader variant="dark" activeBlog />

                <section className="px-6 py-16">
                    <div className="max-w-6xl mx-auto">
                        <FadeInUp>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Posts tagged with #{tag}</h1>
                        </FadeInUp>

                        {posts.length === 0 ? (
                            <ScrollReveal>
                                <div className="text-center py-16">
                                    <h2 className="text-2xl font-bold text-white mb-4">No posts for this tag</h2>
                                </div>
                            </ScrollReveal>
                        ) : (
                            <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {posts.map((post) => (
                                    <StaggerItem key={post.slug}>
                                        <article className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-accent transition-colors group">
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
                                            <h2 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
                                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                            </h2>
                                            <p className="text-gray-300 mb-4 line-clamp-3">{post.description}</p>
                                            {post.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {post.tags.map((t) => (
                                                        <Link
                                                            key={t}
                                                            href={`/blog/tag/${encodeURIComponent(t)}`}
                                                            className="px-2 py-1 text-xs bg-gray-800 text-accent rounded-full hover:bg-gray-700"
                                                        >
                                                            {t}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                            <AnimatedButton href={`/blog/${post.slug}`} className="inline-flex items-center text-accent hover:opacity-90 transition-colors">
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

                        <div className="mt-12 text-center">
                            <Link href="/blog" className="text-accent transition-opacity hover:opacity-90">← All posts</Link>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </PageTransition>
    )
}


