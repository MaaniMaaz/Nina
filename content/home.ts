// Content transcribed verbatim from the DCLogic state machine in
// "Nina Ross FM Homepage - Desktop.dc.html". Only rendered fields are kept;
// a few computed-but-unused fields in the source (systemData, stories(),
// visibleC) were dead code with no corresponding JSX and are not ported.

export interface JournalPrompt {
  label: string;
  turnImage: string;
}

// promptLabels + the turnImgMap keyed by slug(label), merged 1:1.
export const JOURNAL_PROMPTS: JournalPrompt[] = [
  { label: "sleep through the night", turnImage: "/images/turn-sleep.png" },
  { label: "think on my feet", turnImage: "/images/turn-think.png" },
  { label: "make it to 3pm without crashing", turnImage: "/images/turn-3pm.png" },
  { label: "lose the weight", turnImage: "/images/turn-weight.png" },
  { label: "feel like myself", turnImage: "/images/turn-myself.png" },
  { label: "feel steady through perimenopause", turnImage: "/images/turn-perimenopause.png" },
  { label: "stop running on empty", turnImage: "/images/turn-empty.png" },
  { label: "eat without the bloating", turnImage: "/images/turn-eat.png" },
  { label: "quiet the anxiety", turnImage: "/images/turn-anxiety.png" },
  { label: "not worry about my health", turnImage: "/images/turn-worry.png" },
];

export const DEFAULT_TURN_IMAGE = "/images/turn-myself.png";

export interface ProcessStep {
  num: string;
  title: string;
  kicker: string;
  detail: string;
  img?: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    num: "01",
    title: "Listen to the whole story",
    kicker: "The first visit",
    detail:
      "Your first visit is an unhurried half hour where you finally feel heard. Every symptom, every \u201Cnormal\u201D lab, every time you were told you\u2019re fine but knew you weren\u2019t. We map it all before a single test.",
    img: "/images/process-listen.png",
  },
  {
    num: "02",
    title: "Test like we mean it",
    kicker: "Advanced panels",
    detail:
      "We run the advanced panels most offices skip: full thyroid, stress and sex hormones, metabolic, inflammatory, and nutrients. The markers that finally explain how you feel.",
    img: "/images/process-test.png",
  },
  {
    num: "03",
    title: "Read for optimal",
    kicker: "Optimal ranges",
    detail:
      "There is a wide gap between \u201Cnormal\u201D and actually feeling well. We read every result against where you truly thrive, the levels where your body hums.",
    img: "/images/process-optimal.png",
  },
  {
    num: "04",
    title: "Connect the dots out loud",
    kicker: "In plain language",
    detail:
      "We sit down together and walk through what is driving what, in plain language, until your whole picture finally makes sense to you.",
    img: "/images/process-connect.png",
  },
  {
    num: "05",
    title: "Build the plan",
    kicker: "Made for your life",
    detail:
      "A plan shaped around your real life: food, the right supplements, and the few changes that actually move the needle, built for you and only you.",
    img: "/images/process-build-plan.png",
  },
  {
    num: "06",
    title: "Keep score",
    kicker: "Re-test & track",
    detail:
      "We re-test and track over time, so your progress shows up in black and white, real proof on the page you can point to.",
    img: "/images/process-score.png",
  },
];

export interface ToolkitItem {
  num: string;
  name: string;
  dose: string;
  desc: string;
  /** Landscape crop for the mobile preview card. */
  imageMobile?: string;
  /** Portrait crop for the desktop preview card. */
  imageDesktop?: string;
}

