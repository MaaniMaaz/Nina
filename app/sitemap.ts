import type { MetadataRoute } from "next";
import { BLOG_ARTICLES, buildBlogTopics } from "@/content/blog";
import { CONDITIONS_INDEX } from "@/content/conditions";
import { TREATMENTS_INDEX } from "@/content/treatments";
import { POSITIONING_INDEX } from "@/content/positioning";

const SITE = "https://www.ninarossfm.com";

const STATIC: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/approach", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/start", changeFrequency: "monthly", priority: 0.9 },
  { path: "/conditions", changeFrequency: "weekly", priority: 0.85 },
  { path: "/treatments", changeFrequency: "weekly", priority: 0.85 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.85 },
  { path: "/search", changeFrequency: "monthly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/accessibility", changeFrequency: "yearly", priority: 0.3 },
  { path: "/notice-of-privacy-practices", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC.map((s) => ({
    url: `${SITE}${s.path}`,
    lastModified: now,
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }));

  const conditions: MetadataRoute.Sitemap = CONDITIONS_INDEX.map((c) => ({
    url: `${SITE}/conditions/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const treatments: MetadataRoute.Sitemap = TREATMENTS_INDEX.map((t) => ({
    url: `${SITE}/treatments/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const positioning: MetadataRoute.Sitemap = POSITIONING_INDEX.map((p) => ({
    url: `${SITE}/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const blogs: MetadataRoute.Sitemap = BLOG_ARTICLES.map((a) => ({
    url: `${SITE}${a.href}`,
    lastModified: a.date ? new Date(a.date) : now,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const topics: MetadataRoute.Sitemap = buildBlogTopics().map((t) => ({
    url: `${SITE}${t.href}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.55,
  }));

  return [...staticEntries, ...conditions, ...treatments, ...positioning, ...blogs, ...topics];
}
