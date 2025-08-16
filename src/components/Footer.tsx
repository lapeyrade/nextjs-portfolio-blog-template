import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'

interface FooterProps {
    locale?: string
}

export default async function Footer({ locale }: FooterProps = {}) {
    const t = await getTranslations({ locale: locale || 'en', namespace: 'footer' })

    return (
        <footer className="px-6 py-8 border-t border-gray-800">
            <div className="max-w-6xl mx-auto text-center text-gray-400">
                <div className="inline-flex items-center gap-6">
                    <Link href="/terms" className="hover:text-gray-200">{t('terms')}</Link>
                    <Link href="/privacy" className="hover:text-gray-200">{t('privacy')}</Link>
                    <Link href="/contact" className="hover:text-gray-200">{t('contact')}</Link>
                </div>
                <p className="mt-2">&copy; {new Date().getFullYear()} {t('copyright')}</p>
            </div>
        </footer>
    )
}


