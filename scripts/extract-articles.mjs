/**
 * Extract journal articles from Articles/*Desktop*.dc.html
 * into content/journal-articles.generated.json
 *
 * Usage: node scripts/extract-articles.mjs
 *
 * The HTML handoff folder was removed after translation. Restore `Articles/`
 * from git if you need to re-run this against the originals.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "Articles");
const OUT = path.join(ROOT, "content", "journal-articles.generated.json");

function meta(html, name, attr = "content") {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)="${name}"[^>]+${attr}="([^"]*)"`,
    "i",
  );
  const m = html.match(re);
  if (m) return decode(m[1]);
  const re2 = new RegExp(
    `<meta[^>]+${attr}="([^"]*)"[^>]+(?:name|property)="${name}"`,
    "i",
  );
  const m2 = html.match(re2);
  return m2 ? decode(m2[1]) : "";
}

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&middot;/g, "·")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rdquo;/g, "”")
    .replace(/&ldquo;/g, "“")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html) {
  return decode(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+\n/g, "\n")
      .replace(/\n\s+/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim(),
  );
}

function imgPath(src) {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return `/images/${src}`;
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mmss(s) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return m + ":" + (r < 10 ? "0" : "") + r;
}

function extractCanonicalSlug(html) {
  const m = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
  if (!m) return "";
  const u = m[1];
  const parts = u.replace(/\/$/, "").split("/");
  return parts[parts.length - 1] || "";
}

function extractLd(html) {
  const m = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

function extractArrayLiteral(js, name) {
  const re = new RegExp(`const ${name} = (\\[[\\s\\S]*?\\]);`);
  const m = js.match(re);
  if (!m) return [];
  try {
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${m[1]});`)();
  } catch (e) {
    console.warn(`Failed to parse ${name}:`, e.message);
    return [];
  }
}

function detectFormat(html) {
  if (/data-screen-label="Video theater"/i.test(html)) return "Watch";
  if (/data-screen-label="Player"/i.test(html)) return "Listen";
  if (/data-screen-label="Chapter rail"/i.test(html)) return "Guide";
  const badge = html.match(
    />\s*(Read|Watch|Listen|Guide|Protocol)\s*<\/span>/,
  );
  return badge ? badge[1] : "Read";
}

function extractHead(html) {
  const headBlock = html.match(
    /data-screen-label="Article head"[\s\S]*?(?=<div[^>]*data-screen-label="|<div[^>]*style="max-width: 1240px[^"]*padding: clamp\(30)/,
  );
  const block = headBlock ? headBlock[0] : html;
  const h1 = (block.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || "";
  const dek =
    (block.match(
      /<p[^>]*font-style: italic[^>]*>([\s\S]*?)<\/p>/,
    ) || [])[1] || "";
  const readTime =
    (block.match(/>(\d+\s*min(?:\s+read)?[^<]*)</) || [])[1] || "";
  const topicHref =
    (block.match(/href="(\/blog\/topic\/[^"]+)"/) || [])[1] || "";
  const topicLabel =
    (block.match(
      /href="\/blog\/topic\/[^"]+"[^>]*>([^<]+)</,
    ) || [])[1] || "";
  return {
    title: stripTags(h1),
    dek: stripTags(dek),
    readTime: stripTags(readTime),
    topicHref,
    topicLabel: stripTags(topicLabel),
  };
}

function extractShortAnswer(html) {
  const m = html.match(
    /data-screen-label="Short answer"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/,
  );
  return m ? stripTags(m[1]) : "";
}

function extractHero(html) {
  // First figure after article head / byline
  const m = html.match(
    /<figure[^>]*>[\s\S]*?(?:src|data-nrimg)="([^"]+)"[^>]*alt="([^"]*)"[\s\S]*?<figcaption[^>]*>([\s\S]*?)<\/figcaption>/,
  );
  if (!m) {
    const m2 = html.match(
      /(?:src|data-nrimg)="([^"]+)"[^>]*alt="([^"]*)"/,
    );
    if (m2 && !m2[1].includes("logo") && !m2[1].includes("dr-nina")) {
      return { src: imgPath(m2[1]), alt: decode(m2[2]), caption: "" };
    }
    return null;
  }
  if (m[1].includes("logo") || m[1].includes("dr-nina")) return null;
  return {
    src: imgPath(m[1]),
    alt: decode(m[2]),
    caption: stripTags(m[3]),
  };
}

/** Parse body into sequential blocks from Desktop HTML (order-preserving). */
function extractBodyBlocks(html) {
  const bodyStart = html.search(/data-screen-label="Body"/);
  const takeawaysStart = html.search(/data-screen-label="Takeaways"/);
  if (bodyStart < 0) return [];
  const end = takeawaysStart > bodyStart ? takeawaysStart : html.length;
  const region = html.slice(bodyStart, end);
  const blocks = [];

  // Match atomic content tags only — avoid greedy generic <div> wrappers.
  const tokenRe =
    /<(h2)\b[^>]*>([\s\S]*?)<\/h2>|<(blockquote)\b[^>]*>([\s\S]*?)<\/blockquote>|<(figure)\b[^>]*>([\s\S]*?)<\/figure>|<sc-for\s+list="\{\{\s*(panelItems|markers|timeline)\s*\}\}"[^>]*>[\s\S]*?<\/sc-for>|<(p)\b[^>]*>([\s\S]*?)<\/p>|<div[^>]*Caveat[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?Nina Ross[\s\S]*?<\/div>|<p[^>]*Caveat[^>]*>([\s\S]*?)<\/p>/gi;

  // Simpler multi-pass with positions
  const events = [];

  for (const m of region.matchAll(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi)) {
    const attrs = m[1] || "";
    const idM = attrs.match(/\bid="([^"]+)"/i);
    const spans = [...m[2].matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/gi)].map(
      (s) => stripTags(s[1]),
    );
    let text = "";
    if (spans.length >= 2) {
      // Guide: "Chapter one" + real title
      text = spans[spans.length - 1];
    } else if (spans.length === 1) {
      text = spans[0];
    } else {
      text = stripTags(m[2]);
    }
    events.push({
      i: m.index,
      type: "heading",
      text,
      id: idM ? idM[1] : undefined,
      chapterLabel: spans.length >= 2 ? spans[0] : undefined,
    });
  }
  for (const m of region.matchAll(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi)) {
    const q = stripTags(m[1].replace(/<div[^>]*>[\s\S]*?<\/div>/g, ""));
    if (q) events.push({ i: m.index, type: "pullQuote", text: q });
  }
  for (const m of region.matchAll(/<figure\b[^>]*>([\s\S]*?)<\/figure>/gi)) {
    const srcM = m[1].match(/(?:src|data-nrimg)="([^"]+)"/) || [];
    const altM = m[1].match(/alt="([^"]*)"/) || [];
    const capM = m[1].match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/);
    if (srcM[1] && !srcM[1].includes("logo") && !srcM[1].includes("dr-nina")) {
      events.push({
        i: m.index,
        type: "figure",
        src: imgPath(srcM[1]),
        alt: decode(altM[1] || ""),
        caption: capM ? stripTags(capM[1]) : "",
      });
    }
  }
  for (const m of region.matchAll(
    /<sc-for\s+list="\{\{\s*(panelItems|markers|timeline)\s*\}\}"/gi,
  )) {
    const kind = m[1];
    events.push({
      i: m.index,
      type:
        kind === "panelItems"
          ? "panelList"
          : kind === "markers"
            ? "markerList"
            : "timeline",
    });
  }
  // Dr Nina Caveat asides
  for (const m of region.matchAll(
    /font-family:\s*'Caveat'[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]{0,400}?Nina Ross/gi,
  )) {
    const quote = stripTags(m[1]);
    if (quote) events.push({ i: m.index, type: "aside", text: quote });
  }
  // Paragraphs — skip those inside blockquote/figure/aside/sc-for
  for (const m of region.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)) {
    const attrs = m[1] || "";
    const inner = m[2];
    const text = stripTags(inner);
    if (!text || text.includes("{{")) continue;
    // skip Caveat font paragraphs (handled as aside)
    if (/Caveat/i.test(attrs)) continue;
    // skip very short labels
    if (text.length < 12 && !/<a\b/i.test(inner)) continue;
    // skip if this p sits inside a figure or blockquote we already captured
    const before = region.slice(Math.max(0, m.index - 80), m.index);
    if (/<(figure|blockquote|figcaption)\b[^>]*$/i.test(before.replace(/\n/g, " ")))
      continue;
    if (/Caveat/i.test(before.slice(-200))) continue;

    const hasLink = /<a\b/i.test(inner);
    events.push({
      i: m.index,
      type: "paragraph",
      text,
      html: hasLink
        ? decode(
            inner
              .replace(/\sstyle="[^"]*"/g, "")
              .replace(/\sstyle-hover="[^"]*"/g, "")
              .trim(),
          )
        : undefined,
    });
  }

  events.sort((a, b) => a.i - b.i);

  // Deduplicate asides that also matched as paragraphs
  const asideTexts = new Set(
    events.filter((e) => e.type === "aside").map((e) => e.text),
  );
  for (const e of events) {
    if (e.type === "paragraph" && asideTexts.has(e.text)) continue;
    if (e.type === "heading" || e.type === "pullQuote" || e.type === "aside") {
      if (e.type === "heading") {
        const block = { type: "heading", text: e.text };
        if (e.id) block.id = e.id;
        if (e.chapterLabel) block.chapterLabel = e.chapterLabel;
        blocks.push(block);
      } else {
        blocks.push({ type: e.type, text: e.text });
      }
    } else if (e.type === "figure") {
      blocks.push({
        type: "figure",
        src: e.src,
        alt: e.alt,
        caption: e.caption,
      });
    } else if (
      e.type === "panelList" ||
      e.type === "markerList" ||
      e.type === "timeline"
    ) {
      blocks.push({ type: e.type });
    } else if (e.type === "paragraph") {
      blocks.push({
        type: "paragraph",
        text: e.text,
        ...(e.html ? { html: e.html } : {}),
      });
    }
  }

  return blocks;
}

