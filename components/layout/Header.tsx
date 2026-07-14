"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Our Approach", href: "/approach" },
  { label: "Treatments", href: "/treatments" },
  { label: "Conditions", href: "/conditions" },
  { label: "Dr. Nina", href: "/about" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/[0.08] bg-cream/88 backdrop-blur-md">
      <div className="flex items-center justify-between gap-6 px-6 py-3.5 sm:px-10 md:px-[clamp(40px,6vw,100px)]">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Image
            src="/images/nina-ross-logo-dark.png"
            alt="Nina Ross Functional Medicine, Atlanta"
            height={40}
            width={180}
            className="h-9 w-auto sm:h-11"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13.5px] tracking-[0.02em] text-body no-underline hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/start"
            className="rounded-[5px] bg-terracotta px-5.5 py-2.75 text-[13.5px] font-semibold text-cream no-underline hover:bg-terracotta-hover"
          >
            Start · $99
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-none flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`h-[1.5px] w-5.5 bg-ink transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`h-[1.5px] w-5.5 bg-ink transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-ink/[0.08] bg-cream px-6 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-[15px] text-body no-underline hover:bg-cream-deep hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/start"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-[5px] bg-terracotta px-5 py-3 text-center text-[14px] font-semibold text-cream no-underline"
          >
            Start · $99
          </Link>
        </nav>
      )}
    </header>
  );
}
