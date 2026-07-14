import Eyebrow from "@/components/ui/Eyebrow";
import type { BulletItem } from "@/content/types";

interface FeatureGridProps {
  number: string;
  eyebrow: string;
  heading: string;
  items: BulletItem[];
  footnote?: string;
}

export default function FeatureGrid({ number, eyebrow, heading, items, footnote }: FeatureGridProps) {
  return (
    <section className="bg-sand px-6 py-16 sm:px-10 sm:py-24 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <Eyebrow number={number} label={eyebrow} align="center" />
          <h2 className="mt-3.5 font-display text-[28px] font-medium leading-tight text-ink sm:text-[36px] md:text-[40px]">
            {heading}
          </h2>
        </div>
        <div className="mt-11 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-ink/[0.07] bg-cream p-6"
            >
              <div className="font-display text-lg text-ink">{item.label}</div>
              <div className="mt-1.5 text-[13.5px] leading-relaxed text-body-soft">{item.text}</div>
            </div>
          ))}
        </div>
        {footnote && (
          <p className="mt-8 text-center text-[15px] leading-relaxed text-body-soft">{footnote}</p>
        )}
      </div>
    </section>
  );
}
