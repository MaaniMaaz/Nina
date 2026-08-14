"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  DEFAULT_HOME_CONTENT,
  type HomePageContent,
} from "@/content/home-page";
import { isHomeContent } from "@/lib/cms/types";
import { useEdit } from "@/components/admin/EditContext";

const HomeContentContext = createContext<HomePageContent>(DEFAULT_HOME_CONTENT);

export function HomeContentProvider({
  content,
  children,
}: {
  content: HomePageContent;
  children: ReactNode;
}) {
  return (
    <HomeContentContext.Provider value={content}>{children}</HomeContentContext.Provider>
  );
}

/** Live homepage content: prefer EditProvider draft when editing, else props/context. */
export function useHomeContent(): HomePageContent {
  const fallback = useContext(HomeContentContext);
  const edit = useEdit();
  if (edit?.enabled && isHomeContent(edit.content)) {
    return edit.content;
  }
  return fallback;
}
