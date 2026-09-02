import { BLOG_ARTICLES } from "@/content/blog";
import { CONDITIONS_INDEX } from "@/content/conditions";
import { TREATMENTS_INDEX } from "@/content/treatments";
import { POSITIONING_INDEX } from "@/content/positioning";

export type SearchHit = {
  kind: "condition" | "treatment" | "journal" | "page";
  title: string;
  href: string;
  teaser: string;
};

function norm(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function score(q: string, ...fields: string[]) {
  const nq = norm(q);
  if (!nq) return 0;
  const hay = norm(fields.join(" "));
  if (!hay) return 0;
  if (hay === nq) return 100;
  if (hay.startsWith(nq)) return 80;
  if (hay.includes(nq)) return 60;
  const parts = nq.split(" ").filter(Boolean);
  const hits = parts.filter((p) => hay.includes(p)).length;
  return hits ? (hits / parts.length) * 40 : 0;
}

const STATIC_PAGES: SearchHit[] = [
  {
    kind: "page",
    title: "Home",
    href: "/",
    teaser: "Nina Ross Functional Medicine — root-cause care in Atlanta and virtual.",
  },
  {
    kind: "page",
    title: "Our Approach",
    href: "/approach",
    teaser: "How care works here — listen, test, treat the cause.",
  },
  {
    kind: "page",
    title: "Dr. Nina Ross",
    href: "/about",
    teaser: "Meet Dr. Nina Ross, ND PhD.",
  },
  {
    kind: "page",
    title: "Book a $99 consult",
    href: "/start",
    teaser: "In-person Atlanta or virtual — Acuity scheduling.",
  },
  {
    kind: "page",
    title: "Patient stories",
    href: "/#patient-stories",
    teaser: "Real people. Real labs. Real reversals.",
  },
  {
    kind: "page",
    title: "The Journal",
    href: "/blog",
    teaser: "Articles, guides, watch, and listen from Dr. Nina.",
  },
  {
    kind: "page",
    title: "Conditions",
    href: "/conditions",
    teaser: "Hormones, gut, thyroid, fatigue, weight, and more.",
  },
  {
    kind: "page",
    title: "Treatments",
    href: "/treatments",
    teaser: "Labs, IV therapy, peptides, hormones, and the toolkit.",
  },
];

/** Site-wide search used by `/search` and the 404 form. */
export function searchSite(query: string, limit = 40): SearchHit[] {
  const q = query.trim();
  if (!q) return STATIC_PAGES.slice(0, 8);

  const scored: Array<SearchHit & { s: number }> = [];

  for (const p of STATIC_PAGES) {
    const s = score(q, p.title, p.teaser);
    if (s > 0) scored.push({ ...p, s });
  }

  for (const c of CONDITIONS_INDEX) {
    const s = score(q, c.name, c.teaser, "condition");
    if (s > 0) {
      scored.push({
        kind: "condition",
        title: c.name,
        href: `/conditions/${c.slug}`,
        teaser: c.teaser,
        s,
      });
    }
  }

  for (const t of TREATMENTS_INDEX) {
    const s = score(q, t.name, t.teaser, "treatment");
    if (s > 0) {
      scored.push({
        kind: "treatment",
        title: t.name,
        href: `/treatments/${t.slug}`,
        teaser: t.teaser,
        s,
      });
    }
  }

  for (const p of POSITIONING_INDEX) {
    const s = score(q, p.name, p.teaser);
    if (s > 0) {
      scored.push({
        kind: "page",
        title: p.name,
        href: `/${p.slug}`,
        teaser: p.teaser,
        s,
      });
    }
  }

  for (const a of BLOG_ARTICLES) {
    const s = score(q, a.title, a.dek, a.cat, a.fmt);
    if (s > 0) {
      scored.push({
        kind: "journal",
        title: a.title,
        href: a.href,
        teaser: a.dek,
        s,
      });
    }
  }

  return scored
    .sort((a, b) => b.s - a.s || a.title.localeCompare(b.title))
    .slice(0, limit)
    .map(({ s: _s, ...hit }) => hit);
}
