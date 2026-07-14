import Eyebrow from "@/components/ui/Eyebrow";
import ImageSlot from "@/components/ui/ImageSlot";
import type { CalloutItem } from "@/content/types";

interface CalloutSplitProps {
  number: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  callouts: CalloutItem[];
  imageSlotId?: string;
}

export default function CalloutSplit({ number, eyebrow, heading, paragraphs, callouts, imageSlotId }: CalloutSplitProps) {
  return (
    <section className="bg-cream px-6 py-16 sm:px-10 sm:py-24 md:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-9 sm:grid-cols-2 md:gap-16">
        <div>
          <Eyebrow number={number} label={eyebrow} />
          <h2 className="mt-4 font-display text-[28px] font-medium leading-tight text-ink sm:text-[36px] md:text-[40px]">
            {heading}
          </h2>
          {paragraphs.map((p) => (
            <p key={p} className="mt-4 text-[16px] leading-relaxed text-body">
              {p}
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {imageSlotId && (
            <ImageSlot id={imageSlotId} alt={heading} placeholder="Photo" className="h-[160px] w-full rounded-2xl" />
          )}
          {callouts.map((c, i) => (
            <div
              key={c.title}
              className={`flex items-start gap-4 rounded-2xl p-5 ${
                i === callouts.length - 1 ? "bg-[#EAF0E2]" : "bg-cream-deep"
              }`}
            >
              <span
                className={`mt-0.5 flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full ${
                  i === callouts.length - 1 ? "bg-[#cfe0bd]" : "bg-[#e4d6c2]"
                }`}
              >
                {i === callouts.length - 1 ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5a7d4f" strokeWidth="2.4">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9a8a78" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                )}
              </span>
              <div>
                <div className="text-sm font-bold text-ink">{c.title}</div>
                <div
                  className={`mt-1 text-[14.5px] leading-relaxed ${
                    i === callouts.length - 1 ? "text-[#4a6340]" : "text-body-soft"
                  }`}
                >
                  {c.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
