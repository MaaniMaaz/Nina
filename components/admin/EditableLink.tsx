"use client";

import { useEffect, useState } from "react";
import { getByPath, useEdit } from "./EditContext";

/**
 * Inline URL editor for CTAs / card links. Only renders controls in edit mode;
 * the surrounding Link still uses the live href from content.
 */
export default function EditableLink({
  path,
  value,
  label = "Link URL",
}: {
  path: string;
  value: string;
  label?: string;
}) {
  const edit = useEdit();
  const [open, setOpen] = useState(false);
  const live =
    edit?.enabled && edit.content
      ? String(getByPath(edit.content, path) ?? value)
      : value;
  const [draft, setDraft] = useState(live);

  useEffect(() => {
    setDraft(live);
  }, [live]);

  if (!edit?.enabled) return null;

  if (!open) {
    return (
      <button
        type="button"
        aria-label={`Edit ${label}`}
        title={`${label}: ${live}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className="ml-1 inline-flex align-middle rounded border border-terracotta/40 bg-cream px-1.5 py-0.5 text-[10px] font-semibold text-ink opacity-80 hover:opacity-100"
      >
        🔗
      </button>
    );
  }

  return (
    <span
      className="mt-1 block w-full max-w-md rounded border border-terracotta/40 bg-white p-2 text-left shadow-sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      <input
        className="mt-1 w-full rounded border border-ink/15 px-2 py-1.5 font-mono text-[12px] text-ink"
        value={draft}
        placeholder="/page-or-https://…"
        onChange={(e) => setDraft(e.target.value)}
        autoFocus
      />
      <span className="mt-1.5 flex gap-2">
        <button
          type="button"
          className="rounded bg-ink px-2 py-1 text-[11px] font-semibold text-cream"
          onClick={() => {
            edit.patchPath(path, draft.trim());
            setOpen(false);
          }}
        >
          Apply
        </button>
        <button
          type="button"
          className="rounded border border-ink/20 px-2 py-1 text-[11px]"
          onClick={() => {
            setDraft(live);
            setOpen(false);
          }}
        >
          Cancel
        </button>
      </span>
    </span>
  );
}
