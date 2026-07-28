export interface ShelfStat {
  value: string;
  label: string;
}

export interface ToolkitConcern {
  key: string;
  name: string;
  for: string;
  tx: string[] | null;
}

export interface ToolkitTreatment {
  key: string;
  name: string;
  cat: string;
  href: string;
}

/** Shared concern → treatment matrix from treatment Care Toolkit dumps. */
export const TOOLKIT_CONCERNS: ToolkitConcern[] = [
  {
    key: "all",
    name: "All concerns",
    for: "Every concern we treat, each matched to the tools that actually fit you.",
    tx: null,
  },
  {
    key: "weightloss",
    name: "Weight Loss",
    for: "For a metabolism that stalled — not a willpower problem.",
    tx: ["glp1", "peptides", "vitamin", "lymphatic", "labs", "iv", "redlight"],
  },
  {
    key: "fatigue",
    name: "Chronic Fatigue",
    for: "For the bone-deep tired that sleep never fixes and labs call “normal.”",
    tx: ["iv", "vitamin", "eboo", "ozone", "hbot", "labs", "gimap", "hormone", "redlight", "peptides"],
  },
  {
    key: "hormones",
    name: "Hormones",
    for: "For the cycles, the crashes, and labs that came back “normal” while you did not feel it.",
    tx: ["dutch", "hormone", "labs", "peptides"],
  },
  {
    key: "gut",
    name: "Gut & Digestion",
    for: "For the bloat, the reflux, and a gut that will not absorb what you swallow.",
    tx: ["gimap", "iv", "ozone", "eboo", "labs", "hbot"],
  },
  {
    key: "hairloss",
    name: "Hair Loss",
    for: "For the strands in the drain and the part that keeps getting wider.",
    tx: ["peptides", "vitamin", "redlight", "hbot", "dutch", "labs"],
  },
  {
    key: "menopause",
    name: "Menopause",
    for: "For the heat, the sleep, and a shift no one prepared you for.",
    tx: ["dutch", "hormone", "labs", "peptides"],
  },
  {
    key: "pcos",
    name: "PCOS",
    for: "For irregular cycles, stubborn weight, and the hormones underneath them.",
    tx: ["glp1", "dutch", "labs", "hormone"],
  },
  {
    key: "mood",
    name: "Mood & Anxiety",
    for: "For the wired-but-tired feeling that will not switch off.",
    tx: ["gimap", "labs", "iv", "hormone", "dutch"],
  },
  {
    key: "diabetes",
    name: "Blood Sugar",
    for: "For blood sugar that needs more than one lever pulled.",
    tx: ["glp1", "eboo", "labs", "ozone", "iv"],
  },
  {
    key: "sexual",
    name: "Sexual Health",
    for: "For libido, drive, and the hormones behind both.",
    tx: ["hormone", "peptides", "dutch"],
  },
  {
    key: "brainfog",
    name: "Brain Fog",
    for: "For the word you cannot find and the focus that quietly slipped.",
    tx: ["iv", "hbot", "labs", "gimap", "redlight", "hormone"],
  },
  {
    key: "inflammation",
    name: "Inflammation",
    for: "For the aches, the swelling, and everything slow to heal.",
    tx: ["redlight", "hbot", "ozone", "eboo", "iv"],
  },
];

export const TOOLKIT_TREATMENTS: ToolkitTreatment[] = [
  { key: "glp1", name: "GLP-1 Injections", cat: "Weight loss", href: "/treatments/glp-1-weight-loss" },
  { key: "iv", name: "IV Therapy", cat: "Infusion", href: "/treatments/iv-therapy" },
  { key: "vitamin", name: "Vitamin Injections", cat: "Injection", href: "/treatments/vitamin-injections" },
  { key: "dutch", name: "DUTCH Test", cat: "Hormone testing", href: "/treatments/dutch-test" },
  { key: "gimap", name: "GI-MAP Test", cat: "Gut testing", href: "/treatments/gi-map-test" },
  { key: "labs", name: "Advanced Labs", cat: "Testing", href: "/treatments/advanced-lab-testing" },
  { key: "peptides", name: "Peptide Therapy", cat: "Peptides", href: "/treatments/peptide-therapy" },
  { key: "hormone", name: "Hormone Restoration", cat: "BHRT", href: "/treatments/hormone-restoration" },
  { key: "eboo", name: "EBOO Therapy", cat: "Blood", href: "/treatments/eboo-therapy" },
  { key: "ozone", name: "Ozone Therapy", cat: "Oxidative", href: "/treatments/ozone-therapy" },
  { key: "hbot", name: "Hyperbaric O₂", cat: "Oxygen", href: "/treatments/hyperbaric-oxygen-therapy" },
  { key: "lymphatic", name: "Lymphatic Drainage", cat: "Detox", href: "/treatments/lymphatic-drainage" },
  { key: "redlight", name: "Red Light Therapy", cat: "Light", href: "/treatments/red-light-therapy" },
];

/** Map treatment page slug → dump pageKey for “You’re here”. */
export const SLUG_TO_TOOLKIT_KEY: Record<string, string> = {
  "advanced-lab-testing": "labs",
  "dutch-test": "dutch",
  "eboo-therapy": "eboo",
  "gi-map-test": "gimap",
  "glp-1-weight-loss": "glp1",
  "hormone-restoration": "hormone",
  "hyperbaric-oxygen-therapy": "hbot",
  "iv-therapy": "iv",
  "lymphatic-drainage": "lymphatic",
  "ozone-therapy": "ozone",
  "peptide-therapy": "peptides",
  "red-light-therapy": "redlight",
  "vitamin-injections": "vitamin",
};

/** Lead phrase for “X is one tool on a deep shelf…” */
export const TOOLKIT_INTRO_LEAD: Record<string, string> = {
  "advanced-lab-testing": "Advanced lab testing",
  "dutch-test": "A DUTCH test",
  "eboo-therapy": "EBOO",
  "gi-map-test": "A GI-MAP test",
  "glp-1-weight-loss": "A GLP-1",
  "hormone-restoration": "Hormone restoration",
  "hyperbaric-oxygen-therapy": "Hyperbaric oxygen",
  "lymphatic-drainage": "Lymphatic drainage",
  "ozone-therapy": "Ozone",
  "peptide-therapy": "A peptide protocol",
  "red-light-therapy": "Red light therapy",
  "vitamin-injections": "A vitamin shot",
};

export const TOOLKIT_INTRO_TAIL =
  " is one tool on a deep shelf. Tap what you are actually dealing with and watch which therapies we might reach for, because the right answer is almost never just one thing.";

export const CARE_TOOLKIT_STATS: [ShelfStat, ShelfStat, ShelfStat] = [
  { value: "13", label: "therapies" },
  { value: "13", label: "concerns" },
  { value: "1", label: "plan for you" },
];

export const CARE_TOOLKIT_FOOTNOTE =
  "Every therapy here is physician-ordered off your labs, and matched to you, never sold off a menu.";
