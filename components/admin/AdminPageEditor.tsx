"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditProvider, useEdit } from "./EditContext";
import AdminStringFields from "./AdminStringFields";
import BlogMetaFields from "./BlogMetaFields";
import BlogEditable from "./BlogEditable";
import JournalMetaFields from "./JournalMetaFields";
import StoriesManager from "./StoriesManager";
import DevicePreview, { type DeviceMode } from "./DevicePreview";
import EditDeviceFrame from "./EditDeviceFrame";
import LongformPage from "@/components/templates/LongformPage";
import Hero from "@/components/home/Hero";
import HomeInteractive from "@/components/home/HomeInteractive";
import { HomeContentProvider } from "@/components/home/HomeContentContext";
import JournalArticleView from "@/components/blog/JournalArticle";
import type { CmsPage } from "@/lib/cms/pages";
import {
  isLongformContent,
  isBlogContent,
  isHomeContent,
  isJournalContent,
} from "@/lib/cms/types";
import type {
  BlogPageContent,
  HomePageContent,
  JournalArticle,
  ManagedPageContent,
} from "@/lib/cms/types";
import { publicPath, slugifyTitle } from "@/lib/cms/slug";
import type { LongformPageContent } from "@/content/types";
import { DEFAULT_HOME_CONTENT } from "@/content/home-page";

