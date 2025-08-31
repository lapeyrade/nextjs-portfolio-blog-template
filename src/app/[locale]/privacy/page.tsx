import { getTranslations, setRequestLocale } from "next-intl/server";
import { FadeInUp, PageTransition } from "@/components/animations";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { Link } from "@/i18n/routing";

interface PrivacyPageProps {
	params: Promise<{
		locale: string;
	}>;
}

export async function generateMetadata({ params }: PrivacyPageProps) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "privacy" });

	return {
		title: t("title"),
		description: t("description"),
	};
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	const t = await getTranslations({ locale, namespace: "privacy" });

	return (
		<PageTransition>
			<div className="min-h-screen theme-surface">
				<SiteHeader variant="dark" locale={locale} />

				<main className="px-6 py-16">
					<div className="max-w-3xl mx-auto">
						<FadeInUp>
							<h1 className="text-4xl font-bold text-white mb-6">
								{t("title")}
							</h1>
						</FadeInUp>
						<div className="max-w-none">
							<h2 className="text-2xl font-semibold text-white mt-8 mb-3">
								{t("sections.collection.title")}
							</h2>
							<p className="text-gray-300 mb-4">
								{t("sections.collection.content")}
							</p>

							<h2 className="text-2xl font-semibold text-white mt-8 mb-3">
								{t("sections.usage.title")}
							</h2>
							<p className="text-gray-300 mb-4">
								{t("sections.usage.content")}
							</p>

							<h2 className="text-2xl font-semibold text-white mt-8 mb-3">
								{t("sections.cookies.title")}
							</h2>
							<p className="text-gray-300 mb-4">
								{t("sections.cookies.content")}
							</p>

							<h2 className="text-2xl font-semibold text-white mt-8 mb-3">
								{t("sections.retention.title")}
							</h2>
							<p className="text-gray-300 mb-4">
								{t("sections.retention.content")}
							</p>

							<h2 className="text-2xl font-semibold text-white mt-8 mb-3">
								{t("sections.rights.title")}
							</h2>
							<p className="text-gray-300 mb-4">
								{t("sections.rights.content")}
							</p>

							<h2 className="text-2xl font-semibold text-white mt-8 mb-3">
								{t("sections.contact.title")}
							</h2>
							<p className="text-gray-300 mb-4">
								{t("sections.contact.content")}{" "}
								<Link
									href="/contact"
									className="text-accent hover:text-accent-strong"
								>
									{t("sections.contact.link")}
								</Link>
								.
							</p>
						</div>
					</div>
				</main>
				<Footer locale={locale} />
			</div>
		</PageTransition>
	);
}
