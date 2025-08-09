import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon512() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0f172a',
                    color: 'white',
                    fontSize: 180,
                    fontWeight: 800,
                }}
            >
                YP
            </div>
        ),
        size
    )
}


