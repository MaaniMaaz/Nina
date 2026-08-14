/** Client-safe site media catalog (no Mongo / Node imports). */

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
