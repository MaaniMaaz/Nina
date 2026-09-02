"use client";

import { useEffect, useState } from "react";
import SmartImage from "@/components/ui/SmartImage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNavOverlay, { MobileMenuButton } from "@/components/layout/MobileNavOverlay";
import MegaMenuPanel, { type MegaKey } from "@/components/layout/MegaMenuPanel";
import SiteNav from "@/components/layout/SiteNav";

/**
 * Global Shell — same desktop nav sizing as the landing hero.
 * Mobile: cream logo + gold $99 + hamburger.
 * Hidden on `/` — the landing Hero owns that header.
 */
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<MegaKey | null>(null);
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/nina/admin");

  useEffect(() => {
    setOpen(false);
    setMega(null);
  }, [pathname]);

  if (isHome || isAdmin) return null;

  return (
    <header className={`sticky top-0 z-50 ${mega ? "bg-[#f3ebde]" : "bg-ink"}`}>
      <div className="relative z-30">
        <div
          className={`flex items-center justify-between gap-4 px-[clamp(24px,4vw,92px)] py-5 xl:py-6.5 ${
            mega ? "" : "border-b border-[rgba(230,221,209,0.14)]"
          }`}
        >
          <Link href="/" className="relative flex shrink-0 items-center" onClick={() => setOpen(false)}>
            <SmartImage
              src="/images/nina-ross-logo-cream.png"
              alt="Nina Ross Functional Medicine, Atlanta"
              height={62}
              width={220}
              className={`h-11 w-auto xl:h-[62px] ${mega ? "invisible absolute" : ""}`}
              priority
            />
            <SmartImage
              src="/images/nina-ross-logo-dark.png"
              alt=""
              aria-hidden
              height={62}
              width={220}
              className={`h-11 w-auto xl:h-[62px] ${mega ? "" : "invisible absolute"}`}
              priority
            />
          </Link>

          <div className="hidden min-w-0 md:block">
            <SiteNav mega={mega} onMegaChange={setMega} variant="shell" />
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/start"
              className="whitespace-nowrap rounded-lg bg-gold px-[15px] py-[9px] text-[12.5px] font-semibold text-ink no-underline"
            >
              $99 Consult
            </Link>
            <MobileMenuButton light={!mega} onClick={() => setOpen(true)} />
          </div>
        </div>

        {mega && (
          <MegaMenuPanel mega={mega} onClose={() => setMega(null)} className="hidden md:block" />
        )}
      </div>

      <MobileNavOverlay open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
