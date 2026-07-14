import Eyebrow from "@/components/ui/Eyebrow";

interface TwoListSplitProps {
  number: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
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
}: TwoListSplitProps) {
  return (
    <section className="bg-cream px-6 py-16 sm:px-10 sm:py-24 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <Eyebrow number={number} label={eyebrow} align="center" />
          <h2 className="mt-3.5 max-w-2xl font-display text-[28px] font-medium leading-tight text-ink sm:text-[36px] md:text-[40px]">
            {heading}
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#5a7d4f]/25 bg-[#EAF0E2] p-6">
            <div className="font-display text-lg text-[#3f5a35]">{leftTitle}</div>
            <ul className="mt-4 flex flex-col gap-3">
              {leftItems.map((item) => (
                <li key={item} className="flex gap-2.5 text-[14.5px] leading-relaxed text-[#3f5a35]">
                  <span aria-hidden>·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-cream-deep p-6">
            <div className="font-display text-lg text-ink">{rightTitle}</div>
            <ul className="mt-4 flex flex-col gap-3">
              {rightItems.map((item) => (
                <li key={item} className="flex gap-2.5 text-[14.5px] leading-relaxed text-body-soft">
                  <span aria-hidden>·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {paragraphs.map((p) => (
          <p key={p} className="mt-7 text-center text-[15px] leading-relaxed text-body-soft">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
