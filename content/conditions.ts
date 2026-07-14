import type { ContentBlock, FaqItem, LongformPageContent } from "./types";
import { treatmentCardImage } from "./treatment-images";

const CARE_STEP_LABELS = ["Discover", "Connect", "Personalize", "Nourish"] as const;
const BYLINE_NOTE =
  "This page is for education and is not a substitute for individual medical advice. Functional medicine care at Nina Ross is provided alongside, not in place of, your primary and specialty care.";
const START_INTRO =
  "A half hour with our team to look at your story and decide if root-cause care is your next step.";

interface ConditionInput {
  slug: string;
  name: string;
  title: string;
  description: string;
  ogImage: string;
  slotPrefix: string;
  medicalConditionName: string;
  faqQuestionsIntro: string; // e.g. "Questions patients ask us"
  schemaFaqName: string; // used only for consistency, schema built below
  hero: {
    eyebrow: string;
    heading: string;
    paragraphs: [string, string];
    secondaryLabel: string;
  };
  symptoms: { heading: string; items: { label: string; text: string }[] };
  whyMisses: {
    heading: string;
    paragraph: string;
    told: string;
    truth: string;
  };
  fmDifference: {
    heading: string;
    paragraphs: [string, string, string];
    callouts: [{ title: string; body: string }, { title: string; body: string }, { title: string; body: string }];
  };
  rootCause: {
    heading: string;
    intro: string;
    connector: string;
    drivers: { label: string; text: string }[];
  };
  carePlan: {
    heading: string;
    stepDescriptions: [string, string, string, string];
  };
  treatments: {
    heading: string;
    eyebrow: string;
    cards: { slug: string; title: string; desc: string }[];
  };
  proof: { eyebrow: string; quote: string; name: string; meta: string };
  faq: FaqItem[];
  startHeading: string;
  breadcrumbLabel: string;
}

function stripLabelPrefix(label: string, full: string): string {
  const withComma = `${label}, `;
  if (full.startsWith(withComma)) return full.slice(withComma.length);
  return full;
}

function buildCondition(input: ConditionInput): LongformPageContent {
  const canonical = `https://www.ninarossfm.com/conditions/${input.slug}`;

  const blocks: ContentBlock[] = [
    {
      type: "featureGrid",
      eyebrow: "You might recognize this",
      heading: input.symptoms.heading,
      items: input.symptoms.items,
      footnote: "If you nodded at three or more, your body is asking a deeper question.",
    },
    {
      type: "calloutSplit",
      eyebrow: "Why conventional care keeps missing it",
      heading: input.whyMisses.heading,
      paragraphs: [input.whyMisses.paragraph],
      callouts: [
        { title: "What you're usually told", body: input.whyMisses.told },
        { title: "What's actually happening", body: input.whyMisses.truth },
      ],
    },
    {
      type: "bandStatement",
      eyebrow: "The functional medicine difference",
      heading: input.fmDifference.heading,
      paragraphs: input.fmDifference.paragraphs,
      callouts: input.fmDifference.callouts,
      imageSlotId: `${input.slotPrefix}-fmd-av`,
    },
    {
      type: "loopDiagram",
      eyebrow: "The root-cause view",
      heading: input.rootCause.heading,
      paragraphs: [input.rootCause.intro, input.rootCause.connector],
      drivers: input.rootCause.drivers.map((d) => ({
        label: d.label,
        text: stripLabelPrefix(d.label, d.text),
      })),
    },
    {
      type: "steps",
      eyebrow: `The Care Plan Protocol, applied to ${input.name.toLowerCase()}`,
      heading: input.carePlan.heading,
      steps: CARE_STEP_LABELS.map((label, i) => ({
        label,
        title: { Discover: "Test what's really going on", Connect: "See how the pieces relate", Personalize: "Build the plan around you", Nourish: "Steady support over time" }[label],
        desc: input.carePlan.stepDescriptions[i],
      })),
    },
    {
      type: "cardLinks",
      eyebrow: input.treatments.eyebrow,
      heading: input.treatments.heading,
      cards: input.treatments.cards.map((c) => ({
        href: `/treatments/${c.slug}`,
        title: c.title,
        desc: c.desc,
        imageSlotId: treatmentCardImage(c.slug),
      })),
    },
    {
      type: "testimonialBlock",
      eyebrow: input.proof.eyebrow,
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
      secondaryHref: "#root-cause",
      imageSlotId: `${input.slotPrefix}-hero`,
      bylineAvatarSlotId: `${input.slotPrefix}-byline-av`,
      breadcrumbLabel: input.breadcrumbLabel,
      breadcrumbParentLabel: "Conditions",
      breadcrumbParentHref: "/conditions",
    },
    blocks,
    faqEyebrow: input.faqQuestionsIntro,
    faqHeading: `${input.name}, answered plainly`,
    faq: input.faq,
    startHere: { heading: input.startHeading, intro: START_INTRO },
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
          about: { "@type": "MedicalCondition", name: input.medicalConditionName },
          reviewedBy: {
            "@type": "Physician",
            name: "Dr. Nina Ross",
            identifier: { "@type": "PropertyValue", propertyID: "NPI", value: "1164884078" },
          },
          lastReviewed: "2026-06-01",
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
            { "@type": "ListItem", position: 2, name: "Conditions", item: "https://www.ninarossfm.com/conditions" },
            { "@type": "ListItem", position: 3, name: input.breadcrumbLabel, item: canonical },
          ],
        },
      ],
    },
  };
}

