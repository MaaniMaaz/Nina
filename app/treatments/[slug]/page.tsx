import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TREATMENTS, getTreatmentBySlug } from "@/content/treatments";
import LongformPage from "@/components/templates/LongformPage";
import JsonLd from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return TREATMENTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = getTreatmentBySlug(slug);
  if (!content) return {};
  return {
    title: content.title.replace(/\s*[\u2013-]\s*Nina Ross FM$/, ""),
    description: content.description,
    alternates: { canonical: content.canonical },
  };
}

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = getTreatmentBySlug(slug);
  if (!content) notFound();

  return (
    <>
      <JsonLd schema={content.schema} />
      <LongformPage content={content} />
    </>
  );
}
