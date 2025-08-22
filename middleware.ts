import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'

export default createMiddleware({
    ...routing,
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
    // Simplified matcher that focuses on essential paths
    matcher: [
        // Enable a redirect to a matching locale at the root
        '/',

        // Set a cookie to remember the previous locale for
        // all requests that have a locale prefix  
        '/(fr|en)/:path*',

        // Enable redirects that add missing locales
        // (e.g. `/pathnames` -> `/en/pathnames`)
        '/((?!api|_next|_vercel|.*\\..*).*)'
    ]
}
