"use client";

import LongformPage from "@/components/templates/LongformPage";
import BlogEditable from "./BlogEditable";
import EditDeviceFrame from "./EditDeviceFrame";
import { useEdit } from "./EditContext";
import type { DeviceMode } from "./DevicePreview";
import type { PageType } from "@/lib/cms/types";

/**
 * Inline live preview for non-iframe edit surfaces. Uses the same device frame
 * as the page editor so breakpoints stay accurate.
 */
export default function InlinePreview({
  mode,
  pageType,
  previewHref,
}: {
  mode: DeviceMode;
  pageType: PageType;
  previewHref: string;
}) {
  const edit = useEdit();
  const content = edit?.content;
  const label = mode === "mobile" ? "Mobile · 390px" : "Desktop · 1280px";

  return (
    <div className="p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-semibold text-muted">{label}</span>
        <a
          href={previewHref}
          target="_blank"
          rel="noreferrer"
          className="text-[12px] font-semibold text-terracotta no-underline"
        >
          Open in new tab ↗
        </a>
      </div>

      <div className="mt-3 min-h-[70vh] overflow-hidden rounded-xl border border-ink/10">
        <EditDeviceFrame mode={mode}>
          {pageType === "blog" ? (
            <BlogEditable />
          ) : (
            <LongformPage content={content as never} />
          )}
        </EditDeviceFrame>
      </div>
    </div>
  );
}
