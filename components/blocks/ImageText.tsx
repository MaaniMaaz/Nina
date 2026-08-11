"use client";

import Eyebrow from "@/components/ui/Eyebrow";
import ImageSlot from "@/components/ui/ImageSlot";
import EditableImage from "@/components/admin/EditableImage";
import EditableText from "@/components/admin/EditableText";
import { useEdit } from "@/components/admin/EditContext";

interface ImageTextProps {
  number: string;
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
  imageSlotId?: string;
  imageUrl?: string;
  imageAlt?: string;
  reverse?: boolean;
  blockIndex?: number;
}

export default function ImageText({
  number,
  eyebrow,
  heading,
  paragraphs,
  imageSlotId,
  imageUrl,
  imageAlt,
  reverse,
  blockIndex = 0,
}: ImageTextProps) {
  const edit = useEdit();
  const E = edit?.enabled;
  const base = `blocks.${blockIndex}`;
  const imageClass = "h-[280px] w-full rounded-[22px] sm:h-[340px]";

  return (
    <section className="bg-cream px-6 py-14 md:px-10 md:py-28">
      <div
        className={`mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-16 ${
          reverse ? "[&>*:first-child]:sm:order-2" : ""
        }`}
      >
        <div>
          {(eyebrow || E) && (
            <Eyebrow
              number={number}
              label={
                E ? (
                  <EditableText path={`${base}.eyebrow`} value={eyebrow ?? ""} />
                ) : (
                  eyebrow!
                )
              }
            />
          )}
          <h2 className="mt-3.5 font-display text-[26px] font-medium leading-tight text-ink sm:text-[32px] md:text-[36px]">
            {E ? (
              <EditableText path={`${base}.heading`} value={heading} multiline />
            ) : (
              heading
            )}
          </h2>
          {paragraphs.map((p, i) => (
            <p key={i} className="mt-4 text-[15.5px] leading-relaxed text-body">
              {E ? (
                <EditableText path={`${base}.paragraphs.${i}`} value={p} multiline />
              ) : (
                p
              )}
            </p>
          ))}
        </div>
        {E ? (
          <EditableImage
            slotId={imageSlotId}
            urlPath={`blocks.${blockIndex}.imageUrl`}
            alt={imageAlt ?? heading}
            placeholder="Photo"
            className={imageClass}
          />
        ) : (
          <ImageSlot
            id={imageSlotId}
            src={imageUrl}
            alt={imageAlt ?? heading}
            placeholder="Photo"
            className={imageClass}
          />
        )}
      </div>
    </section>
  );
}
