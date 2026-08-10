/**
 * Blog / The Journal — mocked library from Blog Handoff
 * (`Blog Home - Full (Desktop|Mobile).dc.html`). No CMS yet.
 */

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

type Raw = {
  t: string;
  s: string;
  f: BlogFormat;
  c: string;
  m: string;
  dt: string;
  i: string;
  al: string;
  d: string;
};

const RAW: Raw[] = [
  {
    t: "Why your thyroid panel came back normal when you feel anything but",
    s: "thyroid-panel-normal-but-symptoms",
    f: "Read",
    c: "Thyroid",
    m: "8 min",
    dt: "2026-07-28",
    i: "turn-myself.png",
    al: "A woman reading her own thyroid lab results",
    d: "A standard panel checks one number. Here is the full picture we read, and what it explains about your energy, your hair, and your weight.",
  },
  {
    t: "The four hormones we test when your cycle goes sideways",
    s: "four-hormones-we-test-cycle",
    f: "Read",
    c: "Hormones",
    m: "7 min",
    dt: "2026-07-21",
    i: "turn-perimenopause.png",
    al: "A patient tracking her cycle at home",
    d: "Estrogen alone tells you very little. These four, read together, show you the pattern.",
  },
  {
    t: "PCOS, and what we do in place of birth control",
    s: "pcos-without-birth-control",
    f: "Guide",
    c: "PCOS",
    m: "12 min",
    dt: "2026-07-14",
    i: "patients/priya.png",
    al: "A woman managing PCOS with functional medicine care",
    d: "A full walk through the testing, the food, and the supplements that move PCOS at the root.",
  },
  {
    t: "Dr. Nina explains insulin resistance in six minutes",
    s: "insulin-resistance-explained",
    f: "Watch",
    c: "Metabolic",
    m: "6 min",
    dt: "2026-07-07",
    i: "home-media/feed-v3.webp",
    al: "Dr. Nina Ross explaining insulin resistance on video",
    d: "The clearest explanation of why your body holds weight, drawn out on paper.",
  },
  {
    t: "What bloating is actually telling you",
    s: "what-bloating-is-telling-you",
    f: "Listen",
    c: "Gut",
    m: "9 min",
    dt: "2026-06-30",
    i: "turn-eat.png",
    al: "A meal shared at a table without bloating afterward",
    d: "Four common causes, and how we tell them apart before we treat anything.",
  },
  {
    t: "The 3pm crash has a cause, and it is findable",
    s: "3pm-crash-cause",
    f: "Read",
    c: "Energy",
    m: "6 min",
    dt: "2026-06-23",
    i: "turn-3pm.png",
    al: "A woman working through the afternoon with steady energy",
    d: "Cortisol, blood sugar, and iron all show up in the afternoon. Here is how to tell which one is yours.",
  },
  {
    t: "Reading ferritin the way we read it",
    s: "reading-ferritin",
    f: "Read",
    c: "Labs",
    m: "5 min",
    dt: "2026-06-16",
    i: "home-media/toolDV-1.webp",
    al: "A functional medicine lab panel on a desk",
    d: "The number your doctor called fine is often the number behind your hair loss and your fatigue.",
  },
  {
    t: "A morning protocol for steady energy",
    s: "morning-protocol-steady-energy",
    f: "Protocol",
    c: "Energy",
    m: "4 min",
    dt: "2026-06-09",
    i: "turn-empty.png",
    al: "A calm morning routine at home",
    d: "Five things in the first hour that keep your afternoon from falling apart.",
  },
  {
    t: "Perimenopause, and what changes when you treat it early",
    s: "perimenopause-treated-early",
    f: "Guide",
    c: "Menopause",
    m: "11 min",
    dt: "2026-06-02",
    i: "turn-perimenopause.png",
    al: "A woman in her forties feeling steady through perimenopause",
    d: "The window where small changes hold the most ground, and what we watch during it.",
  },
  {
    t: "How an IV drip earns its place in your plan",
    s: "iv-drip-in-your-plan",
    f: "Read",
    c: "IV Therapy",
    m: "6 min",
    dt: "2026-05-26",
    i: "home-media/procA-6.webp",
    al: "An IV therapy session at the Atlanta studio",
    d: "What your labs have to show before we put anything in a bag.",
  },
  {
    t: "Inside a DUTCH test result",
    s: "inside-a-dutch-test-result",
    f: "Watch",
    c: "Labs",
    m: "11 min",
    dt: "2026-05-19",
    i: "home-media/feed-a4.webp",
    al: "Dr. Nina Ross reading a DUTCH hormone panel",
    d: "Dr. Nina reads a real hormone panel out loud, line by line.",
  },
  {
    t: "Peptides, explained plainly",
    s: "peptides-explained",
    f: "Read",
    c: "Peptides",
    m: "7 min",
    dt: "2026-05-12",
    i: "home-media/feed-a5.webp",
    al: "Prescription peptide therapy prepared in clinic",
    d: "What they do in the body, who they suit, and how we dose them off your results.",
  },
  {
    t: "The gut work that comes before everything else",
    s: "gut-work-comes-first",
    f: "Read",
    c: "Gut",
    m: "8 min",
    dt: "2026-05-05",
    i: "turn-eat.png",
    al: "A gut-friendly meal being prepared",
    d: "Hormones and energy both run through your gut. That is where most plans begin.",
  },
  {
    t: "Anti-inflammatory dinners we actually recommend",
    s: "anti-inflammatory-dinners",
    f: "Protocol",
    c: "Nutrition",
    m: "5 min",
    dt: "2026-04-28",
    i: "turn-eat.png",
    al: "An anti-inflammatory dinner plated at home",
    d: "Six dinners that calm inflammation and still taste like real food.",
  },
  {
    t: "Why we retest every 90 days",
    s: "why-we-retest-every-90-days",
    f: "Listen",
    c: "The Program",
    m: "7 min",
    dt: "2026-04-21",
    i: "clinic-bg.png",
    al: "The Nina Ross Functional Medicine studio in Atlanta",
    d: "Progress you can see on paper, and the adjustments that follow it.",
  },
  {
    t: "Hair shedding, and the labs we run first",
    s: "hair-shedding-labs-first",
    f: "Guide",
    c: "Hair Loss",
    m: "10 min",
    dt: "2026-04-14",
    i: "patients/tasha.png",
    al: "A patient whose hair shedding resolved with root-cause care",
    d: "Thyroid, iron, and hormones in the order we check them, from a board-certified trichologist.",
  },
  {
    t: "Weight that will not move, and the six things we check",
    s: "weight-will-not-move-six-checks",
    f: "Read",
    c: "Weight",
    m: "9 min",
    dt: "2026-04-07",
    i: "turn-weight.png",
    al: "A patient walking as part of a weight plan",
    d: "When effort stops working, one of these six is usually holding the door shut.",
  },
  {
    t: "GLP-1 done with your muscle in mind",
    s: "glp-1-with-muscle-in-mind",
    f: "Read",
    c: "Weight",
    m: "7 min",
    dt: "2026-03-31",
    i: "turn-weight.png",
    al: "Strength work alongside GLP-1 treatment",
    d: "How we protect strength while the weight comes down, and why that decides whether it stays off.",
  },
  {
    t: "Sleep that finally holds through the night",
    s: "sleep-that-holds",
    f: "Read",
    c: "Sleep",
    m: "6 min",
    dt: "2026-03-24",
    i: "turn-sleep.png",
    al: "A woman sleeping through the night",
    d: "Waking at 3am is a signal. Here is what it usually points to.",
  },
  {
    t: "What a first consult actually sounds like",
    s: "what-a-first-consult-sounds-like",
    f: "Listen",
    c: "The Program",
    m: "8 min",
    dt: "2026-03-17",
    i: "virtual-bg.png",
    al: "A virtual consult with the Nina Ross team",
    d: "Dr. Nina on the half hour where patients finally get heard all the way through.",
  },
  {
    t: "Cortisol curves and why your afternoon matters",
    s: "cortisol-curves-afternoon",
    f: "Read",
    c: "Hormones",
    m: "7 min",
    dt: "2026-03-10",
    i: "turn-anxiety.png",
    al: "A woman finding calm after cortisol testing",
    d: "One number at 8am hides the whole story. The curve is where the answer lives.",
  },
  {
    t: "Your gut map, one marker at a time",
    s: "your-gut-map-marker-by-marker",
    f: "Guide",
    c: "Gut",
    m: "13 min",
    dt: "2026-03-03",
    i: "home-media/toolDV-1.webp",
    al: "A GI-MAP stool test result being reviewed",
    d: "A plain-language tour of a GI-MAP result and what each finding changes in your plan.",
  },
  {
    t: "A batch-cook Sunday for a busy week",
    s: "batch-cook-sunday",
    f: "Protocol",
    c: "Nutrition",
    m: "4 min",
    dt: "2026-02-24",
    i: "turn-eat.png",
    al: "Batch-cooked meals prepared for the week",
    d: "Two hours on Sunday that carry five days of steady blood sugar.",
  },
  {
    t: "Hormone restoration, titrated to you",
    s: "hormone-restoration-titrated",
    f: "Read",
    c: "Hormones",
    m: "8 min",
    dt: "2026-02-17",
    i: "turn-worry.png",
    al: "A patient reviewing her hormone restoration plan",
    d: "Why the dose that works for someone else is rarely the dose that works for you.",
  },
];

