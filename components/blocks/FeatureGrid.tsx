"use client";

import Eyebrow from "@/components/ui/Eyebrow";
import EditableText from "@/components/admin/EditableText";
import { useEdit } from "@/components/admin/EditContext";
import type { BulletItem } from "@/content/types";

interface FeatureGridProps {
  number: string;
  eyebrow: string;
  heading: string;
  items: BulletItem[];
  footnote?: string;
  blockIndex?: number;
}

/** Matches Condition Mobile “You might recognize this” 2-col cream cards on sand. */
export default function FeatureGrid({
  number,
  eyebrow,
  heading,
  items,
  footnote,
  blockIndex = 0,
}: FeatureGridProps) {
  const edit = useEdit();
  const E = edit?.enabled;
  const base = `blocks.${blockIndex}`;

  return (
    <section className="bg-sand px-6 py-[34px] md:px-10 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="md:text-center">
          <div className="md:flex md:justify-center">
            <Eyebrow
              number={number}
              label={E ? <EditableText path={`${base}.eyebrow`} value={eyebrow} /> : eyebrow}
            />
          </div>
          <h2 className="mt-[9px] font-display text-[25px] font-medium leading-[1.1] text-ink md:mt-3.5 md:text-[40px]">
            {E ? (
              <EditableText path={`${base}.heading`} value={heading} multiline />
            ) : (
              heading
            )}
          </h2>
        </div>
        <div className="mt-[18px] grid grid-cols-2 gap-[11px] md:mt-11 md:grid-cols-3 md:gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-[14px] border border-ink/[0.07] bg-cream px-[14px] py-[15px] md:rounded-2xl md:p-6"
            >
              <div className="text-[13px] font-semibold leading-[1.38] text-ink md:font-display md:text-lg md:font-medium">
                {E ? (
                  <EditableText path={`${base}.items.${i}.label`} value={item.label} />
                ) : (
                  item.label
                )}
              </div>
              {item.text ? (
                <div className="mt-1.5 hidden text-[13.5px] leading-relaxed text-body-soft md:block">
                  {E ? (
                    <EditableText path={`${base}.items.${i}.text`} value={item.text} multiline />
                  ) : (
                    item.text
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        {footnote && (
          <p className="mt-[18px] text-center text-[13px] leading-[1.5] text-body-soft md:mt-8 md:text-[15px]">
            {E ? (
              <EditableText path={`${base}.footnote`} value={footnote} multiline />
            ) : (
              footnote
            )}
          </p>
        )}
      </div>
    </section>
  );
}
