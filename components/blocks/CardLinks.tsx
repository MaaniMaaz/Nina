"use client";

import Link from "next/link";
import Eyebrow from "@/components/ui/Eyebrow";
import ImageSlot from "@/components/ui/ImageSlot";
import EditableImage from "@/components/admin/EditableImage";
import EditableLink from "@/components/admin/EditableLink";
import EditableText from "@/components/admin/EditableText";
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
  const base = `blocks.${blockIndex}`;
  const cardClass =
    "block overflow-hidden rounded-[20px] bg-cream shadow-[0_12px_28px_rgba(46,33,27,0.08)] transition-shadow hover:shadow-[0_20px_40px_rgba(46,33,27,0.14)]";

  return (
    <section className="bg-sand px-6 py-14 md:px-10 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Eyebrow
          number={number}
          label={E ? <EditableText path={`${base}.eyebrow`} value={eyebrow} /> : eyebrow}
        />
        <h2 className="mt-3.5 font-display text-[28px] font-medium leading-tight text-ink sm:text-[36px] md:text-[40px]">
          {E ? (
            <EditableText path={`${base}.heading`} value={heading} multiline />
          ) : (
            heading
          )}
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
                  <div className="font-display text-[20px] text-ink">
                    {E ? (
                      <EditableText path={`${base}.cards.${i}.title`} value={card.title} />
                    ) : (
                      card.title
                    )}
                    {E ? (
                      <EditableLink path={`${base}.cards.${i}.href`} value={card.href} label="Card URL" />
                    ) : null}
                  </div>
                  <div className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                    {E ? (
                      <EditableText path={`${base}.cards.${i}.desc`} value={card.desc} multiline />
                    ) : (
                      card.desc
                    )}
                  </div>
                </div>
              </>
            );

            // In edit mode, avoid wrapping in a Link so the upload button doesn't navigate.
            return E ? (
              <div key={i} className={cardClass}>
                {body}
              </div>
            ) : (
              <Link key={i} href={card.href} className={cardClass}>
                {body}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
