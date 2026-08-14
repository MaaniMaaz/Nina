/**
 * The Journal — hub cards + helpers.
 * Full article bodies live in `content/journal.ts` (from the Articles HTML handoff).
 */

import generated from "./journal-articles.generated.json";

export type BlogFormat = "Read" | "Watch" | "Listen" | "Protocol" | "Guide";

export const FORMAT_COLORS: Record<BlogFormat, string> = {
  Read: "#B5572F",
  Watch: "#4a6340",
  Listen: "#B08A3E",
  Protocol: "#2E211B",
  Guide: "#8a6a3a",
};

export const FORMAT_FILTERS: Array<"All" | BlogFormat> = [
  "All",
  "Read",
  "Watch",
  "Listen",
  "Protocol",
  "Guide",
];

export type BlogArticle = {
  id: string;
  title: string;
  href: string;
  fmt: BlogFormat;
  cat: string;
  meta: string;
  date: string;
  img: string;
  alt: string;
  dek: string;
  fmtColor: string;
  isPlay: boolean;
};

type GeneratedArticle = {
  slug: string;
  format: string;
  title: string;
  dek: string;
  datePublished: string;
  articleSection: string;
  topicLabel: string;
  readTime: string;
  hero: { src: string; alt: string; caption: string } | null;
  mediaPoster: string;
};

function toCard(a: GeneratedArticle): BlogArticle {
  const fmt = (a.format === "Protocol" ? "Protocol" : a.format) as BlogFormat;
  const img = a.hero?.src || a.mediaPoster || "/images/turn-myself.png";
  return {
    id: a.slug,
    title: a.title,
    href: `/blog/${a.slug}`,
    fmt,
    cat: a.articleSection || a.topicLabel || "Journal",
    meta: (a.readTime || "").replace(/\s*read$/i, "") || "6 min",
    date: a.datePublished,
    img,
    alt: a.hero?.alt || a.title,
    dek: a.dek,
    fmtColor: FORMAT_COLORS[fmt] || FORMAT_COLORS.Read,
    isPlay: fmt === "Watch" || fmt === "Listen",
  };
}

/** Sole blog catalog — the 17 translated Articles handoff pieces. */
export const BLOG_ARTICLES: BlogArticle[] = [...(generated as GeneratedArticle[])]
  .sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1))
  .map(toCard);

export const SHELF_DEFS = [
  {
    kicker: "Where most people start",
    title: "Normal labs, real symptoms",
    color: "#B5572F",
    cats: ["Labs", "Energy", "Sleep"],
  },
  {
    kicker: "Hormones",
    title: "Cycles, cortisol, and menopause",
    color: "#8a6a3a",
    cats: ["Hormones", "PCOS", "Menopause"],
  },
  {
    kicker: "Gut",
    title: "Digestion, bloating, and the gut map",
    color: "#4a6340",
    cats: ["Gut"],
  },
  {
    kicker: "Weight and metabolism",
    title: "When effort stops working",
    color: "#B5572F",
    cats: ["Weight"],
  },
  {
    kicker: "The treatments",
    title: "What we might reach for",
    color: "#8a6a3a",
    cats: ["IV Therapy", "Peptides"],
  },
  {
    kicker: "Inside the program",
    title: "What being a patient looks like",
    color: "#4a6340",
    cats: ["The program", "The Program"],
  },
] as const;

export function blogTopicSlug(label: string) {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getArticlesByTopicSlug(slug: string) {
  return BLOG_ARTICLES.filter((a) => blogTopicSlug(a.cat) === slug);
}

export function getTopicLabelBySlug(slug: string) {
  const found = BLOG_ARTICLES.find((a) => blogTopicSlug(a.cat) === slug);
  return found?.cat ?? null;
}

export function buildBlogTopics(pool: BlogArticle[] = BLOG_ARTICLES) {
  const counts: Record<string, number> = {};
  pool.forEach((a) => {
    counts[a.cat] = (counts[a.cat] || 0) + 1;
  });
  return Object.keys(counts)
    .sort()
    .map((k) => ({
      label: k,
      n: counts[k],
      href: `/blog/topic/${blogTopicSlug(k)}`,
    }));
}

export function filterBlogArticles(
  fmt: "All" | BlogFormat,
  q: string,
  source: BlogArticle[] = BLOG_ARTICLES,
) {
  let pool = fmt === "All" ? source : source.filter((a) => a.fmt === fmt);
  const query = q.trim().toLowerCase();
  if (query) {
    pool = pool.filter((a) =>
      `${a.title} ${a.dek} ${a.cat} ${a.fmt}`.toLowerCase().includes(query),
    );
  }
  return pool;
}

export function buildBlogJsonLd(articles: BlogArticle[] = BLOG_ARTICLES) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": "https://ninarossfm.com/blog#blog",
        url: "https://ninarossfm.com/blog",
        name: "The Journal — Nina Ross Functional Medicine",
        description:
          "Functional medicine explained in plain language: thyroid, hormones, gut health, PCOS, weight, and the testing behind each.",
        inLanguage: "en-US",
        publisher: { "@id": "https://ninarossfm.com/#organization" },
        author: { "@id": "https://ninarossfm.com/#nina" },
      },
      {
        "@type": "MedicalBusiness",
        "@id": "https://ninarossfm.com/#organization",
        name: "Nina Ross Functional Medicine",
        url: "https://ninarossfm.com",
        areaServed: { "@type": "City", name: "Atlanta" },
        medicalSpecialty: "PrimaryCare",
      },
      {
        "@type": "Person",
        "@id": "https://ninarossfm.com/#nina",
        name: "Nina Ross, ND; Ph.D",
        jobTitle: "Naturopathic Doctor and Board-Certified Trichologist",
        worksFor: { "@id": "https://ninarossfm.com/#organization" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://ninarossfm.com" },
          {
            "@type": "ListItem",
            position: 2,
            name: "The Journal",
            item: "https://ninarossfm.com/blog",
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "All articles, videos, audio, and guides",
        numberOfItems: articles.length,
        itemListElement: articles.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://ninarossfm.com/blog/${a.id}`,
          name: a.title,
        })),
      },
    ],
  };
}
