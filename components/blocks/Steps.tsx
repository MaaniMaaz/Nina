import Eyebrow from "@/components/ui/Eyebrow";
import type { StepItem } from "@/content/types";

interface StepsProps {
  number: string;
  eyebrow: string;
  heading: string;
  steps: StepItem[];
}

export default function Steps({ number, eyebrow, heading, steps }: StepsProps) {
  return (
    <section className="bg-cream px-6 py-16 sm:px-10 sm:py-24 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <Eyebrow number={number} label={eyebrow} align="center" />
          <h2 className="mt-3.5 font-display text-[28px] font-medium leading-tight text-ink sm:text-[36px] md:text-[40px]">
            {heading}
          </h2>
        </div>
        <div className="relative mt-13">
          <div className="absolute left-[12%] right-[12%] top-[27px] hidden h-px bg-[#e0d5c2] sm:block" />
          <div className="relative grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.label} className="text-center">
                <div
                  className={`mx-auto flex h-[54px] w-[54px] items-center justify-center rounded-full font-display text-[21px] ${
                    i === steps.length - 1 ? "bg-terracotta text-cream-deep" : "bg-ink text-cream-deep"
                  }`}
                >
                  {i + 1}
                </div>
                <div className="mt-4.5 text-[10px] font-bold uppercase tracking-[0.16em] text-terracotta">
                  {step.label}
                </div>
                <div className="mt-1.5 mb-2 font-display text-[20px] text-ink">{step.title}</div>
                <p className="text-[13.5px] leading-relaxed text-body-soft">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
