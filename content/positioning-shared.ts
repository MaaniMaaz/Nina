export interface WhoIHelpCondition {
  key: string;
  label: string;
  href: string;
  cta: string;
  heading: string;
  blurb: string;
}

export interface FamiliarCard {
  icon: "slash" | "clock" | "x" | "pencil" | "chart" | "heart";
  title: string;
}

export const FAMILIAR_CARDS: FamiliarCard[] = [
  { icon: "slash", title: "“Your labs are normal” while you feel anything but" },
  { icon: "clock", title: "Rushed out the door in fifteen minutes" },
  { icon: "x", title: "Concerns waved off as stress or weight" },
  { icon: "pencil", title: "Switching doctors, hoping someone listens" },
  { icon: "chart", title: "Treated as a chart number, not a person" },
  { icon: "heart", title: "Wanting a doctor who simply gets it" },
];

export const WHO_I_HELP_CONDITIONS: WhoIHelpCondition[] = [
  {
    key: "pcos",
    label: "PCOS",
    href: "/conditions/pcos",
    cta: "Get to the root of my PCOS",
    heading: "Treating the drivers under your PCOS, not just the symptoms",
    blurb:
      "Instead of only managing symptoms with the pill, we look at the insulin, hormone, and inflammation drivers underneath your PCOS. With advanced labs and a plan built for your body, we work to bring back steadier cycles, calmer skin, and energy you can rely on, from the root.",
  },
  {
    key: "gut-health",
    label: "Gut & Digestion",
    href: "/conditions/gut-health",
    cta: "Calm my gut for good",
    heading: "Calming the gut so food feels good again",
    blurb:
      "Bloating, reflux, and irregularity are signals, not just nuisances. We test what is actually happening in your gut, calm the inflammation, and rebuild your digestion, so meals stop being a gamble and the rest of your body follows.",
  },
  {
    key: "chronic-fatigue",
    label: "Chronic Fatigue",
    href: "/conditions/chronic-fatigue",
    cta: "Get my energy back",
    heading: "When your labs are “normal” but you are running on empty",
    blurb:
      "I read your labs against optimal ranges, not just disease cutoffs, and look at thyroid, adrenals, nutrients, and sleep together. The goal is real, lasting energy back in your days, not another shrug and a refill.",
  },
  {
    key: "hormone-imbalance",
    label: "Hormones",
    href: "/conditions/hormone-imbalance",
    cta: "Rebalance my hormones",
    heading: "Bringing your hormones back toward balance",
    blurb:
      "Mood swings, weight that will not move, low drive. We map how your hormones actually connect and gently guide them back toward balance, so you feel like yourself again instead of a stranger in your own body.",
  },
  {
    key: "hair-loss",
    label: "Hair Loss",
    href: "/conditions/hair-loss",
    cta: "Find what is causing my hair loss",
    heading: "Finding what is really behind your thinning hair",
    blurb:
      "Thinning hair is usually a downstream sign of thyroid, iron, hormones, or stress. We find which one is driving yours and treat that root cause, so your hair finally has the conditions it needs to recover.",
  },
  {
    key: "menopause",
    label: "Menopause",
    href: "/conditions/menopause",
    cta: "Feel steady through menopause",
    heading: "This transition does not have to mean years of feeling unwell",
    blurb:
      "We address the hormone, metabolic, and sleep shifts of perimenopause and menopause with care that respects both your science and your story, so you move through this chapter feeling steady and supported.",
  },
];
