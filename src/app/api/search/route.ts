import { type NextRequest, NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/blog";

type SearchItem = {
	url: string;
	title: string;
	description?: string;
	type: "page" | "blog";
	date?: string;
};

// Cache for search results to avoid repeated computations
const searchCache = new Map<string, SearchItem[]>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getStaticPages(locale: string = "en"): SearchItem[] {
	const cacheKey = `static_${locale}`;
	const cached = searchCache.get(cacheKey);
	if (cached) {
		return cached;
	}

	const basePages = [
		{
			url: "/",
			title: locale === "fr" ? "Accueil" : "Home",
			description:
				locale === "fr" ? "Page d'accueil du portfolio" : "Portfolio home page",
			type: "page" as const,
		},
		{
			url: "/blog",
			title: "Blog",
			description:
				locale === "fr" ? "Articles et tutoriels" : "Articles and tutorials",
			type: "page" as const,
		},
		{
			url: "/contact",
			title: "Contact",
			description: locale === "fr" ? "Entrer en contact" : "Get in touch",
			type: "page" as const,
		},
		{
			url: "/terms",
			title: locale === "fr" ? "Conditions Générales" : "Terms",
			description:
				locale === "fr"
					? "Conditions Générales d'Utilisation"
					: "Terms and Conditions",
			type: "page" as const,
		},
		{
			url: "/privacy",
			title: locale === "fr" ? "Confidentialité" : "Privacy",
			description:
				locale === "fr" ? "Politique de Confidentialité" : "Privacy Policy",
			type: "page" as const,
		},
	];

	// Use 'always' URL strategy: always include locale prefix to match routing configuration
	const pages = basePages.map((page) => ({
		...page,
		url: page.url === "/" ? `/${locale}` : `/${locale}${page.url}`,
	}));

	searchCache.set(cacheKey, pages);
	// Clear cache after TTL
	setTimeout(() => searchCache.delete(cacheKey), CACHE_TTL);
	return pages;
}

async function getBlogItems(locale: string = "en"): Promise<SearchItem[]> {
	const cacheKey = `blog_${locale}`;
	const cached = searchCache.get(cacheKey);
	if (cached) {
		return cached;
	}

	const posts = await getAllBlogPosts(locale);
	const items = posts.map((p) => {
		// Use 'always' URL strategy: always include locale prefix to match routing configuration
		return {
			url: `/${locale}/blog/${p.slug}`,
			title: p.title,
			description: p.description,
			type: "blog" as const,
			date: p.date,
		};
	});

	searchCache.set(cacheKey, items);
	// Clear cache after TTL
	setTimeout(() => searchCache.delete(cacheKey), CACHE_TTL);
	return items;
}

function scoreItem(item: SearchItem, q: string): number {
	const hayTitle = item.title.toLowerCase();
	const hayDesc = (item.description || "").toLowerCase();
	const query = q.toLowerCase().trim();
	if (!query) return 0;

	let score = 0;
	if (hayTitle.includes(query)) score += 6;
	if (hayTitle.startsWith(query)) score += 2;
	if (hayDesc.includes(query)) score += 3;
	// Recent boost for blogs
	if (item.type === "blog" && item.date) score += 0.5;
	return score;
}

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const q = searchParams.get("q") || "";
	const locale = searchParams.get("locale") || "en";

	// Add caching headers
	const headers = new Headers({
		"Cache-Control": "public, max-age=300, stale-while-revalidate=600", // 5 minutes cache, 10 minutes stale
		"Content-Type": "application/json",
	});

	try {
		const [blogItems, staticPages] = await Promise.all([
			getBlogItems(locale),
			Promise.resolve(getStaticPages(locale)),
		]);

		let results: SearchItem[];
		if (!q) {
			// When no query, show all pages first, then blog posts (limit to prevent large responses)
			results = [...staticPages, ...blogItems.slice(0, 8)];
		} else {
			// When searching, combine all items and score them
			const items = [...staticPages, ...blogItems];
			results = items
				.map((it) => ({ ...it, _score: scoreItem(it, q) }))
				.filter((it) => it._score > 0)
				.sort((a, b) => b._score - a._score)
				.slice(0, 12);
		}

		const response = results.map((it) => ({
			url: it.url,
			title: it.title,
			description: it.description,
			type: it.type,
			date: it.date,
		}));

		return new NextResponse(JSON.stringify(response), { headers });
	} catch (error) {
		console.error("[SEARCH API] Error:", error);
		return new NextResponse(JSON.stringify({ error: "Search failed" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
