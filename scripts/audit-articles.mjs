import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const dir = path.join(ROOT, "Articles");
const json = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content/journal-articles.generated.json"), "utf8"),
);

const desks = fs
  .readdirSync(dir)
  .filter((f) => f.includes("(Desktop).dc.html"));

console.log("Desktop HTML:", desks.length, "Extracted:", json.length);
let bad = 0;
for (const f of desks) {
  const base = f.replace(" (Desktop).dc.html", "");
  const html = fs.readFileSync(path.join(dir, f), "utf8");
  const slugM = html.match(/\/blog\/([a-z0-9-]+)["']/);
  const slug = slugM ? slugM[1] : "";
  const a =
    json.find((x) => x.sourceFile === base) ||
    json.find((x) => x.slug === slug) ||
    (base === "3pm Crash"
      ? json.find((x) => x.slug === "3pm-crash-cause")
      : null);
  const h2 = (html.match(/<h2\b/g) || []).length;
  const issues = [];
  if (!a) issues.push("MISSING");
  else {
    if (!a.title) issues.push("no title");
    if (!a.shortAnswer) issues.push("no shortAnswer");
    if (!a.takeaways?.length) issues.push("no takeaways");
    if (a.body.length < 5) issues.push("thin body:" + a.body.length);
    const hBody = a.body.filter((b) => b.type === "heading").length;
    if (hBody < Math.max(1, Math.floor(h2 * 0.5))) {
      issues.push(`headings html=${h2} ext=${hBody}`);
    }
    if (a.format === "Guide" && !a.chapters?.length) issues.push("no chapters");
    if ((a.format === "Watch" || a.format === "Listen") && !a.mediaPoster) {
      issues.push("no poster");
    }
  }
  if (issues.length) bad += 1;
  console.log(
    (issues.length ? "!" : "ok"),
    base.padEnd(28),
    (a?.slug || "?").padEnd(36),
    a?.format || "",
    issues.join(", "),
  );
}
console.log(bad ? `FAIL ${bad} issues` : "ALL OK");
process.exit(bad ? 1 : 0);
