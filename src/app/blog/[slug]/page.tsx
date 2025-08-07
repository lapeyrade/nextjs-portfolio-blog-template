import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import { getBlogPost, getBlogPostSlugs } from '@/lib/blog'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { PageTransition, FadeInUp, ScrollReveal, AnimatedButton } from '@/components/animations'

interface BlogPostPageProps {
    params: Promise<{
        slug: string
    }>
}

// Custom MDX components
interface MDXComponentProps {
    children?: ReactNode
    className?: string
    [key: string]: unknown
}

const components = {
    h1: (props: MDXComponentProps) => <h1 className="text-3xl font-bold text-white mb-6" {...props} />,
    h2: (props: MDXComponentProps) => <h2 className="text-2xl font-bold text-white mb-4 mt-8" {...props} />,
    h3: (props: MDXComponentProps) => <h3 className="text-xl font-bold text-white mb-3 mt-6" {...props} />,
    p: (props: MDXComponentProps) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
    ul: (props: MDXComponentProps) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props} />,
    ol: (props: MDXComponentProps) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2" {...props} />,
    li: (props: MDXComponentProps) => <li className="text-gray-300" {...props} />,
    blockquote: (props: MDXComponentProps) => (
        <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-300 bg-gray-800/50 p-4 rounded-r-lg mb-4" {...props} />
    ),
    code: (props: MDXComponentProps) => (
        <code className="bg-gray-800 text-purple-300 px-2 py-1 rounded text-sm" {...props} />
    ),
    pre: (props: MDXComponentProps) => (
        <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4 text-gray-300" {...props} />
    ),
    a: (props: MDXComponentProps) => (
        <a className="text-purple-400 hover:text-purple-300 underline transition-colors" {...props} />
    ),
}

export async function generateStaticParams() {
    const slugs = getBlogPostSlugs()
    return slugs.map((slug) => ({
        slug: slug,
    }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = getBlogPost(slug)

    if (!post) {
        return {
            title: 'Post Not Found',
        }
    }

    return {
        title: post.title,
        description: post.description,
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = getBlogPost(slug)

    if (!post) {
        notFound()
    }

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

                {/* Back to Blog */}
                <div className="px-6 pt-6">
                    <div className="max-w-4xl mx-auto">
                        <Link
                            href="/blog"
                            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Blog
                        </Link>
                    </div>
                </div>

                {/* Article Header */}
                <article className="px-6 py-8">
                    <div className="max-w-4xl mx-auto">
                        <header className="mb-12">
                            <FadeInUp delay={0.2}>
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                    {post.title}
                                </h1>
                            </FadeInUp>

                            <FadeInUp delay={0.4}>
                                <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
                                    <time dateTime={post.date}>
                                        {new Date(post.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time>
                                    <span>•</span>
                                    <span>{post.readingTime}</span>
                                    <span>•</span>
                                    <span>By {post.author}</span>
                                </div>
                            </FadeInUp>

                            {post.description && (
                                <FadeInUp delay={0.6}>
                                    <p className="text-xl text-gray-300 leading-relaxed mb-8">
                                        {post.description}
                                    </p>
                                </FadeInUp>
                            )}

                            {post.tags.length > 0 && (
                                <FadeInUp delay={0.8}>
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 text-sm bg-purple-500/20 text-purple-300 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </FadeInUp>
                            )}
                        </header>

                        {/* Article Content */}
                        <ScrollReveal delay={0.2}>
                            <div className="prose prose-lg max-w-none">
                                <MDXRemote source={post.content} components={components} />
                            </div>
                        </ScrollReveal>
                    </div>
                </article>

                {/* Call to Action */}
                <section className="px-6 py-16 bg-gray-900/50">
                    <div className="max-w-4xl mx-auto text-center">
                        <ScrollReveal>
                            <h2 className="text-3xl font-bold text-white mb-4">Enjoyed this post?</h2>
                        </ScrollReveal>
                        <ScrollReveal delay={0.2}>
                            <p className="text-gray-300 mb-8">
                                Let&apos;s connect and discuss your next project or any questions you might have.
                            </p>
                        </ScrollReveal>
                        <ScrollReveal delay={0.4}>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <AnimatedButton
                                    href="/blog"
                                    className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Read More Posts
                                </AnimatedButton>
                                <AnimatedButton
                                    href="/contact"
                                    className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold"
                                >
                                    Get In Touch
                                </AnimatedButton>
                            </div>
                        </ScrollReveal>
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
