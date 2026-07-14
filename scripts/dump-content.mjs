// One-off migration helper: reads a source .dc.html design file and dumps a
// condensed, structured JSON of its text content (per data-screen-label
// section: headings, paragraphs, list-item text, links, image-slot ids) plus
// meta/schema. Used as working notes while hand-authoring content/*.ts —
// not shipped, not imported by the app.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = dirname(fileURLToPath(import.meta.url));

const [, , inputPath] = process.argv;
if (!inputPath) {
  console.error("Usage: node scripts/dump-content.mjs <path-to-source.dc.html>");
  process.exit(1);
}

const html = readFileSync(inputPath, "utf-8");
const $ = cheerio.load(html, { xmlMode: false });

const meta = {
  title: $("title").first().text().trim(),
  description: $('meta[name="description"]').attr("content") || "",
  canonical: $('link[rel="canonical"]').attr("href") || "",
  ogImage: $('meta[property="og:image"]').attr("content") || "",
};

let schema = null;
$('script[type="application/ld+json"]').each((_, el) => {
  try {
    schema = JSON.parse($(el).contents().text());
  } catch {
    /* ignore */
  }
});

const sections = [];
$("[data-screen-label]").each((_, el) => {
  const $section = $(el);
  const label = $section.attr("data-screen-label");

  const headings = [];
  $section.find("h1, h2, h3").each((_, h) => {
    headings.push({ tag: h.tagName, text: $(h).text().trim() });
  });

  const paragraphs = [];
  $section.find("p").each((_, p) => {
    const text = $(p).text().trim();
    if (text) paragraphs.push(text);
  });

  const eyebrowSpans = [];
  $section
    .find('span[style*="uppercase"]')
    .each((_, s) => {
      const text = $(s).text().trim();
      if (text) eyebrowSpans.push(text);
    });

  const links = [];
  $section.find("a").each((_, a) => {
    const text = $(a).text().trim().replace(/\s+/g, " ");
    const href = $(a).attr("href") || "";
    if (text) links.push({ text, href });
  });

  const imageSlots = [];
  $section.find("image-slot").each((_, s) => {
    imageSlots.push({
      id: $(s).attr("id") || "",
      alt: $(s).attr("alt") || "",
      placeholder: $(s).attr("placeholder") || "",
    });
  });

  const details = [];
  $section.find("details").each((_, d) => {
    const q = $(d).find("summary h3").text().trim();
    const a = $(d).find("summary").nextAll().first().text().trim();
    if (q) details.push({ q, a });
  });

  // "strong" led bullet items, e.g. <strong>Label</strong>, rest of sentence.
  const strongBullets = [];
  $section.find("strong").each((_, s) => {
    const label = $(s).text().trim();
    const parent = $(s).parent();
    const full = parent.text().trim();
    strongBullets.push({ label, full });
  });

  // Bold-title callout pairs, e.g. a div/span styled font-weight:700 (title)
  // immediately followed by a sibling div/span (body text). Used for the
  // "what you're told / what's true" and "functional medicine difference"
  // callout boxes, which don't use <strong> or heading tags.
  const boldPairs = [];
  $section.find('div[style*="font-weight: 700"], span[style*="font-weight: 700"]').each((_, el) => {
    const $el = $(el);
    // Skip if this bold text is itself inside a heading we already captured.
    if ($el.closest("h1,h2,h3").length) return;
    const title = $el.text().trim();
    const next = $el.next();
    const body = next.length ? next.text().trim() : "";
    if (title) boldPairs.push({ title, body });
  });

  sections.push({
    label,
    headings,
    eyebrowSpans,
    paragraphs,
    links,
    imageSlots,
    details,
    strongBullets,
    boldPairs,
  });
});

const outDir = join(__dirname, "_dumps");
mkdirSync(outDir, { recursive: true });
const outName = basename(inputPath).replace(/\.dc\.html$/, "").replace(/[^\w.-]+/g, "_") + ".json";
const outPath = join(outDir, outName);
writeFileSync(outPath, JSON.stringify({ meta, schema, sections }, null, 2));
console.log("Wrote", outPath);
