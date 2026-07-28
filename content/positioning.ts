import type { ContentBlock, FaqItem, LongformPageContent } from "./types";
import { FAMILIAR_CARDS, WHO_I_HELP_CONDITIONS } from "./positioning-shared";

const CARE_STEP_LABELS = ["Discover", "Connect", "Personalize", "Nourish"] as const;
const CARE_STEP_TITLES: Record<(typeof CARE_STEP_LABELS)[number], string> = {
  Discover: "Hear the whole story",
  Connect: "See how the pieces relate",
  Personalize: "Build the plan around you",
  Nourish: "Steady support over time",
};
const CARE_STEP_DESCRIPTIONS: [string, string, string, string] = [
  "An unhurried first visit and advanced labs, so nothing about how you feel gets dismissed.",
  "We map your results together so you finally understand why the symptoms travel as a set.",
  "Nutrition, targeted support, and lifestyle, sequenced to your labs and your real life, not a template.",
  "We adjust as your numbers move, so progress holds and you keep feeling more like yourself.",
];
const SOUNDS_FAMILIAR_PARAGRAPHS = ["You are not difficult, and you are not imagining it. You have just never been given the time."];
const MEET_DR_NINA_PARAGRAPHS = [
  "For years I watched people, so many of them women who looked like me, carry symptoms that no one would slow down to explain. So I built the practice I wished they could walk into. One where you are believed first, investigated thoroughly, and treated as a whole person with a life, not a fifteen minute slot.",
  "When someone finally feels seen, the healing has already begun.",
];
const CREDENTIALS = [
  "Ph.D. in Functional Medicine",
  "Board Certified in Holistic Health, ANMCB",
  "Board Certified Trichologist, WTS",
  "NPI #1164884078 · Atlanta, GA",
];
const BYLINE_NOTE =
  "This page is for education and is not a substitute for individual medical advice. Functional medicine care at Nina Ross is provided alongside, not in place of, your primary and specialty care.";
const START_INTRO = "A half hour with me to hear your story and decide if root-cause care is your next step.";

interface PositioningInput {
  slug: string;
  routePrefix?: string;
  breadcrumbParentLabel?: string;
  breadcrumbParentHref?: string;
  name: string;
  title: string;
  description: string;
  ogImage: string;
  slotPrefix: string;
  breadcrumbLabel: string;
  hero: {
    eyebrow: string;
    heading: string;
    paragraphs: [string, string];
    secondaryLabel: string;
  };
  whySection: {
    eyebrow: string;
    heading: string;
    paragraphs: [string, string];
    callouts: [{ title: string; body: string }, { title: string; body: string }, { title: string; body: string }];
  };
  whatItMeans: {
    eyebrow: string;
    heading: string;
    paragraphs: [string, string];
    callouts: [{ title: string; body: string }, { title: string; body: string }, { title: string; body: string }];
  };
  whoIHelp: { slug: string; title: string; desc: string }[];
  proof: { quote: string; name: string; meta: string };
  faq: FaqItem[];
  physicianName?: string;
}

