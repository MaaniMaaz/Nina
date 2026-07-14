import type { FaqItem } from "@/content/types";

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <details
          key={item.q}
          className="group rounded-2xl border border-ink/10 bg-cream px-5 py-4 open:border-terracotta/30"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1.5">
            <h3 className="font-display text-[16.5px] leading-snug text-ink">{item.q}</h3>
            <svg
              className="faq-chev flex-none text-terracotta"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </summary>
          <p className="mt-2.5 pr-8 text-[14.5px] leading-relaxed text-body-soft">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
