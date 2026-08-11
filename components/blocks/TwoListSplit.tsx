"use client";

import Eyebrow from "@/components/ui/Eyebrow";
import EditableText from "@/components/admin/EditableText";
import { useEdit } from "@/components/admin/EditContext";

interface TwoListSplitProps {
  number: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
  blockIndex?: number;
}

export default function TwoListSplit({
  number,
  eyebrow,
  heading,
  paragraphs,
  leftTitle,
  leftItems,
  rightTitle,
  rightItems,
  blockIndex = 0,
}: TwoListSplitProps) {
  const edit = useEdit();
  const E = edit?.enabled;
  const base = `blocks.${blockIndex}`;

  return (
    <section className="bg-cream px-6 py-14 md:px-10 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <Eyebrow
            number={number}
            label={E ? <EditableText path={`${base}.eyebrow`} value={eyebrow} /> : eyebrow}
            align="center"
          />
          <h2 className="mt-3.5 max-w-2xl font-display text-[28px] font-medium leading-tight text-ink sm:text-[36px] md:text-[40px]">
            {E ? (
              <EditableText path={`${base}.heading`} value={heading} multiline />
            ) : (
              heading
            )}
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <div className="rounded-2xl border border-[#5a7d4f]/25 bg-[#EAF0E2] p-5 md:p-6">
            <div className="font-display text-lg text-[#3f5a35]">
              {E ? (
                <EditableText path={`${base}.leftTitle`} value={leftTitle} />
              ) : (
                leftTitle
              )}
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {leftItems.map((item, i) => (
                <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-[#3f5a35] md:text-[14.5px]">
                  <span aria-hidden>·</span>
                  <span>
                    {E ? (
                      <EditableText path={`${base}.leftItems.${i}`} value={item} />
                    ) : (
                      item
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-cream-deep p-5 md:p-6">
            <div className="font-display text-lg text-ink">
              {E ? (
                <EditableText path={`${base}.rightTitle`} value={rightTitle} />
              ) : (
                rightTitle
              )}
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {rightItems.map((item, i) => (
                <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-body-soft md:text-[14.5px]">
                  <span aria-hidden>·</span>
                  <span>
                    {E ? (
                      <EditableText path={`${base}.rightItems.${i}`} value={item} />
                    ) : (
                      item
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {paragraphs.map((p, i) => (
          <p key={i} className="mt-7 text-center text-[15px] leading-relaxed text-body-soft">
            {E ? (
              <EditableText path={`${base}.paragraphs.${i}`} value={p} multiline />
            ) : (
              p
            )}
          </p>
        ))}
      </div>
    </section>
  );
}
