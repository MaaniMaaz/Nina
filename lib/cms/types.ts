import type { LongformPageContent } from "@/content/types";
import type { BlogFormat } from "@/content/blog";
import type { HomePageContent } from "@/content/home-page";
import { isHomeContent as isHomeContentShape } from "@/content/home-page";
import type { JournalArticle } from "@/content/journal";
import { isJournalContent as isJournalContentShape } from "@/content/journal";

export type PageType = "condition" | "treatment" | "blog" | "home";
export type PageStatus = "draft" | "published";

export type PageIndexMeta = {
  name: string;
  teaser: string;
  coverImageUrl?: string;
};

/** Legacy thin blog stub (admin-created extras without full journal layout). */
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
  sections: Array<{ type: "text"; text: string } | { type: "image"; url: string; alt: string }>;
};

export type { HomePageContent, JournalArticle };
export type ManagedPageContent =
  | LongformPageContent
  | BlogPageContent
  | HomePageContent
  | JournalArticle;

export type CmsPageDocument = {
  type: PageType;
  slug: string;
  status: PageStatus;
  title: string;
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

export function isJournalContent(content: unknown): content is JournalArticle {
  return isJournalContentShape(content);
}

export function isBlogContent(content: ManagedPageContent): content is BlogPageContent {
  if (isJournalContent(content)) return false;
  return "sections" in content && "dek" in content;
}

export function isHomeContent(content: unknown): content is HomePageContent {
  return isHomeContentShape(content);
}
