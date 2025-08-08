import { NextResponse } from 'next/server'

interface WebVitalsPayload {
    id?: string
    name?: string
    value?: number
    label?: string
    delta?: number
    url?: string
    userAgent?: string
    timestamp?: number
    [key: string]: unknown
}

export async function POST(request: Request) {
    try {
        const data = (await request.json()) as WebVitalsPayload

        // Basic shape check to avoid noisy logs
        if (!data || typeof data !== 'object' || typeof data.name !== 'string') {
            return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 })
        }

        // Log to server (view in terminal/server logs). In production, forward to your APM of choice.
        // eslint-disable-next-line no-console
        console.log('[WebVitals API]', {
            name: data.name,
            value: data.value,
            id: data.id,
            label: data.label,
            url: data.url,
            ua: data.userAgent,
            ts: data.timestamp,
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        return NextResponse.json({ ok: false, error: 'Malformed JSON' }, { status: 400 })
    }
}

export async function GET() {
    return NextResponse.json({ ok: true, message: 'POST Web Vitals metrics to this endpoint.' })
}


