'use client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { FadeInUp, PageTransition } from '@/components/animations'
import { Link } from '@/i18n/routing'

export default function LocalizedError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error')

  useEffect(() => {
    // Optional: send to monitoring service
    // console.error(error)
  }, [])

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center">
        <main className="w-full px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <FadeInUp delay={0.1}>
              <p className="text-purple-300 font-semibold tracking-widest mb-3">{t('label')}</p>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">{t('title')}</h1>
            </FadeInUp>
            <FadeInUp delay={0.3}>
              <p className="text-gray-300 mb-10 max-w-xl mx-auto">{t('description')}</p>
            </FadeInUp>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => reset()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105"
              >
                {t('tryAgain')}
              </button>
              <Link
                href="/"
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {t('goHome')}
              </Link>
              <Link
                href="/contact"
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {t('contactMe')}
              </Link>
            </div>

            <div className="mt-10 text-sm text-gray-400">
              <Link href="/" className="underline hover:text-gray-200 transition-colors">
                {t('returnHome')}
              </Link>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}
