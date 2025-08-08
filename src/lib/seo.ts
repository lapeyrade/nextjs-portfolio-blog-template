export const siteUrl: string = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

export function absoluteUrl(path: string): string {
  if (!path) return siteUrl
  try {
    return new URL(path, siteUrl).toString()
  } catch {
    return `${siteUrl}${path.startsWith('/') ? '' : '/'}${path}`
  }
}


