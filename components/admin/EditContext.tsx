"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
  const [content, setContent] = useState(initialContent);
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
