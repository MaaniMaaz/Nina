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
    key: "maria", first: "Maria", name: "Maria R., 52", category: "Energy & thyroid", timeframe: "90 days", src: "/images/patients/maria.png",
    heroLead: "How Maria got", heroEmph: "back to herself.",
    intake: "Maria came in exhausted, foggy, and slowly gaining weight despite eating well. For years she was told her labs looked normal and this was simply what her fifties would feel like.",
    symptoms: ["Bone-deep fatigue", "Brain fog", "Stubborn weight", "Poor sleep"],
    drNotes: "Her story pointed straight at an underactive thyroid and a stress system stuck on. Standard panels missed it because they stop at \u201Cnot diseased.\u201D We read deeper, against optimal.",
    actions: ["Ran a full thyroid, stress-hormone, and nutrient panel", "Restored thyroid balance to an optimal range", "Replenished depleted vitamin D and iron", "Rebuilt her plate and her sleep rhythm, step by step"],
    markers: [
      { label: "Thyroid function", to: "Optimal", fromPct: "16%", toPct: "86%" },
      { label: "Vitamin D", to: "Replete", fromPct: "12%", toPct: "82%" },
      { label: "Energy", to: "9/10", fromPct: "20%", toPct: "90%" },
    ],
    quote: "I have my mornings back, and my patience too.",
    videoLen: "2:14", wistia: "4xzybtga02",
  },
  {
    key: "dana", first: "Dana", name: "Dana K., 47", category: "Stress & sleep", timeframe: "5 months", src: "/images/patients/dana.png",
    heroLead: "How Dana finally", heroEmph: "slept again.",
    intake: "Dana was wired but exhausted, waking at 3am most nights and running on caffeine by day. She had been told it was just stress and to slow down.",
    symptoms: ["Broken sleep", "Anxious edge", "Afternoon crashes", "Short fuse"],
    drNotes: "A classic cortisol rhythm flipped upside down, with blood sugar swinging underneath it. Both are invisible on a basic panel, and both respond beautifully once you actually see them.",
    actions: ["Mapped her cortisol rhythm across the day", "Steadied blood sugar with targeted nutrition", "Reset her evening wind-down and light exposure", "Supported the adrenal system back to a normal curve"],
    markers: [
      { label: "Cortisol rhythm", to: "Restored", fromPct: "18%", toPct: "84%" },
      { label: "Blood sugar", to: "Steady", fromPct: "22%", toPct: "88%" },
      { label: "Sleep quality", to: "8/10", fromPct: "15%", toPct: "85%" },
    ],
    quote: "I sleep through the night for the first time in years.",
    videoLen: "1:48",
  },
  {
    key: "lauren", first: "Lauren", name: "Lauren T., 39", category: "Gut & mood", timeframe: "4 months", src: "/images/patients/lauren.webp",
    heroLead: "How Lauren got", heroEmph: "light and clear.",
    intake: "Lauren ate carefully yet felt bloated after every meal, with a low mood and energy she could not explain. Three doctors had called everything normal.",
    symptoms: ["Daily bloating", "Low mood", "Food reactions", "Fatigue"],
    drNotes: "Clean eating was still feeding an inflamed, imbalanced gut, and her gut was quietly steering her mood. We worked the root rather than adding another elimination diet.",
    actions: ["Assessed gut function and hidden inflammation", "Rebalanced the microbiome at the source", "Calmed inflammation with food and targeted support", "Reintroduced foods on a plan built for her"],
    markers: [
      { label: "Gut inflammation", to: "Calmed", fromPct: "14%", toPct: "83%" },
      { label: "Microbiome", to: "Restored", fromPct: "20%", toPct: "86%" },
      { label: "Mood", to: "9/10", fromPct: "24%", toPct: "90%" },
    ],
    quote: "The bloating is gone, and honestly so is the cloud I was under.",
    videoLen: "2:32",
  },
  {
    key: "marcus", first: "Marcus", name: "Marcus B., 58", category: "Metabolic & heart", timeframe: "6 months", src: "/images/patients/marcus.jpg",
    heroLead: "How Marcus got", heroEmph: "off the edge.",
    intake: "Marcus was told he was pre-diabetic with rising blood pressure and that medication was the only road ahead. He wanted to know why it was happening first.",
    symptoms: ["Rising blood sugar", "High blood pressure", "Belly weight", "Low stamina"],
    drNotes: "His numbers were a story about insulin and inflammation, not willpower. Treat the root and the blood sugar, the pressure, and the weight tend to move together.",
    actions: ["Ran a deep metabolic and cardiovascular panel", "Reversed insulin resistance with food and movement", "Targeted the inflammation driving his pressure", "Tracked his numbers monthly so he could see it work"],
    markers: [
      { label: "Blood sugar (A1c)", to: "Normal", fromPct: "20%", toPct: "85%" },
      { label: "Blood pressure", to: "Healthy", fromPct: "18%", toPct: "84%" },
      { label: "Waist (inches)", to: "-4 in", fromPct: "24%", toPct: "82%" },
    ],
    quote: "My numbers are the best they have been in a decade, no daily pills.",
    videoLen: "2:40",
  },
  {
    key: "priya", first: "Priya", name: "Priya N., 44", category: "Autoimmune & energy", timeframe: "7 months", src: "/images/patients/priya.png",
    heroLead: "How Priya", heroEmph: "calmed the flare.",
    intake: "Priya bounced between specialists for joint pain, fatigue, and flares that no one could connect. Each visit treated a symptom, never the whole.",
    symptoms: ["Joint pain", "Unpredictable flares", "Deep fatigue", "Skin issues"],
    drNotes: "Her immune system was reacting to a gut and stress picture no single specialist had looked at together. We connected the dots and cooled the whole system down.",
    actions: ["Ran a full autoimmune and inflammatory panel", "Healed the gut triggers feeding the flares", "Calmed inflammation with food and key nutrients", "Built a flare-prevention routine she could keep"],
    markers: [
      { label: "Inflammation", to: "Low", fromPct: "16%", toPct: "86%" },
      { label: "Antibody levels", to: "Improved", fromPct: "22%", toPct: "80%" },
      { label: "Energy", to: "8/10", fromPct: "18%", toPct: "88%" },
    ],
    quote: "I finally feel like someone looked at the whole me, not just one part.",
    videoLen: "2:05",
  },
  {
    key: "james", first: "James", name: "James W., 41", category: "Hormones & drive", timeframe: "5 months", src: "/images/patients/james.jpg",
    heroLead: "How James got", heroEmph: "his drive back.",
    intake: "James felt flat, unmotivated, and soft in the middle despite training hard. He assumed it was just turning forty and pushed through.",
    symptoms: ["No motivation", "Low strength", "Poor recovery", "Brain fog"],
    drNotes: "His testosterone and thyroid were both running low-normal, and his sleep was wrecking recovery. Optimized, not just normalized, the whole engine came back.",
    actions: ["Ran full hormone, thyroid, and recovery markers", "Restored testosterone and thyroid to optimal", "Fixed the sleep that was blocking recovery", "Dialed in training nutrition around his goals"],
    markers: [
      { label: "Testosterone", to: "Optimal", fromPct: "18%", toPct: "86%" },
      { label: "Thyroid function", to: "Optimal", fromPct: "20%", toPct: "84%" },
      { label: "Recovery", to: "9/10", fromPct: "22%", toPct: "90%" },
    ],
    quote: "I have not felt this strong and sharp since my twenties.",
    videoLen: "2:18",
  },
  {
    key: "sophia", first: "Sophia", name: "Sophia L., 34", category: "Fertility & hormones", timeframe: "8 months", src: "/images/patients/sophia.png",
    heroLead: "How Sophia", heroEmph: "found her rhythm.",
    intake: "Sophia had irregular cycles and was quietly worried about her fertility, but every test came back as a shrug and a wait-and-see.",
    symptoms: ["Irregular cycles", "Hormonal acne", "Mood swings", "Fatigue"],
    drNotes: "Her hormones were out of sync in a pattern that is very workable once you actually map it. We rebalanced the whole cycle rather than chasing one number.",
    actions: ["Mapped her full hormone picture across a cycle", "Rebalanced the hormones steering her cycle", "Supported blood sugar and nutrients that drive ovulation", "Tracked progress cycle over cycle"],
    markers: [
      { label: "Cycle regularity", to: "Restored", fromPct: "16%", toPct: "88%" },
      { label: "Hormone balance", to: "Optimal", fromPct: "20%", toPct: "85%" },
      { label: "Energy", to: "9/10", fromPct: "22%", toPct: "89%" },
    ],
    quote: "My cycles are regular and I finally feel hopeful about what is next.",
    videoLen: "2:22",
  },
  {
    key: "david", first: "David", name: "David R., 63", category: "Energy & longevity", timeframe: "6 months", src: "/images/patients/david.png",
    heroLead: "How David got", heroEmph: "his years back.",
    intake: "David felt himself slowing down and accepted it as aging, but he wanted more good years with his grandkids than the way he felt would allow.",
    symptoms: ["Flagging energy", "Stiff joints", "Poor sleep", "Memory slips"],
    drNotes: "Aging is not a diagnosis. Underneath his fatigue were a sluggish thyroid, low nutrients, and inflammation, each one fixable, together transformative.",
    actions: ["Ran a comprehensive longevity and nutrient panel", "Restored thyroid and replenished what was low", "Lowered the inflammation aging him faster", "Built daily habits for energy and sharpness"],
    markers: [
      { label: "Inflammation", to: "Low", fromPct: "18%", toPct: "85%" },
      { label: "Thyroid function", to: "Optimal", fromPct: "20%", toPct: "86%" },
      { label: "Energy", to: "9/10", fromPct: "16%", toPct: "90%" },
    ],
    quote: "I keep up with my grandkids now. I did not think that was coming back.",
    videoLen: "2:48",
  },
  {
    key: "tasha", first: "Tasha", name: "Tasha M., 29", category: "Gut & skin", timeframe: "4 months", src: "/images/patients/tasha.png",
    heroLead: "How Tasha", heroEmph: "cleared the noise.",
    intake: "Tasha struggled with breakouts, bloating, and energy dips that wrecked her focus at work, and had tried every product and cleanse with no lasting luck.",
    symptoms: ["Persistent breakouts", "Bloating", "Energy dips", "Trouble focusing"],
    drNotes: "Her skin was a window into her gut. Once we calmed the gut and steadied her blood sugar, the skin and the focus followed without another harsh product.",
    actions: ["Assessed gut health and blood sugar together", "Rebalanced the microbiome behind her skin", "Steadied energy with simple nutrition shifts", "Replaced the product cycle with a root-cause plan"],
    markers: [
      { label: "Gut balance", to: "Restored", fromPct: "18%", toPct: "86%" },
      { label: "Skin clarity", to: "Clear", fromPct: "20%", toPct: "88%" },
      { label: "Focus", to: "9/10", fromPct: "22%", toPct: "89%" },
    ],
    quote: "My skin cleared, the bloating stopped, and my head feels quiet again.",
    videoLen: "1:58",
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
