"use client";

import { useState } from "react";
import Image from "next/image";
import { PLAN_LENGTHS, PLAN_COVERAGE } from "@/content/home";

export default function ProgramSection() {
  const [selectedPlan, setSelectedPlan] = useState(1);
  const plan = PLAN_LENGTHS[selectedPlan];

  return (
    <section className="relative overflow-hidden bg-[#EDE4D2] px-6 py-21 sm:px-10 sm:py-25 md:px-[clamp(40px,6vw,120px)] md:py-38">
      <div className="grain-overlay opacity-40 mix-blend-multiply" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-130 w-215 -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.12), rgba(176,138,62,0) 68%)" }}
      />
      <div className="relative z-[1] mx-auto max-w-285">
        <div className="mx-auto max-w-190 text-center">
          <div className="flex items-center justify-center gap-3.25">
            <span className="font-display text-sm italic text-terracotta">05</span>
            <span className="h-px w-9 bg-gold-deep" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-terracotta">How the program works</span>
            <span className="h-px w-9 bg-gold-deep" />
          </div>
          <h2 className="mx-auto mt-5.5 max-w-[17ch] font-display text-[38px] font-medium leading-[1.03] tracking-tight text-ink sm:text-[50px] md:text-[60px]">
            Once you&rsquo;re in, <span className="italic text-terracotta">everything is yours.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[56ch] text-[15px] leading-relaxed text-body-soft sm:text-[18px]">
            Join for 3, 6, or 12 months. For every day of it, the whole practice is open to you, your physician,
            your coach, the full toolkit, as much as you need. We stay in it with you until you feel well.
          </p>
        </div>

        <div className="mx-auto mt-9 flex max-w-180 gap-2.5 sm:mt-13 sm:gap-4">
          {PLAN_LENGTHS.map((p, i) => (
            <button
              key={p.months}
              type="button"
              onClick={() => setSelectedPlan(i)}
              className={`relative flex-1 rounded-[14px] border py-4 pb-3.5 text-center shadow-[0_2px_4px_rgba(46,33,27,0.05)] ${
                i === selectedPlan ? "border-terracotta bg-terracotta" : "border-ink/[0.16] bg-cream"
              }`}
            >
              <div className={`font-display text-[26px] font-medium leading-none sm:text-[32px] ${i === selectedPlan ? "text-cream" : "text-ink"}`}>
                {p.months}
              </div>
              <div className={`mt-1 text-[9px] tracking-[0.16em] uppercase ${i === selectedPlan ? "text-cream/72" : "text-muted"}`}>
                months
              </div>
              {i === 1 && (
                <span className="absolute -top-2.25 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gold-deep px-2.25 py-0.75 text-[8px] font-bold tracking-[0.1em] uppercase text-cream">
                  Most common
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="mt-4 text-center">
          <span className="font-display text-[16px] italic text-terracotta sm:text-[19px]">
            {plan.months} months · {plan.tag}.
          </span>
          <span className="text-[13px] text-body sm:text-[15px]"> {plan.who}</span>
        </div>

        <div className="mt-7.5 rounded-[18px] border border-ink/[0.08] border-t-[3px] border-t-terracotta bg-cream p-7 shadow-[0_26px_60px_rgba(46,33,27,0.14)] sm:mt-11 sm:p-10.5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="flex-none whitespace-nowrap rounded-full bg-terracotta px-3.5 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-cream">
              You&rsquo;re in
            </span>
            <span className="font-display text-[18px] italic text-ink sm:text-[23px]">
              Everything below is yours for all {plan.months} months.
            </span>
          </div>
          <div className="my-5.5 flex items-center gap-3.5">
            <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-terracotta">Day one</span>
            <span className="h-0.5 flex-1 rounded-full bg-gradient-to-r from-terracotta to-gold-deep" />
            <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-gold-deep">Month {plan.months}</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PLAN_COVERAGE.map((label) => (
              <div key={label} className="flex items-center gap-3.25 rounded-xl border border-[#7C8A5E]/28 bg-[#7C8A5E]/10 px-4.25 py-3.75">
                <span className="flex h-6.5 w-6.5 flex-none items-center justify-center rounded-full bg-[#7C8A5E] text-sm text-cream">✓</span>
                <span className="flex-1 text-sm font-semibold text-ink">{label}</span>
                <span className="whitespace-nowrap text-[9.5px] font-semibold tracking-[0.08em] uppercase text-[#7C8A5E]">
                  All {plan.months} mo
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center font-display text-[15px] italic text-body sm:text-[18px]">
            Start to finish. The whole team, the whole time.
          </div>
        </div>

        <div className="mx-auto mt-7 flex max-w-165 items-center justify-center gap-4">
          <div className="relative h-13 w-13 flex-none overflow-hidden rounded-full border border-gold-deep/50">
            <Image src="/images/dr-nina.jpg" alt="" fill className="object-cover object-[50%_18%]" />
          </div>
          <div className="text-[14px] leading-relaxed text-body sm:text-[16px]">
            However long your road, you never walk it alone. We check in, adjust, and celebrate the wins with you
            the whole way. <span className="font-[Caveat,cursive] text-xl text-terracotta">— Dr. Nina</span>
          </div>
        </div>
      </div>
    </section>
  );
}
