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

/** Lists every editable string in page content with a pencil-style inline editor. */
export default function AdminStringFields() {
  const edit = useEdit();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const fields = useMemo(() => {
    if (!edit?.content) return [];
    return flattenStrings(edit.content).filter(
      (f) =>
        !f.path.endsWith(".slug") &&
        !f.path.includes("Href") &&
        !f.path.includes("SlotId") &&
        // Image URLs are edited via the upload buttons, not as raw text.
        !f.path.includes("Url") &&
        !f.path.endsWith(".url") &&
        !f.path.endsWith(".fmt") &&
        !f.path.endsWith(".date"),
    );
  }, [edit?.content]);

  if (!edit?.enabled) return null;

  return (
    <div className="space-y-2">
      <p className="text-[12px] text-muted">
        All text fields ({fields.length}). Click ✎ to edit. Structure cannot be changed.
      </p>
      <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
        {fields.map((f) => (
          <div key={f.path} className="rounded border border-ink/10 bg-cream p-2">
            <div className="flex items-start justify-between gap-2">
              <code className="text-[10px] text-muted">{f.path}</code>
              <button
                type="button"
                className="shrink-0 rounded border border-ink/20 px-1.5 py-0.5 text-[10px] font-semibold"
                onClick={() => {
                  setOpenPath(f.path);
                  setDraft(f.value);
                }}
              >
                ✎
              </button>
            </div>
            {openPath === f.path ? (
              <div className="mt-2 space-y-2">
                <textarea
                  className="w-full rounded border border-terracotta/40 p-2 text-[13px] text-ink"
                  rows={3}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded bg-ink px-2 py-1 text-[11px] font-semibold text-cream"
                    onClick={() => {
                      edit.patchPath(f.path, draft);
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
              <p className="mt-1 line-clamp-2 text-[12px] text-body">{f.value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
