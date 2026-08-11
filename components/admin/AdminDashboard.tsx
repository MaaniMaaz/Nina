"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageThumbnail from "./PageThumbnail";
import { slugifyTitle, defaultPathForType } from "@/lib/cms/slug";
import type { CmsPage } from "@/lib/cms/pages";
import type { PageType } from "@/lib/cms/types";

export default function AdminDashboard({ authenticated }: { authenticated: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<PageType>("condition");
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  async function load() {
    setListLoading(true);
    setListError(null);
    try {
      const res = await fetch(`/api/admin/pages?type=${tab}`);
      if (res.status === 401) {
        router.refresh();
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load pages");
      setPages(data.pages);
    } catch (err) {
      setPages([]);
      setListError(err instanceof Error ? err.message : "Failed to load pages");
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    if (authenticated) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, tab]);

  const defaultSlugHint = useMemo(
    () => (newTitle ? defaultPathForType(tab, newTitle) : ""),
    [newTitle, tab],
  );

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  async function createPage() {
    if (!newTitle.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: tab,
          title: newTitle.trim(),
          slug: slugifyTitle(newTitle),
          metaTitle: newTitle.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed");
      setNewTitle("");
      router.push(`/nina/admin/pages/${data.page.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setCreating(false);
    }
  }

  async function duplicatePage(id: string) {
    setDuplicatingId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duplicateFromId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Duplicate failed");
      router.push(`/nina/admin/pages/${data.page.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Duplicate failed");
    } finally {
      setDuplicatingId(null);
    }
  }

  async function deletePage(id: string) {
    const ok = window.confirm("Delete this page? This cannot be undone.");
    if (!ok) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      // reload list
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3ebde] px-4">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-2xl border border-ink/10 bg-cream p-6 shadow-sm sm:p-8"
        >
          <h1 className="font-display text-2xl text-ink">Nina Admin</h1>
          <p className="mt-2 text-[13px] text-muted">Enter the admin password to continue.</p>
          <input
            type="password"
            autoComplete="current-password"
            className="mt-6 w-full rounded-lg border border-ink/15 px-3 py-2.5 text-[14px]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {error ? <p className="mt-2 text-[13px] text-red-700">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-ink py-2.5 text-[14px] font-semibold text-cream disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3ebde] text-ink">
      <header className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-4 sm:px-6">
        <h1 className="font-display text-xl sm:text-2xl">Nina CMS</h1>
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded border border-ink/20 px-3 py-1.5 text-[13px] font-semibold"
        >
          Log out
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["condition", "treatment", "blog"] as PageType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold capitalize ${
                tab === t ? "bg-ink text-cream" : "border border-ink/20"
              }`}
            >
              {t}s
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-ink/10 bg-cream p-4">
          <h2 className="text-[14px] font-semibold">New {tab}</h2>
          <p className="mt-1 text-[12px] text-muted">
            Clones the fixed template
            {tab === "condition"
              ? " (PCOS structure)"
              : tab === "treatment"
                ? " (hormone restoration structure)"
                : " (journal article structure)"}
            . Default URL:{" "}
            {defaultSlugHint || `/${tab === "blog" ? "blog" : tab + "s"}/…`}
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <input
              className="min-w-0 flex-1 rounded border border-ink/15 px-3 py-2 text-[14px] sm:min-w-[220px]"
              placeholder="Page title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void createPage();
              }}
            />
            <button
              type="button"
              disabled={creating || !newTitle.trim()}
              onClick={() => void createPage()}
              className="rounded bg-terracotta px-4 py-2 text-[13px] font-semibold text-cream disabled:opacity-50"
            >
              {creating ? "Creating…" : "Create draft"}
            </button>
          </div>
          {error ? <p className="mt-2 text-[13px] text-red-700">{error}</p> : null}
        </div>

        {listError ? (
          <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-center text-[13px] text-red-800">
            {listError}
          </p>
        ) : listLoading && pages.length === 0 ? (
          <p className="mt-6 rounded-xl border border-ink/10 bg-cream px-4 py-8 text-center text-[13px] text-muted">
            Loading pages…
          </p>
        ) : pages.length === 0 ? (
          <p className="mt-6 rounded-xl border border-ink/10 bg-cream px-4 py-8 text-center text-[13px] text-muted">
            No pages yet. Seed MongoDB (`npm run seed`) or create a draft above.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((p) => (
              <div
                key={p.id}
                className="overflow-hidden rounded-xl border border-ink/10 bg-cream shadow-[0_8px_20px_rgba(46,33,27,0.06)] transition-shadow hover:shadow-[0_14px_30px_rgba(46,33,27,0.12)]"
              >
                <Link
                  href={`/nina/admin/pages/${p.id}`}
                  className="block border-b border-ink/10 no-underline"
                  title={`Edit ${p.title}`}
                >
                  <PageThumbnail src={`${publicPathLabel(p)}?preview=1`} />
                </Link>
                <div className="pt-6 px-3.5 pb-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-semibold text-ink" title={p.title}>
                        {p.title}
                      </div>
                      <div className="truncate text-[11px] text-muted">{publicPathLabel(p)}</div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        p.status === "published"
                          ? "bg-[#5a7d4f]/20 text-[#3d5a35]"
                          : "bg-gold/40 text-ink"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`${publicPathLabel(p)}?preview=1`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded border border-ink/20 px-3 py-1.5 text-[12px] font-semibold text-ink no-underline"
                    >
                      Preview
                    </a>
                    <Link
                      href={`/nina/admin/pages/${p.id}`}
                      className="rounded bg-ink px-3 py-1.5 text-[12px] font-semibold text-cream no-underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      disabled={duplicatingId === p.id}
                      onClick={() => void duplicatePage(p.id)}
                      className="rounded border border-ink/20 px-3 py-1.5 text-[12px] font-semibold disabled:opacity-50"
                    >
                      {duplicatingId === p.id ? "Copying…" : "Duplicate"}
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === p.id}
                      onClick={() => void deletePage(p.id)}
                      className="rounded border border-red-200 bg-red-50 px-3 py-1.5 text-[12px] font-semibold text-red-700 disabled:opacity-50"
                    >
                      {deletingId === p.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function publicPathLabel(p: CmsPage) {
  if (p.type === "condition") return `/conditions/${p.slug}`;
  if (p.type === "treatment") return `/treatments/${p.slug}`;
  return `/blog/${p.slug}`;
}
