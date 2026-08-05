const fs = require("fs");
const path = require("path");

const dir = "c:/Users/hp/Downloads/legal pages/Legal Pages";
const outDir = "c:/Users/hp/ninarosswebsite/Nina/content/legal";
fs.mkdirSync(outDir, { recursive: true });

function extractRaw(html) {
  const start = html.indexOf("const raw = [");
  if (start < 0) throw new Error("no raw");
  let i = start + "const raw = ".length;
  let depth = 0;
  let end = -1;
  for (; i < html.length; i++) {
    const c = html[i];
    if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  const arrSrc = html.slice(start + "const raw = ".length, end);
  return Function('"use strict"; return (' + arrSrc + ")")();
}

function writeDoc(filename, exportName, meta, hero, contact, raw) {
  const sections = raw.map((s) => ({
    id: s.id,
    short: s.short,
    title: s.title,
    paras: s.paras,
    bullets: s.bullets,
  }));
  const doc = { meta, hero, contact, sections };
  const src =
    `import type { LegalDoc } from "./types";\n\n` +
    `export const ${exportName}: LegalDoc = ${JSON.stringify(doc, null, 2)};\n`;
  fs.writeFileSync(path.join(outDir, filename), src);
  console.log("wrote", filename, "sections", sections.length);
}

writeDoc(
  "privacy.ts",
  "PRIVACY_POLICY",
  {
    title: "Privacy Policy | Nina Ross Functional Medicine",
    description:
      "How Nina Ross Hair Therapy, LTD collects, uses, and protects your information, including health information, on the Nina Ross Functional Medicine website.",
    canonical: "/privacy",
  },
  {
    title: "Privacy Policy",
    titleClamp: "clamp(34px, 5.4vw, 60px)",
    deck: "What we collect, why we collect it, who we share it with, and what you can ask us to do about it. Nina Ross Hair Therapy, LTD, doing business as Nina Ross Functional Medicine.",
    deckVariant: "default",
    lastUpdated: "July 31, 2026",
    effective: "July 31, 2026",
  },
  {
    heading: "Nina Ross Hair Therapy, LTD",
    lines: ["d/b/a Nina Ross Functional Medicine", "Atlanta, Georgia"],
    email: "info@ninarossfm.com",
    note: "Write to us with Privacy in the subject line and tell us what you would like us to do. We will confirm we received your request and respond within the time the law allows.",
    links: [
      { href: "/terms", label: "Terms of Service", variant: "ghost" },
      {
        href: "/notice-of-privacy-practices",
        label: "Notice of Privacy Practices",
        variant: "ghost",
      },
      { href: "/start", label: "Book a consult", variant: "primary" },
    ],
  },
  extractRaw(fs.readFileSync(path.join(dir, "Privacy Policy.dc.html"), "utf8")),
);

writeDoc(
  "terms.ts",
  "TERMS_OF_SERVICE",
  {
    title: "Terms of Service | Nina Ross Functional Medicine",
    description:
      "The terms that govern use of the Nina Ross Functional Medicine website, consultations, memberships, and programs. Nina Ross Hair Therapy, LTD, Atlanta, Georgia.",
    canonical: "/terms",
  },
  {
    title: "Terms of Service",
    titleClamp: "clamp(34px, 5.4vw, 60px)",
    deck: "These terms govern your use of this website and any consultation, membership, or program you purchase from Nina Ross Hair Therapy, LTD, doing business as Nina Ross Functional Medicine.",
    deckVariant: "default",
    lastUpdated: "July 31, 2026",
    effective: "July 31, 2026",
  },
  {
    heading: "Nina Ross Hair Therapy, LTD",
    lines: ["d/b/a Nina Ross Functional Medicine", "Atlanta, Georgia"],
    email: "info@ninarossfm.com",
    links: [
      { href: "/privacy", label: "Privacy Policy", variant: "ghost" },
      { href: "/start", label: "Book a consult", variant: "primary" },
    ],
  },
  extractRaw(fs.readFileSync(path.join(dir, "Terms of Service.dc.html"), "utf8")),
);

writeDoc(
  "notice.ts",
  "NOTICE_OF_PRIVACY_PRACTICES",
  {
    title: "Notice of Privacy Practices | Nina Ross Functional Medicine",
    description:
      "How Nina Ross Hair Therapy, LTD may use and disclose your protected health information, and your rights over your medical record under federal health privacy law.",
    canonical: "/notice-of-privacy-practices",
  },
  {
    title: "Notice of Privacy Practices",
    titleClamp: "clamp(32px, 5vw, 56px)",
    deck: "This notice describes how medical information about you may be used and disclosed and how you can get access to this information. Please review it carefully.",
    deckVariant: "hipaa",
    effective: "July 31, 2026",
    orgLine: "Nina Ross Hair Therapy, LTD",
  },
  {
    heading: "Privacy Officer",
    lines: [
      "Nina Ross Hair Therapy, LTD",
      "d/b/a Nina Ross Functional Medicine",
      "Atlanta, Georgia",
    ],
    email: "info@ninarossfm.com",
    note: "You may request a paper copy of this notice at any time, even if you agreed to receive it electronically. Ask at the front desk or write to us and we will send one.",
    links: [
      { href: "/privacy", label: "Privacy Policy", variant: "ghost" },
      { href: "/terms", label: "Terms of Service", variant: "ghost" },
    ],
  },
  extractRaw(
    fs.readFileSync(path.join(dir, "Notice of Privacy Practices.dc.html"), "utf8"),
  ),
);

console.log("done");
