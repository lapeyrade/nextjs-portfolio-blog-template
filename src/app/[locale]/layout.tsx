import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { type Locale, routing } from "@/i18n/routing";

type Props = {
	children: ReactNode;
	params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
	const { locale } = await params;

	// Ensure that the incoming `locale` is valid
	if (!routing.locales.includes(locale as Locale)) {
		// Return 404 or redirect to default locale
		return null;
	}

	// Enable static rendering
	setRequestLocale(locale);

	// Get messages for the current locale
	const messages = await getMessages();

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			{children}
		</NextIntlClientProvider>
	);
}
