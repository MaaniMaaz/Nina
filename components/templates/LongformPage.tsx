import PageHero from "@/components/page/PageHero";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import FaqSection from "@/components/page/FaqSection";
import BylineBand from "@/components/page/BylineBand";
import InlineBookingCTA from "@/components/booking/InlineBookingCTA";
import type { LongformPageContent } from "@/content/types";

/**
 * Shared page shell for all Condition, Treatment, and Positioning pages.
 * The three page families use the same visual system in the source design,
 * so they render through this one template driven entirely by content data.
 */
export default function LongformPage({ content }: { content: LongformPageContent }) {
  const startNumber = content.blocks.length + 2;

  return (
    <>
      <PageHero hero={content.hero} />
      {content.blocks.map((block, i) => (
        <BlockRenderer key={`${block.type}-${i}`} block={block} number={String(i + 2).padStart(2, "0")} />
      ))}
      <FaqSection
        number={String(startNumber).padStart(2, "0")}
        eyebrow={content.faqEyebrow}
        heading={content.faqHeading}
        items={content.faq}
      />
      <InlineBookingCTA
        heading={content.startHere.heading}
        intro={content.startHere.intro}
        avatarSlotId={content.hero.bylineAvatarSlotId?.replace("byline-av", "start-av")}
      />
      <BylineBand
        note={content.bylineNote}
        avatarSlotId={content.hero.bylineAvatarSlotId?.replace("byline-av", "review-av")}
      />
    </>
  );
}
