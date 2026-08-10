"use client";

import Eyebrow from "@/components/ui/Eyebrow";
import ImageSlot from "@/components/ui/ImageSlot";
import EditableImage from "@/components/admin/EditableImage";
import { useEdit } from "@/components/admin/EditContext";

interface TestimonialBlockProps {
  number: string;
  eyebrow: string;
  quote: string;
  name: string;
  meta: string;
  avatarSlotId?: string;
  photoSlotId?: string;
  avatarUrl?: string;
  photoUrl?: string;
  blockIndex?: number;
}

export default function TestimonialBlock({
  number,
  eyebrow,
  quote,
  name,
  meta,
  avatarSlotId,
  photoSlotId,
  avatarUrl,
  photoUrl,
  blockIndex = 0,
}: TestimonialBlockProps) {
  const edit = useEdit();
  const photoClass = "h-[300px] w-full rounded-[22px] shadow-[0_24px_50px_rgba(46,33,27,0.18)] sm:h-[420px]";
  const avatarClass = "h-[52px] w-[52px] flex-none";

  return (
    <section className="bg-cream px-6 py-14 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-9 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        {edit?.enabled ? (
          <EditableImage
            slotId={photoSlotId}
            urlPath={`blocks.${blockIndex}.photoUrl`}
            alt={`${name}, a patient of Nina Ross Functional Medicine`}
            placeholder="Patient photo"
            className={photoClass}
          />
        ) : (
          <ImageSlot
            id={photoSlotId}
            src={photoUrl}
            alt={`${name}, a patient of Nina Ross Functional Medicine`}
            placeholder="Patient photo"
            className={photoClass}
          />
        )}
        <div>
          <Eyebrow number={number} label={eyebrow} />
          <svg width="34" height="26" viewBox="0 0 26 20" fill="#E9B45A" className="mt-6 opacity-85">
            <path d="M0 20V11C0 4.9 3.7 0.8 9.6 0L10.6 2.7C7 3.7 5.4 5.6 5.4 8.4H10V20H0ZM15 20V11C15 4.9 18.7 0.8 24.6 0L25.6 2.7C22 3.7 20.4 5.6 20.4 8.4H25V20H15Z" />
          </svg>
          <p className="mt-4 font-display text-[24px] italic leading-snug text-ink sm:text-[30px]">
            {quote}
          </p>
          <div className="mt-6 flex items-center gap-3.5">
            {edit?.enabled ? (
              <EditableImage
                slotId={avatarSlotId}
                urlPath={`blocks.${blockIndex}.avatarUrl`}
                alt={name}
                shape="circle"
                className={avatarClass}
              />
            ) : (
              <ImageSlot id={avatarSlotId} src={avatarUrl} alt={name} shape="circle" className={avatarClass} />
            )}
            <div>
              <div className="text-[15px] font-bold text-ink">{name}</div>
              <div className="text-[13px] text-muted">{meta}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
