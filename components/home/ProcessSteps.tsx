"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { pathToMediaKey } from "@/lib/cms/media";
import { useSiteMedia, useSiteMediaMap } from "@/components/media/SiteMediaContext";
import EditableText from "@/components/admin/EditableText";
import { useHomeContent } from "./HomeContentContext";

/**
 * Mobile = dump §03: featured step card + 6 number circles.
 * Desktop = editorial index + sticky detail panel.
 */
export default function ProcessSteps() {
  const [selected, setSelected] = useState(0);
  const process = useHomeContent().process;
  const steps = process.steps;
  const step = steps[selected] ?? steps[0];
  const media = useSiteMediaMap();
  const drNina = useSiteMedia("dr-nina");
  const stepKey = step?.img ? pathToMediaKey(step.img) : null;
  const stepImg = (stepKey && media.images[stepKey]) || step?.img;

  if (!step) return null;

  return (
    <section id="process" className="relative overflow-hidden bg-cream-deep px-6 py-[26px] md:bg-sand-deep md:px-[clamp(40px,6vw,120px)] md:py-39">
      <div className="grain-overlay opacity-45 mix-blend-multiply" style={{ backgroundSize: "180px" }} />
      <div
        className="pointer-events-none absolute -top-[120px] left-1/2 h-[360px] w-[460px] -translate-x-1/2 rounded-full md:hidden"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.16), rgba(176,138,62,0) 68%)" }}
      />

      {/* ─── MOBILE (dump §03) ─── */}
      <div className="relative z-[1] md:hidden">
        <div className="flex items-center gap-2.5">
          <span className="font-display text-[13px] italic text-[#B08A3E]">03</span>
          <span className="h-px w-7 bg-[#B08A3E]/70" />
          <span className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-terracotta">
            <EditableText path="process.eyebrow" value={process.eyebrow} as="span" />
          </span>
        </div>
        <h2 className="mt-4 font-display text-[32px] font-medium leading-[1.05] tracking-[-0.02em] text-ink">
          <EditableText path="process.headingLead" value={process.headingLead} as="span" />{" "}
          <span className="italic text-terracotta">
            <EditableText path="process.headingEmph" value={process.headingEmph} as="span" />
          </span>
        </h2>
        <p className="mt-3 text-[13.5px] leading-[1.58] text-[#5f5346]">
          <EditableText path="process.bodyMobile" value={process.bodyMobile} as="span" multiline />
        </p>

        {/* Active step card */}
        <div className="mt-6 overflow-hidden rounded-[14px] border border-ink/[0.08] bg-cream shadow-[0_6px_18px_rgba(46,33,27,0.1)]">
          <div className="relative h-[188px] border-t-[3px] border-t-terracotta bg-[#E7DCC9]">
            {stepImg && (
              <Image
                src={stepImg}
                alt={step.title}
                fill
                className="object-cover"
                unoptimized={stepImg.startsWith("http")}
              />
            )}
            <div className="absolute left-3.5 top-3.5 flex h-11 w-11 items-center justify-center rounded-full bg-ink shadow-[0_6px_16px_rgba(46,33,27,0.3)]">
              <span className="font-display text-xl font-medium text-gold-deep">{Number(step.num)}</span>
            </div>
          </div>
          <div className="px-5 pb-5 pt-[18px]">
            <div className="flex items-baseline justify-between gap-2.5">
              <h3 className="font-display text-[22px] font-medium leading-[1.12] text-ink">
                <EditableText path={`process.steps.${selected}.title`} value={step.title} as="span" />
              </h3>
              <span className="flex-none text-[9px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                <EditableText path={`process.steps.${selected}.kicker`} value={step.kicker} as="span" />
              </span>
            </div>
            <p className="mt-[11px] text-[13.5px] leading-[1.56] text-body">
              <EditableText path={`process.steps.${selected}.detail`} value={step.detail} as="span" multiline />
            </p>
            <div className="mt-4 flex items-center gap-[9px]">
              <div className="relative h-[30px] w-[30px] overflow-hidden rounded-full border border-[rgba(176,138,62,0.5)]">
                <Image
                  src={drNina}
                  alt=""
                  fill
                  className="object-cover object-[50%_18%]"
                  unoptimized={drNina.startsWith("http")}
                />
              </div>
              <span className="font-hand text-[19px] text-terracotta">
                <EditableText path="process.attribution" value={process.attribution} as="span" />
              </span>
            </div>
          </div>
        </div>

        {/* Number picker */}
        <div className="mt-[26px]">
          <div className="mb-[13px] text-center text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[#9a8b7a]">
            <EditableText path="process.pickerHint" value={process.pickerHint} as="span" />
          </div>
          <div className="flex justify-center gap-2.5">
            {steps.map((s, i) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setSelected(i)}
                aria-label={`Step ${Number(s.num)}: ${s.title}`}
                className={`flex h-11 w-11 items-center justify-center rounded-full ${
                  i === selected
                    ? "bg-terracotta shadow-[0_8px_18px_rgba(181,87,47,0.4)]"
                    : "border-[1.5px] border-[rgba(176,138,62,0.55)] bg-cream"
                }`}
              >
                <span
                  className={`font-display text-[19px] font-medium ${
                    i === selected ? "text-cream" : "text-[#B08A3E]"
                  }`}
                >
                  {Number(s.num)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Link
          href="/start"
          className="mt-6 flex w-full items-center justify-center rounded-lg bg-terracotta py-[15px] text-[15px] font-semibold text-cream no-underline shadow-[0_10px_24px_rgba(181,87,47,0.4)]"
        >
          <EditableText path="process.cta" value={process.cta} as="span" />
        </Link>
      </div>

      {/* ─── DESKTOP ─── */}
      <div className="relative z-[1] mx-auto hidden max-w-[1180px] grid-cols-2 items-start gap-19 md:grid">
        <div>
          <div className="flex items-center gap-3.25">
            <span className="h-px w-9 bg-gold-deep" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-terracotta">
              <EditableText path="process.eyebrow" value={process.eyebrow} as="span" />
            </span>
          </div>
          <h2 className="mt-5 font-display text-[56px] font-medium leading-tight tracking-tight text-ink">
            <EditableText path="process.headingLead" value={process.headingLead} as="span" />{" "}
            <span className="italic text-terracotta">
              <EditableText path="process.headingEmph" value={process.headingEmph} as="span" />
            </span>
          </h2>
          <p className="mt-4 max-w-[42ch] text-[17px] leading-relaxed text-body-soft">
            <EditableText path="process.bodyDesktop" value={process.bodyDesktop} as="span" multiline />
          </p>

          <div>
            {steps.map((s, i) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setSelected(i)}
                className={`relative flex w-full items-baseline gap-4.5 border-t border-ink/[0.14] py-4.5 pl-6.5 pr-4 text-left ${
                  i === selected
                    ? "before:absolute before:left-0 before:top-3.5 before:bottom-3.5 before:w-1 before:rounded-r-[3px] before:bg-terracotta"
                    : ""
                }`}
              >
                <span className="min-w-7 font-display text-lg font-medium text-gold-deep">
                  <EditableText path={`process.steps.${i}.num`} value={s.num} as="span" />
                </span>
                <span className="flex-1 font-display text-[24px] font-medium leading-tight text-ink">
                  <EditableText path={`process.steps.${i}.title`} value={s.title} as="span" />
                </span>
                <span className="self-center text-[11px] text-muted">
                  <EditableText path={`process.steps.${i}.kicker`} value={s.kicker} as="span" />
                </span>
              </button>
            ))}
            <div className="border-t border-ink/[0.14]" />
          </div>
        </div>

        <div className="sticky top-12 flex min-h-125 flex-col rounded-xl border border-ink/[0.07] border-t-[3px] border-t-terracotta bg-cream p-7 pb-10 shadow-[0_22px_50px_rgba(46,33,27,0.14)]">
          <div className="relative h-70 w-full overflow-hidden rounded-lg bg-sand-deep">
            {stepImg && (
              <Image
                src={stepImg}
                alt={step.title}
                fill
                className="object-cover"
                unoptimized={stepImg.startsWith("http")}
              />
            )}
            <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink shadow-[0_6px_16px_rgba(46,33,27,0.3)]">
              <span className="font-display text-[22px] font-medium text-gold-deep">{Number(step.num)}</span>
            </div>
          </div>
          <div className="mt-7 flex items-baseline justify-between">
            <h3 className="font-display text-[36px] font-medium leading-tight tracking-tight text-ink">
              <EditableText path={`process.steps.${selected}.title`} value={step.title} as="span" />
            </h3>
            <span className="ml-3.5 whitespace-nowrap text-[11px] font-semibold tracking-[0.18em] uppercase text-terracotta">
              <EditableText path={`process.steps.${selected}.kicker`} value={step.kicker} as="span" />
            </span>
          </div>
          <p className="mt-4 text-[16px] leading-relaxed text-body">
            <EditableText path={`process.steps.${selected}.detail`} value={step.detail} as="span" multiline />
          </p>
          <div className="mt-auto flex items-center gap-2.75 pt-6.5">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gold-deep/50">
              <Image
                  src={drNina}
                  alt=""
                  fill
                  className="object-cover object-[50%_18%]"
                  unoptimized={drNina.startsWith("http")}
                />
            </div>
            <span className="font-hand text-[22px] text-terracotta">
              <EditableText path="process.attribution" value={process.attribution} as="span" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
