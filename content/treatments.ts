import type { CalloutItem, ContentBlock, FaqItem, LongformPageContent, StepItem } from "./types";
import { buildPositioning } from "./positioning";
import { treatmentCardImage } from "./treatment-images";

interface TreatmentInput {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  breadcrumbLabel: string;
  slotPrefix: string;
  therapy: {
    name: string;
    alternateName: string;
    description: string;
    howPerformed: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    paragraphs: [string, string];
    secondaryLabel: string;
  };
  whatItIs: {
    heading: string;
    intro: string;
    points: [string, string, string];
  };
  whoFor: {
    heading: string;
    closing: string;
    leftItems: [string, string, string];
    rightItems: [string, string, string];
  };
  notBand: {
    label: string;
    heading: string;
    paragraph: string;
    callouts: [CalloutItem, CalloutItem, CalloutItem];
  };
  whatToExpect: {
    heading: string;
    steps: [
      { label: string; title: string; desc: string },
      { label: string; title: string; desc: string },
      { label: string; title: string; desc: string },
      { label: string; title: string; desc: string },
    ];
  };
  related: [{ slug: string; desc: string }, { slug: string; desc: string }, { slug: string; desc: string }];
  faq: FaqItem[];
  startHeading: string;
  startIntro: string;
  bylineNote: string;
}

const TREATMENT_NAMES: Record<string, string> = {
  "advanced-lab-testing": "Advanced Lab Testing",
  "dutch-test": "DUTCH Test",
  "eboo-therapy": "EBOO Therapy",
  "gi-map-test": "GI-MAP Test",
  "glp-1-weight-loss": "GLP-1 Weight Loss",
  "hormone-restoration": "Hormone Restoration",
  "hyperbaric-oxygen-therapy": "Hyperbaric Oxygen Therapy",
  "iv-therapy": "IV Therapy",
  "lymphatic-drainage": "Lymphatic Drainage",
  "ozone-therapy": "Ozone Therapy",
  "peptide-therapy": "Peptide Therapy",
  "red-light-therapy": "Red Light Therapy",
  "vitamin-injections": "Vitamin Injections",
  "holistic-nutrition": "Holistic Nutrition",
};

function buildTreatment(input: TreatmentInput): LongformPageContent {
  const canonical = `https://www.ninarossfm.com/treatments/${input.slug}`;
  const therapyId = `${canonical}#therapy`;

  const stepItems: StepItem[] = input.whatToExpect.steps.map((s) => ({
    label: s.label,
    title: s.title,
    desc: s.desc,
  }));

  const blocks: ContentBlock[] = [
    {
      type: "definitionList",
      eyebrow: "What it actually is",
      heading: input.whatItIs.heading,
      intro: input.whatItIs.intro,
      points: input.whatItIs.points,
    },
    {
      type: "twoListSplit",
      eyebrow: "Be honest with yourself",
      heading: input.whoFor.heading,
      paragraphs: [input.whoFor.closing],
      leftTitle: "This is for you if",
      leftItems: input.whoFor.leftItems,
      rightTitle: "It is not for you if",
      rightItems: input.whoFor.rightItems,
    },
    {
      type: "bandStatement",
      eyebrow: input.notBand.label,
      heading: input.notBand.heading,
      paragraphs: [input.notBand.paragraph],
      callouts: input.notBand.callouts,
      imageSlotId: `${input.slotPrefix}-medspa-av`,
    },
    {
      type: "steps",
      eyebrow: "What to expect",
      heading: input.whatToExpect.heading,
      steps: stepItems,
    },
    {
      type: "cardLinks",
      eyebrow: "The care toolkit",
      heading: "One symptom. A whole toolkit behind it.",
      cards: input.related.map((r) => ({
        href: `/treatments/${r.slug}`,
        title: TREATMENT_NAMES[r.slug] ?? r.slug,
        desc: r.desc,
        imageSlotId: treatmentCardImage(r.slug),
      })),
    },
  ];

  return {
    slug: input.slug,
    title: input.metaTitle,
    description: input.metaDescription,
    canonical,
    hero: {
      eyebrow: input.hero.eyebrow,
      heading: input.hero.heading,
      paragraphs: input.hero.paragraphs,
      ctaLabel: "Book the $99 Symptom Consultation",
      secondaryLabel: input.hero.secondaryLabel,
      secondaryHref: "#toolkit",
      imageSlotId: `${input.slotPrefix}-hero`,
      bylineAvatarSlotId: `${input.slotPrefix}-byline-av`,
      breadcrumbLabel: input.breadcrumbLabel,
      breadcrumbParentLabel: "Treatments",
      breadcrumbParentHref: "/treatments",
    },
    blocks,
    faqEyebrow: "Questions people ask us",
    faqHeading: `${TREATMENT_NAMES[input.slug]}, answered plainly`,
    faq: input.faq,
    startHere: { heading: input.startHeading, intro: input.startIntro },
    bylineNote: input.bylineNote,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "MedicalWebPage",
          "@id": `${canonical}#webpage`,
          url: canonical,
          name: input.metaTitle,
          description: input.metaDescription,
          inLanguage: "en-US",
          about: { "@id": therapyId },
          reviewedBy: { "@id": "https://www.ninarossfm.com/#physician" },
          lastReviewed: "2026-06-01",
        },
        {
          "@type": "MedicalTherapy",
          "@id": therapyId,
          name: input.therapy.name,
          alternateName: input.therapy.alternateName,
          description: input.therapy.description,
          howPerformed: input.therapy.howPerformed,
          relevantSpecialty: { "@type": "MedicalSpecialty", name: "FunctionalMedicine" },
          provider: { "@id": "https://www.ninarossfm.com/#physician" },
        },
        {
          "@type": "Physician",
          "@id": "https://www.ninarossfm.com/#physician",
          name: "Dr. Nina Ross, ND PhD",
          medicalSpecialty: "FunctionalMedicine",
          identifier: { "@type": "PropertyValue", propertyID: "NPI", value: "1164884078" },
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
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.ninarossfm.com/" },
            { "@type": "ListItem", position: 2, name: "Treatments", item: "https://www.ninarossfm.com/treatments" },
            { "@type": "ListItem", position: 3, name: input.breadcrumbLabel, item: canonical },
          ],
        },
      ],
    },
  };
}

