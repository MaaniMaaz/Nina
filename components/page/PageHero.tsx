import Link from "next/link";
import ImageSlot from "@/components/ui/ImageSlot";
import type { HeroContent } from "@/content/types";

export default function PageHero({ hero }: { hero: HeroContent }) {
  return (
    <section className="px-6 pb-14 pt-10 sm:px-10 sm:pb-22 sm:pt-16 md:pt-16">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-7 text-xs text-muted">
          <Link href="/" className="text-muted no-underline hover:text-body">
            Home
          </Link>
          {hero.breadcrumbParentHref && hero.breadcrumbParentLabel && (
            <>
              <span className="mx-2">/</span>
              <Link href={hero.breadcrumbParentHref} className="text-muted no-underline hover:text-body">
                {hero.breadcrumbParentLabel}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-body">{hero.breadcrumbLabel}</span>
        </nav>
        <div className="grid items-center gap-9 sm:grid-cols-[1.05fr_0.95fr] md:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cream-deep px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5a7d4f]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4a6340]">
                {hero.eyebrow}
              </span>
            </div>
            <h1 className="mt-5.5 font-display text-[40px] font-medium leading-[1.02] tracking-tight text-ink sm:text-[52px] md:text-[62px]">
              {hero.heading}
            </h1>
            {hero.paragraphs.map((p, i) => (
              <p
                key={p}
                className={`mt-5 max-w-[33em] text-[16px] leading-relaxed sm:text-[17px] ${
                  i === 0 ? "text-body" : "text-body-soft"
                }`}
              >
                {p}
              </p>
            ))}
            <div className="mt-7.5 flex flex-wrap items-center gap-4">
              <Link
                href="/start"
                className="rounded-md bg-gold px-7 py-4 text-[15px] font-semibold text-ink shadow-[0_12px_28px_rgba(233,180,90,0.36)] no-underline transition-colors hover:bg-gold-hover"
              >
                {hero.ctaLabel ?? "Book the $99 Symptom Consultation"}
              </Link>
              {hero.secondaryLabel && hero.secondaryHref && (
                <Link
                  href={hero.secondaryHref}
                  className="border-b-[1.5px] border-body/30 pb-0.5 text-sm font-medium text-body no-underline hover:border-terracotta hover:text-ink"
                >
                  {hero.secondaryLabel}
                </Link>
              )}
            </div>
            <div className="mt-6.5 flex max-w-[33em] items-center gap-2.5 rounded-xl bg-cream-deep px-4 py-3.5">
              <ImageSlot id={hero.bylineAvatarSlotId} alt="Dr. Nina Ross, ND PhD" shape="circle" className="h-10 w-10 flex-none" />
              <span className="text-xs leading-snug text-body-soft">
                Medically reviewed by{" "}
                <Link href="/about" className="font-bold text-ink no-underline">
                  Dr. Nina Ross, ND PhD
                </Link>{" "}
                · Board-Certified in Holistic Health &amp; Trichology · Reviewed {hero.reviewedDate ?? "Jun 2026"}
              </span>
            </div>
          </div>
          <div>
            <div className="relative overflow-hidden rounded-[22px] shadow-[0_30px_60px_rgba(46,33,27,0.2)]">
              <ImageSlot
                id={hero.imageSlotId}
                alt={hero.imageAlt ?? hero.heading}
                placeholder="Hero image"
                className="h-[400px] w-full sm:h-[540px]"
                priority
              />
              <div className="absolute bottom-4.5 left-4.5 inline-flex items-center gap-2 rounded-full bg-[#0d0b0a]/62 px-4 py-2.5 backdrop-blur-sm">
                <span className="h-[7px] w-[7px] rounded-full bg-gold" />
                <span className="text-[11.5px] font-semibold text-cream-deep">Real care, in Atlanta &amp; virtual</span>
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
      </div>
    </section>
  );
}