export const TOOLKIT_ITEMS: ToolkitItem[] = [
  {
    num: "01",
    name: "Deep-dive panel",
    dose: "150+ markers",
    desc: "Finally see the full story behind how you feel, so nothing keeps getting missed.",
    imageMobile: "/images/toolkit/mobile/deep-dive-panel.png",
    imageDesktop: "/images/toolkit/desktop/deep-dive-panel.png",
  },
  {
    num: "02",
    name: "IV therapy",
    dose: "as indicated",
    desc: "Feel the lift sooner, with nutrients sent straight to where your body needs them.",
    imageMobile: "/images/toolkit/mobile/iv-therapy.png",
    imageDesktop: "/images/toolkit/desktop/iv-therapy.png",
  },
  {
    num: "03",
    name: "Injectables",
    dose: "targeted",
    desc: "A quick, targeted boost for the days you need your energy and focus back.",
    imageMobile: "/images/toolkit/mobile/injectables.png",
    imageDesktop: "/images/toolkit/desktop/injectables.png",
  },
  {
    num: "04",
    name: "Hormone restoration",
    dose: "to optimal",
    desc: "Feel like yourself again as your body settles into its real balance.",
    imageMobile: "/images/toolkit/mobile/hormone-restoration.png",
    imageDesktop: "/images/toolkit/desktop/hormone-restoration.png",
  },
  {
    num: "05",
    name: "Supplementation",
    dose: "lab-matched",
    desc: "Only what your body is actually missing, so every dose earns its place.",
    imageMobile: "/images/toolkit/mobile/supplementation.png",
    imageDesktop: "/images/toolkit/desktop/supplementation.png",
  },
  {
    num: "06",
    name: "Nutrition",
    dose: "daily",
    desc: "Eat in a way that fits your life and finally gives you steady energy.",
    imageMobile: "/images/toolkit/mobile/nutrition.png",
    imageDesktop: "/images/toolkit/desktop/nutrition.png",
  },
  {
    num: "07",
    name: "Lifestyle",
    dose: "ongoing",
    desc: "Small, doable changes that help you sleep deeper and carry less stress.",
    imageMobile: "/images/toolkit/mobile/lifestyle.png",
    imageDesktop: "/images/toolkit/desktop/lifestyle.png",
  },
  {
    num: "08",
    name: "Coaching",
    dose: "continuous",
    desc: "Someone in your corner every week, so you never figure it out alone.",
    imageMobile: "/images/toolkit/mobile/coaching.png",
    imageDesktop: "/images/toolkit/desktop/coaching.png",
  },
  {
    num: "09",
    name: "Re-testing",
    dose: "scheduled",
    desc: "Watch your progress in black and white, proof that you\u2019re truly getting better.",
    imageMobile: "/images/toolkit/mobile/re-testing.png",
    imageDesktop: "/images/toolkit/desktop/re-testing.png",
  },
];

export interface PlanLength {
  months: string;
  tag: string;
  who: string;
}

export const PLAN_LENGTHS: PlanLength[] = [
  { months: "3", tag: "A focused reset", who: "One clear root cause, caught early." },
  { months: "6", tag: "Find your footing", who: "The most common starting point." },
  { months: "12", tag: "Full restoration", who: "Complex, multi-system stories." },
];

export const PLAN_COVERAGE: string[] = [
  "Your physician and care team",
  "The complete toolkit, used as you need it",
  "Coaching and regular check-ins",
  "Plan adjustments anytime",
  "Re-testing and progress tracking",
  "Message us between visits",
];

export interface PatientCase {
  key: string;
  first: string;
  name: string;
  category: string;
  timeframe: string;
  src: string;
  heroLead: string;
  heroEmph: string;
  intake: string;
  symptoms: string[];
  drNotes: string;
  actions: string[];
  markers: { label: string; to: string; fromPct: string; toPct: string }[];
  quote: string;
  videoLen: string;
  wistia?: string;
}

