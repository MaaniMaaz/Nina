import Link from "next/link";

export const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/ninarossatl",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/NinaRossATL/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M14 8.5h2.2V5.3c-.4-.05-1.5-.15-2.7-.15-2.7 0-4.5 1.6-4.5 4.6V12H6.2v3.3H9V23h3.4v-7.7h2.7l.4-3.3h-3.1V10c0-1 .25-1.5 1.6-1.5z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/ninarossatl",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10.5 9.2v5.6l4.6-2.8z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
] as const;

export default function SocialIcons({
  size = "md",
}: {
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-[38px] w-[38px]" : "h-10 w-10";

  return (
    <div className={`flex ${size === "sm" ? "gap-2.5" : "gap-2.75"}`}>
      {SOCIAL_LINKS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className={`flex ${box} items-center justify-center rounded-full border border-cream-deep/22 text-[#e0d4c5] transition-colors hover:border-cream-deep/50 hover:text-cream-deep`}
        >
          {item.icon}
        </Link>
      ))}
    </div>
  );
}
