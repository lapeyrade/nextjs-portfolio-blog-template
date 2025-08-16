import { getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import NextLink from 'next/link'
import { getAllBlogPosts, getPostsByTag } from '@/lib/blog'
import { PageTransition, FadeInUp, ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'

interface TagPageProps {
    params: Promise<{
        locale: string
        tag: string
    }>
}

export async function generateStaticParams() {
    // Generate params for both locales
    const enPosts = getAllBlogPosts('en')
    const frPosts = getAllBlogPosts('fr')

    const enTags = new Set<string>()
    const frTags = new Set<string>()

    enPosts.forEach(post => {
        post.tags.forEach(tag => enTags.add(tag))
    })

    frPosts.forEach(post => {
        post.tags.forEach(tag => frTags.add(tag))
    })

    return [
        ...Array.from(enTags).map(tag => ({ locale: 'en', tag: encodeURIComponent(tag) })),
        ...Array.from(frTags).map(tag => ({ locale: 'fr', tag: encodeURIComponent(tag) }))
    ]
}

export async function generateMetadata({ params }: TagPageProps) {
    const { locale, tag } = await params
    const decodedTag = decodeURIComponent(tag)
    const t = await getTranslations({ locale, namespace: 'blog' })

    return {
        title: `${t('tags_title')}: ${decodedTag}`,
        description: `${t('description')} - Posts tagged with ${decodedTag}`,
    }
}

export default async function TagPage({ params }: TagPageProps) {
    const { locale, tag } = await params

    // Enable static rendering
    setRequestLocale(locale)

    const decodedTag = decodeURIComponent(tag)
    const posts = getPostsByTag(decodedTag, locale)
    const t = await getTranslations({ locale, namespace: 'blog' })

    return (
        <PageTransition>
            <div className="min-h-screen theme-surface">
                {/* Navigation */}
                <SiteHeader variant="dark" activeBlog locale={locale} />

                {/* Hero Section */}
                <section className="px-6 py-16">
                    <div className="max-w-4xl mx-auto">
                        <FadeInUp delay={0.1}>
                            <div className="mb-6">
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center text-accent hover:opacity-90 transition-colors mb-6"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Blog
                                </Link>
                            </div>
                        </FadeInUp>

                        <FadeInUp delay={0.2}>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                                {t('tags_title')}: <span className="text-accent">#{decodedTag}</span>
                            </h1>
                        </FadeInUp>

                        <FadeInUp delay={0.3}>
                            <p className="text-xl text-gray-300 mb-8">
                                {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
                            </p>
                        </FadeInUp>
                    </div>
                </section>

                {/* Posts */}
                <section className="px-6 py-16">
                    <div className="max-w-6xl mx-auto">
                        {posts.length === 0 ? (
                            <ScrollReveal>
                                <div className="text-center py-16">
                                    <h2 className="text-2xl font-bold text-white mb-4">No posts found</h2>
                                    <p className="text-gray-300 mb-8">
                                        No posts were found with the tag &quot;{decodedTag}&quot;.
                                    </p>
                                    <Link
                                        href="/blog"
                                        className="inline-block btn-accent text-white px-6 py-3 rounded-lg font-semibold"
                                    >
                                        View all posts
                                    </Link>
                                </div>
                            </ScrollReveal>
                        ) : (
                            <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {posts.map((post) => (
                                    <StaggerItem key={post.slug}>
                                        <article className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-colors group">
                                            <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                                                <time dateTime={post.date}>
                                                    {new Date(post.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </time>
                                                <span>{post.readingTime} • {post.wordCount.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')} words</span>
                                            </div>

                                            <h2 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
                                                <NextLink href={`/${locale}/blog/${post.slug}`}>
                                                    {post.title}
                                                </NextLink>
                                            </h2>

                                            <p className="text-gray-300 mb-4 line-clamp-3">
                                                {post.description}
                                            </p>

                                            {post.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {post.tags.map((postTag) => (
                                                        <NextLink
                                                            key={postTag}
                                                            href={`/${locale}/blog/tag/${encodeURIComponent(postTag)}`}
                                                            className={`px-2 py-1 text-xs rounded-full transition-colors ${postTag === decodedTag
                                                                    ? 'bg-accent text-white'
                                                                    : 'bg-gray-800 text-accent hover:bg-gray-700'
                                                                }`}
                                                        >
                                                            {postTag}
                                                        </NextLink>
                                                    ))}
                                                </div>
                                            )}

                                            <NextLink
                                                href={`/${locale}/blog/${post.slug}`}
                                                className="inline-flex items-center text-accent hover:opacity-90 transition-colors"
                                            >
                                                Read more
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </NextLink>
                                        </article>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        )}
                    </div>
                </section>

                <Footer locale={locale} />
            </div>
        </PageTransition>
    )
}
