import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ConfidentialiteRedirect() {
  const headersList = await headers();
  const acceptLanguage = headersList.get("Accept-Language") || "";

  // Check if French is preferred
  const prefersFrench =
    acceptLanguage.includes("fr") &&
    (acceptLanguage.indexOf("fr") < acceptLanguage.indexOf("en") || !acceptLanguage.includes("en"));

  if (prefersFrench) {
    redirect("/fr/privacy");
  } else {
    redirect("/en/privacy");
  }
}
