"use client";

import { useState } from "react";
import Image from "next/image";
import { PATIENT_CASES } from "@/content/home";

const TAB_LABELS = ["The story", "Our read", "What we did", "Hear from them"];

export default function PatientStories() {
  const [storyIndex, setStoryIndex] = useState(0);
  const [tab, setTab] = useState(0);
  const n = PATIENT_CASES.length;
  const story = PATIENT_CASES[storyIndex];

  function go(i: number) {
    setStoryIndex(((i % n) + n) % n);
    setTab(0);
  }

  return (
    <section id="patient-stories" className="relative overflow-hidden bg-olive px-6 py-21 sm:px-10 sm:py-25 md:px-[clamp(40px,6vw,110px)] md:py-38">
      <div className="pointer-events-none absolute inset-0 bg-[#2c3524]/95" />
      <div className="grain-overlay pointer-events-none opacity-50 mix-blend-overlay" />
      <div
        className="pointer-events-none absolute -top-40 -right-20 h-180 w-180 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(207,168,90,0.16), rgba(207,168,90,0) 64%)" }}
      />
      <div className="relative z-[1] mx-auto max-w-295">
        <div className="mx-auto mb-9 max-w-180 text-center sm:mb-13.5">
          <div className="flex items-center justify-center gap-3.25">
            <span className="font-display text-sm italic text-gold">06</span>
            <span className="h-px w-9 bg-gold" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold">Real patient case studies</span>
            <span className="h-px w-9 bg-gold" />
          </div>
          <h2 className="mx-auto mt-5 max-w-[17ch] font-display text-[38px] font-medium leading-[1.03] tracking-tight text-cream-deep sm:text-[50px] md:text-[60px]">
            Real people. Real labs. <span className="italic text-gold">Real reversals.</span>
          </h2>
        </div>

        <div className="grid overflow-hidden rounded-[22px] shadow-[0_40px_90px_rgba(20,12,7,0.45)] md:grid-cols-[0.82fr_1fr]">
          <div className="relative min-h-140 bg-[#2a3322]">
            <Image src={story.src} alt={story.name} fill className="object-cover" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(20,12,7,0.28) 0%, rgba(20,12,7,0.02) 32%, rgba(20,12,7,0.34) 62%, rgba(20,12,7,0.9))",
              }}
            />
            <div className="grain-overlay pointer-events-none opacity-40 mix-blend-overlay" />
            <div className="absolute right-5.5 top-5.5 rounded-full bg-[rgba(20,12,7,0.5)] px-3.25 py-1.25 text-[11px] font-semibold text-cream-deep">
              {storyIndex + 1} / {n}
            </div>
            <div className="absolute inset-x-7.5 bottom-7.5">
              <div className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-gold-deep">
                A patient story · {story.category}
              </div>
              <h3 className="mt-2.5 font-display text-[30px] font-medium leading-[1.02] tracking-tight text-cream-deep sm:text-[40px]">
                {story.heroLead} <span className="italic text-gold">{story.heroEmph}</span>
              </h3>
              <div className="mt-3.5 flex items-center gap-3">
                <span className="text-sm font-semibold text-cream-deep">{story.name}</span>
                <span className="h-1 w-1 rounded-full bg-cream-deep/50" />
                <span className="font-display text-[16px] italic text-gold">{story.timeframe} to optimal</span>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col bg-[#F2EBDD]">
            <div className="flex flex-none gap-1 border-b border-ink/[0.12] px-7.5 pt-5">
              {TAB_LABELS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setTab(i)}
                  className={`-mb-px border-b-2 px-5 pb-4 pt-3 text-center ${i === tab ? "border-terracotta" : "border-transparent"}`}
                >
                  <div className={`flex h-6.5 items-center justify-center font-serif text-[19px] italic ${i === tab ? "text-terracotta" : "text-muted"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className={`mt-1.5 whitespace-nowrap text-[13.5px] font-semibold ${i === tab ? "text-terracotta" : "text-muted"}`}>
                    {label}
                  </div>
                </button>
              ))}
            </div>

            <div className="relative min-h-90 flex-1 p-7 sm:p-10">
              <div className="grain-overlay pointer-events-none opacity-30 mix-blend-multiply" />
              <div className="relative">
                {tab === 0 && (
                  <div>
                    <p className="text-[16px] leading-relaxed text-[#4a3f36] sm:text-[18px]">
                      <span className="float-left mr-3 -mb-1.5 mt-1 font-display text-[64px] font-medium leading-[0.78] text-terracotta">
                        {story.intake.charAt(0)}
                      </span>
                      {story.intake.slice(1)}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2.25">
                      {story.symptoms.map((s) => (
                        <span key={s} className="rounded-full border border-terracotta/22 bg-terracotta/[0.08] px-3.75 py-1.75 text-[13px] text-[#b06a4a]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {tab === 1 && (
                  <div className="relative rounded-[14px] border border-ink/10 border-l-[3px] border-l-gold-deep bg-cream p-7">
                    <span className="absolute right-5.5 top-5 font-serif text-[42px] text-gold-deep/50">℞</span>
                    <div className="mb-3 text-[10px] font-bold tracking-[0.16em] uppercase text-terracotta">
                      Dr. Nina&rsquo;s read
                    </div>
                    <p className="max-w-[38ch] font-serif text-[19px] leading-snug text-ink sm:text-[21px]">
                      {story.drNotes}
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="relative h-11.5 w-11.5 flex-none overflow-hidden rounded-full border border-gold-deep/55">
                        <Image src="/images/dr-nina.jpg" alt="" fill className="object-cover object-[50%_18%]" />
                      </div>
                      <div>
                        <div className="font-[Caveat,cursive] text-[26px] leading-[0.9] text-terracotta">Dr. Nina Ross</div>
                        <div className="mt-0.75 text-[9px] tracking-[0.1em] uppercase text-muted">ND · Ph.D</div>
                      </div>
                    </div>
                  </div>
                )}

                {tab === 2 && (
                  <div className="grid items-start gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-3.25">
                      {story.actions.map((a) => (
                        <div key={a} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#7C8A5E] text-xs text-cream">✓</span>
                          <span className="flex-1 text-[14.5px] leading-relaxed text-body">{a}</span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl bg-olive p-5.5 pb-4">
                      <div className="mb-4.5 text-[9.5px] font-semibold tracking-[0.14em] uppercase text-[#cdd4ba]">
                        The markers that moved
                      </div>
                      {story.markers.map((mk) => (
                        <div key={mk.label} className="mb-4.5">
                          <div className="flex items-baseline justify-between">
                            <span className="text-[13px] font-semibold text-cream-deep">{mk.label}</span>
                            <span className="font-display text-[23px] font-semibold leading-none text-[#9fb07a]">{mk.to}</span>
                          </div>
                          <div
                            className="relative mt-2.5 h-2 rounded-full"
                            style={{ background: "linear-gradient(90deg, rgba(181,87,47,0.5), rgba(124,138,94,0.55))" }}
                          >
                            <span
                              className="absolute top-1/2 h-3.25 w-3.25 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-olive bg-[#d88a5f]"
                              style={{ left: mk.fromPct }}
                            />
                            <span
                              className="absolute top-1/2 h-3.75 w-3.75 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-olive bg-[#9fb07a]"
                              style={{ left: mk.toPct }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tab === 3 && (
                  <div className="grid items-center gap-7.5 sm:grid-cols-[auto_1fr]">
                    <div className="relative aspect-[9/16] w-56 overflow-hidden rounded-[18px] bg-[#2a3322] shadow-[0_16px_38px_rgba(20,12,7,0.3)]">
                      <Image src={story.src} alt={story.name} fill className="object-cover" />
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(20,12,7,0.18) 0%, rgba(20,12,7,0.02) 30%, rgba(20,12,7,0.7))",
                        }}
                      />
                      <div className="absolute left-3.25 top-3.25 flex items-center gap-1.25 rounded-full bg-gold px-2.25 py-1 text-[9px] font-bold tracking-[0.1em] uppercase text-ink">
                        ▶ Video
                      </div>
                      <div className="absolute right-3.25 top-3.25 rounded-full bg-[rgba(20,12,7,0.55)] px-2.5 py-1 text-[10px] font-semibold text-cream-deep">
                        {story.videoLen}
                      </div>
                      <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-terracotta/94 shadow-[0_12px_28px_rgba(20,12,7,0.42)]">
                        <span className="ml-1 border-y-[11px] border-l-[18px] border-y-transparent border-l-cream" />
                      </div>
                    </div>
                    <div>
                      <span className="font-display text-[60px] leading-[0.4] text-gold-deep/45">&ldquo;</span>
                      <p className="mt-4 font-display text-[22px] italic leading-snug text-ink sm:text-[28px]">
                        {story.quote}
                      </p>
                      <div className="mt-3 font-[Caveat,cursive] text-[27px] text-terracotta">— {story.first}</div>
                      <div className="mt-1 text-xs text-muted">▶ Watch {story.first}&rsquo;s full 2-minute story</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-center gap-4 sm:mt-9.5">
          <button
            type="button"
            onClick={() => go(storyIndex - 1)}
            aria-label="Previous patient"
            className="flex h-12 w-12 flex-none items-center justify-center rounded-full border-[1.5px] border-cream-deep/30 text-lg text-cream-deep hover:border-gold"
          >
            ←
          </button>
          <div className="nr-rail flex max-w-190 gap-3.5 overflow-x-auto p-1">
            {PATIENT_CASES.map((c, i) => (
              <button
                key={c.key}
                type="button"
                onClick={() => go(i)}
                className="flex w-15 flex-none flex-col items-center gap-1.5"
              >
                <span
                  className="h-13.5 w-13.5 overflow-hidden rounded-full border-2 bg-[#2a3322]"
                  style={{ borderColor: i === storyIndex ? "#E9B45A" : "rgba(246,238,225,0.25)" }}
                >
                  <span className="relative block h-full w-full">
                    <Image src={c.src} alt={c.first} fill className="object-cover" />
                  </span>
                </span>
                <span className={`text-[10px] font-semibold ${i === storyIndex ? "text-cream-deep" : "text-[#9aa585]"}`}>
                  {c.first}
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(storyIndex + 1)}
            aria-label="Next patient"
            className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-terracotta text-lg text-cream hover:bg-terracotta-hover"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
