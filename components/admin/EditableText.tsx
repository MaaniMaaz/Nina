"use client";

import { useEffect, useState } from "react";
import { getByPath, useEdit } from "./EditContext";

export default function EditableText({
  path,
  value,
  as: Tag = "span",
  className = "",
  multiline = false,
}: {
  path: string;
  value: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  multiline?: boolean;
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

  if (!edit?.enabled) {
    const Comp = Tag as "span";
    return <Comp className={className}>{value}</Comp>;
  }

  if (!open) {
    const Comp = Tag as "span";
    return (
      <Comp className={`group/edit relative ${className}`}>
        {live}
        <button
          type="button"
          aria-label="Edit text"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          className="ml-1 inline-flex align-middle rounded border border-ink/20 bg-cream px-1 py-0.5 text-[10px] font-semibold text-ink opacity-70 transition group-hover/edit:opacity-100"
        >
          ✎
        </button>
      </Comp>
    );
  }

  return (
    <span className={`relative block ${className}`}>
      {multiline ? (
        <textarea
          className="w-full rounded border border-terracotta/40 bg-white p-2 text-[inherit] leading-[inherit] text-ink"
          rows={4}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
        />
      ) : (
        <input
          className="w-full rounded border border-terracotta/40 bg-white p-2 text-[inherit] leading-[inherit] text-ink"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
        />
      )}
      <span className="mt-1 flex gap-2">
        <button
          type="button"
          className="rounded bg-ink px-2 py-1 text-[11px] font-semibold text-cream"
          onClick={() => {
            edit.patchPath(path, draft);
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
