'use client'

import { useEffect } from 'react'

export default function AxeA11y() {
    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return

        let cancelled = false

        async function run() {
            const ReactMod = await import('react')
            const ReactDOMMod = await import('react-dom')
            const axe = await import('@axe-core/react')
            if (!cancelled) {
                axe.default(ReactMod.default, ReactDOMMod.default as unknown as typeof import('react-dom'), 1000)
            }
        }

        run()

        return () => {
            cancelled = true
        }
    }, [])

    return null
}


