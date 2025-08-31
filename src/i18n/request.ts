import { getRequestConfig } from "next-intl/server";
import { type Locale, routing } from "./routing";

// Cache messages to improve performance
const messagesCache = new Map<Locale, Record<string, string>>();

export default getRequestConfig(async ({ requestLocale }) => {
	// This typically corresponds to the `[locale]` segment
	let locale = await requestLocale;

	// Ensure that a valid locale is used with better fallback handling
	if (!locale || !routing.locales.includes(locale as Locale)) {
		// Try to get locale from cookie or use default
		locale = routing.defaultLocale;
	}

	// Cast to Locale for typed cache usage
	const localeKey = locale as Locale;

	// Use cached messages if available to improve performance
	if (messagesCache.has(localeKey)) {
		return {
			locale: localeKey,
			messages: messagesCache.get(localeKey),
			// Add time zone for better initial rendering
			timeZone: "Europe/Paris", // You can make this dynamic based on locale
		};
	}

	try {
		// Load and cache messages
		const messages = (await import(`../messages/${locale}.json`)).default;
		messagesCache.set(localeKey, messages);

		return {
			locale: localeKey,
			messages,
			timeZone: localeKey === "fr" ? "Europe/Paris" : "America/New_York",
		};
	} catch {
		// Fallback to default locale if messages fail to load
		console.warn(
			`Failed to load messages for locale ${locale}, falling back to ${routing.defaultLocale}`,
		);

		const defaultMessages = (
			await import(`../messages/${routing.defaultLocale}.json`)
		).default;
		messagesCache.set(routing.defaultLocale, defaultMessages);

		return {
			locale: routing.defaultLocale,
			messages: defaultMessages,
			timeZone: "America/New_York",
		};
	}
});
