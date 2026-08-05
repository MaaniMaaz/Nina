import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { TERMS_OF_SERVICE } from "@/content/legal/terms";

export const metadata: Metadata = {
  title: { absolute: TERMS_OF_SERVICE.meta.title },
  description: TERMS_OF_SERVICE.meta.description,
  alternates: { canonical: TERMS_OF_SERVICE.meta.canonical },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return <LegalPage doc={TERMS_OF_SERVICE} />;
}
