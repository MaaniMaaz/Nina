import type { Metadata } from "next";
import BookingChooser from "@/components/booking/BookingChooser";

export const metadata: Metadata = {
  title: "Book the $99 Symptom Consultation",
  description:
    "For $99, sit down with Dr. Nina Ross and finally get heard. Same half hour, same price, in our Atlanta studio or on secure video. Book in-person or virtual.",
  alternates: { canonical: "/start" },
};

const WALKTHROUGH = [
  {
    title: "Tell us the whole story",
    desc: "Every symptom, every \u201Cnormal\u201D lab, every thing you were told to live with.",
  },
  {
    title: "Get a first read",
    desc: "Our honest take on what may be driving how you feel.",
  },
  {
    title: "See the path forward",
    desc: "A clear picture of what working together would look like.",
  },
];

export default function StartPage() {
  return (
    <div className="relative">
      <div className="grain-overlay opacity-25 mix-blend-multiply" />
      <section className="relative z-[2] mx-auto max-w-[1180px] px-6 pt-12 text-center sm:px-10 sm:pt-16 md:px-[clamp(40px,6vw,92px)] md:pt-20">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-terracotta">
          Start here · The $99 Symptom Consultation
        </div>
        <h1 className="mt-4 font-display text-[44px] font-medium leading-[1.02] tracking-tight text-ink sm:text-[58px] md:text-[74px]">
          Two ways to <span className="italic text-terracotta">start.</span>
        </h1>
        <p className="mx-auto mt-4.5 max-w-[50ch] text-[16px] leading-relaxed text-body sm:text-[19px]">
          For $99, you sit down with us and finally get heard. Same half hour, same price, in the studio or on
          secure video. Here&rsquo;s how it goes.
        </p>
      </section>

      <section className="relative z-[2] mx-auto grid max-w-[1100px] grid-cols-1 gap-8 px-6 pt-9 sm:grid-cols-3 sm:gap-7.5 sm:px-10 sm:pt-14 md:px-[clamp(40px,6vw,92px)]">
        {WALKTHROUGH.map((step, i) => (
          <div key={step.title} className="text-center">
            <div className="mx-auto flex h-[46px] w-[46px] items-center justify-center rounded-full bg-ink font-display text-[22px] text-gold-deep">
              {i + 1}
            </div>
            <div className="mt-4 font-display text-[21px] font-medium text-ink">{step.title}</div>
            <div className="mt-1.75 text-[14.5px] leading-relaxed text-body-soft">{step.desc}</div>
          </div>
        ))}
      </section>

      <div className="relative z-[2] mx-auto mt-11 flex max-w-[1100px] items-center gap-4.5 px-6 sm:mt-16 sm:px-10 md:px-[clamp(40px,6vw,92px)]">
        <span className="h-px flex-1 bg-ink/[0.14]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a8b7a]">
          Choose your path
        </span>
        <span className="h-px flex-1 bg-ink/[0.14]" />
      </div>

      <section className="relative z-[2] mx-auto max-w-[1100px] px-6 pt-7 pb-14 sm:px-10 sm:pb-16 md:px-[clamp(40px,6vw,92px)]">
        <BookingChooser />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <span className="text-[15px] tracking-[3px] text-gold-deep">★★★★★</span>
          <span className="text-sm text-body">
            <strong>4.9</strong> from 300+ patients
          </span>
          <span className="h-1 w-1 rounded-full bg-[#c5b9a8]" />
          <span className="text-sm text-body">Self-pay, transparent pricing</span>
          <span className="h-1 w-1 rounded-full bg-[#c5b9a8]" />
          <span className="text-sm text-body">No referral needed</span>
        </div>
      </section>
    </div>
  );
}