function extractChapters(html) {
  const m = html.match(
    /data-screen-label="Chapter rail"([\s\S]*?)data-screen-label="Short answer"/,
  );
  if (!m) return [];
  const chapters = [];
  const re =
    /href="(#[^"]+)"[^>]*>[\s\S]*?<span[^>]*>(\d+)<\/span>[\s\S]*?<span[^>]*>([^<]+)<\/span>/gi;
  let x;
  while ((x = re.exec(m[1]))) {
    chapters.push({
      href: x[1],
      n: x[2],
      label: stripTags(x[3]),
    });
  }
  // fallback simpler
  if (!chapters.length) {
    const re2 = /href="(#[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let y;
    let i = 1;
    while ((y = re2.exec(m[1]))) {
      const label = stripTags(y[2]).replace(/^\d+\s*/, "");
      if (label)
        chapters.push({ href: y[1], n: String(i).padStart(2, "0"), label });
      i++;
    }
  }
  return chapters;
}

function extractTranscript(html) {
  const m = html.match(
    /data-screen-label="Transcript"([\s\S]*?)data-screen-label="Takeaways"/,
  );
  if (!m) return [];
  // from JS const transcript = [...]
  return [];
}

function extractCta(html) {
  const side = html.match(
    /data-screen-label="Side CTA"([\s\S]*?)(?:data-screen-label="Next|data-screen-label="Watch|data-screen-label="Listen|<\/aside>)/,
  );
  const band = html.match(
    /data-screen-label="CTA"([\s\S]*?)data-screen-label="Related"/,
  );
  const block = side?.[1] || band?.[1] || "";
  if (!block) {
    return {
      title: "Start with the $99 consultation",
      body: "Bring your story. Leave with a clear next step.",
      href: "/start",
      ctaLabel: "Book the consult →",
    };
  }
  const title = stripTags(
    (block.match(/<div[^>]*Fraunces[^>]*>([\s\S]*?)<\/div>/) ||
      block.match(/font-family: 'Fraunces'[^>]*>([\s\S]*?)<\/(?:div|p)>/) ||
      [])[1] || "Start with the $99 consultation",
  );
  const body = stripTags(
    (block.match(/<p[^>]*>([\s\S]*?)<\/p>/) || [])[1] || "",
  );
  const href = (block.match(/href="([^"]+)"/) || [])[1] || "/start";
  const ctaLabel = stripTags(
    (block.match(/<a[^>]+href="[^"]+"[^>]*>([\s\S]*?)<\/a>/) || [])[1] ||
      "Book the consult →",
  );
  return { title, body, href, ctaLabel };
}

function extractDateLabel(html) {
  const m = html.match(
    /(\w+ \d{1,2}, 20\d{2})\s*(?:&middot;|·)\s*Medically reviewed/,
  );
  return m ? m[1] : "";
}

function processFile(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const base = path.basename(filePath).replace(" (Desktop).dc.html", "");
  const scriptM = html.match(
    /<script[^>]*data-dc-script[^>]*>([\s\S]*?)<\/script>/,
  );
  const js = scriptM ? scriptM[1] : "";

  let slug = extractCanonicalSlug(html);
  // Fix known duplicate slug for 3pm Crash
  if (base === "3pm Crash" && slug === "cortisol-curves-afternoon") {
    slug = "3pm-crash-cause";
  }

  const ld = extractLd(html);
  const posting =
    ld?.["@graph"]?.find((n) => n["@type"] === "BlogPosting") || {};

  const format = detectFormat(html);
  const head = extractHead(html);
  const hero = extractHero(html);

  const panelItems =
    extractArrayLiteral(js, "panelItems").length
      ? extractArrayLiteral(js, "panelItems")
      : extractArrayLiteral(js, "ironLabs");
  const takeaways = extractArrayLiteral(js, "takeaways");
  const related = extractArrayLiteral(js, "related");
  const nextReads =
    extractArrayLiteral(js, "nextReads").length
      ? extractArrayLiteral(js, "nextReads")
      : extractArrayLiteral(js, "watchNext").length
        ? extractArrayLiteral(js, "watchNext")
        : extractArrayLiteral(js, "listenNext").length
          ? extractArrayLiteral(js, "listenNext")
          : extractArrayLiteral(js, "readNext");
  const markers = extractArrayLiteral(js, "markers");
  const timeline = extractArrayLiteral(js, "timeline");
  const chapterDefs = extractArrayLiteral(js, "chapterDefs");
  const chapterData = extractArrayLiteral(js, "chapterData");
  const chaptersJs = extractArrayLiteral(js, "chapters");
  const transcript = extractArrayLiteral(js, "transcript");

  // Guide chapter ids: this.IDS = ['a','b',...]
  const idsMatch = js.match(/IDS\s*=\s*(\[[\s\S]*?\])/);
  let guideIds = [];
  if (idsMatch) {
    try {
      guideIds = Function(`"use strict"; return (${idsMatch[1]});`)();
    } catch {
      guideIds = [];
    }
  }

  let chapters = [];
  if (chapterDefs.length) {
    chapters = chapterDefs.map((c, i) => ({
      n: c.n || String(i + 1).padStart(2, "0"),
      label: c.label,
      href: `#${guideIds[i] || slugify(c.label)}`,
    }));
  } else if (chaptersJs.length && chaptersJs[0].label) {
    chapters = chaptersJs.map((c) => ({
      n: c.n || "",
      label: c.label,
      href: c.href || `#${slugify(c.label)}`,
    }));
  } else {
    chapters = extractChapters(html);
  }

  const videoChapters = chapterData.map((c) => ({
    start: c.s ?? c.start ?? 0,
    time: typeof c.s === "number" ? mmss(c.s) : c.time || "",
    label: c.label,
  }));

  const youtubeId =
    (html.match(/"youtubeId"[^}]*"default"\s*:\s*"([^"]+)"/) || [])[1] ||
    (js.match(/youtubeId\s*\?\?\s*'([^']+)'/) || [])[1] ||
    "";

  let mediaPoster = "";
  const theater = html.match(
    /data-screen-label="(?:Video theater|Player)"[\s\S]{0,1200}?(?:src|data-nrimg)="([^"]+)"/,
  );
  if (theater) mediaPoster = imgPath(theater[1]);
  if (!mediaPoster) {
    const dep = html.match(
      /ext-resource-dependency" content="((?:home-media|clinic|virtual)[^"]+)"/,
    );
    if (dep) mediaPoster = imgPath(dep[1]);
  }

  // Normalize image paths in nextReads
  const next = (nextReads || []).map((n) => ({
    ...n,
    img: imgPath(n.img),
  }));

  const recapMatch = js.match(/recapSeconds[^\d]*(\d+)/);
  const recapDefault =
    Number(
      (html.match(/"recapSeconds"[^}]*"default"\s*:\s*(\d+)/) || [])[1],
    ) || Number(recapMatch?.[1]) || 192;

  return {
    sourceFile: base,
    slug,
    format,
    title: head.title || posting.headline || meta(html, "og:title"),
    dek:
      head.dek ||
      posting.description ||
      meta(html, "og:description"),
    description: meta(html, "description") || posting.description || "",
    datePublished:
      posting.datePublished || meta(html, "article:published_time"),
    dateLabel: extractDateLabel(html),
    articleSection: posting.articleSection || head.topicLabel || "",
    topicHref: head.topicHref,
    topicLabel: head.topicLabel || posting.articleSection || "",
    timeRequired: posting.timeRequired || "",
    wordCount: posting.wordCount || null,
    readTime: head.readTime,
    hero,
    shortAnswer: extractShortAnswer(html),
    body: extractBodyBlocks(html),
    panelItems,
    markers,
    timeline,
    chapters,
    transcript,
    videoChapters,
    youtubeId: youtubeId && youtubeId !== "VIDEO_ID" ? youtubeId : "",
    mediaPoster,
    takeaways,
    related,
    next,
    cta: extractCta(html),
    audioRecapSeconds: recapDefault,
    showAudioRecap: !/data-screen-label="Player"/i.test(html),
  };
}

const files = fs
  .readdirSync(ARTICLES_DIR)
  .filter((f) => f.includes("(Desktop).dc.html"))
  .map((f) => path.join(ARTICLES_DIR, f));

const articles = files.map(processFile);
fs.writeFileSync(OUT, JSON.stringify(articles, null, 2));
console.log(`Wrote ${articles.length} articles → ${OUT}`);
for (const a of articles) {
  console.log(
    `  ${a.slug.padEnd(40)} ${a.format.padEnd(8)} body:${a.body.length} takeaways:${a.takeaways.length}`,
  );
}
