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

function localAudioPath(url) {
  if (!url) return "";
  const m = String(url).match(/\/audio\/[^?\s"'#]+\.mp3/i);
  if (m) return m[0];
  if (String(url).startsWith("/audio/")) return String(url).split(/[?#]/)[0];
  return "";
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mmss(s) {
  const n = Number(s) || 0;
  const m = Math.floor(n / 60);
  const r = Math.floor(n % 60);
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

/** Find a top-level `[...]` array after `name =` / `const name =`, with balanced brackets. */
function extractBalancedArray(js, name) {
  const re = new RegExp(
    `(?:(?:const|let|var)\\s+)?(?:this\\.)?${name}\\s*=\\s*\\[`,
  );
  const m = re.exec(js);
  if (!m) return null;
  const start = m.index + m[0].length - 1;
  let depth = 0;
  let inStr = null;
  let escape = false;
  for (let i = start; i < js.length; i++) {
    const ch = js[i];
    if (inStr) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === "\\") {
        escape = true;
        continue;
      }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inStr = ch;
      continue;
    }
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) {
        const lit = js.slice(start, i + 1);
        try {
          // eslint-disable-next-line no-new-func
          return Function(`"use strict"; return (${lit});`)();
        } catch (e) {
          console.warn(`Failed to parse ${name}:`, e.message);
          return null;
        }
      }
    }
  }
  return null;
}

function extractArrayLiteral(js, name) {
  const v = extractBalancedArray(js, name);
  return Array.isArray(v) ? v : [];
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

function injectPanelList(body) {
  if (body.some((b) => b.type === "panelList")) return body;
  const coverIdx = body.findIndex(
    (b) => b.type === "heading" && /What Dr\.?\s*Nina covers/i.test(b.text),
  );
  let insertAt;
  if (coverIdx >= 0) {
    insertAt = coverIdx + 1;
    while (insertAt < body.length && body[insertAt].type === "paragraph") {
      insertAt++;
    }
  } else {
    insertAt = 0;
    while (insertAt < body.length && body[insertAt].type === "paragraph") {
      insertAt++;
    }
    if (insertAt === 0 && body[0]?.type === "heading") {
      insertAt = 1;
      while (insertAt < body.length && body[insertAt].type === "paragraph") {
        insertAt++;
      }
    }
  }
  return [
    ...body.slice(0, insertAt),
    { type: "panelList" },
    ...body.slice(insertAt),
  ];
}

/** Parse body into sequential blocks from Desktop HTML (order-preserving). */
function extractBodyBlocks(html) {
  const bodyStart = html.search(/data-screen-label="Body"/);
  const takeawaysStart = html.search(/data-screen-label="Takeaways"/);
  if (bodyStart < 0) return [];
  const end = takeawaysStart > bodyStart ? takeawaysStart : html.length;
  const region = html.slice(bodyStart, end);
  const blocks = [];
  const events = [];

  for (const m of region.matchAll(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi)) {
    const attrs = m[1] || "";
    const idM = attrs.match(/\bid="([^"]+)"/i);
    const spans = [...m[2].matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/gi)].map(
      (s) => stripTags(s[1]),
    );
    let text = "";
    if (spans.length >= 2) {
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
    /<sc-for\s+list="\{\{\s*(panelItems|markers|timeline|causes)\s*\}\}"/gi,
  )) {
    const kind = m[1];
    events.push({
      i: m.index,
      type:
        kind === "panelItems" || kind === "causes"
          ? "panelList"
          : kind === "markers"
            ? "markerList"
            : "timeline",
    });
  }

  // Caveat asides — prefer Caveat on the <p> itself (First Consult / Listen),
  // or an outer non-<p> wrapper that nests a quote <p> before "Nina Ross".
  const asideSeen = new Set();
  for (const m of region.matchAll(
    /<p\b([^>]*font-family:\s*'Caveat'[^>]*)>([\s\S]*?)<\/p>/gi,
  )) {
    const quote = stripTags(m[2]);
    if (!quote || asideSeen.has(quote)) continue;
    const after = region.slice(m.index, m.index + m[0].length + 280);
    if (!/Nina Ross,\s*ND/i.test(after)) continue;
    asideSeen.add(quote);
    events.push({ i: m.index, type: "aside", text: quote });
  }
  for (const m of region.matchAll(
    /<(div|span)\b([^>]*font-family:\s*'Caveat'[^>]*)>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>[\s\S]{0,280}?Nina Ross,\s*ND/gi,
  )) {
    const quote = stripTags(m[3]);
    if (quote && !asideSeen.has(quote)) {
      asideSeen.add(quote);
      events.push({ i: m.index, type: "aside", text: quote });
    }
  }

  for (const m of region.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)) {
    const attrs = m[1] || "";
    const inner = m[2];
    const text = stripTags(inner);
    if (!text || text.includes("{{")) continue;
    if (/Caveat/i.test(attrs)) continue;
    if (text.length < 12 && !/<a\b/i.test(inner)) continue;
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

function extractTranscript(js) {
  const data = extractArrayLiteral(js, "transcriptData");
  if (data.length && data.some((row) => row && (row.text || row.t != null || row.s != null))) {
    return data.map((row) => {
      const s = typeof row.s === "number" ? row.s : Number(row.t) || 0;
      return {
        time: row.time || mmss(s),
        t: s,
        text: String(row.text || "").trim(),
      };
    }).filter((row) => row.text);
  }

  const raw = extractArrayLiteral(js, "transcript");
  if (raw.length && raw.some((row) => row && typeof row === "object" && row.text)) {
    return raw.map((row) => {
      const s =
        typeof row.s === "number"
          ? row.s
          : typeof row.t === "number"
            ? row.t
            : typeof row.time === "string" && /^\d+:\d+/.test(row.time)
              ? (() => {
                  const [a, b] = row.time.split(":").map(Number);
                  return a * 60 + b;
                })()
              : 0;
      return {
        time: row.time || mmss(s),
        t: s,
        text: String(row.text || "").trim(),
      };
    }).filter((row) => row.text);
  }

  return [];
}

function extractAudioUrl(html, ld) {
  const audioNode =
    ld?.["@graph"]?.find((n) => n["@type"] === "AudioObject") ||
    (ld?.["@type"] === "AudioObject" ? ld : null);
  const fromLd = localAudioPath(audioNode?.contentUrl || "");
  if (fromLd) return fromLd;

  const download = html.match(
    /<a[^>]+href="([^"]*\/audio\/[^"]+\.mp3)"[^>]*>\s*Download\s*<\/a>/i,
  );
  if (download) return localAudioPath(download[1]);

  const any = html.match(/href="([^"]*\/audio\/[^"]+\.mp3)"/i);
  return any ? localAudioPath(any[1]) : "";
}

function extractAudioSeconds(html, js) {
  const fromProps = Number(
    (html.match(/"audioSeconds"[^}]*"default"\s*:\s*(\d+)/) || [])[1],
  );
  if (fromProps) return fromProps;
  const fromJs = Number(
    (js.match(/this\.props\.audioSeconds\s*\?\?\s*(\d+)/) || [])[1],
  );
  return fromJs || undefined;
}

function extractRecapSeconds(html, js) {
  const fromProps = Number(
    (html.match(/"recapSeconds"[^}]*"default"\s*:\s*(\d+)/) || [])[1],
  );
  if (fromProps) return fromProps;
  const fromJs = Number(
    (js.match(/this\.props\.recapSeconds\s*\?\?\s*(\d+)/) ||
      js.match(/recapSeconds[^\d]*(\d+)/) ||
      [])[1],
  );
  return fromJs || 192;
}

