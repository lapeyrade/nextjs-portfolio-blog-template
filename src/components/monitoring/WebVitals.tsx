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

    // Sampling rate (0-1). Default to 0.05 (5%) to avoid high traffic.
    const SAMPLE_RATE = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WEBVITALS_SAMPLE
        ? Number(process.env.NEXT_PUBLIC_WEBVITALS_SAMPLE)
        : 0.05

    useReportWebVitals((metric) => {
        // Metric is a typed object from Next.js; we serialize a minimal superset for transport
        // and avoid leaking PII beyond standard UA + URL
        try {
            if (Math.random() <= SAMPLE_RATE) {
                sendToAnalytics(metric as unknown as SerializableRecord)
            } else if (process.env.NODE_ENV === 'development') {
                // Log in dev so developers still see metrics locally
                console.debug('[WebVitals] sampled out', metric)
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') console.error('[WebVitals] sampling error', e)
        }
    })

    return null
}


