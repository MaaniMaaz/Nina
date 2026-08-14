"use client";

import { useState } from "react";
import Image from "next/image";
import { useSiteMedia } from "@/components/media/SiteMediaContext";
import EditableText from "@/components/admin/EditableText";
import { useHomeContent } from "./HomeContentContext";

/**
 * Mobile = dump §05: left-aligned intro, compact plan chips, coverage card.
 */
export default function ProgramSection() {
  const [selectedPlan, setSelectedPlan] = useState(1);
  const program = useHomeContent().program;
  const plans = program.plans;
  const plan = plans[selectedPlan] ?? plans[0];
  const drNina = useSiteMedia("dr-nina");
  const coverageTitleMobile = program.coverageTitleMobile.replace(
    "{months}",
    String(plan?.months ?? "")
  );
  const coverageTitleDesktop = program.coverageTitleDesktop.replace(
    "{months}",
    String(plan?.months ?? "")
  );

  if (!plan) return null;

  return (
    <section id="program" className="relative overflow-hidden bg-[#EFE6D5] px-6 py-7 md:bg-[#EDE4D2] md:px-[clamp(40px,6vw,120px)] md:py-38">
      <div className="grain-overlay opacity-40 mix-blend-multiply" style={{ backgroundSize: "180px" }} />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 hidden h-130 w-215 -translate-x-1/2 rounded-full md:block"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.12), rgba(176,138,62,0) 68%)" }}
      />
      <div className="relative z-[1] mx-auto max-w-285">
        <div className="mx-auto max-w-190 text-left md:text-center">
          <div className="flex items-center gap-[9px] md:justify-center md:gap-3.25">
            <span className="h-px w-[22px] bg-[#B08A3E] md:hidden" />
            <span className="hidden font-display text-sm italic text-terracotta md:inline">05</span>
            <span className="hidden h-px w-9 bg-gold-deep md:block" />
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-terracotta md:text-xs md:tracking-[0.2em]">
              <EditableText path="program.eyebrow" value={program.eyebrow} as="span" />
            </span>
            <span className="hidden h-px w-9 bg-gold-deep md:block" />
          </div>
          <h2 className="mt-3.5 max-w-[17ch] font-display text-[29px] font-medium leading-[1.06] tracking-[-0.02em] text-ink md:mx-auto md:mt-5.5 md:text-[60px] md:leading-[1.03] md:tracking-tight">
            <EditableText path="program.headingLead" value={program.headingLead} as="span" />{" "}
            <span className="italic text-terracotta">
              <EditableText path="program.headingEmph" value={program.headingEmph} as="span" />
            </span>
          </h2>
          <p className="mt-[11px] max-w-[56ch] text-[13px] leading-[1.58] text-[#5f5346] md:mx-auto md:mt-5 md:text-[18px] md:leading-relaxed md:text-body-soft">
            <EditableText path="program.body" value={program.body} as="span" multiline />
          </p>
        </div>

        <div className="mx-auto mt-[22px] flex max-w-180 gap-2 md:mt-13 md:gap-4">
          {plans.map((p, i) => (
            <button
              key={p.months}
              type="button"
              onClick={() => setSelectedPlan(i)}
              className={`relative flex-1 rounded-xl border py-3 pb-2.5 text-center md:rounded-[14px] md:py-4 md:pb-3.5 md:shadow-[0_2px_4px_rgba(46,33,27,0.05)] ${
                i === selectedPlan ? "border-terracotta bg-terracotta" : "border-ink/[0.16] bg-cream"
              }`}
            >
              <div
                className={`font-display text-[22px] font-medium leading-none md:text-[32px] ${
                  i === selectedPlan ? "text-cream" : "text-ink"
                }`}
              >
                <EditableText path={`program.plans.${i}.months`} value={p.months} as="span" />
              </div>
              <div
                className={`mt-1 text-[7.5px] uppercase tracking-[0.14em] md:text-[9px] md:tracking-[0.16em] ${
                  i === selectedPlan ? "text-cream/72" : "text-muted"
                }`}
              >
                <EditableText path="program.monthsUnit" value={program.monthsUnit} as="span" />
              </div>
              {i === 1 && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gold-deep px-[7px] py-0.5 text-[7px] font-bold tracking-[0.1em] uppercase text-cream md:-top-2.25 md:px-2.25 md:py-0.75 md:text-[8px]">
                  <EditableText path="program.mostCommonBadge" value={program.mostCommonBadge} as="span" />
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="mt-3.5 text-center">
          <span className="font-display text-[15px] italic text-terracotta md:text-[19px]">
            {plan.months} months · <EditableText path={`program.plans.${selectedPlan}.tag`} value={plan.tag} as="span" />.
          </span>
          <span className="text-xs leading-[1.5] text-[#5a4d43] md:text-[15px] md:text-body">{" "}
            <EditableText path={`program.plans.${selectedPlan}.who`} value={plan.who} as="span" />
          </span>
        </div>

        <div className="mt-[22px] rounded-2xl border border-ink/[0.08] border-t-[3px] border-t-terracotta bg-cream px-[18px] py-5 shadow-[0_14px_34px_rgba(46,33,27,0.1)] md:mt-11 md:rounded-[18px] md:p-10.5 md:shadow-[0_26px_60px_rgba(46,33,27,0.14)]">
          <div className="mb-4 flex items-center justify-between gap-3 md:mb-0 md:flex-row md:flex-wrap md:justify-between md:gap-4">
            <span className="w-fit flex-none whitespace-nowrap rounded-full bg-terracotta px-[11px] py-[5px] text-[9px] font-bold tracking-[0.18em] uppercase text-cream md:px-3.5 md:py-1.5 md:text-[10px] md:tracking-[0.2em]">
              <EditableText path="program.coverageBadge" value={program.coverageBadge} as="span" />
            </span>
            <span className="font-display text-base italic text-ink md:text-[23px]">
              <span className="md:hidden">{coverageTitleMobile}</span>
              <span className="hidden md:inline">{coverageTitleDesktop}</span>
            </span>
          </div>
          <div className="mb-4 flex items-center gap-[9px] md:my-5.5 md:gap-3.5">
            <span className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-terracotta md:text-[10px] md:tracking-[0.14em]">
              <EditableText path="program.timelineStart" value={program.timelineStart} as="span" />
            </span>
            <span className="h-0.5 flex-1 rounded-full bg-gradient-to-r from-terracotta to-gold-deep" />
            <span className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-gold-deep md:text-[10px] md:tracking-[0.14em]">
              Month {plan.months}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">
            {program.coverage.map((label, i) => (
              <div
                key={i}
                className="mb-0 flex items-center gap-[11px] rounded-[10px] border border-[#7C8A5E]/28 bg-[#7C8A5E]/10 px-[13px] py-[11px] md:gap-3.25 md:rounded-xl md:px-4.25 md:py-3.75"
              >
                <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-[#7C8A5E] text-xs text-cream md:h-6.5 md:w-6.5 md:text-sm">
                  ✓
                </span>
                <span className="flex-1 text-[13px] font-semibold text-ink md:text-sm">
                  <EditableText path={`program.coverage.${i}`} value={label} as="span" />
                </span>
                <span className="whitespace-nowrap text-[8.5px] font-semibold uppercase tracking-[0.08em] text-[#7C8A5E] md:text-[9.5px]">
                  All {plan.months} mo
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center font-display text-sm italic text-[#5a4d43] md:mt-6 md:text-[18px] md:text-body">
            <EditableText path="program.coverageFooter" value={program.coverageFooter} as="span" />
          </div>
        </div>

        <div className="mt-4 flex items-start gap-[13px] rounded-[14px] border border-[#7C8A5E]/32 bg-cream px-[17px] py-4 md:mx-auto md:mt-7 md:max-w-165 md:items-center md:justify-center md:gap-4 md:border-0 md:bg-transparent md:px-0 md:py-0">
          <div className="relative h-[42px] w-[42px] flex-none overflow-hidden rounded-full border border-gold-deep/50 md:h-13 md:w-13">
            <Image
              src={drNina}
              alt=""
              fill
              className="object-cover object-[50%_18%]"
              unoptimized={drNina.startsWith("http")}
            />
          </div>
          <div className="text-[12.5px] leading-[1.52] text-[#5a4d43] md:text-[16px] md:leading-relaxed md:text-body">
            <EditableText path="program.physicianNote" value={program.physicianNote} as="span" multiline />{" "}
            <span className="font-hand text-[17px] text-terracotta md:text-xl">
              <EditableText path="program.physicianSignoff" value={program.physicianSignoff} as="span" />
            </span>
          </div>
        </div>

        <div className="mt-4 text-center text-xs leading-[1.5] text-[#6b5d52] md:hidden">
          <EditableText path="program.mobileFootnote" value={program.mobileFootnote} as="span" multiline />
        </div>
      </div>
    </section>
  );
}
