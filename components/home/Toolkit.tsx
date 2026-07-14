"use client";

import { useState } from "react";
import Image from "next/image";
import { TOOLKIT_ITEMS } from "@/content/home";

export default function Toolkit() {
  const [selected, setSelected] = useState(0);
  const active = TOOLKIT_ITEMS[selected];

  return (
    <section className="relative overflow-hidden bg-[#E8E4D6] px-6 py-21 sm:px-10 sm:py-26 md:px-[clamp(40px,6vw,120px)] md:py-39">
      <div className="grain-overlay opacity-40 mix-blend-multiply" />
      <div
        className="pointer-events-none absolute -top-45 left-1/2 h-140 w-225 -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.12), rgba(176,138,62,0) 68%)" }}
      />
      <div className="relative z-[1] mx-auto max-w-300">
        <div className="mb-9 flex items-center justify-center gap-3.25 sm:mb-13">
          <span className="font-display text-sm italic text-terracotta">04</span>
          <span className="h-px w-9 bg-gold-deep" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-terracotta">The Care Plan toolkit</span>
          <span className="h-px w-9 bg-gold-deep" />
        </div>

        <div className="overflow-hidden rounded-md bg-[#FCFAF3] shadow-[0_34px_80px_rgba(46,33,27,0.18)]">
          <div className="flex items-center justify-between gap-4 border-b border-ink/[0.12] px-7 py-6.5 sm:px-11">
            <div className="flex items-center gap-4.25">
              <div className="relative h-15 w-15 flex-none overflow-hidden rounded-full border border-gold-deep/55">
                <Image src="/images/dr-nina.jpg" alt="" fill className="object-cover object-[50%_18%]" />
              </div>
              <Image
                src="/images/nina-ross-logo-dark.png"
                alt="Nina Ross Functional Medicine, Atlanta"
                width={220}
                height={64}
                className="h-14 w-auto sm:h-16"
              />
            </div>
            <div className="hidden items-center gap-5.5 sm:flex">
              <div className="text-right text-[9px] leading-relaxed tracking-[0.14em] uppercase text-muted">
                Care Plan No.
                <br />
                <span className="font-semibold text-ink">NR-2026</span>
              </div>
              <span className="font-serif text-[46px] leading-[0.7] text-terracotta">℞</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="border-r-0 border-dashed border-ink/[0.18] bg-[#F2EBDD] p-7 sm:p-10 md:border-r">
              <div className="relative min-h-95 flex-1 overflow-hidden rounded-xl bg-sand-deep shadow-[0_18px_40px_rgba(46,33,27,0.14)]">
                {active.image && <Image src={active.image} alt={active.name} fill className="object-cover" />}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-46% to-ink" />
                <div className="pointer-events-none absolute bottom-5 left-5.5 right-5.5">
                  <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold-deep">
                    Now viewing · {active.num}
                  </div>
                  <div className="mt-1 font-display text-[28px] font-medium leading-tight text-cream-deep sm:text-[32px]">
                    {active.name}
                  </div>
                </div>
              </div>
              <p className="mt-5.5 min-h-20 text-[15px] leading-relaxed text-body sm:text-[16px]">{active.desc}</p>
            </div>

            <div className="p-7 sm:p-10">
              <div className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-muted">
                Care Plan · prepared for you
              </div>
              <h2 className="mt-3 font-display text-[36px] font-medium leading-[1.04] tracking-tight text-ink sm:text-[48px]">
                Labs are just the <span className="italic text-terracotta">beginning.</span>
              </h2>
              <p className="mt-3.5 max-w-[42ch] text-sm leading-relaxed text-body-soft">
                Most clinics stop at the results. This is everything we bring to get you well. Hover a line to read
                the dose.
              </p>

              <div className="mt-6.5">
                {TOOLKIT_ITEMS.map((t, i) => (
                  <button
                    key={t.num}
                    type="button"
                    onClick={() => setSelected(i)}
                    onMouseEnter={() => setSelected(i)}
                    className={`relative flex w-full items-baseline gap-3.5 border-b border-dashed border-ink/[0.18] py-3.25 pl-4 pr-1 text-left ${
                      i === selected ? "before:absolute before:left-0 before:top-2.75 before:bottom-2.75 before:w-0.75 before:rounded-r-[2px] before:bg-terracotta" : ""
                    }`}
                  >
                    <span className="font-serif text-[17px] leading-none text-terracotta">℞</span>
                    <span className={`flex-1 font-serif text-[19px] leading-tight ${i === selected ? "text-terracotta" : "text-ink"}`}>
                      {t.name}
                    </span>
                    <span className="self-center text-[10.5px] text-muted">{t.dose}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8.5 flex items-end justify-between">
                <div>
                  <div className="font-[Caveat,cursive] text-[34px] leading-[0.9] text-ink">Nina Ross, ND; Ph.D</div>
                  <div className="mt-1.25 h-px w-42.5 bg-ink/30" />
                  <div className="mt-1.5 text-[9px] tracking-[0.1em] uppercase text-muted">Signed · your physician</div>
                </div>
                <div className="flex h-16 w-16 -rotate-12 items-center justify-center rounded-full border-[1.5px] border-dashed border-terracotta text-center">
                  <span className="text-[8px] font-bold leading-tight tracking-[0.1em] uppercase text-terracotta">
                    Care
                    <br />
                    Plan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7.5 text-center font-[Caveat,cursive] text-[28px] text-[#8a6a3a]">
          A whole program with you at the center, every step of the way.
        </div>
      </div>
    </section>
  );
}
