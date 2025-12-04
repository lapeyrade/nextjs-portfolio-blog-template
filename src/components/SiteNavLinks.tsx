"use client";

import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Link } from "@/i18n/routing";

interface SiteNavLinksProps {
  isHome?: boolean;
  variant?: "themed" | "dark";
  activeBlog?: boolean;
  showThemeSwitcher?: boolean;
  locale?: string;
}

export default function SiteNavLinks({
  isHome = false,
  variant = "themed",
  activeBlog = false,
  showThemeSwitcher = false,
  locale: propLocale,
}: SiteNavLinksProps) {
  const t = useTranslations("navigation");
  const hookLocale = useLocale();

  // Use prop locale if provided, otherwise fall back to hook
  const locale = propLocale || hookLocale;

  const linkCls =
    variant === "dark"
      ? "text-gray-300 hover:text-white transition-colors"
      : "text-gray-700 dark:text-gray-200 hover:text-accent transition-colors";

  const blogCls = activeBlog ? "text-accent font-semibold" : linkCls;

  return (
    <div className="hidden md:flex items-center space-x-8">
      {isHome ? (
        <a href="#about" className={linkCls}>
          {t("about")}
        </a>
      ) : (
        <NextLink href={`/${locale}#about`} className={linkCls}>
          {t("about")}
        </NextLink>
      )}
      {isHome ? (
        <a href="#projects" className={linkCls}>
          {t("projects")}
        </a>
      ) : (
        <NextLink href={`/${locale}#projects`} className={linkCls}>
          {t("projects")}
        </NextLink>
      )}
      <Link href="/blog" className={blogCls}>
        {t("blog")}
      </Link>
      <Link href="/contact" className={linkCls}>
        {t("contact")}
      </Link>
      {showThemeSwitcher && <ThemeSwitcher />}
    </div>
  );
}
