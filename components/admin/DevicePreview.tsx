"use client";

export type DeviceMode = "desktop" | "mobile";

const SIZES: Record<DeviceMode, { width: number; height: number; label: string }> = {
  desktop: { width: 1280, height: 760, label: "Desktop · 1280px" },
  mobile: { width: 390, height: 780, label: "Mobile · 390px" },
};

/**
 * Renders the saved page in an iframe at a real device width, so responsive
 * breakpoints resolve exactly as they will for a visitor.
 */
export default function DevicePreview({ src, mode }: { src: string; mode: DeviceMode }) {
  const { width, height, label } = SIZES[mode];
  const isMobile = mode === "mobile";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-semibold text-muted">{label}</span>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="text-[12px] font-semibold text-terracotta no-underline"
        >
          Open in new tab ↗
        </a>
      </div>

      <div className="flex justify-center overflow-auto rounded-xl border border-ink/10 bg-[#e8e0d4] p-4">
        <div
          className={`bg-cream shadow-[0_18px_40px_rgba(46,33,27,0.18)] ${
            isMobile ? "rounded-[28px] border-[10px] border-ink p-0" : "rounded-xl"
          }`}
          style={{ width: isMobile ? width : "100%", maxWidth: width }}
        >
          {/* key forces a fresh document per device so media queries re-evaluate */}
          <iframe
            key={mode}
            title={`Page preview (${mode})`}
            src={src}
            className={isMobile ? "rounded-[18px]" : "rounded-xl"}
            style={{ width: "100%", height, border: 0, display: "block" }}
          />
        </div>
      </div>
    </div>
  );
}
