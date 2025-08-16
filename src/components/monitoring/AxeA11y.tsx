'use client'

import { useEffect } from 'react'

export default function AxeA11y() {
    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return
        if (typeof window === 'undefined') return

        // Only enable when explicitly requested to avoid console noise
        const params = new URLSearchParams(window.location.search)
        const enabled = params.get('a11y') === '1' || process.env.NEXT_PUBLIC_AXE === '1'
        if (!enabled) return

        let cancelled = false

        async function run() {
            const ReactMod = await import('react')
            const ReactDOMMod = await import('react-dom')
            const axe = await import('@axe-core/react')
            if (cancelled) return

            // Optionally downgrade axe console errors to warnings for DX
            const downgrade = process.env.NEXT_PUBLIC_AXE_WARN === '1'
            let originalError: typeof console.error | null = null
            if (downgrade) {
                originalError = console.error
                console.error = (...args: unknown[]) => console.warn('[axe]', ...args)
            }

            axe.default(ReactMod.default, ReactDOMMod.default as unknown as typeof import('react-dom'), 1000)

            if (downgrade && originalError) {
                // Restore after first run delay
                setTimeout(() => {
                    console.error = originalError as typeof console.error
                }, 2000)
            }
        }

        run()

        return () => {
            cancelled = true
        }
    }, [])

    return null
}


