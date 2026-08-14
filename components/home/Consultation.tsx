"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteMedia } from "@/components/media/SiteMediaContext";
import EditableText from "@/components/admin/EditableText";
import { useHomeContent } from "./HomeContentContext";

/**
 * Mobile = dump §07: scrollable body + sticky CTA bar.
 * Desktop keeps dual-column layout with in-card CTA.
 */
export default function Consultation() {
  const drNina = useSiteMedia("dr-nina");
  const c = useHomeContent().consultation;

  return (
    <section className="relative overflow-hidden bg-[#ECE3D2] md:bg-sand-deep">
      <div className="grain-overlay opacity-40 mix-blend-multiply" style={{ backgroundSize: "180px" }} />
      <div
        className="pointer-events-none absolute -top-50 left-1/2 hidden h-135 w-205 -translate-x-1/2 rounded-full md:block"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.12), rgba(176,138,62,0) 68%)" }}
      />

      <div className="relative z-[1] mx-auto max-w-295 px-[22px] pb-[120px] pt-[26px] md:px-[clamp(40px,6vw,120px)] md:pb-39 md:pt-39">
        <div className="mx-auto max-w-205 text-center">
          <div className="relative mx-auto mb-3.5 h-[76px] w-[76px] overflow-hidden rounded-full border border-gold-deep/60 shadow-[0_10px_24px_rgba(46,33,27,0.16)] md:mb-5.5 md:h-23 md:w-23">
            <Image
              src={drNina}
              alt="Dr. Nina Ross, ND PhD"
              fill
              className="object-cover object-[50%_16%]"
              unoptimized={drNina.startsWith("http")}
            />
          </div>
          <div className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-terracotta md:flex md:items-center md:justify-center md:gap-3.25 md:text-xs md:tracking-[0.2em]">
            <span className="hidden font-display text-sm italic text-terracotta md:inline">07</span>
            <span className="hidden h-px w-9 bg-gold-deep md:block" />
            <EditableText path="consultation.eyebrow" value={c.eyebrow} as="span" />
            <span className="hidden h-px w-9 bg-gold-deep md:block" />
          </div>
          <h2 className="mx-auto mt-[9px] max-w-[16ch] font-display text-[30px] font-medium leading-[1.04] tracking-[-0.02em] text-ink md:mt-5.5 md:text-[54px] md:leading-tight md:tracking-tight">
            <EditableText path="consultation.headingLead" value={c.headingLead} as="span" />{" "}
            <span className="italic text-terracotta">
              <EditableText path="consultation.headingEmph" value={c.headingEmph} as="span" />
            </span>
          </h2>
          <p className="mx-auto mt-4 hidden max-w-[50ch] text-[18px] leading-relaxed text-body md:mt-5.5 md:block">
            <EditableText path="consultation.body" value={c.body} as="span" multiline />
          </p>
        </div>

        <div className="mt-5 grid items-start gap-6 md:mt-18 md:grid-cols-[1.05fr_1fr] md:gap-13">
          <div className="overflow-hidden rounded-[18px] border border-ink/[0.08] border-t-[3px] border-t-terracotta bg-cream shadow-[0_18px_40px_rgba(46,33,27,0.12)] md:border-t-4 md:shadow-[0_24px_50px_rgba(46,33,27,0.14)]">
            <div className="border-b border-dashed border-ink/[0.16] px-[22px] pb-4 pt-5 md:px-10 md:pb-6 md:pt-7">
              <div className="flex items-baseline justify-between gap-4">
                <div className="font-display text-[22px] font-medium text-ink md:text-[32px]">
                  <EditableText path="consultation.cardTitle" value={c.cardTitle} as="span" />
                </div>
                <div className="font-display text-[30px] font-semibold leading-none text-terracotta md:text-[52px]">
                  <EditableText path="consultation.cardPrice" value={c.cardPrice} as="span" />
                </div>
              </div>
              <div className="mt-0.5 text-xs text-[#8a7a6c] md:mt-1.5 md:text-sm md:text-muted">
                <EditableText path="consultation.cardMeta" value={c.cardMeta} as="span" />
              </div>
            </div>
            <div className="px-[22px] pb-5 pt-4 md:px-10 md:pb-9.5 md:pt-6">
              <div className="mb-3 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#9a8b7a] md:mb-4.5 md:text-[11px] md:tracking-[0.16em] md:text-muted">
                <EditableText path="consultation.givesLabel" value={c.givesLabel} as="span" />
              </div>
              <div className="flex flex-col gap-2.5 md:gap-3.75">
                {c.gives.map((g, i) => (
                  <div key={i} className="flex items-start gap-[11px] md:gap-3.5">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#7C8A5E] text-[11px] text-cream md:h-6 md:w-6 md:text-[13px]">
                      ✓
                    </span>
                    <span className="text-[13.5px] leading-[1.45] text-[#4a3f36] md:text-[16px] md:leading-snug">
                      <EditableText path={`consultation.gives.${i}`} value={g} as="span" />
                    </span>
                  </div>
                ))}
              </div>

              {/* Desktop CTA stays in-card */}
              <Link
                href={c.ctaHref}
                className="mt-7 hidden items-center justify-center gap-2.25 rounded-lg bg-terracotta py-4.25 text-[16px] font-semibold text-cream no-underline shadow-[0_14px_30px_rgba(181,87,47,0.32)] hover:bg-terracotta-hover md:flex"
              >
                <EditableText path="consultation.ctaDesktop" value={c.ctaDesktop} as="span" />
              </Link>
              <div className="mt-4 hidden items-center justify-center gap-2.75 md:flex">
                <span className="text-sm tracking-[2px] text-gold-deep">★★★★★</span>
                <span className="text-[13px] text-body-soft">
                  <EditableText path="consultation.ratingLine" value={c.ratingLine} as="span" />
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 text-center text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#9a8b7a] md:mb-4 md:text-left md:text-[11px] md:text-muted">
              <EditableText path="consultation.objectionsLabel" value={c.objectionsLabel} as="span" />
            </div>
            <div className="flex flex-col gap-2.5 md:gap-3.5">
              {c.objections.map((o, i) => (
                <div
                  key={i}
                  className="rounded-[13px] border border-ink/[0.08] bg-cream px-4 py-[15px] md:rounded-[14px] md:p-5.5 md:shadow-[0_10px_26px_rgba(46,33,27,0.07)]"
                >
                  <div className="font-display text-[15px] font-medium text-ink md:text-[20px]">
                    <EditableText path={`consultation.objections.${i}.q`} value={o.q} as="span" />
                  </div>
                  <div className="mt-[5px] text-[12.5px] leading-[1.5] text-body-soft md:mt-2 md:text-[14.5px] md:leading-relaxed">
                    <EditableText path={`consultation.objections.${i}.a`} value={o.a} as="span" multiline />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-[22px] flex items-center justify-center gap-[11px] md:hidden">
          <span className="text-[13px] tracking-[2px] text-gold-deep">★★★★★</span>
          <span className="text-xs text-body-soft">
            <EditableText path="consultation.ratingLine" value={c.ratingLine} as="span" />
          </span>
        </div>

        <div className="mt-11 hidden text-center font-hand text-[30px] text-terracotta md:mt-16 md:block">
          <EditableText path="consultation.closing" value={c.closing} as="span" />
        </div>
      </div>

      {/* Mobile sticky CTA — dump §07 */}
      <div
        className="sticky bottom-0 z-20 px-[22px] pb-6 pt-3 md:hidden"
        style={{ background: "linear-gradient(180deg, rgba(236,227,210,0) 0%, #ECE3D2 28%)" }}
      >
        <Link
          href={c.ctaHref}
          className="block rounded-[10px] bg-terracotta py-4 text-center text-base font-semibold text-cream no-underline shadow-[0_12px_26px_rgba(181,87,47,0.4)] hover:bg-terracotta-hover"
        >
          <EditableText path="consultation.ctaMobile" value={c.ctaMobile} as="span" />
        </Link>
        <div className="mt-[5px] text-center font-hand text-[19px] text-terracotta">
          <EditableText path="consultation.closing" value={c.closing} as="span" />
        </div>
      </div>
    </section>
  );
}
