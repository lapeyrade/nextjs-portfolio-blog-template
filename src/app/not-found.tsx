"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Define translations
const translations = {
	en: {
		code: "404",
		title: "Page not found",
		description:
			"The page you are looking for doesn't exist or has been moved.",
		goHome: "Go to Homepage",
		visitBlog: "Visit the Blog",
		contactMe: "Contact Me",
	},
	fr: {
		code: "404",
		title: "Page non trouvée",
		description: "La page que vous recherchez n'existe pas ou a été déplacée.",
		goHome: "Aller à l'accueil",
		visitBlog: "Visiter le blog",
		contactMe: "Me contacter",
	},
};

function getLocaleFromContext(): "en" | "fr" {
	if (typeof window === "undefined") return "en";

	// First check the current URL path for locale
	const currentPath = window.location.pathname;
	if (currentPath.startsWith("/fr")) return "fr";
	if (currentPath.startsWith("/en")) return "en";

	// Check for stored locale preference
	const storedLocale = document.cookie
		.split("; ")
		.find((row) => row.startsWith("NEXT_LOCALE="))
		?.split("=")[1];

	if (storedLocale === "fr") return "fr";
	if (storedLocale === "en") return "en";

	// Check browser language as last fallback
	const browserLang = navigator.language || navigator.languages?.[0];
	if (browserLang?.startsWith("fr")) return "fr";

	return "en";
}

export default function NotFound() {
	const [locale, setLocale] = useState<"en" | "fr">("en");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setLocale(getLocaleFromContext());
		setMounted(true);
	}, []);

	// Use default English during SSR and before hydration
	const t = translations[mounted ? locale : "en"];
	const homeLink = mounted && locale === "fr" ? "/fr" : "/en";
	const blogLink = mounted && locale === "fr" ? "/fr/blog" : "/en/blog";
	const contactLink =
		mounted && locale === "fr" ? "/fr/contact" : "/en/contact";

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center">
			<main className="w-full px-6 py-20">
				<div className="max-w-3xl mx-auto text-center">
					<p className="text-purple-300 font-semibold tracking-widest mb-3">
						{t.code}
					</p>
					<h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
						{t.title}
					</h1>
					<p className="text-gray-300 mb-10 max-w-xl mx-auto">
						{t.description}
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link
							href={homeLink}
							className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105"
						>
							{t.goHome}
						</Link>
						<Link
							href={blogLink}
							className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
						>
							{t.visitBlog}
						</Link>
						<Link
							href={contactLink}
							className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
						>
							{t.contactMe}
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
}
