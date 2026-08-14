import {
  getPublishedPage,
  getPageByTypeSlug,
  listPublishedIndex,
  listPublishedPages,
  longformFromCms,
  blogFromCms,
  journalFromCms,
  ensureJournalPages,
} from "@/lib/cms/pages";
import { isMongoConfigured } from "@/lib/mongodb";
import { getConditionBySlug, CONDITIONS_INDEX, CONDITIONS } from "@/content/conditions";
import { getTreatmentBySlug, TREATMENTS_INDEX, TREATMENTS } from "@/content/treatments";
import { treatmentCardImage } from "@/content/treatment-images";
import { getSlotImage } from "@/lib/slot-images";
import { BLOG_ARTICLES, type BlogArticle } from "@/content/blog";
import { blogCardFromContent } from "@/lib/cms/templates";
import type { LongformPageContent } from "@/content/types";
import type { PageType } from "@/lib/cms/types";
import { isHomeContent, isJournalContent } from "@/lib/cms/types";
import {
  DEFAULT_HOME_CONTENT,
  type HomePageContent,
} from "@/content/home-page";
import {
  JOURNAL_ARTICLES,
  getJournalArticle,
  journalToBlogCard,
  type JournalArticle,
} from "@/content/journal";

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

function enrichIndexCover(
  type: "condition" | "treatment",
  item: { slug: string; name: string; teaser: string; coverImageUrl?: string },
): { slug: string; name: string; teaser: string; coverImageUrl?: string } {
  if (item.coverImageUrl) return item;
  if (type === "treatment") {
    const slot = getSlotImage(treatmentCardImage(item.slug));
    if (slot) return { ...item, coverImageUrl: slot };
  }
  return item;
}

export async function resolveIndex(
  type: "condition" | "treatment",
): Promise<Array<{ slug: string; name: string; teaser: string; coverImageUrl?: string }>> {
  if (isMongoConfigured()) {
    try {
      // Trust Mongo when configured: empty list means nothing is published,
      // not "fall back to the old TypeScript index".
      const fromDb = await listPublishedIndex(type);
      return fromDb.map((item) => enrichIndexCover(type, item));
    } catch {
      // fall through
    }
  }
  const staticIndex = type === "condition" ? CONDITIONS_INDEX : TREATMENTS_INDEX;
  return staticIndex.map((item) => enrichIndexCover(type, item));
}

/**
 * Blog hub cards: published CMS journal (or stub) pages when configured,
 * else static journal catalog.
 */
export async function resolveBlogCards(): Promise<BlogArticle[]> {
  if (isMongoConfigured()) {
    try {
      await ensureJournalPages();
      const pages = await listPublishedPages("blog");
      if (pages.length > 0) {
        const cards: BlogArticle[] = [];
        for (const p of pages) {
          if (isJournalContent(p.content)) {
            const j = journalFromCms(p);
            if (j) cards.push(journalToBlogCard(j));
            continue;
          }
          const stub = blogFromCms(p);
          if (stub) cards.push(blogCardFromContent(stub) as BlogArticle);
        }
        cards.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
        return cards;
      }
    } catch {
      // fall through
    }
  }
  return BLOG_ARTICLES;
}

/** Full journal article for /blog/[slug] — CMS published wins, else TS default. */
export async function resolveJournalArticle(
  slug: string,
): Promise<JournalArticle | null> {
  if (isMongoConfigured()) {
    try {
      await ensureJournalPages();
      const owned = await getPageByTypeSlug("blog", slug);
      if (owned) {
        if (owned.status !== "published") {
          // Draft owned by CMS: no public TS fallback for that slug.
          return null;
        }
        const fromCms = journalFromCms(owned);
        if (fromCms) return fromCms;
        // Published non-journal doc for a known journal slug: serve bundled
        // content until the next ensure upgrade path rewrites it.
        const bundled = getJournalArticle(slug);
        if (bundled) return bundled;
      }
    } catch {
      // fall through
    }
  }
  return getJournalArticle(slug) ?? null;
}

/** Legacy thin CMS stub body (non-journal). */
export async function resolveBlogPage(slug: string) {
  if (isMongoConfigured()) {
    try {
      const owned = await getPageByTypeSlug("blog", slug);
      if (owned) {
        if (owned.status !== "published") return null;
        if (isJournalContent(owned.content)) return null;
        return blogFromCms(owned);
      }
    } catch {
      // fall through
    }
  }
  return null;
}

export async function resolveAllSlugs(type: PageType): Promise<string[]> {
  if (type === "home") return ["home"];
  if (type === "blog") {
    const slugs = new Set(JOURNAL_ARTICLES.map((a) => a.slug));
    if (isMongoConfigured()) {
      try {
        for (const p of await listPublishedIndex("blog")) slugs.add(p.slug);
      } catch {
        // ignore
      }
    }
    return [...slugs];
  }
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
  return [];
}

/**
 * Homepage CMS content. Published Mongo home doc when configured;
 * otherwise TypeScript defaults (identical to the live landing copy).
 */
export async function resolveHomeContent(): Promise<HomePageContent> {
  if (isMongoConfigured()) {
    try {
      const owned = await getPageByTypeSlug("home", "home");
      if (owned) {
        if (owned.status !== "published") {
          return structuredClone(DEFAULT_HOME_CONTENT);
        }
        if (isHomeContent(owned.content)) {
          return structuredClone(owned.content);
        }
      }
    } catch {
      // fall through
    }
  }
  return structuredClone(DEFAULT_HOME_CONTENT);
}

/** Re-export for callers that still need a published-only lookup. */
export { getPublishedPage };
