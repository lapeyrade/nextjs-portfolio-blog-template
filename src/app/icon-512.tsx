import { siteUrl } from "@/lib/seo";

// Redirect to the SVG icon so all icon requests use the single vector asset.
export default function Icon512() {
	const dst = new URL("/icon.svg", siteUrl).toString();
	return Response.redirect(dst, 307);
}
