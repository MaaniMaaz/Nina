"use client";

import LongformPage from "@/components/templates/LongformPage";
import BlogEditable from "./BlogEditable";
import { useEdit } from "./EditContext";
import type { DeviceMode } from "./DevicePreview";
import type { PageType } from "@/lib/cms/types";

const SIZES: Record<DeviceMode, { width: number; height: number; label: string }> = {
  desktop: { width: 1280, height: 760, label: "Desktop · 1280px" },
  mobile: { width: 390, height: 780, label: "Mobile · 390px" },
};

export default function InlinePreview({
  mode,
  pageType,
  previewHref,
}: {
  mode: DeviceMode;
  pageType: PageType;
  previewHref: string;
}) {
  const { width, height, label } = SIZES[mode];
  const isMobile = mode === "mobile";
  const edit = useEdit();

  const content = edit?.content;

  return (
    <div className="p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-semibold text-muted">{label}</span>
        <a href={previewHref} target="_blank" rel="noreferrer" className="text-[12px] font-semibold text-terracotta no-underline">
          Open in new tab ↗
        </a>
      </div>

      <div className="flex justify-center overflow-auto rounded-xl border border-ink/10 bg-[#e8e0d4] p-4 mt-3">
        <div
          className={`bg-cream shadow-[0_18px_40px_rgba(46,33,27,0.18)] ${
            isMobile ? "rounded-[28px] border-[10px] border-ink p-0" : "rounded-xl"
          }`}
          style={{ width: isMobile ? width : "100%", maxWidth: width }}
        >
          <div style={{ width: "100%", minHeight: height }}>
            {pageType === "blog" ? (
              <BlogEditable />
            ) : (
              // Longform pages (condition/treatment/etc.)
              <LongformPage content={content as any} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
