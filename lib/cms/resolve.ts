import {
  getPublishedPage,
  getPageByTypeSlug,
  listPublishedIndex,
  listPublishedPages,
  longformFromCms,
  blogFromCms,
} from "@/lib/cms/pages";
import { isMongoConfigured } from "@/lib/mongodb";
import { getConditionBySlug, CONDITIONS_INDEX, CONDITIONS } from "@/content/conditions";
import { getTreatmentBySlug, TREATMENTS_INDEX, TREATMENTS } from "@/content/treatments";
import { BLOG_ARTICLES, type BlogArticle } from "@/content/blog";
import { blogArticleToContent, blogCardFromContent } from "@/lib/cms/templates";
import type { LongformPageContent } from "@/content/types";
import type { PageType } from "@/lib/cms/types";

/**
 * Resolve a published longform page.
 * When Mongo is configured and owns a slug (any status), never fall back to
 * TypeScript — drafts / unpublished pages must 404 publicly.
 * Static TS is only used when Mongo is off or the slug has no CMS record yet.
 */
export async function resolveLongformPage(
  type: "condition" | "treatment",
  slug: string,
): Promise<LongformPageContent | null> {
  if (isMongoConfigured()) {
    try {
      const owned = await getPageByTypeSlug(type, slug);
      if (owned) {
        if (owned.status !== "published") return null;
        return longformFromCms(owned);
      }
    } catch {
      // connection failure — fall through to static so the site stays up
    }
  }

  if (type === "condition") return getConditionBySlug(slug) ?? null;
  return getTreatmentBySlug(slug) ?? null;
}

export async function resolveIndex(
  type: "condition" | "treatment",
): Promise<Array<{ slug: string; name: string; teaser: string; coverImageUrl?: string }>> {
  if (isMongoConfigured()) {
    try {
      // Trust Mongo when configured: empty list means nothing is published,
      // not "fall back to the old TypeScript index".
      const fromDb = await listPublishedIndex(type);
      return fromDb.map(({ slug, name, teaser, coverImageUrl }) => ({
        slug,
        name,
        teaser,
        coverImageUrl,
      }));
    } catch {
      // fall through
    }
  }
  return type === "condition" ? CONDITIONS_INDEX : TREATMENTS_INDEX;
}

/**
 * Blog hub / topic cards: published MongoDB blogs when configured.
 */
export async function resolveBlogCards(): Promise<BlogArticle[]> {
  if (isMongoConfigured()) {
    try {
      const pages = await listPublishedPages("blog");
      const cards = pages
        .map((p) => {
          const content = blogFromCms(p);
          return content ? (blogCardFromContent(content) as BlogArticle) : null;
        })
        .filter((c): c is BlogArticle => c !== null);
      cards.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
      return cards;
    } catch {
      // fall through to static
    }
  }
  return BLOG_ARTICLES;
}

/** Resolve a published blog article body; drafts owned by CMS return null. */
export async function resolveBlogPage(slug: string) {
  if (isMongoConfigured()) {
    try {
      const owned = await getPageByTypeSlug("blog", slug);
      if (owned) {
        if (owned.status !== "published") return null;
        return blogFromCms(owned);
      }
    } catch {
      // fall through
    }
  }
  const article = BLOG_ARTICLES.find((a) => a.id === slug);
  if (!article) return null;
  return blogArticleToContent(article);
}

export async function resolveAllSlugs(type: PageType): Promise<string[]> {
  if (isMongoConfigured()) {
    try {
      const fromDb = await listPublishedIndex(type);
      return fromDb.map((p) => p.slug);
    } catch {
      // fall through
    }
  }
  if (type === "condition") return CONDITIONS.map((c) => c.slug);
  if (type === "treatment") return TREATMENTS.map((t) => t.slug);
  return BLOG_ARTICLES.map((a) => a.id);
}

/** Re-export for callers that still need a published-only lookup. */
export { getPublishedPage };
