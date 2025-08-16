import { getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'
import { PageTransition, FadeInUp, ScrollReveal, StaggerContainer, StaggerItem, AnimatedButton } from '@/components/animations'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'

type Props = {
    params: Promise<{ locale: string }>
}

export default async function Home({ params }: Props) {
    const { locale } = await params

    // Enable static rendering
    setRequestLocale(locale)

    const t = await getTranslations()

    return (
        <PageTransition>
            <div className="min-h-screen theme-surface">
                <SiteHeader isHome variant="dark" locale={locale} />

                {/* Hero Section */}
                <section className="px-6 py-20">
                    <div className="max-w-6xl mx-auto text-center">
                        <FadeInUp delay={0.2}>
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                                {t('hero.greeting')}{' '}
                                <span className="text-accent-gradient">
                                    {t('hero.name')}
                                </span>
                            </h1>
                        </FadeInUp>
                        <FadeInUp delay={0.4}>
                            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                                {t('hero.subtitle')}
                            </p>
                        </FadeInUp>
                        <FadeInUp delay={0.6}>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <AnimatedButton
                                    href="#projects"
                                    className="btn-accent px-8 py-3 rounded-lg font-semibold"
                                >
                                    {t('hero.cta_primary')}
                                </AnimatedButton>
                                <AnimatedButton
                                    href="/contact"
                                    className="border border-accent text-accent px-8 py-3 rounded-lg font-semibold hover:accent-gradient-bg hover:text-white transition-colors"
                                >
                                    {t('hero.cta_secondary')}
                                </AnimatedButton>
                            </div>
                        </FadeInUp>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="px-6 py-20">
                    <div className="max-w-6xl mx-auto">
                        <ScrollReveal>
                            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('about.title')}</h2>
                        </ScrollReveal>
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <ScrollReveal direction="left" delay={0.2}>
                                <div className="w-64 h-64 accent-gradient-bg rounded-full mx-auto"></div>
                            </ScrollReveal>
                            <ScrollReveal direction="right" delay={0.4}>
                                <div className="text-gray-300 space-y-4">
                                    <p className="text-lg">
                                        {t('about.description_1')}
                                    </p>
                                    <p className="text-lg">
                                        {t('about.description_2')}
                                    </p>
                                    <StaggerContainer className="flex flex-wrap gap-3 mt-6">
                                        {t.raw('about.skills').map((tech: string) => (
                                            <StaggerItem key={tech}>
                                                <span className="bg-gray-800 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                                                    {tech}
                                                </span>
                                            </StaggerItem>
                                        ))}
                                    </StaggerContainer>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="px-6 py-20">
                    <div className="max-w-6xl mx-auto">
                        <ScrollReveal>
                            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('projects.title')}</h2>
                        </ScrollReveal>
                        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {['project_1', 'project_2', 'project_3'].map((projectKey) => (
                                <StaggerItem key={projectKey}>
                                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:scale-105 transition-transform">
                                        <div className="h-48 accent-gradient-bg rounded-lg mb-4"></div>
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {t(`projects.${projectKey}.title`)}
                                        </h3>
                                        <p className="text-gray-400 mb-4">
                                            {t(`projects.${projectKey}.description`)}
                                        </p>
                                        <div className="flex gap-2">
                                            <AnimatedButton className="text-accent hover:text-white transition-colors">
                                                {t('projects.live_demo')}
                                            </AnimatedButton>
                                            <AnimatedButton className="text-gray-400 hover:text-white transition-colors">
                                                {t('projects.source_code')}
                                            </AnimatedButton>
                                        </div>
                                    </div>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="px-6 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <ScrollReveal>
                            <h2 className="text-4xl font-bold text-white mb-8">{t('contact.title')}</h2>
                        </ScrollReveal>
                        <ScrollReveal delay={0.2}>
                            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                                {t('contact.subtitle')}
                            </p>
                        </ScrollReveal>
                        <ScrollReveal delay={0.4}>
                            <AnimatedButton
                                href="/contact"
                                className="inline-block btn-accent text-white px-8 py-3 rounded-lg font-semibold"
                            >
                                {t('contact.cta')}
                            </AnimatedButton>
                        </ScrollReveal>
                    </div>
                </section>

                <Footer locale={locale} />
            </div>
        </PageTransition>
    )
}
