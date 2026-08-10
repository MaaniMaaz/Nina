import type { LongformPageContent } from "@/content/types";
import type { BlogFormat } from "@/content/blog";

export type PageType = "condition" | "treatment" | "blog";
export type PageStatus = "draft" | "published";

export type PageIndexMeta = {
  name: string;
  teaser: string;
  coverImageUrl?: string;
};

/** Full article body for blog pages (cards + /blog/[slug]). */
export type BlogPageContent = {
  slug: string;
  title: string;
  description: string;
  canonical: string;
  fmt: BlogFormat;
  cat: string;
  meta: string;
  date: string;
  coverImageUrl: string;
  coverAlt: string;
  dek: string;
  /** Editable body paragraphs (and optional image URLs between sections). */
  sections: Array<{ type: "text"; text: string } | { type: "image"; url: string; alt: string }>;
};

export type ManagedPageContent = LongformPageContent | BlogPageContent;

export type CmsPageDocument = {
  type: PageType;
  slug: string;
  status: PageStatus;
  /** Display / nav name */
  title: string;
  /** SEO */
  metaTitle: string;
  metaDescription: string;
  index: PageIndexMeta;
  content: ManagedPageContent;
  createdAt: Date | string;
  updatedAt: Date | string;
  publishedAt?: Date | string | null;
};

export function isLongformContent(
  content: ManagedPageContent,
): content is LongformPageContent {
  return "hero" in content && "blocks" in content;
}

export function isBlogContent(content: ManagedPageContent): content is BlogPageContent {
  return "sections" in content && "dek" in content;
}
