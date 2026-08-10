"use client";

import Link from "next/link";
import Eyebrow from "@/components/ui/Eyebrow";
import ImageSlot from "@/components/ui/ImageSlot";
import EditableImage from "@/components/admin/EditableImage";
import { useEdit } from "@/components/admin/EditContext";
import type { CardLinkItem } from "@/content/types";

interface CardLinksProps {
  number: string;
  eyebrow: string;
  heading: string;
  cards: CardLinkItem[];
  blockIndex?: number;
}

export default function CardLinks({ number, eyebrow, heading, cards, blockIndex = 0 }: CardLinksProps) {
  const edit = useEdit();
  const E = edit?.enabled;
  const cardClass =
    "block overflow-hidden rounded-[20px] bg-cream shadow-[0_12px_28px_rgba(46,33,27,0.08)] transition-shadow hover:shadow-[0_20px_40px_rgba(46,33,27,0.14)]";

  return (
    <section className="bg-sand px-6 py-14 md:px-10 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Eyebrow number={number} label={eyebrow} />
        <h2 className="mt-3.5 font-display text-[28px] font-medium leading-tight text-ink sm:text-[36px] md:text-[40px]">
          {heading}
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {cards.map((card, i) => {
            const body = (
              <>
                {E ? (
                  <EditableImage
                    slotId={card.imageSlotId}
                    urlPath={`blocks.${blockIndex}.cards.${i}.imageUrl`}
                    alt={card.title}
                    placeholder="Photo"
                    className="h-[200px] w-full"
                  />
                ) : (
                  <ImageSlot
                    id={card.imageSlotId}
                    src={card.imageUrl}
                    alt={card.title}
                    placeholder="Photo"
                    className="h-[200px] w-full"
                  />
                )}
                <div className="p-5.5 pb-6.5">
                  <div className="font-display text-[20px] text-ink">{card.title}</div>
                  <div className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{card.desc}</div>
                </div>
              </>
            );

            // In edit mode, avoid wrapping in a Link so the upload button doesn't navigate.
            return E ? (
              <div key={card.href} className={cardClass}>
                {body}
              </div>
            ) : (
              <Link key={card.href} href={card.href} className={cardClass}>
                {body}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
