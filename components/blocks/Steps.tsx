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
    <section className="bg-cream px-6 py-14 md:px-10 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <Eyebrow number={number} label={eyebrow} align="center" />
          <h2 className="mt-3.5 font-display text-[26px] font-medium leading-tight text-ink md:text-[40px]">
            {heading}
          </h2>
        </div>
        <div className="relative mt-10 md:mt-13">
          {/* Connector only when 4-across desktop layout is active */}
          <div className="absolute left-[12%] right-[12%] top-[27px] hidden h-px bg-[#e0d5c2] md:block" />
          <div className="relative grid grid-cols-1 gap-7 md:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.label} className="flex gap-4 text-left md:block md:text-center">
                <div
                  className={`flex h-[48px] w-[48px] flex-none items-center justify-center rounded-full font-display text-[19px] md:mx-auto md:h-[54px] md:w-[54px] md:text-[21px] ${
                    i === steps.length - 1 ? "bg-terracotta text-cream-deep" : "bg-ink text-cream-deep"
                  }`}
                >
                  {i + 1}
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-terracotta md:mt-4.5">
                    {step.label}
                  </div>
                  <div className="mt-1 mb-1.5 font-display text-[18px] text-ink md:mt-1.5 md:mb-2 md:text-[20px]">{step.title}</div>
                  <p className="text-[13.5px] leading-relaxed text-body-soft">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
