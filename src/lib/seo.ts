export const siteUrl: string = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://nextjs-portfolio-blog-template.vercel.app"
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  if (!path) return siteUrl;
  try {
    return new URL(path, siteUrl).toString();
  } catch {
    return `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  }
}
