"use client";

import Eyebrow from "@/components/ui/Eyebrow";
import EditableText from "@/components/admin/EditableText";
import { useEdit } from "@/components/admin/EditContext";

interface DefinitionListProps {
  number: string;
  eyebrow: string;
  heading: string;
  intro: string;
  points: string[];
  blockIndex?: number;
}

export default function DefinitionList({
  number,
  eyebrow,
  heading,
  intro,
  points,
  blockIndex = 0,
}: DefinitionListProps) {
  const edit = useEdit();
  const E = edit?.enabled;
  const base = `blocks.${blockIndex}`;

  return (
    <section className="bg-sand px-6 py-14 md:px-10 md:py-28">
      <div className="mx-auto max-w-3xl">
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
        <p className="mt-4 text-[16px] leading-relaxed text-body">
          {E ? (
            <EditableText path={`${base}.intro`} value={intro} multiline />
          ) : (
            intro
          )}
        </p>
        <ul className="mt-6 flex flex-col gap-3">
          {points.map((point, i) => (
            <li key={i} className="flex gap-3 rounded-xl bg-cream p-4 text-[14.5px] leading-relaxed text-body-soft">
              <span aria-hidden className="mt-0.5 flex-none text-terracotta">
                ✓
              </span>
              <span>
                {E ? (
                  <EditableText path={`${base}.points.${i}`} value={point} multiline />
                ) : (
                  point
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
