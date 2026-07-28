"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNavOverlay, { MobileMenuButton } from "@/components/layout/MobileNavOverlay";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Conditions We Treat", href: "/conditions", mega: "conditions" as const },
  { label: "How We Help", href: "/treatments", mega: "treatments" as const },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

const CONDITION_MEGA = [
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

const TREATMENT_MEGA = [
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

/**
 * Global Shell — Desktop dump: dark bar + Fraunces mega menus + featured cards.
 * Global Shell — Chosen (Mobile): cream logo + gold $99 + hamburger.
 */
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<"conditions" | "treatments" | null>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    setOpen(false);
    setMega(null);
  }, [pathname]);

  if (isHome) return null;

  return (
    <header className="sticky top-0 z-50 bg-ink">
      <div className="flex items-center justify-between gap-4 px-6 py-[14px] md:gap-6 md:px-14 md:py-[22px]">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Image
            src="/images/nina-ross-logo-cream.png"
            alt="Nina Ross Functional Medicine, Atlanta"
            height={46}
            width={200}
            className="h-[30px] w-auto md:h-[46px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-[30px] md:flex">
          {NAV_LINKS.map((link) =>
            link.mega ? (
              <button
                key={link.href}
                type="button"
                onClick={() => setMega(mega === link.mega ? null : link.mega)}
                className={`relative flex items-center gap-1.5 text-sm no-underline ${
                  mega === link.mega ? "font-semibold text-cream-deep" : "font-medium text-[#e6dccb] hover:text-cream-deep"
                }`}
              >
                {link.label}
                <span
                  className={`inline-block text-[9px] text-gold-deep transition-transform ${
                    mega === link.mega ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
                {mega === link.mega && (
                  <span className="absolute inset-x-0 -bottom-[23px] right-7 h-0.5 bg-gold-deep" />
                )}
              </button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#e6dccb] no-underline hover:text-cream-deep"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-[22px] md:flex">
          <a href="tel:+16785614522" className="text-[13.5px] text-[#b6a796] no-underline hover:text-cream-deep">
            678-561-4522
          </a>
          <Link
            href="/start"
            className="whitespace-nowrap rounded-md bg-gold px-[22px] py-3 text-sm font-semibold text-ink no-underline hover:bg-gold-hover"
          >
            Book $99 Consult
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/start"
            className="whitespace-nowrap rounded-lg bg-gold px-[15px] py-[9px] text-[12.5px] font-semibold text-ink no-underline"
          >
            $99 Consult
          </Link>
          <MobileMenuButton light onClick={() => setOpen(true)} />
        </div>
      </div>

      {mega === "conditions" && (
        <div className="relative hidden border-t border-gold-deep/40 bg-cream-deep md:block">
          <div className="grain-overlay opacity-40 mix-blend-multiply" style={{ backgroundSize: "220px" }} />
          <div className="relative mx-auto grid max-w-[1440px] grid-cols-[1fr_1fr_1fr_320px] gap-10 px-14 py-10 pb-11">
            {CONDITION_MEGA.map((col) => (
              <div key={col.group} className="relative">
                <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">
                  {col.group}
                </div>
                <div className="flex flex-col gap-[13px]">
                  {col.links.map((l) => (
                    <Link
                      key={l.href + l.label}
                      href={l.href}
                      onClick={() => setMega(null)}
                      className="font-display text-lg font-medium text-ink no-underline hover:text-terracotta"
                    >
                      {l.label}
                    </Link>
                  ))}
                  {col.seeAll && (
                    <Link
                      href="/conditions"
                      onClick={() => setMega(null)}
                      className="mt-0.5 text-[13px] font-semibold text-terracotta no-underline"
                    >
                      See all conditions →
                    </Link>
                  )}
                </div>
              </div>
            ))}
            <Link
              href="/start"
              onClick={() => setMega(null)}
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
          </div>
        </div>
      )}

      {mega === "treatments" && (
        <div className="relative hidden border-t border-gold-deep/40 bg-cream-deep md:block">
          <div className="grain-overlay opacity-40 mix-blend-multiply" style={{ backgroundSize: "220px" }} />
          <div className="relative mx-auto grid max-w-[1440px] grid-cols-[1fr_1fr_1fr_320px] gap-10 px-14 py-10 pb-11">
            {TREATMENT_MEGA.map((col) => (
              <div key={col.group} className="relative">
                <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">
                  {col.group}
                </div>
                <div className="flex flex-col gap-[13px]">
                  {col.links.map((l) => (
                    <Link
                      key={l.href + l.label}
                      href={l.href}
                      onClick={() => setMega(null)}
                      className="font-display text-lg font-medium text-ink no-underline hover:text-terracotta"
                    >
                      {l.label}
                    </Link>
                  ))}
                  {col.seeAll && (
                    <Link
                      href="/treatments"
                      onClick={() => setMega(null)}
                      className="mt-0.5 text-[13px] font-semibold text-terracotta no-underline"
                    >
                      See all treatments →
                    </Link>
                  )}
                </div>
              </div>
            ))}
            <Link
              href="/start"
              onClick={() => setMega(null)}
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
          </div>
        </div>
      )}

      <MobileNavOverlay open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
