import { getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'
import ContactForm from '@/components/ContactForm'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'
import { PageTransition, FadeInUp } from '@/components/animations'

type Props = {
    params: Promise<{ locale: string }>
}

export default async function ContactPage({ params }: Props) {
    const { locale } = await params

    // Enable static rendering
    setRequestLocale(locale)

    const t = await getTranslations({ locale, namespace: 'contact_form' })

    return (
        <PageTransition>
            <div className="min-h-screen theme-surface">
                <SiteHeader variant="dark" locale={locale} />

                <main className="px-6 py-20">
                    <div className="max-w-2xl mx-auto">
                        <FadeInUp>
                            <div className="text-center mb-12">
                                <h1 className="text-4xl font-bold text-foreground mb-4">
                                    {t('title')}
                                </h1>
                                <p className="text-lg text-foreground/80">
                                    {t('subtitle')}
                                </p>
                            </div>
                        </FadeInUp>

                        <FadeInUp delay={0.2}>
                            <ContactForm />
                        </FadeInUp>
                    </div>
                </main>

                <Footer locale={locale} />
            </div>
        </PageTransition>
    )
}
