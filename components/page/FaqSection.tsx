"use client";

import Eyebrow from "@/components/ui/Eyebrow";
import FaqAccordion from "@/components/ui/FaqAccordion";
import EditableText from "@/components/admin/EditableText";
import { useEdit } from "@/components/admin/EditContext";
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
  const edit = useEdit();
  const E = edit?.enabled;

  return (
    <section id="faq" className="bg-sand px-6 py-14 md:px-10 md:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <Eyebrow
            number={number}
            label={
              E ? (
                <EditableText path="faqEyebrow" value={eyebrow} />
              ) : (
                eyebrow
              )
            }
            align="center"
          />
          <h2 className="mt-3.5 font-display text-[26px] font-medium leading-tight text-ink md:text-[36px]">
            {E ? <EditableText path="faqHeading" value={heading} multiline /> : heading}
          </h2>
        </div>
        <div className="mt-9 space-y-4">
          {E
            ? items.map((item, i) => (
                <div key={i} className="rounded-xl border border-ink/10 bg-cream p-4 text-left">
                  <div className="font-semibold text-ink">
                    <EditableText path={`faq.${i}.q`} value={item.q} multiline />
                  </div>
                  <div className="mt-2 text-[14px] leading-relaxed text-body">
                    <EditableText path={`faq.${i}.a`} value={item.a} multiline />
                  </div>
                </div>
              ))
            : (
              <FaqAccordion items={items} />
            )}
        </div>
      </div>
    </section>
  );
}
