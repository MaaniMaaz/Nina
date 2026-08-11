"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { TOOLKIT_TREATMENTS } from "@/content/care-toolkit";

type EditContextValue = {
  enabled: boolean;
  pageId: string;
  content: unknown;
  setContent: (next: unknown) => void;
  patchPath: (path: string, value: unknown) => void;
  saving: boolean;
  setSaving: (v: boolean) => void;
};

const EditContext = createContext<EditContextValue | null>(null);

/** Ensure hero CTAs always have an editable URL field for existing CMS pages. */
function ensureEditableDefaults(content: unknown): unknown {
  if (!content || typeof content !== "object") return content;
  const c = structuredClone(content) as Record<string, unknown>;
  const hero = c.hero as Record<string, unknown> | undefined;
  if (hero && typeof hero === "object") {
    if (!hero.ctaHref) hero.ctaHref = "/start";
    if (hero.secondaryLabel && !hero.secondaryHref) hero.secondaryHref = "/approach";
  }
  const blocks = c.blocks as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(blocks)) {
    for (const block of blocks) {
      if (block.type === "careToolkit" && !Array.isArray(block.treatments)) {
        block.treatments = structuredClone(TOOLKIT_TREATMENTS);
      }
      if (block.type === "conditionExplorer" && Array.isArray(block.conditions)) {
        for (const condition of block.conditions as Array<Record<string, unknown>>) {
          if (!condition.ctaHref) condition.ctaHref = "/start";
        }
      }
    }
  }
  return c;
}

function setByPath(obj: unknown, path: string, value: unknown): unknown {
  const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
  const root = structuredClone(obj) as Record<string, unknown>;
  let cur: Record<string, unknown> = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (cur[key] == null || typeof cur[key] !== "object") {
      cur[key] = Number.isInteger(Number(parts[i + 1])) ? [] : {};
    }
    cur = cur[key] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
  return root;
}

export function EditProvider({
  pageId,
  initialContent,
  children,
  enabled = true,
}: {
  pageId: string;
  initialContent: unknown;
  children: ReactNode;
  enabled?: boolean;
}) {
  const [content, setContent] = useState(() => ensureEditableDefaults(initialContent));
  const [saving, setSaving] = useState(false);

  const patchPath = useCallback((path: string, value: unknown) => {
    setContent((prev: unknown) => setByPath(prev, path, value));
  }, []);

  const value = useMemo(
    () => ({
      enabled,
      pageId,
      content,
      setContent,
      patchPath,
      saving,
      setSaving,
    }),
    [enabled, pageId, content, patchPath, saving],
  );

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
}

export function useEdit() {
  return useContext(EditContext);
}

export function getByPath(obj: unknown, path: string): unknown {
  const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}
