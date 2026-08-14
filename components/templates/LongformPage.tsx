"use client";

import PageHero from "@/components/page/PageHero";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import FaqSection from "@/components/page/FaqSection";
import BylineBand from "@/components/page/BylineBand";
import InlineBookingCTA from "@/components/booking/InlineBookingCTA";
import { useEdit } from "@/components/admin/EditContext";
import type { LongformPageContent } from "@/content/types";
import { isLongformContent } from "@/lib/cms/types";

/**
 * Shared page shell for all Condition, Treatment, and Positioning pages.
 * When wrapped in EditProvider, renders live CMS content from context.
 */
export default function LongformPage({ content }: { content: LongformPageContent }) {
  const edit = useEdit();
  const live =
    edit?.enabled && edit.content && isLongformContent(edit.content as LongformPageContent)
      ? (edit.content as LongformPageContent)
      : content;

  const startNumber = live.blocks.length + 2;

  return (
    <>
      <PageHero hero={live.hero} />
      {live.blocks.map((block, i) => (
        <BlockRenderer
          key={`${block.type}-${i}`}
          block={block}
          blockIndex={i}
          number={String(i + 2).padStart(2, "0")}
        />
      ))}
      <FaqSection
        number={String(startNumber).padStart(2, "0")}
        eyebrow={live.faqEyebrow}
        heading={live.faqHeading}
        items={live.faq}
      />
      <InlineBookingCTA
        heading={live.startHere.heading}
        intro={live.startHere.intro}
        avatarSlotId={live.hero.bylineAvatarSlotId?.replace("byline-av", "start-av")}
        avatarUrl={live.hero.bylineAvatarUrl}
      />
      <BylineBand
        note={live.bylineNote}
        avatarSlotId={live.hero.bylineAvatarSlotId?.replace("byline-av", "review-av")}
        avatarUrl={live.hero.bylineAvatarUrl}
      />
    </>
  );
}
