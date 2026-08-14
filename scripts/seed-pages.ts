/**
 * Seed MongoDB `pages` from existing TypeScript content.
 * Usage: MONGODB_URI=... npx tsx scripts/seed-pages.ts
 */
import { MongoClient } from "mongodb";
import { CONDITIONS, CONDITIONS_INDEX } from "../content/conditions";
import { TREATMENTS, TREATMENTS_INDEX } from "../content/treatments";
import { DEFAULT_HOME_CONTENT } from "../content/home-page";
import { JOURNAL_ARTICLES, asCmsJournal, journalToBlogCard } from "../content/journal";
import { toSeedDocument } from "../lib/cms/templates";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Set MONGODB_URI before seeding.");
    process.exit(1);
  }
  const dbName = process.env.MONGODB_DB || "nina";
  const client = new MongoClient(uri);
  await client.connect();
  const col = client.db(dbName).collection("pages");

  await col.createIndex({ type: 1, slug: 1 }, { unique: true });
  await col.createIndex({ type: 1, status: 1 });

  const docs = [];

  for (const c of CONDITIONS) {
    const idx = CONDITIONS_INDEX.find((i) => i.slug === c.slug);
    docs.push(
      toSeedDocument("condition", {
        slug: c.slug,
        title: idx?.name ?? c.hero.breadcrumbLabel,
        metaTitle: c.title.replace(/\s*[–-]\s*Nina Ross FM$/, "").replace(/\s*\|\s*Nina Ross Functional Medicine$/, ""),
        metaDescription: c.description,
        indexName: idx?.name ?? c.hero.breadcrumbLabel,
        indexTeaser: idx?.teaser ?? c.hero.paragraphs[0] ?? "",
        content: c,
      }),
    );
  }

  for (const t of TREATMENTS) {
    const idx = TREATMENTS_INDEX.find((i) => i.slug === t.slug);
    docs.push(
      toSeedDocument("treatment", {
        slug: t.slug,
        title: idx?.name ?? t.hero.breadcrumbLabel,
        metaTitle: t.title.replace(/\s*[–-]\s*Nina Ross FM$/, "").replace(/\s*\|\s*Nina Ross Functional Medicine$/, ""),
        metaDescription: t.description,
        indexName: idx?.name ?? t.hero.breadcrumbLabel,
        indexTeaser: idx?.teaser ?? t.hero.paragraphs[0] ?? "",
        content: t,
      }),
    );
  }

  for (const article of JOURNAL_ARTICLES) {
    const content = asCmsJournal(article);
    const card = journalToBlogCard(article);
    docs.push(
      toSeedDocument("blog", {
        slug: article.slug,
        title: article.title,
        metaTitle: article.title,
        metaDescription: article.description || article.dek,
        indexName: article.title,
        indexTeaser: article.dek,
        coverImageUrl: card.img,
        content,
      }),
    );
  }

  docs.push(
    toSeedDocument("home", {
      slug: "home",
      title: "Homepage",
      metaTitle: "Nina Ross Functional Medicine, Atlanta",
      metaDescription:
        "Physician-led functional medicine in Atlanta and virtual care nationwide. Root-cause care with Dr. Nina Ross, ND PhD. Start with the $99 Symptom Consultation.",
      indexName: "Homepage",
      indexTeaser:
        "Physician-led functional medicine in Atlanta and virtual care nationwide.",
      content: structuredClone(DEFAULT_HOME_CONTENT),
    }),
  );

  let upserted = 0;
  for (const doc of docs) {
    const { createdAt, ...rest } = doc;
    await col.updateOne(
      { type: doc.type, slug: doc.slug },
      { $set: { ...rest }, $setOnInsert: { createdAt } },
      { upsert: true },
    );
    upserted += 1;
  }

  console.log(`Seeded/updated ${upserted} pages into ${dbName}.pages`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
