import { getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { PageTransition, FadeInUp } from '@/components/animations'
import Footer from '@/components/Footer'
import SiteHeader from '@/components/SiteHeader'

interface TermsPageProps {
    params: Promise<{
        locale: string
    }>
}

export async function generateMetadata({ params }: TermsPageProps) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'terms' })

    return {
        title: t('title'),
        description: t('description'),
    }
}

export default async function TermsPage({ params }: TermsPageProps) {
    const { locale } = await params

    // Enable static rendering
    setRequestLocale(locale)

    const t = await getTranslations({ locale, namespace: 'terms' })

    return (
        <PageTransition>
            <div className="min-h-screen theme-surface">
                <SiteHeader variant="dark" />

                <main className="px-6 py-16">
                    <div className="max-w-3xl mx-auto">
                        <FadeInUp>
                            <h1 className="text-4xl font-bold text-white mb-6">{t('title')}</h1>
                        </FadeInUp>
                        <div className="max-w-none">
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">{t('sections.acceptance.title')}</h2>
                            <p className="text-gray-300 mb-4">{t('sections.acceptance.content')}</p>

                            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">{t('sections.usage.title')}</h2>
                            <p className="text-gray-300 mb-4">{t('sections.usage.content')}</p>

                            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">{t('sections.property.title')}</h2>
                            <p className="text-gray-300 mb-4">{t('sections.property.content')}</p>

                            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">{t('sections.liability.title')}</h2>
                            <p className="text-gray-300 mb-4">{t('sections.liability.content')}</p>

                            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">{t('sections.changes.title')}</h2>
                            <p className="text-gray-300 mb-4">{t('sections.changes.content')}</p>

                            <p className="text-gray-400 mt-8">
                                {t('footer.question')}{' '}
                                <Link href="/contact" className="text-accent hover:text-accent-strong">
                                    {t('footer.contact')}
                                </Link>.
                            </p>
                        </div>
                    </div>
                </main>
                <Footer locale={locale} />
            </div>
        </PageTransition>
    )
}
