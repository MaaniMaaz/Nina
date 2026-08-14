import { cache } from "react";
import { isMongoConfigured, siteMediaCollection } from "@/lib/mongodb";
import {
  DEFAULT_WISTIA,
  SITE_MEDIA_FALLBACKS,
} from "@/lib/cms/media-catalog";

export type {
  PatientMediaKey,
  SiteMediaEntry,
} from "@/lib/cms/media-catalog";
export {
  DEFAULT_WISTIA,
  PATIENT_MEDIA_KEYS,
  SITE_MEDIA_CATALOG,
  SITE_MEDIA_FALLBACKS,
  pathToMediaKey,
} from "@/lib/cms/media-catalog";

/** Singleton Mongo document for home + shared content photography overrides. */
export type SiteMediaDocument = {
  key: "site-media";
  /** Cloudinary (or absolute) URL overrides keyed by media id. */
  images: Record<string, string>;
  /** Wistia media IDs keyed by patient key (cassandra, chastity, …). */
  wistia: Record<string, string>;
  updatedAt: Date | string;
};

async function readDoc(): Promise<SiteMediaDocument | null> {
  if (!isMongoConfigured()) return null;
  try {
    const col = await siteMediaCollection();
    const raw = await col.findOne({ key: "site-media" });
    if (!raw) return null;
    return {
      key: "site-media",
      images: (raw.images as Record<string, string>) ?? {},
      wistia: (raw.wistia as Record<string, string>) ?? {},
      updatedAt: (raw.updatedAt as Date | string) ?? new Date(),
    };
  } catch {
    return null;
  }
}

export async function ensureSiteMediaDoc(): Promise<SiteMediaDocument> {
  const col = await siteMediaCollection();
  const existing = await readDoc();
  if (existing) return existing;
  const doc: SiteMediaDocument = {
    key: "site-media",
    images: {},
    wistia: {},
    updatedAt: new Date(),
  };
  await col.updateOne({ key: "site-media" }, { $setOnInsert: doc }, { upsert: true });
  return (await readDoc()) ?? doc;
}

export async function getSiteMediaOverrides(): Promise<{
  images: Record<string, string>;
  wistia: Record<string, string>;
}> {
  const doc = await readDoc();
  return {
    images: doc?.images ?? {},
    wistia: doc?.wistia ?? {},
  };
}

/**
 * Resolved map: CMS override when set, otherwise the static fallback.
 * Deduped per request via React cache.
 */
export const getResolvedSiteMedia = cache(async function getResolvedSiteMedia(): Promise<{
  images: Record<string, string>;
  wistia: Record<string, string>;
}> {
  const overrides = await getSiteMediaOverrides();
  const images: Record<string, string> = { ...SITE_MEDIA_FALLBACKS };
  for (const [k, v] of Object.entries(overrides.images)) {
    if (typeof v === "string" && v.trim()) images[k] = v.trim();
  }
  const wistia: Record<string, string> = { ...DEFAULT_WISTIA };
  for (const [k, v] of Object.entries(overrides.wistia)) {
    if (typeof v === "string" && v.trim()) wistia[k] = v.trim();
  }
  return { images, wistia };
});

/** Resolve one image key (server). */
export async function resolveMedia(key: string): Promise<string> {
  const { images } = await getResolvedSiteMedia();
  return images[key] ?? SITE_MEDIA_FALLBACKS[key] ?? "";
}

export async function patchSiteMedia(patch: {
  images?: Record<string, string | null | undefined>;
  wistia?: Record<string, string | null | undefined>;
}): Promise<SiteMediaDocument> {
  const col = await siteMediaCollection();
  await ensureSiteMediaDoc();
  const $set: Record<string, unknown> = { updatedAt: new Date() };
  const $unset: Record<string, ""> = {};

  if (patch.images) {
    for (const [k, v] of Object.entries(patch.images)) {
      if (v === null || v === undefined || v === "") {
        $unset[`images.${k}`] = "";
      } else {
        $set[`images.${k}`] = v.trim();
      }
    }
  }
  if (patch.wistia) {
    for (const [k, v] of Object.entries(patch.wistia)) {
      if (v === null || v === undefined || v === "") {
        $unset[`wistia.${k}`] = "";
      } else {
        $set[`wistia.${k}`] = v.trim();
      }
    }
  }

  const update: Record<string, unknown> = {};
  if (Object.keys($set).length) update.$set = $set;
  if (Object.keys($unset).length) update.$unset = $unset;
  if (!Object.keys(update).length) {
    return ensureSiteMediaDoc();
  }

  const doc = await col.findOneAndUpdate({ key: "site-media" }, update, {
    returnDocument: "after",
  });
  if (!doc) return ensureSiteMediaDoc();
  return {
    key: "site-media",
    images: (doc.images as Record<string, string>) ?? {},
    wistia: (doc.wistia as Record<string, string>) ?? {},
    updatedAt: (doc.updatedAt as Date | string) ?? new Date(),
  };
}
