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

// Simple in-memory rate limiter (per-process). Works for single instance / process.
// For horizontally scaled deployments, prefer an external shared store (Redis). 
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = 60 // max requests per IP per window
const rateLimits: Map<string, { count: number; windowStart: number }> = new Map()

function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    if (forwarded) return forwarded.split(',')[0].trim()
    return 'unknown'
}

function validatePayload(data: unknown): { ok: boolean; payload?: WebVitalsPayload; error?: string } {
    if (!data || typeof data !== 'object') return { ok: false, error: 'Invalid JSON' }
    const d = data as Record<string, unknown>
    const name = typeof d.name === 'string' ? d.name.trim() : undefined
    if (!name) return { ok: false, error: 'Missing metric name' }
    if (name.length > 64) return { ok: false, error: 'Metric name too long' }

    const value = typeof d.value === 'number' && Number.isFinite(d.value) ? d.value : undefined
    if (value !== undefined && (value < -1e6 || value > 1e8)) return { ok: false, error: 'Metric value out of range' }

    // Handle both 'timestamp' and 'ts' fields
    const timestamp = (typeof d.timestamp === 'number' && Number.isFinite(d.timestamp)) ? d.timestamp : 
                     (typeof d.ts === 'number' && Number.isFinite(d.ts)) ? d.ts : Date.now()
    
    // Accept timestamps within +/- 7 days
    const now = Date.now()
    if (Math.abs(now - timestamp) > 7 * 24 * 60 * 60 * 1000) return { ok: false, error: 'Timestamp out of acceptable range' }

    // Handle WebVitals component field names
    const url = typeof d.url === 'string' ? d.url.trim().slice(0, 2000) : 
                typeof d.path === 'string' ? d.path.trim().slice(0, 2000) : undefined
    
    const userAgent = typeof d.userAgent === 'string' ? String(d.userAgent).slice(0, 512) : 
                     typeof d.ua_snippet === 'string' ? String(d.ua_snippet).slice(0, 512) : undefined
    
    const id = typeof d.id === 'string' ? String(d.id).slice(0, 256) : undefined
    const label = typeof d.label === 'string' ? String(d.label).slice(0, 64) : undefined
    const delta = typeof d.delta === 'number' && Number.isFinite(d.delta) ? d.delta : undefined

    const payload: WebVitalsPayload = { id, name, value, label, delta, url, userAgent, timestamp }
    return { ok: true, payload }
}

export async function POST(request: Request) {
    try {
        // Optional API key enforcement: if WEBVITALS_API_KEY is set server-side, require it.
        const requiredKey = process.env.WEBVITALS_API_KEY
        if (requiredKey) {
            const header = request.headers.get('x-api-key')
            if (!header || header !== requiredKey) {
                return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
            }
        }

        const ip = getClientIp(request)
        const now = Date.now()
        const entry = rateLimits.get(ip)
        if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
            rateLimits.set(ip, { count: 1, windowStart: now })
        } else {
            entry.count += 1
            if (entry.count > RATE_LIMIT_MAX) {
                return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 })
            }
            rateLimits.set(ip, entry)
        }

        const raw = await request.json()
        
        // Handle both single metrics and batched metrics
        let metrics: unknown[]
        if (Array.isArray(raw)) {
            // Direct array of metrics
            metrics = raw
        } else if (raw && typeof raw === 'object' && 'items' in raw && Array.isArray(raw.items)) {
            // Batched format: { items: [...] }
            metrics = raw.items
        } else {
            // Single metric object
            metrics = [raw]
        }

        // Validate each metric in the batch
        const validatedMetrics: WebVitalsPayload[] = []
        for (const metric of metrics) {
            const { ok, payload, error } = validatePayload(metric)
            if (!ok) {
                return NextResponse.json({ ok: false, error: `Invalid metric: ${error}` }, { status: 400 })
            }
            validatedMetrics.push(payload!)
        }

        // Log all valid metrics
        for (const payload of validatedMetrics) {
            console.log('[WebVitals API]', {
                name: payload.name,
                value: payload.value,
                id: payload.id,
                label: payload.label,
                url: payload.url,
                ua_snippet: payload.userAgent ? payload.userAgent.slice(0, 128) : undefined,
                ts: payload.timestamp,
                ip: ip === 'unknown' ? undefined : ip,
            })
        }

        return NextResponse.json({ 
            ok: true, 
            processed: validatedMetrics.length 
        })
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('[WebVitals API] Error processing request:', error)
        }
        return NextResponse.json({ ok: false, error: 'Malformed JSON' }, { status: 400 })
    }
}

export async function GET() {
    return NextResponse.json({ ok: true, message: 'POST Web Vitals metrics to this endpoint.' })
}


