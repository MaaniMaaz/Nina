"use client";

import { useState } from "react";
import Image from "next/image";
import { TOOLKIT_ITEMS } from "@/content/home";

/**
 * Mobile = dump §04: fixed brand/intro/image + scroll-only Rx list.
 * Desktop = two-column prescription letterhead.
 */
export default function Toolkit() {
  const [selected, setSelected] = useState(0);
  const active = TOOLKIT_ITEMS[selected];

  return (
    <section id="toolkit" className="relative overflow-hidden bg-[#E8E4D6] md:px-[clamp(40px,6vw,120px)] md:py-39">
      <div className="grain-overlay hidden opacity-40 mix-blend-multiply md:block" />

      {/* ─── MOBILE (dump §04 fixed chrome) ─── */}
      <div className="relative h-[100svh] min-h-[720px] md:hidden">
        <div className="absolute inset-x-0 top-0 z-10 bg-[#E8E4D6]">
          <div className="flex items-center justify-between border-b border-ink/[0.08] px-6 py-3">
            <div className="flex items-center gap-2.5">
              <div className="relative h-[30px] w-[30px] overflow-hidden rounded-full border border-[rgba(176,138,62,0.55)]">
                <Image src="/images/dr-nina.jpg" alt="" fill className="object-cover object-[50%_18%]" />
              </div>
              <Image
                src="/images/nina-ross-logo-dark.png"
                alt="Nina Ross Functional Medicine, Atlanta"
                width={140}
                height={30}
                className="h-[30px] w-auto"
              />
            </div>
            <span className="font-serif text-[26px] leading-[0.7] text-terracotta">℞</span>
          </div>

          <div className="border-b border-ink/[0.08] px-[26px] pb-3 pt-3">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-[13px] italic text-[#B08A3E]">04</span>
              <span className="h-px w-7 bg-[#B08A3E]/70" />
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-terracotta">
                The Care Plan toolkit
              </span>
            </div>
            <div className="mt-2 font-display text-2xl font-medium leading-[1.1] text-ink">
              Labs are just the <span className="italic text-terracotta">beginning.</span>
            </div>
            <div className="mt-1.5 text-xs leading-[1.45] text-body-soft">
              Here, your results are where the real work begins. Your labs open a whole program.
            </div>
          </div>

          <div className="relative h-[268px] overflow-hidden bg-[#E7DCC9]">
            {active.image && <Image src={active.image} alt={active.name} fill className="object-cover" />}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(46,33,27,0) 36%, rgba(46,33,27,0.9))" }}
            />
            <div className="absolute inset-x-[22px] bottom-5">
              <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-deep">
                Now viewing · {active.num} / 10 · {active.dose}
              </div>
              <div className="mt-1 font-display text-[27px] font-medium leading-[1.08] text-cream-deep">{active.name}</div>
              <div className="mt-[7px] text-[12.5px] leading-[1.45] text-[#f0e7da]">{active.desc}</div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 top-[476px] overflow-y-auto bg-[#FCFAF3] px-[26px] pb-8 pt-3.5">
          <div className="mb-1 flex items-center gap-[9px]">
            <span className="h-px w-[18px] bg-[#B08A3E]" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-terracotta">
              Scroll to explore · or tap a tool
            </span>
          </div>
          {TOOLKIT_ITEMS.map((t, i) => (
            <button
              key={t.num}
              type="button"
              onClick={() => setSelected(i)}
              className="relative flex w-full items-baseline gap-3 border-b border-dashed border-ink/[0.18] py-[13px] pl-3.5 text-left"
            >
              {i === selected && (
                <span className="absolute bottom-[11px] left-0 top-[11px] w-[3px] rounded-r-sm bg-terracotta" />
              )}
              <span className="font-serif text-base leading-none text-terracotta">℞</span>
              <span
                className={`flex-1 font-serif text-[17.5px] leading-[1.25] ${
                  i === selected ? "text-terracotta" : "text-ink"
                }`}
              >
                {t.name}
              </span>
              <span className="self-center text-[10px] tracking-wide text-[#9a8b7a]">{t.dose}</span>
            </button>
          ))}
          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="font-hand text-[28px] leading-[0.9] text-ink">Nina Ross, ND; Ph.D</div>
              <div className="mt-1 h-px w-[130px] bg-ink/30" />
              <div className="mt-1 text-[8px] uppercase tracking-[0.1em] text-[#9a8b7a]">Signed · your physician</div>
            </div>
            <div className="flex h-[50px] w-[50px] -rotate-12 items-center justify-center rounded-full border-[1.5px] border-dashed border-terracotta">
              <span className="text-center text-[7px] font-bold uppercase leading-[1.2] tracking-[0.1em] text-terracotta">
                Care
                <br />
                Plan
              </span>
            </div>
          </div>
          <div className="h-20" aria-hidden />
        </div>
      </div>

      {/* ─── DESKTOP ─── */}
      <div className="relative z-[1] mx-auto hidden max-w-300 md:block">
        <div className="mb-13 flex items-center justify-center gap-3.25">
          <span className="font-display text-sm italic text-terracotta">04</span>
          <span className="h-px w-9 bg-gold-deep" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-terracotta">The Care Plan toolkit</span>
          <span className="h-px w-9 bg-gold-deep" />
        </div>

        <div className="overflow-hidden rounded-md bg-[#FCFAF3] shadow-[0_34px_80px_rgba(46,33,27,0.18)]">
          <div className="flex items-center justify-between gap-4 border-b border-ink/[0.12] px-11 py-6.5">
            <div className="flex items-center gap-4.25">
              <div className="relative h-15 w-15 flex-none overflow-hidden rounded-full border border-gold-deep/55">
                <Image src="/images/dr-nina.jpg" alt="" fill className="object-cover object-[50%_18%]" />
              </div>
              <Image
                src="/images/nina-ross-logo-dark.png"
                alt="Nina Ross Functional Medicine, Atlanta"
                width={220}
                height={64}
                className="h-16 w-auto"
              />
            </div>
            <div className="flex items-center gap-5.5">
              <div className="text-right text-[9px] leading-relaxed tracking-[0.14em] uppercase text-muted">
                Care Plan No.
                <br />
                <span className="font-semibold text-ink">NR-2026</span>
              </div>
              <span className="font-serif text-[46px] leading-[0.7] text-terracotta">℞</span>
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="border-r border-dashed border-ink/[0.18] bg-[#F2EBDD] p-10">
              <div className="relative min-h-95 flex-1 overflow-hidden rounded-xl bg-sand-deep shadow-[0_18px_40px_rgba(46,33,27,0.14)]">
                {active.image && <Image src={active.image} alt={active.name} fill className="object-cover" />}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-46% to-ink" />
                <div className="pointer-events-none absolute bottom-5 left-5.5 right-5.5">
                  <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold-deep">
                    Now viewing · {active.num}
                  </div>
                  <div className="mt-1 font-display text-[32px] font-medium leading-tight text-cream-deep">{active.name}</div>
                </div>
              </div>
              <p className="mt-5.5 min-h-20 text-[16px] leading-relaxed text-body">{active.desc}</p>
            </div>

            <div className="p-10">
              <div className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-muted">
                Care Plan · prepared for you
              </div>
              <h2 className="mt-3 font-display text-[48px] font-medium leading-[1.04] tracking-tight text-ink">
                Labs are just the <span className="italic text-terracotta">beginning.</span>
              </h2>
              <p className="mt-3.5 max-w-[42ch] text-sm leading-relaxed text-body-soft">
                Most clinics stop at the results. This is everything we bring to get you well. Hover a line to read the
                dose.
              </p>

              <div className="mt-6.5">
                {TOOLKIT_ITEMS.map((t, i) => (
                  <button
                    key={t.num}
                    type="button"
                    onClick={() => setSelected(i)}
                    onMouseEnter={() => setSelected(i)}
                    className={`relative flex w-full items-baseline gap-3.5 border-b border-dashed border-ink/[0.18] py-3.25 pl-4 pr-1 text-left ${
                      i === selected
                        ? "before:absolute before:left-0 before:top-2.75 before:bottom-2.75 before:w-0.75 before:rounded-r-[2px] before:bg-terracotta"
                        : ""
                    }`}
                  >
                    <span className="font-serif text-[17px] leading-none text-terracotta">℞</span>
                    <span
                      className={`flex-1 font-serif text-[19px] leading-tight ${i === selected ? "text-terracotta" : "text-ink"}`}
                    >
                      {t.name}
                    </span>
                    <span className="self-center text-[10.5px] text-muted">{t.dose}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8.5 flex items-end justify-between">
                <div>
                  <div className="font-hand text-[34px] leading-[0.9] text-ink">Nina Ross, ND; Ph.D</div>
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

        <div className="mt-7.5 text-center font-hand text-[28px] text-[#8a6a3a]">
          A whole program with you at the center, every step of the way.
        </div>
      </div>
    </section>
  );
}
