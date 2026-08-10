"use client";

import { useEdit } from "./EditContext";
import type { BlogPageContent } from "@/lib/cms/types";
import type { BlogFormat } from "@/content/blog";

const FORMATS: BlogFormat[] = ["Read", "Watch", "Listen", "Protocol", "Guide"];

/** Structured blog metadata (format, category, read-time, date) editable in the sidebar. */
export default function BlogMetaFields() {
  const edit = useEdit();
  const content = edit?.content as BlogPageContent | undefined;
  if (!edit?.enabled || !content) return null;

  const labelCls = "text-[11px] font-semibold uppercase tracking-wide text-muted";
  const inputCls = "mt-1 w-full rounded border border-ink/15 px-3 py-2 text-[14px]";

  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Format</label>
        <select
          className={inputCls}
          value={content.fmt}
          onChange={(e) => edit.patchPath("fmt", e.target.value)}
        >
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>Category</label>
        <input
          className={inputCls}
          value={content.cat}
          onChange={(e) => edit.patchPath("cat", e.target.value)}
        />
      </div>
      <div>
        <label className={labelCls}>Read time</label>
        <input
          className={inputCls}
          value={content.meta}
          placeholder="e.g. 6 min"
          onChange={(e) => edit.patchPath("meta", e.target.value)}
        />
      </div>
      <div>
        <label className={labelCls}>Date</label>
        <input
          type="date"
          className={inputCls}
          value={content.date}
          onChange={(e) => edit.patchPath("date", e.target.value)}
        />
      </div>
      <div>
        <label className={labelCls}>Cover alt text</label>
        <input
          className={inputCls}
          value={content.coverAlt}
          onChange={(e) => edit.patchPath("coverAlt", e.target.value)}
        />
      </div>
    </div>
  );
}
