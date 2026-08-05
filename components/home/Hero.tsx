"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MobileNavOverlay, { MobileMenuButton } from "@/components/layout/MobileNavOverlay";
import MegaMenuPanel, { type MegaKey } from "@/components/layout/MegaMenuPanel";
import SiteNav from "@/components/layout/SiteNav";

/**
 * Mobile = Nina Ross FM Homepage - Mobile.dc.html §01 (cinematic overlay + sticky CTA).
 * Desktop keeps the full editorial hero.
 */
export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mega, setMega] = useState<MegaKey | null>(null);

  return (
    <>
      {/* ─── MOBILE HERO (dump §01) ─── */}
      <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink font-sans md:hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-portrait-mobile.png"
            alt=""
            fill
            priority
            className="object-cover object-[50%_center]"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(46,33,27,0.28) 0%, rgba(46,33,27,0.05) 24%, rgba(46,33,27,0.5) 56%, rgba(46,33,27,0.94) 82%, #2E211B 100%)",
          }}
        />
        <div className="grain-overlay pointer-events-none opacity-50 mix-blend-overlay" style={{ backgroundSize: "180px" }} />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[14] h-16"
          style={{ background: "linear-gradient(180deg, rgba(18,11,7,0.5), transparent)" }}
        />

        {/* App bar — logo + hamburger only */}
        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 pt-4">
          <Image
            src="/images/nina-ross-logo-cream.png"
            alt="Nina Ross Functional Medicine, Atlanta"
            width={160}
            height={32}
            className="h-8 w-auto"
            priority
          />
          <MobileMenuButton light onClick={() => setMenuOpen(true)} />
        </header>

        {/* Bottom-anchored copy */}
        <div className="absolute inset-x-0 bottom-[132px] z-20 px-6">
          <div className="mb-3.5 flex items-center gap-[9px]">
            <span className="block h-[1.5px] w-[22px] bg-gold-deep" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-deep">
              Physician-led · Atlanta &amp; virtual
            </span>
          </div>
          <h1 className="font-display text-[38px] font-medium leading-[1.02] tracking-[-0.02em] text-cream-deep">
            You don&rsquo;t feel like yourself. Let&rsquo;s find out why.
          </h1>
          <p className="mt-4 font-display text-[18px] font-medium italic leading-[1.3] text-gold-deep">
            Your body has been telling the truth.
          </p>
          <div className="mt-[18px] flex flex-wrap items-center gap-2.5">
            <span className="text-sm tracking-[1px] text-gold-deep">★★★★★</span>
            <span className="text-[12.5px] text-cream-deep">
              <strong className="font-bold">4.9</strong> <span className="text-[#b6a796]">· 300+ reviews</span>
            </span>
            <span className="h-3 w-px bg-[rgba(230,221,209,0.25)]" />
            <span className="font-display text-[13px] italic text-[#e0d4c5]">Patients travel for Dr. Nina.</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-[7px]">
            {["Advanced testing", "Optimal ranges", "Re-test & track"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[rgba(230,221,209,0.26)] bg-white/[0.05] px-[11px] py-1.5 text-[10.5px] text-[#e0d4c5]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Sticky CTA bar */}
        <div
          className="absolute inset-x-0 bottom-0 z-30 border-t border-[rgba(207,168,90,0.28)] px-5 pb-6 pt-3.5 backdrop-blur-[4px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(34,24,18,0) 0%, rgba(34,24,18,0.86) 26%, rgba(34,24,18,0.98) 100%)",
          }}
        >
          <Link
            href="/start"
            className="block rounded-lg bg-terracotta py-[15px] text-center text-[15px] font-semibold text-cream no-underline shadow-[0_8px_22px_rgba(181,87,47,0.4)]"
          >
            Start with the $99 Consultation
          </Link>
          <div className="mt-[9px] text-center">
            <Link href="/conditions" className="text-xs text-[#d9ccbe] no-underline">
              Not sure yet? See what standard labs may miss →
            </Link>
          </div>
        </div>

        <MobileNavOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      </section>

      {/* ─── DESKTOP HERO ─── */}
      <section className="relative hidden min-h-screen bg-ink font-sans md:block">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image
            src="/images/hero-portrait.png"
            alt=""
            fill
            priority
            className="object-cover object-[76%_center]"
          />
          <div
            className="absolute -top-45 -right-15 h-[820px] w-[820px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(176,138,62,0.30), rgba(176,138,62,0) 62%)" }}
          />
          <div
            className="absolute -bottom-60 left-20 h-[680px] w-[680px] rounded-full"
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
            className="absolute inset-0"
            style={{ background: "radial-gradient(125% 105% at 74% 42%, transparent 38%, rgba(18,11,7,0.58) 100%)" }}
          />
          <div className="grain-overlay opacity-60 mix-blend-overlay" />
          <div className="absolute inset-[22px] border border-[rgba(207,168,90,0.42)]" />
          <div className="absolute left-[34px] top-1/2 -translate-y-1/2 rotate-180 text-[11px] tracking-[0.34em] uppercase text-gold-deep [writing-mode:vertical-rl]">
            Est. Atlanta · Virtual Nationwide
          </div>
        </div>

        <div className="relative z-[2] flex min-h-screen flex-col">
          <div className="relative z-30">
            <header
              className={`flex items-center justify-between gap-4 px-[clamp(24px,4vw,92px)] py-5 xl:py-6.5 ${
                mega
                  ? "border-b border-[#f3ebde] bg-[#f3ebde]"
                  : "border-b border-[rgba(230,221,209,0.14)] bg-transparent"
              }`}
            >
              <div className="relative shrink-0">
                <Image
                  src="/images/nina-ross-logo-cream.png"
                  alt="Nina Ross Functional Medicine, Atlanta"
                  width={220}
                  height={62}
                  className={`h-11 w-auto xl:h-[62px] ${mega ? "invisible absolute" : ""}`}
                  priority
                />
                <Image
                  src="/images/nina-ross-logo-dark.png"
                  alt=""
                  aria-hidden
                  width={220}
                  height={62}
                  className={`h-11 w-auto xl:h-[62px] ${mega ? "" : "invisible absolute"}`}
                  priority
                />
              </div>
              <SiteNav mega={mega} onMegaChange={setMega} variant="hero" />
            </header>
            {mega && (
              <MegaMenuPanel
                mega={mega}
                onClose={() => setMega(null)}
                overlay
              />
            )}
          </div>

          <div className="flex flex-1 items-center px-[clamp(40px,6vw,92px)] py-20" onClick={() => setMega(null)}>
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
              <h1 className="mt-6 font-display text-[80px] font-medium leading-[1.0] tracking-tight text-cream-deep">
                You don&rsquo;t feel like yourself. Let&rsquo;s find out why.
              </h1>
              <p className="mt-5.5 font-display text-[26px] font-medium italic leading-snug text-gold">
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

        <div className="absolute bottom-10 left-[clamp(40px,6vw,92px)] z-[4] flex items-center gap-3">
          <span className="text-[10.5px] tracking-[0.26em] uppercase text-[#b6a796]">Scroll to begin</span>
          <span className="h-px w-13 bg-gradient-to-r from-gold to-transparent" />
        </div>

        <div className="absolute bottom-10 right-14 z-[4] max-w-64 rounded-[4px] border border-[rgba(230,221,209,0.12)] border-t-2 border-t-gold bg-[rgba(28,19,14,0.55)] px-5.5 py-4.5 backdrop-blur-md">
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
    </>
  );
}
