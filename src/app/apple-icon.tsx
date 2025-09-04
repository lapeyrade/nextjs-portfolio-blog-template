import { siteUrl } from "@/lib/seo";

// Redirect Apple touch icon requests to the SVG asset.
export default function AppleIcon() {
	const dst = new URL("/icon.svg", siteUrl).toString();
	return Response.redirect(dst, 307);
}