function EditorInner({ page: initial }: { page: CmsPage }) {
  const edit = useEdit()!;
  const router = useRouter();
  const isHome = initial.type === "home";
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [savedSlug, setSavedSlug] = useState(initial.slug);
  const [metaTitle, setMetaTitle] = useState(initial.metaTitle);
  const [metaDescription, setMetaDescription] = useState(initial.metaDescription);
  const [coverImageUrl, setCoverImageUrl] = useState(initial.index.coverImageUrl ?? "");
  const [status, setStatus] = useState(initial.status);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const baselineRef = useRef("");

  useEffect(() => {
    baselineRef.current = JSON.stringify({
      title: initial.title,
      slug: initial.slug,
      metaTitle: initial.metaTitle,
      metaDescription: initial.metaDescription,
      coverImageUrl: initial.index.coverImageUrl ?? "",
      content: initial.content,
    });
  }, [initial]);

  const dirty = useMemo(() => {
    const current = JSON.stringify({
      title,
      slug,
      metaTitle,
      metaDescription,
      coverImageUrl,
      content: edit.content,
    });
    return current !== baselineRef.current;
  }, [title, slug, metaTitle, metaDescription, coverImageUrl, edit.content]);

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
      const journalContent = isJournalContent(edit.content)
        ? (edit.content as JournalArticle)
        : null;
      const longformContent = isLongformContent(edit.content as ManagedPageContent)
        ? (edit.content as ManagedPageContent & { hero?: { imageUrl?: string } })
        : null;
      const effectiveTitle = journalContent
        ? journalContent.title || title
        : blogContent
          ? blogContent.title || title
          : title;
      const effectiveTeaser = journalContent
        ? (journalContent.dek || metaDescription).slice(0, 160)
        : blogContent
          ? (blogContent.dek || metaDescription).slice(0, 160)
          : metaDescription.slice(0, 160);
      const coverFromHero =
        longformContent && "hero" in longformContent
          ? longformContent.hero?.imageUrl
          : undefined;
      const journalCover =
        journalContent?.hero?.src || journalContent?.mediaPoster || undefined;
      const res = await fetch(`/api/admin/pages/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: effectiveTitle,
          slug: isHome ? "home" : slug,
          metaTitle,
          metaDescription,
          content: edit.content,
          status: nextStatus ?? status,
          index: {
            name: effectiveTitle,
            teaser: effectiveTeaser,
            coverImageUrl: isHome
              ? undefined
              : journalContent
                ? journalCover || coverImageUrl || undefined
                : blogContent
                  ? blogContent.coverImageUrl
                  : coverImageUrl || coverFromHero || undefined,
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
      setCoverImageUrl(page.index.coverImageUrl ?? "");
      edit.setContent(page.content);
      baselineRef.current = JSON.stringify({
        title: page.title,
        slug: page.slug,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        coverImageUrl: page.index.coverImageUrl ?? "",
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

  async function goPreview() {
    if (dirty) {
      const ok = window.confirm(
        "You have unsaved changes. Save them so preview shows the latest content?",
      );
      if (ok) {
        const saved = await save();
        if (!saved) return;
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
                  title={`Show ${d} layout in edit & preview`}
                  onClick={() => setDevice(d)}
                  className={`px-3 py-1.5 text-[12px] font-semibold capitalize ${
                    device === d ? "bg-ink text-cream" : "text-ink"
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
              Showing the <strong>last saved</strong> version. Save to refresh this preview with
              your latest edits.
            </p>
          ) : null}
          <DevicePreview src={previewSrc} mode={device} />
        </div>
      ) : (
        <div className="grid gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
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
                  if (
                    !isHome &&
                    (slug === initial.slug || slug === slugifyTitle(title))
                  ) {
                    setSlug(slugifyTitle(v));
                  }
                }}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                URL
              </label>
              {isHome ? (
                <p className="mt-1 rounded border border-ink/10 bg-cream-deep px-3 py-2 text-[13px]">
                  /
                </p>
              ) : (
                <>
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
                </>
              )}
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
            {isHome ? (
              <>
                <hr className="border-ink/10" />
                <StoriesManager />
                <hr className="border-ink/10" />
                <AdminStringFields />
              </>
            ) : initial.type === "blog" ? (
              <>
                <hr className="border-ink/10" />
                {isJournalContent(edit.content) ? (
                  <JournalMetaFields />
                ) : (
                  <BlogMetaFields />
                )}
                <hr className="border-ink/10" />
                <AdminStringFields />
              </>
            ) : (
              <>
                <hr className="border-ink/10" />
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Index card cover
                  </label>
                  <p className="mt-1 text-[11px] text-muted">
                    Shown on /{initial.type}s. Defaults to the hero image when empty.
                  </p>
                  <div className="relative mt-2 h-28 overflow-hidden rounded-lg border border-ink/10 bg-cream-deep">
                    {coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={coverImageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[12px] text-muted">
                        No cover yet
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={coverUploading}
                      onClick={() => coverInputRef.current?.click()}
                      className="rounded bg-ink px-2.5 py-1.5 text-[12px] font-semibold text-cream disabled:opacity-50"
                    >
                      {coverUploading ? "Uploading…" : "Upload cover"}
                    </button>
                    {coverImageUrl ? (
                      <button
                        type="button"
                        onClick={() => setCoverImageUrl("")}
                        className="rounded border border-ink/20 px-2.5 py-1.5 text-[12px] font-semibold"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;
                      void (async () => {
                        setCoverUploading(true);
                        setError(null);
                        try {
                          const fd = new FormData();
                          fd.set("file", file);
                          const res = await fetch("/api/admin/upload", {
                            method: "POST",
                            body: fd,
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.error || "Upload failed");
                          setCoverImageUrl(data.url as string);
                        } catch (err) {
                          setError(err instanceof Error ? err.message : "Upload failed");
                        } finally {
                          setCoverUploading(false);
                        }
                      })();
                    }}
                  />
                </div>
                <hr className="border-ink/10" />
                <AdminStringFields />
              </>
            )}
          </aside>

          <div className="order-1 min-h-[70vh] overflow-hidden rounded-xl border border-ink/10 bg-cream lg:order-2 lg:min-h-[calc(100vh-7rem)]">
            <EditDeviceFrame mode={device}>
              {isHomeContent(edit.content) ? (
                <HomeContentProvider
                  content={(edit.content as HomePageContent) ?? DEFAULT_HOME_CONTENT}
                >
                  <Hero />
                  <HomeInteractive />
                </HomeContentProvider>
              ) : isJournalContent(edit.content) ? (
                <JournalArticleView article={edit.content as JournalArticle} />
              ) : isLongformContent(edit.content as ManagedPageContent) ? (
                <LongformPage content={edit.content as LongformPageContent} />
              ) : isBlogContent(edit.content as ManagedPageContent) ? (
                <BlogEditable />
              ) : null}
            </EditDeviceFrame>
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
