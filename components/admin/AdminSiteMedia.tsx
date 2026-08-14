"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SiteMediaEntry } from "@/lib/cms/media-catalog";

type SiteMediaPayload = {
  catalog: SiteMediaEntry[];
  patientKeys: string[];
  defaults: { images: Record<string, string>; wistia: Record<string, string> };
  overrides: { images: Record<string, string>; wistia: Record<string, string> };
  resolved: { images: Record<string, string>; wistia: Record<string, string> };
};

export default function AdminSiteMedia({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<SiteMediaPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [wistiaDraft, setWistiaDraft] = useState<Record<string, string>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/site-media");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load media");
      setData(json as SiteMediaPayload);
      setWistiaDraft({ ...(json as SiteMediaPayload).resolved.wistia });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const groups = useMemo(() => {
    if (!data) return [] as Array<{ name: string; entries: SiteMediaEntry[] }>;
    const map = new Map<string, SiteMediaEntry[]>();
    for (const entry of data.catalog) {
      const list = map.get(entry.group) ?? [];
      list.push(entry);
      map.set(entry.group, list);
    }
    return Array.from(map.entries()).map(([name, entries]) => ({ name, entries }));
  }, [data]);

  async function patch(body: {
    images?: Record<string, string | null>;
    wistia?: Record<string, string | null>;
  }) {
    const res = await fetch("/api/admin/site-media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Save failed");
    await load();
  }

  async function onUpload(key: string, file: File) {
    setBusyKey(key);
    setError(null);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const up = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const upData = await up.json();
      if (!up.ok) throw new Error(upData.error || "Upload failed");
      await patch({ images: { [key]: upData.url as string } });
      setMessage(`Updated ${key}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusyKey(null);
    }
  }

  async function clearImage(key: string) {
    if (!window.confirm("Clear this Cloudinary override and restore the static fallback?")) return;
    setBusyKey(key);
    setError(null);
    setMessage(null);
    try {
      await patch({ images: { [key]: null } });
      setMessage(`Restored fallback for ${key}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Clear failed");
    } finally {
      setBusyKey(null);
    }
  }

  async function saveWistia() {
    if (!data) return;
    setBusyKey("wistia");
    setError(null);
    setMessage(null);
    try {
      const wistia: Record<string, string | null> = {};
      for (const key of data.patientKeys) {
        const next = (wistiaDraft[key] ?? "").trim();
        const fallback = data.defaults.wistia[key] ?? "";
        wistia[key] = next && next !== fallback ? next : null;
      }
      await patch({ wistia });
      setMessage("Saved Wistia IDs.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button type="button" onClick={onBack} className="text-[13px] font-medium">
            ← Back to pages
          </button>
          <h2 className="mt-2 font-display text-2xl">Home &amp; shared media</h2>
          <p className="mt-1 max-w-[60ch] text-[13px] text-muted">
            Upload Cloudinary overrides for homepage and shared photography. Clearing a slot
            restores the bundled static image — logos and grain stay fixed in code.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded border border-ink/20 px-3 py-1.5 text-[13px] font-semibold"
        >
          Refresh
        </button>
      </div>

      {error ? <p className="mt-4 text-[13px] text-red-700">{error}</p> : null}
      {message ? <p className="mt-4 text-[13px] text-[#3d5a35]">{message}</p> : null}
      {loading && !data ? <p className="mt-6 text-[13px] text-muted">Loading media…</p> : null}

      {data
        ? groups.map((group) => (
            <section key={group.name} className="mt-8">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                {group.name}
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {group.entries.map((entry) => {
                  const src = data.resolved.images[entry.key] ?? entry.fallback;
                  const overridden = Boolean(data.overrides.images[entry.key]);
                  const busy = busyKey === entry.key;
                  return (
                    <div
                      key={entry.key}
                      className="overflow-hidden rounded-xl border border-ink/10 bg-cream"
                    >
                      <div className="relative aspect-[4/3] bg-cream-deep">
                        <Image
                          src={src}
                          alt={entry.label}
                          fill
                          className="object-cover"
                          unoptimized={src.startsWith("http")}
                        />
                      </div>
                      <div className="p-2.5">
                        <div className="text-[12px] font-semibold leading-snug text-ink">
                          {entry.label}
                        </div>
                        <div className="mt-0.5 truncate font-mono text-[10px] text-muted">
                          {entry.key}
                          {overridden ? " · CMS" : " · fallback"}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => fileRefs.current[entry.key]?.click()}
                            className="rounded bg-ink px-2 py-1 text-[11px] font-semibold text-cream disabled:opacity-50"
                          >
                            {busy ? "…" : "Upload"}
                          </button>
                          {overridden ? (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void clearImage(entry.key)}
                              className="rounded border border-ink/20 px-2 py-1 text-[11px] font-semibold disabled:opacity-50"
                            >
                              Clear
                            </button>
                          ) : null}
                        </div>
                        <input
                          ref={(el) => {
                            fileRefs.current[entry.key] = el;
                          }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (file) void onUpload(entry.key, file);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        : null}

      {data ? (
        <section className="mt-10 rounded-xl border border-ink/10 bg-cream p-4 sm:p-5">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
            Patient Wistia IDs
          </h3>
          <p className="mt-1 text-[12px] text-muted">
            Embed IDs used by the Hear from them phone player (not full URLs).
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {data.patientKeys.map((key) => (
              <label key={key} className="block text-[12px]">
                <span className="font-semibold capitalize text-ink">{key}</span>
                <input
                  className="mt-1 w-full rounded border border-ink/15 px-2.5 py-1.5 font-mono text-[12px]"
                  value={wistiaDraft[key] ?? ""}
                  onChange={(e) =>
                    setWistiaDraft((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  placeholder={data.defaults.wistia[key]}
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            disabled={busyKey === "wistia"}
            onClick={() => void saveWistia()}
            className="mt-4 rounded bg-ink px-3 py-2 text-[13px] font-semibold text-cream disabled:opacity-50"
          >
            {busyKey === "wistia" ? "Saving…" : "Save Wistia IDs"}
          </button>
        </section>
      ) : null}
    </div>
  );
}
