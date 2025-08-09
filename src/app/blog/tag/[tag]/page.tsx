import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllTags, getPostsByTag, paginatePosts } from '@/lib/blog'
import { PageTransition, ScrollReveal, StaggerContainer, StaggerItem, AnimatedButton, FadeInUp } from '@/components/animations'

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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
                                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                            </h2>
                                            <p className="text-gray-300 mb-4 line-clamp-3">{post.description}</p>
                                            {post.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {post.tags.map((t) => (
                                                        <Link
                                                            key={t}
                                                            href={`/blog/tag/${encodeURIComponent(t)}`}
                                                            className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full hover:bg-purple-500/30"
                                                        >
                                                            {t}
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

                        <div className="mt-12 text-center">
                            <Link href="/blog" className="text-purple-400 hover:text-purple-300">← All posts</Link>
                        </div>
                    </div>
                </section>

                <footer className="px-6 py-8 border-t border-gray-800">
                    <div className="max-w-6xl mx-auto text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Your Portfolio. Built with Next.js 15 and TailwindCSS.</p>
                    </div>
                </footer>
            </div>
        </PageTransition>
    )
}


