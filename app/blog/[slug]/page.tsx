import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPageByTypeSlug, blogFromCms, journalFromCms, ensureJournalPages } from "@/lib/cms/pages";
import { resolveBlogPage, resolveJournalArticle } from "@/lib/cms/resolve";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isJournalContent } from "@/lib/cms/types";
import JournalArticle from "@/components/blog/JournalArticle";
import JsonLd from "@/components/seo/JsonLd";
import type { JournalArticle as JournalArticleData } from "@/content/journal";

export const dynamic = "force-dynamic";

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
  const canonical = `https://www.ninarossfm.com/blog/${slug}`;

  if (preview) {
    try {
      await ensureJournalPages();
    } catch {
      // preview still attempts whatever is already in CMS
    }
    const draft = await getPageByTypeSlug("blog", slug);
    if (draft && isJournalContent(draft.content)) {
      const j = journalFromCms(draft);
      if (j) {
        return {
          title: draft.metaTitle || j.title,
          description: draft.metaDescription || j.description || j.dek,
          robots: { index: false, follow: false },
          openGraph: {
            title: draft.metaTitle || j.title,
            description: draft.metaDescription || j.dek,
            url: canonical,
            type: "article",
            ...(j.hero?.src ? { images: [{ url: j.hero.src }] } : {}),
          },
        };
      }
    }
    if (draft) {
      const content = blogFromCms(draft);
      return {
        title: draft.metaTitle,
        description: draft.metaDescription,
        robots: { index: false, follow: false },
        openGraph: {
          title: draft.metaTitle,
          description: draft.metaDescription,
          url: canonical,
          type: "article",
          ...(content?.coverImageUrl ? { images: [{ url: content.coverImageUrl }] } : {}),
        },
      };
    }
  }

  const journal = await resolveJournalArticle(slug);
  if (journal) {
    return {
      title: journal.title,
      description: journal.description || journal.dek,
      alternates: { canonical },
      openGraph: {
        title: journal.title,
        description: journal.dek,
        url: canonical,
        type: "article",
        publishedTime: journal.datePublished,
        ...(journal.hero?.src ? { images: [{ url: journal.hero.src }] } : {}),
      },
    };
  }

  const owned = await getPageByTypeSlug("blog", slug);
  if (owned?.status === "published") {
    const content = blogFromCms(owned);
    if (content) {
      return {
        title: owned.metaTitle,
        description: owned.metaDescription,
        alternates: { canonical },
        openGraph: {
          title: owned.metaTitle,
          description: owned.metaDescription,
          url: canonical,
          type: "article",
          ...(content.coverImageUrl ? { images: [{ url: content.coverImageUrl }] } : {}),
        },
      };
    }
  }

  if (owned) {
    return { robots: { index: false, follow: false } };
  }

  const content = await resolveBlogPage(slug);
  if (!content) return {};
  return {
    title: content.title,
    description: content.dek,
    alternates: { canonical },
    openGraph: {
      title: content.title,
      description: content.dek,
      url: canonical,
      type: "article",
      ...(content.coverImageUrl ? { images: [{ url: content.coverImageUrl }] } : {}),
    },
  };
}

function journalJsonLd(a: JournalArticleData) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `https://www.ninarossfm.com/blog/${a.slug}#article`,
        headline: a.title,
        description: a.dek,
        url: `https://www.ninarossfm.com/blog/${a.slug}`,
        datePublished: a.datePublished,
        dateModified: a.datePublished,
        ...(a.wordCount ? { wordCount: a.wordCount } : {}),
        ...(a.timeRequired ? { timeRequired: a.timeRequired } : {}),
        articleSection: a.articleSection,
        inLanguage: "en-US",
        image: a.hero?.src
          ? `https://www.ninarossfm.com${a.hero.src}`
          : undefined,
        author: { "@id": "https://www.ninarossfm.com/#nina" },
        publisher: { "@id": "https://www.ninarossfm.com/#organization" },
        isPartOf: { "@id": "https://www.ninarossfm.com/blog#blog" },
      },
    ],
  };
}

export default async function BlogArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const preview = sp.preview === "1" && (await isAdminAuthenticated());

  if (preview) {
    try {
      await ensureJournalPages();
    } catch {
      // preview still attempts whatever is already in CMS
    }
    const draft = await getPageByTypeSlug("blog", slug);
    if (draft && isJournalContent(draft.content)) {
      const j = journalFromCms(draft);
      if (j) {
        return (
          <>
            <JsonLd schema={journalJsonLd(j)} />
            <JournalArticle article={j} />
          </>
        );
      }
    }
  }

  const journal = await resolveJournalArticle(slug);
  if (journal) {
    return (
      <>
        <JsonLd schema={journalJsonLd(journal)} />
        <JournalArticle article={journal} />
      </>
    );
  }

  let content = null;
  if (preview) {
    const draft = await getPageByTypeSlug("blog", slug);
    content = draft ? blogFromCms(draft) : null;
  }
  if (!content) {
    content = await resolveBlogPage(slug);
  }
  if (!content) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:px-[clamp(40px,6vw,100px)] md:py-20">
      <Link href="/blog" className="text-[13px] font-medium text-terracotta no-underline">
        ← The Journal
      </Link>
      <p className="mt-6 text-[12px] font-semibold uppercase tracking-wide text-muted">
        {content.fmt} · {content.cat} · {content.meta}
      </p>
      <h1 className="mt-3 font-display text-[32px] font-medium leading-tight text-ink md:text-[48px]">
        {content.title}
      </h1>
      <p className="mt-4 text-[17px] leading-relaxed text-body">{content.dek}</p>
      {content.coverImageUrl ? (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-sand">
          <Image
            src={content.coverImageUrl}
            alt={content.coverAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            unoptimized={content.coverImageUrl.startsWith("http")}
          />
        </div>
      ) : null}
      <div className="mt-10 space-y-6 text-[16px] leading-relaxed text-body">
        {content.sections.map((section, i) =>
          section.type === "text" ? (
            <p key={i}>{section.text}</p>
          ) : (
            <div key={i} className="relative aspect-[16/9] overflow-hidden rounded-xl bg-sand">
              <Image
                src={section.url}
                alt={section.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                unoptimized={section.url.startsWith("http")}
              />
            </div>
          ),
        )}
      </div>
    </article>
  );
}
