"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialIcons from "@/components/layout/SocialIcons";

const SHELL_COMPANY = [
  { label: "Blog", href: "/blog" },
  { label: "FuncFactor Quiz", href: "/start" },
  { label: "About Dr. Nina", href: "/about" },
  { label: "Conditions We Treat", href: "/conditions" },
  { label: "How We Help", href: "/treatments" },
];

const SHELL_STARTED = [
  { label: "Book In-Person", href: "/start" },
  { label: "Book Virtual", href: "/start" },
  { label: "The $99 Consult", href: "/start" },
  { label: "Patient Stories", href: "/#patient-stories" },
];

const HOME_EXPLORE = [
  { label: "How It Works", href: "/#process" },
  { label: "The Toolkit", href: "/#toolkit" },
  { label: "The Program", href: "/#program" },
  { label: "Patient Stories", href: "/#patient-stories" },
  { label: "Learn & Answers", href: "/#learn" },
];

const HOME_VISIT = [
  { label: "Atlanta Studio", href: "/start" },
  { label: "Virtual Care", href: "/start" },
  { label: "New Patients", href: "/start" },
  { label: "Contact", href: "/about" },
];

/**
 * Shell footer on interior pages.
 * Homepage: hidden until unlocked — pass `variant="home"` from HomeInteractive after a prompt.
 */
