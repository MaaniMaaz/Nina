"use client";

import { useState } from "react";
import Image from "next/image";
import EditableText from "@/components/admin/EditableText";
import { useEdit } from "@/components/admin/EditContext";
import { TOOLKIT_ITEMS } from "@/content/home";
import { pathToMediaKey } from "@/lib/cms/media";
import { useSiteMedia, useSiteMediaMap } from "@/components/media/SiteMediaContext";

/**
 * Positioning Care Plan Toolkit — dump §05.5 sticky image + Rx list.
 * Mobile mirrors homepage fixed image + scroll list pattern.
 */
export default function CarePlanToolkit({
  number,
  eyebrow = "The Care Plan toolkit",
  heading = "Labs are just the beginning.",
  intro = "Here, your results are where the real work begins. Your labs open a whole program.",
  blockIndex = 0,
}: {
  number?: string;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  blockIndex?: number;
}) {
  const edit = useEdit();
  const E = edit?.enabled;
  const base = `blocks.${blockIndex}`;
  const [selected, setSelected] = useState(0);
  const active = TOOLKIT_ITEMS[selected];
  const media = useSiteMediaMap();
  const drNina = useSiteMedia("dr-nina");
  const mobileKey = active.imageMobile ? pathToMediaKey(active.imageMobile) : null;
  const desktopKey = active.imageDesktop ? pathToMediaKey(active.imageDesktop) : null;
  const imageMobile = (mobileKey && media.images[mobileKey]) || active.imageMobile || "";
  const imageDesktop = (desktopKey && media.images[desktopKey]) || active.imageDesktop || "";
  const [lead, em] = heading.includes("beginning")
    ? ["Labs are just the ", "beginning."]
    : [heading, ""];

  return (
    <section id="care-plan-toolkit" className="relative overflow-hidden bg-[#E8E4D6]">
      <div className="grain-overlay opacity-40 mix-blend-multiply" style={{ backgroundSize: "180px" }} />
      <div
        className="pointer-events-none absolute -top-[180px] left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.12), rgba(176,138,62,0) 68%)" }}
      />

      {/* Mobile: fixed chrome + scroll list */}
      <div className="relative h-[100svh] min-h-[640px] md:hidden">
        <div className="absolute inset-x-0 top-0 z-10 border-b border-ink/[0.08] bg-[#E8E4D6]">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2.5">
              <div className="relative h-[30px] w-[30px] overflow-hidden rounded-full border border-[rgba(176,138,62,0.55)]">
                <Image
                  src={drNina}
                  alt=""
                  fill
                  className="object-cover object-[50%_18%]"
                  unoptimized={drNina.startsWith("http")}
                />
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
          <div className="px-[26px] pb-3">
            <div className="flex items-center gap-2.5">
              {number && <span className="font-display text-[13px] italic text-[#B08A3E]">{number}</span>}
              <span className="h-px w-7 bg-[#B08A3E]/70" />
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-terracotta">
                {E ? <EditableText path={`${base}.eyebrow`} value={eyebrow} /> : eyebrow}
              </span>
            </div>
            <div className="mt-2 font-display text-2xl font-medium leading-[1.1] text-ink">
              {E ? (
                <EditableText path={`${base}.heading`} value={heading} multiline />
              ) : (
                <>
                  {lead}
                  {em && <span className="italic text-terracotta">{em}</span>}
                </>
              )}
            </div>
            <div className="mt-1.5 text-xs leading-[1.45] text-body-soft">
              {E ? (
                <EditableText path={`${base}.intro`} value={intro} multiline />
              ) : (
                intro
              )}
            </div>
          </div>
          <div className="relative h-[220px] overflow-hidden bg-[#E7DCC9]">
            {imageMobile && (
              <div key={active.num} className="absolute inset-0 animate-nr-img">
                <Image
                  src={imageMobile}
                  alt={active.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  unoptimized={imageMobile.startsWith("http")}
                />
              </div>
            )}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(46,33,27,0) 36%, rgba(46,33,27,0.9))" }}
            />
            <div className="absolute inset-x-[22px] bottom-4">
              <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-deep">
                Now viewing · {active.num} / {TOOLKIT_ITEMS.length} · {active.dose}
              </div>
              <div className="mt-1 font-display text-[24px] font-medium leading-[1.08] text-cream-deep">{active.name}</div>
              <div className="mt-1 text-xs leading-[1.45] text-[#f0e7da]">{active.desc}</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 top-[420px] overflow-y-auto bg-[#FCFAF3] px-[26px] pb-10 pt-3.5">
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
              <span className={`flex-1 font-serif text-[17.5px] leading-[1.25] ${i === selected ? "text-terracotta" : "text-ink"}`}>
                {t.name}
              </span>
              <span className="self-center text-[10px] tracking-wide text-[#9a8b7a]">{t.dose}</span>
            </button>
          ))}
          <p className="mt-5 text-center text-xs leading-[1.5] text-[#6b5d52]">
            It works like a membership. Join for 3, 6, or 12 months — the whole toolkit is yours the entire time.
          </p>
        </div>
      </div>

      {/* Desktop: sticky image + list */}
      <div className="relative z-[1] mx-auto hidden max-w-[1200px] px-[clamp(40px,6vw,100px)] py-[clamp(64px,7vw,104px)] md:block">
        <div className="mb-10 flex items-center gap-3">
          {number && <span className="font-display text-sm italic text-terracotta">{number}</span>}
          <span className="h-px w-9 bg-gold-deep" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
            {E ? <EditableText path={`${base}.eyebrow`} value={eyebrow} /> : eyebrow}
          </span>
        </div>
        <div className="grid grid-cols-[1.05fr_0.95fr] items-start gap-12">
          <div className="sticky top-24">
            <div className="relative aspect-[4/5] min-h-[380px] w-full overflow-hidden rounded-xl bg-[#E7DCC9] shadow-[0_18px_40px_rgba(46,33,27,0.14)]">
              {imageDesktop && (
                <div key={active.num} className="absolute inset-0 animate-nr-img">
                  <Image
                    src={imageDesktop}
                    alt={active.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 45vw, 100vw"
                    unoptimized={imageDesktop.startsWith("http")}
                  />
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-46% to-ink" />
              <div className="absolute inset-x-5 bottom-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                  Now viewing · {active.num} / {TOOLKIT_ITEMS.length} · {active.dose}
                </div>
                <div className="mt-1 font-display text-[32px] font-medium leading-tight text-cream-deep">{active.name}</div>
                <div className="mt-2 text-[15px] leading-relaxed text-[#f0e7da]">{active.desc}</div>
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <div className="font-hand text-[34px] leading-[0.9] text-ink">Nina Ross, ND; Ph.D</div>
                <div className="mt-1 h-px w-40 bg-ink/30" />
                <div className="mt-1.5 text-[9px] uppercase tracking-[0.1em] text-muted">Signed · your physician</div>
              </div>
              <div className="flex h-16 w-16 -rotate-12 items-center justify-center rounded-full border-[1.5px] border-dashed border-terracotta text-center">
                <span className="text-[8px] font-bold uppercase leading-tight tracking-[0.1em] text-terracotta">
                  Care
                  <br />
                  Plan
                </span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-display text-[42px] font-medium leading-[1.04] tracking-tight text-ink">
              {E ? (
                <EditableText path={`${base}.heading`} value={heading} multiline />
              ) : (
                <>
                  {lead}
                  {em && <span className="italic text-terracotta">{em}</span>}
                </>
              )}
            </h2>
            <p className="mt-3.5 max-w-[42ch] text-sm leading-relaxed text-body-soft">
              {E ? (
                <EditableText path={`${base}.intro`} value={intro} multiline />
              ) : (
                intro
              )}{" "}
              It works like a membership — join for 3, 6, or 12 months and the whole toolkit is yours.
            </p>
            <div className="mt-6">
              {TOOLKIT_ITEMS.map((t, i) => (
                <button
                  key={t.num}
                  type="button"
                  onClick={() => setSelected(i)}
                  onMouseEnter={() => setSelected(i)}
                  className={`relative flex w-full items-baseline gap-3.5 border-b border-dashed border-ink/[0.18] py-3.25 pl-4 pr-1 text-left ${
                    i === selected
                      ? "before:absolute before:bottom-2.75 before:left-0 before:top-2.75 before:w-0.75 before:rounded-r-[2px] before:bg-terracotta"
                      : ""
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
          </div>
        </div>
      </div>
    </section>
  );
}
