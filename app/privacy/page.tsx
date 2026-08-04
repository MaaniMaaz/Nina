import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { PRIVACY_POLICY } from "@/content/legal/privacy";

export const metadata: Metadata = {
  title: { absolute: PRIVACY_POLICY.meta.title },
  description: PRIVACY_POLICY.meta.description,
  alternates: { canonical: PRIVACY_POLICY.meta.canonical },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return <LegalPage doc={PRIVACY_POLICY} />;
}
