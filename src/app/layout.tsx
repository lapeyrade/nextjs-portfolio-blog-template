import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import JsonLdScript from "@/components/JsonLdScript";
import LazyThirdParty from "@/components/LazyThirdParty";
import WebVitals from "@/components/monitoring/WebVitals";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";
import { siteUrl } from "@/lib/seo";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	preload: true,
});

export const metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "Portfolio | Full-Stack Developer",
		template: "%s | Portfolio",
	},
	description:
		"Personal portfolio showcasing projects, blog posts, and contact information.",
	applicationName: "Portfolio",
	keywords: [
		"Next.js",
		"React",
		"TypeScript",
		"Tailwind CSS",
		"Portfolio",
		"Web Developer",
	],
	authors: [{ name: "Your Name" }],
	creator: "Your Name",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteUrl,
		title: "Portfolio | Full-Stack Developer",
		description:
			"Personal portfolio showcasing projects, blog posts, and contact information.",
		siteName: "Portfolio",
	},
	twitter: {
		card: "summary_large_image",
		title: "Portfolio | Full-Stack Developer",
		description:
			"Personal portfolio showcasing projects, blog posts, and contact information.",
		creator: "@your_handle",
	},
	alternates: {
		canonical: "/",
	},
	manifest: "/manifest.webmanifest",
};

export const viewport = {
	themeColor: "#8b5cf6",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Generate unique ID for main content
	const _mainContentId = "main-content";
	return (
		<html lang="en" data-theme="ocean">
			<head>
				{/* Preconnect to likely external origins used by analytics, fonts and speed insights to reduce TLS/setup time */}
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin=""
				/>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://vercel.com" crossOrigin="" />

				{/* Preload critical CSS for better LCP */}
				<link rel="preload" href="/globals.css" as="style" />

				{/* Optimize first paint with critical rendering hints */}
				<link rel="preload" as="image" href="/hero-bg.webp" type="image/webp" />
			</head>
			<body className={inter.className}>
				{/* JSON-LD for the website. siteUrl is controlled server-side. */}
				<JsonLdScript siteUrl={siteUrl} />
				<a href="#main-content" className="skip-link">
					Skip to content
				</a>
				<WebVitals />
				<ClientProviders />
				<LazyThirdParty />
				<main id={_mainContentId} tabIndex={-1}>
					{children}
				</main>
				{/* Client component handles SW registration without inline scripts */}
				<RegisterServiceWorker />
			</body>
		</html>
	);
}
