// Shared content types for Condition, Treatment, and Positioning pages.
// All three page kinds render through the same LongformPage template and
// share this block vocabulary, since the source designs use one consistent
// visual language across all three page families.

export interface FaqItem {
  q: string;
  a: string;
}

export interface CalloutItem {
  title: string;
  body: string;
}

export interface BulletItem {
  label: string;
  text: string;
}

export interface StepItem {
  label: string;
  title: string;
  desc: string;
}

export interface CardLinkItem {
  href: string;
  title: string;
  desc: string;
  imageSlotId?: string;
}

export type ContentBlock =
  | {
      type: "featureGrid";
      eyebrow: string;
      heading: string;
      items: BulletItem[];
      footnote?: string;
    }
  | {
      type: "calloutSplit";
      eyebrow: string;
      heading: string;
      paragraphs: string[];
      callouts: CalloutItem[];
      imageSlotId?: string;
    }
  | {
      type: "bandStatement";
      eyebrow: string;
      heading: string;
      paragraphs: string[];
      callouts: CalloutItem[];
      imageSlotId?: string;
    }
  | {
      type: "loopDiagram";
      eyebrow: string;
      heading: string;
      paragraphs: string[];
      drivers: BulletItem[];
    }
  | {
      type: "steps";
      eyebrow: string;
      heading: string;
      steps: StepItem[];
    }
  | {
      type: "cardLinks";
      eyebrow: string;
      heading: string;
      cards: CardLinkItem[];
    }
  | {
      type: "imageText";
      eyebrow?: string;
      heading: string;
      paragraphs: string[];
      imageSlotId?: string;
      imageAlt?: string;
      reverse?: boolean;
    }
  | {
      type: "twoListSplit";
      eyebrow: string;
      heading: string;
      paragraphs: string[];
      leftTitle: string;
      leftItems: string[];
      rightTitle: string;
      rightItems: string[];
    }
  | {
      type: "testimonialBlock";
      eyebrow: string;
      quote: string;
      name: string;
      meta: string;
      avatarSlotId?: string;
      photoSlotId?: string;
    }
  | {
      type: "textBand";
      eyebrow: string;
      heading: string;
      paragraphs: string[];
    }
  | {
      type: "bioBlock";
      eyebrow: string;
      heading: string;
      paragraphs: string[];
      credentials: string[];
      imageSlotId?: string;
    }
  | {
      type: "definitionList";
      eyebrow: string;
      heading: string;
      intro: string;
      points: string[];
    }
  | {
      type: "careToolkit";
      eyebrow: string;
      heading: string;
      intro: string;
      currentKey: string;
      footnote?: string;
    }
  | {
      type: "dispensary";
      eyebrow?: string;
      heading?: string;
      intro?: string;
      footnote?: string;
    }
  | {
      type: "iconCardGrid";
      eyebrow: string;
      heading: string;
      cards: { icon: "slash" | "clock" | "x" | "pencil" | "chart" | "heart"; title: string }[];
      footnote?: string;
    }
  | {
      type: "conditionExplorer";
      eyebrow: string;
      heading: string;
      pageContextLabel: string;
      conditions: {
        key: string;
        label: string;
        href: string;
        cta: string;
        heading: string;
        blurb: string;
      }[];
      footerLink?: { href: string; label: string };
    }
  | {
      type: "carePlanToolkit";
      eyebrow?: string;
      heading?: string;
      intro?: string;
    };

export interface HeroContent {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  ctaLabel?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  imageSlotId?: string;
  imageAlt?: string;
  bylineAvatarSlotId?: string;
  reviewedDate?: string;
  breadcrumbLabel: string;
  breadcrumbParentLabel?: string;
  breadcrumbParentHref?: string;
}

export interface StartHereContent {
  heading: string;
  intro: string;
}

export interface LongformPageContent {
  slug: string;
  title: string;
  description: string;
  canonical: string;
  hero: HeroContent;
  blocks: ContentBlock[];
  faqHeading: string;
  faqEyebrow: string;
  faq: FaqItem[];
  startHere: StartHereContent;
  bylineNote: string;
  schema: Record<string, unknown>;
}
