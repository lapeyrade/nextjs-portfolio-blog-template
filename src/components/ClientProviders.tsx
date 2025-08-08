'use client'

import AxeA11y from '@/components/monitoring/AxeA11y'

export default function ClientProviders() {
    if (process.env.NODE_ENV !== 'development') return null
    return <AxeA11y />
}


