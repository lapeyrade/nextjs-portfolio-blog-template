import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'fr'],

    // Used when no locale matches
    defaultLocale: 'en',

    // Optimize locale detection for better performance
    localeDetection: true,

    // Use 'never' to hide locale from URL, or 'always' to show it
    // For now, let's use 'as-needed' which shows locale only for non-default
    localePrefix: 'as-needed',

    // Use domain-based routing for better SEO and performance
    // This can help with initial loading times
    pathnames: {
        '/': '/',
        '/blog': {
            en: '/blog',
            fr: '/blog'
        },
        '/contact': {
            en: '/contact',
            fr: '/contact'
        },
        '/terms': {
            en: '/terms',
            fr: '/terms'
        },
        '/privacy': {
            en: '/privacy',
            fr: '/privacy'
        }
    }
})

export type Locale = (typeof routing.locales)[number]

export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing)
