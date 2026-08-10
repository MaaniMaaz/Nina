import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  listPages,
  createPage,
  getPageByTypeSlug,
  getPageById,
  cloneContentForNewPage,
} from "@/lib/cms/pages";
import { isMongoConfigured } from "@/lib/mongodb";
import type { PageType } from "@/lib/cms/types";
import { slugifyTitle } from "@/lib/cms/slug";
import {
  asBlogTemplate,
  asConditionTemplate,
  asTreatmentTemplate,
  blogArticleToContent,
} from "@/lib/cms/templates";
import { getConditionBySlug } from "@/content/conditions";
import { getTreatmentBySlug } from "@/content/treatments";
import { BLOG_ARTICLES } from "@/content/blog";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB not configured" }, { status: 503 });
  }
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as PageType | null;
  const pages = await listPages(type ?? undefined);
  return NextResponse.json({ pages });
}

async function uniqueSlug(type: PageType, base: string): Promise<string> {
  let candidate = base || "untitled";
  let n = 2;
  while (await getPageByTypeSlug(type, candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB not configured" }, { status: 503 });
  }

  let body: {
    type?: PageType;
    title?: string;
    slug?: string;
    metaTitle?: string;
    metaDescription?: string;
    /** When set, deep-clone this existing page instead of the fixed template. */
    duplicateFromId?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ---- Duplicate existing page ----
  if (body.duplicateFromId) {
    const source = await getPageById(body.duplicateFromId);
    if (!source) return NextResponse.json({ error: "Source page not found" }, { status: 404 });

    const title = (body.title?.trim() || `${source.title} (copy)`).trim();
    const slug = await uniqueSlug(
      source.type,
      slugifyTitle(body.slug?.trim() || `${source.slug}-copy`),
    );
    const metaTitle = body.metaTitle?.trim() || title;
    const metaDescription = body.metaDescription?.trim() || source.metaDescription;

    const content = cloneContentForNewPage(source.type, source.content, {
      slug,
      title,
      metaTitle,
      metaDescription,
    });

    const page = await createPage({
      type: source.type,
      slug,
      status: "draft",
      title,
      metaTitle,
      metaDescription,
      index: {
        name: title,
        teaser: metaDescription.slice(0, 160),
        coverImageUrl: source.index.coverImageUrl,
      },
      content,
      publishedAt: null,
    });

    return NextResponse.json({ page }, { status: 201 });
  }

  // ---- Create from fixed template ----
  const type = body.type;
  if (type !== "condition" && type !== "treatment" && type !== "blog") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const title = (body.title ?? "New Page").trim() || "New Page";
  const slug = await uniqueSlug(type, slugifyTitle(body.slug?.trim() || title));
  const metaTitle = body.metaTitle?.trim() || title;
  const metaDescription =
    body.metaDescription?.trim() ||
    "Replace this meta description with a clear summary for search results.";

  let templateSource;
  if (type === "condition") {
    const pcos = getConditionBySlug("pcos");
    if (!pcos) return NextResponse.json({ error: "PCOS template missing" }, { status: 500 });
    templateSource = asConditionTemplate(pcos);
  } else if (type === "treatment") {
    const base =
      getTreatmentBySlug("hormone-restoration") ?? getTreatmentBySlug("iv-therapy");
    if (!base) return NextResponse.json({ error: "Treatment template missing" }, { status: 500 });
    templateSource = asTreatmentTemplate(base);
  } else {
    const first = BLOG_ARTICLES[0];
    templateSource = asBlogTemplate(blogArticleToContent(first));
  }

  const content = cloneContentForNewPage(type, templateSource, {
    slug,
    title,
    metaTitle,
    metaDescription,
  });

  const page = await createPage({
    type,
    slug,
    status: "draft",
    title,
    metaTitle,
    metaDescription,
    index: {
      name: title,
      teaser: metaDescription.slice(0, 160),
    },
    content,
    publishedAt: null,
  });

  return NextResponse.json({ page }, { status: 201 });
}
