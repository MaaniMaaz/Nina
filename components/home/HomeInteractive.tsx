"use client";

import { useState } from "react";
import SmartImage from "@/components/ui/SmartImage";
import Link from "next/link";
import { DEFAULT_TURN_IMAGE } from "@/content/home";
import { cleanEntry, dotsRead, learnTopicFor, slugify } from "@/lib/home-logic";
import { pathToMediaKey } from "@/lib/cms/media-catalog";
import { useSiteMedia, useSiteMediaMap } from "@/components/media/SiteMediaContext";
import EditableText from "@/components/admin/EditableText";
import { useEdit } from "@/components/admin/EditContext";
import ProcessSteps from "./ProcessSteps";
import Toolkit from "./Toolkit";
import ProgramSection from "./ProgramSection";
import PatientStories from "./PatientStories";
import Consultation from "./Consultation";
import LearnSection from "./LearnSection";
import Footer from "@/components/layout/Footer";
import { useHomeContent } from "./HomeContentContext";

/**
 * Owns the journal entry text that gates the rest of the homepage, mirroring
 * the source design's `unlocked` state (everything from The Turn onward stays
 * hidden until the visitor taps or types what they used to be able to do).
 * In admin edit mode the gate is open so editors can reach Patient Stories.
 */
export default function HomeInteractive() {
  const [entry, setEntry] = useState("");
  const clean = cleanEntry(entry);
  const hasEntry = clean.length > 0;
  const edit = useEdit();
  const unlocked = hasEntry || !!edit?.enabled;
  const media = useSiteMediaMap();
  const drNina = useSiteMedia("dr-nina");
  const content = useHomeContent();
  const journal = content.journal;
  const turn = content.turn;
  const matched = journal.prompts.find((p) => slugify(p.label) === slugify(clean));
  const turnKey = matched ? pathToMediaKey(matched.turnImage) : pathToMediaKey(DEFAULT_TURN_IMAGE);
  const turnImage =
    (turnKey && media.images[turnKey]) ||
    media.images["turn-myself"] ||
    DEFAULT_TURN_IMAGE;
  const mappedTopic = learnTopicFor(clean);

  return (
    <>
      <section className="relative overflow-hidden bg-cream-deep px-6 py-[30px] md:px-[clamp(40px,6vw,120px)] md:py-32">
        <div className="grain-overlay opacity-45 mix-blend-multiply" style={{ backgroundSize: "180px" }} />
        <div
          className="pointer-events-none absolute -top-[120px] left-1/2 h-[360px] w-[460px] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(176,138,62,0.16), rgba(176,138,62,0) 68%)" }}
        />
        <div className="relative z-[1] mx-auto max-w-[960px] text-left md:text-center">
          <div className="flex items-center gap-2.5 md:justify-center md:gap-3.25">
            <span className="font-display text-[13px] italic text-[#B08A3E] md:hidden">02</span>
            <span className="hidden h-[1.5px] w-7 bg-gold-deep md:block" />
            <span className="h-px w-7 bg-[#B08A3E]/70 md:hidden" />
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-terracotta md:text-xs md:tracking-[0.18em]">
              <EditableText path="journal.eyebrow" value={journal.eyebrow} as="span" />
            </span>
            <span className="hidden h-[1.5px] w-7 bg-gold-deep md:block" />
          </div>
          <h2 className="mt-[18px] max-w-[17ch] font-display text-[33px] font-medium leading-[1.06] tracking-[-0.02em] text-ink md:mx-auto md:mt-6.5 md:text-[64px]">
            &ldquo;<EditableText path="journal.headingLead" value={journal.headingLead} as="span" />{" "}
            <span className="italic text-terracotta">
              <EditableText path="journal.headingEmph" value={journal.headingEmph} as="span" />
            </span>
            &rdquo;
          </h2>
          <p className="mt-4 max-w-[60ch] text-sm leading-[1.62] text-body md:mx-auto md:mt-7 md:text-[19px]">
            <EditableText path="journal.body" value={journal.body} as="span" multiline />
          </p>

          <div className="relative mx-auto mt-7 max-w-[668px] rounded-lg border border-ink/[0.08] bg-cream px-[22px] py-[26px] shadow-[0_18px_38px_rgba(46,33,27,0.1)] md:mt-12.5 md:px-12 md:py-12">
            <div className="pointer-events-none absolute left-[18px] top-3.5 font-display text-[64px] leading-[0.7] text-[rgba(176,138,62,0.2)]">
              &ldquo;
            </div>
            <div className="relative mb-[18px] text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[#B08A3E]">
              <EditableText path="journal.cardLabel" value={journal.cardLabel} as="span" />
            </div>
            <div className="relative text-center font-hand text-[30px] leading-[1.45] text-ink">
              <EditableText path="journal.promptPrefix" value={journal.promptPrefix} as="span" />
              <br />
              <span className="inline-block border-b-2 border-terracotta/45 px-2 pb-0.5 text-terracotta">
                {hasEntry ? clean : "\u2026"}
              </span>
              <br />
              <EditableText path="journal.promptSuffix" value={journal.promptSuffix} as="span" />
            </div>

            <div className="relative mt-[22px] flex flex-wrap items-center justify-center gap-[7px]">
              <span className="mb-0.5 w-full text-center text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#9a8b7a]">
                <EditableText path="journal.chipHint" value={journal.chipHint} as="span" />
              </span>
              {journal.prompts.map((p, i) => {
                const isSelected = hasEntry && clean === p.label;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setEntry(p.label)}
                    aria-pressed={isSelected}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      isSelected
                        ? "border-terracotta bg-terracotta text-cream shadow-[0_8px_18px_rgba(181,87,47,0.28)]"
                        : "border-ink/[0.14] bg-cream-deep text-body hover:border-terracotta hover:text-terracotta"
                    }`}
                  >
                    <EditableText path={`journal.prompts.${i}.label`} value={p.label} as="span" />
                  </button>
                );
              })}
            </div>

            {!hasEntry && (
              <div className="relative mt-[22px] text-center text-xs italic text-[#8a7a6c]">
                <EditableText path="journal.emptyNudge" value={journal.emptyNudge} as="span" />
              </div>
            )}

            {hasEntry && (
              <>
                <div className="relative mt-5 flex flex-col items-center gap-1 md:hidden">
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#9a8b7a]">
                    Scroll to read more
                  </span>
                  <span className="text-terracotta" aria-hidden>
                    ↓
                  </span>
                </div>
                <div className="relative mt-6 border-t border-ink/10 pt-[22px]">
                  {/* Mobile dump reply — no portrait */}
                  <div className="mb-3 flex items-center justify-center gap-[9px] md:hidden">
                    <span className="block h-[1.5px] w-4 bg-[#B08A3E]" />
                    <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#7C8A5E]">
                      <EditableText path="journal.replyEyebrowMobile" value={journal.replyEyebrowMobile} as="span" />
                    </span>
                    <span className="block h-[1.5px] w-4 bg-[#B08A3E]" />
                  </div>
                  {/* Desktop reply chrome */}
                  <div className="mb-4.5 hidden flex-col items-center gap-3.5 md:flex">
                    <div className="relative h-21 w-21 overflow-hidden rounded-full border-[1.5px] border-gold-deep/60 shadow-[0_10px_26px_rgba(46,33,27,0.18)]">
                      <SmartImage
                        src={drNina}
                        alt=""
                        fill
                        className="object-cover object-[50%_16%]"
                        unoptimized={drNina.startsWith("http")}
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2.5">
                      <span className="block h-[1.5px] w-4.5 bg-gold-deep" />
                      <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#7C8A5E]">
                        <EditableText path="journal.replyEyebrowDesktop" value={journal.replyEyebrowDesktop} as="span" />
                      </span>
                      <span className="block h-[1.5px] w-4.5 bg-gold-deep" />
                    </div>
                  </div>
                  <p className="mx-auto max-w-[46ch] text-center font-display text-[18px] leading-[1.4] text-ink md:text-[23px]">
                    {dotsRead(clean)}
                  </p>
                  <div className="mt-2 hidden font-hand text-2xl text-terracotta md:block">
                    <EditableText path="journal.replySignoff" value={journal.replySignoff} as="span" />
                  </div>
                  <Link
                    href="/start"
                    className="mt-[22px] block rounded-lg bg-terracotta py-3.5 text-center text-sm font-semibold text-cream no-underline shadow-[0_10px_24px_rgba(181,87,47,0.26)] hover:bg-terracotta-hover md:mt-6.5 md:inline-block md:rounded-md md:px-7 md:py-3.75 md:text-[15px]"
                  >
                    Find out why you can&rsquo;t {clean} anymore →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {unlocked && (
        <>
          <section className="relative -mt-px flex min-h-[70svh] items-center overflow-hidden bg-olive px-9 py-16 text-center md:min-h-0 md:px-[clamp(40px,6vw,120px)] md:py-31">
            <div className="absolute inset-0 opacity-62">
              <SmartImage
                src={turnImage}
                alt=""
                fill
                className="object-cover object-[78%_center] md:object-center"
                unoptimized={turnImage.startsWith("http")}
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(165deg, rgba(44,54,36,0.95) 0%, rgba(44,54,36,0.8) 44%, rgba(44,54,36,0.5) 100%)",
              }}
            />
            <div className="grain-overlay pointer-events-none opacity-50 mix-blend-overlay" style={{ backgroundSize: "180px" }} />
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[440px] md:w-[760px]"
              style={{ background: "radial-gradient(circle, rgba(207,168,90,0.16), rgba(207,168,90,0) 68%)" }}
            />
            <div className="relative z-[1] mx-auto max-w-[760px]">
              <span
                className="mx-auto mb-5 block h-10 w-px md:mb-5.5 md:h-11"
                style={{ background: "linear-gradient(180deg, rgba(207,168,90,0), #CFA85A)" }}
              />
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b9c0a3] md:text-[11px] md:tracking-[0.24em]">
                <EditableText path="turn.eyebrow" value={turn.eyebrow} as="span" />
              </div>
              <div className="mt-3 font-display text-[30px] font-medium italic leading-[1.12] text-[#E9B45A] md:mt-3.5 md:text-[50px] md:leading-tight md:text-gold">
                {clean || "…"}
              </div>
              <h2 className="mt-5 font-display text-[42px] font-medium leading-[1.02] tracking-[-0.03em] text-cream-deep md:mt-6.5 md:text-[70px] md:tracking-tight">
                <EditableText path="turn.heading" value={turn.heading} as="span" />
              </h2>
              <p className="mx-auto mt-[18px] max-w-[48ch] text-sm leading-[1.6] text-[#d8dcc8] md:mt-5.5 md:text-[18px] md:leading-relaxed">
                <EditableText path="turn.body" value={turn.body} as="span" multiline />
              </p>
            </div>
          </section>

          <ProcessSteps />
          <Toolkit />
          <ProgramSection />
          <PatientStories />
          <Consultation />
          <LearnSection nodPhrase={clean} nodTopic={mappedTopic} />
          <Footer variant="home" />
        </>
      )}
    </>
  );
}
