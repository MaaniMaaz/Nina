"use client";

import { useState } from "react";
import Image from "next/image";
import { pathToMediaKey } from "@/lib/cms/media";
import { useSiteMedia, useSiteMediaMap } from "@/components/media/SiteMediaContext";
import EditableText from "@/components/admin/EditableText";
import { useHomeContent } from "./HomeContentContext";

/**
 * Mobile = dump §04: fixed brand/intro/image + scroll-only Rx list.
 * Desktop = two-column prescription letterhead.
 */
export default function Toolkit() {
  const [selected, setSelected] = useState(0);
  const toolkit = useHomeContent().toolkit;
  const items = toolkit.items;
  const active = items[selected] ?? items[0];
  const media = useSiteMediaMap();
  const drNina = useSiteMedia("dr-nina");
  const mobileKey = active?.imageMobile ? pathToMediaKey(active.imageMobile) : null;
  const desktopKey = active?.imageDesktop ? pathToMediaKey(active.imageDesktop) : null;
  const imageMobile = (mobileKey && media.images[mobileKey]) || active?.imageMobile || "";
  const imageDesktop = (desktopKey && media.images[desktopKey]) || active?.imageDesktop || "";

  if (!active) return null;

  return (
    <section id="toolkit" className="relative overflow-hidden bg-[#E8E4D6] md:px-[clamp(40px,6vw,120px)] md:py-39">
      <div className="grain-overlay hidden opacity-40 mix-blend-multiply md:block" />
      <div
        className="pointer-events-none absolute -top-[180px] left-1/2 hidden h-[560px] w-[900px] -translate-x-1/2 rounded-full md:block"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.12), rgba(176,138,62,0) 68%)" }}
      />

      {/* ─── MOBILE (dump §04 fixed chrome) ─── */}
      <div className="relative h-[100svh] min-h-[720px] md:hidden">
        <div className="absolute inset-x-0 top-0 z-10 bg-[#E8E4D6]">
          <div className="flex items-center justify-between border-b border-ink/[0.08] px-6 py-3">
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

          <div className="border-b border-ink/[0.08] px-[26px] pb-3 pt-3">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-[13px] italic text-[#B08A3E]">04</span>
              <span className="h-px w-7 bg-[#B08A3E]/70" />
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-terracotta">
                <EditableText path="toolkit.eyebrow" value={toolkit.eyebrow} as="span" />
              </span>
            </div>
            <div className="mt-2 font-display text-2xl font-medium leading-[1.1] text-ink">
              <EditableText path="toolkit.headingLead" value={toolkit.headingLead} as="span" />{" "}
              <span className="italic text-terracotta">
                <EditableText path="toolkit.headingEmph" value={toolkit.headingEmph} as="span" />
              </span>
            </div>
            <div className="mt-1.5 text-xs leading-[1.45] text-body-soft">
              <EditableText path="toolkit.introMobile" value={toolkit.introMobile} as="span" multiline />
            </div>
          </div>

          <div className="relative h-[268px] overflow-hidden bg-[#E7DCC9]">
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
            <div className="absolute inset-x-[22px] bottom-5">
              <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-deep">
                Now viewing · <EditableText path={`toolkit.items.${selected}.num`} value={active.num} as="span" /> /{" "}
                {items.length} · <EditableText path={`toolkit.items.${selected}.dose`} value={active.dose} as="span" />
              </div>
              <div className="mt-1 font-display text-[27px] font-medium leading-[1.08] text-cream-deep">
                <EditableText path={`toolkit.items.${selected}.name`} value={active.name} as="span" />
              </div>
              <div className="mt-[7px] text-[12.5px] leading-[1.45] text-[#f0e7da]">
                <EditableText path={`toolkit.items.${selected}.desc`} value={active.desc} as="span" multiline />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 top-[476px] overflow-y-auto bg-[#FCFAF3] px-[26px] pb-8 pt-3.5">
          <div className="mb-1 flex items-center gap-[9px]">
            <span className="h-px w-[18px] bg-[#B08A3E]" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-terracotta">
              <EditableText path="toolkit.exploreHint" value={toolkit.exploreHint} as="span" />
            </span>
          </div>
          {items.map((t, i) => (
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
                <EditableText path={`toolkit.items.${i}.name`} value={t.name} as="span" />
              </span>
              <span className="self-center text-[10px] tracking-wide text-[#9a8b7a]">
                <EditableText path={`toolkit.items.${i}.dose`} value={t.dose} as="span" />
              </span>
            </button>
          ))}
          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="font-hand text-[28px] leading-[0.9] text-ink">
                <EditableText path="toolkit.signatureName" value={toolkit.signatureName} as="span" />
              </div>
              <div className="mt-1 h-px w-[130px] bg-ink/30" />
              <div className="mt-1 text-[8px] uppercase tracking-[0.1em] text-[#9a8b7a]">
                <EditableText path="toolkit.signatureMeta" value={toolkit.signatureMeta} as="span" />
              </div>
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
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-terracotta">
            <EditableText path="toolkit.eyebrow" value={toolkit.eyebrow} as="span" />
          </span>
          <span className="h-px w-9 bg-gold-deep" />
        </div>

        <div className="overflow-hidden rounded-md bg-[#FCFAF3] shadow-[0_34px_80px_rgba(46,33,27,0.18)]">
          <div className="flex items-center justify-between gap-4 border-b border-ink/[0.12] px-11 py-6.5">
            <div className="flex items-center gap-4.25">
              <div className="relative h-15 w-15 flex-none overflow-hidden rounded-full border border-gold-deep/55">
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

          <div className="grid grid-cols-2 items-stretch">
            <div className="flex flex-col border-r border-dashed border-ink/[0.18] bg-[#F2EBDD] p-10">
              <div className="relative min-h-[380px] w-full flex-1 overflow-hidden rounded-xl bg-sand-deep shadow-[0_18px_40px_rgba(46,33,27,0.14)]">
                {imageDesktop && (
                  <div key={active.num} className="absolute inset-0 animate-nr-img">
                    <Image
                      src={imageDesktop}
                      alt={active.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 40vw, 100vw"
                      unoptimized={imageDesktop.startsWith("http")}
                    />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-46% to-ink" />
                <div className="pointer-events-none absolute bottom-5 left-5.5 right-5.5">
                  <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold-deep">
                    Now viewing · {active.num}
                  </div>
                  <div className="mt-1 font-display text-[32px] font-medium leading-tight text-cream-deep">
                    <EditableText path={`toolkit.items.${selected}.name`} value={active.name} as="span" />
                  </div>
                </div>
              </div>
              <p className="mt-5.5 min-h-20 text-[16px] leading-relaxed text-body">
                <EditableText path={`toolkit.items.${selected}.desc`} value={active.desc} as="span" multiline />
              </p>
            </div>

            <div className="p-10">
              <div className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-muted">
                Care Plan · prepared for you
              </div>
              <h2 className="mt-3 font-display text-[48px] font-medium leading-[1.04] tracking-tight text-ink">
                <EditableText path="toolkit.headingLead" value={toolkit.headingLead} as="span" />{" "}
                <span className="italic text-terracotta">
                  <EditableText path="toolkit.headingEmph" value={toolkit.headingEmph} as="span" />
                </span>
              </h2>
              <p className="mt-3.5 max-w-[42ch] text-sm leading-relaxed text-body-soft">
                <EditableText path="toolkit.introDesktop" value={toolkit.introDesktop} as="span" multiline />
              </p>

              <div className="mt-6.5">
                {items.map((t, i) => (
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
                      <EditableText path={`toolkit.items.${i}.name`} value={t.name} as="span" />
                    </span>
                    <span className="self-center text-[10.5px] text-muted">
                      <EditableText path={`toolkit.items.${i}.dose`} value={t.dose} as="span" />
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-8.5 flex items-end justify-between">
                <div>
                  <div className="font-hand text-[34px] leading-[0.9] text-ink">
                    <EditableText path="toolkit.signatureName" value={toolkit.signatureName} as="span" />
                  </div>
                  <div className="mt-1.25 h-px w-42.5 bg-ink/30" />
                  <div className="mt-1.5 text-[9px] tracking-[0.1em] uppercase text-muted">
                    <EditableText path="toolkit.signatureMeta" value={toolkit.signatureMeta} as="span" />
                  </div>
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
          <EditableText path="toolkit.footerNote" value={toolkit.footerNote} as="span" />
        </div>
      </div>
    </section>
  );
}
