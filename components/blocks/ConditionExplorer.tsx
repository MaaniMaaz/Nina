"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EditableLink from "@/components/admin/EditableLink";
import EditableText from "@/components/admin/EditableText";
import { useEdit } from "@/components/admin/EditContext";
import type { WhoIHelpCondition } from "@/content/positioning-shared";

export default function ConditionExplorer({
  number,
  eyebrow,
  heading,
  pageContextLabel,
  conditions,
  footerLink = { href: "/conditions", label: "See all conditions we treat" },
  blockIndex = 0,
}: {
  number?: string;
  eyebrow: string;
  heading: string;
  pageContextLabel: string;
  conditions: WhoIHelpCondition[];
  footerLink?: { href: string; label: string };
  blockIndex?: number;
}) {
  const edit = useEdit();
  const E = edit?.enabled;
  const base = `blocks.${blockIndex}`;
  const [openKey, setOpenKey] = useState<string | null>(null);
  const activeIndex = conditions.findIndex((c) => c.key === openKey);
  const active = activeIndex >= 0 ? conditions[activeIndex] : null;

  useEffect(() => {
    if (!openKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenKey(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openKey]);

  return (
    <section className="bg-cream px-6 py-14 md:px-[clamp(40px,6vw,100px)] md:py-[clamp(64px,7vw,104px)]">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-[13px]">
            {number && <span className="font-display text-sm italic text-terracotta">{number}</span>}
            <span className="h-px w-[38px] bg-terracotta/60" />
            <span className="text-[11.5px] uppercase tracking-[0.22em] text-[#9a7b54]">
              {E ? <EditableText path={`${base}.eyebrow`} value={eyebrow} /> : eyebrow}
            </span>
          </div>
          <h2 className="mt-3.5 font-display text-[28px] font-medium leading-[1.08] text-ink md:text-[clamp(28px,3vw,40px)]">
            {E ? (
              <EditableText path={`${base}.heading`} value={heading} multiline />
            ) : (
              heading
            )}
          </h2>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:mt-11 md:grid-cols-3 md:gap-4">
          {conditions.map((c, i) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setOpenKey(c.key)}
              className="flex items-center justify-between gap-2.5 rounded-2xl border border-ink/[0.09] bg-cream px-4 py-[18px] text-left hover:border-terracotta/50 hover:shadow-[0_14px_30px_rgba(46,33,27,0.1)] md:px-6 md:py-[22px]"
            >
              <span className="font-display text-[17px] text-ink md:text-xl">
                {E ? (
                  <EditableText path={`${base}.conditions.${i}.label`} value={c.label} />
                ) : (
                  c.label
                )}
                {E ? (
                  <EditableLink path={`${base}.conditions.${i}.href`} value={c.href} label="Condition URL" />
                ) : null}
              </span>
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-terracotta/10">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B5572F" strokeWidth="2.4">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
          ))}
        </div>
        <div className="mt-7 text-center">
          {E ? (
            <div className="inline-flex flex-col items-center gap-1">
              <span className="inline-flex items-center gap-[7px] text-sm font-semibold text-terracotta">
                <EditableText path={`${base}.footerLink.label`} value={footerLink.label} />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5572F" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
              <EditableLink path={`${base}.footerLink.href`} value={footerLink.href} label="Footer link URL" />
            </div>
          ) : (
            <Link href={footerLink.href} className="inline-flex items-center gap-[7px] text-sm font-semibold text-terracotta no-underline">
              {footerLink.label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5572F" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {active && activeIndex >= 0 && (
        <div
          className="fixed inset-0 z-[300] flex items-end justify-center bg-[rgba(46,33,27,0.55)] p-0 backdrop-blur-[3px] md:items-center md:p-6"
          onClick={() => setOpenKey(null)}
          role="presentation"
        >
          <div
            className="w-full max-w-[540px] rounded-t-[24px] bg-cream px-6 pb-8 pt-3 shadow-[0_32px_70px_rgba(0,0,0,0.4)] md:rounded-[24px] md:px-[38px] md:pb-[34px] md:pt-9"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cond-explorer-title"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/20 md:hidden" />
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-terracotta">
              {E ? (
                <EditableText path={`${base}.pageContextLabel`} value={pageContextLabel} />
              ) : (
                pageContextLabel
              )}{" "}
              ·{" "}
              {E ? (
                <EditableText path={`${base}.conditions.${activeIndex}.label`} value={active.label} />
              ) : (
                active.label
              )}
            </div>
            <h3 id="cond-explorer-title" className="mt-2.5 font-display text-[24px] font-medium leading-[1.12] text-ink md:text-[28px]">
              {E ? (
                <EditableText path={`${base}.conditions.${activeIndex}.heading`} value={active.heading} multiline />
              ) : (
                active.heading
              )}
            </h3>
            <p className="mt-3.5 text-[15.5px] leading-[1.62] text-[#5a4d43]">
              {E ? (
                <EditableText path={`${base}.conditions.${activeIndex}.blurb`} value={active.blurb} multiline />
              ) : (
                active.blurb
              )}
            </p>
            <div className="mt-[26px] flex flex-col gap-3 sm:flex-row sm:gap-3">
              {E ? (
                <div className="flex-1 rounded-lg bg-gold py-[15px] text-center text-[14.5px] font-semibold text-ink">
                  <EditableText path={`${base}.conditions.${activeIndex}.cta`} value={active.cta} />
                  <EditableLink
                    path={`${base}.conditions.${activeIndex}.ctaHref`}
                    value={active.ctaHref ?? "/start"}
                    label="Book button URL"
                  />
                </div>
              ) : (
                <Link
                  href={active.ctaHref ?? "/start"}
                  className="flex-1 rounded-lg bg-gold py-[15px] text-center text-[14.5px] font-semibold text-ink no-underline hover:bg-gold-hover"
                >
                  {active.cta}
                </Link>
              )}
              {E ? (
                <div className="flex-none rounded-lg bg-terracotta/[0.09] px-[22px] py-[15px] text-center text-[14.5px] font-semibold text-terracotta">
                  Read more
                  <EditableLink
                    path={`${base}.conditions.${activeIndex}.href`}
                    value={active.href}
                    label="Condition URL"
                  />
                </div>
              ) : (
                <Link
                  href={active.href}
                  className="flex-none rounded-lg bg-terracotta/[0.09] px-[22px] py-[15px] text-center text-[14.5px] font-semibold text-terracotta no-underline hover:bg-terracotta/[0.16]"
                >
                  Read more
                </Link>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpenKey(null)}
              className="mt-4 w-full text-center text-[13px] text-[#8a7d6f]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
