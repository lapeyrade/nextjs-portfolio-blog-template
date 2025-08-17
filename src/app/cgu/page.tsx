import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

// Add metadata for SEO - canonical redirect
export const metadata = {
    robots: {
        index: false,
        follow: false,
    },
}

export default async function CGURedirect() {
    const headersList = await headers()
    const acceptLanguage = headersList.get('Accept-Language') || ''

    // Check if French is preferred  
    const prefersFrench = acceptLanguage.includes('fr') &&
        (acceptLanguage.indexOf('fr') < acceptLanguage.indexOf('en') ||
            !acceptLanguage.includes('en'))

    if (prefersFrench) {
        redirect('/fr/terms')
    } else {
        redirect('/en/terms')
    }
}
