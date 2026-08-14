import { cache } from "react";
import { ObjectId, type WithId } from "mongodb";
import { pagesCollection, isMongoConfigured } from "@/lib/mongodb";
import type {
  CmsPageDocument,
  ManagedPageContent,
  PageStatus,
  PageType,
} from "@/lib/cms/types";
import { isBlogContent, isHomeContent, isJournalContent, isLongformContent } from "@/lib/cms/types";
import { publicPath } from "@/lib/cms/slug";
import type { LongformPageContent } from "@/content/types";
import type { BlogPageContent } from "@/lib/cms/types";
import {
  DEFAULT_HOME_CONTENT,
  type HomePageContent,
} from "@/content/home-page";
import {
  JOURNAL_ARTICLES,
  asCmsJournal,
  type JournalArticle,
} from "@/content/journal";
import { journalToBlogCard } from "@/content/journal";

export type CmsPage = Omit<CmsPageDocument, "_id"> & { id: string };

function toCmsPage(doc: WithId<CmsPageDocument>): CmsPage {
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export async function listPages(type?: PageType): Promise<CmsPage[]> {
  const col = await pagesCollection();
  const filter = type ? { type } : {};
  const docs = await col.find(filter).sort({ updatedAt: -1 }).toArray();
  return docs.map(toCmsPage);
}

export async function listPublishedIndex(type: PageType): Promise<
  Array<{ slug: string; name: string; teaser: string; coverImageUrl?: string }>
> {
  if (!isMongoConfigured()) return [];
  // Errors intentionally propagate: an unreachable cluster must be
  // distinguishable from "nothing is published" so callers can fall back to
  // the bundled content instead of rendering an empty index.
  const col = await pagesCollection();
  const docs = await col
    .find({ type, status: "published" })
    .sort({ title: 1 })
    .toArray();
  return docs.map((d) => {
    const heroUrl = coverFromContent(d.content);
    return {
      slug: d.slug,
      name: d.index.name,
      teaser: d.index.teaser,
      coverImageUrl: d.index.coverImageUrl || heroUrl,
    };
  });
}

/** Longform uses hero.imageUrl; journal articles use hero.src. */
function coverFromContent(content: unknown): string | undefined {
  if (!content || typeof content !== "object") return undefined;
  if (isJournalContent(content)) {
    return content.hero?.src || undefined;
  }
  if (
    "hero" in content &&
    content.hero &&
    typeof content.hero === "object" &&
    "imageUrl" in content.hero
  ) {
    return (content.hero as { imageUrl?: string }).imageUrl || undefined;
  }
  return undefined;
}

export async function listPublishedPages(type: PageType): Promise<CmsPage[]> {
  if (!isMongoConfigured()) return [];
  const col = await pagesCollection();
  const docs = await col
    .find({ type, status: "published" })
    .sort({ updatedAt: -1 })
    .toArray();
  return docs.map(toCmsPage);
}

export async function getPageById(id: string): Promise<CmsPage | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await pagesCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? toCmsPage(doc) : null;
}

/**
 * Deduped per request: rendering a detail page asks for the same document from
 * generateMetadata and from the page body, which would otherwise be two or
 * three identical round trips against the shared cluster's op budget.
 */
export const getPageByTypeSlug = cache(async function getPageByTypeSlug(
  type: PageType,
  slug: string,
): Promise<CmsPage | null> {
  if (!isMongoConfigured()) return null;
  try {
    const col = await pagesCollection();
    const doc = await col.findOne({ type, slug });
    return doc ? toCmsPage(doc) : null;
  } catch {
    return null;
  }
});

export async function getPublishedPage(
  type: PageType,
  slug: string,
): Promise<CmsPage | null> {
  const page = await getPageByTypeSlug(type, slug);
  if (!page || page.status !== "published") return null;
  return page;
}

export async function createPage(
  input: Omit<CmsPageDocument, "_id" | "createdAt" | "updatedAt">,
): Promise<CmsPage> {
  const col = await pagesCollection();
  const now = new Date();
  const doc: CmsPageDocument = {
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  const result = await col.insertOne(doc as CmsPageDocument & { _id?: ObjectId });
  return { id: result.insertedId.toString(), ...doc };
}

export async function updatePage(
  id: string,
  patch: Partial<
    Pick<
      CmsPageDocument,
      | "slug"
      | "title"
      | "metaTitle"
      | "metaDescription"
      | "status"
      | "index"
      | "content"
      | "publishedAt"
    >
  >,
): Promise<CmsPage | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await pagesCollection();
  const next = { ...patch, updatedAt: new Date() };
  const doc = await col.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: next },
    { returnDocument: "after" },
  );
  return doc ? toCmsPage(doc) : null;
}

export async function setPageStatus(
  id: string,
  status: PageStatus,
): Promise<CmsPage | null> {
  const publishedAt = status === "published" ? new Date() : null;
  return updatePage(id, { status, publishedAt });
}

