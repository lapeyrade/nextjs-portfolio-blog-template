import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Add metadata for SEO - canonical redirect
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ContactRedirect() {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";

  // Simple language detection based on Accept-Language header
  const isFrench = acceptLanguage.includes("fr") && !acceptLanguage.startsWith("en");

  if (isFrench) {
    redirect("/fr/contact");
  } else {
    redirect("/en/contact");
  }
}
