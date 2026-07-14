import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPositioningBySlug } from "@/content/positioning";
import LongformPage from "@/components/templates/LongformPage";
import JsonLd from "@/components/seo/JsonLd";

const SLUG = "black-holistic-doctor-atlanta";

export function generateMetadata(): Metadata {
  const content = getPositioningBySlug(SLUG);
  if (!content) return {};
  return {
    title: content.title.replace(/\s*[\u2013-]\s*Nina Ross FM$/, ""),
    description: content.description,
    alternates: { canonical: content.canonical },
  };
}

export default function BlackHolisticDoctorAtlantaPage() {
  const content = getPositioningBySlug(SLUG);
  if (!content) notFound();

  return (
    <>
      <JsonLd schema={content.schema} />
      <LongformPage content={content} />
    </>
  );
}
