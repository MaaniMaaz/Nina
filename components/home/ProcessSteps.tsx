"use client";

import { useState } from "react";
import Image from "next/image";
import { PROCESS_STEPS } from "@/content/home";

export default function ProcessSteps() {
  const [selected, setSelected] = useState(0);
  const step = PROCESS_STEPS[selected];

  return (
    <section className="relative overflow-hidden bg-sand-deep px-6 py-21 sm:px-10 sm:py-26 md:px-[clamp(40px,6vw,120px)] md:py-39">
      <div className="grain-overlay opacity-40 mix-blend-multiply" />
      <div className="relative z-[1] mx-auto grid max-w-[1180px] items-start gap-10 md:grid-cols-2 md:gap-19">
        <div>
          <div className="flex items-center gap-3.25">
            <span className="h-px w-9 bg-gold-deep" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-terracotta">
              How we find your why
            </span>
          </div>
          <h2 className="mt-5 font-display text-[38px] font-medium leading-tight tracking-tight text-ink sm:text-[48px] md:text-[56px]">
            Six steps to <span className="italic text-terracotta">your why.</span>
          </h2>
          <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-body-soft sm:text-[17px]">
            A real, repeatable method with a purpose behind every step, the same one behind every patient who
            finally felt like themselves again. Tap through it.
          </p>

          <div>
            {PROCESS_STEPS.map((s, i) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setSelected(i)}
                className={`relative flex w-full items-baseline gap-4.5 border-t border-ink/[0.14] py-4.5 pl-6.5 pr-4 text-left ${
                  i === selected ? "before:absolute before:left-0 before:top-3.5 before:bottom-3.5 before:w-1 before:rounded-r-[3px] before:bg-terracotta" : ""
                }`}
              >
                <span className="min-w-7 font-display text-lg font-medium text-gold-deep">{s.num}</span>
                <span className="flex-1 font-display text-[20px] font-medium leading-tight text-ink sm:text-[24px]">
                  {s.title}
                </span>
                <span className="self-center text-[11px] text-muted">{s.kicker}</span>
              </button>
            ))}
            <div className="border-t border-ink/[0.14]" />
          </div>
        </div>

        <div className="sticky top-12 flex min-h-125 flex-col rounded-xl border border-ink/[0.07] border-t-[3px] border-t-terracotta bg-cream p-7 pb-10 shadow-[0_22px_50px_rgba(46,33,27,0.14)]">
          <div className="relative h-70 w-full overflow-hidden rounded-lg bg-sand-deep">
            {step.img && <Image src={step.img} alt={step.title} fill className="object-cover" />}
            <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink shadow-[0_6px_16px_rgba(46,33,27,0.3)]">
              <span className="font-display text-[22px] font-medium text-gold-deep">
                {Number(step.num)}
              </span>
            </div>
          </div>
          <div className="mt-7 flex items-baseline justify-between">
            <h3 className="font-display text-[28px] font-medium leading-tight tracking-tight text-ink sm:text-[36px]">
              {step.title}
            </h3>
            <span className="ml-3.5 whitespace-nowrap text-[11px] font-semibold tracking-[0.18em] uppercase text-terracotta">
              {step.kicker}
            </span>
          </div>
          <p className="mt-4 text-[16px] leading-relaxed text-body">{step.detail}</p>
          <div className="mt-auto flex items-center gap-2.75 pt-6.5">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gold-deep/50">
              <Image src="/images/dr-nina.jpg" alt="" fill className="object-cover object-[50%_18%]" />
            </div>
            <span className="font-[Caveat,cursive] text-[22px] text-terracotta">Dr. Nina Ross</span>
          </div>
        </div>
      </div>
    </section>
  );
}
