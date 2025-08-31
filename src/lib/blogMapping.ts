// Blog post slug mapping between languages
// This allows language switching to work between translated posts
export const blogSlugMapping: Record<string, Record<string, string>> = {
	// English to French mappings
	"getting-started-with-nextjs": {
		en: "getting-started-with-nextjs",
		fr: "commencer-avec-nextjs",
	},
	"mastering-tailwind-css": {
		en: "mastering-tailwind-css",
		fr: "maitriser-tailwind-css",
	},
	"typescript-best-practices": {
		en: "typescript-best-practices",
		fr: "typescript-meilleures-pratiques",
	},
	// French to English mappings (reverse lookup)
	"commencer-avec-nextjs": {
		en: "getting-started-with-nextjs",
		fr: "commencer-avec-nextjs",
	},
	"maitriser-tailwind-css": {
		en: "mastering-tailwind-css",
		fr: "maitriser-tailwind-css",
	},
	"typescript-meilleures-pratiques": {
		en: "typescript-best-practices",
		fr: "typescript-meilleures-pratiques",
	},
};

/**
 * Get the equivalent slug for a blog post in a different language
 */
export function getEquivalentSlug(
	currentSlug: string,
	targetLocale: string,
): string | null {
	const mapping = blogSlugMapping[currentSlug];
	if (!mapping) return null;

	return mapping[targetLocale] || null;
}

/**
 * Check if a blog post has a translation in the target language
 */
export function hasTranslation(
	currentSlug: string,
	targetLocale: string,
): boolean {
	return getEquivalentSlug(currentSlug, targetLocale) !== null;
}
