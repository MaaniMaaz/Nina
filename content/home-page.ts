/**
 * Homepage CMS content defaults — mirrors the live landing page copy.
 * Layout stays in components; only these strings/images/stories are editable.
 */

import {
  JOURNAL_PROMPTS,
  PROCESS_STEPS,
  TOOLKIT_ITEMS,
  PLAN_LENGTHS,
  PLAN_COVERAGE,
  PATIENT_CASES,
  LEARN_ITEMS,
  LEARN_TOPICS,
  type JournalPrompt,
  type ProcessStep,
  type ToolkitItem,
  type PlanLength,
  type PatientCase,
  type LearnItem,
} from "@/content/home";

export type PatientStory = {
  key: string;
  first: string;
  name: string;
  category: string;
  timeframe: string;
  /** Portrait URL (Cloudinary or /images/...). */
  imageUrl: string;
  heroLead: string;
  heroEmph: string;
  intake: string;
  symptoms: string[];
  drNotes: string;
  actions: string[];
  markers: { label: string; to: string; fromPct: string; toPct: string }[];
  quote: string;
  videoLen: string;
  /** Wistia hashed id; empty/omitted = no video player. */
  wistia?: string;
};

export type HomePageContent = {
  kind: "home";
  hero: {
    eyebrowMobile: string;
    eyebrowDesktop: string;
    heading: string;
    subhead: string;
    body: string;
    ctaPrimary: string;
    ctaPrimaryHref: string;
    ctaSecondaryMobile: string;
    ctaSecondaryDesktop: string;
    ctaSecondaryHref: string;
    ratingScore: string;
    ratingMeta: string;
    socialProofMobile: string;
    socialProofDesktop: string;
    tagsMobile: string[];
    tagsDesktop: string[];
    sectionLabel: string;
    verticalBadge: string;
    scrollHint: string;
    promiseLabel: string;
    promiseName: string;
    promiseQuote: string;
  };
  journal: {
    eyebrow: string;
    headingLead: string;
    headingEmph: string;
    body: string;
    cardLabel: string;
    promptPrefix: string;
    promptSuffix: string;
    chipHint: string;
    emptyNudge: string;
    replyEyebrowMobile: string;
    replyEyebrowDesktop: string;
    replySignoff: string;
    prompts: JournalPrompt[];
  };
  turn: {
    eyebrow: string;
    heading: string;
    body: string;
  };
  process: {
    eyebrow: string;
    headingLead: string;
    headingEmph: string;
    bodyMobile: string;
    bodyDesktop: string;
    pickerHint: string;
    attribution: string;
    cta: string;
    steps: ProcessStep[];
  };
  toolkit: {
    eyebrow: string;
    headingLead: string;
    headingEmph: string;
    introMobile: string;
    introDesktop: string;
    exploreHint: string;
    footerNote: string;
    signatureName: string;
    signatureMeta: string;
    items: ToolkitItem[];
  };
  program: {
    eyebrow: string;
    headingLead: string;
    headingEmph: string;
    body: string;
    monthsUnit: string;
    mostCommonBadge: string;
    coverageBadge: string;
    coverageTitleMobile: string;
    coverageTitleDesktop: string;
    timelineStart: string;
    coverageFooter: string;
    physicianNote: string;
    physicianSignoff: string;
    mobileFootnote: string;
    plans: PlanLength[];
    coverage: string[];
  };
  storiesChrome: {
    eyebrow: string;
    headingLead: string;
    headingEmph: string;
    tabs: [string, string, string, string];
    drReadLabel: string;
    attributionName: string;
    attributionCreds: string;
    markersHeading: string;
  };
  /** Variable-length patient reviews — add/remove allowed in CMS. */
  stories: PatientStory[];
  consultation: {
    eyebrow: string;
    headingLead: string;
    headingEmph: string;
    body: string;
    cardTitle: string;
    cardPrice: string;
    cardMeta: string;
    givesLabel: string;
    gives: string[];
    ctaDesktop: string;
    ctaMobile: string;
    ctaHref: string;
    ratingLine: string;
    objectionsLabel: string;
    objections: { q: string; a: string }[];
    closing: string;
  };
  learn: {
    eyebrow: string;
    headingLead: string;
    headingEmph: string;
    body: string;
    searchPlaceholder: string;
    topics: string[];
    items: LearnItem[];
  };
};

