import Image from "next/image";
import Link from "next/link";

const GIVES = [
  "Your full history, heard without rushing",
  "Dr. Nina\u2019s first read on what\u2019s driving it",
  "A clear picture of what working together looks like",
];

const OBJECTIONS = [
  {
    q: "Do I need labs done before the consult?",
    a: "If you have recent labs, bring them and we\u2019ll read them together. If you don\u2019t, no worries at all \u2014 we\u2019ll guide you on exactly what to test from here.",
  },
  {
    q: "What if my labs are \u201Cnormal\u201D?",
    a: "That\u2019s exactly when this matters most. We read for optimal, not just \u201Cnot diseased.\u201D",
  },
  {
    q: "Do I have to commit to anything?",
    a: "The consult stands on its own. Where you go next is always your call.",
  },
];

/**
 * Mobile = dump §07: scrollable body + sticky CTA bar.
 * Desktop keeps dual-column layout with in-card CTA.
 */
export default function Consultation() {
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
            <Image src="/images/dr-nina.jpg" alt="Dr. Nina Ross, ND PhD" fill className="object-cover object-[50%_16%]" />
          </div>
          <div className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-terracotta md:flex md:items-center md:justify-center md:gap-3.25 md:text-xs md:tracking-[0.2em]">
            <span className="hidden font-display text-sm italic text-terracotta md:inline">07</span>
            <span className="hidden h-px w-9 bg-gold-deep md:block" />
            Your path forward
            <span className="hidden h-px w-9 bg-gold-deep md:block" />
          </div>
          <h2 className="mx-auto mt-[9px] max-w-[16ch] font-display text-[30px] font-medium leading-[1.04] tracking-[-0.02em] text-ink md:mt-5.5 md:text-[54px] md:leading-tight md:tracking-tight">
            One step to <span className="italic text-terracotta">begin.</span>
          </h2>
          <p className="mx-auto mt-4 hidden max-w-[50ch] text-[18px] leading-relaxed text-body md:mt-5.5 md:block">
            It starts with one conversation. Sit down with Dr. Nina, tell her the whole story, and leave with a clear
            sense of what&rsquo;s really going on.
          </p>
        </div>

        <div className="mt-5 grid items-start gap-6 md:mt-18 md:grid-cols-[1.05fr_1fr] md:gap-13">
          <div className="overflow-hidden rounded-[18px] border border-ink/[0.08] border-t-[3px] border-t-terracotta bg-cream shadow-[0_18px_40px_rgba(46,33,27,0.12)] md:border-t-4 md:shadow-[0_24px_50px_rgba(46,33,27,0.14)]">
            <div className="border-b border-dashed border-ink/[0.16] px-[22px] pb-4 pt-5 md:px-10 md:pb-6 md:pt-7">
              <div className="flex items-baseline justify-between gap-4">
                <div className="font-display text-[22px] font-medium text-ink md:text-[32px]">The Consultation</div>
                <div className="font-display text-[30px] font-semibold leading-none text-terracotta md:text-[52px]">$99</div>
              </div>
              <div className="mt-0.5 text-xs text-[#8a7a6c] md:mt-1.5 md:text-sm md:text-muted">
                A half hour with our team · Atlanta or virtual
              </div>
            </div>
            <div className="px-[22px] pb-5 pt-4 md:px-10 md:pb-9.5 md:pt-6">
              <div className="mb-3 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#9a8b7a] md:mb-4.5 md:text-[11px] md:tracking-[0.16em] md:text-muted">
                What this half hour gives you
              </div>
              <div className="flex flex-col gap-2.5 md:gap-3.75">
                {GIVES.map((g) => (
                  <div key={g} className="flex items-start gap-[11px] md:gap-3.5">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#7C8A5E] text-[11px] text-cream md:h-6 md:w-6 md:text-[13px]">
                      ✓
                    </span>
                    <span className="text-[13.5px] leading-[1.45] text-[#4a3f36] md:text-[16px] md:leading-snug">{g}</span>
                  </div>
                ))}
              </div>

              {/* Desktop CTA stays in-card */}
              <Link
                href="/start"
                className="mt-7 hidden items-center justify-center gap-2.25 rounded-lg bg-terracotta py-4.25 text-[16px] font-semibold text-cream no-underline shadow-[0_14px_30px_rgba(181,87,47,0.32)] hover:bg-terracotta-hover md:flex"
              >
                Start with the $99 consultation <span className="text-[17px]">→</span>
              </Link>
              <div className="mt-4 hidden items-center justify-center gap-2.75 md:flex">
                <span className="text-sm tracking-[2px] text-gold-deep">★★★★★</span>
                <span className="text-[13px] text-body-soft">
                  <strong>4.9</strong> · 300+ patients · self-pay, transparent from day one
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 text-center text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#9a8b7a] md:mb-4 md:text-left md:text-[11px] md:text-muted">
              Before you book
            </div>
            <div className="flex flex-col gap-2.5 md:gap-3.5">
              {OBJECTIONS.map((o) => (
                <div
                  key={o.q}
                  className="rounded-[13px] border border-ink/[0.08] bg-cream px-4 py-[15px] md:rounded-[14px] md:p-5.5 md:shadow-[0_10px_26px_rgba(46,33,27,0.07)]"
                >
                  <div className="font-display text-[15px] font-medium text-ink md:text-[20px]">{o.q}</div>
                  <div className="mt-[5px] text-[12.5px] leading-[1.5] text-body-soft md:mt-2 md:text-[14.5px] md:leading-relaxed">
                    {o.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-[22px] flex items-center justify-center gap-[11px] md:hidden">
          <span className="text-[13px] tracking-[2px] text-gold-deep">★★★★★</span>
          <span className="text-xs text-body-soft">
            <strong>4.9</strong> · 300+ patients · self-pay, transparent from day one
          </span>
        </div>

        <div className="mt-11 hidden text-center font-hand text-[30px] text-terracotta md:mt-16 md:block">
          Let&rsquo;s find your why, together.
        </div>
      </div>

      {/* Mobile sticky CTA — dump §07 */}
      <div
        className="sticky bottom-0 z-20 px-[22px] pb-6 pt-3 md:hidden"
        style={{ background: "linear-gradient(180deg, rgba(236,227,210,0) 0%, #ECE3D2 28%)" }}
      >
        <Link
          href="/start"
          className="block rounded-[10px] bg-terracotta py-4 text-center text-base font-semibold text-cream no-underline shadow-[0_12px_26px_rgba(181,87,47,0.4)] hover:bg-terracotta-hover"
        >
          Start with the $99 consultation
        </Link>
        <div className="mt-[5px] text-center font-hand text-[19px] text-terracotta">
          Let&rsquo;s find your why, together.
        </div>
      </div>
    </section>
  );
}
