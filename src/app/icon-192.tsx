import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = { width: 192, height: 192 }
export const contentType = 'image/png'

export default function Icon192() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: 'white',
        fontSize: 72,
        fontWeight: 800,
      }}
    >
      YP
    </div>,
    size
  )
}
