export interface IvBlend {
  key: string;
  name: string;
  for: string;
  items: string[] | null;
}

export interface IvIngredient {
  abbr: string;
  name: string;
  cat: string;
}

export const IV_BLENDS: IvBlend[] = [
  {
    key: "all",
    name: "All options",
    for: "The full shelf, ready to be matched to whatever your labs ask for.",
    items: null,
  },
  {
    key: "hormones",
    name: "Hormones",
    for: "For the cycles, the crashes, and the labs that came back “normal” while you did not feel it.",
    items: ["Mg", "B6", "Zn", "Se"],
  },
  {
    key: "migraines",
    name: "Migraines",
    for: "For the heads that pound on a schedule nobody else can explain.",
    items: ["Mg", "B", "B6", "Tau"],
  },
  {
    key: "bp",
    name: "Blood Pressure",
    for: "For pressure that creeps up while everything else looks fine on paper.",
    items: ["Mg", "Tau", "Ca", "ALA"],
  },
  {
    key: "brainfog",
    name: "Brain Fog",
    for: "For the word you cannot find and the focus that quietly slipped away.",
    items: ["B12", "NAD", "ALA", "Tau"],
  },
  {
    key: "mood",
    name: "Mood & Anxiety",
    for: "For the wired-but-tired feeling that will not switch off.",
    items: ["Mg", "B6", "Tau", "B12"],
  },
  {
    key: "stress",
    name: "Stress",
    for: "For the always-on, adrenals-running-the-show kind of tired.",
    items: ["Mg", "B5", "B6", "Tau"],
  },
  {
    key: "tension",
    name: "Tension",
    for: "For the shoulders by your ears and the knots that never quite release.",
    items: ["Mg", "Ca", "Tau", "B6"],
  },
  {
    key: "autoimmune",
    name: "Autoimmune",
    for: "For a system stuck in attack mode that needs to be calmed, not just quieted.",
    items: ["GSH", "Se", "Zn", "C"],
  },
  {
    key: "cholesterol",
    name: "Cholesterol",
    for: "For the numbers your doctor flagged but never really explained.",
    items: ["ALA", "Car", "NAC", "B"],
  },
  {
    key: "hairloss",
    name: "Hair Loss",
    for: "For the strands in the drain and the part that keeps getting wider.",
    items: ["Zn", "B", "NAC", "AA"],
  },
  {
    key: "immune",
    name: "Immune",
    for: "For when your body is fighting something and needs backup, fast.",
    items: ["C", "Zn", "Se", "GSH"],
  },
  {
    key: "energy",
    name: "Energy",
    for: "For the two o’clock crash and the run-on-empty fog.",
    items: ["B", "B12", "NAD", "AA"],
  },
  {
    key: "fatigue",
    name: "Chronic Fatigue",
    for: "For the bone-deep tired that sleep never fixes and labs call “normal.”",
    items: ["B12", "NAD", "Mg", "AA"],
  },
  {
    key: "recovery",
    name: "Recovery",
    for: "For sore, overworked muscles and a nervous system that will not settle.",
    items: ["Mg", "AA", "GSH", "Car"],
  },
  {
    key: "gut",
    name: "Gut Repair",
    for: "For the bloat, the reflux, and a gut that will not absorb what you swallow.",
    items: ["GSH", "AA", "Zn", "NAC"],
  },
  {
    key: "detox",
    name: "Detox & glow",
    for: "For oxidative load, dull skin, and a system that needs a clear-out.",
    items: ["GSH", "C", "ALA", "NAC"],
  },
];

export const IV_INGREDIENTS: IvIngredient[] = [
  { abbr: "C", name: "Vitamin C", cat: "#B5572F" },
  { abbr: "B", name: "B-Complex", cat: "#4a6340" },
  { abbr: "B12", name: "B12", cat: "#4a6340" },
  { abbr: "Mg", name: "Magnesium", cat: "#5a7d8f" },
  { abbr: "Zn", name: "Zinc", cat: "#B5572F" },
  { abbr: "GSH", name: "Glutathione", cat: "#7a5c8f" },
  { abbr: "Ca", name: "Calcium", cat: "#5a7d8f" },
  { abbr: "AA", name: "Amino Acids", cat: "#4a6340" },
  { abbr: "Tau", name: "Taurine", cat: "#4a6340" },
  { abbr: "Se", name: "Selenium", cat: "#B5572F" },
  { abbr: "NAD", name: "NAD+", cat: "#7a5c8f" },
  { abbr: "B5", name: "Vitamin B5", cat: "#4a6340" },
  { abbr: "B6", name: "Vitamin B6", cat: "#4a6340" },
  { abbr: "Car", name: "Carnitine", cat: "#B5572F" },
  { abbr: "ALA", name: "Alpha-Lipoic", cat: "#7a5c8f" },
  { abbr: "NAC", name: "NAC", cat: "#7a5c8f" },
  { abbr: "Lyte", name: "Electrolytes", cat: "#5a7d8f" },
  { abbr: "H2O", name: "Saline", cat: "#5a7d8f" },
];

export const DISPENSARY_STATS = [
  { value: "18", label: "building blocks" },
  { value: "16", label: "targeted blends" },
  { value: "∞", label: "tuned to you" },
] as const;

export const DISPENSARY_FOOTNOTE = "Every blend is physician-ordered off your labs, never picked off a board.";

export const DISPENSARY_INTRO =
  "Most drips chase a hangover or a workout. We build infusions for the deeper stuff, hormones, migraines, blood pressure, mood, and tune every bag to your labs. Pick a target and watch which nutrients it pulls from the same deep shelf.";
