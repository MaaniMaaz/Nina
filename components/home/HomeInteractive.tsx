"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { JOURNAL_PROMPTS, DEFAULT_TURN_IMAGE } from "@/content/home";
import { cleanEntry, dotsRead, learnTopicFor, slugify } from "@/lib/home-logic";
import ProcessSteps from "./ProcessSteps";
import Toolkit from "./Toolkit";
import ProgramSection from "./ProgramSection";
import PatientStories from "./PatientStories";
import Consultation from "./Consultation";
import LearnSection from "./LearnSection";

/**
 * Owns the journal entry text that gates the rest of the homepage, mirroring
 * the source design's `unlocked` state (everything from The Turn onward stays
 * hidden until the visitor taps or types what they used to be able to do).
 */
export default function HomeInteractive() {
  const [entry, setEntry] = useState("");
  const clean = cleanEntry(entry);
  const hasEntry = clean.length > 0;
  const turnImage = JOURNAL_PROMPTS.find((p) => slugify(p.label) === slugify(clean))?.turnImage ?? DEFAULT_TURN_IMAGE;
  const mappedTopic = learnTopicFor(clean);

  return (
    <>
      <section className="relative overflow-hidden bg-cream-deep px-6 py-21 sm:px-10 sm:py-28 md:px-[clamp(40px,6vw,120px)] md:py-32">
        <div className="grain-overlay opacity-50 mix-blend-multiply" />
        <div
          className="pointer-events-none absolute -top-50 left-1/2 h-[520px] w-[760px] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(176,138,62,0.12), rgba(176,138,62,0) 68%)" }}
        />
        <div className="relative z-[1] mx-auto max-w-[960px] text-center">
          <div className="flex items-center justify-center gap-3.25">
            <span className="block h-[1.5px] w-7 bg-gold-deep" />
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-terracotta">
              The moment everything changes
            </span>
            <span className="block h-[1.5px] w-7 bg-gold-deep" />
          </div>
          <h2 className="mx-auto mt-6.5 max-w-[17ch] font-display text-[36px] font-medium leading-[1.06] tracking-tight text-ink sm:text-[52px] md:text-[64px]">
            &ldquo;I used to be able to do this. <span className="italic text-terracotta">Now I can&rsquo;t.</span>&rdquo;
          </h2>
          <p className="mx-auto mt-7 max-w-[60ch] text-[16px] leading-relaxed text-body sm:text-[19px]">
            You&rsquo;re still functioning. Still showing up, still holding it together for everyone who counts on
            you. But somewhere quiet, you already know. Recovery takes longer, your thinking feels foggier, sleep
            comes harder, and you feel a step removed from yourself. And the scariest part runs deeper than the
            tiredness: wondering whether this is just who you are now.
          </p>

          <div className="relative mx-auto mt-12.5 max-w-[668px] rounded-lg border border-ink/[0.08] bg-cream px-7 py-8.5 shadow-[0_34px_64px_rgba(46,33,27,0.11)] sm:px-12 sm:py-12">
            <div className="pointer-events-none absolute left-6.5 top-5.5 font-display text-[80px] leading-[0.7] text-gold-deep/20">
              &ldquo;
            </div>
            <div className="relative mb-6.5 text-[10.5px] font-semibold tracking-[0.22em] uppercase text-gold-deep">
              From the journal
            </div>
            <div className="relative font-[Caveat,cursive] text-[30px] leading-normal text-ink sm:text-[40px]">
              I used to be able to
              <br />
              <span className="inline-block border-b-2 border-terracotta/45 px-2.5 pb-0.5 text-terracotta">
                {hasEntry ? clean : "\u2026"}
              </span>
              <br />
              <span className="text-terracotta">Now I can&rsquo;t.</span>
            </div>

            <div className="relative mt-6.5 flex flex-wrap items-center justify-center gap-2">
              <span className="mr-0.5 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-muted">Tap one</span>
              {JOURNAL_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setEntry(p.label)}
                  className="rounded-full border border-ink/[0.14] bg-cream-deep px-3.5 py-1.75 text-[13px] text-body hover:border-terracotta hover:text-terracotta"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {!hasEntry && (
              <div className="relative mt-7 text-[13px] italic text-muted">
                Tap a phrase to see what your body might be telling you. ↓
              </div>
            )}

            {hasEntry && (
              <div className="relative mt-8 border-t border-ink/10 pt-7">
                <div className="mb-4.5 flex flex-col items-center gap-3.5">
                  <div className="relative h-21 w-21 overflow-hidden rounded-full border-[1.5px] border-gold-deep/60 shadow-[0_10px_26px_rgba(46,33,27,0.18)]">
                    <Image src="/images/dr-nina.jpg" alt="" fill className="object-cover object-[50%_16%]" />
                  </div>
                  <div className="flex items-center justify-center gap-2.5">
                    <span className="block h-[1.5px] w-4.5 bg-gold-deep" />
                    <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#7C8A5E]">
                      Dr. Nina connects the dots
                    </span>
                    <span className="block h-[1.5px] w-4.5 bg-gold-deep" />
                  </div>
                </div>
                <p className="mx-auto max-w-[46ch] font-display text-[19px] leading-snug text-ink sm:text-[23px]">
                  {dotsRead(clean)}
                </p>
                <div className="mt-2 font-[Caveat,cursive] text-2xl text-terracotta">— Dr. Nina</div>
                <Link
                  href="/start"
                  className="mt-6.5 inline-block rounded-md bg-terracotta px-7 py-3.75 text-[15px] font-semibold text-cream no-underline shadow-[0_12px_28px_rgba(181,87,47,0.26)] hover:bg-terracotta-hover"
                >
                  Find out why you can&rsquo;t {clean} anymore →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {hasEntry && (
        <>
          <section className="relative -mt-px overflow-hidden bg-olive px-6 py-14 text-center sm:px-10 sm:py-22 md:px-[clamp(40px,6vw,120px)] md:py-31">
            <div className="absolute inset-0 opacity-62">
              <Image src={turnImage} alt="" fill className="object-cover" />
            </div>
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(100deg, rgba(44,54,36,0.95) 0%, rgba(44,54,36,0.82) 42%, rgba(44,54,36,0.46) 100%)",
              }}
            />
            <div className="grain-overlay pointer-events-none opacity-50 mix-blend-overlay" />
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(207,168,90,0.16), rgba(207,168,90,0) 68%)" }}
            />
            <div className="relative z-[1] mx-auto max-w-[760px]">
              <span
                className="mx-auto mb-5.5 block h-11 w-px"
                style={{ background: "linear-gradient(180deg, rgba(207,168,90,0), #CFA85A)" }}
              />
              <div className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#b9c0a3]">
                You said you used to be able to
              </div>
              <div className="mt-3.5 font-display text-[30px] font-medium italic leading-tight text-gold sm:text-[42px] md:text-[50px]">
                {clean}.
              </div>
              <h2 className="mt-6.5 font-display text-[40px] font-medium leading-[1.02] tracking-tight text-cream-deep sm:text-[54px] md:text-[70px]">
                Now, let&rsquo;s get it back.
              </h2>
              <p className="mx-auto mt-5.5 max-w-[48ch] text-[15px] leading-relaxed text-[#d8dcc8] sm:text-[18px]">
                We go way past naming what slipped. We find out why it happened, and walk you all the way back to
                feeling like yourself.
              </p>
            </div>
          </section>

          <ProcessSteps />
          <Toolkit />
          <ProgramSection />
          <PatientStories />
          <Consultation />
          <LearnSection nodPhrase={clean} nodTopic={mappedTopic} />
        </>
      )}
    </>
  );
}
