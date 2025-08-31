"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Define translations
const translations = {
	en: {
		label: "Something went wrong",
		title: "An unexpected error occurred",
		description:
			"Please try again. If the problem persists, feel free to reach out via the contact page.",
		tryAgain: "Try Again",
		goHome: "Go Home",
		contactMe: "Contact Me",
	},
	fr: {
		label: "Quelque chose s'est mal passé",
		title: "Une erreur inattendue s'est produite",
		description:
			"Veuillez réessayer. Si le problème persiste, n'hésitez pas à nous contacter via la page de contact.",
		tryAgain: "Réessayer",
		goHome: "Aller à l'accueil",
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

export default function GlobalError({
	error: _error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const [locale, setLocale] = useState<"en" | "fr">("en");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setLocale(getLocaleFromContext());
		setMounted(true);
		// Optional: send to monitoring service
		// console.error(error)
	}, []);

	// Use default English during SSR and before hydration
	const t = translations[mounted ? locale : "en"];
	const homeLink = mounted && locale === "fr" ? "/fr" : "/en";
	const contactLink =
		mounted && locale === "fr" ? "/fr/contact" : "/en/contact";

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center">
			<main className="w-full px-6 py-20">
				<div className="max-w-3xl mx-auto text-center">
					<p className="text-purple-300 font-semibold tracking-widest mb-3">
						{t.label}
					</p>
					<h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
						{t.title}
					</h1>
					<p className="text-gray-300 mb-10 max-w-xl mx-auto">
						{t.description}
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<button
							type="button"
							onClick={() => reset()}
							className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105"
						>
							{t.tryAgain}
						</button>
						<Link
							href={homeLink}
							className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
						>
							{t.goHome}
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
