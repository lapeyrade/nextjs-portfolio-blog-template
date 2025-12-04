"use client";

import type { Route } from "next";
import { useRouter as useNextRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { startTransition, useCallback, useId, useState } from "react";
import { routing, usePathname } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  // Use Next's router directly to build absolute locale-prefixed URLs
  const router = useNextRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Generate unique ID for loading spinner
  const loadingTitleId = useId();

  const getTargetPath = useCallback((/* targetLocale: string */) => {
    // Return a locale-less path so the navigation helper can add the correct prefix.
    // Strip any leading /en or /fr segment to avoid double-prefixing (e.g. /fr/en).
    const stripped = pathname.replace(/^\/(en|fr)(?=\/|$)/, "");

    // Ensure we return a valid path starting with '/'
    return stripped === "" ? "/" : stripped;
  }, [pathname]);

  const handleLanguageChange = useCallback(
    (newLocale: string) => {
      // Don't switch if already on the same locale
      if (newLocale === locale || isLoading) {
        return;
      }

      setIsLoading(true);

      const targetPath = getTargetPath();

      // Use startTransition to avoid blocking the UI
      startTransition(async () => {
        try {
          // If this looks like a blog post, ask the server for the
          // preferred target path (this maps fr slugs to en filenames)
          const blogMatch = targetPath.match(/^\/blog\/(.+)$/);
          let finalPath = targetPath;

          if (blogMatch) {
            const res = await fetch("/api/translate-path", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                pathname: pathname,
                targetLocale: newLocale,
              }),
            });
            if (res.ok) {
              const json = await res.json();
              finalPath = json.path || targetPath;
            }
          }

          const absolute = `/${newLocale}${finalPath === "/" ? "" : finalPath}` as Route;
          router.replace(absolute);
        } catch {
          // Fallback to simple replace
          const absolute = `/${newLocale}${targetPath === "/" ? "" : targetPath}` as Route;
          router.replace(absolute);
        }
      });

      // Reset loading state after navigation completes
      // Increased timeout to account for slower connections
      const timeoutId = setTimeout(() => setIsLoading(false), 1500);

      // Clean up timeout if component unmounts
      return () => clearTimeout(timeoutId);
    },
    [locale, router, isLoading, getTargetPath, pathname],
  );

  return (
    <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
      {routing.locales.map((lang) => {
        const isActive = locale === lang;
        const label = lang === "en" ? "English" : "Français";
        const shortLabel = lang.toUpperCase();

        return (
          <button
            key={lang}
            type="button"
            onClick={() => handleLanguageChange(lang)}
            disabled={isActive || isLoading}
            className={`
                            relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 
                            focus:outline-none focus:ring-2 focus:ring-accent/50
                            ${
                              isActive
                                ? "bg-accent text-white shadow-md"
                                : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                            }
                            ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        `}
            aria-label={`Switch to ${label}`}
            title={`Switch to ${label}`}
          >
            {isLoading && !isActive ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-labelledby={loadingTitleId}
                >
                  <title id={loadingTitleId}>Loading</title>
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {shortLabel}
              </div>
            ) : (
              shortLabel
            )}
            {isActive && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
            )}
          </button>
        );
      })}
    </div>
  );
}
