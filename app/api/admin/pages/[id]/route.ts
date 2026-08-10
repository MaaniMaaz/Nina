import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getPageById, updatePage, getPageByTypeSlug } from "@/lib/cms/pages";
import { isMongoConfigured } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { publicPath } from "@/lib/cms/slug";
import type { PageType } from "@/lib/cms/types";
import { isBlogContent, isLongformContent } from "@/lib/cms/types";

type Ctx = { params: Promise<{ id: string }> };

function indexPath(type: PageType): string {
  if (type === "blog") return "/blog";
  return `/${type}s`;
}

function revalidateManaged(type: PageType, slug: string) {
  revalidatePath(publicPath(type, slug));
  revalidatePath(indexPath(type));
  if (type === "blog") {
    revalidatePath("/blog/topic/[slug]", "page");
  }
}

/** Reject content that changes section structure (block count / types / blog section shape). */
function structureMatches(previous: unknown, next: unknown): boolean {
  if (!previous || !next || typeof previous !== "object" || typeof next !== "object") {
    return false;
  }
  if (isLongformContent(previous as never) && isLongformContent(next as never)) {
    const a = previous as { blocks: Array<{ type: string }> };
    const b = next as { blocks: Array<{ type: string }> };
    if (!Array.isArray(a.blocks) || !Array.isArray(b.blocks)) return false;
    if (a.blocks.length !== b.blocks.length) return false;
    return a.blocks.every((block, i) => block.type === b.blocks[i]?.type);
  }
  if (isBlogContent(previous as never) && isBlogContent(next as never)) {
    const a = previous as { sections: Array<{ type: string }> };
    const b = next as { sections: Array<{ type: string }> };
    if (!Array.isArray(a.sections) || !Array.isArray(b.sections)) return false;
    if (a.sections.length !== b.sections.length) return false;
    return a.sections.every((s, i) => s.type === b.sections[i]?.type);
  }
  return false;
}

export async function GET(_request: Request, ctx: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB not configured" }, { status: 503 });
  }
  const { id } = await ctx.params;
  const page = await getPageById(id);
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ page });
}

export async function PATCH(request: Request, ctx: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB not configured" }, { status: 503 });
  }
  const { id } = await ctx.params;
  const existing = await getPageById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch: Parameters<typeof updatePage>[1] = {};
  const oldSlug = existing.slug;
  const oldStatus = existing.status;

  if (typeof body.title === "string") patch.title = body.title.trim();
  if (typeof body.metaTitle === "string") patch.metaTitle = body.metaTitle.trim();
  if (typeof body.metaDescription === "string") {
    patch.metaDescription = body.metaDescription.trim();
  }
  if (typeof body.slug === "string") {
    const normalized = body.slug
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, "")
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!normalized) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }
    if (normalized !== existing.slug) {
      const clash = await getPageByTypeSlug(existing.type, normalized);
      if (clash && clash.id !== existing.id) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
      }
    }
    patch.slug = normalized;
  }
  if (body.index && typeof body.index === "object") {
    patch.index = { ...existing.index, ...(body.index as object) } as typeof existing.index;
  }
  if (body.content !== undefined) {
    if (!structureMatches(existing.content, body.content)) {
      return NextResponse.json(
        {
          error:
            "Page structure cannot be changed. Edit text and images only — section order and types are locked.",
        },
        { status: 400 },
      );
    }
    patch.content = body.content as typeof existing.content;
  }
  if (body.status === "draft" || body.status === "published") {
    patch.status = body.status;
    patch.publishedAt = body.status === "published" ? new Date() : null;
  }

  const page = await updatePage(id, patch);
  if (!page) return NextResponse.json({ error: "Update failed" }, { status: 500 });

  const type = page.type as PageType;
  const slugChanged = page.slug !== oldSlug;
  const statusChanged = page.status !== oldStatus;
  const wasOrIsPublished = oldStatus === "published" || page.status === "published";

  if (wasOrIsPublished || statusChanged) {
    revalidateManaged(type, page.slug);
    if (slugChanged) {
      revalidateManaged(type, oldSlug);
    }
  }

  return NextResponse.json({ page });
}
