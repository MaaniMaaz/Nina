"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MegaKey } from "@/components/layout/MegaMenuPanel";

export type SiteNavVariant = "hero" | "shell";

type SiteNavProps = {
  mega: MegaKey | null;
  onMegaChange: (mega: MegaKey | null) => void;
  variant?: SiteNavVariant;
};

const MEGA_ITEMS: { label: string; mega: MegaKey }[] = [
  { label: "Conditions We Treat", mega: "conditions" },
  { label: "How We Help", mega: "treatments" },
];

/**
 * Shared desktop nav — same sizing on landing and all shell pages.
 * Colors adapt for dark bar vs open cream mega state.
 */
export default function SiteNav({ mega, onMegaChange }: SiteNavProps) {
  const pathname = usePathname();
  const megaOpen = mega !== null;
  const storiesHref = pathname === "/" ? "#patient-stories" : "/#patient-stories";

  const linkClass = megaOpen
    ? "whitespace-nowrap text-[11.5px] tracking-[0.02em] text-ink/75 no-underline transition-colors hover:text-ink xl:text-[13px]"
    : "whitespace-nowrap text-[11.5px] tracking-[0.02em] text-[#d9ccbe] no-underline transition-colors hover:text-white xl:text-[13px]";

  const activeMegaClass = megaOpen ? "font-semibold text-ink" : "font-semibold text-white";

  const links = [
    { label: "Our Approach", href: "/approach" },
    { label: "Advanced Testing", href: "/treatments/advanced-lab-testing" },
    { label: "Blog", href: "/blog" },
    { label: "Dr. Nina", href: "/about" },
    { label: "Stories", href: storiesHref },
  ];

  const ctaClass = megaOpen
    ? "shrink-0 rounded-[4px] border border-ink/25 bg-ink px-3.5 py-2.5 text-[12px] font-semibold text-cream-deep no-underline transition-colors hover:bg-ink/90 xl:px-5 xl:text-[13px]"
    : "shrink-0 rounded-[4px] border border-[rgba(230,221,209,0.4)] px-3.5 py-2.5 text-[12px] font-semibold text-cream-deep no-underline transition-colors hover:border-gold hover:text-white xl:px-5 xl:text-[13px]";

  return (
    <div className="flex min-w-0 items-center gap-3 xl:gap-6">
      <nav className="flex min-w-0 flex-wrap items-center justify-end gap-x-3 gap-y-2 xl:gap-x-5">
        {MEGA_ITEMS.map((item) => (
          <button
            key={item.mega}
            type="button"
            onClick={() => onMegaChange(mega === item.mega ? null : item.mega)}
            className={`relative flex items-center gap-1 ${linkClass} ${
              mega === item.mega ? activeMegaClass : ""
            }`}
          >
            {item.label}
            <span
              className={`inline-block text-[8px] text-gold-deep transition-transform ${
                mega === item.mega ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
            {mega === item.mega && (
              <span className="absolute inset-x-0 -bottom-[21px] h-0.5 bg-gold-deep xl:-bottom-[27px]" />
            )}
          </button>
        ))}
        {links.map((link) => (
          <Link key={link.href + link.label} href={link.href} className={linkClass}>
            {link.label}
          </Link>
        ))}
      </nav>

      <span
        className={`hidden h-4.5 w-px shrink-0 xl:block ${
          megaOpen ? "bg-ink/15" : "bg-[rgba(230,221,209,0.22)]"
        }`}
      />

      <Link href="/start" className={ctaClass}>
        Start · $99
      </Link>
    </div>
  );
}
