"use client";

import { useRef, useState } from "react";
import { useEdit } from "./EditContext";
import {
  emptyPatientStory,
  type HomePageContent,
  type PatientStory,
} from "@/content/home-page";
import { isHomeContent } from "@/lib/cms/types";

/** Sidebar manager: add / remove / reorder / edit patient stories (variable length). */
export default function StoriesManager() {
  const edit = useEdit();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadForRef = useRef<number | null>(null);

  if (!edit?.enabled || !isHomeContent(edit.content)) return null;

  const content = edit.content as HomePageContent;
  const stories = content.stories;

  function setStories(next: PatientStory[] | ((prev: PatientStory[]) => PatientStory[])) {
    edit!.setContent((prev: unknown) => {
      if (!isHomeContent(prev)) return prev;
      const stories = typeof next === "function" ? next(prev.stories) : next;
      return { ...prev, stories };
    });
  }

  function updateStory(i: number, patch: Partial<PatientStory>) {
    setStories((stories) =>
      stories.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    );
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= stories.length) return;
    setStories((list) => {
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setOpenIndex(j);
  }

  function duplicate(i: number) {
    setStories((list) => {
      const src = list[i];
      const copy: PatientStory = {
        ...structuredClone(src),
        key: `story-${Date.now().toString(36)}`,
        name: `${src.name} (copy)`,
      };
      const next = [...list];
      next.splice(i + 1, 0, copy);
      return next;
    });
    setOpenIndex(i + 1);
  }

  function remove(i: number) {
    if (stories.length <= 1) {
      window.alert("Keep at least one patient story.");
      return;
    }
    if (!window.confirm(`Remove “${stories[i].name}”?`)) return;
    setStories((list) => list.filter((_, idx) => idx !== i));
    setOpenIndex((cur) => {
      const nextLen = stories.length - 1;
      if (cur == null) return 0;
      return Math.min(cur > i ? cur - 1 : cur, nextLen - 1);
    });
  }

  function add() {
    setStories((list) => [...list, emptyPatientStory(list.length)]);
    setOpenIndex(stories.length);
  }

  function updateList(i: number, field: "symptoms" | "actions", list: string[]) {
    updateStory(i, { [field]: list });
  }

  function updateMarkers(
    i: number,
    markers: PatientStory["markers"],
  ) {
    updateStory(i, { markers });
  }

  async function uploadPortrait(i: number, file: File) {
    setUploading(i);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      updateStory(i, { imageUrl: data.url as string });
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[13px] font-semibold">Patient stories</h3>
        <button
          type="button"
          onClick={add}
          className="rounded bg-ink px-2.5 py-1 text-[11px] font-semibold text-cream"
        >
          + Add story
        </button>
      </div>
      <p className="text-[11px] leading-snug text-muted">
        Add or remove patient reviews for “Real people. Real labs.” Use Delete on a
        row, or manage from the section preview. Clear Wistia ID to hide video.
      </p>

      <ul className="space-y-2">
        {stories.map((s, i) => {
          const open = openIndex === i;
          return (
            <li key={s.key} className="rounded-lg border border-ink/15 bg-cream/80">
              <div className="flex items-center gap-1 p-2">
                <button
                  type="button"
                  className="min-w-0 flex-1 truncate text-left text-[12px] font-semibold"
                  onClick={() => setOpenIndex(open ? null : i)}
                >
                  {i + 1}. {s.name || s.first || "Untitled"}
                </button>
                <button
                  type="button"
                  aria-label="Move up"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  className="rounded border border-ink/15 px-1.5 py-0.5 text-[11px] disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  disabled={i === stories.length - 1}
                  onClick={() => move(i, 1)}
                  className="rounded border border-ink/15 px-1.5 py-0.5 text-[11px] disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${s.name || "story"}`}
                  onClick={() => remove(i)}
                  className="rounded border border-red-300 px-1.5 py-0.5 text-[11px] font-semibold text-red-800"
                >
                  ✕
                </button>
              </div>

              {open ? (
                <div className="space-y-2 border-t border-ink/10 p-2.5 text-[12px]">
                  <Field
                    label="Display name"
                    value={s.name}
                    onChange={(v) => updateStory(i, { name: v })}
                  />
                  <Field
                    label="First name"
                    value={s.first}
                    onChange={(v) => updateStory(i, { first: v })}
                  />
                  <Field
                    label="Key (media id)"
                    value={s.key}
                    onChange={(v) => updateStory(i, { key: v })}
                  />
                  <Field
                    label="Category"
                    value={s.category}
                    onChange={(v) => updateStory(i, { category: v })}
                  />
                  <Field
                    label="Timeframe"
                    value={s.timeframe}
                    onChange={(v) => updateStory(i, { timeframe: v })}
                  />
                  <Field
                    label="Hero lead"
                    value={s.heroLead}
                    onChange={(v) => updateStory(i, { heroLead: v })}
                  />
                  <Field
                    label="Hero emphasis"
                    value={s.heroEmph}
                    onChange={(v) => updateStory(i, { heroEmph: v })}
                  />

                  <div>
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                      Portrait
                    </div>
                    {s.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.imageUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="mb-2 h-16 w-16 rounded object-cover"
                      />
                    ) : null}
                    <button
                      type="button"
                      disabled={uploading === i}
                      onClick={() => {
                        uploadForRef.current = i;
                        fileRef.current?.click();
                      }}
                      className="rounded border border-ink/20 px-2 py-1 text-[11px] font-semibold disabled:opacity-50"
                    >
                      {uploading === i ? "Uploading…" : "Upload portrait"}
                    </button>
                  </div>

                  <Field
                    label="Wistia ID (empty = no video)"
                    value={s.wistia ?? ""}
                    onChange={(v) => updateStory(i, { wistia: v.trim() })}
                  />
                  <Field
                    label="Video length label"
                    value={s.videoLen}
                    onChange={(v) => updateStory(i, { videoLen: v })}
                  />

                  <label className="block">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      Intake / story
                    </span>
                    <textarea
                      className="mt-1 w-full rounded border border-ink/15 px-2 py-1.5 text-[12px]"
                      rows={3}
                      value={s.intake}
                      onChange={(e) => updateStory(i, { intake: e.target.value })}
                    />
                  </label>

                  <StringListEditor
                    label="Symptoms"
                    items={s.symptoms}
                    onChange={(list) => updateList(i, "symptoms", list)}
                  />

                  <label className="block">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      Dr. notes
                    </span>
                    <textarea
                      className="mt-1 w-full rounded border border-ink/15 px-2 py-1.5 text-[12px]"
                      rows={3}
                      value={s.drNotes}
                      onChange={(e) => updateStory(i, { drNotes: e.target.value })}
                    />
                  </label>

                  <StringListEditor
                    label="Actions"
                    items={s.actions}
                    onChange={(list) => updateList(i, "actions", list)}
                  />

                  <MarkersEditor
                    markers={s.markers}
                    onChange={(m) => updateMarkers(i, m)}
                  />

                  <label className="block">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      Quote
                    </span>
                    <textarea
                      className="mt-1 w-full rounded border border-ink/15 px-2 py-1.5 text-[12px]"
                      rows={2}
                      value={s.quote}
                      onChange={(e) => updateStory(i, { quote: e.target.value })}
                    />
                  </label>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => duplicate(i)}
                      className="rounded border border-ink/20 px-2 py-1 text-[11px] font-semibold"
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="rounded border border-red-300 px-2 py-1 text-[11px] font-semibold text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={add}
        className="w-full rounded-lg border border-dashed border-ink/25 bg-cream px-3 py-2.5 text-[12px] font-semibold text-ink hover:border-ink/50"
      >
        + Add another patient story
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          const i = uploadForRef.current;
          if (!file || i == null) return;
          void uploadPortrait(i, file);
        }}
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      <input
        className="mt-1 w-full rounded border border-ink/15 px-2 py-1.5 text-[12px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function StringListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
          {label}
        </span>
        <button
          type="button"
          className="text-[11px] font-semibold text-ink"
          onClick={() => onChange([...items, ""])}
        >
          + Add
        </button>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex gap-1">
            <input
              className="min-w-0 flex-1 rounded border border-ink/15 px-2 py-1 text-[12px]"
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              className="rounded border border-ink/15 px-1.5 text-[11px]"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MarkersEditor({
  markers,
  onChange,
}: {
  markers: PatientStory["markers"];
  onChange: (next: PatientStory["markers"]) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
          Markers
        </span>
        <button
          type="button"
          className="text-[11px] font-semibold text-ink"
          onClick={() =>
            onChange([
              ...markers,
              { label: "Marker", to: "Improved", fromPct: "20%", toPct: "80%" },
            ])
          }
        >
          + Add
        </button>
      </div>
      <ul className="space-y-2">
        {markers.map((m, i) => (
          <li key={i} className="rounded border border-ink/10 p-2">
            {(["label", "to", "fromPct", "toPct"] as const).map((key) => (
              <label key={key} className="mb-1 block">
                <span className="text-[10px] text-muted">{key}</span>
                <input
                  className="mt-0.5 w-full rounded border border-ink/15 px-2 py-1 text-[12px]"
                  value={m[key]}
                  onChange={(e) => {
                    const next = markers.map((row, j) =>
                      j === i ? { ...row, [key]: e.target.value } : row,
                    );
                    onChange(next);
                  }}
                />
              </label>
            ))}
            <button
              type="button"
              className="mt-1 text-[11px] font-semibold text-red-800"
              onClick={() => onChange(markers.filter((_, j) => j !== i))}
            >
              Remove marker
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
