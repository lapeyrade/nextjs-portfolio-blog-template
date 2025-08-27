import Image from 'next/image'

type MdxImageProps = {
  src?: string
  alt?: string
  width?: number
  height?: number
  className?: string
}

export default function MdxImage({ src, alt = '', width, height, className }: MdxImageProps) {
  if (!src) return null

  const numericWidth = typeof width === 'string' ? parseInt(width, 10) : width
  const numericHeight = typeof height === 'string' ? parseInt(height, 10) : height

  const hasSize = Number.isFinite(numericWidth) && Number.isFinite(numericHeight)

  return (
    <span className={className} style={{ display: 'block' }}>
      {hasSize ? (
        <Image
          src={src}
          alt={alt}
          width={numericWidth as number}
          height={numericHeight as number}
          className="rounded-lg border border-gray-700"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={800}
          height={450}
          className="rounded-lg border border-gray-700"
        />
      )}
    </span>
  )
}
