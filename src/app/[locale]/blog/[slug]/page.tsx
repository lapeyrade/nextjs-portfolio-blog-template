import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { FadeInUp, PageTransition, ScrollReveal } from "@/components/animations";
import Footer from "@/components/Footer";
import MdxImage from "@/components/mdx/MdxImage";
import SiteHeader from "@/components/SiteHeader";
import { getAllBlogPosts, getBlogPost } from "@/lib/blog";

const rehypePrettyCodeOptions = {
  theme: "github-dark",
  keepBackground: false,
  grid: false,
};

const mdxComponents = {
  Image: MdxImage,
  img: MdxImage,
};

interface BlogPostPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const enPosts = await getAllBlogPosts("en");
  const frPosts = await getAllBlogPosts("fr");

  return [
    ...enPosts.map((post) => ({ locale: "en", slug: post.slug })),
    ...frPosts.map((post) => ({ locale: "fr", slug: post.slug })),
  ];
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.lastModified,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Generate unique IDs for accessibility
  const backTitleId = `back-title-${slug}`;
  const readTitleId = `read-title-${slug}`;
  const contactTitleId = `contact-title-${slug}`;

  const post = await getBlogPost(slug, locale);

  if (!post) {
    return (
      <PageTransition>
        <div className="min-h-screen theme-surface flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
            <p className="text-gray-300 mb-8">
              The blog post you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center rounded-md border border-accent px-6 py-3 text-accent hover:bg-gray-800 transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <PageTransition>
      <div className="min-h-screen theme-surface">
        {/* Navigation */}
        <SiteHeader variant="dark" activeBlog locale={locale} />

        {/* Article Header */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <FadeInUp delay={0.1}>
              <div className="mb-6">
                <Link
                  href={`/${locale}/blog`}
                  className="inline-flex items-center text-accent hover:opacity-90 transition-colors mb-6"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-labelledby={backTitleId}
                  >
                    <title id={backTitleId}>Back to blog</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  {t("post.backToBlog")}
                </Link>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                <time dateTime={post.date}>
                  {new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(post.date))}
                </time>
                <span>•</span>
                <span>{post.readingTime}</span>
                <span>•</span>
                <span>
                  {new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US").format(
                    post.wordCount,
                  )}{" "}
                  {t("post.words")}
                </span>
                <span>•</span>
                <span>{post.author}</span>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.3}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                {post.title}
              </h1>
            </FadeInUp>

            <FadeInUp delay={0.4}>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl">{post.description}</p>
            </FadeInUp>

            {post.tags.length > 0 && (
              <FadeInUp delay={0.5}>
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/${locale}/blog/tag/${encodeURIComponent(tag)}`}
                      className="px-3 py-1 text-sm bg-gray-800 text-accent rounded-full hover:bg-gray-700 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </FadeInUp>
            )}
          </div>
        </section>

        {/* Article Content */}
        <ScrollReveal>
          <section className="px-6 pb-16">
            <div className="max-w-4xl mx-auto">
              <article className="prose prose-lg prose-invert prose-purple max-w-none">
                <MDXRemote
                  source={post.content}
                  components={mdxComponents}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                      rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
                    },
                  }}
                />
              </article>
            </div>
          </section>
        </ScrollReveal>

        {/* Engagement Section */}
        <ScrollReveal>
          <section className="px-6 py-16 border-t border-gray-700">
            <div className="max-w-4xl mx-auto text-center">
              <FadeInUp delay={0.1}>
                <h3 className="text-2xl font-bold text-white mb-4">{t("post.engagement.title")}</h3>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                  {t("post.engagement.description")}
                </p>
              </FadeInUp>
              <FadeInUp delay={0.2}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href={`/${locale}/blog`}
                    className="inline-flex items-center rounded-md bg-gray-800 border border-gray-600 px-6 py-3 text-white hover:bg-gray-700 hover:border-accent transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-labelledby={readTitleId}
                    >
                      <title id={readTitleId}>Read more posts</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                    {t("post.engagement.readMore")}
                  </Link>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center rounded-md border border-accent px-6 py-3 text-accent hover:bg-gray-800 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-labelledby={contactTitleId}
                    >
                      <title id={contactTitleId}>Contact me</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {t("post.engagement.getInTouch")}
                  </Link>
                </div>
              </FadeInUp>
            </div>
          </section>
        </ScrollReveal>

        <Footer locale={locale} />
      </div>
    </PageTransition>
  );
}
