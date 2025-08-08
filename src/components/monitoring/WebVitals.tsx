'use client'

import { useReportWebVitals } from 'next/web-vitals'

type SerializableRecord = Record<string, unknown>

function sendToAnalytics(metric: SerializableRecord): void {
    try {
        const body = JSON.stringify({
            ...metric,
            url: typeof window !== 'undefined' ? window.location.href : undefined,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
            timestamp: Date.now(),
        })

        if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
            const blob = new Blob([body], { type: 'application/json' })
            navigator.sendBeacon('/api/web-vitals', blob)
        } else {
            // Fallback for environments without sendBeacon
            void fetch('/api/web-vitals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body,
                keepalive: true,
            })
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('[WebVitals]', metric)
        }
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('[WebVitals] Failed to send metric', error)
        }
    }
}

export default function WebVitals(): null {
    useReportWebVitals((metric) => {
        // Metric is a typed object from Next.js; we serialize a minimal superset for transport
        // and avoid leaking PII beyond standard UA + URL
        sendToAnalytics(metric as unknown as SerializableRecord)
    })

    return null
}


