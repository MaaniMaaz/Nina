import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LongformPage from "@/components/templates/LongformPage";
import JsonLd from "@/components/seo/JsonLd";
import { resolveLongformPage, resolveAllSlugs } from "@/lib/cms/resolve";
import { getPageByTypeSlug, longformFromCms } from "@/lib/cms/pages";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await resolveAllSlugs("treatment");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const preview = sp.preview === "1" && (await isAdminAuthenticated());

  if (preview) {
    const draft = await getPageByTypeSlug("treatment", slug);
    if (draft) {
      return {
        title: draft.metaTitle,
        description: draft.metaDescription,
        robots: { index: false, follow: false },
        openGraph: {
          title: draft.metaTitle,
          description: draft.metaDescription,
          url: `https://www.ninarossfm.com/treatments/${slug}`,
          type: "article",
        },
      };
    }
  }

  const page = await getPageByTypeSlug("treatment", slug);
  if (page?.status === "published") {
    const image =
      page.index.coverImageUrl ||
      (longformFromCms(page)?.hero.imageUrl);
    return {
      title: page.metaTitle,
      description: page.metaDescription,
      alternates: { canonical: `https://www.ninarossfm.com/treatments/${slug}` },
      openGraph: {
        title: page.metaTitle,
        description: page.metaDescription,
        url: `https://www.ninarossfm.com/treatments/${slug}`,
        type: "article",
        ...(image ? { images: [{ url: image }] } : {}),
      },
    };
  }

  const content = await resolveLongformPage("treatment", slug);
  if (!content) return {};
  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: content.canonical },
    openGraph: {
      title: content.title,
      description: content.description,
      url: content.canonical,
      type: "article",
    },
  };
}

export default async function TreatmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const preview = sp.preview === "1" && (await isAdminAuthenticated());

  let content = null;
  if (preview) {
    const draft = await getPageByTypeSlug("treatment", slug);
    content = draft ? longformFromCms(draft) : null;
  }
  if (!content) {
    content = await resolveLongformPage("treatment", slug);
  }
  if (!content) notFound();

  return (
    <>
      <JsonLd schema={content.schema} />
      <LongformPage content={content} />
    </>
  );
}
