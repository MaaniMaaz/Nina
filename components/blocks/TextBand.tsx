import Eyebrow from "@/components/ui/Eyebrow";

interface TextBandProps {
  number: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
}

export default function TextBand({ number, eyebrow, heading, paragraphs }: TextBandProps) {
  return (
    <section className="bg-sand px-6 py-14 md:px-10 md:py-22">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Eyebrow number={number} label={eyebrow} align="center" />
        <h2 className="mt-3.5 font-display text-[26px] font-medium leading-tight text-ink sm:text-[32px] md:text-[36px]">
          {heading}
        </h2>
        {paragraphs.map((p) => (
          <p key={p} className="mt-4 text-[16px] leading-relaxed text-body-soft">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
