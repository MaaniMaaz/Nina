import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Eyebrow from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Dr. Nina Ross, ND PhD",
  description:
    "Meet Dr. Nina Ross, ND PhD \u2014 a root-cause functional medicine physician in Atlanta, credentialed in functional medicine, holistic health, and trichology.",
  alternates: { canonical: "/about" },
};

const CREDENTIALS = [
  "Ph.D. in Functional Medicine",
  "Board Certified in Holistic Health, ANMCB",
  "Board Certified Trichologist, WTS",
  "NPI #1164884078 \u00B7 Atlanta, GA",
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-cream px-6 py-16 sm:px-10 sm:py-24 md:py-28">
        <div className="mx-auto grid max-w-5xl items-center gap-10 sm:grid-cols-2 md:gap-16">
          <div className="relative h-[340px] w-full overflow-hidden rounded-[22px] shadow-[0_24px_50px_rgba(46,33,27,0.14)] sm:h-[420px]">
            <Image
              src="/images/dr-nina.jpg"
              alt="Dr. Nina Ross, ND PhD"
              fill
              priority
              className="object-cover object-[50%_20%]"
            />
          </div>
          <div>
            <Eyebrow number="01" label="Meet your doctor" />
            <h1 className="mt-3.5 font-display text-[32px] font-medium leading-tight text-ink sm:text-[42px] md:text-[46px]">
              Dr. Nina Ross, ND PhD
            </h1>
            <p className="mt-3 font-display text-[18px] italic leading-snug text-terracotta sm:text-[20px]">
              The relationship is part of the medicine.
            </p>
            <p className="mt-5 text-[15.5px] leading-relaxed text-body">
              For years I watched people, so many of them women who looked like me, carry symptoms that no one
              would slow down to explain. So I built the practice I wished they could walk into. One where you are
              believed first, investigated thoroughly, and treated as a whole person with a life, not a fifteen
              minute slot.
            </p>
            <p className="mt-4 text-[15.5px] leading-relaxed text-body">
              When someone finally feels seen, the healing has already begun.
            </p>
            <div className="mt-6 flex flex-col gap-2 border-t border-ink/10 pt-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
                Credentials &amp; training
              </div>
              <ul className="flex flex-col gap-1.5">
                {CREDENTIALS.map((c) => (
                  <li key={c} className="text-[14px] leading-relaxed text-body-soft">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-6">
              <Link
                href="/start"
                className="rounded-[5px] bg-terracotta px-6.5 py-3.5 text-[14.5px] font-semibold text-cream no-underline hover:bg-terracotta-hover"
              >
                Book the $99 Symptom Consultation
              </Link>
              <Link
                href="/approach"
                className="border-b-[1.5px] border-ink/20 pb-0.5 text-[14px] font-medium text-body no-underline hover:border-terracotta hover:text-ink"
              >
                See how we work together →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand px-6 py-16 sm:px-10 sm:py-22">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Eyebrow number="02" label="In their words" align="center" />
          <p className="mt-4 font-display text-[22px] leading-snug text-ink italic sm:text-[26px]">
            &ldquo;She was the first doctor who let me finish a sentence. For the first time I felt like a whole
            person in the room.&rdquo;
          </p>
          <p className="mt-4 text-[13.5px] font-semibold uppercase tracking-[0.14em] text-terracotta">
            Tasha M. &middot; Atlanta patient
          </p>
        </div>
      </section>
    </>
  );
}
