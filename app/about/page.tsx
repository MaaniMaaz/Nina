import type { Metadata } from "next";
import SmartImage from "@/components/ui/SmartImage";
import Link from "next/link";
import Eyebrow from "@/components/ui/Eyebrow";
import ContactForm from "@/components/forms/ContactForm";
import { resolveMedia } from "@/lib/cms/media";
import { shouldUnoptimizeImage } from "@/lib/images";

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

export default async function AboutPage() {
  const portrait = await resolveMedia("dr-nina");
  return (
    <>
      <section className="bg-cream px-6 py-12 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2 md:gap-16">
          <div className="relative h-[240px] w-full overflow-hidden rounded-[18px] shadow-[0_24px_50px_rgba(46,33,27,0.14)] md:h-[420px] md:rounded-[22px]">
            <SmartImage
              src={portrait}
              alt="Dr. Nina Ross, ND PhD"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-[50%_20%]"
              unoptimized={shouldUnoptimizeImage(portrait)}
            />
          </div>
          <div>
            <Eyebrow number="01" label="Meet your doctor" />
            <h1 className="mt-3.5 font-display text-[30px] font-medium leading-tight text-ink md:text-[46px]">
              Dr. Nina Ross, ND PhD
            </h1>
            <p className="mt-3 font-display text-[17px] italic leading-snug text-terracotta md:text-[20px]">
              The relationship is part of the medicine.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-body md:mt-5 md:text-[15.5px]">
              For years I watched people, so many of them women who looked like me, carry symptoms that no one
              would slow down to explain. So I built the practice I wished they could walk into. One where you are
              believed first, investigated thoroughly, and treated as a whole person with a life, not a fifteen
              minute slot.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-body md:text-[15.5px]">
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
            <div className="mt-7 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:gap-6">
              <Link
                href="/start"
                className="rounded-[5px] bg-terracotta px-6.5 py-3.5 text-center text-[14.5px] font-semibold text-cream no-underline hover:bg-terracotta-hover"
              >
                Book the $99 Symptom Consultation
              </Link>
              <Link
                href="/approach"
                className="border-b-[1.5px] border-ink/20 pb-0.5 text-center text-[14px] font-medium text-body no-underline hover:border-terracotta hover:text-ink md:text-left"
              >
                See how we work together →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand px-6 py-12 md:px-10 md:py-22">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Eyebrow number="02" label="In their words" align="center" />
          <p className="mt-4 font-display text-[20px] italic leading-snug text-ink md:text-[26px]">
            &ldquo;She was the first doctor who let me finish a sentence. For the first time I felt like a whole
            person in the room.&rdquo;
          </p>
          <p className="mt-4 text-[13.5px] font-semibold uppercase tracking-[0.14em] text-terracotta">
            Tasha M. &middot; Atlanta patient
          </p>
        </div>
      </section>

      <section id="contact" className="bg-cream-deep px-6 py-12 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-start">
          <div>
            <Eyebrow number="03" label="Get in touch" />
            <h2 className="mt-3.5 font-display text-[28px] font-medium leading-tight text-ink md:text-[36px]">
              Prefer to write first?
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-body">
              Send a note for general questions. For booking the $99 Symptom Consultation, use{" "}
              <Link href="/start" className="font-semibold text-terracotta">
                Start
              </Link>{" "}
              — Acuity handles the schedule.
            </p>
            <p className="mt-4 text-[14px] text-muted">
              Or email{" "}
              <a href="mailto:hello@ninarossfm.com" className="font-semibold text-ink">
                hello@ninarossfm.com
              </a>
              .
            </p>
          </div>
          <ContactForm className="rounded-2xl border border-ink/10 bg-cream p-5 shadow-[0_8px_24px_rgba(46,33,27,0.06)] md:p-6" />
        </div>
      </section>
    </>
  );
}
