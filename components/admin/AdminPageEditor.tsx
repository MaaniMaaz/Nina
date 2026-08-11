"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditProvider, useEdit } from "./EditContext";
import AdminStringFields from "./AdminStringFields";
import BlogMetaFields from "./BlogMetaFields";
import BlogEditable from "./BlogEditable";
import DevicePreview, { type DeviceMode } from "./DevicePreview";
import InlinePreview from "./InlinePreview";
import LongformPage from "@/components/templates/LongformPage";
import type { CmsPage } from "@/lib/cms/pages";
import { isLongformContent, isBlogContent } from "@/lib/cms/types";
import type { BlogPageContent, ManagedPageContent } from "@/lib/cms/types";
import { publicPath, slugifyTitle } from "@/lib/cms/slug";
import type { LongformPageContent } from "@/content/types";

function EditorInner({ page: initial }: { page: CmsPage }) {
  const edit = useEdit()!;
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [savedSlug, setSavedSlug] = useState(initial.slug);
  const [metaTitle, setMetaTitle] = useState(initial.metaTitle);
  const [metaDescription, setMetaDescription] = useState(initial.metaDescription);
  const [status, setStatus] = useState(initial.status);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const baselineRef = useRef("");

  useEffect(() => {
    baselineRef.current = JSON.stringify({
      title: initial.title,
      slug: initial.slug,
      metaTitle: initial.metaTitle,
      metaDescription: initial.metaDescription,
      content: initial.content,
    });
  }, [initial]);

  const dirty = useMemo(() => {
    const current = JSON.stringify({
      title,
      slug,
      metaTitle,
      metaDescription,
      content: edit.content,
    });
    return current !== baselineRef.current;
  }, [title, slug, metaTitle, metaDescription, edit.content]);

  // Warn before leaving with unsaved edits
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const previewSrc = useMemo(() => {
    return `${publicPath(initial.type, savedSlug)}?preview=1&t=${previewKey}`;
  }, [initial.type, savedSlug, previewKey]);

  async function save(nextStatus?: "draft" | "published"): Promise<boolean> {
    setError(null);
    setMessage(null);
    edit.setSaving(true);
    try {
      const blogContent = isBlogContent(edit.content as ManagedPageContent)
        ? (edit.content as BlogPageContent)
        : null;
      const effectiveTitle = blogContent ? blogContent.title || title : title;
      const effectiveTeaser = blogContent
        ? (blogContent.dek || metaDescription).slice(0, 160)
        : metaDescription.slice(0, 160);
      const res = await fetch(`/api/admin/pages/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: effectiveTitle,
          slug,
          metaTitle,
          metaDescription,
          content: edit.content,
          status: nextStatus ?? status,
          index: {
            name: effectiveTitle,
            teaser: effectiveTeaser,
            coverImageUrl: blogContent ? blogContent.coverImageUrl : undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      const page = data.page as CmsPage;
      setStatus(page.status);
      setTitle(page.title);
      setSlug(page.slug);
      setSavedSlug(page.slug);
      setMetaTitle(page.metaTitle);
      setMetaDescription(page.metaDescription);
      edit.setContent(page.content);
      baselineRef.current = JSON.stringify({
        title: page.title,
        slug: page.slug,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        content: page.content,
      });
      setPreviewKey((k) => k + 1);
      setMessage(
        nextStatus === "published"
          ? "Published — live site updated."
          : nextStatus === "draft" && status === "published"
            ? "Unpublished — page removed from the live site."
            : "Saved.",
      );
      router.refresh();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      return false;
    } finally {
      edit.setSaving(false);
    }
  }

  async function goPreview(mode?: DeviceMode) {
    if (mode) setDevice(mode);
    if (dirty) {
      const ok = window.confirm(
        "You have unsaved changes. Save them so preview shows the latest content?",
      );
      if (ok) {
        const saved = await save();
        if (!saved) return;
      } else {
        // Still open preview of last saved version
      }
    }
    setTab("preview");
  }

  async function publish() {
    const goingLive = status !== "published";
    const msg = goingLive
      ? dirty
        ? "Save and publish this page to the live site?"
        : "Publish this page to the live site?"
      : dirty
        ? "Save these edits and push them to the already-live page?"
        : "Push the current saved version to the live page?";
    if (!window.confirm(msg)) return;
    await save("published");
  }

  async function unpublish() {
    if (
      !window.confirm(
        "Unpublish this page? It will disappear from the public site and return 404 until published again.",
      )
    ) {
      return;
    }
    await save("draft");
  }

  return (
    <div className="min-h-screen bg-[#f3ebde] text-ink">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-[#f3ebde]/95 px-3 py-3 backdrop-blur sm:px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
            <Link href="/nina/admin" className="text-[13px] font-medium no-underline">
              ← Admin
            </Link>
            <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[11px] font-semibold uppercase">
              {initial.type}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                status === "published" ? "bg-[#5a7d4f]/20 text-[#3d5a35]" : "bg-gold/40"
              }`}
            >
              {status}
            </span>
            {dirty ? (
              <span className="rounded-full bg-terracotta/15 px-2 py-0.5 text-[11px] font-semibold text-terracotta">
                Unsaved
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab("edit")}
              className={`rounded px-3 py-1.5 text-[12px] font-semibold ${
                tab === "edit" ? "bg-ink text-cream" : "border border-ink/20"
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => void goPreview()}
              className={`rounded px-3 py-1.5 text-[12px] font-semibold ${
                tab === "preview" ? "bg-ink text-cream" : "border border-ink/20"
              }`}
            >
              Preview
            </button>
            <div className="flex overflow-hidden rounded border border-ink/20">
              {(["desktop", "mobile"] as DeviceMode[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  title={`Preview in ${d}`}
                  onClick={() => void goPreview(d)}
                  className={`px-3 py-1.5 text-[12px] font-semibold capitalize ${
                    tab === "preview" && device === d ? "bg-ink text-cream" : "text-ink"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={edit.saving || !dirty}
              onClick={() => void save()}
              className="rounded bg-ink px-3 py-1.5 text-[12px] font-semibold text-cream disabled:opacity-50"
            >
              {edit.saving ? "Saving…" : "Save"}
            </button>
            {status !== "published" ? (
              <button
                type="button"
                disabled={edit.saving}
                onClick={() => void publish()}
                className="rounded bg-terracotta px-3 py-1.5 text-[12px] font-semibold text-cream disabled:opacity-50"
              >
                Publish
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled={edit.saving}
                  onClick={() => void publish()}
                  className="rounded bg-terracotta px-3 py-1.5 text-[12px] font-semibold text-cream disabled:opacity-50"
                >
                  {dirty ? "Save & update live" : "Update live"}
                </button>
                <button
                  type="button"
                  disabled={edit.saving}
                  onClick={() => void unpublish()}
                  className="rounded border border-ink/30 px-3 py-1.5 text-[12px] font-semibold disabled:opacity-50"
                >
                  Unpublish
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {(message || error) && (
        <div
          className={`px-4 py-2 text-[13px] ${error ? "bg-red-100 text-red-800" : "bg-[#5a7d4f]/15 text-[#3d5a35]"}`}
        >
          {error || message}
        </div>
      )}

      {tab === "preview" ? (
        <div className="p-3 sm:p-4">
          {dirty ? (
            <p className="mb-3 rounded-lg border border-gold/40 bg-gold/20 px-3 py-2 text-[13px]">
              Showing live edits. Uploads and inline changes appear immediately below.
            </p>
          ) : null}
          {dirty ? (
            <InlinePreview mode={device} pageType={initial.type} previewHref={previewSrc} />
          ) : (
            <DevicePreview src={previewSrc} mode={device} />
          )}
        </div>
      ) : (
        <div className="grid gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(280px,340px)_1fr]">
          <aside className="order-2 space-y-4 rounded-xl border border-ink/10 bg-cream p-4 lg:order-1 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Page title
              </label>
              <input
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 text-[14px]"
                value={title}
                onChange={(e) => {
                  const v = e.target.value;
                  setTitle(v);
                  if (slug === initial.slug || slug === slugifyTitle(title)) {
                    setSlug(slugifyTitle(v));
                  }
                }}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Slug
              </label>
              <div className="mt-1 flex flex-wrap items-center gap-1 text-[13px]">
                <span className="text-muted">
                  /{initial.type === "blog" ? "blog" : `${initial.type}s`}/
                </span>
                <input
                  className="min-w-0 flex-1 rounded border border-ink/15 px-2 py-1.5"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.replace(/^\/+/, ""))}
                />
              </div>
              <p className="mt-1 text-[11px] text-muted">
                Default from title: {publicPath(initial.type, slugifyTitle(title))}
              </p>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Meta title
              </label>
              <input
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 text-[14px]"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Meta description
              </label>
              <textarea
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 text-[14px]"
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>
            {initial.type === "blog" ? (
              <>
                <hr className="border-ink/10" />
                <BlogMetaFields />
              </>
            ) : null}
            <hr className="border-ink/10" />
            <AdminStringFields />
          </aside>

          <div className="order-1 overflow-hidden rounded-xl border border-ink/10 bg-cream lg:order-2">
            {isLongformContent(edit.content as ManagedPageContent) ? (
              <LongformPage content={edit.content as LongformPageContent} />
            ) : isBlogContent(edit.content as ManagedPageContent) ? (
              <BlogEditable />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPageEditor({ page }: { page: CmsPage }) {
  return (
    <EditProvider pageId={page.id} initialContent={page.content} enabled>
      <EditorInner page={page} />
    </EditProvider>
  );
}
