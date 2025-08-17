import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

// Add metadata for SEO - canonical redirect
export const metadata = {
    robots: {
        index: false,
        follow: false,
    },
}

export default async function BlogRedirect() {
    const headersList = await headers()
    const acceptLanguage = headersList.get('accept-language') || ''

    // Simple language detection based on Accept-Language header
    const isFrench = acceptLanguage.includes('fr') && !acceptLanguage.startsWith('en')

    if (isFrench) {
        redirect('/fr/blog')
    } else {
        redirect('/en/blog')
    }
}
