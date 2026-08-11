"use client";

import Eyebrow from "@/components/ui/Eyebrow";
import EditableText from "@/components/admin/EditableText";
import { useEdit } from "@/components/admin/EditContext";

interface TextBandProps {
  number: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  blockIndex?: number;
}

export default function TextBand({
  number,
  eyebrow,
  heading,
  paragraphs,
  blockIndex = 0,
}: TextBandProps) {
  const edit = useEdit();
  const E = edit?.enabled;
  const base = `blocks.${blockIndex}`;

  return (
    <section className="bg-sand px-6 py-14 md:px-10 md:py-22">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Eyebrow
          number={number}
          label={E ? <EditableText path={`${base}.eyebrow`} value={eyebrow} /> : eyebrow}
          align="center"
        />
        <h2 className="mt-3.5 font-display text-[26px] font-medium leading-tight text-ink sm:text-[32px] md:text-[36px]">
          {E ? (
            <EditableText path={`${base}.heading`} value={heading} multiline />
          ) : (
            heading
          )}
        </h2>
        {paragraphs.map((p, i) => (
          <p key={i} className="mt-4 text-[16px] leading-relaxed text-body-soft">
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
