"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type DeviceMode = "desktop" | "mobile";

const SIZES: Record<DeviceMode, { width: number; height: number; label: string }> = {
  desktop: { width: 1280, height: 760, label: "Desktop · 1280px" },
  mobile: { width: 390, height: 780, label: "Mobile · 390px" },
};

/**
 * Renders the saved page in an iframe at a real device width, so responsive
 * breakpoints resolve exactly as they will for a visitor. Scales down when the
 * admin panel is narrower than the device frame.
 */
export default function DevicePreview({ src, mode }: { src: string; mode: DeviceMode }) {
  const { width, height, label } = SIZES[mode];
  const isMobile = mode === "mobile";
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const update = () => {
      const pad = 32;
      const avail = Math.max(200, host.clientWidth - pad);
      setScale(Math.min(1, avail / width));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(host);
    return () => ro.disconnect();
  }, [width]);

  // Remeasure after mode change once layout settles
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const avail = Math.max(200, host.clientWidth - 32);
    setScale(Math.min(1, avail / width));
  }, [width, mode]);

  const scaledW = Math.round(width * scale);
  const scaledH = Math.round(height * scale);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-semibold text-muted">
          {label}
          {scale < 0.999 ? ` · scaled ${Math.round(scale * 100)}%` : ""}
        </span>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="text-[12px] font-semibold text-terracotta no-underline"
        >
          Open in new tab ↗
        </a>
      </div>

      <div
        ref={hostRef}
        className="flex justify-center overflow-auto rounded-xl border border-ink/10 bg-[#e8e0d4] p-4"
      >
        <div
          className={`bg-cream shadow-[0_18px_40px_rgba(46,33,27,0.18)] ${
            isMobile ? "rounded-[28px] border-[10px] border-ink p-0" : "rounded-xl"
          }`}
          style={{ width: scaledW, height: scaledH }}
        >
          {/* key forces a fresh document per device so media queries re-evaluate */}
          <iframe
            key={mode}
            title={`Page preview (${mode})`}
            src={src}
            className={isMobile ? "rounded-[18px]" : "rounded-xl"}
            style={{
              width,
              height,
              border: 0,
              display: "block",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      </div>
    </div>
  );
}
