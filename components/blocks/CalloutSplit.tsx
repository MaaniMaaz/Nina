"use client";

import Eyebrow from "@/components/ui/Eyebrow";
import ImageSlot from "@/components/ui/ImageSlot";
import EditableImage from "@/components/admin/EditableImage";
import EditableText from "@/components/admin/EditableText";
import { useEdit } from "@/components/admin/EditContext";
import type { CalloutItem } from "@/content/types";

interface CalloutSplitProps {
  number: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  callouts: CalloutItem[];
  imageSlotId?: string;
  imageUrl?: string;
  blockIndex?: number;
}

export default function CalloutSplit({
  number,
  eyebrow,
  heading,
  paragraphs,
  callouts,
  imageSlotId,
  imageUrl,
  blockIndex = 0,
}: CalloutSplitProps) {
  const edit = useEdit();
  const E = edit?.enabled;
  const base = `blocks.${blockIndex}`;
  const showImage = E || imageSlotId || imageUrl;
  const imageClass = "h-[160px] w-full rounded-2xl";

  return (
    <section className="bg-cream px-6 py-14 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-9 md:grid-cols-2 md:gap-16">
        <div>
          <Eyebrow
            number={number}
            label={E ? <EditableText path={`${base}.eyebrow`} value={eyebrow} /> : eyebrow}
          />
          <h2 className="mt-4 font-display text-[28px] font-medium leading-tight text-ink sm:text-[36px] md:text-[40px]">
            {E ? (
              <EditableText path={`${base}.heading`} value={heading} multiline />
            ) : (
              heading
            )}
          </h2>
          {paragraphs.map((p, i) => (
            <p key={i} className="mt-4 text-[16px] leading-relaxed text-body">
              {E ? (
                <EditableText path={`${base}.paragraphs.${i}`} value={p} multiline />
              ) : (
                p
              )}
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {showImage &&
            (E ? (
              <EditableImage
                slotId={imageSlotId}
                urlPath={`blocks.${blockIndex}.imageUrl`}
                alt={heading}
                placeholder="Photo"
                className={imageClass}
              />
            ) : (
              <ImageSlot id={imageSlotId} src={imageUrl} alt={heading} placeholder="Photo" className={imageClass} />
            ))}
          {callouts.map((c, i) => (
            <div
              key={i}
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
                <div className="text-sm font-bold text-ink">
                  {E ? (
                    <EditableText path={`${base}.callouts.${i}.title`} value={c.title} />
                  ) : (
                    c.title
                  )}
                </div>
                <div
                  className={`mt-1 text-[14.5px] leading-relaxed ${
                    i === callouts.length - 1 ? "text-[#4a6340]" : "text-body-soft"
                  }`}
                >
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