export const PATIENT_CASES: PatientCase[] = [
  {
    key: "cassandra",
    first: "Cassandra",
    name: "Cassandra T., 49",
    category: "Hormones & migraines",
    timeframe: "60 days to balanced",
    src: "/images/patients/cassandra.jpg",
    heroLead: "How Cassandra got",
    heroEmph: "30 days back a month.",
    intake:
      "Cassandra was having migraines 30 out of 31 days a month. She'd tried every medication her neurologist could prescribe \u2014 some worked for a moment, then stopped. After a partial hysterectomy in her 30s, her hormones had never been balanced, and by 49 she was waking up to brain fog, cold sweats, hot sweats, weight gain, and hair loss. She was exhausted by her own body.",
    symptoms: ["Daily migraines", "Brain fog", "Hot & cold sweats", "Weight gain"],
    drNotes:
      "Her migraines weren't just neurological \u2014 they were hormonal. The partial hysterectomy decades earlier left her system without a functioning hormone baseline, and every symptom traced back to that gap. Standard panels never connected the dots. We needed to work alongside her neurologist, not replace him.",
    actions: [
      "Ran comprehensive hormone panel to map the imbalance",
      "Balanced hormones disrupted by partial hysterectomy",
      "Coordinated care alongside her existing neurologist",
      "Addressed secondary symptoms: alopecia, weight, and energy",
    ],
    markers: [
      { label: "Migraines/mo", to: "4\u20135/mo (from 30/month)", fromPct: "18%", toPct: "82%" },
      { label: "Hormones", to: "Balanced", fromPct: "16%", toPct: "86%" },
      { label: "Quality of life", to: "Restored", fromPct: "20%", toPct: "88%" },
    ],
    quote:
      "I am the migrainer who was having a headache 30 days a month. Since Dr. Nina has been treating me, I truly have a migraine four to five times a month. My neurologist is taken aback.",
    videoLen: "2:14",
    wistia: "emd0n8jm64",
  },
  {
    key: "chastity",
    first: "Chastity",
    name: "Chastity V.",
    category: "Fatigue & nutrients",
    timeframe: "60 days to clarity",
    src: "/images/patients/chastity.jpg",
    heroLead: "How Chastity stopped",
    heroEmph: "running on empty.",
    intake:
      "Chastity had lost weight and thought she was healthy \u2014 but she couldn't understand why she was still exhausted all the time. Simple tasks took hours. She was drinking four or five cups of coffee just to survive the day, and everything anyone said to her felt like a personal attack. When her labs came back, they told a completely different story than the mirror.",
    symptoms: ["Bone-deep fatigue", "Brain fog", "Emotional reactivity", "Low concentration"],
    drNotes:
      "Weight loss had masked what her labs were screaming: crashed vitamin D, depleted B vitamins, and hormones nowhere near optimal. Her body was running on fumes \u2014 she just couldn't see it because she looked fine on the outside. The emotional reactivity wasn't a personality flaw. It was a nutrient deficit.",
    actions: [
      "Ran full nutrient and hormone panel despite \"healthy\" appearance",
      "Started vitamin D injection protocol to restore levels",
      "Replenished B vitamins through targeted injection therapy",
      "Added fat burner and GLP-1 to support body composition",
    ],
    markers: [
      { label: "Vitamin D", to: "Replete", fromPct: "12%", toPct: "84%" },
      { label: "B Vitamins", to: "Optimal", fromPct: "16%", toPct: "86%" },
      { label: "Energy", to: "9/10", fromPct: "20%", toPct: "90%" },
    ],
    quote: "I have way more energy. I can get so many more things done. Coffee is a second thought to me now.",
    videoLen: "2:59",
    wistia: "l1fedryuv5",
  },
  {
    key: "april",
    first: "April",
    name: "April T.",
    category: "Inflammation & weight",
    timeframe: "90 days to resolution",
    src: "/images/patients/april.jpg",
    heroLead: "How April's body finally",
    heroEmph: "stopped fighting itself.",
    intake:
      "April had spent years doing everything right \u2014 extreme workouts, heavy lifting, strict diets, an hour of intense cardio followed by another hour of training. But no matter how hard she pushed, the weight wouldn't move. Her joints ached constantly, her muscles stayed tight, and no one could explain why. Turns out, her discipline was the problem.",
    symptoms: ["Stubborn weight", "Joint pain", "Chronic inflammation", "Water retention"],
    drNotes:
      "Years of extreme exercise had thrown her body into a permanent fight-or-flight state. Her cortisol was spiking constantly, driving systemic chronic inflammation. Standard panels missed it because they stop at \"normal.\" Her weight wasn't a discipline problem \u2014 it was an inflammation problem.",
    actions: [
      "Identified systemic chronic inflammation through functional labs",
      "Addressed elevated cortisol levels driving the stress response",
      "Switched hydration protocol to support inflammation clearance",
      "Reduced water retention while rebuilding metabolic balance",
    ],
    markers: [
      { label: "Cortisol", to: "Balanced", fromPct: "18%", toPct: "84%" },
      { label: "Inflammation", to: "Resolving", fromPct: "16%", toPct: "82%" },
      { label: "Body comp", to: "Smaller", fromPct: "22%", toPct: "86%" },
    ],
    quote:
      "No matter how hard I worked out, no matter how strict my diet was, I wasn't losing any weight. Now I am significantly smaller.",
    videoLen: "1:53",
    wistia: "18puz2l6lg",
  },
  {
    key: "gertrude",
    first: "Gertrude",
    name: "Gertrude W., 56",
    category: "Energy & vitality",
    timeframe: "180 days to restored",
    src: "/images/patients/gertrude.jpg",
    heroLead: "How Gertrude found herself",
    heroEmph: "again in six months.",
    intake:
      "Gertrude was in chaos. Her mother was in the hospital with dementia, stress was consuming her, and her own health was falling apart under the weight of caregiving. She started in July barely holding it together. By December, her friends and family were asking what had changed \u2014 not just her energy, but the way she carried herself.",
    symptoms: ["Low energy", "Stress overload", "Nutrient depletion", "Emotional exhaustion"],
    drNotes:
      "Years of caregiving stress had depleted her faster than her body could recover. She was burning through nutrients, running on cortisol, and nobody was asking why. She didn't need a prescription \u2014 she needed someone who would listen to every version of how she felt, adjust when something didn't work, and stay with it.",
    actions: [
      "Ran comprehensive labs targeting stress-related depletion",
      "Built a personalized supplement protocol, adjusted iteratively",
      "Pivoted when initial approaches didn't land \u2014 never stopped trying",
      "Restored energy and vitality within six months",
    ],
    markers: [
      { label: "Energy", to: "Restored", fromPct: "16%", toPct: "86%" },
      { label: "Nutrients", to: "Replete", fromPct: "18%", toPct: "84%" },
      { label: "Vitality", to: "Renewed", fromPct: "20%", toPct: "88%" },
    ],
    quote:
      "Who would have thought between July and December we'd have figured it out? She never stopped trying until she figured it out.",
    videoLen: "2:36",
    wistia: "a8bgujvwg0",
  },
  {
    key: "melodie",
    first: "Melodie",
    name: "Melodie W.",
    category: "Cholesterol & heart health",
    timeframe: "90 days to optimal",
    src: "/images/patients/melodie.png",
    heroLead: "How Melodie's numbers finally",
    heroEmph: "told the truth.",
    intake:
      "Melodie had been battling cholesterol for years. Standard advice wasn't moving the needle, and her LDL was stuck at 171 \u2014 high enough to worry about, stubborn enough to feel helpless about. She needed something more targeted than \"eat better and exercise.\"",
    symptoms: ["High LDL cholesterol", "Cardiovascular concern", "Stalled progress"],
    drNotes:
      "Her cholesterol wasn't responding to conventional advice because the root drivers were nutritional gaps, not just dietary choices. Targeted supplementation could address what lifestyle changes alone couldn't reach \u2014 and the numbers would tell us if it was working.",
    actions: [
      "Ran comprehensive lipid and nutrient panel",
      "Designed a targeted supplement protocol for cholesterol",
      "Monitored LDL response throughout the program",
      "Achieved significant reduction through supplementation alone",
    ],
    markers: [
      { label: "LDL cholesterol", to: "138 (down from 171)", fromPct: "20%", toPct: "78%" },
      { label: "Cardiovascular risk", to: "Reduced", fromPct: "18%", toPct: "84%" },
      { label: "Supplement response", to: "Strong", fromPct: "22%", toPct: "88%" },
    ],
    quote: "My LDL went from 171 down to 138 just from taking the supplements. I'm so excited, so joyful.",
    videoLen: "0:43",
    wistia: "be8aikn1vf",
  },
  {
    key: "vivinee",
    first: "Vivinee",
    name: "Vivinee J., 83",
    category: "Vitality & aging",
    timeframe: "90 days to renewed",
    src: "/images/patients/vivinee.jpg",
    heroLead: "How Vivinee's youth got",
    heroEmph: "renewed at 83.",
    intake:
      "At 83, Vivinee wasn't willing to accept that aging meant giving in. She came looking for a way to hold onto her strength and energy \u2014 and found a partner who helped her rebuild from the inside, tweaking her diet, layering in the right supplements, and restoring what time had quietly taken.",
    symptoms: ["Age-related fatigue", "Strength decline", "Nutrient gaps"],
    drNotes:
      "Age doesn't mean accepting decline. Her body still responded to the right inputs \u2014 adjusted nutrition, targeted supplementation, consistent monitoring. The goal was never to fight aging. It was to age optimally, on her terms.",
    actions: [
      "Assessed baseline nutrition and energy markers",
      "Tweaked her diet to support age-appropriate metabolic needs",
      "Built a targeted supplement protocol",
      "Restored strength and renewed day-to-day energy",
    ],
    markers: [
      { label: "Strength", to: "Restored", fromPct: "18%", toPct: "84%" },
      { label: "Energy", to: "Renewed", fromPct: "16%", toPct: "86%" },
      { label: "Nutrition", to: "Optimized", fromPct: "20%", toPct: "88%" },
    ],
    quote: "I feel like my youth is being renewed.",
    videoLen: "0:39",
    wistia: "zcbcgah9i9",
  },
];

