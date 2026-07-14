import Image from "next/image";
import Link from "next/link";

const COMPANY_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "About Dr. Nina", href: "/about" },
  { label: "Conditions We Treat", href: "/conditions" },
  { label: "How We Help", href: "/treatments" },
];

const GETTING_STARTED_LINKS = [
  { label: "Book In-Person", href: "/start" },
  { label: "Book Virtual", href: "/start" },
  { label: "The $99 Consult", href: "/start" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink px-6 py-14 sm:px-10 sm:py-16 md:px-[clamp(40px,6vw,92px)]">
      <div className="grain-overlay opacity-30 mix-blend-overlay" />
      <div
        className="pointer-events-none absolute -right-28 -top-44 h-[420px] w-[560px] rounded-full opacity-70"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.16), rgba(176,138,62,0) 68%)" }}
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1.1fr] md:gap-14">
          <div>
            <Image
              src="/images/nina-ross-logo-cream.png"
              alt="Nina Ross Functional Medicine, Atlanta"
              height={48}
              width={220}
              className="h-11 w-auto"
            />
            <p className="mt-5.5 max-w-[18ch] font-display text-[22px] italic leading-snug text-cream-deep">
              Your symptoms are telling a deeper story.
            </p>
            <Link
              href="/start"
              className="mt-6 inline-flex items-center gap-2.5 rounded-md bg-gold px-6.5 py-3.75 text-[15px] font-semibold text-ink no-underline hover:bg-gold-hover"
            >
              Book the $99 Symptom Consult <span aria-hidden>→</span>
            </Link>
          </div>

          <div>
            <div className="mb-4.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
              The Company
            </div>
            <div className="flex flex-col gap-3.25">
              {COMPANY_LINKS.map((link) => (
                <Link key={link.label} href={link.href} className="text-[15px] text-[#d8cab8] no-underline hover:text-cream-deep">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
              Getting Started
            </div>
            <div className="flex flex-col gap-3.25">
              {GETTING_STARTED_LINKS.map((link) => (
                <Link key={link.label} href={link.href} className="text-[15px] text-[#d8cab8] no-underline hover:text-cream-deep">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
              Visit &amp; contact
            </div>
            <address className="text-[14.5px] leading-[1.75] text-[#b6a796] not-italic">
              8735 Dunwoody Place, Ste. O
              <br />
              Atlanta, GA 30350
              <br />
              <a href="tel:+16785614522" className="text-[#e0d4c5] no-underline hover:text-cream-deep">
                +1 678-561-4522
              </a>
              <br />
              Mon–Sat · 10am–4pm
            </address>
            <div className="mt-5 flex gap-2.75">
              {["Instagram", "Facebook", "YouTube"].map((label) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-deep/20 hover:border-cream-deep/50"
                >
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-cream-deep/[0.14] pt-6.5">
          <p className="max-w-[70ch] text-[12.5px] leading-relaxed text-[#7a6c5d]">
            © 2026 Nina Ross Functional Medicine · NPI 1164884078. This site is for educational purposes and is
            not a substitute for medical advice.
          </p>
          <div className="flex gap-5.5">
            <Link href="/terms" className="text-[12.5px] text-[#9a8b7a] no-underline hover:text-[#d8cab8]">
              Terms
            </Link>
            <Link href="/privacy" className="text-[12.5px] text-[#9a8b7a] no-underline hover:text-[#d8cab8]">
              Privacy
            </Link>
            <Link href="/accessibility" className="text-[12.5px] text-[#9a8b7a] no-underline hover:text-[#d8cab8]">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
