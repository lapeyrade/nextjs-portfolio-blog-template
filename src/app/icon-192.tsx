import { siteUrl } from "@/lib/seo";

// Serve or redirect to the single SVG icon to enforce SVG-only assets.
export default function Icon192() {
  const dst = new URL("/icon.svg", siteUrl).toString();
  return Response.redirect(dst, 307);
}