export const BLOG_ARTICLES: BlogArticle[] = RAW.map((a) => ({
  id: a.s,
  title: a.t,
  href: `/blog/${a.s}`,
  fmt: a.f,
  cat: a.c,
  meta: a.m,
  date: a.dt,
  img: `/images/${a.i}`,
  alt: a.al,
  dek: a.d,
  fmtColor: FORMAT_COLORS[a.f],
  isPlay: a.f === "Watch",
}));

export const SHELF_DEFS = [
  {
    kicker: "Where most people start",
    title: "Normal labs, real symptoms",
    color: "#B5572F",
    cats: ["Thyroid", "Labs", "Energy", "Sleep", "Hair Loss"],
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
    cats: ["Weight", "Metabolic"],
  },
  {
    kicker: "The treatments",
    title: "What we might reach for",
    color: "#8a6a3a",
    cats: ["IV Therapy", "Peptides"],
  },
  {
    kicker: "Kitchen",
    title: "Protocols you can cook",
    color: "#2E211B",
    cats: ["Nutrition"],
  },
  {
    kicker: "Inside the program",
    title: "What being a patient looks like",
    color: "#4a6340",
    cats: ["The Program"],
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

export function buildBlogJsonLd() {
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
        numberOfItems: BLOG_ARTICLES.length,
        itemListElement: BLOG_ARTICLES.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://ninarossfm.com/blog/${a.id}`,
          name: a.title,
        })),
      },
    ],
  };
}
