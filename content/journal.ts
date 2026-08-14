/**
 * Full journal article bodies — translated from the Articles Desktop HTML handoff.
 * Hub cards: `content/blog.ts` (`BLOG_ARTICLES`).
 * Regenerate (if HTML sources are restored): `node scripts/extract-articles.mjs`
 */

import generated from "./journal-articles.generated.json";
import { FORMAT_COLORS, type BlogArticle, type BlogFormat } from "@/content/blog";

export type JournalFormat = "Read" | "Watch" | "Listen" | "Guide" | "Protocol";

export type JournalBodyBlock =
  | { type: "paragraph"; text: string; html?: string }
  | { type: "heading"; text: string; id?: string; chapterLabel?: string }
  | { type: "pullQuote"; text: string }
  | { type: "figure"; src: string; alt: string; caption?: string }
  | { type: "aside"; text: string }
  | { type: "panelList" }
  | { type: "markerList" }
  | { type: "timeline" };

export type JournalArticle = {
  /** Discriminator for CMS ManagedPageContent */
  kind?: "journal";
  sourceFile: string;
  slug: string;
  format: JournalFormat;
  title: string;
  dek: string;
  description: string;
  datePublished: string;
  dateLabel: string;
  articleSection: string;
  topicHref: string;
  topicLabel: string;
  timeRequired: string;
  wordCount: number | null;
  readTime: string;
  hero: { src: string; alt: string; caption: string } | null;
  shortAnswer: string;
  body: JournalBodyBlock[];
  panelItems: { name: string; why: string }[];
  markers: { name?: string; label?: string; why?: string; note?: string }[];
  timeline: { n?: string; label?: string; text?: string; title?: string }[];
  chapters: { href: string; n: string; label: string }[];
  transcript: { time?: string; t?: number | string; text: string }[];
  videoChapters: {
    time?: string;
    label?: string;
    t?: string;
    start?: number;
  }[];
  youtubeId: string;
  mediaPoster: string;
  takeaways: { n: string; text: string }[];
  related: {
    kind: string;
    label: string;
    href: string;
    kindColor: string;
    kindBg: string;
  }[];
  next: {
    title: string;
    href: string;
    fmt: string;
    meta: string;
    img: string;
    fmtColor?: string;
  }[];
  cta: { title: string; body: string; href: string; ctaLabel: string };
  audioUrl?: string;
  audioSeconds?: number;
  audioRecapSeconds: number;
  audioRecapEyebrow?: string;
  footerCta?: { title: string; body: string; href: string; ctaLabel: string };
  wave?: number[];
  showAudioRecap: boolean;
};

export const FORMAT_ACCENT: Record<JournalFormat, string> = {
  Read: "#B5572F",
  Watch: "#4a6340",
  Listen: "#B08A3E",
  Guide: "#8a6a3a",
  Protocol: "#2E211B",
};

export function isJournalContent(content: unknown): content is JournalArticle {
  if (!content || typeof content !== "object") return false;
  const c = content as JournalArticle;
  if (c.kind === "journal") return true;
  return (
    Array.isArray(c.body) &&
    typeof c.shortAnswer === "string" &&
    typeof c.format === "string" &&
    typeof c.title === "string"
  );
}

export function asCmsJournal(article: JournalArticle): JournalArticle {
  return { ...structuredClone(article), kind: "journal" };
}

export const JOURNAL_ARTICLES: JournalArticle[] = (
  generated as JournalArticle[]
).map((a) => ({ ...a, kind: "journal" as const }));

export function getJournalArticle(slug: string): JournalArticle | undefined {
  return JOURNAL_ARTICLES.find((a) => a.slug === slug);
}

/** Empty Read-format template for “New blog” in admin. */
export function emptyJournalTemplate(opts: {
  slug: string;
  title: string;
}): JournalArticle {
  return {
    kind: "journal",
    sourceFile: "New",
    slug: opts.slug,
    format: "Read",
    title: opts.title,
    dek: "Replace this dek with a one-line promise.",
    description: "Replace this meta description for search.",
    datePublished: new Date().toISOString().slice(0, 10),
    dateLabel: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    articleSection: "Journal",
    topicHref: "/blog",
    topicLabel: "Journal",
    timeRequired: "PT6M",
    wordCount: null,
    readTime: "6 min read",
    hero: {
      src: "/images/turn-myself.png",
      alt: opts.title,
      caption: "",
    },
    shortAnswer: "Replace this short answer.",
    body: [
      { type: "paragraph", text: "Replace this opening paragraph." },
      { type: "heading", text: "First section" },
      { type: "paragraph", text: "Replace this section body." },
    ],
    panelItems: [],
    markers: [],
    timeline: [],
    chapters: [],
    transcript: [],
    videoChapters: [],
    youtubeId: "",
    mediaPoster: "",
    takeaways: [
      { n: "01", text: "First takeaway." },
      { n: "02", text: "Second takeaway." },
      { n: "03", text: "Third takeaway." },
      { n: "04", text: "Fourth takeaway." },
    ],
    related: [],
    next: [],
    cta: {
      title: "Start with the $99 consultation",
      body: "Bring your story. Leave with a clear next step.",
      href: "/start",
      ctaLabel: "Book the consult →",
    },
    audioUrl: undefined,
    audioSeconds: undefined,
    audioRecapSeconds: 180,
    audioRecapEyebrow: "",
    footerCta: undefined,
    wave: undefined,
    showAudioRecap: true,
  };
}

export function journalToBlogCard(a: JournalArticle): BlogArticle {
  const fmt = (a.format === "Protocol" ? "Protocol" : a.format) as BlogFormat;
  const img = a.hero?.src || a.mediaPoster || "/images/turn-myself.png";
  return {
    id: a.slug,
    title: a.title,
    href: `/blog/${a.slug}`,
    fmt,
    cat: a.articleSection || a.topicLabel || "Journal",
    meta: a.readTime.replace(/\s*read$/i, "") || "6 min",
    date: a.datePublished,
    img,
    alt: a.hero?.alt || a.title,
    dek: a.dek,
    fmtColor: FORMAT_COLORS[fmt] || FORMAT_ACCENT[a.format],
    isPlay: fmt === "Watch" || fmt === "Listen",
  };
}

export function resolveCtaHref(href: string): string {
  if (href === "/book") return "/start";
  return href;
}
