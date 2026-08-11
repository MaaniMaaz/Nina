import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { ACCESSIBILITY_STATEMENT } from "@/content/legal/accessibility";

export const metadata: Metadata = {
  title: { absolute: ACCESSIBILITY_STATEMENT.meta.title },
  description: ACCESSIBILITY_STATEMENT.meta.description,
  alternates: { canonical: ACCESSIBILITY_STATEMENT.meta.canonical },
  robots: { index: true, follow: true },
};

export default function AccessibilityPage() {
  return <LegalPage doc={ACCESSIBILITY_STATEMENT} />;
}
