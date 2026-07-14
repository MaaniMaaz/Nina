import Eyebrow from "@/components/ui/Eyebrow";
import FaqAccordion from "@/components/ui/FaqAccordion";
import type { FaqItem } from "@/content/types";

export default function FaqSection({
  number,
  eyebrow,
  heading,
  items,
}: {
  number: string;
  eyebrow: string;
  heading: string;
  items: FaqItem[];
}) {
  return (
    <section id="faq" className="bg-sand px-6 py-16 sm:px-10 sm:py-24 md:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <Eyebrow number={number} label={eyebrow} align="center" />
          <h2 className="mt-3.5 font-display text-[28px] font-medium leading-tight text-ink sm:text-[36px]">
            {heading}
          </h2>
        </div>
        <div className="mt-9">
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  );
}
