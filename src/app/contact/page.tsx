import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export default async function ContactRedirect() {
    const headersList = await headers()
    const acceptLanguage = headersList.get('accept-language') || ''

    // Simple language detection based on Accept-Language header
    const isFrench = acceptLanguage.includes('fr') && !acceptLanguage.startsWith('en')

    if (isFrench) {
        redirect('/fr/contact')
    } else {
        redirect('/en/contact')
    }
}