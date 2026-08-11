"use client";

import { useMemo, useState } from "react";
import { useEdit } from "./EditContext";

function flattenStrings(
  value: unknown,
  prefix = "",
  out: Array<{ path: string; value: string }> = [],
): Array<{ path: string; value: string }> {
  if (typeof value === "string") {
    if (prefix && value.length > 0) out.push({ path: prefix, value });
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => flattenStrings(item, `${prefix}.${i}`, out));
    return out;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k === "schema" || k === "canonical" || k === "type" || k === "icon") continue;
      const next = prefix ? `${prefix}.${k}` : k;
      flattenStrings(v, next, out);
    }
  }
  return out;
}

function isLinkPath(path: string) {
  return /(^|\.)(href|ctaHref|secondaryHref|breadcrumbParentHref)$/.test(path);
}

function friendlyLabel(path: string) {
  if (path === "hero.ctaHref") return "Hero primary button URL";
  if (path === "hero.ctaLabel") return "Hero primary button label";
  if (path === "hero.secondaryHref") return "Hero secondary link URL";
  if (path === "hero.secondaryLabel") return "Hero secondary link label";
  if (path === "hero.breadcrumbParentHref") return "Breadcrumb parent URL";
  if (path === "hero.breadcrumbParentLabel") return "Breadcrumb parent label";
  if (path.endsWith(".href")) return `Link URL · ${path}`;
  if (path.endsWith("Href")) return `Link URL · ${path}`;
  return path;
}

/** Lists every editable string (and link URL) in page content. */
export default function AdminStringFields() {
  const edit = useEdit();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const { textFields, linkFields } = useMemo(() => {
    if (!edit?.content) return { textFields: [], linkFields: [] };
    const all = flattenStrings(edit.content).filter(
      (f) =>
        !f.path.endsWith(".slug") &&
        !f.path.includes("SlotId") &&
        // Image URLs are edited via the upload buttons, not as raw text.
        !f.path.includes("Url") &&
        !f.path.endsWith(".url") &&
        !f.path.endsWith(".fmt") &&
        !f.path.endsWith(".date"),
    );
    const linkFields = all.filter((f) => isLinkPath(f.path));
    const linkSet = new Set(linkFields.map((f) => f.path));
    const textFields = all.filter((f) => !linkSet.has(f.path));
    return { textFields, linkFields };
  }, [edit?.content]);

  if (!edit?.enabled) return null;

  function renderField({
    path,
    value,
    isLink,
  }: {
    path: string;
    value: string;
    isLink?: boolean;
  }) {
    return (
      <div className="rounded border border-ink/10 bg-cream p-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-ink">{friendlyLabel(path)}</p>
            <code className="text-[9px] text-muted">{path}</code>
          </div>
          <button
            type="button"
            className="shrink-0 rounded border border-ink/20 px-1.5 py-0.5 text-[10px] font-semibold"
            onClick={() => {
              setOpenPath(path);
              setDraft(value);
            }}
          >
            ✎
          </button>
        </div>
        {openPath === path ? (
          <div className="mt-2 space-y-2">
            {isLink ? (
              <input
                className="w-full rounded border border-terracotta/40 p-2 font-mono text-[12px] text-ink"
                value={draft}
                placeholder="/page-or-https://…"
                onChange={(e) => setDraft(e.target.value)}
              />
            ) : (
              <textarea
                className="w-full rounded border border-terracotta/40 p-2 text-[13px] text-ink"
                rows={3}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded bg-ink px-2 py-1 text-[11px] font-semibold text-cream"
                onClick={() => {
                  edit!.patchPath(path, isLink ? draft.trim() : draft);
                  setOpenPath(null);
                }}
              >
                Apply
              </button>
              <button
                type="button"
                className="rounded border border-ink/20 px-2 py-1 text-[11px]"
                onClick={() => setOpenPath(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-1 line-clamp-2 break-all text-[12px] text-body">{value}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-[12px] font-semibold text-ink">
          Button &amp; link URLs ({linkFields.length})
        </p>
        <p className="text-[11px] text-muted">
          Where each button or card sends visitors (e.g. /start, /conditions/pcos).
        </p>
        {linkFields.length === 0 ? (
          <p className="text-[12px] text-muted">No link fields on this page yet.</p>
        ) : (
          <div className="max-h-[30vh] space-y-2 overflow-y-auto pr-1">
            {linkFields.map((f) => (
              <div key={f.path}>{renderField({ path: f.path, value: f.value, isLink: true })}</div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-semibold text-ink">
          All text fields ({textFields.length})
        </p>
        <p className="text-[11px] text-muted">
          Click ✎ to edit. Structure (section order/types) cannot be changed.
        </p>
        <div className="max-h-[40vh] space-y-2 overflow-y-auto pr-1">
          {textFields.map((f) => (
            <div key={f.path}>{renderField({ path: f.path, value: f.value })}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
