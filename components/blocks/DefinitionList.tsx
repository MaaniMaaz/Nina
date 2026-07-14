import Eyebrow from "@/components/ui/Eyebrow";

interface DefinitionListProps {
  number: string;
  eyebrow: string;
  heading: string;
  intro: string;
  points: string[];
}

export default function DefinitionList({ number, eyebrow, heading, intro, points }: DefinitionListProps) {
  return (
    <section className="bg-sand px-6 py-16 sm:px-10 sm:py-24 md:py-28">
      <div className="mx-auto max-w-3xl">
        <Eyebrow number={number} label={eyebrow} />
        <h2 className="mt-3.5 font-display text-[28px] font-medium leading-tight text-ink sm:text-[36px] md:text-[40px]">
          {heading}
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-body">{intro}</p>
        <ul className="mt-6 flex flex-col gap-3">
          {points.map((point) => (
            <li key={point} className="flex gap-3 rounded-xl bg-cream p-4 text-[14.5px] leading-relaxed text-body-soft">
              <span aria-hidden className="mt-0.5 flex-none text-terracotta">
                ✓
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