/** Deep-clone JSON-safe content and rewrite slug/canonical/meta for a new page. */
export function cloneContentForNewPage(
  type: PageType,
  source: ManagedPageContent,
  opts: { slug: string; title: string; metaTitle: string; metaDescription: string },
): ManagedPageContent {
  const cloned = structuredClone(source);
  const path = publicPath(type, opts.slug);
  const canonical = `https://www.ninarossfm.com${path}`;

  if (isLongformContent(cloned)) {
    cloned.slug = opts.slug;
    cloned.title = opts.metaTitle;
    cloned.description = opts.metaDescription;
    cloned.canonical = canonical;
    cloned.hero.breadcrumbLabel = opts.title;
    if (cloned.hero.heading) {
      // keep structure; leave placeholder text until editor changes it
    }
    return cloned;
  }

  if (isBlogContent(cloned)) {
    cloned.slug = opts.slug;
    cloned.title = opts.title;
    cloned.description = opts.metaDescription;
    cloned.canonical = canonical;
    return cloned;
  }

  if (isJournalContent(cloned)) {
    cloned.slug = opts.slug;
    cloned.title = opts.title;
    cloned.description = opts.metaDescription;
    cloned.dek = opts.metaDescription;
    cloned.kind = "journal";
    return cloned;
  }

  return cloned;
}

export function longformFromCms(page: CmsPage): LongformPageContent | null {
  if (!isLongformContent(page.content)) return null;
  const c = structuredClone(page.content);
  c.slug = page.slug;
  c.title = page.metaTitle;
  c.description = page.metaDescription;
  c.canonical = `https://www.ninarossfm.com${publicPath(page.type, page.slug)}`;
  return c;
}

export function blogFromCms(page: CmsPage): BlogPageContent | null {
  if (!isBlogContent(page.content)) return null;
  const c = structuredClone(page.content);
  c.slug = page.slug;
  c.title = page.title;
  c.description = page.metaDescription;
  c.canonical = `https://www.ninarossfm.com${publicPath("blog", page.slug)}`;
  return c;
}

export function journalFromCms(page: CmsPage): JournalArticle | null {
  if (!isJournalContent(page.content)) return null;
  const c = asCmsJournal(page.content);
  c.slug = page.slug;
  c.title = page.title || c.title;
  if (page.metaDescription) c.description = page.metaDescription;
  return c;
}

export function homeFromCms(page: CmsPage): HomePageContent | null {
  if (!isHomeContent(page.content)) return null;
  return structuredClone(page.content);
}

/** Ensure the single homepage CMS document exists (published, from TS defaults). */
export async function ensureHomePage(): Promise<CmsPage> {
  const existing = await getPageByTypeSlug("home", "home");
  if (existing) return existing;

  return createPage({
    type: "home",
    slug: "home",
    status: "published",
    title: "Homepage",
    metaTitle: "Nina Ross Functional Medicine, Atlanta",
    metaDescription:
      "Physician-led functional medicine in Atlanta and virtual care nationwide. Root-cause care with Dr. Nina Ross, ND PhD. Start with the $99 Symptom Consultation.",
    index: {
      name: "Homepage",
      teaser:
        "Physician-led functional medicine in Atlanta and virtual care nationwide.",
    },
    content: structuredClone(DEFAULT_HOME_CONTENT),
    publishedAt: new Date(),
  });
}

/**
 * Ensure all 17 journal articles exist as full journal CMS docs.
 * - Creates missing pages (published, from bundled content).
 * - Upgrades legacy thin blog stubs for the same slugs (does not overwrite
 *   pages that already have journal-shaped content).
 */
export async function ensureJournalPages(): Promise<CmsPage[]> {
  if (!isMongoConfigured()) return [];
  const col = await pagesCollection();
  const slugs = JOURNAL_ARTICLES.map((a) => a.slug);
  const existingDocs = await col
    .find({ type: "blog", slug: { $in: slugs } })
    .toArray();
  const bySlug = new Map(existingDocs.map((d) => [d.slug, d]));
  const out: CmsPage[] = [];
  const now = new Date();

  for (const article of JOURNAL_ARTICLES) {
    const content = asCmsJournal(article);
    const card = journalToBlogCard(article);
    const index = {
      name: article.title,
      teaser: article.dek.slice(0, 160),
      coverImageUrl: card.img,
    };
    const existing = bySlug.get(article.slug);

    if (!existing) {
      const page = await createPage({
        type: "blog",
        slug: article.slug,
        status: "published",
        title: article.title,
        metaTitle: article.title,
        metaDescription: article.description || article.dek,
        index,
        content,
        publishedAt: now,
      });
      out.push(page);
      continue;
    }

    if (!isJournalContent(existing.content)) {
      const updated = await col.findOneAndUpdate(
        { _id: existing._id },
        {
          $set: {
            title: article.title,
            metaTitle: article.title,
            metaDescription: article.description || article.dek,
            index: { ...existing.index, ...index },
            content,
            updatedAt: now,
          },
        },
        { returnDocument: "after" },
      );
      out.push(updated ? toCmsPage(updated) : toCmsPage(existing));
      continue;
    }

    out.push(toCmsPage(existing));
  }

  return out;
}
