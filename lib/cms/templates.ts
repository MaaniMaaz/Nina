import type { LongformPageContent } from "@/content/types";
import type { BlogArticle, BlogFormat } from "@/content/blog";
import type { BlogPageContent, CmsPageDocument, ManagedPageContent } from "@/lib/cms/types";
import { FORMAT_COLORS } from "@/content/blog";

const PLACEHOLDER_PARAGRAPH =
  "Replace this placeholder copy with your page content. Keep the section layout; change only the words and images.";

/** Soften PCOS (or any longform) into a template with placeholder-ish hero if needed. */
export function asConditionTemplate(source: LongformPageContent): LongformPageContent {
  const c = structuredClone(source);
  c.slug = "new-condition";
  c.title = "New Condition | Nina Ross Functional Medicine";
  c.description = PLACEHOLDER_PARAGRAPH;
  c.canonical = "https://www.ninarossfm.com/conditions/new-condition";
  c.hero.eyebrow = "Condition treatment in Atlanta";
  c.hero.heading = "Root-cause care that finally connects the dots.";
  c.hero.paragraphs = [PLACEHOLDER_PARAGRAPH, PLACEHOLDER_PARAGRAPH];
  c.hero.breadcrumbLabel = "New Condition";
  return c;
}

export function asTreatmentTemplate(source: LongformPageContent): LongformPageContent {
  const c = structuredClone(source);
  c.slug = "new-treatment";
  c.title = "New Treatment | Nina Ross Functional Medicine";
  c.description = PLACEHOLDER_PARAGRAPH;
  c.canonical = "https://www.ninarossfm.com/treatments/new-treatment";
  c.hero.eyebrow = "Treatment in Atlanta";
  c.hero.heading = "A tool we use when the root cause calls for it.";
  c.hero.paragraphs = [PLACEHOLDER_PARAGRAPH, PLACEHOLDER_PARAGRAPH];
  c.hero.breadcrumbLabel = "New Treatment";
  return c;
}

export function blogArticleToContent(article: BlogArticle): BlogPageContent {
  return {
    slug: article.id,
    title: article.title,
    description: article.dek,
    canonical: `https://www.ninarossfm.com/blog/${article.id}`,
    fmt: article.fmt,
    cat: article.cat,
    meta: article.meta,
    date: article.date,
    coverImageUrl: article.img,
    coverAlt: article.alt,
    dek: article.dek,
    sections: [
      { type: "text", text: article.dek },
      {
        type: "text",
        text: "This article body is editable in the admin. Add or replace paragraphs and images there.",
      },
    ],
  };
}

export function asBlogTemplate(source: BlogPageContent): BlogPageContent {
  const c = structuredClone(source);
  c.slug = "new-article";
  c.title = "New Journal Article";
  c.description = PLACEHOLDER_PARAGRAPH;
  c.dek = PLACEHOLDER_PARAGRAPH;
  c.coverAlt = "Cover image";
  c.sections = [
    { type: "text", text: PLACEHOLDER_PARAGRAPH },
    { type: "text", text: PLACEHOLDER_PARAGRAPH },
  ];
  return c;
}

export function toSeedDocument(
  type: CmsPageDocument["type"],
  opts: {
    slug: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    indexName: string;
    indexTeaser: string;
    coverImageUrl?: string;
    content: ManagedPageContent;
  },
): Omit<CmsPageDocument, "_id"> {
  const now = new Date();
  return {
    type,
    slug: opts.slug,
    status: "published",
    title: opts.title,
    metaTitle: opts.metaTitle,
    metaDescription: opts.metaDescription,
    index: {
      name: opts.indexName,
      teaser: opts.indexTeaser,
      coverImageUrl: opts.coverImageUrl,
    },
    content: opts.content,
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  };
}

export function blogCardFromContent(c: BlogPageContent) {
  return {
    id: c.slug,
    title: c.title,
    href: `/blog/${c.slug}`,
    fmt: c.fmt,
    cat: c.cat,
    meta: c.meta,
    date: c.date,
    img: c.coverImageUrl,
    alt: c.coverAlt,
    dek: c.dek,
    fmtColor: FORMAT_COLORS[c.fmt as BlogFormat],
    isPlay: c.fmt === "Watch",
  };
}