export function buildPositioning(input: PositioningInput): LongformPageContent {
  const canonical = input.routePrefix
    ? `https://www.ninarossfm.com${input.routePrefix}/${input.slug}`
    : `https://www.ninarossfm.com/${input.slug}`;

  const blocks: ContentBlock[] = [
    {
      type: "iconCardGrid",
      eyebrow: "If this sounds familiar",
      heading: "You have been to doctors. You still do not feel heard.",
      cards: FAMILIAR_CARDS,
      footnote: SOUNDS_FAMILIAR_PARAGRAPHS[0],
    },
    {
      type: "bioBlock",
      eyebrow: "Meet Dr. Nina Ross",
      heading: "The doctor who looks closer and listens longer.",
      paragraphs: MEET_DR_NINA_PARAGRAPHS,
      credentials: CREDENTIALS,
      imageSlotId: `${input.slotPrefix}-portrait`,
    },
    {
      type: "calloutSplit",
      eyebrow: input.whySection.eyebrow,
      heading: input.whySection.heading,
      paragraphs: input.whySection.paragraphs,
      callouts: input.whySection.callouts,
      imageSlotId: `${input.slotPrefix}-culture`,
    },
    {
      type: "bandStatement",
      eyebrow: input.whatItMeans.eyebrow,
      heading: input.whatItMeans.heading,
      paragraphs: input.whatItMeans.paragraphs,
      callouts: input.whatItMeans.callouts,
      imageSlotId: `${input.slotPrefix}-fmd-av`,
    },
    {
      type: "steps",
      eyebrow: "The Care Plan Protocol",
      heading: "How we work together: four steps, built around you",
      steps: CARE_STEP_LABELS.map((label, i) => ({
        label,
        title: CARE_STEP_TITLES[label],
        desc: CARE_STEP_DESCRIPTIONS[i],
      })),
    },
    {
      type: "carePlanToolkit",
      eyebrow: "The Care Plan toolkit",
      heading: "Labs are just the beginning.",
      intro: "Here, your results are where the real work begins. Your labs open a whole program.",
    },
    {
      type: "conditionExplorer",
      eyebrow: "Who I help",
      heading: "Where root-cause care makes the biggest difference",
      pageContextLabel: `${input.name} in Atlanta`,
      conditions: WHO_I_HELP_CONDITIONS,
      footerLink: { href: "/conditions", label: "See all conditions we treat" },
    },
    {
      type: "testimonialBlock",
      eyebrow: "In their words",
      quote: input.proof.quote,
      name: input.proof.name,
      meta: input.proof.meta,
      avatarSlotId: `${input.slotPrefix}-test-av`,
      photoSlotId: `${input.slotPrefix}-test-photo`,
    },
  ];

  return {
    slug: input.slug,
    title: input.title,
    description: input.description,
    canonical,
    hero: {
      eyebrow: input.hero.eyebrow,
      heading: input.hero.heading,
      paragraphs: input.hero.paragraphs,
      ctaLabel: "Book the $99 Symptom Consultation",
      secondaryLabel: input.hero.secondaryLabel,
      secondaryHref: "#holistic",
      imageSlotId: `${input.slotPrefix}-hero`,
      bylineAvatarSlotId: `${input.slotPrefix}-byline-av`,
      breadcrumbLabel: input.breadcrumbLabel,
      breadcrumbParentLabel: input.breadcrumbParentLabel,
      breadcrumbParentHref: input.breadcrumbParentHref,
    },
    blocks,
    faqEyebrow: "Questions people ask us",
    faqHeading: `${input.name}, answered plainly`,
    faq: input.faq,
    startHere: { heading: "The $99 Symptom Consultation", intro: START_INTRO },
    bylineNote: BYLINE_NOTE,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "MedicalWebPage",
          "@id": `${canonical}#webpage`,
          url: canonical,
          name: input.title,
          description: input.description,
          inLanguage: "en-US",
          about: { "@id": "https://www.ninarossfm.com/#physician" },
          reviewedBy: { "@id": "https://www.ninarossfm.com/#physician" },
          lastReviewed: "2026-06-01",
        },
        {
          "@type": "Physician",
          "@id": "https://www.ninarossfm.com/#physician",
          name: "Dr. Nina Ross, ND PhD",
          medicalSpecialty: "FunctionalMedicine",
          identifier: { "@type": "PropertyValue", propertyID: "NPI", value: "1164884078" },
          hasCredential: [
            { "@type": "EducationalOccupationalCredential", credentialCategory: "Ph.D. in Functional Medicine" },
            { "@type": "EducationalOccupationalCredential", credentialCategory: "Board Certified in Holistic Health (ANMCB)" },
            { "@type": "EducationalOccupationalCredential", credentialCategory: "Board Certified Trichologist (WTS)" },
          ],
          address: {
            "@type": "PostalAddress",
            streetAddress: "8735 Dunwoody Place, Ste. O",
            addressLocality: "Atlanta",
            addressRegion: "GA",
            postalCode: "30350",
            addressCountry: "US",
          },
          areaServed: [{ "@type": "City", name: "Atlanta" }, { "@type": "State", name: "Georgia" }],
          telephone: "+1-678-561-4522",
        },
        {
          "@type": "FAQPage",
          mainEntity: input.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: input.breadcrumbParentLabel
            ? [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.ninarossfm.com/" },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: input.breadcrumbParentLabel,
                  item: `https://www.ninarossfm.com${input.breadcrumbParentHref ?? ""}`,
                },
                { "@type": "ListItem", position: 3, name: input.breadcrumbLabel, item: canonical },
              ]
            : [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.ninarossfm.com/" },
                { "@type": "ListItem", position: 2, name: input.breadcrumbLabel, item: canonical },
              ],
        },
      ],
    },
  };
}

