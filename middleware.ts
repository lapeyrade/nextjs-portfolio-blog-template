import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'

export default createMiddleware({
    ...routing,
    // Use 'as-needed' to show locale only for non-default language
    localePrefix: 'as-needed',
    alternateLinks: false, // Disable alternate links for better performance
    localeCookie: {
        name: 'NEXT_LOCALE',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax' // Better performance and security
    },
    // Use Accept-Language header for better initial detection
    localeDetection: true
})

export const config = {
    // Match only internationalized pathnames with more specific patterns
    matcher: [
        // Enable a redirect to a matching locale at the root
        '/',

        // Set a cookie to remember the previous locale for
        // all requests that have a locale prefix  
        '/(fr|en)/:path*',

        // Enable redirects that add missing locales
        // (e.g. `/pathnames` -> `/en/pathnames`)
        // Exclude API routes, Next.js files, and static assets more efficiently
        '/((?!api|_next|_vercel|favicon\\.ico|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|.*\\.[a-zA-Z0-9]+$).*)'
    ]
}