export default function Footer({ variant }: { variant?: "home" | "shell" } = {}) {
  const pathname = usePathname();
  const isHome = variant === "home";

  // Layout footer stays off `/` until HomeInteractive mounts the home variant after unlock.
  // Exact `/blog` owns the handoff page footer. Admin CMS renders its own chrome.
  if ((pathname === "/" && !isHome) || pathname === "/blog" || pathname.startsWith("/nina/admin"))
    return null;

  const companyLinks = isHome ? HOME_EXPLORE : SHELL_COMPANY;
  const startedLinks = isHome ? HOME_VISIT : SHELL_STARTED;
  const companyLabel = isHome ? "Explore" : "The Company";
  const startedLabel = isHome ? "Visit" : "Getting Started";
  const tagline = isHome ? "Find your why. Feel like yourself again." : "Your symptoms are telling a deeper story.";
  const ctaLabel = isHome ? "Book your $99 consultation" : "Book the $99 Symptom Consult";
  const contactLabel = isHome ? "Get in touch" : "Visit & contact";

  return (
    <footer className="relative overflow-hidden bg-ink px-7 py-10 md:px-14 md:pb-[30px] md:pt-16">
      <div className="grain-overlay opacity-45 mix-blend-overlay" style={{ backgroundSize: "220px" }} />
      <div
        className="pointer-events-none absolute -right-[120px] -top-[180px] h-[520px] w-[760px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.13), rgba(176,138,62,0) 68%)" }}
      />
      <div className="relative mx-auto max-w-6xl">
        {/* Mobile */}
        <div className="md:hidden">
          <Image
            src="/images/nina-ross-logo-cream.png"
            alt="Nina Ross Functional Medicine, Atlanta"
            height={32}
            width={160}
            className="h-8 w-auto"
          />
          <p className="mt-4 max-w-[18ch] font-display text-[22px] italic leading-[1.22] text-cream-deep">
            {tagline}
          </p>
          <Link
            href="/start"
            className="mt-5 flex items-center justify-center gap-2 rounded-[10px] bg-gold px-4 py-3.5 text-sm font-semibold text-ink no-underline hover:bg-gold-hover"
          >
            {ctaLabel} <span aria-hidden>→</span>
          </Link>

          <div className="mt-[30px] grid grid-cols-2 gap-x-[18px] gap-y-6">
            <div>
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                {companyLabel}
              </div>
              <div className="flex flex-col gap-2.5">
                {companyLinks.slice(0, 3).map((link) => (
                  <Link key={link.label} href={link.href} className="text-sm text-[#d8cab8] no-underline hover:text-cream-deep">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                {startedLabel}
              </div>
              <div className="flex flex-col gap-2.5">
                {startedLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="text-sm text-[#d8cab8] no-underline hover:text-cream-deep">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-7 border-t border-cream-deep/[0.14] pt-[22px]">
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
              {isHome ? "Get in touch" : "Contact"}
            </div>
            <address className="text-[13.5px] leading-[1.7] text-[#b6a796] not-italic">
              {isHome ? (
                <>
                  Buckhead, Atlanta GA
                  <br />
                  <a href="tel:+16785614522" className="text-[#e0d4c5] no-underline hover:text-cream-deep">
                    678-561-4522
                  </a>
                  <br />
                  <a href="mailto:hello@ninarossfm.com" className="text-[#e0d4c5] no-underline hover:text-cream-deep">
                    hello@ninarossfm.com
                  </a>
                </>
              ) : (
                <>
                  8735 Dunwoody Place, Ste. O
                  <br />
                  Atlanta, GA 30350
                  <br />
                  <a href="tel:+16785614522" className="text-[#e0d4c5] no-underline hover:text-cream-deep">
                    +1 678-561-4522
                  </a>
                  <br />
                  Mon–Sat · 10am–4pm
                </>
              )}
            </address>
            <div className="mt-4">
              <SocialIcons size="sm" />
            </div>
          </div>

          <div className="mt-[26px] flex flex-wrap items-center gap-x-3.5 gap-y-1.5 border-t border-cream-deep/[0.14] pt-[18px]">
            <Link href="/terms" className="text-[11.5px] text-[#8d7e6e] no-underline hover:text-[#d8cab8]">
              Terms
            </Link>
            <Link href="/privacy" className="text-[11.5px] text-[#8d7e6e] no-underline hover:text-[#d8cab8]">
              Privacy
            </Link>
            <Link
              href="/notice-of-privacy-practices"
              className="text-[11.5px] text-[#8d7e6e] no-underline hover:text-[#d8cab8]"
            >
              Notice of Privacy Practices
            </Link>
            <span className="mt-1.5 w-full text-[11px] text-[#6f6253]">
              © 2026 Nina Ross Functional Medicine · NPI 1164884078
            </span>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1.1fr] gap-14">
            <div>
              <Image
                src="/images/nina-ross-logo-cream.png"
                alt="Nina Ross Functional Medicine, Atlanta"
                height={54}
                width={240}
                className="h-[54px] w-auto"
              />
              <p className="mt-[22px] max-w-[18ch] font-display text-[26px] italic leading-[1.22] text-cream-deep">
                {tagline}
              </p>
              <Link
                href="/start"
                className="mt-6 inline-flex items-center gap-2.5 rounded-md bg-gold px-[26px] py-[15px] text-[15px] font-semibold text-ink no-underline hover:bg-gold-hover"
              >
                {ctaLabel} <span aria-hidden>→</span>
              </Link>
            </div>

            <div>
              <div className="mb-[18px] text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                {companyLabel}
              </div>
              <div className="flex flex-col gap-[13px]">
                {companyLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="text-[15px] text-[#d8cab8] no-underline hover:text-cream-deep">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-[18px] text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                {startedLabel}
              </div>
              <div className="flex flex-col gap-[13px]">
                {startedLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="text-[15px] text-[#d8cab8] no-underline hover:text-cream-deep">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-[18px] text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                {contactLabel}
              </div>
              <address className="text-[14.5px] leading-[1.75] text-[#b6a796] not-italic">
                {isHome ? (
                  <>
                    Buckhead, Atlanta GA
                    <br />
                    <a href="tel:+16785614522" className="text-[#e0d4c5] no-underline hover:text-cream-deep">
                      678-561-4522
                    </a>
                    <br />
                    <a href="mailto:hello@ninarossfm.com" className="text-[#e0d4c5] no-underline hover:text-cream-deep">
                      hello@ninarossfm.com
                    </a>
                  </>
                ) : (
                  <>
                    8735 Dunwoody Place, Ste. O
                    <br />
                    Atlanta, GA 30350
                    <br />
                    <a href="tel:+16785614522" className="text-[#e0d4c5] no-underline hover:text-cream-deep">
                      +1 678-561-4522
                    </a>
                    <br />
                    Mon–Sat · 10am–4pm
                  </>
                )}
              </address>
              <div className="mt-5">
                <SocialIcons />
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-cream-deep/[0.14] pt-[26px]">
            <p className="max-w-[70ch] text-[12.5px] leading-relaxed text-[#7a6c5d]">
              © 2026 Nina Ross Functional Medicine · NPI 1164884078. This site is for educational purposes and is not a
              substitute for medical advice.
            </p>
            <div className="flex flex-wrap gap-x-[22px] gap-y-2">
              <Link href="/terms" className="text-[12.5px] text-[#9a8b7a] no-underline hover:text-[#d8cab8]">
                Terms
              </Link>
              <Link href="/privacy" className="text-[12.5px] text-[#9a8b7a] no-underline hover:text-[#d8cab8]">
                Privacy
              </Link>
              <Link
                href="/notice-of-privacy-practices"
                className="text-[12.5px] text-[#9a8b7a] no-underline hover:text-[#d8cab8]"
              >
                Notice of Privacy Practices
              </Link>
              <Link href="/accessibility" className="text-[12.5px] text-[#9a8b7a] no-underline hover:text-[#d8cab8]">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
