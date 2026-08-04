"use client";

import Link from "next/link";

export type MegaKey = "conditions" | "treatments";

export const CONDITION_MEGA = [
  {
    group: "Hormonal & reproductive",
    links: [
      { label: "PCOS", href: "/conditions/pcos" },
      { label: "Hormonal Problems", href: "/conditions/hormone-imbalance" },
      { label: "Menopause & Perimenopause", href: "/conditions/menopause" },
    ],
  },
  {
    group: "Energy & metabolic",
    links: [
      { label: "Chronic Fatigue & Adrenal", href: "/conditions/chronic-fatigue" },
      { label: "Weight Loss & Metabolism", href: "/conditions/weight-loss" },
      { label: "Blood Sugar & Metabolic", href: "/conditions/insulin-resistance" },
    ],
  },
  {
    group: "Gut, mood & more",
    links: [
      { label: "Gut & Digestion", href: "/conditions/gut-health" },
      { label: "Hair Loss & Thinning", href: "/conditions/hair-loss" },
      { label: "Anxiety & Mood", href: "/conditions/mood" },
    ],
    seeAll: true,
  },
];

export const TREATMENT_MEGA = [
  {
    group: "Weight & restoration",
    links: [
      { label: "GLP-1 Weight Loss", href: "/treatments/glp-1-weight-loss" },
      { label: "Hormone Restoration", href: "/treatments/hormone-restoration" },
      { label: "Peptide Therapy", href: "/treatments/peptide-therapy" },
    ],
  },
  {
    group: "IV & injectables",
    links: [
      { label: "IV Therapy & Drips", href: "/treatments/iv-therapy" },
      { label: "Vitamin Injections", href: "/treatments/vitamin-injections" },
      { label: "Glutathione Drip", href: "/treatments/iv-therapy" },
    ],
  },
  {
    group: "Testing & therapies",
    links: [
      { label: "Advanced Lab Testing", href: "/treatments/advanced-lab-testing" },
      { label: "Red Light Therapy", href: "/treatments/red-light-therapy" },
    ],
    seeAll: true,
  },
];

type MegaMenuPanelProps = {
  mega: MegaKey;
  onClose: () => void;
  className?: string;
  /** When true, floats over content instead of pushing layout down */
  overlay?: boolean;
};

export default function MegaMenuPanel({ mega, onClose, className = "", overlay = false }: MegaMenuPanelProps) {
  const cols = mega === "conditions" ? CONDITION_MEGA : TREATMENT_MEGA;
  const seeAllHref = mega === "conditions" ? "/conditions" : "/treatments";
  const seeAllLabel = mega === "conditions" ? "See all conditions →" : "See all treatments →";

  return (
    <div
      className={`${
        overlay ? "absolute inset-x-0 top-full z-40" : "relative"
      } bg-[#f3ebde] ${className}`}
    >
      <div className="grain-overlay opacity-40 mix-blend-multiply" style={{ backgroundSize: "220px" }} />
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-[1fr_1fr_1fr_320px] gap-10 px-14 py-10 pb-11">
        {cols.map((col) => (
          <div key={col.group} className="relative">
            <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">
              {col.group}
            </div>
            <div className="flex flex-col gap-[13px]">
              {col.links.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  onClick={onClose}
                  className="font-display text-lg font-medium text-ink no-underline hover:text-terracotta"
                >
                  {l.label}
                </Link>
              ))}
              {"seeAll" in col && col.seeAll && (
                <Link
                  href={seeAllHref}
                  onClick={onClose}
                  className="mt-0.5 text-[13px] font-semibold text-terracotta no-underline"
                >
                  {seeAllLabel}
                </Link>
              )}
            </div>
          </div>
        ))}
        {mega === "conditions" ? (
          <Link
            href="/start"
            onClick={onClose}
            className="relative block overflow-hidden rounded-[14px] bg-ink p-[26px] no-underline"
          >
            <div className="grain-overlay opacity-40 mix-blend-overlay" style={{ backgroundSize: "180px" }} />
            <div className="relative text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
              Not sure where to start?
            </div>
            <div className="relative mt-2.5 font-display text-[22px] font-medium leading-[1.18] text-cream-deep">
              Take the FuncFactor assessment.
            </div>
            <div className="relative mt-2 text-[13px] leading-[1.5] text-[#c9bba9]">
              A few questions to point you to the right place to begin.
            </div>
            <div className="relative mt-3.5 text-[13px] font-semibold text-gold">Start the quiz →</div>
          </Link>
        ) : (
          <Link
            href="/start"
            onClick={onClose}
            className="relative block overflow-hidden rounded-[14px] bg-ink p-[26px] no-underline"
          >
            <div className="grain-overlay opacity-40 mix-blend-overlay" style={{ backgroundSize: "180px" }} />
            <div className="relative text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
              Every plan starts here
            </div>
            <div className="relative mt-2.5 font-display text-[22px] font-medium leading-[1.18] text-cream-deep">
              The $99 Symptom Consultation.
            </div>
            <div className="relative mt-2 text-[13px] leading-[1.5] text-[#c9bba9]">
              A half hour with our team to map what&rsquo;s really going on.
            </div>
            <div className="relative mt-3.5 text-[13px] font-semibold text-gold">Book now →</div>
          </Link>
        )}
      </div>
    </div>
  );
}
