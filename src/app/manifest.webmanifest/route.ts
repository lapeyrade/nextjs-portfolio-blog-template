import { siteUrl } from "@/lib/seo";

export async function GET() {
	const manifest = {
		name: "Portfolio",
		short_name: "Portfolio",
		description:
			"Personal portfolio showcasing projects, blog posts, and contact information.",
		start_url: "/",
		scope: "/",
		display: "standalone",
		background_color: "#0f172a",
		theme_color: "#8b5cf6",
		icons: [
			// Use the single scalable SVG icon for all platforms. Some platforms may
			// still prefer PNGs, but the user requested SVG-only assets.
			{
				src: "/icon.svg",
				sizes: "any",
				type: "image/svg+xml",
				purpose: "any maskable",
			},
		],
		screenshots: [
			{
				src: `${siteUrl}/opengraph-image`,
				sizes: "1200x630",
				type: "image/png",
				form_factor: "wide",
			},
		],
		categories: ["productivity", "portfolio", "development"],
		shortcuts: [
			{ name: "Blog", url: "/blog" },
			{ name: "Projects", url: "/#projects" },
			{ name: "Contact", url: "/contact" },
		],
	};

	return Response.json(manifest);
}