export function patientCaseToStory(c: PatientCase): PatientStory {
  return {
    key: c.key,
    first: c.first,
    name: c.name,
    category: c.category,
    timeframe: c.timeframe,
    imageUrl: c.src,
    heroLead: c.heroLead,
    heroEmph: c.heroEmph,
    intake: c.intake,
    symptoms: [...c.symptoms],
    drNotes: c.drNotes,
    actions: [...c.actions],
    markers: c.markers.map((m) => ({ ...m })),
    quote: c.quote,
    videoLen: c.videoLen,
    wistia: c.wistia,
  };
}

export function emptyPatientStory(index: number): PatientStory {
  const key = `story-${Date.now().toString(36)}`;
  return {
    key,
    first: "Patient",
    name: `New patient ${index + 1}`,
    category: "Category",
    timeframe: "90 days to optimal",
    imageUrl: "/images/patients/cassandra.jpg",
    heroLead: "How they got",
    heroEmph: "their life back.",
    intake: "Replace this with their story.",
    symptoms: ["Symptom one", "Symptom two"],
    drNotes: "Replace this with Dr. Nina's clinical read.",
    actions: ["First action", "Second action"],
    markers: [
      { label: "Marker", to: "Improved", fromPct: "20%", toPct: "85%" },
    ],
    quote: "Replace this with their quote.",
    videoLen: "2:00",
    wistia: "",
  };
}

