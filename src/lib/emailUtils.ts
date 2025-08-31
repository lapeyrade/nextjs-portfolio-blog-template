/**
 * Email obfuscation utilities to prevent spam bots from scraping email addresses
 */

/**
 * Obfuscates an email address for display purposes
 * Replaces @ with [at] and . with [dot]
 */
export function obfuscateEmailForDisplay(email: string): string {
	return email.replace("@", " [at] ").replace(/\./g, " [dot] ");
}

/**
 * Creates an obfuscated mailto link that's harder for bots to detect
 * Uses base64 encoding and JavaScript to construct the link
 */
export function createObfuscatedMailtoLink(
	email: string,
	subject?: string,
): string {
	// Create the mailto URL
	let mailtoUrl = `mailto:${email}`;
	if (subject) {
		mailtoUrl += `?subject=${encodeURIComponent(subject)}`;
	}

	// Return the encoded mailto URL
	return btoa(mailtoUrl);
}

/**
 * Decodes and opens an obfuscated mailto link
 */
export function openObfuscatedEmail(encodedMailto: string): void {
	try {
		const decodedMailto = atob(encodedMailto);
		window.location.href = decodedMailto;
	} catch (error) {
		console.error("Failed to decode email link:", error);
	}
}

/**
 * Creates a clickable email component that reveals the real email on click
 */
export function createRevealableEmail(email: string): {
	displayText: string;
	revealEmail: () => string;
} {
	const obfuscated = obfuscateEmailForDisplay(email);

	return {
		displayText: obfuscated,
		revealEmail: () => email,
	};
}