const RAW: ConditionInput[] = [
  {
    slug: "chronic-fatigue",
    name: "Fatigue",
    title: "Chronic Fatigue & Adrenal Fatigue Treatment in Atlanta – Nina Ross FM",
    description:
      "Exhausted no matter how much you sleep? Dr. Nina Ross, a functional medicine doctor in Atlanta, treats chronic and adrenal fatigue at the root. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/chronic-fatigue-share.jpg",
    slotPrefix: "fatigueD",
    medicalConditionName: "Chronic Fatigue",
    faqQuestionsIntro: "Questions patients ask us",
    schemaFaqName: "",
    breadcrumbLabel: "Chronic Fatigue",
    hero: {
      eyebrow: "Adrenal Fatigue Treatment in Atlanta",
      heading: "Root-cause fatigue care in Atlanta that finally gives you your energy back.",
      paragraphs: [
        "If you wake up tired, run on caffeine, crash by mid afternoon and still cannot fall asleep at night, you are not imagining it.",
        "Your exhaustion is real, and it deserves someone who will listen to the whole story. At Nina Ross Functional Medicine, we treat fatigue at its root, here in Atlanta and virtually across Georgia. Dr. Nina Ross follows the whole picture, the stress response, thyroid, and blood sugar, until she finds what is really draining you, then builds the plan around your body and your life.",
      ],
      secondaryLabel: "See what standard labs may be missing →",
    },
    symptoms: {
      heading: "The fatigue signs we hear most often",
      items: [
        { label: "Tired even after a full night", text: "You sleep the hours and still wake up drained." },
        { label: "Wired but exhausted at night", text: "Exhausted by day, then too keyed up to fall asleep." },
        { label: "An afternoon energy crash", text: "That wall in the afternoon that coffee cannot fix." },
        { label: "Relying on caffeine to cope", text: "Caffeine to start, to push through, to keep going." },
        { label: "Brain fog & poor focus", text: "Words and focus that slip just out of reach." },
        { label: "Feeling unable to recover", text: "Rest and weekends that never quite refill the tank." },
      ],
    },
    whyMisses: {
      heading: "Your labs were normal, so you were sent home.",
      paragraph:
        "A fifteen-minute visit rarely has room to look at the whole energy system. So fatigue gets brushed off as stress or aging, and the thing draining you goes unexamined.",
      told: "\u201CEverything looks normal. You are probably just stressed, try to sleep more.\u201D",
      truth: "Cortisol, thyroid, and blood sugar are pulling each other down in a loop. Steady the loop and your energy returns together.",
    },
    fmDifference: {
      heading: "We will not call it stress and send you home.",
      paragraphs: [
        "Here is where we part ways with conventional care. When the standard panel looks normal, fatigue often gets labeled stress, and you are handed reassurance or a prescription for sleep. That can blunt the feeling for a night. But masking exhaustion does not restore energy. The moment the prescription wears off, the depletion is still there, and often deeper.",
        "We would rather do the harder, more honest work. We find what is actually draining your energy and we treat that.",
        "If a medication still has a place in your care, that should be your informed choice, made with the full picture in front of you, not a default handed to you in a fifteen minute visit.",
      ],
      callouts: [
        { title: "It names a feeling, not a cause", body: "Being told you are stressed does not explain why your body stopped making steady energy." },
        { title: "A sleep aid can mask the depletion", body: "Sedation is not the same as the deep, restoring sleep your body is missing." },
        { title: "It postpones the real recovery", body: "Pushing through on caffeine borrows energy you do not have, and the debt keeps growing." },
      ],
    },
    rootCause: {
      heading: "Fatigue runs in a loop. We map the whole circle.",
      intro: "Each driver pushes the next. That is why treating one in isolation rarely holds, and why mapping the full cycle changes everything.",
      connector: "When we investigate your fatigue, we read the whole stress and metabolic picture rather than a single number, and connect each driver back to what you're feeling:",
      drivers: [
        { label: "Cortisol & the stress response", text: "Cortisol & the stress response, the wired-but-tired nights and the flat, heavy mornings." },
        { label: "An underactive thyroid", text: "An underactive thyroid, the slow metabolism, the cold, and the bone-deep tiredness." },
        { label: "Blood sugar swings", text: "Blood sugar swings, behind the mid-afternoon crash and the cravings that follow." },
        { label: "Nutrient depletion", text: "Nutrient depletion, low iron, B12, or vitamin D quietly draining your reserves." },
        { label: "Unrefreshing sleep", text: "Unrefreshing sleep, hours in bed that never add up to real recovery." },
        { label: "Mitochondrial strain", text: "Mitochondrial strain, where your cells struggle to turn food into steady energy." },
        { label: "Chronic inflammation", text: "Chronic inflammation, the low hum that keeps your body from ever feeling rested." },
      ],
    },
    carePlan: {
      heading: "Your energy care plan: four steps, built around your body",
      stepDescriptions: [
        "Cortisol rhythm, full thyroid, blood sugar, iron, B12 and vitamin D, the labs a rushed visit skips.",
        "We map your results onto the loop so you finally see why the exhaustion runs so deep.",
        "Nutrition, targeted supplements, paced movement, and stress work, sequenced to your labs, not a template.",
        "We adjust as your energy returns, so progress holds and mornings, focus, and sleep keep improving.",
      ],
    },
    treatments: {
      heading: "Tools we reach for with fatigue",
      eyebrow: "Treatments we may use",
      cards: [
        { slug: "advanced-lab-testing", title: "Advanced Lab Testing", desc: "Cortisol, thyroid, and nutrient testing for real clarity on your root causes." },
        { slug: "iv-therapy", title: "IV Therapy", desc: "Rapid nutrient replenishment when your reserves are running on empty." },
        { slug: "vitamin-injections", title: "Vitamin Injections", desc: "B12 and targeted nutrients to support steady, lasting energy." },
      ],
    },
    proof: {
      eyebrow: "Fatigue patients, in their words",
      quote: "I had forgotten what a real morning felt like. Now I wake up before my alarm and actually want to.",
      name: "Dana K.",
      meta: "Chronic fatigue \u00b7 Atlanta patient",
    },
    faq: [
      { q: "Can functional medicine help chronic fatigue?", a: "Yes. We treat fatigue by addressing what is draining you, the stress response, thyroid, blood sugar, and nutrients, rather than calling it stress. Most people feel steadier energy return as the root causes are corrected." },
      { q: "Is adrenal fatigue a real diagnosis?", a: "The pattern is real even if the label is debated. What we measure is your cortisol rhythm and how your stress system, thyroid, and metabolism are coping, then we support them directly." },
      { q: "What testing do you run for low energy?", a: "We go beyond a basic panel, with cortisol rhythm, full thyroid, blood sugar, iron, B12, and vitamin D, so the plan targets your specific root causes." },
      { q: "Why am I tired if my doctor says I am fine?", a: "Standard labs flag disease, not how well you function. We read your results against optimal ranges and look at the systems that produce energy, which is where the answer usually hides." },
      { q: "How soon will I feel more energy?", a: "Many people feel a first lift within a few weeks, though deeper recovery follows your body, not a calendar. We pace the plan so progress holds." },
      { q: "Can stress really cause physical exhaustion?", a: "Yes. A stress response stuck in the on position disrupts sleep, blood sugar, and hormones, and the result is a body that cannot make steady energy. We calm it at the root." },
      { q: "Do you offer virtual fatigue care or only in person in Atlanta?", a: "Both. See Dr. Nina Ross in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
    ],
    startHeading: "The $99 Symptom Consultation",
  },
  {
    slug: "gut-health",
    name: "Gut health",
    title: "Gut Health Doctor in Atlanta | Root-Cause Care – Nina Ross FM",
    description:
      "Bloating, reflux, or IBS no one can explain? Dr. Nina Ross, a functional medicine gut health doctor in Atlanta, treats leaky gut and digestion at the root. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/gut-health-share.jpg",
    slotPrefix: "gutD",
    medicalConditionName: "Gastrointestinal Disorder",
    faqQuestionsIntro: "Questions patients ask us",
    schemaFaqName: "",
    breadcrumbLabel: "Gut Health",
    hero: {
      eyebrow: "Gut Health Treatment in Atlanta",
      heading: "Root-cause gut and digestion care in Atlanta that finally settles your stomach.",
      paragraphs: [
        "If the bloating, the reflux, the unpredictable bathroom trips and the food list that keeps shrinking have become your normal, you are not imagining it.",
        "Your gut has been trying to tell you something, and it deserves someone who will listen to the whole story. At Nina Ross Functional Medicine, we treat digestion at its root, here in Atlanta and virtually across Georgia. Dr. Nina Ross follows the whole picture, the microbiome, the gut lining, and the foods that inflame you, until she finds what is really driving your symptoms, then builds the plan around your body and your life.",
      ],
      secondaryLabel: "See what standard labs may be missing →",
    },
    symptoms: {
      heading: "The gut signs we hear most often",
      items: [
        { label: "Bloating after most meals", text: "That tight, swollen feeling within an hour of eating." },
        { label: "Reflux or heartburn", text: "A burning that creeps up after meals or at night." },
        { label: "Constipation or loose stools", text: "A gut that swings between extremes with no rhythm." },
        { label: "Stomach pain & cramping", text: "Cramps and aches that come and go without warning." },
        { label: "A shrinking list of safe foods", text: "More foods landing on the do-not-eat list each month." },
        { label: "Brain fog & low mood", text: "The fog and low mood that ride along with a struggling gut." },
      ],
    },
    whyMisses: {
      heading: "You were handed an antacid and a shrug.",
      paragraph: "A fifteen-minute visit rarely has room to look at the whole digestive system. So gut symptoms get silenced one at a time, and the thing connecting them goes unexamined.",
      told: "\u201CYour scope looked fine. It is probably just IBS, try to manage the stress.\u201D",
      truth: "The microbiome, the gut lining, and inflammation are feeding each other in a loop. Calm the loop and digestion settles together.",
    },
    fmDifference: {
      heading: "We will not silence your gut and call it healed.",
      paragraphs: [
        "Here is where we part ways with conventional care. The reflex answer for a struggling gut is a pill that turns down the signal, an antacid, a laxative, something to mute it. That can quiet the surface for a while. But muting a symptom does not heal a gut. The moment you stop, it returns, and the root cause has had more time to dig in.",
        "We would rather do the harder, more honest work. We find what is actually irritating your gut and we treat that.",
        "If a medication still has a place in your care, that should be your informed choice, made with the full picture in front of you, not a default handed to you in a fifteen minute visit.",
      ],
      callouts: [
        { title: "It mutes the signal, not the cause", body: "An antacid lowers the acid, it does not answer why your gut is inflamed in the first place." },
        { title: "It can starve your microbiome", body: "Long-term acid blockers and repeated antibiotics can thin the very ecosystem digestion depends on." },
        { title: "It postpones the real repair", body: "A gut left inflamed keeps leaking, and the food reactions and fatigue tend to widen over time." },
      ],
    },
    rootCause: {
      heading: "Gut trouble runs in a loop. We map the whole circle.",
      intro: "Each driver pushes the next. That is why treating one in isolation rarely holds, and why mapping the full cycle changes everything.",
      connector: "When we investigate your gut, we read the whole digestive and immune picture rather than a single scope, and connect each driver back to what you're feeling:",
      drivers: [
        { label: "Microbiome imbalance", text: "Microbiome imbalance, the bloating, the gas, and the cravings that seem to run the show." },
        { label: "A leaky gut lining", text: "A leaky gut lining, where food particles slip through and the immune system starts reacting." },
        { label: "Chronic inflammation", text: "Chronic inflammation, the quiet thread linking your gut to your joints, skin, and mood." },
        { label: "Food sensitivities", text: "Food sensitivities, the meals that should be fine but leave you bloated and foggy." },
        { label: "Low stomach acid & enzymes", text: "Low stomach acid & enzymes, behind the reflux, the heaviness, and feeling full too fast." },
        { label: "Cortisol & stress", text: "Cortisol & stress, tightens digestion and keeps the gut on high alert." },
        { label: "The gut-brain axis", text: "The gut-brain axis, where poor digestion quietly turns into low mood and brain fog." },
      ],
    },
    carePlan: {
      heading: "Your gut care plan: four steps, built around your body",
      stepDescriptions: [
        "Comprehensive stool testing, food-reaction panels, inflammation and nutrient markers, the labs a rushed visit skips.",
        "We map your results onto the loop so you finally see why the symptoms travel together.",
        "A targeted way of eating, gut-repair support, and stress work, sequenced to your labs, not a template.",
        "We adjust as your gut heals, so progress holds and digestion, energy, and mood keep improving.",
      ],
    },
    treatments: {
      heading: "Tools we reach for with gut health",
      eyebrow: "Treatments we may use",
      cards: [
        { slug: "advanced-lab-testing", title: "Advanced Lab Testing", desc: "Stool, microbiome, and food-reaction testing for real clarity on your root causes." },
        { slug: "iv-therapy", title: "IV Therapy", desc: "Replenishing nutrients an inflamed gut struggles to absorb." },
        { slug: "peptide-therapy", title: "Peptide Therapy", desc: "Targeted support for repairing and calming the gut lining." },
      ],
    },
    proof: {
      eyebrow: "Gut patients, in their words",
      quote: "I spent years afraid of food. Six months in, I eat dinner out again without bracing for it.",
      name: "Tasha M.",
      meta: "Gut & digestion \u00b7 Atlanta patient",
    },
    faq: [
      { q: "Can functional medicine help IBS and leaky gut?", a: "Yes. We treat digestive symptoms by addressing what is driving them, the microbiome, the gut lining, and inflammation, rather than only muting them. Most people see bloating, regularity, and energy improve as the root causes are corrected." },
      { q: "How is a functional gut workup different from my GI doctor?", a: "Your GI doctor rules out structural disease, and that matters. As a functional medicine gut health doctor in Atlanta, Dr. Nina Ross maps the whole digestive and immune picture and builds a personalized plan, testing, nutrition, and targeted repair, to address the cause." },
      { q: "What testing do you run for gut issues?", a: "We go beyond a normal scope, with comprehensive stool and microbiome testing, food-reaction panels, inflammation markers, and nutrient status, so the plan targets your specific root causes." },
      { q: "Do I have to give up gluten and dairy forever?", a: "Not necessarily. We use testing and a structured reintroduction to find your true triggers, so you end up with the widest, most comfortable diet your gut can handle, not a permanent list of fears." },
      { q: "Is bloating really something you can fix?", a: "Often, yes. Bloating usually points to the microbiome, digestion, or an inflamed gut. When we address the cause, most people notice flatter, calmer days within weeks." },
      { q: "Can my gut be behind my fatigue and mood?", a: "Frequently. The gut is in constant conversation with your brain and immune system. Calm the gut at the root and energy, focus, and mood often lift alongside digestion." },
      { q: "Do you offer virtual gut care or only in person in Atlanta?", a: "Both. See Dr. Nina Ross in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
    ],
    startHeading: "The $99 Symptom Consultation",
  },
  {
    slug: "hair-loss",
    name: "Hair loss",
    title: "Hair Loss Treatment in Atlanta | Root-Cause Trichology – Nina Ross FM",
    description:
      "Watching your hair thin? Dr. Nina Ross, a board-certified trichologist in Atlanta, treats the root cause of hair loss. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/hair-loss-share.jpg",
    slotPrefix: "hairD",
    medicalConditionName: "Hair Loss",
    faqQuestionsIntro: "Questions patients ask us",
    schemaFaqName: "",
    breadcrumbLabel: "Hair Loss",
    hero: {
      eyebrow: "Hair Loss Treatment in Atlanta",
      heading: "Root-cause hair loss care in Atlanta from a board-certified trichologist.",
      paragraphs: [
        "If your part is widening, your ponytail is thinner and the strands on the shower floor have you worried, you are not imagining it.",
        "Your hair is telling you something about your health, and it deserves someone who will listen to the whole story. At Nina Ross Functional Medicine, we treat hair loss at its root, here in Atlanta and virtually across Georgia. Dr. Nina Ross is a board-certified trichologist who follows the whole picture, thyroid, hormones, and iron, until she finds what is really thinning your hair, then builds the plan around your body and your life.",
      ],
      secondaryLabel: "See what standard labs may be missing →",
    },
    symptoms: {
      heading: "The hair loss signs we hear most often",
      items: [
        { label: "A widening part", text: "A part that looks a little wider every month." },
        { label: "A thinner ponytail", text: "A ponytail that wraps one more time than it used to." },
        { label: "More shedding than usual", text: "Strands on the pillow, the shower, the floor." },
        { label: "Hair that will not grow", text: "Length that stalls and will not grow past a point." },
        { label: "Breakage & brittle strands", text: "Hair that snaps and frays before it can grow." },
        { label: "A tender or flaky scalp", text: "A scalp that feels sore, itchy, or flaky." },
      ],
    },
    whyMisses: {
      heading: "You were told it is genetic, learn to live with it.",
      paragraph: "A fifteen-minute visit rarely has room to investigate why hair thins. So hair loss gets called genetic or stress, and the cause beneath it goes unexamined.",
      told: "\u201CIt is probably just genetic. Try this shampoo and see how it goes.\u201D",
      truth: "Hormones, thyroid, and nutrient gaps are starving the follicle in a loop. Address the loop and the follicle can recover.",
    },
    fmDifference: {
      heading: "We will not hand you a shampoo and call it answered.",
      paragraphs: [
        "Here is where we part ways with conventional care. When hair thins, the reflex answer is a topical or the verdict that it is simply genetic. A product can coat the strand for a while. But nothing growing from a starved follicle holds, because the cause sits inside the body, in your hormones, thyroid, and nutrient stores, not on the surface of your scalp.",
        "We would rather do the harder, more honest work. We find what is actually thinning your hair and we treat that.",
        "If a topical or medication still has a place in your plan, that should be your informed choice, made with the full picture in front of you, not a default handed to you in a fifteen minute visit.",
      ],
      callouts: [
        { title: "It treats the strand, not the follicle", body: "A topical works on the surface while the follicle is being starved from within." },
        { title: "Genetic is rarely the whole story", body: "Even with a genetic tendency, thyroid, iron, and hormones decide how much you actually lose." },
        { title: "It postpones the real regrowth", body: "A follicle left starved eventually goes dormant, and the window to recover it narrows." },
      ],
    },
    rootCause: {
      heading: "Hair loss runs in a loop. We map the whole circle.",
      intro: "Each driver pushes the next. That is why treating one in isolation rarely holds, and why mapping the full cycle changes everything.",
      connector: "When we investigate your hair, we read the whole hormonal and nutritional picture rather than the scalp alone, and connect each driver back to what you're seeing:",
      drivers: [
        { label: "Thyroid function", text: "Thyroid function, an under or overactive thyroid behind sudden, diffuse shedding." },
        { label: "Hormone shifts", text: "Hormone shifts, where androgens, postpartum, and perimenopause thin the hair." },
        { label: "Low iron & ferritin", text: "Low iron & ferritin, one of the most common and missed causes of hair loss." },
        { label: "Nutrient gaps", text: "Nutrient gaps, vitamin D, zinc, and protein the follicle needs to grow." },
        { label: "Scalp inflammation", text: "Scalp inflammation, a tender or flaky scalp that disrupts healthy growth." },
        { label: "Cortisol & stress", text: "Cortisol & stress, that pushes follicles into shedding months later." },
        { label: "Blood sugar & insulin", text: "Blood sugar & insulin, that influence the androgens affecting your hair." },
      ],
    },
    carePlan: {
      heading: "Your hair care plan: four steps, built around your body",
      stepDescriptions: [
        "Full thyroid, iron and ferritin, hormones, vitamin D and a scalp assessment, the workup a rushed visit skips.",
        "We map your results onto the loop so you finally see why your hair is thinning.",
        "Nutrition, targeted nutrients, scalp care and hormone support, sequenced to your labs, not a template.",
        "We adjust as your follicles recover, so progress holds and density and regrowth keep improving.",
      ],
    },
    treatments: {
      heading: "Tools we reach for with hair loss",
      eyebrow: "Treatments we may use",
      cards: [
        { slug: "advanced-lab-testing", title: "Advanced Lab Testing", desc: "Thyroid, iron, and hormone testing for real clarity on your root causes." },
        { slug: "hormone-restoration", title: "Hormone Restoration", desc: "Rebalancing the hormones that influence hair growth." },
        { slug: "red-light-therapy", title: "Red Light Therapy", desc: "Supporting the scalp and follicle to encourage regrowth." },
      ],
    },
    proof: {
      eyebrow: "Hair loss patients, in their words",
      quote: "My part stopped widening and the baby hairs came back. I stopped dreading the mirror.",
      name: "Lauren T.",
      meta: "Hair loss \u00b7 Atlanta patient",
    },
    faq: [
      { q: "Can functional medicine help hair loss?", a: "Yes. We treat hair loss by addressing what is starving the follicle, thyroid, hormones, iron, and nutrients, rather than coating the strand. Most people see shedding slow and regrowth begin as the root causes are corrected." },
      { q: "What makes Dr. Ross different for hair loss?", a: "Dr. Nina Ross is a board-certified trichologist as well as a functional medicine doctor, so she reads both the scalp and the internal causes and builds one plan that addresses the whole picture." },
      { q: "What testing do you run for hair loss?", a: "We go beyond a basic panel, with full thyroid, iron and ferritin, hormones, and vitamin D, plus a scalp assessment, so the plan targets your specific root causes." },
      { q: "Is my hair loss reversible?", a: "Often, yes, especially when we catch it before the follicle goes dormant. The earlier we find and correct the cause, the more regrowth tends to be possible." },
      { q: "How long until I see new growth?", a: "Hair grows slowly, so shedding usually settles first, within a couple of months, and visible regrowth follows over several. We track it with you." },
      { q: "Can stress and postpartum changes cause this?", a: "Yes. Both can push many follicles into shedding at once. We confirm the trigger and support your body so the cycle recovers." },
      { q: "Do you offer virtual hair loss care or only in person in Atlanta?", a: "Both. See Dr. Nina Ross in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
    ],
    startHeading: "The $99 Symptom Consultation",
  },
  {
    slug: "hormone-imbalance",
    name: "Hormones",
    title: "Hormone Therapy in Atlanta | Root-Cause Hormone Care – Nina Ross FM",
    description:
      "Hormones feeling out of balance? Dr. Nina Ross, a functional medicine hormone doctor in Atlanta, treats the root cause of hormonal symptoms. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/hormone-imbalance-share.jpg",
    slotPrefix: "hormoneD",
    medicalConditionName: "Endocrine Disorder",
    faqQuestionsIntro: "Questions patients ask us",
    schemaFaqName: "",
    breadcrumbLabel: "Hormones",
    hero: {
      eyebrow: "Hormone Therapy in Atlanta",
      heading: "Root-cause hormone care in Atlanta that finally helps you feel balanced.",
      paragraphs: [
        "If the mood swings, the stalled weight, the low drive and the cycles that feel off have left you feeling like a stranger in your body, you are not imagining it.",
        "These shifts are real, and they deserve someone who will listen to the whole story. At Nina Ross Functional Medicine, we treat hormones at their root, here in Atlanta and virtually across Georgia. Dr. Nina Ross follows the whole picture, thyroid, adrenals, and sex hormones, until she finds what is really throwing you off, then builds the plan around your body and your life.",
      ],
      secondaryLabel: "See what standard labs may be missing →",
    },
    symptoms: {
      heading: "The hormone signs we hear most often",
      items: [
        { label: "Mood swings & irritability", text: "A short fuse and moods that swing without warning." },
        { label: "Low energy & motivation", text: "Drive and motivation that have quietly drained away." },
        { label: "Low libido", text: "A desire that faded before you noticed it leaving." },
        { label: "Irregular or heavy cycles", text: "Cycles that arrive heavy, late, or not at all." },
        { label: "Stubborn weight gain", text: "Weight that holds on no matter the effort." },
        { label: "Poor sleep & night sweats", text: "Broken sleep and night sweats that steal your rest." },
      ],
    },
    whyMisses: {
      heading: "You were told your numbers were in range.",
      paragraph: "A fifteen-minute visit rarely has room to read the whole hormonal system. So symptoms get treated one at a time, and the imbalance connecting them goes unexamined.",
      told: "\u201CYour hormones are in the normal range. This is just part of getting older.\u201D",
      truth: "Thyroid, adrenals, and sex hormones are pulling each other off balance in a loop. Restore the loop and the symptoms settle together.",
    },
    fmDifference: {
      heading: "We will not call it aging and leave you there.",
      paragraphs: [
        "Here is where we part ways with conventional care. When hormone symptoms appear, the reflex answer is a single prescription or the reassurance that this is simply age. One hormone gets adjusted while the system around it is ignored. That can soften a symptom for a while. But treating one hormone in isolation often pushes another out of balance, and the underlying disruption keeps going.",
        "We would rather do the harder, more honest work. We find what is actually throwing your hormones off and we treat that.",
        "If hormone therapy still has a place in your plan, that should be your informed choice, made with the full picture in front of you, not a default handed to you in a fifteen minute visit.",
      ],
      callouts: [
        { title: "It treats one number, not the system", body: "Hormones move together, so adjusting one without the others rarely brings real balance." },
        { title: "Normal range is not the same as optimal", body: "You can sit inside the lab range and still feel nothing like yourself." },
        { title: "It postpones the real balance", body: "Calling it age stops the search before anyone asks why your hormones shifted." },
      ],
    },
    rootCause: {
      heading: "Hormones move in a loop. We map the whole circle.",
      intro: "Each driver pushes the next. That is why treating one in isolation rarely holds, and why mapping the full cycle changes everything.",
      connector: "When we investigate your hormones, we read the whole endocrine picture rather than a single number, and connect each driver back to what you're feeling:",
      drivers: [
        { label: "Thyroid function", text: "Thyroid function, the energy, weight, and mood that rise and fall with it." },
        { label: "Cortisol & the adrenals", text: "Cortisol & the adrenals, where chronic stress quietly steals from every other hormone." },
        { label: "Estrogen & progesterone", text: "Estrogen & progesterone, behind the cycle changes, the sleep, and the mood swings." },
        { label: "Testosterone", text: "Testosterone, low levels behind flagging drive, motivation, and strength." },
        { label: "Insulin & blood sugar", text: "Insulin & blood sugar, that tug hormones off balance and add stubborn weight." },
        { label: "Gut health", text: "Gut health, where hormones are metabolized and cleared from the body." },
        { label: "Chronic inflammation", text: "Chronic inflammation, the quiet thread that disrupts hormone signaling." },
      ],
    },
    carePlan: {
      heading: "Your hormone care plan: four steps, built around your body",
      stepDescriptions: [
        "A full thyroid, adrenal, and sex-hormone panel with metabolic markers, the labs a rushed visit skips.",
        "We map your results onto the loop so you finally see why the symptoms travel together.",
        "Nutrition, targeted support, hormone therapy where it fits, and stress work, sequenced to your labs, not a template.",
        "We adjust as your hormones rebalance, so progress holds and mood, energy, and sleep keep improving.",
      ],
    },
    treatments: {
      heading: "Tools we reach for with hormones",
      eyebrow: "Treatments we may use",
      cards: [
        { slug: "hormone-restoration", title: "Hormone Restoration", desc: "Rebalancing thyroid, adrenal, and sex hormones at the source." },
        { slug: "advanced-lab-testing", title: "Advanced Lab Testing", desc: "A full hormone panel for real clarity on your root causes." },
        { slug: "peptide-therapy", title: "Peptide Therapy", desc: "Targeted support for energy, recovery, and hormone signaling." },
      ],
    },
    proof: {
      eyebrow: "Hormone patients, in their words",
      quote: "I feel like me again. My moods are even, my energy is back, and I finally sleep through the night.",
      name: "Priya N.",
      meta: "Hormone balance \u00b7 Atlanta patient",
    },
    faq: [
      { q: "Can functional medicine balance my hormones?", a: "Yes. We treat hormone symptoms by reading the whole system, thyroid, adrenal, and sex hormones, and addressing what is throwing it off, rather than adjusting one number. Most people feel mood, energy, and sleep improve as balance returns." },
      { q: "How is this different from standard hormone treatment?", a: "Standard care often adjusts a single hormone. As a functional medicine hormone doctor in Atlanta, Dr. Nina Ross maps how your hormones move together and builds a personalized plan to restore the whole system." },
      { q: "What testing do you run for hormones?", a: "We go beyond a basic panel, with full thyroid, adrenal and cortisol rhythm, and sex hormones, plus metabolic markers, so the plan targets your specific root causes." },
      { q: "My labs are normal but I feel awful. Why?", a: "Normal range flags disease, not how well you function. We read your hormones against optimal ranges and in relationship to one another, which is where the answer usually hides." },
      { q: "Do you offer bioidentical hormone therapy?", a: "Where it is appropriate, yes. We use hormone therapy as one tool inside a full plan, alongside nutrition and root-cause work, and always as your informed choice." },
      { q: "Is this just a normal part of aging?", a: "Hormones do shift with age, but feeling unwell is not something you have to accept. We find what is driving the symptoms and support your body so you feel like yourself again." },
      { q: "Do you offer virtual hormone care or only in person in Atlanta?", a: "Both. See Dr. Nina Ross in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
    ],
    startHeading: "The $99 Symptom Consultation",
  },
  {
    slug: "menopause",
    name: "Menopause",
    title: "Menopause Treatment in Atlanta | Root-Cause Care – Nina Ross FM",
    description:
      "Hot flashes, weight, and sleepless nights? Dr. Nina Ross, a functional medicine doctor in Atlanta, treats perimenopause and menopause at the root. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/menopause-share.jpg",
    slotPrefix: "menoD",
    medicalConditionName: "Menopause",
    faqQuestionsIntro: "Questions patients ask us",
    schemaFaqName: "",
    breadcrumbLabel: "Menopause",
    hero: {
      eyebrow: "Menopause Treatment in Atlanta",
      heading: "Root-cause perimenopause and menopause care in Atlanta that helps you feel steady again.",
      paragraphs: [
        "If the hot flashes, the broken sleep, the weight shift and the feeling that your body changed overnight have you off balance, you are not imagining it.",
        "This transition is real, and it deserves someone who will listen to the whole story. At Nina Ross Functional Medicine, we treat perimenopause and menopause at the root, here in Atlanta and virtually across Georgia. Dr. Nina Ross follows the whole picture, estrogen and progesterone, thyroid, and metabolism, until she finds what is really driving your symptoms, then builds the plan around your body and your life.",
      ],
      secondaryLabel: "See what standard labs may be missing →",
    },
    symptoms: {
      heading: "The menopause signs we hear most often",
      items: [
        { label: "Hot flashes & night sweats", text: "Heat that rises out of nowhere, day or night." },
        { label: "Sleep that keeps breaking", text: "Nights that fracture into wakefulness again and again." },
        { label: "Weight shifting to the middle", text: "Weight settling around the middle for the first time." },
        { label: "Mood swings & anxiety", text: "Moods and anxiety that feel new and unfamiliar." },
        { label: "Brain fog & forgetfulness", text: "Words and names that slip just out of reach." },
        { label: "Low libido & dryness", text: "A fading desire and a body that feels different." },
      ],
    },
    whyMisses: {
      heading: "You were told this is just menopause.",
      paragraph: "A fifteen-minute visit rarely has room to look at the whole transition. So symptoms get waved off as menopause, and the imbalance beneath them goes unexamined.",
      told: "\u201CThis is just menopause. You will get through it, try to ride it out.\u201D",
      truth: "Falling hormones, thyroid, and metabolism are shifting together in a loop. Support the loop and the symptoms ease together.",
    },
    fmDifference: {
      heading: "We will not tell you to ride it out.",
      paragraphs: [
        "Here is where we part ways with conventional care. When menopause symptoms arrive, the reflex answer is to wait it out, or a single prescription handed over with little explanation. That can blunt one symptom. But the hormonal shift touches sleep, mood, metabolism, and bone, and treating one piece while ignoring the rest leaves most of the transition unsupported.",
        "We would rather do the harder, more honest work. We find what is actually driving your symptoms and we treat that.",
        "If hormone therapy still has a place in your plan, that should be your informed choice, made with the full picture in front of you, not a default handed to you in a fifteen minute visit.",
      ],
      callouts: [
        { title: "Riding it out is not a plan", body: "You can support this transition, ease the symptoms, and protect your long-term health." },
        { title: "One prescription misses the system", body: "The shift affects sleep, metabolism, and mood together, so the plan should too." },
        { title: "It postpones long-term protection", body: "Waiting it out overlooks bone, heart, and metabolic health that deserve attention now." },
      ],
    },
    rootCause: {
      heading: "The transition runs in a loop. We map the whole circle.",
      intro: "Each driver pushes the next. That is why treating one in isolation rarely holds, and why mapping the full cycle changes everything.",
      connector: "When we investigate your symptoms, we read the whole hormonal and metabolic picture rather than a single number, and connect each driver back to what you're feeling:",
      drivers: [
        { label: "Falling estrogen", text: "Falling estrogen, behind the hot flashes, the dryness, and the brain fog." },
        { label: "Low progesterone", text: "Low progesterone, that frays sleep and feeds anxiety and irritability." },
        { label: "Thyroid shifts", text: "Thyroid shifts, that deepen the fatigue, weight, and low mood." },
        { label: "Insulin & metabolism", text: "Insulin & metabolism, that move weight to the middle and resist your usual efforts." },
        { label: "Cortisol & stress", text: "Cortisol & stress, that worsen flashes, sleep, and the sense of overwhelm." },
        { label: "Bone & muscle loss", text: "Bone & muscle loss, the quiet changes that matter most for your long-term health." },
        { label: "Poor sleep", text: "Poor sleep, the broken nights that magnify every other symptom." },
      ],
    },
    carePlan: {
      heading: "Your menopause care plan: four steps, built around your body",
      stepDescriptions: [
        "Estrogen, progesterone, thyroid, and metabolic and bone markers, the labs a rushed visit skips.",
        "We map your results onto the loop so you finally see why the symptoms travel together.",
        "Nutrition, targeted support, hormone therapy where it fits, and sleep and stress work, sequenced to your labs, not a template.",
        "We adjust as you stabilize, so progress holds and sleep, mood, and energy keep improving.",
      ],
    },
    treatments: {
      heading: "Tools we reach for with menopause",
      eyebrow: "Treatments we may use",
      cards: [
        { slug: "hormone-restoration", title: "Hormone Restoration", desc: "Supporting estrogen, progesterone, and thyroid through the transition." },
        { slug: "advanced-lab-testing", title: "Advanced Lab Testing", desc: "A full hormone and metabolic panel for real clarity on your root causes." },
        { slug: "peptide-therapy", title: "Peptide Therapy", desc: "Targeted support for energy, recovery, and body composition." },
      ],
    },
    proof: {
      eyebrow: "Menopause patients, in their words",
      quote: "The night sweats stopped, I sleep again, and I feel like myself for the first time in two years.",
      name: "Sophia L.",
      meta: "Menopause \u00b7 Atlanta patient",
    },
    faq: [
      { q: "Can functional medicine help menopause symptoms?", a: "Yes. We treat perimenopause and menopause by supporting the whole transition, hormones, thyroid, metabolism, and sleep, rather than waiting it out. Most women feel flashes, sleep, and mood improve as we support the system." },
      { q: "What about perimenopause, before periods stop?", a: "Perimenopause is often when symptoms are loudest. We test and support early, so you feel steadier through the years leading up to menopause instead of riding it out." },
      { q: "What testing do you run for menopause?", a: "We go beyond a basic panel, with estrogen, progesterone, full thyroid, and metabolic and bone markers, so the plan targets your specific root causes." },
      { q: "Do you offer hormone therapy?", a: "Where it is appropriate, yes. We use hormone therapy as one tool inside a full plan, alongside nutrition, sleep, and stress work, and always as your informed choice." },
      { q: "Why have I gained weight around my middle?", a: "Falling hormones shift how you store fat and how your metabolism responds. We address the hormonal and metabolic drivers so your efforts start working again." },
      { q: "Is it too late to start care if I am already postmenopausal?", a: "Support helps at any stage, both for symptoms and for protecting your bone, heart, and metabolic health going forward." },
      { q: "Do you offer virtual menopause care or only in person in Atlanta?", a: "Both. See Dr. Nina Ross in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
    ],
    startHeading: "The $99 Symptom Consultation",
  },
  {
    slug: "insulin-resistance",
    name: "Metabolic health",
    title: "Insulin Resistance Treatment in Atlanta | Root-Cause Care – Nina Ross FM",
    description:
      "Prediabetes, high blood sugar, or rising blood pressure? Dr. Nina Ross, a functional medicine doctor in Atlanta, addresses insulin resistance at the root. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/insulin-resistance-share.jpg",
    slotPrefix: "metabolicD",
    medicalConditionName: "Insulin Resistance",
    faqQuestionsIntro: "Questions patients ask us",
    schemaFaqName: "",
    breadcrumbLabel: "Metabolic Health",
    hero: {
      eyebrow: "Insulin Resistance Care in Atlanta",
      heading: "Root-cause metabolic care in Atlanta that helps you get ahead of blood sugar.",
      paragraphs: [
        "If your blood sugar is creeping up, your weight is climbing and you have been told you are borderline and to watch it, you are not imagining it.",
        "These early signals are real, and they deserve someone who will look closely before they become a diagnosis. At Nina Ross Functional Medicine, we support metabolic health at its root, here in Atlanta and virtually across Georgia. Dr. Nina Ross follows the whole picture, insulin, weight, and inflammation, to understand what is driving your numbers, then builds the plan around your body and your life, working alongside your primary care.",
      ],
      secondaryLabel: "See what standard labs may be missing →",
    },
    symptoms: {
      heading: "The metabolic signs we hear most often",
      items: [
        { label: "Blood sugar creeping up", text: "Numbers inching up at each yearly check." },
        { label: "Stubborn belly weight", text: "Weight settling around the middle and holding." },
        { label: "Energy crashes & cravings", text: "Crashes and cravings that follow most meals." },
        { label: "Rising blood pressure", text: "Readings climbing higher than they used to." },
        { label: "Brain fog after meals", text: "A heavy, foggy feeling an hour after eating." },
        { label: "A family history of diabetes", text: "A family story you would rather not repeat." },
      ],
    },
    whyMisses: {
      heading: "You were told you are borderline, just watch it.",
      paragraph: "A fifteen-minute visit rarely has room to look at the whole metabolic picture. So early warning signs get watched rather than addressed, and the chance to change the path goes unused.",
      told: "\u201CYou are borderline. Let us just keep an eye on it and recheck next year.\u201D",
      truth: "Insulin, weight, and inflammation are reinforcing each other in a loop. Address the loop early and the numbers can move the other way.",
    },
    fmDifference: {
      heading: "We will not wait for the diagnosis to act.",
      paragraphs: [
        "Here is where we part ways with conventional care. Early metabolic changes are often watched until they cross a line into diagnosis, then met with a prescription. Watching has its place. But the years before a diagnosis are the most changeable, and using them to address insulin resistance directly is where the real opportunity lives.",
        "We would rather do the harder, more honest work. We find what is driving your metabolic numbers and we address that, alongside your primary care.",
        "If medication still has a place in your care, that should be your informed choice, made with the full picture in front of you, and paired with the work that addresses the cause.",
      ],
      callouts: [
        { title: "Watching is not the same as acting", body: "The borderline years are the most reversible, and they deserve a real plan." },
        { title: "Numbers tell a story together", body: "Blood sugar, weight, and blood pressure move as a system, so we read them together." },
        { title: "Early action changes the path", body: "Addressing insulin resistance now is what helps you stay ahead of a diagnosis." },
      ],
    },
    rootCause: {
      heading: "Metabolic risk runs in a loop. We map the whole circle.",
      intro: "Each driver pushes the next. That is why treating one in isolation rarely holds, and why mapping the full cycle changes everything.",
      connector: "When we look at your metabolic health, we read the whole picture rather than a single number, and connect each driver back to what you're experiencing:",
      drivers: [
        { label: "Insulin resistance", text: "Insulin resistance, the engine behind rising blood sugar and stubborn weight." },
        { label: "Blood sugar swings", text: "Blood sugar swings, the crashes, cravings, and post-meal fog." },
        { label: "Visceral weight", text: "Visceral weight, the belly weight most tied to metabolic risk." },
        { label: "Blood pressure", text: "Blood pressure, that often rises alongside insulin resistance." },
        { label: "Chronic inflammation", text: "Chronic inflammation, the quiet driver linking weight and blood sugar." },
        { label: "Poor sleep & stress", text: "Poor sleep & stress, that raise blood sugar and make weight harder to move." },
        { label: "Nutrition patterns", text: "Nutrition patterns, the daily habits that steer your numbers most." },
      ],
    },
    carePlan: {
      heading: "Your metabolic care plan: four steps, built around your body",
      stepDescriptions: [
        "Fasting insulin, A1c, a full lipid and inflammation panel, and blood pressure, a deeper look than a yearly recheck.",
        "We map your results onto the loop so you finally see how the numbers connect.",
        "Nutrition, movement, targeted support, and stress and sleep work, sequenced to your labs, not a template.",
        "We track your numbers over time alongside your primary care, so progress holds and your markers keep improving.",
      ],
    },
    treatments: {
      heading: "Tools we reach for with metabolic health",
      eyebrow: "Treatments we may use",
      cards: [
        { slug: "advanced-lab-testing", title: "Advanced Lab Testing", desc: "Insulin, A1c, and lipid testing for real clarity on your root causes." },
        { slug: "glp-1-weight-loss", title: "GLP-1 & Weight Loss", desc: "Metabolic support where weight and insulin resistance are driving risk." },
        { slug: "peptide-therapy", title: "Peptide Therapy", desc: "Targeted support for metabolism and body composition." },
      ],
    },
    proof: {
      eyebrow: "Metabolic patients, in their words",
      quote: "My A1c came down out of the prediabetes range, and for once I feel in control of where this is heading.",
      name: "David R.",
      meta: "Metabolic health \u00b7 Atlanta patient",
    },
    faq: [
      { q: "Can functional medicine help insulin resistance and prediabetes?", a: "Yes. We address insulin resistance by working on what drives it, blood sugar, weight, and inflammation, alongside your primary care. Many people see their markers improve as the root causes are addressed." },
      { q: "Do you replace my regular doctor for diabetes or blood pressure?", a: "We work alongside your primary and specialty care. Our focus is the root-cause and lifestyle side that addresses why your numbers are rising." },
      { q: "What testing do you run for metabolic health?", a: "We go beyond a basic panel, with fasting insulin, A1c, a full lipid and inflammation panel, and blood pressure, so the plan targets your specific root causes." },
      { q: "I was told I am borderline. Why act now?", a: "The years before a diagnosis are the most changeable. Addressing insulin resistance early is the best chance to keep your numbers from crossing the line." },
      { q: "Can these changes really move my numbers?", a: "Often, yes. Nutrition, movement, sleep, and targeted support can meaningfully improve blood sugar, weight, and other markers over time. We track it with you." },
      { q: "Will I have to go on medication?", a: "That is a decision you make with your doctors. We focus on the root-cause work, and where medication fits, we pair it with the changes that address the cause." },
      { q: "Do you offer virtual metabolic care or only in person in Atlanta?", a: "Both. See Dr. Nina Ross in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
    ],
    startHeading: "The $99 Symptom Consultation",
  },
  {
    slug: "mood",
    name: "Mood",
    title: "Natural Anxiety & Mood Support in Atlanta | Root-Cause Care – Nina Ross FM",
    description:
      "Anxious, low, or not yourself? Dr. Nina Ross, a functional medicine doctor in Atlanta, looks at the root causes behind anxiety and mood. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/mood-share.jpg",
    slotPrefix: "moodD",
    medicalConditionName: "Mood Disorder",
    faqQuestionsIntro: "Questions patients ask us",
    schemaFaqName: "",
    breadcrumbLabel: "Mood",
    hero: {
      eyebrow: "Anxiety & Mood Support in Atlanta",
      heading: "Root-cause anxiety and mood care in Atlanta that looks at the whole you.",
      paragraphs: [
        "If the anxiety, the low mood, the edginess and the sense that you are not quite yourself have crept in without a clear reason, you are not imagining it.",
        "How you feel is real, and it deserves someone who will look at the whole story, body included. At Nina Ross Functional Medicine, we look at the root causes behind mood, here in Atlanta and virtually across Georgia. Dr. Nina Ross follows the whole picture, the gut, blood sugar, and hormones, to understand what is shaping how you feel, working alongside your mental health care, then builds the plan around your body and your life.",
      ],
      secondaryLabel: "See what standard labs may be missing →",
    },
    symptoms: {
      heading: "The signs we hear most often",
      items: [
        { label: "Anxiety with no clear cause", text: "A hum of worry with nothing obvious behind it." },
        { label: "A low, flat mood", text: "A flatness that dims the things you used to enjoy." },
        { label: "Irritability & a short fuse", text: "A short fuse over things that never bothered you." },
        { label: "Racing thoughts at night", text: "A mind that will not quiet when you lie down." },
        { label: "Brain fog & low focus", text: "Focus and clarity that keep slipping away." },
        { label: "Feeling not like yourself", text: "The sense that you have drifted from yourself." },
      ],
    },
    whyMisses: {
      heading: "You were offered a prescription and the door.",
      paragraph: "A fifteen-minute visit rarely has room to ask what in the body might be shaping your mood. So how you feel gets met with a single prescription, and the physical drivers go unexamined.",
      told: "\u201CLet us try this medication and see how you feel in a few weeks.\u201D",
      truth: "The gut, blood sugar, and hormones are influencing your brain in a loop. Steady the loop and mood often steadies with it.",
    },
    fmDifference: {
      heading: "We will not treat your mind and ignore your body.",
      paragraphs: [
        "Here is where we part ways with conventional care. When mood suffers, the reflex answer is often a single prescription with little look at the body underneath. Medication helps many people, and it has its place. But the gut, blood sugar, thyroid, and nutrients all shape how you feel, and leaving them unexamined means a real driver can go unaddressed.",
        "We would rather do the harder, more honest work. We look for what in your body is shaping how you feel and we address that, alongside your mental health care.",
        "If medication and therapy have a place in your care, and for many people they do, that should be part of a full picture, with the body looked at too.",
      ],
      callouts: [
        { title: "It treats the mind, not the whole you", body: "Mood is shaped by the body too, so the gut, blood sugar, and hormones deserve a look." },
        { title: "A prescription can skip the cause", body: "Medication can ease symptoms while a nutrient or thyroid driver goes unfound." },
        { title: "It works best alongside the body work", body: "Addressing the physical drivers often makes everything else work better." },
      ],
    },
    rootCause: {
      heading: "Mood runs in a loop. We map the whole circle.",
      intro: "Each driver pushes the next. That is why treating one in isolation rarely holds, and why mapping the full cycle changes everything.",
      connector: "When we look at your mood, we read the whole picture rather than symptoms alone, and connect each driver back to what you're feeling:",
      drivers: [
        { label: "The gut-brain axis", text: "The gut-brain axis, where an inflamed gut quietly shapes anxiety and low mood." },
        { label: "Blood sugar swings", text: "Blood sugar swings, behind the irritability, the shakiness, and the afternoon dip." },
        { label: "Thyroid function", text: "Thyroid function, an imbalance that can look exactly like depression or anxiety." },
        { label: "Sex hormones", text: "Sex hormones, the estrogen and progesterone shifts that move mood." },
        { label: "Nutrient gaps", text: "Nutrient gaps, low B vitamins, vitamin D, omega-3s, and iron the brain needs." },
        { label: "Cortisol & stress", text: "Cortisol & stress, a stress response stuck on that frays calm and sleep." },
        { label: "Chronic inflammation", text: "Chronic inflammation, the quiet driver increasingly linked to mood." },
      ],
    },
    carePlan: {
      heading: "Your mood care plan: four steps, built around your body",
      stepDescriptions: [
        "Thyroid, blood sugar, key nutrients, hormones, and inflammation markers, the labs a rushed visit skips.",
        "We map your results onto the loop so you finally see what may be shaping how you feel.",
        "Nutrition, targeted nutrients, gut support, and stress work, sequenced to your labs, not a template.",
        "We adjust over time alongside your mental health care, so progress holds and mood and focus keep improving.",
      ],
    },
    treatments: {
      heading: "Tools we reach for with mood",
      eyebrow: "Treatments we may use",
      cards: [
        { slug: "advanced-lab-testing", title: "Advanced Lab Testing", desc: "Thyroid, nutrient, and hormone testing for real clarity on the root causes." },
        { slug: "iv-therapy", title: "IV Therapy", desc: "Replenishing the nutrients your brain relies on to feel steady." },
        { slug: "vitamin-injections", title: "Vitamin Injections", desc: "B vitamins and targeted nutrients that support mood and energy." },
      ],
    },
    proof: {
      eyebrow: "Patients, in their words",
      quote: "The constant edge is gone. Once my thyroid and nutrients were addressed, I finally felt steady again.",
      name: "James W.",
      meta: "Mood & anxiety \u00b7 Atlanta patient",
    },
    faq: [
      { q: "Can functional medicine help anxiety and low mood?", a: "Yes. We look at the physical drivers behind mood, the gut, blood sugar, thyroid, hormones, and nutrients, alongside your mental health care. Many people feel steadier as those root causes are addressed." },
      { q: "Do you replace my therapist or psychiatrist?", a: "We work alongside your mental health care. Our focus is the body side of mood, which is often overlooked." },
      { q: "What testing do you run for mood?", a: "We go beyond a basic panel, with thyroid, blood sugar, key nutrients, hormones, and inflammation markers, so the plan targets your specific root causes." },
      { q: "Can a physical problem really affect my mood?", a: "Yes. Thyroid imbalance, blood sugar swings, nutrient gaps, and gut inflammation can all look and feel like anxiety or depression. We find and address them." },
      { q: "Will I have to stop my medication?", a: "Any changes to medication are made with your prescriber. We focus on the root-cause work that supports how you feel." },
      { q: "How soon might I notice a difference?", a: "Some people feel steadier within a few weeks as blood sugar and nutrients improve, while deeper change follows your body over time." },
      { q: "Do you offer virtual mood care or only in person in Atlanta?", a: "Both. See Dr. Nina Ross in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
    ],
    startHeading: "The $99 Symptom Consultation",
  },
  {
    slug: "pcos",
    name: "PCOS",
    title: "PCOS Specialist in Atlanta | Root-Cause Care – Nina Ross FM",
    description:
      "Struggling with PCOS? Dr. Nina Ross, a functional medicine PCOS specialist in Atlanta, treats the root cause, hormones, insulin, weight. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/pcos-share.jpg",
    slotPrefix: "pcosD",
    medicalConditionName: "Polycystic Ovary Syndrome",
    faqQuestionsIntro: "Questions women ask us",
    schemaFaqName: "",
    breadcrumbLabel: "PCOS",
    hero: {
      eyebrow: "PCOS Treatment in Atlanta",
      heading: "Root-cause PCOS treatment in Atlanta that finally connects the dots.",
      paragraphs: [
        "If your labs came back \u2018normal\u2019 but you still feel off, the irregular periods, the weight that holds on, the thinning hair, the acne, the bone deep exhaustion, you are not imagining it.",
        "Your body is telling the truth, and it deserves someone who will listen to the whole story. At Nina Ross Functional Medicine, we treat PCOS at its root, here in Atlanta and virtually across Georgia. Dr. Nina Ross follows the whole loop until she finds what is really driving your PCOS, then builds the plan around your body and your life.",
      ],
      secondaryLabel: "See what standard labs may be missing →",
    },
    symptoms: {
      heading: "The PCOS signs we hear most often",
      items: [
        { label: "Weight that won't budge", text: "No matter how clean the diet or how hard the workouts." },
        { label: "Irregular or missing cycles", text: "Periods that arrive whenever they please, or not at all." },
        { label: "Acne & unwanted hair growth", text: "Skin and hair changes that feel out of your control." },
        { label: "Crashing afternoon energy", text: "That wall at 3pm that coffee can no longer fix." },
        { label: "Mood swings & brain fog", text: "Feeling foggy, flat, or not quite like yourself." },
        { label: "Trouble trying to conceive", text: "Months of trying with no clear answers why." },
      ],
    },
    whyMisses: {
      heading: "You were told to lose weight and come back.",
      paragraph: "A fifteen-minute visit rarely has room to look at the whole system. So PCOS gets managed one symptom at a time, and the thing connecting them goes unexamined.",
      told: "\u201CTake the pill, lose some weight, come back if you want to get pregnant.\u201D",
      truth: "Insulin, androgens, and inflammation are feeding each other in a loop. Quiet the loop and the symptoms ease together.",
    },
    fmDifference: {
      heading: "We will not hand you birth control and call it a cure.",
      paragraphs: [
        "Here is where we part ways with conventional care. The pill is the reflex answer for PCOS, and yes, it can quiet the surface. It can force a monthly bleed, calm the acne, slow the hair growth. But synthetic hormones do not treat PCOS. They switch off the conversation your body is trying to have with you, and the day you stop, the symptoms come back, often louder than before.",
        "We would rather do the harder, more honest work. We find what is actually driving your PCOS and we treat that.",
        "If birth control still has a place in your life, that should be your informed choice, made with the full picture in front of you, not a default handed to you in a fifteen minute visit.",
      ],
      callouts: [
        { title: "It masks the signal, not the cause", body: "A monthly bleed on the pill is a withdrawal bleed, not your body ovulating on its own." },
        { title: "It can deepen insulin resistance", body: "The very engine sitting at the center of your PCOS can get worse on synthetic hormones." },
        { title: "It postpones the real question", body: "If you hope to conceive one day, the PCOS is still waiting for you the moment you come off it." },
      ],
    },
    rootCause: {
      heading: "PCOS runs in a loop. We map the whole circle.",
      intro: "Each driver pushes the next. That is why treating one in isolation rarely holds, and why mapping the full cycle changes everything.",
      connector: "When we investigate PCOS, we read the whole hormonal and metabolic picture rather than a single number, and connect each driver back to what you are feeling:",
      drivers: [
        { label: "Insulin resistance", text: "Insulin resistance, the engine behind weight that won't budge and afternoon energy crashes." },
        { label: "Elevated androgens & testosterone", text: "Elevated androgens & testosterone, behind acne, unwanted hair growth, and thinning hair." },
        { label: "Irregular ovulation", text: "Irregular ovulation, the missing or unpredictable cycles, and trouble trying to conceive." },
        { label: "Thyroid", text: "Thyroid, an underactive thyroid mimics and deepens PCOS symptoms." },
        { label: "Cortisol & stress", text: "Cortisol & stress, keeps the loop switched on and disrupts your cycle." },
        { label: "Chronic inflammation", text: "Chronic inflammation, the quiet thread linking insulin and hormones together." },
        { label: "Gut health", text: "Gut health, where hormone metabolism and inflammation so often begin." },
      ],
    },
    carePlan: {
      heading: "Your PCOS care plan: four steps, built around your body",
      stepDescriptions: [
        "Fasting insulin, full androgen panel, thyroid, inflammation markers, the labs a rushed visit skips.",
        "We map your results onto the loop so you finally see why the symptoms travel together.",
        "Nutrition, targeted supplements, movement, and stress work, sequenced to your labs, not a template.",
        "We adjust as your numbers move, so progress holds and cycles, energy, and skin keep improving.",
      ],
    },
    treatments: {
      heading: "Tools we reach for with PCOS",
      eyebrow: "Treatments we may use",
      cards: [
        { slug: "glp-1-weight-loss", title: "GLP-1 & Weight Loss", desc: "Metabolic support when insulin resistance makes losing weight hard." },
        { slug: "hormone-restoration", title: "Hormone Restoration", desc: "Rebalancing androgens and hormones at the source." },
        { slug: "advanced-lab-testing", title: "Advanced Lab Testing", desc: "Going beyond the standard panel for real clarity on your root causes." },
      ],
    },
    proof: {
      eyebrow: "Women with PCOS, in their words",
      quote: "My cycle came back after seven years. For the first time someone explained why, and then actually fixed it.",
      name: "Renata M.",
      meta: "PCOS \u00b7 Atlanta patient",
    },
    faq: [
      { q: "Can functional medicine help PCOS?", a: "Yes. Functional medicine treats PCOS by addressing what is driving it, insulin resistance, androgens, inflammation, rather than only masking symptoms. Most women see changes in cycles, energy, and weight as the root causes are corrected." },
      { q: "How is a PCOS specialist different from my OB-GYN?", a: "Your OB-GYN manages the gynecologic side of PCOS. As a functional medicine PCOS specialist in Atlanta, Dr. Nina Ross maps the whole metabolic and hormonal loop and builds a personalized plan, labs, nutrition, and targeted treatments, to address the cause." },
      { q: "Does PCOS cause weight gain, and can it be reversed?", a: "PCOS-related insulin resistance makes weight gain easier and loss harder. When we improve insulin sensitivity and hormone balance, weight often becomes responsive again. We may use nutrition, peptides, or GLP-1 support where appropriate." },
      { q: "What lab testing do you run for PCOS?", a: "We go beyond a standard panel, fasting insulin and glucose, a full androgen and hormone panel, thyroid, inflammatory markers, and nutrient status, so the plan targets your specific root causes." },
      { q: "Do I have to be on birth control to manage PCOS?", a: "Birth control can mask PCOS symptoms but does not address the cause. We offer root-cause options and will work alongside your existing care if you choose to stay on it." },
      { q: "Can I still get pregnant with PCOS?", a: "Many women with PCOS conceive once ovulation and insulin resistance are addressed. We focus on restoring the conditions your body needs, and coordinate with your OB-GYN or fertility specialist." },
      { q: "Do you offer virtual PCOS care or only in person in Atlanta?", a: "Both. See Dr. Nina Ross in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
    ],
    startHeading: "The $99 Symptom Consultation",
  },
  {
    slug: "sexual-health",
    name: "Sexual health",
    title: "Low Libido & Sexual Health Care in Atlanta | Root-Cause – Nina Ross FM",
    description:
      "Low libido or sexual changes? Dr. Nina Ross, a functional medicine doctor in Atlanta, treats the root causes behind desire and sexual health. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/sexual-health-share.jpg",
    slotPrefix: "sexualD",
    medicalConditionName: "Sexual Dysfunction",
    faqQuestionsIntro: "Questions patients ask us",
    schemaFaqName: "",
    breadcrumbLabel: "Sexual Health",
    hero: {
      eyebrow: "Sexual Health Care in Atlanta",
      heading: "Root-cause sexual health care in Atlanta that helps desire come back.",
      paragraphs: [
        "If your desire has faded, intimacy feels different and you quietly wonder where that part of you went, you are not imagining it.",
        "This part of your health is real, and it deserves someone who will listen without rushing you. At Nina Ross Functional Medicine, we treat sexual health at its root, here in Atlanta and virtually across Georgia. Dr. Nina Ross follows the whole picture, hormones, energy, and circulation, until she finds what is really behind the change, then builds the plan around your body and your life.",
      ],
      secondaryLabel: "See what standard labs may be missing →",
    },
    symptoms: {
      heading: "The signs we hear most often",
      items: [
        { label: "Low or absent desire", text: "A desire that has quietly faded into the background." },
        { label: "Changes in arousal", text: "Arousal that feels different or harder to reach." },
        { label: "Dryness or discomfort", text: "Discomfort that makes intimacy something to avoid." },
        { label: "Low energy & drive", text: "Energy and drive too low to leave room for it." },
        { label: "Stress that crowds out intimacy", text: "A mind too full and stressed to be present." },
        { label: "Feeling disconnected from your body", text: "A sense of distance from your own body." },
      ],
    },
    whyMisses: {
      heading: "You were told it is normal, or it is in your head.",
      paragraph: "A fifteen-minute visit rarely has room for this conversation. So changes in desire get dismissed as normal or stress, and the real drivers go unexamined.",
      told: "\u201CThat is pretty normal. It is probably just stress or your age.\u201D",
      truth: "Hormones, energy, and stress are dampening desire together in a loop. Address the loop and desire often returns.",
    },
    fmDifference: {
      heading: "We will not wave it off as normal.",
      paragraphs: [
        "Here is where we part ways with conventional care. Changes in desire are often brushed off as normal, stress, or age, with little examination. Reassurance has its place. But hormones, thyroid, energy, circulation, and mood all shape desire, and leaving them unexamined means a real and treatable driver can be missed.",
        "We would rather do the harder, more honest work. We find what is actually behind the change and we treat that.",
        "If a medication still has a place in your care, that should be your informed choice, made with the full picture in front of you, not a default handed to you in a fifteen minute visit.",
      ],
      callouts: [
        { title: "Normal is not the same as unchangeable", body: "A change in desire usually has a driver, and most of them respond to care." },
        { title: "It is rarely all in your head", body: "Hormones, energy, and circulation shape desire as much as mindset does." },
        { title: "It postpones a real conversation", body: "Brushing it off ends the search before anyone looks for the cause." },
      ],
    },
    rootCause: {
      heading: "Desire runs in a loop. We map the whole circle.",
      intro: "Each driver pushes the next. That is why treating one in isolation rarely holds, and why mapping the full cycle changes everything.",
      connector: "When we look at sexual health, we read the whole hormonal and energy picture rather than a single cause, and connect each driver back to what you're feeling:",
      drivers: [
        { label: "Sex hormones", text: "Sex hormones, low testosterone, estrogen, and progesterone behind fading desire." },
        { label: "Thyroid & energy", text: "Thyroid & energy, where low energy leaves little room for intimacy." },
        { label: "Cortisol & stress", text: "Cortisol & stress, a stress response that quietly switches desire off." },
        { label: "Circulation", text: "Circulation, blood flow that shapes arousal and physical response." },
        { label: "Mood", text: "Mood, anxiety and low mood that crowd out connection." },
        { label: "Blood sugar & metabolism", text: "Blood sugar & metabolism, that influence both energy and hormones." },
        { label: "Medication effects", text: "Medication effects, common prescriptions that can dampen libido." },
      ],
    },
    carePlan: {
      heading: "Your sexual health plan: four steps, built around your body",
      stepDescriptions: [
        "A full sex-hormone panel, thyroid, metabolic and nutrient markers, the labs a rushed visit skips.",
        "We map your results onto the loop so you finally see what is behind the change.",
        "Hormone support where it fits, nutrition, energy and stress work, sequenced to your labs, not a template.",
        "We adjust over time, so progress holds and energy, desire, and connection keep improving.",
      ],
    },
    treatments: {
      heading: "Tools we reach for with sexual health",
      eyebrow: "Treatments we may use",
      cards: [
        { slug: "hormone-restoration", title: "Hormone Restoration", desc: "Rebalancing the hormones behind desire and arousal." },
        { slug: "advanced-lab-testing", title: "Advanced Lab Testing", desc: "A full hormone panel for real clarity on your root causes." },
        { slug: "peptide-therapy", title: "Peptide Therapy", desc: "Targeted support for desire, energy, and recovery." },
      ],
    },
    proof: {
      eyebrow: "Patients, in their words",
      quote: "I had written this part of me off. Once my hormones were addressed, it quietly came back.",
      name: "Renee A.",
      meta: "Sexual health \u00b7 Atlanta patient",
    },
    faq: [
      { q: "Can functional medicine help low libido?", a: "Yes. We treat changes in desire by addressing what is behind them, hormones, energy, circulation, and stress, rather than waving them off. Many people find desire returns as the root causes are corrected." },
      { q: "Is low desire just a normal part of aging or stress?", a: "Age and stress play a role, but a change in desire usually has identifiable drivers. We test and address them rather than leaving it unexplained." },
      { q: "What testing do you run for sexual health?", a: "We go beyond a basic panel, with a full sex-hormone panel, thyroid, and metabolic and nutrient markers, so the plan targets your specific root causes." },
      { q: "Will this conversation feel comfortable?", a: "Yes. This is a private, unhurried conversation with a doctor who takes it seriously. You set the pace and we listen." },
      { q: "Could my medication be affecting my libido?", a: "It is possible. Several common prescriptions can dampen desire. We review this with you and work alongside your other providers." },
      { q: "Does this apply to both women and men?", a: "Yes. Hormones, energy, and circulation shape desire for everyone, and we tailor the workup and plan to you." },
      { q: "Do you offer virtual sexual health care or only in person in Atlanta?", a: "Both. See Dr. Nina Ross in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
    ],
    startHeading: "The $99 Symptom Consultation",
  },
  {
    slug: "undiagnosed-but-unwell",
    name: "Unexplained symptoms",
    title: "Undiagnosed but Unwell? Start Here in Atlanta – Nina Ross FM",
    description:
      "Told your labs are normal but you still feel unwell? Dr. Nina Ross runs advanced testing to find the root cause behind unexplained symptoms, in Atlanta and virtually across Georgia. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/undiagnosed-share.jpg",
    slotPrefix: "undiagD",
    medicalConditionName: "Medically Unexplained Symptoms",
    faqQuestionsIntro: "Questions patients ask us",
    schemaFaqName: "",
    breadcrumbLabel: "Undiagnosed but Unwell",
    hero: {
      eyebrow: "Undiagnosed but Unwell? Start Here",
      heading: "Real answers in Atlanta when you have been unwell but no one can say why.",
      paragraphs: [
        "If your labs keep coming back \u201Cnormal\u201D while you still feel unwell, the problem is the search, not you.",
        "Your symptoms are real, and they deserve someone who will follow them all the way to the cause. At Nina Ross Functional Medicine, we investigate unexplained symptoms here in Atlanta and virtually across Georgia. Dr. Nina Ross reads your whole system, your hormones, gut, metabolism, and the stress you carry, against optimal ranges until she finds what others have missed, then builds the plan around your body and your life.",
      ],
      secondaryLabel: "See what standard labs may be missing →",
    },
    symptoms: {
      heading: "The patterns we hear most from people no one could explain",
      items: [
        { label: "Labs keep coming back normal", text: "Test after test says you are fine, but you know you are not." },
        { label: "Symptoms that do not add up", text: "A scattered set of issues no single specialist will connect." },
        { label: "Passed between specialists", text: "Each one looks at their piece and sends you on." },
        { label: "Tired, foggy, and not yourself", text: "Energy, focus, and mood that have quietly slipped." },
        { label: "Told it is stress or anxiety", text: "Your concerns waved off instead of investigated." },
        { label: "Running out of places to turn", text: "You have done the rounds and still have no real answer." },
      ],
    },
    whyMisses: {
      heading: "Your labs were normal, so you were sent home.",
      paragraph: "A fifteen-minute visit rarely has room to connect symptoms across systems. So anything without an obvious diagnosis gets brushed off as stress or aging, and the real driver goes unexamined.",
      told: "\u201CEverything looks normal. You are probably just stressed, try to sleep more.\u201D",
      truth: "Your hormones, gut, metabolism, and stress are pulling on each other in a pattern no single test shows. Map them together and the cause appears.",
    },
    fmDifference: {
      heading: "We will not call it stress and send you home.",
      paragraphs: [
        "Here is where we part ways with conventional care. When the standard panel looks normal, unexplained symptoms often get labeled stress, and you are handed reassurance or a prescription to quiet them. That can blunt the feeling for a while. But masking a symptom does not resolve its cause. The moment it wears off, the problem is still there, and often deeper.",
        "We would rather do the harder, more honest work. We find what is actually driving how you feel and we treat that.",
        "If a medication still has a place in your care, that should be your informed choice, made with the full picture in front of you, not a default handed to you in a fifteen minute visit.",
      ],
      callouts: [
        { title: "It names a feeling, not a cause", body: "Being told you are stressed does not explain why your body stopped making steady energy." },
        { title: "A prescription can mask the symptom", body: "Quieting a symptom is not the same as finding and fixing what is causing it." },
        { title: "It postpones the real recovery", body: "Every year without answers lets the real driver settle in deeper." },
      ],
    },
    rootCause: {
      heading: "Unexplained symptoms travel together. We map the whole system.",
      intro: "Each driver pushes the next. That is why treating one in isolation rarely holds, and why mapping the full cycle changes everything.",
      connector: "When we investigate, we read your whole system rather than a single number, and connect each driver back to how you feel:",
      drivers: [
        { label: "Hormones", text: "Hormones, the mood, weight, cycles, and drive that feel off." },
        { label: "Thyroid & metabolism", text: "Thyroid & metabolism, the slow, cold, heavy kind of tiredness." },
        { label: "Gut & digestion", text: "Gut & digestion, the bloating, reflux, and immune load they carry." },
        { label: "Blood sugar", text: "Blood sugar, behind the crashes, cravings, and afternoon walls." },
        { label: "Nutrient depletion", text: "Nutrient depletion, low iron, B12, or vitamin D draining your reserves." },
        { label: "Chronic inflammation", text: "Chronic inflammation, the low hum behind aches and brain fog." },
        { label: "Stress & sleep", text: "Stress & sleep, a nervous system stuck on that never lets you recover." },
      ],
    },
    carePlan: {
      heading: "Your root-cause plan: four steps, built around your body",
      stepDescriptions: [
        "Advanced hormone, thyroid, gut, metabolic, and nutrient labs, the testing a rushed visit skips.",
        "We map your results together so you finally see why the symptoms travel as a set.",
        "Nutrition, targeted supplements, paced movement, and stress work, sequenced to your labs, not a template.",
        "We adjust as your numbers move, so progress holds and you keep feeling more like yourself.",
      ],
    },
    treatments: {
      heading: "The testing that finds your answer",
      eyebrow: "Where we usually start",
      cards: [
        { slug: "advanced-lab-testing", title: "Advanced Lab Testing", desc: "The deep panel that reads your whole system against optimal ranges." },
        { slug: "dutch-test", title: "DUTCH Test", desc: "Advanced hormone and cortisol testing for what a standard panel skips." },
        { slug: "gi-map-test", title: "GI-MAP Test", desc: "A clear read on the gut, often the hidden driver of whole-body symptoms." },
      ],
    },
    proof: {
      eyebrow: "Patients we finally helped",
      quote: "Four specialists, no answers. She found it in one round of testing. I finally have a plan instead of a shrug.",
      name: "Renee P.",
      meta: "Atlanta patient",
    },
    faq: [
      { q: "What does it mean to be undiagnosed but unwell?", a: "It means your symptoms are real but no one has connected them to a cause yet. We read your whole system against optimal ranges and look for the pattern others have missed, then treat it." },
      { q: "My labs are normal. Why do I still feel unwell?", a: "Standard labs flag disease, not how well you function. We read your results against optimal ranges and map how your hormones, gut, metabolism, and stress connect, which is where the answer usually hides." },
      { q: "What testing do you run for unexplained symptoms?", a: "We go well beyond a basic panel, with advanced hormone, thyroid, gut, metabolic, nutrient, and inflammation testing, so the plan targets your specific root causes." },
      { q: "Can functional medicine help when no one has found a diagnosis?", a: "Yes. Functional medicine is built for exactly this, connecting symptoms across systems to find the driver and then treating it. Most people finally get both answers and a plan." },
      { q: "How long until I start feeling better?", a: "Many people feel a first shift within a few weeks, though deeper recovery follows your body, not a calendar. We pace the plan so progress holds." },
      { q: "Do I need a referral or a diagnosis to start?", a: "You can start with just your story. The $99 Symptom Consultation is open to anyone who feels unwell and wants real answers." },
      { q: "Do you offer virtual visits or only in person in Atlanta?", a: "Both. See Dr. Nina Ross in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
    ],
    startHeading: "The $99 Symptom Consultation",
  },
  {
    slug: "weight-loss",
    name: "Weight loss",
    title: "Weight Loss Clinic in Atlanta | Root-Cause Metabolism Care – Nina Ross FM",
    description:
      "Doing everything right and the weight still will not move? Dr. Nina Ross, a functional medicine weight loss doctor in Atlanta, treats metabolism at the root. Book a $99 consult.",
    ogImage: "https://www.ninarossfm.com/og/weight-loss-share.jpg",
    slotPrefix: "weightD",
    medicalConditionName: "Metabolic Disorder",
    faqQuestionsIntro: "Questions patients ask us",
    schemaFaqName: "",
    breadcrumbLabel: "Weight Loss",
    hero: {
      eyebrow: "Weight Loss Clinic in Atlanta",
      heading: "Root-cause weight and metabolism care in Atlanta that finally makes your body respond.",
      paragraphs: [
        "If you are eating well, moving more and the scale still will not move, or it climbs while you do everything right, you are not imagining it.",
        "The struggle is real, and it deserves someone who will listen to the whole story. At Nina Ross Functional Medicine, we treat weight at its root, here in Atlanta and virtually across Georgia. Dr. Nina Ross follows the whole picture, insulin, thyroid, and the hormones behind a stalled metabolism, until she finds what is really holding your weight on, then builds the plan around your body and your life.",
      ],
      secondaryLabel: "See what standard labs may be missing →",
    },
    symptoms: {
      heading: "The metabolism signs we hear most often",
      items: [
        { label: "Weight that will not move", text: "The scale holding still no matter what you try." },
        { label: "Stubborn belly weight", text: "Weight that settles around the middle and stays." },
        { label: "Constant cravings & hunger", text: "Hunger and cravings that never seem to quiet." },
        { label: "An afternoon energy crash", text: "That wall in the afternoon that coffee cannot fix." },
        { label: "Slow metabolism & feeling cold", text: "Cold hands, low energy, a metabolism in low gear." },
        { label: "Weight climbing with no change", text: "The number climbing while nothing in your routine changed." },
      ],
    },
    whyMisses: {
      heading: "You were told to eat less and move more.",
      paragraph: "A fifteen-minute visit rarely has room to look at the whole metabolism. So weight gets blamed on willpower, and the thing holding it on goes unexamined.",
      told: "\u201CJust eat less and move more. It really is that simple.\u201D",
      truth: "Insulin, thyroid, and stress hormones are working against you in a loop. Correct the loop and your metabolism responds again.",
    },
    fmDifference: {
      heading: "We will not blame your willpower and call it a plan.",
      paragraphs: [
        "Here is where we part ways with conventional care. When the weight will not move, the reflex answer is a stricter diet and more discipline, or a medication handed over with no map of why your metabolism stalled. A crash diet can drop a few pounds. But under-eating a stalled metabolism teaches your body to conserve, and the weight returns the moment real life resumes.",
        "We would rather do the harder, more honest work. We find what is actually holding your weight on and we treat that.",
        "If a medication like a GLP-1 still has a place in your plan, that should be your informed choice, made with the full picture in front of you, and paired with the work that makes it last.",
      ],
      callouts: [
        { title: "It blames effort, not biology", body: "Being told to try harder ignores the insulin and hormones quietly holding your weight on." },
        { title: "Crash diets can slow you further", body: "Severe restriction signals scarcity, and your body answers by burning less." },
        { title: "A pill alone postpones the fix", body: "Medication without a root-cause plan tends to fade the moment you stop taking it." },
      ],
    },
    rootCause: {
      heading: "Stubborn weight runs in a loop. We map the whole circle.",
      intro: "Each driver pushes the next. That is why treating one in isolation rarely holds, and why mapping the full cycle changes everything.",
      connector: "When we investigate your metabolism, we read the whole hormonal and metabolic picture rather than a single number, and connect each driver back to what you're feeling:",
      drivers: [
        { label: "Insulin resistance", text: "Insulin resistance, the engine that stores fat and blocks the body from burning it." },
        { label: "An underactive thyroid", text: "An underactive thyroid, the slow metabolism, the cold hands, and the stalled scale." },
        { label: "Cortisol & stress", text: "Cortisol & stress, that parks weight around the middle and drives cravings." },
        { label: "Hormone shifts", text: "Hormone shifts, where perimenopause and low hormones change how you store weight." },
        { label: "Blood sugar swings", text: "Blood sugar swings, behind the hunger, the crashes, and the late-day snacking." },
        { label: "Poor sleep", text: "Poor sleep, that raises hunger hormones and lowers the will to move." },
        { label: "Chronic inflammation", text: "Chronic inflammation, the quiet driver that keeps metabolism stuck." },
      ],
    },
    carePlan: {
      heading: "Your weight care plan: four steps, built around your body",
      stepDescriptions: [
        "Fasting insulin, A1c, full thyroid, hormones and inflammation markers, the labs a rushed visit skips.",
        "We map your results onto the loop so you finally see why the weight will not move.",
        "Nutrition, metabolic and GLP-1 support where it fits, movement and stress work, sequenced to your labs, not a template.",
        "We adjust as your metabolism wakes up, so progress holds and energy, cravings, and the scale keep improving.",
      ],
    },
    treatments: {
      heading: "Tools we reach for with weight",
      eyebrow: "Treatments we may use",
      cards: [
        { slug: "glp-1-weight-loss", title: "GLP-1 & Weight Loss", desc: "Metabolic support when insulin resistance makes losing weight hard." },
        { slug: "advanced-lab-testing", title: "Advanced Lab Testing", desc: "Insulin, thyroid, and hormone testing for real clarity on your root causes." },
        { slug: "peptide-therapy", title: "Peptide Therapy", desc: "Targeted support for metabolism, body composition, and recovery." },
      ],
    },
    proof: {
      eyebrow: "Weight patients, in their words",
      quote: "For the first time in a decade the scale is moving, and it finally feels like my body is on my side.",
      name: "Marcus B.",
      meta: "Weight & metabolism \u00b7 Atlanta patient",
    },
    faq: [
      { q: "Can functional medicine help with stubborn weight?", a: "Yes. We treat weight by addressing what is holding it on, insulin, thyroid, hormones, and stress, rather than blaming willpower. Most people find the scale responds again as the root causes are corrected." },
      { q: "Do you offer GLP-1 medications like semaglutide?", a: "Where it is appropriate, yes. We use GLP-1 support as one tool inside a full plan, paired with nutrition and root-cause work so the results last beyond the medication." },
      { q: "What testing do you run for weight and metabolism?", a: "We go beyond a basic panel, with fasting insulin, A1c, full thyroid, hormones, and inflammation markers, so the plan targets your specific root causes." },
      { q: "Why can I not lose weight even when I eat well?", a: "Often the issue is insulin resistance, thyroid, or hormones quietly telling your body to store rather than burn. When we correct those, eating well finally starts to work." },
      { q: "Is this another crash diet?", a: "Severe restriction slows metabolism. We build a sustainable plan around your labs so your body feels safe enough to let the weight go." },
      { q: "Will the weight come back?", a: "Our goal is lasting change, so we treat the cause and adjust as your metabolism improves. That is what helps progress hold rather than rebound." },
      { q: "Do you offer virtual weight care or only in person in Atlanta?", a: "Both. See Dr. Nina Ross in person at our Atlanta clinic, or virtually anywhere in Georgia. Your $99 Symptom Consultation can be booked either way." },
    ],
    startHeading: "The $99 Symptom Consultation",
  },
];

export const CONDITIONS: LongformPageContent[] = RAW.map(buildCondition);

export function getConditionBySlug(slug: string): LongformPageContent | undefined {
  return CONDITIONS.find((c) => c.slug === slug);
}

export interface ConditionIndexEntry {
  slug: string;
  name: string;
  teaser: string;
}

export const CONDITIONS_INDEX: ConditionIndexEntry[] = RAW.map((r) => ({
  slug: r.slug,
  name: r.name,
  teaser: r.hero.paragraphs[0],
}));
