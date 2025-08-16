import { useTranslations } from 'next-intl'

/**
 * Custom hook to get translations with proper typing
 * Usage: const t = useAppTranslations('namespace')
 */
export function useAppTranslations(namespace?: string) {
    return useTranslations(namespace)
}

/**
 * Get translated content from MDX files
 * This utility helps fetch locale-specific content from MDX files
 */
export async function getLocalizedMDXContent(locale: string, section: string) {
    try {
        const content = await import(`@/content/i18n/${locale}/${section}.mdx`)
        return content
    } catch (error) {
        // Fallback to English if translation doesn't exist
        console.warn(`Translation not found for ${locale}/${section}, falling back to English`)
        const fallbackContent = await import(`@/content/i18n/en/${section}.mdx`)
        return fallbackContent
    }
}

/**
 * Validate if a locale is supported
 */
export function isValidLocale(locale: string): boolean {
    return ['en', 'fr'].includes(locale)
}

/**
 * Get the opposite locale for language switching
 */
export function getAlternateLocale(currentLocale: string): string {
    return currentLocale === 'en' ? 'fr' : 'en'
}

/**
 * Format date according to locale
 */
export function formatDate(date: Date, locale: string): string {
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