const RAW: TreatmentInput[] = [
  {
    slug: "advanced-lab-testing",
    metaTitle: "Advanced Lab Testing in Atlanta | Dr. Nina Ross, ND PhD",
    metaDescription:
      "Advanced functional lab testing in Atlanta, ordered and interpreted by Dr. Nina Ross, ND PhD, far beyond a basic panel. Root-cause functional medicine. Start with a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/advanced-lab-testing-share.jpg",
    breadcrumbLabel: "Advanced Labs",
    slotPrefix: "labD",
    therapy: {
      name: "Advanced Lab Testing",
      alternateName: "Comprehensive functional bloodwork and specialty panels",
      description:
        "Comprehensive functional lab testing, including expanded blood panels and specialty markers, ordered and interpreted with functional reference ranges within a personalized care plan.",
      howPerformed:
        "After a clinical consult, expanded blood and specialty labs are ordered, drawn, and then interpreted by Dr. Nina Ross against functional ranges and built into a plan.",
    },
    hero: {
      eyebrow: "Advanced Lab Testing in Atlanta",
      heading: "Advanced lab testing in Atlanta, read for root cause and built into your plan.",
      paragraphs: [
        "If your labs keep coming back \u201Cnormal\u201D while you clearly do not feel normal, the problem was never your imagination. It is that a basic panel with broad ranges was never built to catch what is actually off.",
        "I am Dr. Nina Ross, ND PhD. Advanced testing here means we order the right expanded panels and I read them against functional ranges, as one move inside a plan that treats what they reveal. That is how you get past \u201Ceverything is fine\u201D to a real answer.",
      ],
      secondaryLabel: "See the whole toolkit behind it →",
    },
    whatItIs: {
      heading: "The markers a basic panel skips, read against ranges that catch problems early.",
      intro:
        "Advanced testing goes past the standard panel, expanded thyroid, metabolic, nutrient, inflammatory, and specialty markers, interpreted against functional ranges. That depth is real and genuinely useful, and it pays off when a clinician reads it against your symptoms and turns it into a plan.",
      points: [
        "We order the expanded and specialty markers a standard checkup never includes.",
        "We read your results against the narrower ranges where symptoms begin, not just disease cutoffs.",
        "Dr. Nina interprets it against your symptoms and history, so the whole picture comes together.",
      ],
    },
    whoFor: {
      heading: "Advanced testing is right for some people. It is wrong for others.",
      closing: "If that second list stung a little, good. That honesty is exactly what you are paying for here.",
      leftItems: [
        "Your standard labs are \u201Cnormal\u201D but your symptoms clearly are not",
        "You want to find the root cause early, before it becomes a diagnosis",
        "You want a clinician to connect the markers into a plan you can act on",
      ],
      rightItems: [
        "You want a pile of numbers with no interest in what to do about them",
        "You are hoping a test alone will fix something a test can only measure",
        "You expect one panel to replace an ongoing relationship with a clinician",
      ],
    },
    notBand: {
      label: "Not a lab-on-demand",
      heading: "Anyone can sell you a panel now. Reading it for root cause is the hard part.",
      paragraph:
        "Order labs online and you get a wall of markers, a few red flags, and no one to call. No one connecting the values to your symptoms, no plan when the results land. Here, advanced testing is ordered for a reason and interpreted by a physician, as one tool inside a plan that acts on what it finds.",
      callouts: [
        { title: "Ordered for a reason, not a whim", body: "We test because your symptoms point somewhere, so the results actually answer a question." },
        { title: "Interpreted, not just delivered", body: "The values are the start; what they mean together for you is where the real work is." },
        { title: "A physician reading it, not an algorithm", body: "Reviewed against your whole history by a doctor, then turned into next steps." },
      ],
    },
    whatToExpect: {
      heading: "From first consult to a plan you can act on, step by step",
      steps: [
        { label: "Consult & symptoms", title: "We decide what to order", desc: "Your story tells us which markers matter, so we order the panels that answer real questions." },
        { label: "Your labs are drawn", title: "The right panels, done", desc: "Expanded and specialty labs are drawn, in our studio or near you, with clear instructions." },
        { label: "We read it together", title: "The results, interpreted", desc: "Dr. Nina walks you through what your markers actually mean against functional ranges." },
        { label: "Plan & re-test", title: "We act, then confirm", desc: "Your results become a plan, and we re-test down the road to see it working." },
      ],
    },
    related: [
      { slug: "dutch-test", desc: "A full-day hormone and cortisol map when your labs point to hormones specifically." },
      { slug: "gi-map-test", desc: "A DNA-level gut workup when bloat, reflux, or irregularity are part of the picture." },
      { slug: "hormone-restoration", desc: "When testing shows real hormone shifts, restoration brings you back to a functional range." },
    ],
    faq: [
      { q: "What is advanced or functional lab testing?", a: "It is expanded blood and specialty testing, read against functional ranges, the narrower windows where symptoms begin rather than the wide ranges used only to diagnose disease. That catches problems a standard checkup often calls \u201Cnormal.\u201D" },
      { q: "Why were my labs \u201Cnormal\u201D when I feel awful?", a: "Standard ranges are very wide and built to flag disease, not early dysfunction. We use functional ranges and order the markers a basic panel skips, then read everything together against your symptoms." },
      { q: "What do you test that my regular doctor does not?", a: "Depending on your symptoms, that can include expanded thyroid, nutrient, metabolic, inflammatory, and specialty markers, plus hormone or gut testing where relevant. We order what answers your specific questions, not a fixed list." },
      { q: "Is advanced lab testing worth it?", a: "It is worth it when your symptoms are real and the results will change your plan. Ordered for the right reason and interpreted by a clinician, it can pinpoint a root cause early; run randomly with no one reading it, it is just numbers." },
      { q: "Can I just order labs online myself?", a: "You can, but you are then left to interpret a wall of markers alone. Here labs are ordered off your symptoms and read by a physician who turns them into an actual plan." },
      { q: "Can I just get the testing without becoming a patient?", a: "Testing here is always part of physician-led care. You start with a $99 Symptom Consultation so labs are ordered for the right reason and the results are actually used." },
    ],
    startHeading: "Lab testing read by a physician.",
    startIntro: "Testing is one tool inside your care plan, ordered for a reason and interpreted by Dr. Nina, so the results turn into action instead of anxiety.",
    bylineNote: "This page is for education and is not a substitute for individual medical advice. Lab testing at Nina Ross is physician-ordered after appropriate screening and is provided alongside, not in place of, your primary and specialty care.",
  },
  {
    slug: "dutch-test",
    metaTitle: "DUTCH Test in Atlanta (Hormone Testing) | Dr. Nina Ross, ND PhD",
    metaDescription:
      "DUTCH hormone testing in Atlanta, ordered and interpreted by Dr. Nina Ross, ND PhD as part of root-cause functional medicine and turned into a plan you can follow. Start with a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/dutch-test-share.jpg",
    breadcrumbLabel: "DUTCH Test",
    slotPrefix: "dutD",
    therapy: {
      name: "DUTCH Hormone Test",
      alternateName: "Dried Urine Test for Comprehensive Hormones",
      description:
        "Comprehensive dried-urine hormone testing (DUTCH) measuring sex hormones, their metabolites, and adrenal cortisol patterns, interpreted within a personalized functional medicine plan.",
      howPerformed:
        "After a clinical consult, an at-home dried-urine collection kit is provided; the patient samples over a day and the results are interpreted by Dr. Nina Ross and built into a plan.",
    },
    hero: {
      eyebrow: "DUTCH Hormone Testing in Atlanta",
      heading: "DUTCH hormone testing in Atlanta, read by a physician who turns it into a plan.",
      paragraphs: [
        "If a standard blood panel keeps coming back \u201Cnormal\u201D while your cycles, sleep, and mood say otherwise, the problem was never in your head. It is that a single morning blood draw misses most of the hormone story.",
        "I am Dr. Nina Ross, ND PhD. The DUTCH test maps your hormones and their metabolites across a full day, and I read it as one move inside a plan that treats what it uncovers. That is how a stack of numbers becomes an actual answer.",
      ],
      secondaryLabel: "See the whole toolkit behind it →",
    },
    whatItIs: {
      heading: "A full day of your hormones and their metabolites, mapped end to end.",
      intro:
        "The DUTCH test uses dried-urine samples across a day to measure your sex hormones, how your body breaks them down, and your cortisol rhythm. That depth is real and genuinely useful, and it pays off when a clinician reads it against your symptoms and turns it into a plan.",
      points: [
        "It shows not just your levels but how your body is processing them, which blood often misses.",
        "Sampling across the day reveals the adrenal pattern behind wired-but-tired and broken sleep.",
        "Dr. Nina interprets it against your symptoms and history, so the results actually mean something.",
      ],
    },
    whoFor: {
      heading: "The DUTCH test is right for some people. It is wrong for others.",
      closing: "If that second list stung a little, good. That honesty is exactly what you are paying for here.",
      leftItems: [
        "Your symptoms scream hormones but standard bloodwork keeps reading \u201Cnormal\u201D",
        "You are navigating perimenopause, menopause, PCOS, or stubborn cycle issues",
        "You want a clinician to turn the results into an actual plan you can follow",
      ],
      rightItems: [
        "You want raw numbers with no interest in what to do about them",
        "You are hoping a test alone will fix something a test can only measure",
        "You expect one panel to replace an ongoing relationship with a clinician",
      ],
    },
    notBand: {
      label: "Not a mail-order kit",
      heading: "Anyone can sell you a hormone kit now. Reading it is the hard part.",
      paragraph:
        "Order a kit online and you get a vial, a chart, and a forum to guess in. No one connecting the metabolites to your symptoms, no plan when the results land. Here, the DUTCH test is ordered for a reason and interpreted by a physician, as one tool inside a plan that acts on what it finds.",
      callouts: [
        { title: "Ordered for a reason, not a whim", body: "We test because your symptoms point somewhere, so the results actually answer a question." },
        { title: "Interpreted, not just delivered", body: "The numbers are the start; what they mean for you is where the real work is." },
        { title: "A physician reading it, not an app", body: "Reviewed against your whole history by a doctor, then turned into next steps." },
      ],
    },
    whatToExpect: {
      heading: "From first consult to a plan you can act on, step by step",
      steps: [
        { label: "Consult & symptoms", title: "We map what to look for", desc: "Your story tells us which hormones matter, so the test is ordered to answer real questions." },
        { label: "Your kit is sent", title: "An easy at-home collection", desc: "A simple dried-urine kit arrives with clear instructions for the collection day." },
        { label: "We read it together", title: "The results, interpreted", desc: "Dr. Nina walks you through what your hormones and metabolites actually mean for you." },
        { label: "Plan & re-test", title: "We act, then confirm", desc: "Your results become a plan, and we re-test down the road to see it working." },
      ],
    },
    related: [
      { slug: "advanced-lab-testing", desc: "Expanded thyroid, metabolic, and specialty markers alongside your hormone picture." },
      { slug: "hormone-restoration", desc: "Once testing shows what has shifted, restoration brings your hormones back into range." },
      { slug: "glp-1-weight-loss", desc: "When hormone shifts and stalled weight travel together, this addresses both." },
    ],
    faq: [
      { q: "What does the DUTCH test actually measure?", a: "It measures your sex hormones (like estrogen, progesterone, and testosterone), how your body metabolizes them, and your daily cortisol pattern, from dried-urine samples collected across a day. That gives a fuller picture than a single blood draw, especially for cycle, sleep, and adrenal symptoms." },
      { q: "How is DUTCH different from a regular hormone blood test?", a: "Blood gives one snapshot of total levels. DUTCH adds the metabolites (how your body is breaking hormones down) and a full-day cortisol rhythm, which often explains symptoms that bloodwork calls \u201Cnormal.\u201D" },
      { q: "Do I collect the DUTCH test at home?", a: "Yes. After your consult you receive an at-home kit and collect dried-urine samples at set times over a day, then send it to the lab. Dr. Nina reviews the results with you afterward." },
      { q: "Is the DUTCH test worth it?", a: "It is worth it when your symptoms point to hormones and the results will change your plan. Run for the right reason and interpreted by a clinician, it can shortcut a lot of guessing; run randomly with no one reading it, it is just paper." },
      { q: "Can I order a DUTCH test without a doctor?", a: "You can buy kits online, but you are then left to interpret a complex report alone. Here it is ordered off your symptoms and read by a physician who turns it into an actual plan." },
      { q: "Can I just do the test without becoming a patient?", a: "Testing here is always part of physician-led care. You start with a $99 Symptom Consultation so it is ordered for the right reason and the results are actually used." },
    ],
    startHeading: "A DUTCH test read by a physician.",
    startIntro: "The test is one tool inside your care plan, ordered for a reason and interpreted by Dr. Nina, so the results turn into action instead of anxiety.",
    bylineNote: "This page is for education and is not a substitute for individual medical advice. DUTCH testing at Nina Ross is physician-ordered after appropriate screening and is provided alongside, not in place of, your primary and specialty care.",
  },
  {
    slug: "eboo-therapy",
    metaTitle: "EBOO Therapy in Atlanta (Blood Ozonation) | Dr. Nina Ross, ND PhD",
    metaDescription:
      "EBOO therapy in Atlanta, physician-supervised blood ozonation and filtration, ordered off your labs by Dr. Nina Ross, ND PhD as part of root-cause functional medicine. Start with a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/eboo-therapy-share.jpg",
    breadcrumbLabel: "EBOO Therapy",
    slotPrefix: "eboD",
    therapy: {
      name: "EBOO Therapy",
      alternateName: "Extracorporeal Blood Oxygenation and Ozonation",
      description:
        "Extracorporeal blood oxygenation and ozonation (EBOO), in which blood is circulated through a filter with oxygen and ozone exchange, performed under physician supervision within a personalized functional medicine plan.",
      howPerformed:
        "Under physician supervision at the Atlanta clinic, blood is gently circulated through a filter with ozone and oxygen exchange over a session, as part of the patient's broader plan.",
    },
    hero: {
      eyebrow: "EBOO Therapy in Atlanta",
      heading: "EBOO therapy in Atlanta, a physician-supervised blood cleanse that leaves you clearer and lighter.",
      paragraphs: [
        "If you have gone down the biohacking rabbit hole chasing inflammation, fatigue, or a stubborn immune load, the appeal is real. The risk is doing a powerful blood therapy somewhere that treats it as a stand-alone gimmick.",
        "I am Dr. Nina Ross, ND PhD. Here EBOO is ordered off your labs and run under physician supervision, as one move inside a plan treating the reason you are inflamed or depleted. That is how a single session becomes real, lasting progress.",
      ],
      secondaryLabel: "See the whole toolkit behind it →",
    },
    whatItIs: {
      heading: "Oxygenating and filtering your blood under medical supervision.",
      intro:
        "EBOO gently circulates your blood through a filter while exchanging oxygen and ozone, supporting oxygenation and reducing oxidative and inflammatory load. The mechanism is real and the therapy is powerful, and it delivers when it is ordered off your labs and run inside a plan that treats the cause.",
      points: [
        "Blood is oxygenated and treated as it circulates, supporting circulation and immune balance.",
        "The process passes blood through a filter, part of why it is used for inflammatory and oxidative load.",
        "We use it for a specific reason your testing supports, so each session has a clear purpose.",
      ],
    },
    whoFor: {
      heading: "EBOO is right for some people. It is wrong for others.",
      closing: "If that second list stung a little, good. That honesty is exactly what you are paying for here.",
      leftItems: [
        "You are dealing with high inflammatory or oxidative load your labs confirm",
        "You want advanced support inside a supervised, root-cause plan",
        "You want it ordered for a clear reason and run by clinicians inside a plan",
      ],
      rightItems: [
        "You want a one-off biohack with no interest in why you are inflamed",
        "You are hoping a single therapy replaces a real workup or plan",
        "You expect it to fix a root cause it was never going to touch alone",
      ],
    },
    notBand: {
      label: "Not a biohack",
      heading: "Every wellness lounge is adding blood therapies now. This is not that.",
      paragraph:
        "At a biohacking bar you book a powerful blood therapy off a menu, pay at the counter, and hope it helps. No labs, no supervision plan, no one asking why you needed it. Here, EBOO is ordered off your results and run under physician supervision, as one tool inside a plan treating the actual cause.",
      callouts: [
        { title: "Ordered off labs, not a menu", body: "We use EBOO for a specific, testable reason, so you are treating something real." },
        { title: "One tool in a plan, not the answer", body: "The session supports the work; the plan around it is what actually moves your health." },
        { title: "A physician supervising, not an upsell", body: "Screened, ordered, and supervised by a doctor who knows your whole history." },
      ],
    },
    whatToExpect: {
      heading: "From first consult to your session, step by step",
      steps: [
        { label: "Consult & labs", title: "We find the reason", desc: "Your story and labs show whether EBOO fits and why, before anything is scheduled." },
        { label: "Your protocol is set", title: "A plan written for you", desc: "Dr. Nina decides if and how EBOO fits your goals, with the rest of your plan around it." },
        { label: "The session", title: "A supervised, calm session", desc: "You relax while the therapy runs under clinical supervision, with your comfort watched throughout." },
        { label: "Re-check & adjust", title: "We confirm it is working", desc: "We re-check your markers as your plan moves, so each step is justified by where you are now." },
      ],
    },
    related: [
      { slug: "ozone-therapy", desc: "Another physician-supervised oxidative therapy, often considered alongside EBOO." },
      { slug: "hyperbaric-oxygen-therapy", desc: "A different route to more oxygen for tissues, used for related recovery goals." },
      { slug: "iv-therapy", desc: "Nutrient support that often pairs with an inflammatory or recovery-focused plan." },
    ],
    faq: [
      { q: "What is EBOO therapy?", a: "EBOO (extracorporeal blood oxygenation and ozonation) gently circulates your blood through a filter while exchanging oxygen and ozone, then returns it. It is used to support oxygenation and reduce inflammatory and oxidative load. Here it is ordered off your labs and supervised by a physician." },
      { q: "Is EBOO safe?", a: "Performed under physician supervision by trained clinicians after appropriate screening, EBOO is generally well tolerated. Screening matters, which is exactly why care here starts with a consult and labs rather than a walk-in booking." },
      { q: "What is EBOO used for?", a: "It is typically used as advanced support for high inflammatory or oxidative load and immune balance, as part of a broader plan. It is chosen for a specific reason your testing supports, not as a routine add-on." },
      { q: "How many EBOO sessions do I need?", a: "It depends on what your labs show and what we are addressing. Some patients benefit from a short series, others from occasional sessions. Inside the membership plan you use it as your plan calls for, instead of paying per session." },
      { q: "How is this different from a biohacking lounge?", a: "Lounges sell EBOO off a menu with no labs and no supervision plan. Here it is ordered off your results and supervised by a physician as one tool inside a complete functional medicine plan." },
      { q: "Can I just book EBOO without becoming a patient?", a: "EBOO here is always part of physician-led care. You start with a $99 Symptom Consultation so it can be ordered and supervised safely and actually fit your needs." },
    ],
    startHeading: "EBOO, built into your care program.",
    startIntro: "EBOO is one tool inside your care plan, ordered for a reason and supervised by a physician, so each session supports real, lasting progress.",
    bylineNote: "This page is for education and is not a substitute for individual medical advice. EBOO therapy at Nina Ross is physician-ordered and supervised after appropriate screening and is provided alongside, not in place of, your primary and specialty care.",
  },
  {
    slug: "gi-map-test",
    metaTitle: "GI-MAP Stool Test in Atlanta (Gut Testing) | Dr. Nina Ross, ND PhD",
    metaDescription:
      "GI-MAP gut testing in Atlanta, ordered and interpreted by Dr. Nina Ross, ND PhD as part of root-cause functional medicine and turned into a gut-repair plan. Start with a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/gi-map-test-share.jpg",
    breadcrumbLabel: "GI-MAP Test",
    slotPrefix: "gimD",
    therapy: {
      name: "GI-MAP Stool Test",
      alternateName: "GI Microbial Assay Plus (comprehensive stool analysis)",
      description:
        "Comprehensive DNA-based stool analysis (GI-MAP) assessing gut bacteria, pathogens, parasites, yeast, and markers of inflammation and digestion, interpreted within a personalized functional medicine plan.",
      howPerformed:
        "After a clinical consult, an at-home stool collection kit is provided; the sample is analyzed by the lab and the results are interpreted by Dr. Nina Ross and built into a gut-repair plan.",
    },
    hero: {
      eyebrow: "GI-MAP Gut Testing in Atlanta",
      heading: "GI-MAP gut testing in Atlanta that finds the real reason behind the bloat and reflux.",
      paragraphs: [
        "If you have lived with the bloat, the reflux, and the irregularity while every basic test comes back fine, the problem was never imaginary. It is that nobody has actually looked at what is living in your gut.",
        "I am Dr. Nina Ross, ND PhD. The GI-MAP maps your gut bacteria, pathogens, and digestion markers by DNA, and I read it as one move inside a plan that repairs what it finds. That is how a scary printout becomes a real path forward.",
      ],
      secondaryLabel: "See the whole toolkit behind it →",
    },
    whatItIs: {
      heading: "A DNA-level look at what is actually living in your gut.",
      intro:
        "The GI-MAP uses DNA to measure the bacteria, pathogens, parasites, yeast, and inflammation markers in your gut. That precision is real and genuinely useful, and it pays off when a clinician reads it against your symptoms and turns it into a repair plan.",
      points: [
        "It quantifies the good, the bad, and the opportunistic, so we are not guessing at what is off.",
        "It flags parasites, H. pylori, and how well you are actually breaking food down and absorbing it.",
        "Dr. Nina interprets it against your symptoms and history, so the results actually mean something.",
      ],
    },
    whoFor: {
      heading: "The GI-MAP is right for some people. It is wrong for others.",
      closing: "If that second list stung a little, good. That honesty is exactly what you are paying for here.",
      leftItems: [
        "You have ongoing bloat, reflux, irregularity, or food reactions with no clear cause",
        "You suspect a gut driver behind fatigue, skin, mood, or autoimmune issues",
        "You want a clinician to turn the results into a real gut-repair plan",
      ],
      rightItems: [
        "You want raw numbers with no interest in what to do about them",
        "You are hoping a test alone will fix a gut a test can only measure",
        "You expect one panel to replace an ongoing relationship with a clinician",
      ],
    },
    notBand: {
      label: "Not a mail-order kit",
      heading: "Anyone can sell you a gut kit now. Reading it is the hard part.",
      paragraph:
        "Order a kit online and you get a tube, a dense printout, and a forum to panic in. No one connecting the findings to your symptoms, no plan when the results land. Here, the GI-MAP is ordered for a reason and interpreted by a physician, as one tool inside a plan that repairs what it finds.",
      callouts: [
        { title: "Ordered for a reason, not a whim", body: "We test because your symptoms point somewhere, so the results actually answer a question." },
        { title: "Interpreted, not just delivered", body: "The findings are the start; what they mean for your gut is where the real work is." },
        { title: "A physician reading it, not an app", body: "Reviewed against your whole history by a doctor, then turned into next steps." },
      ],
    },
    whatToExpect: {
      heading: "From first consult to a gut-repair plan, step by step",
      steps: [
        { label: "Consult & symptoms", title: "We map what to look for", desc: "Your gut history tells us what matters, so the test is ordered to answer real questions." },
        { label: "Your kit is sent", title: "An easy at-home collection", desc: "A simple stool kit arrives with clear instructions, and you collect the sample at home." },
        { label: "We read it together", title: "The results, interpreted", desc: "Dr. Nina walks you through what your microbiome and markers actually mean for you." },
        { label: "Repair & re-test", title: "We act, then confirm", desc: "Your results become a gut-repair plan, and we re-test later to see it working." },
      ],
    },
    related: [
      { slug: "holistic-nutrition", desc: "Food-as-medicine support built directly on what your gut testing reveals." },
      { slug: "advanced-lab-testing", desc: "Broader bloodwork alongside your gut picture when symptoms cross several systems." },
      { slug: "lymphatic-drainage", desc: "Support for the bloating and sluggishness that often travel with gut imbalance." },
    ],
    faq: [
      { q: "What does the GI-MAP test measure?", a: "It uses DNA to quantify your gut bacteria, potential pathogens, parasites, yeast, H. pylori, and markers of inflammation and digestion, from a single at-home stool sample. That gives a precise picture of what is actually driving gut symptoms." },
      { q: "How is GI-MAP different from a regular stool test?", a: "Standard stool tests look for a few obvious problems. GI-MAP uses DNA to quantify a wide range of organisms and digestive markers at once, which is far more sensitive for the subtle imbalances behind chronic gut issues." },
      { q: "Do I collect the GI-MAP at home?", a: "Yes. After your consult you receive an at-home kit, collect a single stool sample, and send it to the lab. Dr. Nina reviews the results with you afterward and builds the plan." },
      { q: "Is the GI-MAP worth it?", a: "It is worth it when gut symptoms are driving your health and the results will change your plan. Ordered for the right reason and interpreted by a clinician, it can save months of guesswork; run randomly with no one reading it, it is just a printout." },
      { q: "Can I order a GI-MAP without a doctor?", a: "Kits are sold online, but you are then left to interpret a dense report alone. Here it is ordered off your symptoms and read by a physician who turns it into an actual gut-repair plan." },
      { q: "Can I just do the test without becoming a patient?", a: "Testing here is always part of physician-led care. You start with a $99 Symptom Consultation so it is ordered for the right reason and the results are actually used." },
    ],
    startHeading: "A GI-MAP read by a physician.",
    startIntro: "The test is one tool inside your care plan, ordered for a reason and interpreted by Dr. Nina, so the results turn into a repair plan instead of panic.",
    bylineNote: "This page is for education and is not a substitute for individual medical advice. GI-MAP testing at Nina Ross is physician-ordered after appropriate screening and is provided alongside, not in place of, your primary and specialty care.",
  },
  {
    slug: "glp-1-weight-loss",
    metaTitle: "GLP-1 / Semaglutide Weight Loss in Atlanta | Dr. Nina Ross, ND PhD",
    metaDescription:
      "Medical weight loss with GLP-1 injections (semaglutide) in Atlanta, prescribed and monitored by Dr. Nina Ross, ND PhD as part of root-cause functional medicine that makes the loss hold. Start with a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/glp-1-weight-loss-share.jpg",
    breadcrumbLabel: "GLP-1 Weight Loss",
    slotPrefix: "glpD",
    therapy: {
      name: "GLP-1 Weight Loss Injections",
      alternateName: "Semaglutide / GLP-1 receptor agonist therapy",
      description:
        "Physician-prescribed GLP-1 receptor agonist medication (such as semaglutide) for medical weight loss, dosed from advanced lab testing and delivered within a personalized functional medicine plan that protects muscle and addresses root causes.",
      howPerformed:
        "After lab work and a clinical consult, a GLP-1 medication is prescribed and titrated to the patient's response, self-administered as a weekly injection and monitored over time.",
    },
    hero: {
      eyebrow: "GLP-1 Weight Loss in Atlanta",
      heading: "GLP-1 weight loss in Atlanta, prescribed off your labs so the weight comes off and stays off.",
      paragraphs: [
        "If you have watched the weight creep up while everyone tells you to just eat less and move more, the problem was never your willpower. It is that nobody read the metabolism, hormones, and labs underneath the number.",
        "I am Dr. Nina Ross, ND PhD. Here a GLP-1 is prescribed from your actual labs and monitored as one move inside a plan that protects your muscle and treats why the weight came on. That is how you change your metabolism for good and keep the weight off.",
      ],
      secondaryLabel: "See the whole toolkit behind it →",
    },
    whatItIs: {
      heading: "A hormone your gut already makes, used to reset hunger and blood sugar.",
      intro:
        "GLP-1 medications like semaglutide mimic a hormone your body releases after eating. They slow digestion, steady blood sugar, and quiet the food noise that makes restriction feel impossible. That is real, and it works best when it is prescribed from your labs and paired with care for the rest of your health.",
      points: [
        "Appetite signaling calms down, so portions and cravings stop running the show.",
        "Slower digestion and a better insulin response flatten the spikes that drive storage.",
        "We titrate to your metabolism and tolerance, so each step is set for your body.",
      ],
    },
    whoFor: {
      heading: "GLP-1 is right for some people. It is wrong for others.",
      closing: "If that second list stung a little, good. That honesty is exactly what you are paying for here.",
      leftItems: [
        "Your weight has stalled despite real, consistent effort with food and movement",
        "Labs point to insulin resistance, PCOS, or a metabolism working against you",
        "You want medical support inside a plan, with monitoring and a clinician who knows you",
      ],
      rightItems: [
        "You want a shot with no interest in nutrition, muscle, or what your labs say",
        "You are hoping to inject now and quit next month with no plan to hold the loss",
        "You expect it to fix a thyroid, hormone, or gut issue it was never going to touch alone",
      ],
    },
    notBand: {
      label: "Not a shot mill",
      heading: "Every med-spa and online clinic sells semaglutide now. This is not that.",
      paragraph:
        "At a shot mill you fill out a form, get a vial in the mail, and titrate up alone until the side effects or the plateau stop you. No labs, no muscle plan, no one watching. Here, a GLP-1 is a physician\u2019s prescription dosed off your results, and it is one tool inside a plan protecting your muscle, your hormones, and the weight once it is gone.",
      callouts: [
        { title: "Prescribed off labs, not a web form", body: "Your dose follows your bloodwork, so you are treating a real metabolic picture, not guessing." },
        { title: "Muscle and nutrition protected, not ignored", body: "Rapid loss can cost you muscle. The plan around the shot is built to keep it." },
        { title: "A physician monitoring, not an auto-refill", body: "Screened, titrated, and tracked by a doctor who knows your whole history." },
      ],
    },
    whatToExpect: {
      heading: "From first consult to a loss that holds, step by step",
      steps: [
        { label: "Consult & labs", title: "We find out what is driving it", desc: "Your story and metabolic labs show what is actually behind the weight before any prescription." },
        { label: "Your protocol is set", title: "A dose written for you", desc: "Dr. Nina starts you low and titrates to your response, with muscle and nutrition built in from day one." },
        { label: "A weekly rhythm", title: "One simple weekly injection", desc: "You self-inject at home on a schedule, checking in with us as your body adjusts." },
        { label: "Re-check & hold", title: "We protect the progress", desc: "We track labs, muscle, and side effects, and plan how you hold the loss when you taper." },
      ],
    },
    related: [
      { slug: "hormone-restoration", desc: "When hormones are part of why the weight came on, this treats that root cause too." },
      { slug: "advanced-lab-testing", desc: "The metabolic and hormone workup that shows what is actually driving your weight." },
      { slug: "peptide-therapy", desc: "Targeted signaling support that can pair with a weight and metabolism plan." },
    ],
    faq: [
      { q: "Is GLP-1 / semaglutide safe?", a: "GLP-1 medications are FDA-approved and, when prescribed and monitored by a physician after proper screening, are generally well tolerated. Here they are dosed off your labs and titrated to your tolerance, with regular check-ins, instead of escalated on a fixed schedule by yourself." },
      { q: "Will I regain the weight when I stop?", a: "Regain is common when a GLP-1 is used alone and then stopped cold. That is exactly why we use it inside a plan that protects muscle, rebuilds your metabolism, and prepares a deliberate taper, so the loss can hold instead of bouncing back." },
      { q: "What are the side effects?", a: "The most common are nausea, reduced appetite, and digestive changes, usually strongest right after a dose increase. Starting low, titrating slowly to your response, and pairing the medication with nutrition support keeps most of these manageable." },
      { q: "Do I have to be on it forever?", a: "Not necessarily. For some it is a longer-term tool; for others it is a bridge while we correct the metabolic and hormonal drivers underneath. Your plan includes how you would taper and hold your progress, not only how you start." },
      { q: "How is this different from getting it online?", a: "Here a GLP-1 is prescribed off your labs, paired with a muscle-protecting nutrition plan, and monitored by a physician as one tool inside a complete functional medicine program." },
      { q: "How fast will I lose weight?", a: "It varies by person and dose, and the steadiest results come from gradual loss that protects muscle. We track labs, body composition, and how you feel, then adjust the plan so the weight comes off in a way you can actually keep." },
    ],
    startHeading: "A GLP-1 plan backed by real medical care.",
    startIntro: "GLP-1 is one tool inside your care plan, prescribed and monitored by a physician, with the nutrition and labs that make the loss actually hold.",
    bylineNote: "This page is for education and is not a substitute for individual medical advice. GLP-1 therapy at Nina Ross is physician-prescribed after appropriate screening and is provided alongside, not in place of, your primary and specialty care.",
  },
  {
    slug: "hormone-restoration",
    metaTitle: "Hormone Restoration & BHRT in Atlanta | Dr. Nina Ross, ND PhD",
    metaDescription:
      "Bioidentical hormone restoration (BHRT) in Atlanta, prescribed and monitored by Dr. Nina Ross, ND PhD off real testing, as part of root-cause functional medicine. Start with a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/hormone-restoration-share.jpg",
    breadcrumbLabel: "Hormone Restoration",
    slotPrefix: "hrmD",
    therapy: {
      name: "Hormone Restoration",
      alternateName: "Bioidentical hormone replacement therapy (BHRT)",
      description:
        "Bioidentical hormone restoration for women and men, prescribed and dosed from comprehensive hormone testing and monitored over time within a personalized functional medicine plan.",
      howPerformed:
        "After hormone testing and a clinical consult, a bioidentical hormone protocol is prescribed and dosed to the patient, then monitored and adjusted with follow-up testing.",
    },
    hero: {
      eyebrow: "Hormone Restoration in Atlanta",
      heading: "Hormone restoration in Atlanta, dosed off real testing to bring back your energy and sleep.",
      paragraphs: [
        "If the fatigue, the sleep, the mood, the libido all changed and you were told it is just age, the problem was never \u201Cjust age.\u201D It is that nobody actually tested and restored the hormones underneath it.",
        "I am Dr. Nina Ross, ND PhD. Here hormone restoration is prescribed off real testing and titrated to you, as one move inside a plan that treats the whole picture. That is how you go from feeling medicated to feeling like yourself again.",
      ],
      secondaryLabel: "See the whole toolkit behind it →",
    },
    whatItIs: {
      heading: "Bringing your hormones back to where you function, then keeping them there.",
      intro:
        "Hormone restoration uses bioidentical hormones, matched to what your body makes, to bring estrogen, progesterone, testosterone, thyroid, or adrenal support back into a functional range. That can be genuinely life-changing when the dose is built on real testing and adjusted with follow-up.",
      points: [
        "Hormones matched to what your body makes, so your physiology recognizes them.",
        "Your protocol follows comprehensive hormone testing, not a standard pellet for everyone.",
        "We re-test and adjust, so you stay in the range where you actually feel good.",
      ],
    },
    whoFor: {
      heading: "Hormone restoration is right for some people. It is wrong for others.",
      closing: "If that second list stung a little, good. That honesty is exactly what you are paying for here.",
      leftItems: [
        "Fatigue, sleep, mood, libido, or cycles changed and testing shows real hormone shifts",
        "You are in perimenopause, menopause, or low-testosterone territory and want to feel like you",
        "You want it dosed off testing and monitored so you keep feeling like you",
      ],
      rightItems: [
        "You want a quick hormone fix with no testing or follow-up",
        "You are hoping hormones alone will fix something they were never going to touch",
        "You are not willing to test, re-test, and adjust as your body changes",
      ],
    },
    notBand: {
      label: "Not a pellet mill",
      heading: "Plenty of clinics hand out the same pellet to everyone. This is not that.",
      paragraph:
        "At a pellet mill you get a standard dose, a quick visit, and little follow-up. No comprehensive testing, no titration, no one watching how you respond. Here, hormone restoration is prescribed off real testing and adjusted to you, as one tool inside a plan treating the whole picture.",
      callouts: [
        { title: "Dosed off testing, not a default", body: "Your protocol follows comprehensive hormone testing, so you are restoring what is actually low." },
        { title: "Titrated to you, not a stock pellet", body: "We adjust to your response and symptoms, not a single dose for everyone." },
        { title: "A physician monitoring, not a refill", body: "Re-tested and tracked by a doctor who knows your whole history." },
      ],
    },
    whatToExpect: {
      heading: "From first consult to feeling like yourself, step by step",
      steps: [
        { label: "Consult & testing", title: "We test what is really going on", desc: "Your story and comprehensive hormone testing show exactly what has shifted, before any prescription." },
        { label: "Your protocol is set", title: "A protocol written for you", desc: "Dr. Nina prescribes bioidentical hormones dosed to your results, not a standard pellet." },
        { label: "A simple routine", title: "An easy ongoing rhythm", desc: "Your protocol fits into daily life, with check-ins as your body settles into the new range." },
        { label: "Re-test & adjust", title: "We keep you dialed in", desc: "We re-test and fine-tune over time, so you stay where you feel your best." },
      ],
    },
    related: [
      { slug: "dutch-test", desc: "The comprehensive hormone map that a restoration protocol is dosed from." },
      { slug: "advanced-lab-testing", desc: "Thyroid and metabolic testing that often travels alongside hormone shifts." },
      { slug: "peptide-therapy", desc: "Signaling support that can complement a hormone restoration protocol." },
    ],
    faq: [
      { q: "What is hormone restoration / BHRT?", a: "It is the use of bioidentical hormones, matched to what your body makes, to restore estrogen, progesterone, testosterone, or related support to a functional range. Here it is prescribed off comprehensive testing and monitored over time, not handed out as a standard dose." },
      { q: "Is bioidentical hormone therapy safe?", a: "When prescribed off proper testing, dosed individually, and monitored by a physician, BHRT is generally well tolerated for appropriate candidates. The risk rises with blanket dosing and no follow-up, which is exactly what we avoid by testing and re-testing." },
      { q: "Is this just testosterone pellets?", a: "We use the form and combination that fits your testing and goals, which may include creams, capsules, or other delivery, for women and men. The protocol is built around your results, not a single default product." },
      { q: "How long until I feel a difference?", a: "Many people notice changes in sleep, energy, and mood within a few weeks, with fuller benefits as the protocol is dialed in. Because we re-test and adjust, the goal is steady improvement, not a quick spike." },
      { q: "How is this different from a pellet clinic?", a: "Here hormones are prescribed off comprehensive testing, titrated to your body, and monitored by a physician as one tool inside a complete plan." },
      { q: "Can I just get hormones without becoming a patient?", a: "Hormone restoration here is always part of physician-led care. You start with a $99 Symptom Consultation so it can be tested, dosed, and monitored safely." },
    ],
    startHeading: "Hormones restored with real testing.",
    startIntro: "Hormone restoration is one tool inside your care plan, prescribed off real testing and monitored by a physician, so you are restored to where you actually feel good.",
    bylineNote: "This page is for education and is not a substitute for individual medical advice. Hormone restoration at Nina Ross is physician-prescribed after appropriate testing and screening and is provided alongside, not in place of, your primary and specialty care.",
  },
  {
    slug: "hyperbaric-oxygen-therapy",
    metaTitle: "Hyperbaric Oxygen Therapy (HBOT) in Atlanta | Dr. Nina Ross, ND PhD",
    metaDescription:
      "Hyperbaric oxygen therapy (HBOT) in Atlanta, physician-supervised and ordered for a clear purpose by Dr. Nina Ross, ND PhD as part of root-cause functional medicine. Start with a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/hyperbaric-oxygen-therapy-share.jpg",
    breadcrumbLabel: "Hyperbaric O\u2082",
    slotPrefix: "hboD",
    therapy: {
      name: "Hyperbaric Oxygen Therapy",
      alternateName: "HBOT",
      description:
        "Hyperbaric oxygen therapy (HBOT), in which the patient breathes oxygen in a pressurized chamber to support healing and recovery, used under physician supervision within a personalized functional medicine plan.",
      howPerformed:
        "Under physician supervision at the Atlanta clinic, the patient rests in a pressurized chamber breathing oxygen over a session, on a cadence matched to their plan.",
    },
    hero: {
      eyebrow: "Hyperbaric Oxygen Therapy in Atlanta",
      heading: "Hyperbaric oxygen in Atlanta, programmed to speed healing and clear the brain fog.",
      paragraphs: [
        "If you have looked into hyperbaric oxygen for recovery, healing, or brain fog, the science behind it is genuinely interesting. The risk is renting chamber time somewhere that treats it as a wellness novelty with no plan.",
        "I am Dr. Nina Ross, ND PhD. Here HBOT is ordered for a specific reason and supervised, as one move inside a plan treating what is actually slowing your recovery. That is how chamber time turns into real, measurable healing.",
      ],
      secondaryLabel: "See the whole toolkit behind it →",
    },
    whatItIs: {
      heading: "More oxygen, under pressure, to support healing where it is stalled.",
      intro:
        "In HBOT you breathe oxygen in a pressurized chamber, which raises how much oxygen your blood and tissues can carry, supporting healing and recovery. The mechanism is real and well-studied, and it delivers when the sessions are ordered for a clear reason and built into your plan.",
      points: [
        "Pressurization lets your blood carry more oxygen to tissues that are healing or recovering.",
        "It is commonly used to support recovery, healing, and cognitive symptoms within a wider plan.",
        "We use it when your situation supports it, so every session has a clear purpose.",
      ],
    },
    whoFor: {
      heading: "HBOT is right for some people. It is wrong for others.",
      closing: "If that second list stung a little, good. That honesty is exactly what you are paying for here.",
      leftItems: [
        "You are recovering or healing and want oxygen support inside a real plan",
        "You are dealing with stubborn fatigue or brain fog with a cause worth addressing",
        "You want it ordered for a clear reason and supervised inside a real plan",
      ],
      rightItems: [
        "You want a wellness nap with no interest in why recovery is stalled",
        "You are hoping a chamber replaces a real workup or plan",
        "You expect it to fix a root cause it was never going to touch alone",
      ],
    },
    notBand: {
      label: "Not a wellness rental",
      heading: "Chambers are popping up in every spa now. This is not that.",
      paragraph:
        "Rent chamber time off a menu and it is just an expensive nap you hope helps. No labs, no reason, no supervision plan. Here, HBOT is ordered for a specific purpose and supervised, as one tool inside a plan treating the actual cause of what is slowing you down.",
      callouts: [
        { title: "Ordered for a reason, not by the hour", body: "We use HBOT for a specific, justifiable purpose, so the time actually counts." },
        { title: "One tool in a plan, not the answer", body: "The chamber supports the work; the plan around it is what actually moves your health." },
        { title: "A physician supervising, not a front desk", body: "Screened, ordered, and supervised by a doctor who knows your whole history." },
      ],
    },
    whatToExpect: {
      heading: "From first consult to your session, step by step",
      steps: [
        { label: "Consult & labs", title: "We find the reason", desc: "Your story and workup show whether HBOT fits and why, before any chamber time is booked." },
        { label: "Your protocol is set", title: "A plan written for you", desc: "Dr. Nina decides if and how HBOT fits your goals, with the rest of your plan around it." },
        { label: "The session", title: "A calm, easy session", desc: "You rest comfortably in the chamber while the session runs, with your comfort and safety watched." },
        { label: "Re-check & adjust", title: "We confirm it is working", desc: "We re-check progress as your plan moves, so each session is justified by where you are now." },
      ],
    },
    related: [
      { slug: "ozone-therapy", desc: "Another physician-supervised therapy often considered for related recovery goals." },
      { slug: "eboo-therapy", desc: "A blood-based approach to oxygenation and inflammatory support." },
      { slug: "red-light-therapy", desc: "Cellular support that can pair with a recovery-focused plan." },
    ],
    faq: [
      { q: "What is hyperbaric oxygen therapy?", a: "In HBOT you breathe oxygen in a pressurized chamber, which lets your blood and tissues carry more oxygen than usual. It is used to support healing, recovery, and certain cognitive symptoms. Here it is ordered for a specific reason and supervised by a physician." },
      { q: "Is hyperbaric oxygen therapy safe?", a: "Used under physician supervision after appropriate screening, HBOT is generally well tolerated. Certain conditions need to be screened for first, which is exactly why care here starts with a consult rather than a walk-in rental." },
      { q: "What is HBOT used for?", a: "It is commonly used to support recovery, wound and tissue healing, and some cognitive and fatigue symptoms, as part of a broader plan. It is chosen when your situation supports it, not as routine chamber time." },
      { q: "How many HBOT sessions do I need?", a: "It depends on what we are addressing. Some goals call for a series of sessions, others for occasional support. Inside the membership plan you use it as your plan calls for, instead of paying by the hour." },
      { q: "How is this different from a spa chamber?", a: "Here HBOT is ordered for a specific purpose, supervised by a physician, and used as one tool inside a complete plan built around your goals and your testing." },
      { q: "Can I just book HBOT without becoming a patient?", a: "HBOT here is always part of physician-led care. You start with a $99 Symptom Consultation so it can be ordered and supervised safely and actually fit your needs." },
    ],
    startHeading: "Hyperbaric oxygen, built into your care program.",
    startIntro: "HBOT is one tool inside your care plan, ordered for a reason and supervised by a physician, so the time supports real, measurable healing.",
    bylineNote: "This page is for education and is not a substitute for individual medical advice. Hyperbaric oxygen therapy at Nina Ross is physician-ordered and supervised after appropriate screening and is provided alongside, not in place of, your primary and specialty care.",
  },
  {
    slug: "iv-therapy",
    metaTitle: "IV Therapy in Atlanta | Dr. Nina Ross, ND PhD",
    metaDescription:
      "IV therapy in Atlanta, prescribed off your labs by Dr. Nina Ross, ND PhD so you actually feel the difference. Vitamin and hydration therapy as part of root-cause functional medicine. Start with a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/iv-therapy-share.jpg",
    breadcrumbLabel: "IV Therapy",
    slotPrefix: "ivtD",
    therapy: {
      name: "IV Therapy",
      alternateName: "Intravenous nutrient therapy",
      description:
        "Intravenous delivery of vitamins, minerals, amino acids, and hydration, dosed from advanced lab testing, used within a personalized functional medicine care plan.",
      howPerformed:
        "A physician-ordered blend is infused intravenously over roughly 30 to 45 minutes at the Atlanta clinic, matched to the patient's lab results.",
    },
    hero: {
      eyebrow: "IV Therapy in Atlanta",
      heading: "IV therapy in Atlanta, prescribed off your labs so you actually feel the difference.",
      paragraphs: [
        "If you have been chasing energy through one more drip at the wellness bar and still crash by two in the afternoon, the problem was never the bag. It is that nobody read why you are running on empty in the first place.",
        "I am Dr. Nina Ross, ND PhD. Here an IV is ordered from your actual labs and given as one move inside a plan that treats the reason you needed it. That is how you trade a short afternoon buzz for getting your energy genuinely back.",
      ],
      secondaryLabel: "See what we can put in the bag →",
    },
    whatItIs: {
      heading: "Nutrients straight to your bloodstream, past a gut that may not absorb them.",
      intro:
        "IV therapy delivers vitamins, minerals, amino acids, and fluids directly into your veins, skipping the digestive system entirely. That is the whole mechanism, and it is real. The drip is a delivery method, so it works best when the blend is ordered from your labs and built into the plan that treats the cause.",
      points: [
        "Close to full availability of what is infused, because nothing is lost to digestion.",
        "Hydration and nutrients reach your cells fast, which is why depletion lifts quickly.",
        "The blend is built from what you are actually low on, so every nutrient earns its place.",
      ],
    },
    whoFor: {
      heading: "IV therapy is right for some people. It is wrong for others.",
      closing: "If that second list stung a little, good. That honesty is exactly what you are paying for here.",
      leftItems: [
        "Your gut does not absorb nutrients well, from IBS, reflux, or after surgery",
        "You are depleted, run-down, or recovering and oral supplements are not cutting it",
        "Your labs show real deficiencies we can correct faster intravenously",
      ],
      rightItems: [
        "You want a one-time buzz with no interest in why you are tired",
        "You are hoping a drip can replace sleep, food, or a real workup",
        "You expect it to fix a root cause it was never going to touch alone",
      ],
    },
    notBand: {
      label: "Not a drip bar",
      heading: "Every corner has an IV lounge now. This is not that.",
      paragraph:
        "At a drip lounge you pick a bag off a board, pay at the counter, and hope it does something. There is no chart, no labs, no one asking why you needed it. Here, an IV is a physician\u2019s order written off your results, and it is one tool inside a plan that is treating the actual cause.",
      callouts: [
        { title: "Ordered off labs, not a menu", body: "Your blend follows your bloodwork, so you are correcting something real, not guessing." },
        { title: "One tool in a plan, not the answer", body: "The drip supports the work; the plan around it is what actually moves your health." },
        { title: "A physician in the room, not an upsell", body: "Screened, dosed, and watched by a doctor who knows your whole history." },
      ],
    },
    whatToExpect: {
      heading: "From first consult to your drip, step by step",
      steps: [
        { label: "Consult & labs", title: "We find out what is missing", desc: "Your story and advanced labs tell us what you are actually depleted in, before a single drip." },
        { label: "Your blend is built", title: "A formula written for you", desc: "Dr. Nina orders the exact mix and dose your results call for, built for your body." },
        { label: "The drip", title: "Thirty to forty-five calm minutes", desc: "You relax in the chair while the infusion runs. Most people feel the lift the same day." },
        { label: "Re-check & adjust", title: "We confirm it is working", desc: "We re-test as your plan moves, so the next infusion is dosed off where you are now." },
      ],
    },
    related: [
      { slug: "vitamin-injections", desc: "A faster, simpler nutrient option when a full infusion is not what you need." },
      { slug: "advanced-lab-testing", desc: "The workup that shows exactly what your IV blend should correct." },
      { slug: "peptide-therapy", desc: "Signaling support that can pair with an IV-based recovery plan." },
    ],
    faq: [
      { q: "What is IV therapy and how does it work?", a: "It delivers vitamins, minerals, amino acids, and fluids straight into your bloodstream, bypassing a gut that may not be absorbing them well. Because nothing is lost to digestion, your cells get close to full availability of what is infused, often felt within hours. Here the blend is ordered by a physician from your labs, not chosen off a menu." },
      { q: "Is IV therapy worth it, or just expensive hydration?", a: "A random drip with no workup behind it usually is a waste. It is worth it when it is dosed off real deficiencies and used to correct something specific, inside a plan that is also treating why you got depleted. That is the only way we use it." },
      { q: "What is in your IV blends?", a: "Common ingredients include saline for hydration, B vitamins, vitamin C, magnesium, zinc, and amino acids, combined and dosed to your labs and goals. Dr. Nina builds each blend individually rather than offering a fixed off-the-shelf menu." },
      { q: "Is IV therapy safe?", a: "When it is physician-ordered and given by trained clinicians after appropriate screening, IV nutrient therapy is generally well tolerated. We review your history and labs first, which is exactly why care here starts with a consult, not a walk-in drip." },
      { q: "How often do I need it?", a: "It depends on what your labs show. Some patients benefit from a short series, others from occasional support. Inside the membership care plan you use IV therapy as your plan calls for it, instead of paying per bag." },
      { q: "Can I just book a drip without becoming a patient?", a: "IV therapy here is always part of physician-led care. You start with a $99 Symptom Consultation so it can be ordered safely and actually fit what your body needs." },
    ],
    startHeading: "IV therapy, built into your care program.",
    startIntro: "IV therapy is one tool inside your care plan, so once you are in the program you use it as your labs call for it, included rather than billed by the bag.",
    bylineNote: "This page is for education and is not a substitute for individual medical advice. IV therapy at Nina Ross is physician-ordered after appropriate screening and is provided alongside, not in place of, your primary and specialty care.",
  },
  {
    slug: "lymphatic-drainage",
    metaTitle: "Lymphatic Drainage in Atlanta | Dr. Nina Ross, ND PhD",
    metaDescription:
      "Lymphatic drainage in Atlanta, used for a clinical reason within a root-cause plan by Dr. Nina Ross, ND PhD to move puffiness and speed healing. Start with a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/lymphatic-drainage-share.jpg",
    breadcrumbLabel: "Lymphatic Drainage",
    slotPrefix: "lymD",
    therapy: {
      name: "Lymphatic Drainage",
      alternateName: "Manual and assisted lymphatic drainage",
      description:
        "Lymphatic drainage therapy that supports the movement of lymph fluid to aid detoxification, reduce swelling, and support recovery, used within a personalized functional medicine plan.",
      howPerformed:
        "At the Atlanta clinic, gentle manual or assisted techniques are used to support lymphatic flow over a session, as part of the patient\u2019s broader plan.",
    },
    hero: {
      eyebrow: "Lymphatic Drainage in Atlanta",
      heading: "Lymphatic drainage in Atlanta that moves the puffiness and helps you heal faster.",
      paragraphs: [
        "If you carry puffiness, sluggishness, or post-surgery swelling and keep being offered a relaxing \u201Cdrainage\u201D session, the technique can genuinely help. The waste is doing it with no clinical reason and no plan around it.",
        "I am Dr. Nina Ross, ND PhD. Here lymphatic drainage is used for a clinical reason inside a plan that addresses why your system is congested in the first place. That is how an hour of bodywork turns into real, lasting relief.",
      ],
      secondaryLabel: "See the whole toolkit behind it →",
    },
    whatItIs: {
      heading: "Helping your lymph move, so swelling, recovery, and sluggishness ease.",
      intro:
        "Lymphatic drainage uses gentle, rhythmic techniques to support the flow of lymph fluid, which carries waste and supports immune function. Done for the right reason it genuinely helps with swelling, recovery, and sluggishness, especially when it is paired with a plan that treats the cause of the congestion.",
      points: [
        "Gentle techniques encourage lymph to move, helping with puffiness, swelling, and sluggishness.",
        "It is often used to support recovery, post-procedure swelling, and a feeling of lightness.",
        "We use it when it fits your plan and goals, so each session does real work.",
      ],
    },
    whoFor: {
      heading: "Lymphatic drainage is right for some people. It is wrong for others.",
      closing: "If that second list stung a little, good. That honesty is exactly what you are paying for here.",
      leftItems: [
        "You have swelling, puffiness, or sluggishness with a cause worth addressing",
        "You are recovering from a procedure and want supported, gentle drainage",
        "You want it used for a clinical reason inside a real plan that does real work",
      ],
      rightItems: [
        "You want a relaxing add-on with no interest in why you are congested",
        "You are hoping a session alone will detox or fix a deeper issue",
        "You expect it to replace a real workup or the rest of your plan",
      ],
    },
    notBand: {
      label: "Not a spa add-on",
      heading: "Every spa offers lymphatic drainage now. This is not that.",
      paragraph:
        "At a spa, drainage is sold as an hour of pampering you hope does something. No reason, no plan, no one asking why you are congested. Here, lymphatic drainage is used for a clinical reason inside a plan that addresses the cause behind the swelling or sluggishness.",
      callouts: [
        { title: "Used for a reason, not a treat", body: "We use drainage when it fits your goals and plan, so the session actually counts." },
        { title: "One tool in a plan, not the answer", body: "The session supports the work; the plan around it is what actually moves your health." },
        { title: "Clinically directed, not an upsell", body: "Guided by a plan from a physician who knows your whole history." },
      ],
    },
    whatToExpect: {
      heading: "From first consult to your session, step by step",
      steps: [
        { label: "Consult & labs", title: "We find the reason", desc: "Your story and goals show whether drainage fits and why, before anything is scheduled." },
        { label: "Your protocol is set", title: "A plan written for you", desc: "Dr. Nina decides how drainage fits your goals, with the rest of your plan around it." },
        { label: "The session", title: "A gentle, calming session", desc: "You relax through gentle, rhythmic techniques that support your lymphatic flow." },
        { label: "Re-check & adjust", title: "We confirm it is helping", desc: "We check how you respond as your plan moves, so each session is justified by where you are now." },
      ],
    },
    related: [
      { slug: "red-light-therapy", desc: "Cellular support that often pairs with drainage for recovery and skin goals." },
      { slug: "hyperbaric-oxygen-therapy", desc: "Additional support for healing and recovery inside the same plan." },
      { slug: "iv-therapy", desc: "Nutrient and hydration support that can complement a drainage protocol." },
    ],
    faq: [
      { q: "What is lymphatic drainage?", a: "It uses gentle, rhythmic techniques to support the movement of lymph fluid, which carries waste and supports immune function. It can help with puffiness, swelling, and recovery. Here it is used for a clinical reason inside your plan, not as a stand-alone spa service." },
      { q: "Is lymphatic drainage safe?", a: "For most people it is gentle and well tolerated. Certain conditions should be screened for first, which is why care here begins with a consult so it is used appropriately and for the right reason." },
      { q: "What is lymphatic drainage good for?", a: "It is commonly used to support swelling and puffiness, post-procedure recovery, and a feeling of lightness and sluggishness, as part of a broader plan. We use it when it fits your goals, not as a routine add-on." },
      { q: "How many sessions do I need?", a: "It depends on what we are supporting. Some goals call for a short series, others for occasional sessions. Inside the membership plan you use it as your plan calls for, instead of paying per session." },
      { q: "How is this different from a spa drainage session?", a: "Here drainage is used for a clinical purpose inside a plan directed by a physician who is also treating the root cause of the congestion." },
      { q: "Can I just book a session without becoming a patient?", a: "Drainage here is always part of physician-led care. You start with a $99 Symptom Consultation so it is used for the right reason and fits your plan." },
    ],
    startHeading: "Lymphatic drainage, built into your care program.",
    startIntro: "Lymphatic drainage is one tool inside your care plan, used for a clinical reason, so each session supports real, lasting relief.",
    bylineNote: "This page is for education and is not a substitute for individual medical advice. Lymphatic drainage at Nina Ross is provided within a clinical plan after appropriate screening and is offered alongside, not in place of, your primary and specialty care.",
  },
  {
    slug: "ozone-therapy",
    metaTitle: "Ozone Therapy in Atlanta | Dr. Nina Ross, ND PhD",
    metaDescription:
      "Ozone therapy in Atlanta, physician-supervised and ordered off your labs by Dr. Nina Ross, ND PhD as part of root-cause functional medicine that treats the cause. Start with a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/ozone-therapy-share.jpg",
    breadcrumbLabel: "Ozone Therapy",
    slotPrefix: "ozoD",
    therapy: {
      name: "Ozone Therapy",
      alternateName: "Medical ozone therapy",
      description:
        "Medical ozone therapy, delivered through routes appropriate to the patient, used to support oxidative balance and immune function under physician supervision within a personalized functional medicine plan.",
      howPerformed:
        "Under physician supervision at the Atlanta clinic, medical ozone is administered through the route appropriate to the patient over a session, as part of their broader plan.",
    },
    hero: {
      eyebrow: "Ozone Therapy in Atlanta",
      heading: "Ozone therapy in Atlanta, physician-supervised to calm inflammation and lift your energy.",
      paragraphs: [
        "If you have read about ozone for inflammation, infection, or stubborn immune issues, the interest is understandable. The risk is doing a powerful therapy somewhere that treats it as a novelty with no workup.",
        "I am Dr. Nina Ross, ND PhD. Here ozone is ordered off your labs and given under physician supervision, as one move inside a plan treating the reason behind your symptoms. That is how it becomes real, lasting support.",
      ],
      secondaryLabel: "See the whole toolkit behind it →",
    },
    whatItIs: {
      heading: "A controlled oxidative nudge, delivered under medical supervision.",
      intro:
        "Medical ozone delivers a controlled dose of ozone to gently stimulate your body\u2019s oxidative and immune responses. The mechanism is real and the therapy is powerful, and it delivers when it is ordered off your labs and run inside a plan that treats the cause.",
      points: [
        "A measured ozone dose nudges your antioxidant and immune systems, used carefully and precisely.",
        "It is commonly used to support immune balance and oxidative load as part of a wider plan.",
        "We use it for a specific reason your testing supports, so each session has a clear purpose.",
      ],
    },
    whoFor: {
      heading: "Ozone therapy is right for some people. It is wrong for others.",
      closing: "If that second list stung a little, good. That honesty is exactly what you are paying for here.",
      leftItems: [
        "You are dealing with inflammatory, immune, or oxidative issues your workup supports",
        "You want advanced support inside a supervised, root-cause plan",
        "You want it ordered for a clear reason and given by clinicians inside a plan",
      ],
      rightItems: [
        "You want a trendy one-off with no interest in why you have symptoms",
        "You are hoping a single therapy replaces a real workup or plan",
        "You expect it to fix a root cause it was never going to touch alone",
      ],
    },
    notBand: {
      label: "Not a biohack",
      heading: "Ozone is having a moment online. That is exactly the problem.",
      paragraph:
        "Booked off a menu with no workup, ozone is just a novelty you hope helps. No labs, no supervision plan, no one asking why you needed it. Here, ozone is ordered off your results and given under physician supervision, as one tool inside a plan treating the actual cause.",
      callouts: [
        { title: "Ordered off labs, not a menu", body: "We use ozone for a specific, testable reason, so you are treating something real." },
        { title: "One tool in a plan, not the answer", body: "The session supports the work; the plan around it is what actually moves your health." },
        { title: "A physician supervising, not an upsell", body: "Screened, ordered, and supervised by a doctor who knows your whole history." },
      ],
    },
    whatToExpect: {
      heading: "From first consult to your session, step by step",
      steps: [
        { label: "Consult & labs", title: "We find the reason", desc: "Your story and labs show whether ozone fits and why, before anything is scheduled." },
        { label: "Your protocol is set", title: "A plan written for you", desc: "Dr. Nina decides if and how ozone fits your goals, with the rest of your plan around it." },
        { label: "The session", title: "A supervised, calm session", desc: "You are cared for while the therapy is given under clinical supervision and the right route for you." },
        { label: "Re-check & adjust", title: "We confirm it is working", desc: "We re-check your markers as your plan moves, so each step is justified by where you are now." },
      ],
    },
    related: [
      { slug: "eboo-therapy", desc: "A blood-based oxidative and oxygenation therapy often considered alongside ozone." },
      { slug: "hyperbaric-oxygen-therapy", desc: "Another route to oxygen support for related recovery and immune goals." },
      { slug: "advanced-lab-testing", desc: "The workup that confirms whether ozone actually fits your picture." },
    ],
    faq: [
      { q: "What is ozone therapy?", a: "Medical ozone therapy delivers a controlled dose of ozone to gently stimulate your antioxidant and immune responses. It is used to support immune balance and oxidative load. Here it is ordered off your labs, given through the appropriate route, and supervised by a physician." },
      { q: "Is ozone therapy safe?", a: "Given under physician supervision by trained clinicians, through appropriate routes and doses after screening, medical ozone is generally well tolerated. Screening matters, which is why care here starts with a consult and labs rather than a walk-in booking." },
      { q: "What is ozone therapy used for?", a: "It is commonly used as support for immune balance, inflammatory and oxidative load, and certain infections, as part of a broader plan. It is chosen for a specific reason your testing supports, not as a routine add-on." },
      { q: "How many ozone sessions do I need?", a: "It depends on what your labs show and what we are addressing. Some patients benefit from a short series, others from occasional sessions. Inside the membership plan you use it as your plan calls for, instead of paying per session." },
      { q: "How is this different from a wellness lounge?", a: "Here ozone is ordered off your lab results and supervised by a physician as one tool inside a complete functional medicine plan." },
      { q: "Can I just book ozone without becoming a patient?", a: "Ozone here is always part of physician-led care. You start with a $99 Symptom Consultation so it can be ordered and supervised safely and actually fit your needs." },
    ],
    startHeading: "Ozone, built into your care program.",
    startIntro: "Ozone is one tool inside your care plan, ordered for a reason and supervised by a physician, so each session supports real, lasting progress.",
    bylineNote: "This page is for education and is not a substitute for individual medical advice. Ozone therapy at Nina Ross is physician-ordered and supervised after appropriate screening and is provided alongside, not in place of, your primary and specialty care.",
  },
  {
    slug: "peptide-therapy",
    metaTitle: "Peptide Therapy in Atlanta | Dr. Nina Ross, ND PhD",
    metaDescription:
      "Peptide therapy in Atlanta, prescribed and monitored by Dr. Nina Ross, ND PhD as part of root-cause functional medicine, sourced and dosed for real results. Start with a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/peptide-therapy-share.jpg",
    breadcrumbLabel: "Peptide Therapy",
    slotPrefix: "pepD",
    therapy: {
      name: "Peptide Therapy",
      alternateName: "Therapeutic peptide protocols",
      description:
        "Physician-prescribed therapeutic peptides for goals such as recovery, tissue repair, metabolism, and resilience, dosed from labs and goals within a personalized functional medicine plan.",
      howPerformed:
        "After lab work and a clinical consult, a peptide protocol is prescribed and dosed to the patient's goals, typically self-administered and monitored over time.",
    },
    hero: {
      eyebrow: "Peptide Therapy in Atlanta",
      heading: "Peptide therapy in Atlanta, prescribed and monitored for real recovery and resilience.",
      paragraphs: [
        "If you have read the peptide threads and wondered whether the recovery, the resilience, the edge are real, the science is genuinely promising. The risk is in the vial of unknown origin and the dose you are guessing at alone.",
        "I am Dr. Nina Ross, ND PhD. Here peptides are prescribed from your labs and goals and monitored as one move inside a plan with a physician watching. That is how a peptide becomes a tool you can actually trust.",
      ],
      secondaryLabel: "See the whole toolkit behind it →",
    },
    whatItIs: {
      heading: "Small signaling molecules that tell your body to repair, recover, and regulate.",
      intro:
        "Peptides are short chains of amino acids that act as precise signals, nudging your body toward repair, recovery, metabolism, or resilience depending on the peptide. That potential is real and genuinely promising, and it pays off when the peptide is sourced properly and dosed off your labs by a physician.",
      points: [
        "Each peptide targets a specific job, so a protocol is matched to your goal rather than a catch-all.",
        "Common goals include tissue repair, recovery, sleep, metabolism, and immune support.",
        "We dose to your bloodwork and goals and adjust over time, so it keeps working for you.",
      ],
    },
    whoFor: {
      heading: "Peptide therapy is right for some people. It is wrong for others.",
      closing: "If that second list stung a little, good. That honesty is exactly what you are paying for here.",
      leftItems: [
        "You are focused on recovery, repair, or resilience and want a real, monitored tool",
        "You want the upside of peptides without sourcing gray-market vials and guessing doses",
        "You want them inside a plan, with labs and a physician tracking your response",
      ],
      rightItems: [
        "You want a quick fix with no interest in labs, dosing, or monitoring",
        "You are hoping a peptide replaces sleep, training, nutrition, or a real workup",
        "You expect it to fix something it was never designed to touch",
      ],
    },
    notBand: {
      label: "Not the gray market",
      heading: "The internet will sell you any peptide today. That is exactly the problem.",
      paragraph:
        "Order from a research site and you get an unverified vial, a forum protocol, and all the risk on you. No labs, no oversight, no one accountable. Here, a peptide is a physician\u2019s prescription dosed off your results, sourced properly, and used as one tool inside a monitored plan.",
      callouts: [
        { title: "Prescribed and sourced properly", body: "A real prescription and verified sourcing, not a vial of unknown origin from a research site." },
        { title: "Dosed off labs, not a forum", body: "Your protocol follows your bloodwork and goals, so you are not guessing in the dark." },
        { title: "A physician monitoring, not you alone", body: "Screened, dosed, and tracked by a doctor who knows your whole history." },
      ],
    },
    whatToExpect: {
      heading: "From first consult to a protocol that fits, step by step",
      steps: [
        { label: "Consult & labs", title: "We define the goal", desc: "Your goals and labs show whether peptides fit and which ones, before anything is prescribed." },
        { label: "Your protocol is set", title: "A protocol written for you", desc: "Dr. Nina prescribes and doses the right peptide to your goals, sourced properly, with a clear plan." },
        { label: "A simple routine", title: "An easy at-home rhythm", desc: "Most protocols are simple to follow at home, with check-ins as your body responds." },
        { label: "Re-check & hold", title: "We confirm it is working", desc: "We track your response and labs and adjust the protocol so it keeps doing its job." },
      ],
    },
    related: [
      { slug: "hormone-restoration", desc: "Hormone support that often pairs with a peptide protocol for recovery and vitality." },
      { slug: "glp-1-weight-loss", desc: "Metabolic support that can complement a peptide-based plan." },
      { slug: "advanced-lab-testing", desc: "The lab workup a peptide protocol is dosed and monitored against." },
    ],
    faq: [
      { q: "What is peptide therapy?", a: "Peptides are short chains of amino acids that act as signals in the body. Used therapeutically, specific peptides can support recovery, tissue repair, metabolism, sleep, and immune function. Here they are prescribed and dosed to your goals and labs, not chosen off a generic protocol." },
      { q: "Are peptides safe?", a: "When prescribed by a physician, sourced properly, and dosed and monitored after appropriate screening, peptide therapy is generally well tolerated. The real risk comes from gray-market vials of unknown quality and self-dosing, which is exactly what we avoid here." },
      { q: "What can peptides actually help with?", a: "Common goals include recovery and tissue repair, metabolic support, sleep, and resilience. The right peptide depends on your goal and labs, which is why a protocol is built individually rather than sold as one-size-fits-all." },
      { q: "How are peptides taken?", a: "Most therapeutic peptides are given as small subcutaneous injections you can do at home, on a simple schedule. Dr. Nina sets the protocol and adjusts it based on how you respond." },
      { q: "How is this different from ordering peptides online?", a: "Here a peptide is a real prescription, sourced from a licensed pharmacy, dosed off your labs, and monitored by a physician as one tool inside a complete plan." },
      { q: "Can I just get peptides without becoming a patient?", a: "Peptide therapy here is always part of physician-led care. You start with a $99 Symptom Consultation so it can be prescribed safely and actually fit your goals." },
    ],
    startHeading: "Peptides prescribed and monitored by a physician.",
    startIntro: "Peptide therapy is one tool inside your care plan, prescribed and monitored by a physician, sourced properly and dosed off your labs.",
    bylineNote: "This page is for education and is not a substitute for individual medical advice. Peptide therapy at Nina Ross is physician-prescribed after appropriate screening and is provided alongside, not in place of, your primary and specialty care.",
  },
  {
    slug: "red-light-therapy",
    metaTitle: "Red Light Therapy in Atlanta | Dr. Nina Ross, ND PhD",
    metaDescription:
      "Red light therapy (photobiomodulation) in Atlanta, dosed and programmed within a root-cause plan by Dr. Nina Ross, ND PhD so your skin and energy respond. Start with a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/red-light-therapy-share.jpg",
    breadcrumbLabel: "Red Light Therapy",
    slotPrefix: "redD",
    therapy: {
      name: "Red Light Therapy",
      alternateName: "Photobiomodulation",
      description:
        "Red and near-infrared light therapy (photobiomodulation) used to support cellular energy, skin, recovery, and tissue repair within a personalized functional medicine plan.",
      howPerformed:
        "At the Atlanta clinic, red and near-infrared light is delivered over a session at parameters matched to the goal, as part of the patient\u2019s broader plan.",
    },
    hero: {
      eyebrow: "Red Light Therapy in Atlanta",
      heading: "Red light therapy in Atlanta, dosed and programmed so your skin and energy respond.",
      paragraphs: [
        "If you have seen red light panels everywhere and wondered whether they do anything, the science of photobiomodulation is real. The catch is that dose and consistency matter, and a panel with no plan rarely delivers.",
        "I am Dr. Nina Ross, ND PhD. Here red light is dosed at the right wavelength for a specific goal and used consistently inside your plan, so it genuinely supports your skin, recovery, or energy. The dose and the reason behind it are what deliver the result.",
      ],
      secondaryLabel: "See the whole toolkit behind it →",
    },
    whatItIs: {
      heading: "Light your cells can actually use, dosed for a real goal.",
      intro:
        "Red and near-infrared light (photobiomodulation) is absorbed by your cells and can support energy production, skin, recovery, and tissue repair. The science is real, and the results come from getting the dose and consistency right and matching them to a clear goal.",
      points: [
        "Specific wavelengths support how your cells make energy, which underpins skin and recovery benefits.",
        "It is commonly used to support skin quality, recovery, and tissue repair within a wider plan.",
        "We match wavelength, dose, and consistency to your goal, so every session moves it forward.",
      ],
    },
    whoFor: {
      heading: "Red light therapy is right for some people. It is wrong for others.",
      closing: "If that second list stung a little, good. That honesty is exactly what you are paying for here.",
      leftItems: [
        "You have a clear goal, skin, recovery, or energy, that the right dosing can support",
        "You want it used consistently and correctly inside a real plan",
        "You want it matched to your goal and used consistently for a real result",
      ],
      rightItems: [
        "You want a warm glow with no interest in dose, consistency, or goal",
        "You are hoping a panel alone will fix something it can only support",
        "You expect it to replace a real workup or the rest of your plan",
      ],
    },
    notBand: {
      label: "Not a spa panel",
      heading: "Red light panels are in every gym and spa now. This is not that.",
      paragraph:
        "Sit under a panel off a menu and it is a warm glow you hope helps. No goal, no dosing, no plan. Here, red light is used at the right dose for a specific goal inside a plan, so it actually supports your skin, recovery, or energy.",
      callouts: [
        { title: "Dosed for a goal, not a glow", body: "We match the dose and consistency to your goal, so the sessions actually count." },
        { title: "One tool in a plan, not the answer", body: "The light supports the work; the plan around it is what actually moves your health." },
        { title: "Clinically matched, not an upsell", body: "Guided by a plan from a physician who knows your whole history and goals." },
      ],
    },
    whatToExpect: {
      heading: "From first consult to your sessions, step by step",
      steps: [
        { label: "Consult & labs", title: "We define the goal", desc: "Your goals show whether red light fits and for what, before any sessions begin." },
        { label: "Your protocol is set", title: "A plan written for you", desc: "Dr. Nina sets the dose, cadence, and goal, with the rest of your plan around it." },
        { label: "The sessions", title: "Simple, consistent sessions", desc: "You relax through short sessions at the dose and rhythm your goal calls for." },
        { label: "Re-check & adjust", title: "We confirm it is working", desc: "We check your progress toward the goal, so the dosing keeps earning its place." },
      ],
    },
    related: [
      { slug: "lymphatic-drainage", desc: "Body work that often pairs with red light for recovery and skin goals." },
      { slug: "hyperbaric-oxygen-therapy", desc: "Another cellular-support therapy for related recovery goals." },
      { slug: "vitamin-injections", desc: "Nutrient support that can complement a skin and energy-focused plan." },
    ],
    faq: [
      { q: "What is red light therapy?", a: "Red and near-infrared light (photobiomodulation) is absorbed by your cells and can support how they make energy, which underpins benefits for skin, recovery, and tissue repair. Here it is dosed for a specific goal inside your plan, not used as a generic glow." },
      { q: "Is red light therapy safe?", a: "Red light therapy is non-invasive and generally very well tolerated. The difference here is that it is dosed and timed for your goal and used consistently, rather than offered as an occasional drop-in panel." },
      { q: "What is red light therapy good for?", a: "It is commonly used to support skin quality, recovery, and tissue repair, and to complement energy and hair goals, as part of a broader plan. We match it to your goal rather than offering a one-size session." },
      { q: "How often do I need red light sessions?", a: "Results depend on consistency, so most goals call for a regular cadence over time. Inside the membership plan you use it as your plan calls for, instead of paying per drop-in session." },
      { q: "How is this different from a spa or gym panel?", a: "Drop-in panels offer the same generic glow to everyone with no goal or dosing plan. Here red light is dosed for your specific goal and used consistently inside a plan directed by a physician." },
      { q: "Can I just book sessions without becoming a patient?", a: "Red light here is always part of physician-led care. You start with a $99 Symptom Consultation so it is dosed for the right goal and fits your plan." },
    ],
    startHeading: "Red light, built into your care program.",
    startIntro: "Red light is one tool inside your care plan, dosed for a goal and included with your membership, so every session supports a real result you can see.",
    bylineNote: "This page is for education and is not a substitute for individual medical advice. Red light therapy at Nina Ross is provided within a clinical plan after appropriate screening and is offered alongside, not in place of, your primary and specialty care.",
  },
  {
    slug: "vitamin-injections",
    metaTitle: "Vitamin Injections in Atlanta (B12 & More) | Dr. Nina Ross, ND PhD",
    metaDescription:
      "Vitamin injections in Atlanta \u2014 B12, lipotropic, and more \u2014 dosed off your labs by Dr. Nina Ross, ND PhD so the fatigue actually lifts. Part of root-cause functional medicine. Start with a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/vitamin-injections-share.jpg",
    breadcrumbLabel: "Vitamin Injections",
    slotPrefix: "vitD",
    therapy: {
      name: "Vitamin Injections",
      alternateName: "B12, lipotropic, and nutrient intramuscular injections",
      description:
        "Intramuscular injections of vitamins and nutrients such as B12, B-complex, and lipotropic (MIC) compounds, dosed from advanced lab testing and used within a personalized functional medicine plan.",
      howPerformed:
        "After lab work and a clinical consult, a nutrient injection is dosed to the patient's results and given intramuscularly at the Atlanta clinic, on a cadence matched to their needs.",
    },
    hero: {
      eyebrow: "Vitamin Injections in Atlanta",
      heading: "Vitamin injections in Atlanta, dosed off your labs so the fatigue actually lifts.",
      paragraphs: [
        "If you have been grabbing a B12 shot at the counter hoping it fixes the fatigue, the problem was never the vitamin. It is that nobody checked whether you were actually low, or why.",
        "I am Dr. Nina Ross, ND PhD. Here a vitamin injection is dosed from your actual labs and given as one move inside a plan that treats the reason you ran low in the first place. That is how you trade a momentary lift for finally refilling the tank.",
      ],
      secondaryLabel: "See the whole toolkit behind it →",
    },
    whatItIs: {
      heading: "Nutrients into muscle, absorbed without waiting on your gut.",
      intro:
        "Vitamin injections put B12, B-complex, or lipotropic compounds straight into the muscle, where they absorb steadily without being lost to digestion. That part is real and it works, and it works best when the dose comes from your labs and the plan addresses why you were depleted in the first place.",
      points: [
        "Delivered intramuscularly, so absorption does not depend on a digestive system that may be struggling.",
        "When you are genuinely low, energy and clarity often lift within a few days of the right shot.",
        "We inject what your bloodwork shows you actually need, at the dose your body is asking for.",
      ],
    },
    whoFor: {
      heading: "Vitamin injections are right for some people. They are wrong for others.",
      closing: "If that second list stung a little, good. That honesty is exactly what you are paying for here.",
      leftItems: [
        "Your labs show a real B12, vitamin D, or nutrient deficiency we can correct",
        "Your gut does not absorb oral supplements well, from reflux, IBS, or surgery",
        "You want nutrient support inside a plan, with someone tracking whether it works",
      ],
      rightItems: [
        "You want a weekly booster with no interest in why you are depleted",
        "You are hoping a shot replaces sleep, food, or a real workup",
        "You expect it to fix fatigue that is actually coming from your thyroid, gut, or hormones",
      ],
    },
    notBand: {
      label: "Not a booster bar",
      heading: "Every gym and spa offers a B12 shot now. This is not that.",
      paragraph:
        "At a booster bar you pick a shot off a board, pay at the counter, and hope it does something. No labs, no chart, no one asking why you needed it. Here, a vitamin injection is a physician\u2019s order dosed off your results, and it is one tool inside a plan treating the actual cause of the deficiency.",
      callouts: [
        { title: "Dosed off labs, not a menu", body: "Your shot follows your bloodwork, so you are correcting a real deficiency, not guessing." },
        { title: "One tool in a plan, not the answer", body: "The injection supports the work; the plan around it is what actually moves your health." },
        { title: "A physician dosing, not an upsell", body: "Screened, dosed, and tracked by a doctor who knows your whole history." },
      ],
    },
    whatToExpect: {
      heading: "From first consult to your shot, step by step",
      steps: [
        { label: "Consult & labs", title: "We find out what is low", desc: "Your story and advanced labs show what you are actually deficient in, before any injection." },
        { label: "Your protocol is set", title: "A dose written for you", desc: "Dr. Nina orders the exact nutrient and dose your results call for, not a stock booster." },
        { label: "A quick visit", title: "In and out in minutes", desc: "The injection itself takes moments. Most people feel the lift within a few days when they were truly low." },
        { label: "Re-check & hold", title: "We confirm it is working", desc: "We re-test as your plan moves, so the next dose reflects where you are now." },
      ],
    },
    related: [
      { slug: "iv-therapy", desc: "A deeper infusion option when a quick injection is not enough." },
      { slug: "advanced-lab-testing", desc: "The bloodwork that shows exactly what you are actually low in." },
      { slug: "peptide-therapy", desc: "Signaling support that can complement a nutrient-repletion plan." },
    ],
    faq: [
      { q: "Are vitamin injections (like B12) safe?", a: "When they are dosed by a physician after appropriate screening, vitamin injections are generally very well tolerated. Here they are matched to your labs and your dose is adjusted over time, rather than handed out on a fixed weekly schedule regardless of need." },
      { q: "Do B12 or vitamin shots actually give you energy?", a: "If you are genuinely deficient, correcting that with an injection can lift energy noticeably. If your levels are already fine, a shot does little, which is exactly why we test first instead of injecting everyone." },
      { q: "What is in your vitamin injections?", a: "Common options include B12, B-complex, vitamin D, and lipotropic (MIC) blends, chosen and dosed to your labs and goals. Dr. Nina selects each injection individually rather than offering a fixed booster menu." },
      { q: "How often do I need vitamin injections?", a: "It depends on what your labs show and what we are correcting. Some patients benefit from a short series, others from occasional support. Inside the membership plan you use injections as your plan calls for, instead of paying per shot." },
      { q: "How is this different from a B12 shot at the pharmacy or gym?", a: "Here a vitamin injection is dosed off your lab results, chosen to correct what your body is actually low in, and monitored as one tool inside a complete functional medicine plan." },
      { q: "Can I just get a shot without becoming a patient?", a: "Injections here are always part of physician-led care. You start with a $99 Symptom Consultation so the shot can be dosed safely and actually fit what your body needs." },
    ],
    startHeading: "Vitamin injections, built into your care program.",
    startIntro: "Vitamin injections are one tool inside your care plan, so once you are in the program you use them as your labs call for, included rather than billed per shot.",
    bylineNote: "This page is for education and is not a substitute for individual medical advice. Vitamin injection therapy at Nina Ross is physician-ordered after appropriate screening and is provided alongside, not in place of, your primary and specialty care.",
  },
];

