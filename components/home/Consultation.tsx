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

export default function Consultation() {
  return (
    <section className="relative overflow-hidden bg-sand-deep px-6 py-21 sm:px-10 sm:py-26 md:px-[clamp(40px,6vw,120px)] md:py-39">
      <div className="grain-overlay opacity-45 mix-blend-multiply" />
      <div
        className="pointer-events-none absolute -top-50 left-1/2 h-135 w-205 -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.12), rgba(176,138,62,0) 68%)" }}
      />
      <div className="relative z-[1] mx-auto max-w-295">
        <div className="mx-auto max-w-205 text-center">
          <div className="relative mx-auto mb-5.5 h-23 w-23 overflow-hidden rounded-full border border-gold-deep/60 shadow-[0_14px_30px_rgba(46,33,27,0.16)]">
            <Image src="/images/dr-nina.jpg" alt="Dr. Nina Ross, ND PhD" fill className="object-cover object-[50%_16%]" />
          </div>
          <div className="flex items-center justify-center gap-3.25">
            <span className="font-display text-sm italic text-terracotta">07</span>
            <span className="h-px w-9 bg-gold-deep" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-terracotta">Your path forward</span>
            <span className="h-px w-9 bg-gold-deep" />
          </div>
          <h2 className="mx-auto mt-5.5 max-w-[16ch] font-display text-[36px] font-medium leading-tight tracking-tight text-ink sm:text-[46px] md:text-[54px]">
            One step to <span className="italic text-terracotta">begin.</span>
          </h2>
          <p className="mx-auto mt-5.5 max-w-[50ch] text-[15px] leading-relaxed text-body sm:text-[18px]">
            It starts with one conversation. Sit down with Dr. Nina, tell her the whole story, and leave with a
            clear sense of what&rsquo;s really going on.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-8 sm:mt-18 md:grid-cols-[1.05fr_1fr] md:gap-13">
          <div className="overflow-hidden rounded-[18px] border border-ink/[0.08] border-t-4 border-t-terracotta bg-cream shadow-[0_24px_50px_rgba(46,33,27,0.14)]">
            <div className="border-b border-dashed border-ink/[0.16] px-7 pb-6 pt-7 sm:px-10">
              <div className="flex items-baseline justify-between gap-4">
                <div className="font-display text-[26px] font-medium text-ink sm:text-[32px]">The Consultation</div>
                <div className="font-display text-[42px] font-semibold leading-none text-terracotta sm:text-[52px]">$99</div>
              </div>
              <div className="mt-1.5 text-sm text-muted">A half hour with our team · Atlanta or virtual</div>
            </div>
            <div className="px-7 pb-9.5 pt-6 sm:px-10">
              <div className="mb-4.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-muted">
                What this half hour gives you
              </div>
              <div className="flex flex-col gap-3.75">
                {GIVES.map((g) => (
                  <div key={g} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#7C8A5E] text-[13px] text-cream">✓</span>
                    <span className="text-[16px] leading-snug text-[#4a3f36]">{g}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/start"
                className="mt-7 flex items-center justify-center gap-2.25 rounded-lg bg-terracotta py-4.25 text-[16px] font-semibold text-cream no-underline shadow-[0_14px_30px_rgba(181,87,47,0.32)] hover:bg-terracotta-hover"
              >
                Start with the $99 consultation <span className="text-[17px]">→</span>
              </Link>
              <div className="mt-4 flex items-center justify-center gap-2.75">
                <span className="text-sm tracking-[2px] text-gold-deep">★★★★★</span>
                <span className="text-[13px] text-body-soft">
                  <strong>4.9</strong> · 300+ patients · self-pay, transparent from day one
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4 text-[11px] font-semibold tracking-[0.16em] uppercase text-muted">Before you book</div>
            <div className="flex flex-col gap-3.5">
              {OBJECTIONS.map((o) => (
                <div key={o.q} className="rounded-[14px] border border-ink/[0.08] bg-cream p-5.5 shadow-[0_10px_26px_rgba(46,33,27,0.07)]">
                  <div className="font-display text-[18px] font-medium text-ink sm:text-[20px]">{o.q}</div>
                  <div className="mt-2 text-[14.5px] leading-relaxed text-body-soft">{o.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-11 text-center font-[Caveat,cursive] text-[26px] text-terracotta sm:mt-16 sm:text-[30px]">
          Let&rsquo;s find your why, together.
        </div>
      </div>
    </section>
  );
}
