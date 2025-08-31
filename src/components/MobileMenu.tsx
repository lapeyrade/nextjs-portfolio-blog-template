"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Search from "@/components/Search";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Link } from "@/i18n/routing";

interface MobileMenuProps {
	isHome?: boolean;
	hideAbout?: boolean;
	hideProjects?: boolean;
	hideBlog?: boolean;
	locale?: string;
}

export default function MobileMenu({
	isHome = false,
	hideAbout = false,
	hideProjects = false,
	hideBlog = false,
}: MobileMenuProps) {
	const [open, setOpen] = useState(false);
	const t = useTranslations("navigation");
	const tFooter = useTranslations("footer");

	// Generate unique IDs for accessibility
	const menuPanelId = useId();
	const closeIconTitleId = useId();
	const menuIconTitleId = useId();

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		if (open) document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [open]);

	return (
		<div className="md:hidden">
			<button
				type="button"
				aria-label={open ? "Close menu" : "Open menu"}
				aria-expanded={open}
				aria-controls={menuPanelId}
				onClick={() => setOpen((v) => !v)}
				className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent)]"
			>
				{open ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="h-6 w-6"
						role="img"
						aria-labelledby={closeIconTitleId}
					>
						<title id={closeIconTitleId}>Close menu</title>
						<path
							fillRule="evenodd"
							d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
							clipRule="evenodd"
						/>
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="h-6 w-6"
						role="img"
						aria-labelledby={menuIconTitleId}
					>
						<title id={menuIconTitleId}>Open menu</title>
						<path
							fillRule="evenodd"
							d="M3.75 6.75A.75.75 0 0 1 4.5 6h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm.75 4.5a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5h-15Z"
							clipRule="evenodd"
						/>
					</svg>
				)}
			</button>

			{open && (
				<div id={menuPanelId} className="fixed inset-0 z-50">
					<div
						className="absolute inset-0 bg-black/40 backdrop-blur-sm"
						aria-hidden="true"
						onClick={() => setOpen(false)}
					/>
					<div className="relative ml-auto h-full w-64 sm:w-72 max-w-[75%] theme-panel p-5 shadow-xl overflow-y-auto">
						<nav className="space-y-1 flex flex-col items-end text-right">
							{!hideAbout &&
								(isHome ? (
									<button
										type="button"
										onClick={() => {
											const element = document.getElementById("about");
											element?.scrollIntoView({ behavior: "smooth" });
											setOpen(false);
										}}
										className="block rounded px-2 py-2 text-base text-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
									>
										{t("about")}
									</button>
								) : (
									<Link
										href="/"
										scroll={false}
										onClick={() => setOpen(false)}
										className="block rounded px-2 py-2 text-base text-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
									>
										{t("about")}
									</Link>
								))}
							{!hideProjects &&
								(isHome ? (
									<button
										type="button"
										onClick={() => {
											const element = document.getElementById("projects");
											element?.scrollIntoView({ behavior: "smooth" });
											setOpen(false);
										}}
										className="block rounded px-2 py-2 text-base text-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
									>
										{t("projects")}
									</button>
								) : (
									<Link
										href="/"
										scroll={false}
										onClick={() => setOpen(false)}
										className="block rounded px-2 py-2 text-base text-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
									>
										{t("projects")}
									</Link>
								))}
							{!hideBlog && (
								<Link
									href="/blog"
									onClick={() => setOpen(false)}
									className="block rounded px-2 py-2 text-base text-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
								>
									{t("blog")}
								</Link>
							)}
							<Link
								href="/contact"
								onClick={() => setOpen(false)}
								className="block rounded px-2 py-2 text-base text-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
							>
								{t("contact")}
							</Link>
							<div className="h-px my-2 w-full bg-[var(--panel-border)]" />
							<div className="w-full flex justify-end mb-2">
								<Search enableHotkey={false} />
							</div>
							<div className="w-full flex justify-end mb-2">
								<LanguageSwitcher />
							</div>
							<div className="w-full flex justify-end mb-2">
								<ThemeSwitcher variant="mobile" />
							</div>
							<div className="h-px my-2 w-full bg-[var(--panel-border)]" />
							<Link
								href="/terms"
								onClick={() => setOpen(false)}
								className="block rounded px-2 py-2 text-sm text-foreground/80 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
							>
								{tFooter("terms")}
							</Link>
							<Link
								href="/privacy"
								onClick={() => setOpen(false)}
								className="block rounded px-2 py-2 text-sm text-foreground/80 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
							>
								{tFooter("privacy")}
							</Link>
						</nav>
					</div>
				</div>
			)}
		</div>
	);
}
