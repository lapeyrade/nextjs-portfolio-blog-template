'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// This page handles root access and redirects to default locale
export default function RootPage() {
    const router = useRouter()

    useEffect(() => {
        // Client-side redirect as fallback
        router.replace('/en')
    }, [router])

    // Show a loading state while redirecting
    return (
        <div className="min-h-screen theme-surface flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
                <h1 className="text-2xl font-bold text-white mb-2">Loading...</h1>
                <p className="text-gray-300">Redirecting to your preferred language</p>
            </div>
        </div>
    )
}