const HOLISTIC_NUTRITION = buildPositioning({
  slug: "holistic-nutrition",
  routePrefix: "/treatments",
  breadcrumbParentLabel: "Treatments",
  breadcrumbParentHref: "/treatments",
  name: "Holistic nutrition",
  title: "Holistic Nutrition in Atlanta | Dr. Nina Ross, ND PhD",
  description:
    "Holistic nutrition in Atlanta built on your labs and your body. Dr. Nina Ross, ND PhD, uses food as medicine to treat the root cause, in Atlanta and virtually across Georgia. Book a $99 consult.",
  ogImage: "https://www.ninarossfm.com/og/holistic-nutrition-share.jpg",
  slotPrefix: "hnuD",
  breadcrumbLabel: "Holistic Nutrition Atlanta",
  hero: {
    eyebrow: "Holistic Nutrition in Atlanta",
    heading: "Holistic nutrition in Atlanta, built on your labs and your life.",
    paragraphs: [
      "If you have tried every diet and still feel off, the problem may not be willpower. It may be that no plan was ever built for your body.",
      "I am Dr. Nina Ross, ND PhD. Holistic nutrition here is not a generic meal plan. I read your labs, your symptoms, and your real life, then use food as medicine to treat what is actually driving how you feel, in Atlanta and virtually across Georgia.",
    ],
    secondaryLabel: "What holistic nutrition means →",
  },
  whySection: {
    eyebrow: "Why food first",
    heading: "Food is the foundation everything else is built on.",
    paragraphs: [
      "You can supplement and medicate around a diet that is feeding the problem, or you can fix the foundation. Holistic nutrition uses what is on your plate to steady blood sugar, calm inflammation, and feed the systems that keep you well, matched to your labs.",
      "The right food for your body does more than any plan made for someone else's.",
    ],
    callouts: [
      { title: "Matched to your labs", body: "Your plan follows your bloodwork, not a one-size template or the latest trend." },
      { title: "Built for your real life", body: "Foods you actually like, on a schedule you can actually keep, shaped around how you live." },
      { title: "Food as medicine", body: "We use nutrition to treat the driver, steadying energy, mood, digestion, and weight from the root." },
    ],
  },
  whatItMeans: {
    eyebrow: "What holistic nutrition means",
    heading: "Holistic nutrition is a strategy built on your biology.",
    paragraphs: [
      "Done right, holistic nutrition is clinical. I read how your metabolism, hormones, and gut respond to food, then design a way of eating that targets the root cause of your symptoms.",
      "This is medicine that respects both your science and your story.",
    ],
    callouts: [
      { title: "Real labs, read for optimal", body: "Advanced panels read against where you actually feel well, not just inside a wide normal range." },
      { title: "The whole system, connected", body: "Hormones, gut, metabolism, and stress are mapped together so the real driver cannot hide." },
      { title: "A plan you help build", body: "Care shaped around your body and your real life, with you in the room deciding." },
    ],
  },
  whoIHelp: [
    { slug: "gut-health", title: "Gut health", desc: "Bloating, reflux, and irregularity, addressed with food matched to your labs." },
    { slug: "weight-loss", title: "Weight", desc: "Blood sugar and hormones steadied through nutrition built for your body, not a template." },
    { slug: "insulin-resistance", title: "Metabolic health", desc: "Food used to calm inflammation and steady the blood sugar swings behind it." },
  ],
  proof: {
    quote: "She changed how I eat around my actual labs. The bloating, the crashes, the weight, all of it finally moved.",
    name: "Bianca R.",
    meta: "Atlanta patient",
  },
  faq: [
    { q: "What does a holistic nutritionist do?", a: "A holistic nutritionist uses food to treat the root cause, not just to count calories. I read your labs, symptoms, and real life, then design a way of eating that steadies blood sugar, calms inflammation, and feeds the systems that keep you well." },
    { q: "How is holistic nutrition different from a regular diet plan?", a: "A diet plan is generic and usually about restriction. Holistic nutrition is built on your bloodwork and your body, using food as medicine to treat what is actually driving your symptoms, on a plan you can actually keep." },
    { q: "Is holistic nutrition evidence based?", a: "Yes. I hold a Ph.D. in Functional Medicine and am board certified in holistic health. Your nutrition plan follows advanced lab testing and physiology, matched to your results, not the latest trend." },
    { q: "Can holistic nutrition help with weight, energy, and digestion?", a: "Very often, yes. When food is matched to your labs, blood sugar steadies, inflammation calms, and weight, energy, mood, and digestion frequently improve together from the root." },
    { q: "Do you work alongside my regular doctor?", a: "Yes. Nutrition care here is provided alongside, not in place of, your primary and specialty care. We coordinate so the whole picture stays connected." },
    { q: "Do you offer virtual nutrition visits or only in person in Atlanta?", a: "Both. See me in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
  ],
});

export const TREATMENTS: LongformPageContent[] = [...RAW.map(buildTreatment), HOLISTIC_NUTRITION];

export function getTreatmentBySlug(slug: string): LongformPageContent | undefined {
  return TREATMENTS.find((t) => t.slug === slug);
}

export interface TreatmentIndexEntry {
  slug: string;
  name: string;
  teaser: string;
}

export const TREATMENTS_INDEX: TreatmentIndexEntry[] = TREATMENTS.map((t) => ({
  slug: t.slug,
  name: t.hero.breadcrumbLabel,
  teaser: t.hero.paragraphs[0],
}));
