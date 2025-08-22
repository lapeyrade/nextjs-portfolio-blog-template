import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

// This page handles root access and redirects to appropriate locale
export default async function RootPage() {
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language')
  
  // Simple language detection - check if French is preferred
  const prefersFrench = acceptLanguage?.includes('fr-') || 
                       acceptLanguage?.startsWith('fr') ||
                       acceptLanguage?.includes('fr,') ||
                       acceptLanguage?.includes('fr;')
  
  // Redirect to appropriate locale
  if (prefersFrench) {
    redirect('/fr')
  } else {
    redirect('/en')
  }
}
