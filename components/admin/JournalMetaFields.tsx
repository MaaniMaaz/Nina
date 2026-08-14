"use client";

import { useRef, useState } from "react";
import { useEdit } from "./EditContext";
import { isJournalContent, type JournalArticle } from "@/lib/cms/types";
import type { JournalFormat } from "@/content/journal";

const FORMATS: JournalFormat[] = ["Read", "Watch", "Listen", "Guide", "Protocol"];

/** Sidebar fields for full journal articles (format, topic, hero, media). */
export default function JournalMetaFields() {
  const edit = useEdit();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  if (!edit?.enabled || !isJournalContent(edit.content)) return null;

  const content = edit.content as JournalArticle;
  const labelCls = "text-[11px] font-semibold uppercase tracking-wide text-muted";
  const inputCls = "mt-1 w-full rounded border border-ink/15 px-3 py-2 text-[14px]";

  async function uploadHero(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      edit!.patchPath("hero", {
        src: data.url as string,
        alt: content.hero?.alt || content.title,
        caption: content.hero?.caption || "",
      });
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Format</label>
        <select
          className={inputCls}
          value={content.format}
          onChange={(e) => edit.patchPath("format", e.target.value)}
        >
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>Category / topic</label>
        <input
          className={inputCls}
          value={content.articleSection}
          onChange={(e) => {
            edit.patchPath("articleSection", e.target.value);
            edit.patchPath("topicLabel", e.target.value);
          }}
        />
      </div>
      <div>
        <label className={labelCls}>Topic URL</label>
        <input
          className={inputCls}
          value={content.topicHref}
          onChange={(e) => edit.patchPath("topicHref", e.target.value)}
        />
      </div>
      <div>
        <label className={labelCls}>Read time</label>
        <input
          className={inputCls}
          value={content.readTime}
          placeholder="e.g. 6 min read"
          onChange={(e) => edit.patchPath("readTime", e.target.value)}
        />
      </div>
      <div>
        <label className={labelCls}>Published date</label>
        <input
          type="date"
          className={inputCls}
          value={content.datePublished}
          onChange={(e) => edit.patchPath("datePublished", e.target.value)}
        />
      </div>
      <div>
        <label className={labelCls}>Date label</label>
        <input
          className={inputCls}
          value={content.dateLabel}
          placeholder="e.g. June 23, 2026"
          onChange={(e) => edit.patchPath("dateLabel", e.target.value)}
        />
      </div>
      <div>
        <label className={labelCls}>Hero image</label>
        {content.hero?.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={content.hero.src}
            alt=""
            className="mt-2 h-28 w-full rounded-lg object-cover"
          />
        ) : null}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="mt-2 rounded bg-ink px-2.5 py-1.5 text-[12px] font-semibold text-cream disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload hero"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void uploadHero(file);
          }}
        />
        <input
          className={`${inputCls} mt-2`}
          value={content.hero?.caption || ""}
          placeholder="Hero caption"
          onChange={(e) =>
            edit.patchPath("hero", {
              src: content.hero?.src || "",
              alt: content.hero?.alt || content.title,
              caption: e.target.value,
            })
          }
        />
      </div>
      <div>
        <label className={labelCls}>YouTube ID (Watch)</label>
        <input
          className={inputCls}
          value={content.youtubeId || ""}
          onChange={(e) => edit.patchPath("youtubeId", e.target.value)}
        />
      </div>
      <div>
        <label className={labelCls}>Media poster URL</label>
        <input
          className={inputCls}
          value={content.mediaPoster || ""}
          onChange={(e) => edit.patchPath("mediaPoster", e.target.value)}
        />
      </div>
      <div>
        <label className={labelCls}>Audio file URL (Listen)</label>
        <input
          className={inputCls}
          value={content.audioUrl || ""}
          placeholder="/audio/your-episode.mp3"
          onChange={(e) => edit.patchPath("audioUrl", e.target.value)}
        />
      </div>
      <div>
        <label className={labelCls}>Audio duration (seconds)</label>
        <input
          type="number"
          className={inputCls}
          value={content.audioSeconds ?? content.audioRecapSeconds ?? 0}
          onChange={(e) =>
            edit.patchPath("audioSeconds", Number(e.target.value) || 0)
          }
        />
      </div>
      <div>
        <label className={labelCls}>Audio recap seconds</label>
        <input
          type="number"
          className={inputCls}
          value={content.audioRecapSeconds}
          onChange={(e) =>
            edit.patchPath("audioRecapSeconds", Number(e.target.value) || 0)
          }
        />
      </div>
      <div>
        <label className={labelCls}>Audio recap eyebrow</label>
        <input
          className={inputCls}
          value={content.audioRecapEyebrow || ""}
          placeholder='e.g. "Twelve minutes is a lot"'
          onChange={(e) => edit.patchPath("audioRecapEyebrow", e.target.value)}
        />
      </div>
      <label className="flex items-center gap-2 text-[13px]">
        <input
          type="checkbox"
          checked={content.showAudioRecap !== false}
          onChange={(e) => edit.patchPath("showAudioRecap", e.target.checked)}
        />
        Show audio recap
      </label>
    </div>
  );
}
