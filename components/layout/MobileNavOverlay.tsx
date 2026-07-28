"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const MOST_SEARCHED = [
  { label: "PCOS", kind: "Condition", href: "/conditions/pcos" },
  { label: "IV Therapy", kind: "Treatment", href: "/treatments/iv-therapy" },
  { label: "Hormones", kind: "Condition", href: "/conditions/hormone-imbalance" },
  { label: "GLP-1", kind: "Weight loss", href: "/treatments/glp-1-weight-loss" },
];

const CONDITION_LINKS = [
  { label: "Hormones", href: "/conditions/hormone-imbalance" },
  { label: "PCOS", href: "/conditions/pcos" },
  { label: "Gut Health", href: "/conditions/gut-health" },
  { label: "Weight Loss", href: "/conditions/weight-loss" },
  { label: "Chronic Fatigue", href: "/conditions/chronic-fatigue" },
  { label: "Menopause", href: "/conditions/menopause" },
];

const TREATMENT_LINKS = [
  { label: "Advanced Lab Testing", href: "/treatments/advanced-lab-testing" },
  { label: "IV Therapy", href: "/treatments/iv-therapy" },
  { label: "GLP-1 Weight Loss", href: "/treatments/glp-1-weight-loss" },
  { label: "Hormone Restoration", href: "/treatments/hormone-restoration" },
  { label: "Peptide Therapy", href: "/treatments/peptide-therapy" },
  { label: "DUTCH Test", href: "/treatments/dutch-test" },
];

export function MobileMenuButton({
  onClick,
  light = false,
}: {
  onClick: () => void;
  light?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label="Open menu"
      onClick={onClick}
      className={`flex h-9 w-6 flex-none flex-col justify-center gap-[5px] ${light ? "" : ""}`}
    >
      <span className={`h-0.5 w-full rounded-sm ${light ? "bg-cream-deep" : "bg-ink"}`} />
      <span className={`h-0.5 w-full rounded-sm ${light ? "bg-cream-deep" : "bg-ink"}`} />
      <span className={`h-0.5 w-4 rounded-sm ${light ? "bg-cream-deep" : "bg-ink"}`} />
    </button>
  );
}

export default function MobileNavOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [panel, setPanel] = useState<"conditions" | "treatments" | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) {
      setPanel(null);
      setQuery("");
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const filteredConditions = q
    ? CONDITION_LINKS.filter((l) => l.label.toLowerCase().includes(q))
    : CONDITION_LINKS;
  const filteredTreatments = q
    ? TREATMENT_LINKS.filter((l) => l.label.toLowerCase().includes(q))
    : TREATMENT_LINKS;
  const filteredSearched = q
    ? MOST_SEARCHED.filter(
        (l) => l.label.toLowerCase().includes(q) || l.kind.toLowerCase().includes(q),
      )
    : MOST_SEARCHED;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink">
      <div
        className="pointer-events-none absolute top-[38%] left-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(207,168,90,0.13), rgba(207,168,90,0) 68%)",
        }}
      />
      <div className="grain-overlay opacity-40 mix-blend-overlay" />

      <div className="relative z-[1] flex flex-1 flex-col px-6 pb-8 pt-5">
        <div className="mb-5 flex items-center justify-between">
          <Image
            src="/images/nina-ross-logo-cream.png"
            alt="Nina Ross Functional Medicine, Atlanta"
            height={28}
            width={140}
            className="h-7 w-auto"
          />
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="text-2xl leading-none text-cream-deep"
          >
            ×
          </button>
        </div>

        <label className="flex items-center gap-2.5 rounded-xl border border-cream-deep/18 bg-cream-deep/[0.08] px-[15px] py-3">
          <span className="text-base text-gold-deep" aria-hidden>
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conditions, treatments…"
            className="min-w-0 flex-1 bg-transparent text-sm text-cream-deep outline-none placeholder:text-[#b6a796]"
          />
        </label>

        <div className="mt-[18px] flex flex-col">
          <Link
            href="/"
            onClick={onClose}
            className="border-b border-cream-deep/12 py-3 text-base font-semibold text-cream-deep no-underline"
          >
            Home
          </Link>

          <button
            type="button"
            onClick={() => setPanel(panel === "conditions" ? null : "conditions")}
            className="flex w-full items-center justify-between border-b border-cream-deep/12 py-3 text-left text-base font-semibold text-cream-deep"
          >
            Conditions We Treat
            <span className="text-lg text-gold-deep">{panel === "conditions" ? "∨" : "›"}</span>
          </button>
          {panel === "conditions" && (
            <div className="flex flex-col gap-1 border-b border-cream-deep/12 pb-3">
              {filteredConditions.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="rounded-lg px-2 py-2 text-sm text-[#d8cab8] no-underline hover:bg-cream-deep/[0.06]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/conditions"
                onClick={onClose}
                className="px-2 py-2 text-sm font-semibold text-gold no-underline"
              >
                View all conditions →
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setPanel(panel === "treatments" ? null : "treatments")}
            className="flex w-full items-center justify-between border-b border-cream-deep/12 py-3 text-left text-base font-semibold text-cream-deep"
          >
            How We Help
            <span className="text-lg text-gold-deep">{panel === "treatments" ? "∨" : "›"}</span>
          </button>
          {panel === "treatments" && (
            <div className="flex flex-col gap-1 border-b border-cream-deep/12 pb-3">
              {filteredTreatments.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="rounded-lg px-2 py-2 text-sm text-[#d8cab8] no-underline hover:bg-cream-deep/[0.06]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/treatments"
                onClick={onClose}
                className="px-2 py-2 text-sm font-semibold text-gold no-underline"
              >
                View all treatments →
              </Link>
            </div>
          )}
        </div>

        <div className="mt-6 mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-deep">
          Most searched
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {filteredSearched.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="rounded-[13px] border border-cream-deep/14 bg-cream-deep/[0.06] px-[15px] py-[15px] no-underline"
            >
              <div className="font-display text-lg font-medium text-cream-deep">{item.label}</div>
              <div className="mt-0.5 text-[11px] tracking-wide text-[#9a8b7a]">{item.kind}</div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex gap-6 border-t border-cream-deep/12 pt-[18px]">
          <Link href="/about" onClick={onClose} className="text-sm font-medium text-[#d8cab8] no-underline">
            About
          </Link>
          <Link href="/approach" onClick={onClose} className="text-sm font-medium text-[#d8cab8] no-underline">
            Approach
          </Link>
          <a href="tel:+16785614522" className="text-sm font-medium text-[#d8cab8] no-underline">
            Contact
          </a>
        </div>

        <Link
          href="/start"
          onClick={onClose}
          className="mt-6 flex items-center justify-center gap-2 rounded-[10px] bg-gold px-4 py-4 text-[15px] font-semibold text-ink no-underline shadow-[0_14px_30px_rgba(233,180,90,0.24)]"
        >
          Book the $99 Symptom Consult <span aria-hidden>→</span>
        </Link>
        <p className="mt-2.5 text-center font-display text-lg italic text-gold-deep">
          Care that looks for the why.
        </p>
      </div>
    </div>
  );
}