const RAW: PositioningInput[] = [
  {
    slug: "functional-medicine-atlanta",
    name: "Functional medicine",
    title: "Functional Medicine in Atlanta | Dr. Nina Ross, ND PhD",
    description:
      "Functional medicine in Atlanta that finds the root cause. Dr. Nina Ross, ND PhD, runs advanced labs and builds a personalized plan, in Atlanta and virtually across Georgia. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/functional-medicine-share.jpg",
    slotPrefix: "fmaD",
    breadcrumbLabel: "Functional Medicine Atlanta",
    hero: {
      eyebrow: "Functional Medicine in Atlanta",
      heading: "Functional medicine in Atlanta that treats the root cause of how you feel.",
      paragraphs: [
        "If you have been managed symptom by symptom, handed another prescription, or told your labs are normal while you still feel unwell, there is a deeper way to look.",
        "I am Dr. Nina Ross, ND PhD. Functional medicine is root-cause medicine. I read your whole system, your hormones, gut, metabolism, and the stress you carry, run advanced labs against optimal ranges, and follow the results until I find what is really driving how you feel. Then I build the plan around your body and your life.",
      ],
      secondaryLabel: "What functional medicine really means →",
    },
    whySection: {
      eyebrow: "Why root-cause",
      heading: "Conventional care manages symptoms. Functional medicine finds the cause.",
      paragraphs: [
        "A fifteen-minute visit rarely has room to ask why. So symptoms get named and medicated one at a time while the thing connecting them goes unexamined. Functional medicine does the opposite: it maps the whole system and treats the driver underneath.",
        "Normal on a lab does not mean optimal, and it does not mean you are not unwell.",
      ],
      callouts: [
        { title: "It asks why, not just what", body: "Instead of naming a symptom and medicating it, we trace it back to the system that produced it." },
        { title: "Labs read for optimal", body: "Advanced panels read against where you actually feel well, not just inside a wide normal range." },
        { title: "A plan, not a prescription", body: "Nutrition, targeted support, and lifestyle, sequenced to your labs and your real life, not a default handed to you." },
      ],
    },
    whatItMeans: {
      eyebrow: "What functional medicine means",
      heading: "Functional medicine is not alternative. It is upstream.",
      paragraphs: [
        "Functional medicine has a reputation problem, dismissed as fringe or sold as wellness fluff. Real functional medicine is rigorous, lab-driven physiology. I read how every system in your body talks to the others, then follow that conversation upstream to the root.",
        "This is medicine that respects both your science and your story.",
      ],
      callouts: [
        { title: "Real labs, read for optimal", body: "Advanced panels read against where you actually feel well, not just inside a wide normal range." },
        { title: "The whole system, connected", body: "Hormones, gut, metabolism, and stress are mapped together so the real driver cannot hide." },
        { title: "A plan you help build", body: "Care shaped around your body and your real life, with you in the room deciding." },
      ],
    },
    whoIHelp: [
      { slug: "hormone-imbalance", title: "Hormones", desc: "Cycles, mood, and energy shifts read against a full hormone panel, not just one snapshot." },
      { slug: "pcos", title: "PCOS", desc: "Insulin, androgens, and cycle regularity, treated together instead of one symptom at a time." },
      { slug: "chronic-fatigue", title: "Fatigue", desc: "Cortisol, thyroid, and blood sugar mapped together until the real drain is found." },
    ],
    proof: {
      quote: "She actually explained what was wrong, then built the plan that fixed it. No one had done that before.",
      name: "Renee A.",
      meta: "Atlanta patient",
    },
    faq: [
      { q: "What is functional medicine?", a: "Functional medicine is root-cause medicine. Instead of naming a symptom and medicating it, I map how your whole system connects, run advanced labs, and treat the underlying driver so the symptoms ease together." },
      { q: "Is functional medicine evidence based?", a: "Yes. I hold a Ph.D. in Functional Medicine and am board certified in holistic health. Care is grounded in advanced lab testing and physiology, read against optimal ranges, not guesswork or generic wellness advice." },
      { q: "How is functional medicine different from conventional medicine?", a: "Conventional care manages symptoms one at a time, often with a prescription. Functional medicine asks why the symptom is there, traces it back to the system that produced it, and treats the cause. The two work best side by side." },
      { q: "What conditions does functional medicine help with?", a: "Hormones, PCOS, gut and digestion, thyroid, chronic fatigue, weight, hair loss, and menopause. It helps most where the root cause spans several systems and a single specialist only sees one piece." },
      { q: "Is this the same as integrative or holistic medicine?", a: "They overlap. Integrative and holistic medicine describe treating the whole person; functional medicine is the lab-driven method I use to find and treat the root cause. You get both here." },
      { q: "Do you offer virtual functional medicine visits or only in person in Atlanta?", a: "Both. See me in person at our Atlanta clinic, or virtually anywhere in Georgia through telehealth. Your $99 Symptom Consultation can be booked either way." },
    ],
  },
  {
    slug: "naturopathic-doctor-atlanta",
    name: "Naturopathic care",
    title: "Naturopathic Doctor in Atlanta | Dr. Nina Ross, ND PhD",
    description:
      "Looking for a naturopathic doctor in Atlanta? Dr. Nina Ross, ND PhD, blends naturopathic principles with advanced lab testing to treat the root cause, in Atlanta and virtually across Georgia. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/naturopathic-doctor-share.jpg",
    slotPrefix: "ndaD",
    breadcrumbLabel: "Naturopathic Doctor Atlanta",
    hero: {
      eyebrow: "Naturopathic Doctor in Atlanta",
      heading: "A naturopathic doctor in Atlanta who treats the cause and supports the body.",
      paragraphs: [
        "If you want care that works with your body rather than just silencing it, and a doctor who will actually look for why you feel this way, you are in the right place.",
        "I am Dr. Nina Ross, ND PhD. As a naturopathic doctor I follow a simple principle: find the root cause and give the body what it needs to heal. I pair that with advanced labs and modern functional medicine, here in Atlanta and virtually across Georgia, then build the plan around your body and your life.",
      ],
      secondaryLabel: "What naturopathic medicine means →",
    },
    whySection: {
      eyebrow: "The naturopathic principle",
      heading: "Treat the cause. Support the body's own ability to heal.",
      paragraphs: [
        "Naturopathic medicine starts from a different question: not how do we suppress this symptom, but what is the body trying to correct, and how do we help it. We remove what is in the way, supply what is missing, and let your physiology do what it is built to do.",
        "Your body is not the problem to be silenced. It is the system to be supported.",
      ],
      callouts: [
        { title: "Find the root cause", body: "We look beneath the symptom for the imbalance driving it, then treat that." },
        { title: "Support, do not suppress", body: "Care works with your body's own systems instead of just overriding the signal." },
        { title: "Least force, most effect", body: "We reach for the gentlest effective tools first, and use advanced testing to aim them." },
      ],
    },
    whatItMeans: {
      eyebrow: "What naturopathic medicine means",
      heading: "Naturopathic does not mean unscientific. It means root-cause.",
      paragraphs: [
        "Naturopathic medicine is often mistaken for guesswork or supplements alone. Done well, it is rigorous and lab-driven. I read how every system in your body connects, then choose targeted, evidence-informed care, from nutrition to hormone support, that treats the cause.",
        "This is medicine that respects both your science and your story.",
      ],
      callouts: [
        { title: "Real labs, read for optimal", body: "Advanced panels read against where you actually feel well, not just inside a wide normal range." },
        { title: "The whole system, connected", body: "Hormones, gut, metabolism, and stress are mapped together so the real driver cannot hide." },
        { title: "A plan you help build", body: "Care shaped around your body and your real life, with you in the room deciding." },
      ],
    },
    whoIHelp: [
      { slug: "gut-health", title: "Gut health", desc: "Bloating, reflux, and irregularity, traced to what is actually happening in your gut." },
      { slug: "menopause", title: "Menopause", desc: "Hormone shifts read against real testing, not brushed off as just aging." },
      { slug: "hair-loss", title: "Hair loss", desc: "Thyroid, iron, and hormones tested first, because thinning is rarely just about hair." },
    ],
    proof: {
      quote: "For the first time a doctor treated the reason, not just the symptom. I finally feel like myself.",
      name: "Camille T.",
      meta: "Atlanta patient",
    },
    faq: [
      { q: "What does a naturopathic doctor do?", a: "A naturopathic doctor looks for the root cause of your symptoms and supports the body's own ability to heal. I pair that philosophy with advanced labs and functional medicine, then build a plan from nutrition to targeted support that treats the cause." },
      { q: "Is naturopathic medicine evidence based?", a: "Done well, yes. I hold a Ph.D. in Functional Medicine and am board certified in holistic health. My naturopathic care is grounded in advanced lab testing and physiology, not guesswork or supplements alone." },
      { q: "How is a naturopathic doctor different from a conventional doctor?", a: "A conventional visit usually names a symptom and medicates it. As a naturopathic doctor in Atlanta, I look for what the body is trying to correct, remove what is in the way, and supply what is missing, using the gentlest effective tools first." },
      { q: "What does a naturopath in Atlanta treat?", a: "Hormones, PCOS, gut and digestion, chronic fatigue, thyroid, hair loss, menopause, and weight. Anywhere the root cause spans several systems is where naturopathic, root-cause care helps most." },
      { q: "Do you work alongside my regular doctor?", a: "Yes. Naturopathic and functional medicine care here is provided alongside, not in place of, your primary and specialty care. We coordinate so the whole picture stays connected." },
      { q: "Do you offer virtual naturopathic visits or only in person in Atlanta?", a: "Both. See me in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
    ],
  },
  {
    slug: "holistic-doctor-atlanta",
    name: "Holistic care",
    title: "Holistic Doctor in Atlanta | Dr. Nina Ross, ND PhD",
    description:
      "Looking for a holistic doctor in Atlanta who treats the whole you? Dr. Nina Ross, ND PhD, practices root-cause functional medicine in Atlanta and virtually across Georgia. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/holistic-doctor-share.jpg",
    slotPrefix: "hdaD",
    breadcrumbLabel: "Holistic Doctor Atlanta",
    hero: {
      eyebrow: "Holistic Doctor in Atlanta",
      heading: "A holistic doctor in Atlanta who treats the whole you.",
      paragraphs: [
        "If you have spent years feeling rushed, brushed off, or told your labs are normal while you still feel unwell, you deserve a doctor who looks closer and listens longer.",
        "I am Dr. Nina Ross, ND PhD. I practice root-cause functional medicine here in Atlanta and virtually across Georgia. That means I read your whole story, your hormones, your gut, your metabolism, the stress you carry, until I find what is really driving how you feel. Then I build the plan around your body and your life, with you in the room the whole way.",
      ],
      secondaryLabel: "What 'holistic' really means here →",
    },
    whySection: {
      eyebrow: "Why whole-person care",
      heading: "One doctor who finally connects every part of your health.",
      paragraphs: [
        "Most care is split into fifteen-minute visits, one symptom at a time, with no one looking at how it all fits together. A holistic doctor holds the whole picture, your hormones, gut, metabolism, sleep, and stress, and treats them as the connected system they really are.",
        "You should never have to convince your doctor that you know your own body.",
      ],
      callouts: [
        { title: "One connected picture", body: "Your symptoms are read together, not in separate silos, so the thread linking them finally shows." },
        { title: "Time to be heard", body: "An unhurried first visit means nothing about how you feel gets rushed past or dismissed." },
        { title: "Care that fits your life", body: "Your plan honors how you actually eat, move, and live, not a template made for someone else." },
      ],
    },
    whatItMeans: {
      eyebrow: "What holistic really means here",
      heading: "Holistic does not mean unscientific. It means whole.",
      paragraphs: [
        "Holistic has been worn down into a spa word. Here it carries its real weight. I treat the whole person with rigorous, lab-driven medicine, reading how every system in your body talks to the others, then following that conversation to the root.",
        "This is medicine that respects both your science and your story.",
      ],
      callouts: [
        { title: "Real labs, read for optimal", body: "Advanced panels read against where you actually feel well, not just inside a wide normal range." },
        { title: "The whole system, connected", body: "Hormones, gut, metabolism, and stress are mapped together so the real driver cannot hide." },
        { title: "A plan you help build", body: "Care shaped around your body and your real life, with you in the room deciding." },
      ],
    },
    whoIHelp: [
      { slug: "mood", title: "Mood", desc: "Mood swings and low motivation read against hormones, thyroid, and inflammation." },
      { slug: "undiagnosed-but-unwell", title: "Unexplained symptoms", desc: "When labs look normal but you still feel off, we keep looking until we find why." },
      { slug: "weight-loss", title: "Weight", desc: "Insulin, thyroid, and hormones tested first, so the plan targets the real cause." },
    ],
    proof: {
      quote: "She was the first doctor who let me finish a sentence. For the first time I felt like a whole person in the room.",
      name: "Tasha M.",
      meta: "Atlanta patient",
    },
    faq: [
      { q: "What does a holistic doctor actually do?", a: "A holistic doctor looks at your whole body and life rather than one symptom in isolation. I use functional medicine to map how your hormones, gut, metabolism, stress, and nutrition connect, run advanced labs, and build a personalized plan to treat the root cause." },
      { q: "Is holistic medicine evidence based?", a: "Yes. I hold a Ph.D. in Functional Medicine and am board certified in holistic health. Care here is grounded in advanced lab testing and physiology, read against optimal ranges, not guesswork or generic wellness advice." },
      { q: "How is a holistic doctor different from my regular doctor?", a: "Your regular doctor often has fifteen minutes and one symptom to address. As a holistic doctor in Atlanta, I take the time to look at the whole system, connect the dots between your symptoms, and treat what is actually driving them." },
      { q: "What conditions can a holistic doctor help with?", a: "Hormones, PCOS, gut and digestion, chronic fatigue, hair loss, menopause, weight, and more. Anything where the root cause sits across several systems is exactly where whole-person care helps most." },
      { q: "Do you work alongside my regular doctor?", a: "Yes. Functional medicine care here is provided alongside, not in place of, your primary and specialty care. We coordinate so the whole picture stays connected." },
      { q: "Do you offer virtual visits or only in person in Atlanta?", a: "Both. See me in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
    ],
  },
  {
    slug: "trichologist-atlanta",
    name: "Hair loss",
    title: "Trichologist in Atlanta | Hair Loss Specialist | Dr. Nina Ross, ND PhD",
    description:
      "A board-certified trichologist and hair loss specialist in Atlanta. Dr. Nina Ross, ND PhD, finds what is really behind your thinning hair and treats the root cause, in Atlanta and virtually across Georgia. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/trichologist-share.jpg",
    slotPrefix: "triD",
    breadcrumbLabel: "Trichologist Atlanta",
    hero: {
      eyebrow: "Board-Certified Trichologist in Atlanta",
      heading: "A trichologist in Atlanta who finds what is really behind your hair loss.",
      paragraphs: [
        "If your hair is thinning, shedding, or changing and no one has explained why, you deserve a specialist who investigates the cause, not just the scalp.",
        "I am Dr. Nina Ross, ND PhD, a board-certified trichologist and functional medicine doctor. Thinning hair is usually a signal from somewhere deeper, thyroid, iron, hormones, or stress. I run advanced labs to find which one is driving yours, here in Atlanta and virtually across Georgia, then treat the root so your hair has what it needs to recover.",
      ],
      secondaryLabel: "What a trichologist actually does →",
    },
    whySection: {
      eyebrow: "Why hair is a signal",
      heading: "Hair loss is rarely just about your hair.",
      paragraphs: [
        "Most hair loss is downstream of something systemic, your thyroid, your iron, your hormones, your stress. Treating the scalp alone misses it. As a trichologist and functional medicine doctor, I read the whole picture and treat what is actually driving the shedding.",
        "Your hair is telling the truth about your health. We listen to it.",
      ],
      callouts: [
        { title: "A real diagnosis first", body: "We identify the type and cause of your hair loss before treating, not after months of guesswork." },
        { title: "Labs, not just the scalp", body: "Thyroid, iron, hormones, and inflammation are tested, because that is where most hair loss begins." },
        { title: "Treat the root, regrow", body: "When we fix the driver, your hair finally has the conditions it needs to recover." },
      ],
    },
    whatItMeans: {
      eyebrow: "What a trichologist does",
      heading: "A trichologist treats the cause of hair loss, not the cosmetics.",
      paragraphs: [
        "A trichologist is a specialist in the hair and scalp. Paired with functional medicine, that means I do not just look at your hair, I look at why it is changing, reading how your hormones, nutrients, and stress connect, then treating the root.",
        "This is medicine that respects both your science and your story.",
      ],
      callouts: [
        { title: "Find the real driver", body: "Thyroid, iron, hormones, or stress, we test to see which one is behind your shedding." },
        { title: "The whole system, connected", body: "Hair, hormones, gut, and metabolism are mapped together so the cause cannot hide." },
        { title: "A plan you help build", body: "Targeted support, nutrition, and lifestyle, sequenced to your labs, with you deciding." },
      ],
    },
    whoIHelp: [
      { slug: "hair-loss", title: "Hair loss", desc: "The full workup, thyroid, iron, hormones, and inflammation, to find your real driver." },
      { slug: "hormone-imbalance", title: "Hormones", desc: "Shedding tied to hormone shifts, read against a full panel and treated at the root." },
      { slug: "chronic-fatigue", title: "Fatigue", desc: "When exhaustion and thinning hair show up together, we look at what connects them." },
    ],
    proof: {
      quote: "My hair stopped falling out once she found my thyroid was the cause. No one else had even checked.",
      name: "Yvonne D.",
      meta: "Atlanta patient",
    },
    faq: [
      { q: "What does a trichologist do?", a: "A trichologist is a specialist in the hair and scalp. As a board-certified trichologist and functional medicine doctor, I diagnose the type and cause of your hair loss, then treat the root driver, whether that is thyroid, iron, hormones, or stress." },
      { q: "What causes hair loss, and can it be reversed?", a: "Most hair loss is downstream of something systemic, thyroid, iron, hormones, or stress. When we find and treat the real driver, your hair often has the conditions it needs to recover." },
      { q: "How is a trichologist different from a dermatologist?", a: "A dermatologist focuses on the skin and scalp surface. As a trichologist paired with functional medicine, I also test what is happening inside, the thyroid, nutrients, and hormones behind the shedding, and treat that root cause." },
      { q: "What lab testing do you run for hair loss?", a: "We go beyond a basic panel, thyroid, iron and ferritin, a full hormone panel, and inflammatory markers, because that is where most hair loss actually begins." },
      { q: "Do you work alongside my regular doctor or dermatologist?", a: "Yes. Care here is provided alongside, not in place of, your primary, dermatology, and specialty care. We coordinate so the whole picture stays connected." },
      { q: "Do you offer virtual hair-loss visits or only in person in Atlanta?", a: "Both. See me in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
    ],
  },
  {
    slug: "holistic-health-practitioner",
    name: "Holistic care",
    title: "Holistic Health Practitioner in Atlanta | Dr. Nina Ross, ND PhD",
    description:
      "Looking for a holistic health practitioner in Atlanta who treats the whole you? Dr. Nina Ross, ND PhD, practices root-cause functional medicine in Atlanta and virtually across Georgia. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/holistic-health-practitioner-share.jpg",
    slotPrefix: "hhpD",
    breadcrumbLabel: "Holistic Health Practitioner",
    hero: {
      eyebrow: "Holistic Health Practitioner in Atlanta",
      heading: "A holistic health practitioner in Atlanta who treats the whole you.",
      paragraphs: [
        "If you have spent years feeling rushed, brushed off, or told your labs are normal while you still feel unwell, you deserve a doctor who looks closer and listens longer.",
        "I am Dr. Nina Ross, ND PhD. I practice root-cause functional medicine here in Atlanta and virtually across Georgia. That means I read your whole story, your hormones, your gut, your metabolism, the stress you carry, until I find what is really driving how you feel. Then I build the plan around your body and your life, with you in the room the whole way.",
      ],
      secondaryLabel: "What 'holistic' really means here →",
    },
    whySection: {
      eyebrow: "Why whole-person care",
      heading: "One doctor who finally connects every part of your health.",
      paragraphs: [
        "Most care is split into fifteen-minute visits, one symptom at a time, with no one looking at how it all fits together. A holistic health practitioner holds the whole picture, your hormones, gut, metabolism, sleep, and stress, and treats them as the connected system they really are.",
        "You should never have to convince your doctor that you know your own body.",
      ],
      callouts: [
        { title: "One connected picture", body: "Your symptoms are read together, not in separate silos, so the thread linking them finally shows." },
        { title: "Time to be heard", body: "An unhurried first visit means nothing about how you feel gets rushed past or dismissed." },
        { title: "Care that fits your life", body: "Your plan honors how you actually eat, move, and live, not a template made for someone else." },
      ],
    },
    whatItMeans: {
      eyebrow: "What holistic really means here",
      heading: "Holistic does not mean unscientific. It means whole.",
      paragraphs: [
        "Holistic has been worn down into a spa word. Here it carries its real weight. I treat the whole person with rigorous, lab-driven medicine, reading how every system in your body talks to the others, then following that conversation to the root.",
        "This is medicine that respects both your science and your story.",
      ],
      callouts: [
        { title: "Real labs, read for optimal", body: "Advanced panels read against where you actually feel well, not just inside a wide normal range." },
        { title: "The whole system, connected", body: "Hormones, gut, metabolism, and stress are mapped together so the real driver cannot hide." },
        { title: "A plan you help build", body: "Care shaped around your body and your real life, with you in the room deciding." },
      ],
    },
    whoIHelp: [
      { slug: "gut-health", title: "Gut health", desc: "Bloating, reflux, and irregularity, traced to what is actually happening in your gut." },
      { slug: "sexual-health", title: "Sexual health", desc: "Libido and intimacy shifts read against hormones and the whole system, not brushed off." },
      { slug: "insulin-resistance", title: "Metabolic health", desc: "Blood sugar, insulin, and inflammation tested together to find what is really stuck." },
    ],
    proof: {
      quote: "She was the first doctor who let me finish a sentence. For the first time I felt like a whole person in the room.",
      name: "Tasha M.",
      meta: "Atlanta patient",
    },
    faq: [
      { q: "What does a holistic health practitioner do?", a: "A holistic health practitioner looks at your whole body and life rather than one symptom in isolation. I use functional medicine to map how your hormones, gut, metabolism, stress, and nutrition connect, run advanced labs, and build a personalized plan to treat the root cause." },
      { q: "Is holistic medicine evidence based?", a: "Yes. I hold a Ph.D. in Functional Medicine and am board certified in holistic health. Care here is grounded in advanced lab testing and physiology, read against optimal ranges, not guesswork or generic wellness advice." },
      { q: "How is a holistic health practitioner different from a regular doctor?", a: "A regular visit often has fifteen minutes and one symptom to address. As a holistic health practitioner in Atlanta, I take the time to look at the whole system, connect the dots between your symptoms, and treat what is actually driving them." },
      { q: "What can a holistic health practitioner help with?", a: "Hormones, PCOS, gut and digestion, chronic fatigue, hair loss, menopause, weight, and more. Anything where the root cause sits across several systems is exactly where whole-person care helps most." },
      { q: "Do you work alongside my regular doctor?", a: "Yes. Functional medicine care here is provided alongside, not in place of, your primary and specialty care. We coordinate so the whole picture stays connected." },
      { q: "Do you offer virtual visits or only in person in Atlanta?", a: "Both. See me in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
    ],
  },
  {
    slug: "black-holistic-doctor-atlanta",
    name: "Holistic care",
    title: "Black Holistic Doctor in Atlanta | Dr. Nina Ross, ND PhD",
    description:
      "Looking for a Black holistic doctor in Atlanta who listens? Dr. Nina Ross, ND PhD, offers root-cause functional medicine in Atlanta and virtually across Georgia. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/black-holistic-doctor-share.jpg",
    slotPrefix: "bhdD",
    breadcrumbLabel: "Black Holistic Doctor Atlanta",
    hero: {
      eyebrow: "Black Holistic Doctor in Atlanta",
      heading: "A Black holistic doctor in Atlanta who hears the whole story.",
      paragraphs: [
        "If you have spent years feeling rushed, brushed off, or told your labs are normal while you still feel unwell, you deserve a doctor who looks closer and listens longer.",
        "I am Dr. Nina Ross, ND PhD. I practice root-cause functional medicine here in Atlanta and virtually across Georgia. That means I read your whole story, your hormones, your gut, your metabolism, the stress you carry, until I find what is really driving how you feel. Then I build the plan around your body and your life, with you in the room the whole way.",
      ],
      secondaryLabel: "What 'holistic' really means here →",
    },
    whySection: {
      eyebrow: "Why this matters",
      heading: "Care from someone who already understands where you are coming from.",
      paragraphs: [
        "When you search for a Black holistic doctor, you are not only looking for credentials. You are looking to be believed without a fight, to be cared for by someone who recognizes your story, and to finally exhale in a doctor's office. That recognition is where real healing starts.",
        "You should never have to convince your doctor that you know your own body.",
      ],
      callouts: [
        { title: "Believed from the first hello", body: "After generations of being dismissed and under-treated, your care here starts from trust, never doubt." },
        { title: "No translating yourself", body: "Your family history, your foods, and your faith all belong in the room and shape the plan we build." },
        { title: "Care that fits your life", body: "Your plan honors how you actually eat, move, and live, not a template made for someone else." },
      ],
    },
    whatItMeans: {
      eyebrow: "What holistic really means here",
      heading: "Holistic does not mean unscientific. It means whole.",
      paragraphs: [
        "Holistic has been worn down into a spa word. Here it carries its real weight. I treat the whole person with rigorous, lab-driven medicine, reading how every system in your body talks to the others, then following that conversation to the root.",
        "This is medicine that respects both your science and your story.",
      ],
      callouts: [
        { title: "Real labs, read for optimal", body: "Advanced panels read against where you actually feel well, not just inside a wide normal range." },
        { title: "The whole system, connected", body: "Hormones, gut, metabolism, and stress are mapped together so the real driver cannot hide." },
        { title: "A plan you help build", body: "Care shaped around your body, your culture, and your real life, with you in the room deciding." },
      ],
    },
    whoIHelp: [
      { slug: "hair-loss", title: "Hair loss", desc: "Thinning and shedding traced to thyroid, iron, and hormones, not brushed off as normal." },
      { slug: "hormone-imbalance", title: "Hormones", desc: "Cycles, mood, and energy shifts read against a full hormone panel." },
      { slug: "weight-loss", title: "Weight", desc: "Insulin, thyroid, and hormones tested first, so the plan targets the real cause." },
    ],
    proof: {
      quote: "She was the first doctor who let me finish a sentence. For the first time I felt like a whole person in the room.",
      name: "Tasha M.",
      meta: "Atlanta patient",
    },
    faq: [
      { q: "What does a holistic doctor actually do?", a: "A holistic doctor looks at your whole body and life rather than one symptom in isolation. Dr. Nina Ross uses functional medicine to map how your hormones, gut, metabolism, stress, and nutrition connect, runs advanced labs, and builds a personalized plan to treat the root cause." },
      { q: "Is holistic and functional medicine evidence based?", a: "Yes. Dr. Nina Ross holds a Ph.D. in Functional Medicine and is board certified in holistic health. Care is grounded in advanced lab testing and physiology, read against optimal ranges, not guesswork or generic wellness advice." },
      { q: "Why do people search for a Black holistic doctor in Atlanta?", a: "Many patients want a physician who listens, takes their concerns seriously, and understands their lived experience after years of feeling rushed or dismissed. Dr. Nina Ross offers that unhurried, whole-person care in Atlanta and virtually across Georgia." },
      { q: "Do you only see Black patients?", a: "Dr. Nina Ross welcomes patients of every background. This page simply speaks to those searching for a Black holistic doctor who will hear their whole story." },
      { q: "Do you work alongside my regular doctor?", a: "Yes. Functional medicine care at Nina Ross is provided alongside, not in place of, your primary and specialty care. We coordinate so the whole picture stays connected." },
      { q: "Do you offer virtual visits or only in person in Atlanta?", a: "Both. See Dr. Nina Ross in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
    ],
  },
];

export const POSITIONING: LongformPageContent[] = RAW.map(buildPositioning);

export function getPositioningBySlug(slug: string): LongformPageContent | undefined {
  return POSITIONING.find((p) => p.slug === slug);
}

export interface PositioningIndexEntry {
  slug: string;
  name: string;
  teaser: string;
}

export const POSITIONING_INDEX: PositioningIndexEntry[] = RAW.map((r) => ({
  slug: r.slug,
  name: r.breadcrumbLabel,
  teaser: r.hero.paragraphs[0],
}));
