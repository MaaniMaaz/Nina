"use client";

import { createContext, useContext } from "react";
import { SITE_MEDIA_FALLBACKS, DEFAULT_WISTIA } from "@/lib/cms/media-catalog";

type SiteMediaValue = {
  images: Record<string, string>;
  wistia: Record<string, string>;
};

const SiteMediaContext = createContext<SiteMediaValue>({
  images: SITE_MEDIA_FALLBACKS,
  wistia: DEFAULT_WISTIA,
});

export function SiteMediaProvider({
  media,
  children,
}: {
  media: SiteMediaValue;
  children: React.ReactNode;
}) {
  return <SiteMediaContext.Provider value={media}>{children}</SiteMediaContext.Provider>;
}

/** Resolved image URL for a catalog key (CMS override or static fallback). */
export function useSiteMedia(key: string): string {
  const { images } = useContext(SiteMediaContext);
  return images[key] ?? SITE_MEDIA_FALLBACKS[key] ?? "";
}

export function useSiteWistia(patientKey: string): string {
  const { wistia } = useContext(SiteMediaContext);
  return wistia[patientKey] ?? DEFAULT_WISTIA[patientKey] ?? "";
}

export function useSiteMediaMap(): SiteMediaValue {
  return useContext(SiteMediaContext);
}
