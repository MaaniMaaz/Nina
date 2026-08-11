"use client";

import Eyebrow from "@/components/ui/Eyebrow";
import ImageSlot from "@/components/ui/ImageSlot";
import EditableImage from "@/components/admin/EditableImage";
import EditableText from "@/components/admin/EditableText";
import { useEdit } from "@/components/admin/EditContext";
import type { CalloutItem } from "@/content/types";

interface BandStatementProps {
  number: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  callouts: CalloutItem[];
  imageSlotId?: string;
  imageUrl?: string;
  blockIndex?: number;
}

export default function BandStatement({
  number,
  eyebrow,
  heading,
  paragraphs,
  callouts,
  imageSlotId,
  imageUrl,
  blockIndex = 0,
}: BandStatementProps) {
  const edit = useEdit();
  const E = edit?.enabled;
  const base = `blocks.${blockIndex}`;
  const showImage = E || imageSlotId || imageUrl;

  return (
    <section className="relative overflow-hidden bg-terracotta px-6 py-10 md:px-10 md:py-28">
      <div className="grain-overlay opacity-22 mix-blend-overlay" style={{ backgroundSize: "150px" }} />
      <div className="relative z-10 mx-auto grid max-w-5xl gap-5 md:grid-cols-2 md:gap-20">
        <div>
          <Eyebrow
            number={number}
            label={E ? <EditableText path={`${base}.eyebrow`} value={eyebrow} /> : eyebrow}
            tone="onTerracotta"
          />
          <h2 className="mt-[9px] font-display text-[27px] font-medium leading-[1.08] tracking-[-0.01em] text-[#FBF3E6] md:mt-4 md:text-[44px] md:leading-tight">
            {E ? (
              <EditableText path={`${base}.heading`} value={heading} multiline />
            ) : (
              heading
            )}
          </h2>
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={`mt-3.5 text-sm leading-[1.6] md:mt-4 md:text-[16px] ${
                i === paragraphs.length - 1 && paragraphs.length > 1
                  ? "font-semibold text-[#FBF3E6]"
                  : "text-[#fbe6d5]"
              }`}
            >
              {E ? (
                <EditableText path={`${base}.paragraphs.${i}`} value={p} multiline />
              ) : (
                p
              )}
            </p>
          ))}
          {showImage && (
            <div className="mt-[18px] flex items-center gap-[9px] border-t border-[#FBF3E6]/22 pt-4 md:mt-6 md:gap-3 md:pt-5">
              {E ? (
                <EditableImage
                  slotId={imageSlotId}
                  urlPath={`blocks.${blockIndex}.imageUrl`}
                  alt="Dr. Nina Ross, ND PhD"
                  shape="circle"
                  className="h-[34px] w-[34px] md:h-10 md:w-10"
                />
              ) : (
                <ImageSlot id={imageSlotId} src={imageUrl} alt="Dr. Nina Ross, ND PhD" shape="circle" className="h-[34px] w-[34px] md:h-10 md:w-10" />
              )}
              <span className="font-display text-[13px] italic text-[#FBF3E6] md:text-[15px]">Dr. Nina Ross, ND PhD</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-[11px] md:gap-3.5">
          {callouts.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-[13px] border border-[#FBF3E6]/20 bg-[#FBF3E6]/12 px-[15px] py-3.5 md:gap-3.5 md:rounded-2xl md:p-5"
            >
              <span className="mt-0.5 flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-[#FBF3E6]/16 md:h-8 md:w-8">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FBF3E6" strokeWidth="2.2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </span>
              <div>
                <div className="text-[13px] font-bold text-[#FBF3E6] md:text-[15px]">
                  {E ? (
                    <EditableText path={`${base}.callouts.${i}.title`} value={c.title} />
                  ) : (
                    c.title
                  )}
                </div>
                <div className="mt-[3px] text-[12.5px] leading-[1.45] text-[#fbe6d5] md:mt-1 md:text-sm md:leading-relaxed">
                  {E ? (
                    <EditableText path={`${base}.callouts.${i}.body`} value={c.body} multiline />
                  ) : (
                    c.body
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
