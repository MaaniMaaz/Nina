import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourceRoot = join(__dirname, "..", "..");

const files = readdirSync(sourceRoot).filter(
  (f) => f.endsWith("Full (Desktop).dc.html") || f === "Nina Ross FM Homepage - Desktop.dc.html" || f.startsWith("Nina Ross Booking")
);

for (const f of files) {
  console.log("Dumping:", f);
  execFileSync("node", [join(__dirname, "dump-content.mjs"), join(sourceRoot, f)], { stdio: "inherit" });
}
console.log(`Done. ${files.length} files dumped.`);
