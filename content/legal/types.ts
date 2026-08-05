export type LegalBullet = string | { label: string; text: string };

export type LegalSection = {
  id: string;
  short: string;
  title: string;
  paras: string[];
  bullets: LegalBullet[];
};

export type LegalDoc = {
  meta: {
    title: string;
    description: string;
    canonical: string;
  };
  hero: {
    title: string;
    titleClamp: string;
    deck: string;
    deckVariant: "default" | "hipaa";
    lastUpdated?: string;
    effective?: string;
    orgLine?: string;
  };
  contact: {
    heading: string;
    lines: string[];
    email: string;
    note?: string;
    links: Array<{
      href: string;
      label: string;
      variant: "ghost" | "primary";
    }>;
  };
  sections: LegalSection[];
};
