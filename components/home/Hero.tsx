import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-ink font-sans">
      <div className="absolute inset-0">
        <Image src="/images/hero-portrait.png" alt="" fill priority className="object-cover object-[76%_center]" />
      </div>
      <div
        className="pointer-events-none absolute -top-45 -right-15 h-[820px] w-[820px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.30), rgba(176,138,62,0) 62%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-60 left-20 h-[680px] w-[680px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(181,87,47,0.18), rgba(181,87,47,0) 64%)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(46,33,27,0.97) 20%, rgba(46,33,27,0.82) 46%, rgba(46,33,27,0.4) 72%, rgba(46,33,27,0.06) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(125% 105% at 74% 42%, transparent 38%, rgba(18,11,7,0.58) 100%)" }}
      />
      <div className="grain-overlay pointer-events-none opacity-60 mix-blend-overlay" />

      <div className="pointer-events-none absolute inset-[22px] z-[3] hidden border border-[rgba(207,168,90,0.42)] sm:block" />
      <div className="pointer-events-none absolute left-[34px] top-1/2 z-[3] hidden -translate-y-1/2 rotate-180 text-[11px] tracking-[0.34em] uppercase text-gold-deep [writing-mode:vertical-rl] md:block">
        Est. Atlanta · Virtual Nationwide
      </div>

      <div className="relative z-[2] flex min-h-screen flex-col">
        <header className="flex flex-wrap items-center justify-between gap-6 border-b border-[rgba(230,221,209,0.14)] px-6 py-6.5 sm:px-10 md:px-[clamp(40px,6vw,92px)]">
          <Image
            src="/images/nina-ross-logo-cream.png"
            alt="Nina Ross Functional Medicine, Atlanta"
            width={220}
            height={62}
            className="h-[48px] w-auto sm:h-[56px] md:h-[62px]"
            priority
          />
          <div className="flex items-center gap-7.5">
            <nav className="hidden items-center gap-6.5 md:flex">
              <Link href="/approach" className="text-[13px] tracking-[0.03em] text-[#d9ccbe] no-underline hover:text-white">
                Our Approach
              </Link>
              <Link href="/treatments/advanced-lab-testing" className="text-[13px] tracking-[0.03em] text-[#d9ccbe] no-underline hover:text-white">
                Advanced Testing
              </Link>
              <Link href="/about" className="text-[13px] tracking-[0.03em] text-[#d9ccbe] no-underline hover:text-white">
                Dr. Nina
              </Link>
              <Link href="#patient-stories" className="text-[13px] tracking-[0.03em] text-[#d9ccbe] no-underline hover:text-white">
                Stories
              </Link>
            </nav>
            <span className="hidden h-4.5 w-px bg-[rgba(230,221,209,0.22)] md:block" />
            <Link
              href="/start"
              className="rounded-[4px] border border-[rgba(230,221,209,0.4)] px-5 py-2.5 text-[13px] font-semibold text-cream-deep no-underline hover:border-gold hover:text-white"
            >
              Start · $99
            </Link>
          </div>
        </header>

        <div className="flex flex-1 items-center px-6 py-10 sm:px-10 sm:py-16 md:px-[clamp(40px,6vw,92px)] md:py-20">
          <div className="max-w-[720px]">
            <div className="mb-6 flex items-center gap-3.5">
              <span className="font-display text-sm italic text-gold" style={{ letterSpacing: "0.08em" }}>01</span>
              <span className="h-px w-11 bg-gold opacity-65" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-[#b6a796]">Where it begins</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="block h-[1.5px] w-7.5 bg-gold" />
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-gold">
                Physician-led functional medicine in Atlanta · virtual care nationwide
              </span>
            </div>
            <h1 className="mt-6 font-display text-[42px] font-medium leading-[1.0] tracking-tight text-cream-deep sm:text-[60px] md:text-[80px]">
              You don&rsquo;t feel like yourself. Let&rsquo;s find out why.
            </h1>
            <p className="mt-5.5 font-display text-[20px] font-medium italic leading-snug text-gold sm:text-[26px]">
              Your body has been telling the truth.
            </p>
            <p className="mt-5.5 max-w-[31em] text-[17px] leading-relaxed text-[#d9ccbe]">
              Maybe it started with fatigue, or fog, or weight that won&rsquo;t move. Maybe your sleep fell apart, or
              your body stopped responding to what always worked. Maybe you haven&rsquo;t gone in yet, or maybe when
              you did, you heard &ldquo;your labs are normal.&rdquo; Either way, you know something changed. This is
              where the real investigation begins.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href="/start"
                className="rounded-[5px] bg-terracotta px-7.5 py-4 text-[15.5px] font-semibold text-cream no-underline shadow-[0_12px_30px_rgba(181,87,47,0.4)] hover:bg-terracotta-hover"
              >
                Start with the $99 Consultation
              </Link>
              <Link
                href="/conditions"
                className="border-b-[1.5px] border-[rgba(232,220,203,0.35)] pb-0.5 text-[14.5px] font-medium text-[#e8dccb] no-underline hover:border-gold hover:text-white"
              >
                Not sure yet? See what standard labs may be missing →
              </Link>
            </div>
            <div className="mt-7.5 flex flex-wrap items-center gap-3.5">
              <span className="text-base tracking-[1px] text-gold">★★★★★</span>
              <span className="text-sm text-cream-deep">
                <strong className="font-bold">4.9</strong> <span className="text-[#b6a796]">· 300+ reviews</span>
              </span>
              <span className="h-3.5 w-px bg-[rgba(230,221,209,0.25)]" />
              <span className="font-display text-[15.5px] italic text-[#e0d4c5]">People travel to Atlanta for Dr. Nina.</span>
            </div>
            <div className="mt-5.5 flex max-w-[540px] flex-wrap gap-2.25">
              {["Physician-led", "Advanced testing", "Optimal ranges", "Personalized plans", "Re-test & track"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[rgba(230,221,209,0.24)] bg-white/[0.04] px-3.5 py-1.75 text-[12.5px] text-[#e0d4c5]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-6 z-[4] hidden items-center gap-3 sm:left-10 md:left-[clamp(40px,6vw,92px)] md:flex">
        <span className="text-[10.5px] tracking-[0.26em] uppercase text-[#b6a796]">Scroll to begin</span>
        <span className="h-px w-13 bg-gradient-to-r from-gold to-transparent" />
      </div>

      <div className="absolute bottom-10 right-7 z-[4] hidden max-w-64 rounded-[4px] border border-[rgba(230,221,209,0.12)] border-t-2 border-t-gold bg-[rgba(28,19,14,0.55)] px-5.5 py-4.5 backdrop-blur-md sm:right-14 sm:block">
        <div className="flex items-center gap-2.75">
          <div className="relative h-11.5 w-11.5 flex-none overflow-hidden rounded-full border border-[rgba(207,168,90,0.55)]">
            <Image src="/images/dr-nina.jpg" alt="" fill className="object-cover object-[50%_20%]" />
          </div>
          <div>
            <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold">The promise</div>
            <div className="mt-0.5 text-[11px] text-[#d9ccbe]">Nina Ross, ND; Ph.D</div>
          </div>
        </div>
        <div className="mt-3.25 font-display text-[19px] italic leading-snug text-cream-deep">
          The relationship is part of the medicine.
        </div>
      </div>
    </section>
  );
}
