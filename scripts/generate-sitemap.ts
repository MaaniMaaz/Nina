import { writeFileSync } from "fs";
import { BLOG_ARTICLES, buildBlogTopics } from "../content/blog";
import { CONDITIONS_INDEX } from "../content/conditions";
import { TREATMENTS_INDEX } from "../content/treatments";
import { POSITIONING_INDEX } from "../content/positioning";

const SITE = "https://www.ninarossfm.com";
const now = new Date().toISOString().slice(0, 10);

type Entry = { path: string; changefreq: string; priority: string; lastmod?: string };

const entries: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/approach", changefreq: "monthly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/start", changefreq: "monthly", priority: "0.9" },
  { path: "/conditions", changefreq: "weekly", priority: "0.85" },
  { path: "/treatments", changefreq: "weekly", priority: "0.85" },
  { path: "/blog", changefreq: "weekly", priority: "0.85" },
  { path: "/search", changefreq: "monthly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/accessibility", changefreq: "yearly", priority: "0.3" },
  { path: "/notice-of-privacy-practices", changefreq: "yearly", priority: "0.3" },
];

for (const c of CONDITIONS_INDEX) {
  entries.push({ path: `/conditions/${c.slug}`, changefreq: "monthly", priority: "0.7" });
}
for (const t of TREATMENTS_INDEX) {
  entries.push({ path: `/treatments/${t.slug}`, changefreq: "monthly", priority: "0.7" });
}
for (const p of POSITIONING_INDEX) {
  entries.push({ path: `/${p.slug}`, changefreq: "monthly", priority: "0.75" });
}
for (const a of BLOG_ARTICLES) {
  entries.push({
    path: a.href,
    changefreq: "monthly",
    priority: "0.65",
    lastmod: a.date ? a.date.slice(0, 10) : now,
  });
}
for (const t of buildBlogTopics()) {
  entries.push({ path: t.href, changefreq: "weekly", priority: "0.55" });
}

const body = entries
  .map(
    (e) => `  <url>
    <loc>${SITE}${e.path}</loc>
    <lastmod>${e.lastmod || now}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), xml);
console.log(`Wrote public/sitemap.xml with ${entries.length} urls`);
