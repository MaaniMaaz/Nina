import { ObjectId, type WithId } from "mongodb";
import { pagesCollection, isMongoConfigured } from "@/lib/mongodb";
import type {
  CmsPageDocument,
  ManagedPageContent,
  PageStatus,
  PageType,
} from "@/lib/cms/types";
import { isBlogContent, isLongformContent } from "@/lib/cms/types";
import { publicPath } from "@/lib/cms/slug";
import type { LongformPageContent } from "@/content/types";
import type { BlogPageContent } from "@/lib/cms/types";

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
  return docs.map((d) => ({
    slug: d.slug,
    name: d.index.name,
    teaser: d.index.teaser,
    coverImageUrl: d.index.coverImageUrl,
  }));
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

export async function getPageByTypeSlug(
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
}

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
