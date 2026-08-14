import { cache } from "react";
import { isMongoConfigured, siteMediaCollection } from "@/lib/mongodb";

/** Singleton Mongo document for home + shared content photography overrides. */
export type SiteMediaDocument = {
  key: "site-media";
  /** Cloudinary (or absolute) URL overrides keyed by media id. */
  images: Record<string, string>;
  /** Wistia media IDs keyed by patient key (cassandra, chastity, …). */
  wistia: Record<string, string>;
  updatedAt: Date | string;
};

export type SiteMediaEntry = {
  key: string;
  label: string;
  group: string;
  /** Static path used until a CMS override is set. */
  fallback: string;
};

/**
 * Every content photograph that can be swapped from admin.
 * Logos and grain stay hardcoded and are intentionally absent.
 */
export const SITE_MEDIA_CATALOG: SiteMediaEntry[] = [
  { key: "dr-nina", label: "Dr. Nina portrait", group: "Shared", fallback: "/images/dr-nina.jpg" },
  {
    key: "hero-portrait-mobile",
    label: "Home hero (mobile)",
    group: "Home hero",
    fallback: "/images/hero-portrait-mobile.png",
  },
  {
    key: "hero-portrait",
    label: "Home hero (desktop)",
    group: "Home hero",
    fallback: "/images/hero-portrait.png",
  },
  { key: "turn-sleep", label: "Turn — sleep", group: "Journal turns", fallback: "/images/turn-sleep.png" },
  { key: "turn-think", label: "Turn — think", group: "Journal turns", fallback: "/images/turn-think.png" },
  { key: "turn-3pm", label: "Turn — 3pm", group: "Journal turns", fallback: "/images/turn-3pm.png" },
  { key: "turn-weight", label: "Turn — weight", group: "Journal turns", fallback: "/images/turn-weight.png" },
  { key: "turn-myself", label: "Turn — myself", group: "Journal turns", fallback: "/images/turn-myself.png" },
  {
    key: "turn-perimenopause",
    label: "Turn — perimenopause",
    group: "Journal turns",
    fallback: "/images/turn-perimenopause.png",
  },
  { key: "turn-empty", label: "Turn — empty", group: "Journal turns", fallback: "/images/turn-empty.png" },
  { key: "turn-eat", label: "Turn — eat", group: "Journal turns", fallback: "/images/turn-eat.png" },
  { key: "turn-anxiety", label: "Turn — anxiety", group: "Journal turns", fallback: "/images/turn-anxiety.png" },
  { key: "turn-worry", label: "Turn — worry", group: "Journal turns", fallback: "/images/turn-worry.png" },
  {
    key: "process-listen",
    label: "Process — listen",
    group: "Process steps",
    fallback: "/images/process-listen.png",
  },
  { key: "process-test", label: "Process — test", group: "Process steps", fallback: "/images/process-test.png" },
  {
    key: "process-optimal",
    label: "Process — optimal",
    group: "Process steps",
    fallback: "/images/process-optimal.png",
  },
  {
    key: "process-connect",
    label: "Process — connect",
    group: "Process steps",
    fallback: "/images/process-connect.png",
  },
  {
    key: "process-build-plan",
    label: "Process — build plan",
    group: "Process steps",
    fallback: "/images/process-build-plan.png",
  },
  { key: "process-score", label: "Process — score", group: "Process steps", fallback: "/images/process-score.png" },
  ...[
    "deep-dive-panel",
    "iv-therapy",
    "injectables",
    "hormone-restoration",
    "supplementation",
    "nutrition",
    "lifestyle",
    "coaching",
    "re-testing",
  ].flatMap((slug) => [
    {
      key: `toolkit-mobile-${slug}`,
      label: `Toolkit mobile — ${slug}`,
      group: "Toolkit",
      fallback: `/images/toolkit/mobile/${slug}.png`,
    },
    {
      key: `toolkit-desktop-${slug}`,
      label: `Toolkit desktop — ${slug}`,
      group: "Toolkit",
      fallback: `/images/toolkit/desktop/${slug}.png`,
    },
  ]),
  {
    key: "patient-cassandra",
    label: "Patient — Cassandra",
    group: "Patient stories",
    fallback: "/images/patients/cassandra.jpg",
  },
  {
    key: "patient-chastity",
    label: "Patient — Chastity",
    group: "Patient stories",
    fallback: "/images/patients/chastity.jpg",
  },
  {
    key: "patient-april",
    label: "Patient — April",
    group: "Patient stories",
    fallback: "/images/patients/april.jpg",
  },
  {
    key: "patient-gertrude",
    label: "Patient — Gertrude",
    group: "Patient stories",
    fallback: "/images/patients/gertrude.jpg",
  },
  {
    key: "patient-melodie",
    label: "Patient — Melodie",
    group: "Patient stories",
    fallback: "/images/patients/melodie.png",
  },
  {
    key: "patient-vivinee",
    label: "Patient — Vivinee",
    group: "Patient stories",
    fallback: "/images/patients/vivinee.jpg",
  },
  { key: "feed-a4", label: "Learn feed a4", group: "Learn", fallback: "/images/home-media/feed-a4.webp" },
  { key: "feed-a5", label: "Learn feed a5", group: "Learn", fallback: "/images/home-media/feed-a5.webp" },
  { key: "feed-v3", label: "Learn feed v3", group: "Learn", fallback: "/images/home-media/feed-v3.webp" },
  { key: "clinic-bg", label: "Booking — clinic", group: "Booking", fallback: "/images/clinic-bg.png" },
  { key: "virtual-bg", label: "Booking — virtual", group: "Booking", fallback: "/images/virtual-bg.png" },
];

export const SITE_MEDIA_FALLBACKS: Record<string, string> = Object.fromEntries(
  SITE_MEDIA_CATALOG.map((e) => [e.key, e.fallback]),
);

/** Map a legacy `/images/...` path to its catalog key when possible. */
export function pathToMediaKey(path: string): string | null {
  const normalized = path.split("?")[0];
  const hit = SITE_MEDIA_CATALOG.find((e) => e.fallback === normalized);
  return hit?.key ?? null;
}

/** Default Wistia embed IDs (patient key → wistia hashed id). */
export const DEFAULT_WISTIA: Record<string, string> = {
  cassandra: "emd0n8jm64",
  chastity: "l1fedryuv5",
  april: "18puz2l6lg",
  gertrude: "a8bgujvwg0",
  melodie: "be8aikn1vf",
  vivinee: "zcbcgah9i9",
};

export const PATIENT_MEDIA_KEYS = [
  "cassandra",
  "chastity",
  "april",
  "gertrude",
  "melodie",
  "vivinee",
] as const;

export type PatientMediaKey = (typeof PATIENT_MEDIA_KEYS)[number];

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
