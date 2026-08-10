"use client";

import Eyebrow from "@/components/ui/Eyebrow";
import ImageSlot from "@/components/ui/ImageSlot";
import EditableImage from "@/components/admin/EditableImage";
import { useEdit } from "@/components/admin/EditContext";

interface BioBlockProps {
  number: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  credentials: string[];
  imageSlotId?: string;
  imageUrl?: string;
  blockIndex?: number;
}

export default function BioBlock({
  number,
  eyebrow,
  heading,
  paragraphs,
  credentials,
  imageSlotId,
  imageUrl,
  blockIndex = 0,
}: BioBlockProps) {
  const edit = useEdit();
  const imageClass = "h-[320px] w-full rounded-[22px] shadow-[0_24px_50px_rgba(46,33,27,0.14)] sm:h-[400px]";

  return (
    <section className="bg-cream px-6 py-14 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-16">
        {edit?.enabled ? (
          <EditableImage
            slotId={imageSlotId}
            urlPath={`blocks.${blockIndex}.imageUrl`}
            alt={heading}
            placeholder="Dr. Nina portrait"
            className={imageClass}
          />
        ) : (
          <ImageSlot
            id={imageSlotId}
            src={imageUrl}
            alt={heading}
            placeholder="Dr. Nina portrait"
            className={imageClass}
          />
        )}
        <div>
          <Eyebrow number={number} label={eyebrow} />
          <h2 className="mt-3.5 font-display text-[28px] font-medium leading-tight text-ink sm:text-[34px] md:text-[38px]">
            {heading}
          </h2>
          {paragraphs.map((p) => (
            <p key={p} className="mt-4 text-[15.5px] leading-relaxed text-body">
              {p}
            </p>
          ))}
          <div className="mt-6 flex flex-col gap-2 border-t border-ink/10 pt-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
              Credentials &amp; training
            </div>
            <ul className="flex flex-col gap-1.5">
              {credentials.map((c) => (
                <li key={c} className="text-[14px] leading-relaxed text-body-soft">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
