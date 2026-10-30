import { expect, test } from "bun:test";
import { NextRequest } from "next/server";
import { NextIntlClientProvider } from "next-intl";
import type { ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GET } from "../src/app/api/search/route";
import { SearchResultLink } from "../src/components/Search";

type Result = ComponentProps<typeof SearchResultLink>["result"];

for (const locale of ["en", "fr"] as const) {
  for (const query of ["", "contact", "TypeScript"]) {
    test(`${locale} search links preserve API URLs with exactly one language prefix (query: ${query || "all"})`, async () => {
      const response = await GET(
        new NextRequest(
          `https://example.com/api/search?locale=${locale}&q=${encodeURIComponent(query)}`,
        ),
      );
      expect(response.status).toBe(200);
      const results = (await response.json()) as Result[];
      expect(results.length).toBeGreaterThan(0);
      if (!query) {
        expect(results.filter((result) => result.type === "page")).toHaveLength(
          5,
        );
        expect(results.some((result) => result.type === "blog")).toBe(true);
      }

      for (const result of results) {
        expect(result.url).toMatch(new RegExp(`^/${locale}(?:/|$)`));
        const html = renderToStaticMarkup(
          <NextIntlClientProvider locale={locale} messages={{}} timeZone="UTC">
            <SearchResultLink
              result={result}
              active={false}
              onMouseEnter={() => {}}
              onClick={() => {}}
            />
          </NextIntlClientProvider>,
        );
        expect(html).toContain(`href="${result.url}"`);
        expect(html).not.toMatch(/\/(?:en|fr)\/(?:en|fr)(?:\/|["?#])/);
      }
    });
  }
}
