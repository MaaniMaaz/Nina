import type { LegalDoc } from "./types";

export const ACCESSIBILITY_STATEMENT: LegalDoc = {
  meta: {
    title: "Accessibility Statement | Nina Ross Functional Medicine",
    description:
      "How Nina Ross Functional Medicine works to keep this website usable for people with disabilities, the standards we aim for, and how to request an accommodation or report a barrier.",
    canonical: "/accessibility",
  },
  hero: {
    title: "Accessibility Statement",
    titleClamp: "clamp(34px, 5.4vw, 60px)",
    deck: "We want everyone who visits this site to be able to learn about our care, read our writing, and book a consultation. This page explains what we do to support that, where we still fall short, and how to reach us if something gets in the way.",
    deckVariant: "default",
    lastUpdated: "August 11, 2026",
    effective: "August 11, 2026",
  },
  contact: {
    heading: "Need an accommodation?",
    lines: [
      "Nina Ross Hair Therapy, LTD",
      "d/b/a Nina Ross Functional Medicine",
      "Atlanta, Georgia",
    ],
    email: "info@ninarossfm.com",
    note: "Write to us with Accessibility in the subject line. Tell us the page or feature that was hard to use, the device or assistive technology you were using if you know it, and what would help. We will confirm we received your message and work with you on a reasonable accommodation.",
    links: [
      {
        href: "/privacy",
        label: "Privacy Policy",
        variant: "ghost",
      },
      {
        href: "/terms",
        label: "Terms of Service",
        variant: "ghost",
      },
      {
        href: "/start",
        label: "Book a consult",
        variant: "primary",
      },
    ],
  },
  sections: [
    {
      id: "commitment",
      short: "Commitment",
      title: "Our commitment",
      paras: [
        "Nina Ross Hair Therapy, LTD, doing business as Nina Ross Functional Medicine, is committed to making this website accessible to people with disabilities. Accessibility is part of how we serve patients and visitors, not a one-time checklist.",
        "We design and maintain pages so that people using screen readers, keyboard-only navigation, magnification, captions, or other assistive technologies can reach the same information and complete the same tasks as anyone else, as far as we reasonably can.",
      ],
      bullets: [],
    },
    {
      id: "standards",
      short: "Standards",
      title: "Standards we aim for",
      paras: [
        "We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA. Those guidelines explain how to make web content more usable for people with a wide range of disabilities, including visual, auditory, physical, speech, cognitive, language, learning, and neurological disabilities.",
        "Conformance is an ongoing effort. New pages, images, forms, and third-party tools can introduce gaps, and we work to find and fix them as we learn about them.",
      ],
      bullets: [],
    },
    {
      id: "measures",
      short: "What we do",
      title: "Measures we take",
      paras: [
        "We build and review the site with accessibility in mind, and we revisit it as content and features change.",
      ],
      bullets: [
        {
          label: "Structure.",
          text: "Pages use clear headings, landmarks, and meaningful link text so assistive technologies can move through content in a logical order.",
        },
        {
          label: "Keyboard access.",
          text: "Primary actions and navigation are reachable without a mouse, with visible focus where we control the interface.",
        },
        {
          label: "Text alternatives.",
          text: "Images that convey meaning include alternative text; decorative images are marked so they can be ignored by screen readers.",
        },
        {
          label: "Color and contrast.",
          text: "We aim for sufficient contrast between text and backgrounds, and we do not rely on color alone to communicate meaning.",
        },
        {
          label: "Forms and booking.",
          text: "Labels, errors, and instructions are written so you can complete intake and booking steps without guessing what a field needs.",
        },
        {
          label: "Responsive layouts.",
          text: "Content reflows for different screen sizes and zoom levels so it remains readable on phones, tablets, and magnified desktops.",
        },
      ],
    },
    {
      id: "compatibility",
      short: "Compatibility",
      title: "Compatibility and assistive technology",
      paras: [
        "This site is designed to work with current versions of major browsers, including Chrome, Firefox, Safari, and Edge, on common desktop and mobile operating systems.",
        "We test with common assistive technologies where we can, including screen readers and keyboard-only navigation. Results can vary by browser, device, and user settings. If something works poorly with the tools you use, please tell us so we can investigate.",
      ],
      bullets: [],
    },
    {
      id: "limitations",
      short: "Limitations",
      title: "Known limitations",
      paras: [
        "Despite our efforts, some parts of the site may still be difficult for some people. We are honest about where that happens so you know what to expect and how to ask for help.",
      ],
      bullets: [
        "Some older blog or educational images may still need richer alternative text; we update those as we edit the pages.",
        "Embedded third-party tools used for booking, payments, video, maps, or analytics may not meet the same standard as our own pages. When we choose a vendor, we prefer ones with documented accessibility support, and we will help you complete the same task another way if a widget blocks you.",
        "PDFs or downloadable files, when we publish them, may not always be fully tagged. Ask us for an accessible format if you need one.",
        "Very complex diagrams or interactive explorers may take longer to make fully equivalent in non-visual form; contact us and we will provide the information in another format.",
      ],
    },
    {
      id: "feedback",
      short: "Feedback",
      title: "Feedback and accommodations",
      paras: [
        "If you find a barrier, need content in another format, or need an accommodation to book or complete care-related steps online, please contact us. We take these requests seriously and will respond as promptly as we reasonably can.",
        "Email info@ninarossfm.com with Accessibility in the subject line. Include the web address of the page, a short description of the problem, and any suggestions that would help. You do not need technical language; a clear description is enough.",
        "We will acknowledge your message, investigate the issue, and either fix it, provide the information another way, or explain what we can and cannot change and why.",
      ],
      bullets: [],
    },
    {
      id: "enforcement",
      short: "Enforcement",
      title: "Formal complaints",
      paras: [
        "If you are not satisfied with our response to an accessibility concern, you may also contact the U.S. Department of Justice Civil Rights Division regarding the Americans with Disabilities Act, or the U.S. Department of Health and Human Services Office for Civil Rights regarding disability discrimination in health programs and activities, as applicable to your situation.",
        "Nothing on this page limits any rights you have under applicable law.",
      ],
      bullets: [],
    },
  ],
};
