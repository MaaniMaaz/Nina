"use client";

import { useEffect, useRef, useState } from "react";

/** Width we render the real page at before scaling it down into the card. */
const FRAME_WIDTH = 1280;

/**
 * Live mini render of a managed page, used as the dashboard card thumbnail.
 * Loads the real page in an iframe (only once scrolled into view) and scales
 * it down, so each card is a tiny version of the page itself.
 */
export default function PageThumbnail({
  src,
  height = 170,
}: {
  src: string;
  height?: number;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const resize = new ResizeObserver((entries) => {
      for (const entry of entries) setWidth(entry.contentRect.width);
    });
    resize.observe(el);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setVisible(true);
      },
      { rootMargin: "250px" },
    );
    io.observe(el);

    return () => {
      resize.disconnect();
      io.disconnect();
    };
  }, []);

  const scale = width > 0 ? width / FRAME_WIDTH : 0;

  return (
    <div ref={boxRef} className="relative overflow-hidden bg-cream-deep" style={{ height }}>
      {visible && scale > 0 ? (
        <iframe
          title="Page thumbnail"
          src={src}
          aria-hidden
          tabIndex={-1}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          style={{
            width: FRAME_WIDTH,
            height: Math.ceil(height / scale),
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            border: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        />
      ) : null}
      {!loaded ? (
        <div className="absolute inset-0 flex items-center justify-center text-[11px] text-muted">
          Loading preview…
        </div>
      ) : null}
    </div>
  );
}
