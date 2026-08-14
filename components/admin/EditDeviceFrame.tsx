"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { DeviceMode } from "./DevicePreview";

const DEVICE_WIDTH: Record<DeviceMode, number> = {
  desktop: 1280,
  mobile: 390,
};

const LABEL: Record<DeviceMode, string> = {
  desktop: "Desktop · 1280px",
  mobile: "Mobile · 390px",
};

/**
 * Copy parent document styles into the iframe so Tailwind / fonts match.
 * Next injects styles over time, so we keep syncing.
 */
function syncStyles(fromDoc: Document, toDoc: Document) {
  const head = toDoc.head;
  if (!head) return;

  const seen = new Set<string>();
  head.querySelectorAll("[data-edit-frame-style]").forEach((n) => {
    const key = n.getAttribute("data-edit-frame-style");
    if (key) seen.add(key);
  });

  fromDoc.querySelectorAll('link[rel="stylesheet"], style').forEach((node, i) => {
    const key =
      node instanceof HTMLLinkElement
        ? `link:${node.href}`
        : `style:${node.id || node.getAttribute("data-href") || i}:${(node.textContent || "").slice(0, 80)}`;
    if (seen.has(key)) return;
    seen.add(key);
    const clone = node.cloneNode(true) as HTMLElement;
    clone.setAttribute("data-edit-frame-style", key);
    head.appendChild(clone);
  });

  toDoc.documentElement.className = fromDoc.documentElement.className;
  toDoc.documentElement.style.cssText = fromDoc.documentElement.style.cssText;
  toDoc.body.className = "bg-cream font-sans antialiased text-ink";
  toDoc.body.style.margin = "0";
  toDoc.body.style.overflowX = "hidden";
  toDoc.body.style.background = "#fbf6ec";
  toDoc.body.style.color = "#2e211b";
}

/**
 * Live edit canvas at a real device width so Tailwind breakpoints / 100vw /
 * mobile-vs-desktop sections resolve like they do for visitors. Scales down
 * to fit the admin panel when needed.
 */
export default function EditDeviceFrame({
  mode,
  children,
}: {
  mode: DeviceMode;
  children: ReactNode;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [contentHeight, setContentHeight] = useState(900);
  const [scale, setScale] = useState(1);
  const width = DEVICE_WIDTH[mode];
  const isMobile = mode === "mobile";

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(
      `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=${width}, initial-scale=1"/></head><body></body></html>`,
    );
    doc.close();

    syncStyles(document, doc);

    const mount = doc.createElement("div");
    mount.id = "edit-frame-root";
    doc.body.appendChild(mount);
    setMountNode(mount);

    const mo = new MutationObserver(() => syncStyles(document, doc));
    mo.observe(document.head, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      setMountNode(null);
    };
  }, [width, mode]);

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

  useEffect(() => {
    if (!mountNode) return;
    const doc = mountNode.ownerDocument;

    const measure = () => {
      const h = Math.max(
        mountNode.scrollHeight,
        doc.body?.scrollHeight ?? 0,
        doc.documentElement?.scrollHeight ?? 0,
        640,
      );
      setContentHeight(h);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(mountNode);
    if (doc.body) ro.observe(doc.body);

    const onLoad = () => measure();
    doc.addEventListener("load", onLoad, true);
    const t = window.setTimeout(measure, 400);

    return () => {
      ro.disconnect();
      doc.removeEventListener("load", onLoad, true);
      window.clearTimeout(t);
    };
  }, [mountNode, mode]);

  const scaledW = Math.round(width * scale);
  const scaledH = Math.round(contentHeight * scale);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 bg-[#efe6d6] px-3 py-2">
        <span className="text-[12px] font-semibold text-muted">
          Editing · {LABEL[mode]}
          {scale < 0.999 ? ` · scaled ${Math.round(scale * 100)}%` : ""}
        </span>
        <span className="text-[11px] text-muted">
          Use Desktop / Mobile in the header — layout matches that width
        </span>
      </div>

      <div
        ref={hostRef}
        className="flex min-h-0 flex-1 justify-center overflow-auto bg-[#e8e0d4] p-4"
      >
        <div
          className={`bg-cream shadow-[0_18px_40px_rgba(46,33,27,0.18)] ${
            isMobile ? "rounded-[28px] border-[10px] border-ink" : "rounded-xl"
          }`}
          style={{ width: scaledW, height: scaledH }}
        >
          <iframe
            ref={iframeRef}
            title={`Edit canvas (${mode})`}
            className={isMobile ? "rounded-[18px]" : "rounded-xl"}
            style={{
              width,
              height: contentHeight,
              border: 0,
              display: "block",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
          {mountNode ? createPortal(children, mountNode) : null}
        </div>
      </div>
    </div>
  );
}
