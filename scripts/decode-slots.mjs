// One-off migration script: decodes the design tool's .image-slots.state.json
// sidecar (base64 "dropped" images, keyed by <image-slot id>) into real files
// under public/images/slots/. Run with: node scripts/decode-slots.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..", "..");
const statePath = join(projectRoot, ".image-slots.state.json");
const outDir = join(__dirname, "..", "public", "images", "slots");
const manifestPath = join(__dirname, "..", "content", "slot-images.generated.json");

mkdirSync(outDir, { recursive: true });

const raw = readFileSync(statePath, "utf-8");
const state = JSON.parse(raw);

/** @type {Record<string, string>} */
const manifest = {};
let count = 0;

for (const [id, entry] of Object.entries(state)) {
  const dataUrl = entry?.u;
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) continue;

  const match = /^data:image\/(\w+);base64,(.+)$/.exec(dataUrl);
  if (!match) continue;
  const [, ext, base64] = match;
  const buffer = Buffer.from(base64, "base64");
  const filename = `${id}.${ext}`;
  writeFileSync(join(outDir, filename), buffer);
  manifest[id] = `/images/slots/${filename}`;
  count += 1;
}

mkdirSync(dirname(manifestPath), { recursive: true });
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

console.log(`Decoded ${count} images -> ${outDir}`);
console.log(`Manifest written -> ${manifestPath}`);
