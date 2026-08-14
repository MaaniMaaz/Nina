"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { getSlotImage } from "@/lib/slot-images";
import { getByPath, useEdit } from "./EditContext";

/**
 * Image slot that supports CMS edit mode: upload to Cloudinary and store URL at `urlPath`.
 * Falls back to design slot id / placeholder when no URL.
 */
export default function EditableImage({
  slotId,
  urlPath,
  src: srcProp,
  alt,
  className = "",
  placeholder = "Photo",
  shape = "rect",
}: {
  slotId?: string;
  /** Path in content JSON for a Cloudinary/absolute URL, e.g. hero.imageUrl */
  urlPath?: string;
  /** Fallback URL when not editing (or when path is empty). */
  src?: string;
  alt: string;
  className?: string;
  placeholder?: string;
  shape?: "rect" | "circle";
}) {
  const edit = useEdit();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urlFromContent =
    edit?.enabled && urlPath && edit.content
      ? (getByPath(edit.content, urlPath) as string | undefined)
      : undefined;

  const slotSrc = getSlotImage(slotId);
  const src = (urlFromContent || srcProp || slotSrc || "").trim() || undefined;
  const radius = shape === "circle" ? "rounded-full" : "";

  async function onFile(file: File) {
    if (!edit || !urlPath) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      edit.patchPath(urlPath, data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const media = !src ? (
    <div
      className={`relative flex items-center justify-center border border-dashed border-ink/15 bg-cream-deep text-xs font-medium text-muted ${radius} ${className}`}
    >
      {placeholder}
    </div>
  ) : (
    <div className={`relative overflow-hidden ${radius} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        unoptimized={src.startsWith("http")}
      />
    </div>
  );

  function deleteImage() {
    if (!edit || !urlPath) return;
    const confirmed = window.confirm("Remove this image from the page?");
    if (!confirmed) return;
    edit.patchPath(urlPath, "");
  }

  if (!edit?.enabled || !urlPath) return media;

  return (
    <div className="group/img relative">
      {media}
      <div className="absolute bottom-2 right-2 flex gap-1">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded bg-ink/90 px-2 py-1 text-[10px] font-semibold text-cream"
        >
          {uploading ? "…" : "Upload"}
        </button>
        {urlFromContent ? (
          <button
            type="button"
            disabled={uploading}
            onClick={deleteImage}
            className="rounded bg-red-700/90 px-2 py-1 text-[10px] font-semibold text-cream"
          >
            Delete
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onFile(f);
          e.target.value = "";
        }}
      />
      {error ? (
        <p className="mt-1 text-[11px] text-red-700">{error}</p>
      ) : null}
    </div>
  );
}
