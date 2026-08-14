import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import HomeInteractive from "@/components/home/HomeInteractive";
import { HomeContentProvider } from "@/components/home/HomeContentContext";
import { resolveHomeContent } from "@/lib/cms/resolve";
import { getPageByTypeSlug } from "@/lib/cms/pages";
import { isMongoConfigured } from "@/lib/mongodb";

export async function generateMetadata(): Promise<Metadata> {
  let title = "Nina Ross Functional Medicine, Atlanta";
  let description =
    "Physician-led functional medicine in Atlanta and virtual care nationwide. Root-cause care with Dr. Nina Ross, ND PhD. Start with the $99 Symptom Consultation.";

  if (isMongoConfigured()) {
    try {
      const page = await getPageByTypeSlug("home", "home");
      if (page?.status === "published") {
        if (page.metaTitle) title = page.metaTitle;
        if (page.metaDescription) description = page.metaDescription;
      }
    } catch {
      // keep defaults
    }
  }

  return {
    title,
    description,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const content = await resolveHomeContent();
  return (
    <HomeContentProvider content={content}>
      <Hero />
      <HomeInteractive />
    </HomeContentProvider>
  );
}
