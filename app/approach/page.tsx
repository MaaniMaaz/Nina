import type { Metadata } from "next";
import Link from "next/link";
import Eyebrow from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Our Approach",
  description:
    "Root-cause functional medicine: how Dr. Nina Ross reads your whole system, orders advanced labs, and builds the Care Plan Protocol around your body and your life.",
  alternates: { canonical: "/approach" },
};

const STEPS = [
  { label: "Discover", title: "Hear the whole story", desc: "An unhurried first visit and advanced labs, so nothing about how you feel gets dismissed." },
  { label: "Connect", title: "See how the pieces relate", desc: "We map your results together so you finally understand why the symptoms travel as a set." },
  { label: "Personalize", title: "Build the plan around you", desc: "Nutrition, targeted support, and lifestyle, sequenced to your labs and your real life, not a template." },
  { label: "Nourish", title: "Steady support over time", desc: "We adjust as your numbers move, so progress holds and you keep feeling more like yourself." },
];

export default function ApproachPage() {
  return (
    <>
      <section className="bg-cream px-6 py-12 md:px-10 md:py-28">
        <div className="mx-auto max-w-3xl">
          <Eyebrow number="01" label="Why root-cause" />
          <h1 className="mt-3.5 font-display text-[30px] font-medium leading-tight text-ink md:text-[48px]">
            Conventional care manages symptoms. We find the cause.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-body md:mt-5 md:text-[16px]">
            A fifteen-minute visit rarely has room to ask why. So symptoms get named and medicated one at a time
            while the thing connecting them goes unexamined. Functional medicine does the opposite: it maps the
            whole system and treats the driver underneath.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-body md:text-[16px]">
            Normal on a lab does not mean optimal, and it does not mean you are not unwell.
          </p>
          <div className="mt-7 grid grid-cols-1 gap-3 md:mt-8 md:grid-cols-3 md:gap-4">
            {[
              { title: "It asks why, not just what", body: "Instead of naming a symptom and medicating it, we trace it back to the system that produced it." },
              { title: "Labs read for optimal", body: "Advanced panels read against where you actually feel well, not just inside a wide normal range." },
              { title: "A plan, not a prescription", body: "Nutrition, targeted support, and lifestyle, sequenced to your labs and your real life, not a default handed to you." },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-ink/10 bg-cream-deep p-5">
                <div className="font-display text-[16px] text-ink">{c.title}</div>
                <div className="mt-1.5 text-[13.5px] leading-relaxed text-body-soft">{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand px-6 py-12 md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <Eyebrow number="02" label="The Care Plan Protocol" align="center" />
            <h2 className="mt-3.5 font-display text-[26px] font-medium leading-tight text-ink md:text-[40px]">
              How we work together: four steps, built around you
            </h2>
          </div>
          <div className="relative mt-10 md:mt-13">
            <div className="absolute left-[12%] right-[12%] top-[27px] hidden h-px bg-[#e0d5c2] md:block" />
            <div className="relative grid grid-cols-1 gap-7 md:grid-cols-4">
              {STEPS.map((step, i) => (
                <div key={step.label} className="flex gap-4 text-left md:block md:text-center">
                  <div
                    className={`flex h-[48px] w-[48px] flex-none items-center justify-center rounded-full font-display text-[19px] md:mx-auto md:h-[54px] md:w-[54px] md:text-[21px] ${
                      i === STEPS.length - 1 ? "bg-terracotta text-cream-deep" : "bg-ink text-cream-deep"
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

      <section className="bg-cream px-6 py-12 md:px-10 md:py-22">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="font-display text-[24px] font-medium leading-tight text-ink md:text-[32px]">
            Ready to see what a real workup finds?
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-body-soft md:text-[16px]">
            A half hour with our team to look at your story and decide if root-cause care is your next step.
          </p>
          <Link
            href="/start"
            className="mt-6 rounded-[5px] bg-terracotta px-7 py-3.5 text-[14.5px] font-semibold text-cream no-underline hover:bg-terracotta-hover"
          >
            Book the $99 Symptom Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
