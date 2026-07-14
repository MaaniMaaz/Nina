import Eyebrow from "@/components/ui/Eyebrow";
import ImageSlot from "@/components/ui/ImageSlot";
import type { CalloutItem } from "@/content/types";

interface BandStatementProps {
  number: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  callouts: CalloutItem[];
  imageSlotId?: string;
}

export default function BandStatement({
  number,
  eyebrow,
  heading,
  paragraphs,
  callouts,
  imageSlotId,
}: BandStatementProps) {
  return (
    <section className="relative overflow-hidden bg-terracotta px-6 py-17 sm:px-10 sm:py-24 md:py-28">
      <div className="grain-overlay opacity-20 mix-blend-overlay" />
      <div className="relative z-10 mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 md:gap-20">
        <div>
          <Eyebrow number={number} label={eyebrow} tone="dark" />
          <h2 className="mt-4 font-display text-[30px] font-medium leading-tight tracking-tight text-[#FBF3E6] sm:text-[36px] md:text-[44px]">
            {heading}
          </h2>
          {paragraphs.map((p, i) => (
            <p
              key={p}
              className={`mt-4 text-[16px] leading-relaxed ${
                i === paragraphs.length - 1 && paragraphs.length > 1
                  ? "font-semibold text-[#FBF3E6]"
                  : "text-[#fbe6d5]"
              }`}
            >
              {p}
            </p>
          ))}
          {imageSlotId && (
            <div className="mt-6 flex items-center gap-3 border-t border-[#FBF3E6]/20 pt-5">
              <ImageSlot id={imageSlotId} alt="Dr. Nina Ross, ND PhD" shape="circle" className="h-10 w-10" />
              <span className="font-display text-[15px] italic text-[#FBF3E6]">Dr. Nina Ross, ND PhD</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3.5">
          {callouts.map((c) => (
            <div
              key={c.title}
              className="flex items-start gap-3.5 rounded-2xl border border-[#FBF3E6]/20 bg-[#FBF3E6]/10 p-5"
            >
              <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#FBF3E6]/15">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBF3E6" strokeWidth="2.2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </span>
              <div>
                <div className="text-[15px] font-bold text-[#FBF3E6]">{c.title}</div>
                <div className="mt-1 text-sm leading-relaxed text-[#fbe6d5]">{c.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
