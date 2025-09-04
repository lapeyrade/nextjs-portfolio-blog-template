import bundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Bundle analyzer configuration
const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
	// Turbopack config (kept minimal; defaults are sufficient for most apps)
	turbopack: {},
	experimental: {
		// Optimize large packages by rewriting imports
		optimizePackageImports: ["@heroicons/react", "framer-motion"],
		// Enable Rust-based MDX for faster builds
		mdxRs: true,
		// Cache RSC fetches across HMR only in dev for faster refreshes
		serverComponentsHmrCache: process.env.NODE_ENV === "development",
		typedEnv: true,
		// Enable attribution for specific Web Vitals to aid debugging
		webVitalsAttribution: ["CLS", "LCP"],
	},
	typedRoutes: true,
	// Move serverComponentsExternalPackages to the correct location
	serverExternalPackages: [],

	// Enhanced image optimization
	images: {
		formats: ["image/webp", "image/avif"],
		deviceSizes: [640, 768, 1024, 1280, 1920],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 86400, // 24 hours
		dangerouslyAllowSVG: true,
		contentDispositionType: "attachment",
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},

	// Configure webpack for better performance
	webpack: (config, { isServer, dev }) => {
		if (isServer) {
			// Don't treat shiki as external
			config.externals = config.externals || [];
			if (Array.isArray(config.externals)) {
				config.externals = config.externals.filter(
					(external: string | Record<string, unknown>) => {
						if (typeof external === "string") {
							return !external.includes("shiki");
						}
						return true;
					},
				);
			}
		}

		// Optimize for production builds
		if (!dev) {
			config.optimization = {
				...config.optimization,
				moduleIds: "deterministic",
				chunkIds: "deterministic",
				mangleExports: true,
			};
		}

		return config;
	},
	pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
	compiler: {
		removeConsole:
			process.env.NODE_ENV === "production"
				? { exclude: ["error", "warn"] }
				: false,
	},
	// Optimize for i18n performance
	poweredByHeader: false,
	generateEtags: true,
	compress: true,

	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [{ key: "Service-Worker-Allowed", value: "/" }],
			},
			{
				// Cache static assets more aggressively
				source:
					"/(.*)\\.(ico|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2|ttf|eot)$",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				// Cache i18n messages for better performance
				source: "/messages/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=86400, stale-while-revalidate=604800",
					},
				],
			},
			{
				// Cache API routes with shorter TTL
				source: "/api/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=3600, stale-while-revalidate=86400",
					},
				],
			},
		];
	},
	// No rewrite needed; service worker is served via App Router
};

const withMDX = createMDX({
	// Add markdown plugins here, as desired
	options: {
		remarkPlugins: [],
		rehypePlugins: [],
	},
});

// Wrap MDX and Next.js config with each other
export default withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));
