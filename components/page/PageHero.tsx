"use client";

import Link from "next/link";
import ImageSlot from "@/components/ui/ImageSlot";
import EditableText from "@/components/admin/EditableText";
import EditableImage from "@/components/admin/EditableImage";
import EditableLink from "@/components/admin/EditableLink";
import { getByPath, useEdit } from "@/components/admin/EditContext";
import type { HeroContent } from "@/content/types";

/**
 * Pixel-matched to Condition/Treatment/Positioning Full (Mobile) + Desktop dumps.
 * Supports CMS edit mode via EditableText / EditableImage / EditableLink.
 */
export default function PageHero({ hero }: { hero: HeroContent }) {
  const edit = useEdit();
  const [lead, ...rest] = hero.paragraphs;
  const E = edit?.enabled;
  const ctaHref =
    E && edit.content
      ? String(getByPath(edit.content, "hero.ctaHref") ?? hero.ctaHref ?? "/start")
      : (hero.ctaHref ?? "/start");
  const secondaryHref =
    E && edit.content
      ? String(getByPath(edit.content, "hero.secondaryHref") ?? hero.secondaryHref ?? "")
      : (hero.secondaryHref ?? "");
  const parentHref =
    E && edit.content
      ? String(
          getByPath(edit.content, "hero.breadcrumbParentHref") ??
            hero.breadcrumbParentHref ??
            "",
        )
      : (hero.breadcrumbParentHref ?? "");
  const ctaLabel = hero.ctaLabel ?? "Book the $99 Symptom Consultation";

  return (
    <section className="bg-cream px-6 pb-7 pt-6 md:px-10 md:pb-22 md:pt-16">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-3 text-[11px] text-muted md:mb-7 md:text-xs">
          <Link href="/" className="text-muted no-underline hover:text-body">
            Home
          </Link>
          {(parentHref || hero.breadcrumbParentLabel || E) && (
            <>
              <span className="mx-1.5">/</span>
              {parentHref && hero.breadcrumbParentLabel ? (
                <Link href={parentHref} className="text-muted no-underline hover:text-body">
                  {E ? (
                    <EditableText
                      path="hero.breadcrumbParentLabel"
                      value={hero.breadcrumbParentLabel}
                    />
                  ) : (
                    hero.breadcrumbParentLabel
                  )}
                </Link>
              ) : E ? (
                <span className="text-muted">
                  <EditableText
                    path="hero.breadcrumbParentLabel"
                    value={hero.breadcrumbParentLabel ?? "Parent"}
                  />
                </span>
              ) : null}
              {E ? (
                <EditableLink
                  path="hero.breadcrumbParentHref"
                  value={parentHref || "/conditions"}
                  label="Breadcrumb parent URL"
                />
              ) : null}
            </>
          )}
          <span className="mx-1.5">/</span>
          <span className="text-body">
            {E ? (
              <EditableText path="hero.breadcrumbLabel" value={hero.breadcrumbLabel} />
            ) : (
              hero.breadcrumbLabel
            )}
          </span>
        </nav>

        <div className="hidden items-center gap-16 md:grid md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cream-deep px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5a7d4f]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4a6340]">
                {E ? <EditableText path="hero.eyebrow" value={hero.eyebrow} /> : hero.eyebrow}
              </span>
            </div>
            <h1 className="mt-5.5 font-display text-[62px] font-medium leading-[1.02] tracking-tight text-ink">
              {E ? (
                <EditableText path="hero.heading" value={hero.heading} as="span" multiline />
              ) : (
                hero.heading
              )}
            </h1>
            {hero.paragraphs.map((p, i) => (
              <p
                key={i}
                className={`mt-5 max-w-[33em] text-[17px] leading-relaxed ${
                  i === 0 ? "text-body" : "text-body-soft"
                }`}
              >
                {E ? (
                  <EditableText path={`hero.paragraphs.${i}`} value={p} multiline />
                ) : (
                  p
                )}
              </p>
            ))}
            <div className="mt-7.5 flex flex-wrap items-center gap-4">
              <span className="inline-flex flex-col items-start gap-1">
                <Link
                  href={ctaHref || "/start"}
                  className="rounded-md bg-gold px-7 py-4 text-[15px] font-semibold text-ink shadow-[0_12px_28px_rgba(233,180,90,0.36)] no-underline transition-colors hover:bg-gold-hover"
                  onClick={E ? (e) => e.preventDefault() : undefined}
                >
                  {E ? (
                    <EditableText path="hero.ctaLabel" value={ctaLabel} />
                  ) : (
                    ctaLabel
                  )}
                </Link>
                {E ? (
                  <EditableLink path="hero.ctaHref" value={ctaHref || "/start"} label="Primary button URL" />
                ) : null}
              </span>
              {(hero.secondaryLabel || E) && (
                <span className="inline-flex flex-col items-start gap-1">
                  {secondaryHref || !E ? (
                    <Link
                      href={secondaryHref || "#"}
                      className="border-b-[1.5px] border-body/30 pb-0.5 text-sm font-medium text-body no-underline hover:border-terracotta hover:text-ink"
                      onClick={E ? (e) => e.preventDefault() : undefined}
                    >
                      {E ? (
                        <EditableText
                          path="hero.secondaryLabel"
                          value={hero.secondaryLabel ?? "Secondary link"}
                        />
                      ) : (
                        hero.secondaryLabel
                      )}
                    </Link>
                  ) : (
                    <span className="border-b-[1.5px] border-body/30 pb-0.5 text-sm font-medium text-body">
                      <EditableText
                        path="hero.secondaryLabel"
                        value={hero.secondaryLabel ?? "Secondary link"}
                      />
                    </span>
                  )}
                  {E ? (
                    <EditableLink
                      path="hero.secondaryHref"
                      value={secondaryHref || "/approach"}
                      label="Secondary link URL"
                    />
                  ) : null}
                </span>
              )}
            </div>
            <div className="mt-6.5 flex max-w-[33em] items-center gap-2.5 rounded-xl bg-cream-deep px-4 py-3.5">
              {E ? (
                <EditableImage
                  slotId={hero.bylineAvatarSlotId}
                  urlPath="hero.bylineAvatarUrl"
                  alt="Dr. Nina Ross, ND PhD"
                  shape="circle"
                  className="h-10 w-10 flex-none"
                />
              ) : (
                <ImageSlot
                  id={hero.bylineAvatarSlotId}
                  src={hero.bylineAvatarUrl}
                  alt="Dr. Nina Ross, ND PhD"
                  shape="circle"
                  className="h-10 w-10 flex-none"
                />
              )}
              <span className="text-xs leading-snug text-body-soft">
                Medically reviewed by{" "}
                <Link href="/about" className="font-bold text-ink no-underline">
                  Dr. Nina Ross, ND PhD
                </Link>{" "}
                · Board-Certified in Holistic Health &amp; Trichology · Reviewed{" "}
                {E ? (
                  <EditableText
                    path="hero.reviewedDate"
                    value={hero.reviewedDate ?? "Jun 2026"}
                  />
                ) : (
                  hero.reviewedDate ?? "Jun 2026"
                )}
              </span>
            </div>
          </div>
          <div>
            <div className="relative overflow-hidden rounded-[22px] shadow-[0_30px_60px_rgba(46,33,27,0.2)]">
              {E ? (
                <EditableImage
                  slotId={hero.imageSlotId}
                  urlPath="hero.imageUrl"
                  alt={hero.imageAlt ?? hero.heading}
                  placeholder="Hero image"
                  className="h-[540px] w-full"
                />
              ) : (
                <ImageSlot
                  id={hero.imageSlotId}
                  src={hero.imageUrl}
                  alt={hero.imageAlt ?? hero.heading}
                  placeholder="Hero image"
                  className="h-[540px] w-full"
                  priority
                />
              )}
              <div className="absolute bottom-4.5 left-4.5 inline-flex items-center gap-2 rounded-full bg-[#0d0b0a]/62 px-4 py-2.5 backdrop-blur-sm">
                <span className="h-[7px] w-[7px] rounded-full bg-gold" />
                <span className="text-[11.5px] font-semibold text-cream-deep">
                  Real care, in Atlanta &amp; virtual
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-stretch rounded-[14px] border border-ink/10 bg-cream py-4">
              <div className="flex-1 text-center">
                <div className="font-display text-2xl text-ink">4.9★</div>
                <div className="text-[10px] tracking-wide text-muted">300+ patients</div>
              </div>
              <div className="w-px bg-ink/10" />
              <div className="flex-1 text-center">
                <div className="font-display text-2xl text-ink">ND·PhD</div>
                <div className="text-[10px] tracking-wide text-muted">Dr. Nina Ross</div>
              </div>
              <div className="w-px bg-ink/10" />
              <div className="flex-1 text-center">
                <div className="font-display text-2xl text-ink">Self-pay</div>
                <div className="text-[10px] tracking-wide text-muted">No referral</div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <div className="inline-flex items-center gap-[7px] rounded-full border border-ink/10 bg-[#EFE7D7] px-[13px] py-[7px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5a7d4f]" />
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#4a6340]">
              {E ? <EditableText path="hero.eyebrow" value={hero.eyebrow} /> : hero.eyebrow}
            </span>
          </div>
          <h1 className="mt-4 font-display text-[33px] font-medium leading-[1.05] tracking-[-0.02em] text-ink">
            {E ? (
              <EditableText path="hero.heading" value={hero.heading} multiline />
            ) : (
              hero.heading
            )}
          </h1>
          {lead && (
            <p className="mt-[13px] text-sm leading-[1.58] text-body">
              {E ? (
                <EditableText path="hero.paragraphs.0" value={lead} multiline />
              ) : (
                lead
              )}
            </p>
          )}

          <div className="relative mt-[18px] overflow-hidden rounded-2xl shadow-[0_16px_34px_rgba(46,33,27,0.16)]">
            {E ? (
              <EditableImage
                slotId={hero.imageSlotId}
                urlPath="hero.imageUrl"
                alt={hero.imageAlt ?? hero.heading}
                placeholder="Hero image"
                className="h-[200px] w-full"
              />
            ) : (
              <ImageSlot
                id={hero.imageSlotId}
                src={hero.imageUrl}
                alt={hero.imageAlt ?? hero.heading}
                placeholder="Hero image"
                className="h-[200px] w-full"
                priority
              />
            )}
          </div>

          {rest.map((p, i) => (
            <p key={i} className="mt-[18px] text-sm leading-[1.58] text-body">
              {E ? (
                <EditableText path={`hero.paragraphs.${i + 1}`} value={p} multiline />
              ) : (
                p
              )}
            </p>
          ))}

          <span className="mt-[18px] block">
            <Link
              href={ctaHref || "/start"}
              className="block rounded-lg bg-gold py-[15px] text-center text-sm font-semibold text-ink no-underline"
              onClick={E ? (e) => e.preventDefault() : undefined}
            >
              {E ? <EditableText path="hero.ctaLabel" value={ctaLabel} /> : ctaLabel}
            </Link>
            {E ? (
              <EditableLink path="hero.ctaHref" value={ctaHref || "/start"} label="Primary button URL" />
            ) : null}
          </span>
        </div>
      </div>
    </section>
  );
}
