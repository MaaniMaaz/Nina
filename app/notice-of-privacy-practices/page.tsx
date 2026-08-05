import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { NOTICE_OF_PRIVACY_PRACTICES } from "@/content/legal/notice";

export const metadata: Metadata = {
  title: { absolute: NOTICE_OF_PRIVACY_PRACTICES.meta.title },
  description: NOTICE_OF_PRIVACY_PRACTICES.meta.description,
  alternates: { canonical: NOTICE_OF_PRIVACY_PRACTICES.meta.canonical },
  robots: { index: true, follow: true },
};

export default function NoticeOfPrivacyPracticesPage() {
  return <LegalPage doc={NOTICE_OF_PRIVACY_PRACTICES} />;
}
