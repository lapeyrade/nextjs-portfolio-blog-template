'use client'

import { useEffect } from 'react'

interface JsonLdScriptProps {
  siteUrl: string
}

export default function JsonLdScript({ siteUrl }: JsonLdScriptProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: typeof siteUrl === 'string' ? siteUrl : undefined,
      name: 'Portfolio',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    })
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [siteUrl])

  return null
}
