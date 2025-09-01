"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This page handles root access and redirects to appropriate locale
export default function RootPage() {
	const router = useRouter();

	useEffect(() => {
		// Simple language detection - check if French is preferred
		const acceptLanguage =
			navigator.language || navigator.languages?.[0] || "en";
		const prefersFrench =
			acceptLanguage.includes("fr-") ||
			acceptLanguage.startsWith("fr") ||
			acceptLanguage.includes("fr,") ||
			acceptLanguage.includes("fr;");

		// Preserve any hash (e.g., #projects) when redirecting
		const hash = typeof window !== "undefined" ? window.location.hash : "";

		// Client-side redirect to avoid 307 response
		if (prefersFrench) {
			router.replace(`/fr${hash}`);
		} else {
			router.replace(`/en${hash}`);
		}
	}, [router]);

	// Return nothing while redirecting
	return null;
}