export type LearnKind = "video" | "qa" | "article";

export interface LearnItem {
  kind: LearnKind;
  key: string;
  topic: string;
  title: string;
  answer?: string;
  readMin?: string;
  watchMin?: string;
  audioLen?: string;
}

export const LEARN_TOPICS = ["About Us", "Approach", "Hormones", "Gut", "Energy", "Thyroid"] as const;

export const LEARN_ITEMS: LearnItem[] = [
  { kind: "video", key: "ab1", topic: "About Us", title: "Meet Dr. Nina Ross", watchMin: "3:20" },
  { kind: "qa", key: "ab2", topic: "About Us", title: "What makes Nina Ross different?", answer: "We treat you, not the average. That means unhurried visits, advanced testing, and a plan built around your real life, with a whole team walking it with you.", readMin: "3 min", audioLen: "1:40" },
  { kind: "article", key: "ab3", topic: "About Us", title: "Our story, and why we practice this way", readMin: "4 min" },
  { kind: "qa", key: "q1", topic: "Testing", title: "Why are my labs \u201Cnormal\u201D but I feel awful?", answer: "Standard labs flag disease, not how well you function. We read your results against optimal ranges, where your body actually thrives, so the things you feel finally show up on paper.", readMin: "5 min", watchMin: "6:12", audioLen: "2:10" },
  { kind: "video", key: "v1", topic: "Energy", title: "Why you crash at 3pm, and the fix", watchMin: "5:48" },
  { kind: "article", key: "a1", topic: "Thyroid", title: "The 5 thyroid markers most labs skip", readMin: "6 min" },
  { kind: "qa", key: "q2", topic: "Hormones", title: "Is this just perimenopause, or something more?", answer: "Often it is both. Hormone shifts get blamed for everything while a thyroid or nutrient issue hides underneath. We read the full panel so nothing gets waved off.", readMin: "7 min", watchMin: "9:02" },
  { kind: "article", key: "a2", topic: "Gut", title: "The gut-brain conversation, explained", readMin: "6 min" },
  { kind: "video", key: "v2", topic: "Hormones", title: "Cortisol: your stress thermostat", watchMin: "8:24" },
  { kind: "qa", key: "q3", topic: "Gut", title: "Can gut health really affect my mood?", answer: "Yes. Your gut is in constant conversation with your brain and immune system. Calm it at the root and mood, focus, and sleep often settle with it.", readMin: "6 min", watchMin: "7:30" },
  { kind: "article", key: "a3", topic: "Energy", title: "A day of eating for steady energy", readMin: "4 min" },
  { kind: "qa", key: "q4", topic: "Approach", title: "How is functional medicine different from my doctor?", answer: "We are not chasing the loudest symptom with a prescription. We map the whole picture, find the root cause, and build a plan that brings you back to yourself.", readMin: "5 min", watchMin: "8:24" },
  { kind: "video", key: "v3", topic: "Approach", title: "A day in the life of a Nina Ross patient", watchMin: "7:15" },
  { kind: "article", key: "a4", topic: "Approach", title: "What \u201Croot cause\u201D actually means", readMin: "5 min" },
  { kind: "qa", key: "q5", topic: "Approach", title: "Do you work with my regular doctor?", answer: "Gladly. We are a complement, not a replacement. We share findings and coordinate so your whole care team is rowing in the same direction.", readMin: "3 min", audioLen: "1:35" },
  { kind: "qa", key: "q6", topic: "Approach", title: "Is this covered by insurance?", answer: "Most visits are self-pay, and we keep pricing transparent from day one. Many labs can run through insurance, and we will always tell you what to expect before anything is ordered.", readMin: "4 min", audioLen: "2:48" },
  { kind: "article", key: "a5", topic: "Approach", title: "What to expect at your first $99 consult", readMin: "4 min" },
  { kind: "qa", key: "q7", topic: "Approach", title: "How soon will I actually feel better?", answer: "Many people feel a first shift within weeks, but real reversal follows your body, not a calendar. On day one we map an honest timeline so you always know where you stand.", readMin: "5 min", watchMin: "6:05", audioLen: "1:52" },
  { kind: "video", key: "v4", topic: "Testing", title: "Reading a lab panel for optimal, not normal", watchMin: "6:40" },
  { kind: "article", key: "a6", topic: "Hormones", title: "Perimenopause: the shifts no one warns you about", readMin: "8 min" },
  { kind: "qa", key: "q8", topic: "Gut", title: "Why does bloating happen even when I eat clean?", answer: "Clean food can still feed the wrong bacteria or hit a gut that is inflamed. We look at what is underneath, so the fix is targeted instead of another elimination diet.", readMin: "5 min", watchMin: "5:55" },
  { kind: "video", key: "v5", topic: "Energy", title: "The supplements that actually move the needle", watchMin: "9:10" },
];