export const DEFAULT_HOME_CONTENT: HomePageContent = {
  kind: "home",
  hero: {
    eyebrowMobile: "Physician-led · Atlanta & virtual",
    eyebrowDesktop: "Physician-led functional medicine in Atlanta · virtual care nationwide",
    heading: "You don't feel like yourself. Let's find out why.",
    subhead: "Your body has been telling the truth.",
    body: "Maybe it started with fatigue, or fog, or weight that won't move. Maybe your sleep fell apart, or your body stopped responding to what always worked. Maybe you haven't gone in yet, or maybe when you did, you heard \"your labs are normal.\" Either way, you know something changed. This is where the real investigation begins.",
    ctaPrimary: "Start with the $99 Consultation",
    ctaPrimaryHref: "/start",
    ctaSecondaryMobile: "Not sure yet? See what standard labs may miss →",
    ctaSecondaryDesktop: "Not sure yet? See what standard labs may be missing →",
    ctaSecondaryHref: "/conditions",
    ratingScore: "4.9",
    ratingMeta: "· 300+ reviews",
    socialProofMobile: "Patients travel for Dr. Nina.",
    socialProofDesktop: "People travel to Atlanta for Dr. Nina.",
    tagsMobile: ["Advanced testing", "Optimal ranges", "Re-test & track"],
    tagsDesktop: [
      "Physician-led",
      "Advanced testing",
      "Optimal ranges",
      "Personalized plans",
      "Re-test & track",
    ],
    sectionLabel: "Where it begins",
    verticalBadge: "Est. Atlanta · Virtual Nationwide",
    scrollHint: "Scroll to begin",
    promiseLabel: "The promise",
    promiseName: "Nina Ross, ND; Ph.D",
    promiseQuote: "The relationship is part of the medicine.",
  },
  journal: {
    eyebrow: "The moment everything changes",
    headingLead: "I used to be able to do this.",
    headingEmph: "Now I can't.",
    body: "You're still functioning. Still showing up, still holding it together. But somewhere quiet, you already know: recovery takes longer, your thinking feels foggier, and sleep comes harder than it used to. And the scariest part runs deeper than the tiredness. It's wondering whether this is just who you are now.",
    cardLabel: "From the journal",
    promptPrefix: "I used to be able to",
    promptSuffix: "Now I can't.",
    chipHint: "Tap one to view more",
    emptyNudge: "Say it plainly. Naming it is where the work begins.",
    replyEyebrowMobile: "We connect the dots",
    replyEyebrowDesktop: "Dr. Nina connects the dots",
    replySignoff: "— Dr. Nina",
    prompts: JOURNAL_PROMPTS.map((p) => ({ ...p })),
  },
  turn: {
    eyebrow: "You said you used to be able to",
    heading: "Now, let's get it back.",
    body: "We go way past naming what slipped. We find out why it happened, and walk you all the way back to feeling like yourself.",
  },
  process: {
    eyebrow: "How we find your why",
    headingLead: "Six steps to",
    headingEmph: "your why.",
    bodyMobile:
      "A real, repeatable method with a purpose behind every step, the same one behind every patient who finally felt like themselves again. Tap a step.",
    bodyDesktop:
      "A real, repeatable method with a purpose behind every step, the same one behind every patient who finally felt like themselves again. Tap through it.",
    pickerHint: "Tap a step",
    attribution: "Dr. Nina Ross",
    cta: "Start with the $99 consultation →",
    steps: PROCESS_STEPS.map((s) => ({ ...s })),
  },
  toolkit: {
    eyebrow: "The Care Plan toolkit",
    headingLead: "Labs are just the",
    headingEmph: "beginning.",
    introMobile:
      "Here, your results are where the real work begins. Your labs open a whole program.",
    introDesktop:
      "Most clinics stop at the results. This is everything we bring to get you well. Hover a line to read the dose.",
    exploreHint: "Scroll to explore · or tap a tool",
    footerNote: "A whole program with you at the center, every step of the way.",
    signatureName: "Nina Ross, ND; Ph.D",
    signatureMeta: "Signed · your physician",
    items: TOOLKIT_ITEMS.map((t) => ({ ...t })),
  },
  program: {
    eyebrow: "How the program works",
    headingLead: "Once you're in,",
    headingEmph: "everything is yours.",
    body: "Join for 3, 6, or 12 months. For every day of it, the whole practice is open to you, your physician, your coach, the full toolkit, as much as you need. We stay in it with you until you feel well.",
    monthsUnit: "months",
    mostCommonBadge: "Most common",
    coverageBadge: "You're in",
    coverageTitleMobile: "for all {months} months",
    coverageTitleDesktop: "Everything below is yours for all {months} months.",
    timelineStart: "Day one",
    coverageFooter: "Start to finish. The whole team, the whole time.",
    physicianNote:
      "However long your road, you never walk it alone. We check in, adjust, and celebrate the wins with you the whole way.",
    physicianSignoff: "— Dr. Nina",
    mobileFootnote:
      "It all starts with the $99 consultation, where we map your program together.",
    plans: PLAN_LENGTHS.map((p) => ({ ...p })),
    coverage: [...PLAN_COVERAGE],
  },
  storiesChrome: {
    eyebrow: "Real patient case studies",
    headingLead: "Real people. Real labs.",
    headingEmph: "Real reversals.",
    tabs: ["The story", "Our read", "What we did", "Hear from them"],
    drReadLabel: "Dr. Nina's read",
    attributionName: "Dr. Nina Ross",
    attributionCreds: "ND · Ph.D",
    markersHeading: "The markers that moved",
  },
  stories: PATIENT_CASES.map(patientCaseToStory),
  consultation: {
    eyebrow: "Your path forward",
    headingLead: "One step to",
    headingEmph: "begin.",
    body: "It starts with one conversation. Sit down with Dr. Nina, tell her the whole story, and leave with a clear sense of what's really going on.",
    cardTitle: "The Consultation",
    cardPrice: "$99",
    cardMeta: "A half hour with our team · Atlanta or virtual",
    givesLabel: "What this half hour gives you",
    gives: [
      "Your full history, heard without rushing",
      "Dr. Nina's first read on what's driving it",
      "A clear picture of what working together looks like",
    ],
    ctaDesktop: "Start with the $99 consultation →",
    ctaMobile: "Start with the $99 consultation",
    ctaHref: "/start",
    ratingLine: "4.9 · 300+ patients · self-pay, transparent from day one",
    objectionsLabel: "Before you book",
    objections: [
      {
        q: "Do I need labs done before the consult?",
        a: "If you have recent labs, bring them and we'll read them together. If you don't, no worries at all — we'll guide you on exactly what to test from here.",
      },
      {
        q: "What if my labs are \"normal\"?",
        a: "That's exactly when this matters most. We read for optimal, not just \"not diseased.\"",
      },
      {
        q: "Do I have to commit to anything?",
        a: "The consult stands on its own. Where you go next is always your call.",
      },
    ],
    closing: "Let's find your why, together.",
  },
  learn: {
    eyebrow: "Learn & answers",
    headingLead: "Start with a",
    headingEmph: "question.",
    body: "Articles, videos, and quick answers, all in one place. Search it, or browse by topic, and pick how you want to learn: read it, listen to it, or watch it.",
    searchPlaceholder: "Search thyroid, gut, insurance…",
    topics: [...LEARN_TOPICS],
    items: LEARN_ITEMS.map((i) => ({ ...i })),
  },
};

export function isHomeContent(content: unknown): content is HomePageContent {
  return (
    !!content &&
    typeof content === "object" &&
    (content as HomePageContent).kind === "home" &&
    Array.isArray((content as HomePageContent).stories)
  );
}
