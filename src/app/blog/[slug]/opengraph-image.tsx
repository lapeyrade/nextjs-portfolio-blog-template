import { ImageResponse } from 'next/og'
import { getBlogPost } from '@/lib/blog'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Params {
    params: Promise<{ slug: string }>
}

export default async function OpenGraphImage({ params }: Params) {
    const { slug } = await params
    const post = getBlogPost(slug)

    const title = post?.title ?? 'Blog Post'

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0f172a 0%, #6d28d9 50%, #0f172a 100%)',
                    color: 'white',
                    textAlign: 'center',
                }}
            >
                <div style={{ maxWidth: 1000, padding: '40px 80px' }}>
                    <div style={{
                        fontSize: 56,
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                    }}>
                        {title}
                    </div>
                    <div style={{ marginTop: 24, fontSize: 28, opacity: 0.85 }}>
                        Your Portfolio
                    </div>
                </div>
            </div>
        ),
        size
    )
}