function extractFooterCta(html) {
  const block =
    (html.match(/data-screen-label="Footer"([\s\S]*?)(?:<\/x-dc>|$)/) ||
      [])[1] || "";
  if (!block) return undefined;

  const title = stripTags(
    (block.match(
      /<div[^>]*font-family:\s*'Fraunces'[^>]*>([\s\S]*?)<\/div>/,
    ) || [])[1] || "",
  );
  const body = stripTags((block.match(/<p[^>]*>([\s\S]*?)<\/p>/) || [])[1] || "");
  const cta =
    block.match(
      /<a\s+href="([^"]+)"[^>]*background:\s*#E9B45A[^>]*>([\s\S]*?)<\/a>/i,
    ) ||
    block.match(
      /<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i,
    );
  if (!title && !cta) return undefined;
  return {
    title,
    body,
    href: cta?.[1] || "",
    ctaLabel: stripTags(cta?.[2] || ""),
  };
}

function extractAudioRecapEyebrow(html, format) {
  const m = html.match(
    /data-screen-label="Audio recap"[\s\S]{0,500}?<span[^>]*color:\s*#CFA85A[^>]*>([^<]+)</i,
  );
  const text = m ? stripTags(m[1]) : "";
  if (!text) return "";
  // Guide specials like "Twelve minutes is a lot"; skip default "Short on time"
  if (format === "Guide" && /is a lot/i.test(text)) return text;
  return "";
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

function firstNextChain(js) {
  for (const name of ["nextItems", "nextReads", "watchNext", "listenNext", "readNext"]) {
    const rows = extractArrayLiteral(js, name);
    if (rows.length) return rows;
  }
  return [];
}

function processFile(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const base = path.basename(filePath).replace(" (Desktop).dc.html", "");
  const scriptM = html.match(
    /<script[^>]*data-dc-script[^>]*>([\s\S]*?)<\/script>/,
  );
  const js = scriptM ? scriptM[1] : "";

  let slug = extractCanonicalSlug(html);
  if (base === "3pm Crash" && slug === "cortisol-curves-afternoon") {
    slug = "3pm-crash-cause";
  }

  const ld = extractLd(html);
  const posting =
    ld?.["@graph"]?.find((n) => n["@type"] === "BlogPosting") || {};

  const format = detectFormat(html);
  const head = extractHead(html);
  const hero = extractHero(html);

  let panelItems =
    extractArrayLiteral(js, "panelItems").length
      ? extractArrayLiteral(js, "panelItems")
      : extractArrayLiteral(js, "ironLabs");
  const causes = extractArrayLiteral(js, "causes");
  if ((!panelItems || !panelItems.length) && causes.length) {
    panelItems = causes.map((c) => ({
      name: c.name || c.label || "",
      why: c.why || c.note || c.text || "",
    }));
  }

  const takeaways = extractArrayLiteral(js, "takeaways");
  const related = extractArrayLiteral(js, "related");
  const nextReads = firstNextChain(js);
  const markers = extractArrayLiteral(js, "markers");
  const timeline = extractArrayLiteral(js, "timeline");
  const chapterDefs = extractArrayLiteral(js, "chapterDefs");
  const chapterData = extractArrayLiteral(js, "chapterData");
  const chaptersJs = extractArrayLiteral(js, "chapters");
  const transcript = extractTranscript(js);
  const wave = extractArrayLiteral(js, "WAVE");

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
  if (format === "Listen") {
    const cover = html.match(
      /data-screen-label="Player"[\s\S]{0,2000}?(?:src|data-nrimg)="(dr-nina\.png|[^"]*dr-nina[^"]*)"/i,
    );
    if (cover) mediaPoster = imgPath(cover[1]);
    if (!mediaPoster) mediaPoster = "/images/dr-nina.png";
  } else {
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
  }

  const next = (nextReads || []).map((n) => ({
    ...n,
    img: imgPath(n.img),
  }));

  const audioUrl = extractAudioUrl(html, ld);
  const audioSeconds = extractAudioSeconds(html, js);
  const audioRecapSeconds = extractRecapSeconds(html, js);
  const footerCta = extractFooterCta(html);
  const audioRecapEyebrow = extractAudioRecapEyebrow(html, format);

  let body = extractBodyBlocks(html);
  if (causes.length) body = injectPanelList(body);

  const isListen = format === "Listen";

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
    body,
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
    audioUrl: audioUrl || undefined,
    audioSeconds: audioSeconds || undefined,
    audioRecapSeconds,
    audioRecapEyebrow,
    footerCta,
    wave: wave.length ? wave : undefined,
    showAudioRecap: isListen ? false : !/data-screen-label="Player"/i.test(html),
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
  const types = {};
  for (const b of a.body || []) types[b.type] = (types[b.type] || 0) + 1;
  const typeStr = Object.entries(types)
    .map(([k, v]) => `${k}:${v}`)
    .join(",");
  console.log(
    [
      a.slug,
      a.format,
      `audioUrl=${a.audioUrl || ""}`,
      `audioSeconds=${a.audioSeconds ?? ""}`,
      `audioRecapSeconds=${a.audioRecapSeconds}`,
      `transcript=${(a.transcript || []).length}`,
      `panelItems=${(a.panelItems || []).length}`,
      `next=${(a.next || []).length}`,
      `footerCta=${a.footerCta?.title || ""}`,
      `bodyTypes={${typeStr}}`,
    ].join(" | "),
  );
}
