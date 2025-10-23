"use client";

import type { Route } from "next";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { Link, useRouter } from "@/i18n/routing";

type Result = {
	url: string;
	title: string;
	description?: string;
	type: "page" | "blog";
	date?: string;
};

interface SearchProps {
	enableHotkey?: boolean;
}

export default function Search({ enableHotkey = true }: SearchProps) {
	const t = useTranslations("search");
	const locale = useLocale();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [q, setQ] = useState("");
	const [results, setResults] = useState<Result[]>([]);
	const [activeIndex, setActiveIndex] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);
	const resultsRef = useRef<HTMLDivElement>(null);
	const modalRef = useRef<HTMLDivElement>(null);

	// Generate unique IDs for accessibility
	const searchIconTitleId = useId();
	const modalSearchTitleId = useId();

	// Clear results when locale changes to prevent stale data
	useEffect(() => {
		setResults([]);
		setQ("");
	}, []);

	// Toggle with cmd+k / ctrl+k
	useEffect(() => {
		if (!enableHotkey) return;

		const onKey = (e: KeyboardEvent) => {
			const isMac = navigator.platform.toUpperCase().includes("MAC");
			const combo =
				(isMac && e.metaKey && e.key.toLowerCase() === "k") ||
				(!isMac && e.ctrlKey && e.key.toLowerCase() === "k");
			if (combo) {
				e.preventDefault();
				// Clear any cached results when opening
				setResults([]);
				setQ("");
				setOpen((v) => !v);
			}
			if (e.key === "Escape") setOpen(false);
			if (open && results.length > 0) {
				if (e.key === "ArrowDown") {
					e.preventDefault();
					setActiveIndex((i) => Math.min(i + 1, results.length - 1));
				} else if (e.key === "ArrowUp") {
					e.preventDefault();
					setActiveIndex((i) => Math.max(i - 1, 0));
				} else if (e.key === "Enter") {
					const target = results[activeIndex];
					if (target) {
						e.preventDefault();
						setOpen(false);

						// All URLs now include locale prefix, so we can use Link for all navigation
						const isBlogPost =
							target.url.includes("/blog/") && !target.url.endsWith("/blog");

						if (isBlogPost) {
							// For blog posts, use window.location for reliable navigation to dynamic routes
							window.location.href = target.url;
						} else {
							// For static pages, use router navigation with proper locale handling
							if (target.url === `/${locale}` || target.url === "/") {
								router.push("/");
							} else if (
								target.url === `/${locale}/blog` ||
								target.url === "/blog"
							) {
								router.push("/blog");
							} else if (
								target.url === `/${locale}/contact` ||
								target.url === "/contact"
							) {
								router.push("/contact");
							} else {
								// Fallback for other static pages
								window.location.href = target.url;
							}
						}
					}
				}
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, results, activeIndex, enableHotkey, router, locale]);

	useEffect(() => {
		if (!open) return;
		inputRef.current?.focus();
		setActiveIndex(0);
		// Force fresh fetch when opening search
		setQ("");

		// Focus trap implementation
		const handleTabKey = (e: KeyboardEvent) => {
			if (e.key !== "Tab" || !modalRef.current) return;

			const focusableElements = modalRef.current.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
			);
			const firstElement = focusableElements[0] as HTMLElement;
			const lastElement = focusableElements[
				focusableElements.length - 1
			] as HTMLElement;

			if (e.shiftKey) {
				if (document.activeElement === firstElement) {
					e.preventDefault();
					lastElement?.focus();
				}
			} else {
				if (document.activeElement === lastElement) {
					e.preventDefault();
					firstElement?.focus();
				}
			}
		};

		document.addEventListener("keydown", handleTabKey);
		return () => document.removeEventListener("keydown", handleTabKey);
	}, [open]);

	// Scroll active item into view
	useEffect(() => {
		if (!resultsRef.current || results.length === 0) return;

		const activeElement = resultsRef.current.children[
			activeIndex
		] as HTMLElement;
		if (activeElement) {
			activeElement.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});
		}
	}, [activeIndex, results.length]);

	useEffect(() => {
		const controller = new AbortController();
		const fetchResults = async () => {
			// Add timestamp to prevent caching issues
			const timestamp = Date.now();
			const res = await fetch(
				`/api/search?q=${encodeURIComponent(q)}&locale=${locale}&t=${timestamp}`,
				{ signal: controller.signal },
			);
			if (!res.ok) return;
			const data = await res.json();
			setResults(data);
			setActiveIndex(0);
		};

		// Fetch results when search opens or when query changes
		if (open) {
			fetchResults().catch(() => {});
		}

		return () => controller.abort();
	}, [q, locale, open]);

	return (
		<div>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="inline-flex items-center gap-2 rounded-md border border-accent px-3 py-1.5 text-sm text-accent hover:bg-gray-800"
				aria-label="Open search"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					className="h-4 w-4"
					role="img"
					aria-labelledby={searchIconTitleId}
				>
					<title id={searchIconTitleId}>Search</title>
					<path
						fillRule="evenodd"
						d="M10.5 3.75a6.75 6.75 0 1 0 4.27 12.03l3.74 3.73a.75.75 0 1 0 1.06-1.06l-3.73-3.74A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z"
						clipRule="evenodd"
					/>
				</svg>
				<span>{t("button_text")}</span>
				{enableHotkey && (
					<span className="ml-1 rounded bg-gray-700/60 px-1.5 py-0.5 text-[10px]">
						⌘&nbsp;K
					</span>
				)}
			</button>

			{open && (
				<div className="fixed inset-0 z-50">
					<button
						type="button"
						className="absolute inset-0 bg-black/40 backdrop-blur-sm"
						onClick={() => setOpen(false)}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								setOpen(false);
							}
						}}
						aria-label="Close search modal"
					/>
					<div
						ref={modalRef}
						className="relative mx-auto mt-20 w-[92%] max-w-xl theme-panel p-4 shadow-xl"
					>
						<div className="flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="h-5 w-5 text-foreground/70"
								role="img"
								aria-labelledby={modalSearchTitleId}
							>
								<title id={modalSearchTitleId}>Search</title>
								<path
									fillRule="evenodd"
									d="M10.5 3.75a6.75 6.75 0 1 0 4.27 12.03l3.74 3.73a.75.75 0 1 0 1.06-1.06l-3.73-3.74A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z"
									clipRule="evenodd"
								/>
							</svg>
							<input
								ref={inputRef}
								value={q}
								onChange={(e) => setQ(e.target.value)}
								placeholder={t("placeholder")}
								className="w-full bg-transparent text-foreground placeholder:text-foreground/70 focus:outline-none text-base"
								aria-label="Search site"
							/>
							<button
								type="button"
								onClick={() => setOpen(false)}
								className="text-foreground/70 hover:text-accent"
								aria-label="Close search"
							>
								{t("close")}
							</button>
						</div>
						<div
							ref={resultsRef}
							className="mt-3 max-h-80 overflow-y-auto divide-y divide-[var(--panel-border)]"
						>
							{results.length === 0 ? (
								<div className="p-3 text-foreground/70">{t("no_results")}</div>
							) : (
								results.map((r, idx) => {
									const isDynamic =
										r.url.includes("/blog/") && !r.url.endsWith("/blog");

									if (isDynamic) {
										return (
											<NextLink
												key={r.url}
												href={{ pathname: r.url }}
												className={`block p-3 rounded ${idx === activeIndex ? "bg-gray-800/60" : "hover:bg-gray-800/50"}`}
												onMouseEnter={() => setActiveIndex(idx)}
												onClick={() => setOpen(false)}
											>
												<div className="flex items-center justify-between">
													<h4 className="font-medium text-foreground">
														{r.title}
													</h4>
													<span className="text-xs text-foreground/60">
														{r.type}
													</span>
												</div>
												{r.description && (
													<p className="text-sm text-foreground/80">
														{r.description}
													</p>
												)}
											</NextLink>
										);
									}

									// For static pages, use i18n Link with known routes
									const staticHref =
										r.url === "/"
											? "/"
											: r.url === "/blog"
												? "/blog"
												: r.url === "/contact"
													? "/contact"
													: r.url;

									return (
										<Link
											key={r.url}
											href={
												staticHref as Route as
													| "/"
													| "/blog"
													| "/contact"
													| "/terms"
													| "/privacy"
											}
											className={`block p-3 rounded ${idx === activeIndex ? "bg-gray-800/60" : "hover:bg-gray-800/50"}`}
											onMouseEnter={() => setActiveIndex(idx)}
											onClick={() => setOpen(false)}
										>
											<div className="flex items-center justify-between">
												<h4 className="font-medium text-foreground">
													{r.title}
												</h4>
												<span className="text-xs text-foreground/60">
													{r.type}
												</span>
											</div>
											{r.description && (
												<p className="text-sm text-foreground/80">
													{r.description}
												</p>
											)}
										</Link>
									);
								})
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
