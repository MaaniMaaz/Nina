import type { Metadata } from "next";
import Link from "next/link";
import Eyebrow from "@/components/ui/Eyebrow";
import ImageSlot from "@/components/ui/ImageSlot";
import { TREATMENTS_INDEX } from "@/content/treatments";
import { treatmentCardImage } from "@/content/treatment-images";

export const metadata: Metadata = {
  title: "Treatments We Use",
  description:
    "Advanced lab testing, hormone restoration, IV therapy, peptide therapy, GLP-1 weight loss, and the full functional medicine toolkit Dr. Nina Ross uses to treat root causes, in Atlanta and virtually across Georgia.",
  alternates: { canonical: "/treatments" },
};

export default function TreatmentsIndexPage() {
  return (
    <>
      <section className="px-6 pb-8 pt-10 md:px-[clamp(40px,6vw,100px)] md:pb-14 md:pt-20">
        <div className="mx-auto max-w-5xl text-center">
          <Eyebrow label="Treatments we use" align="center" />
          <h1 className="mx-auto mt-4 max-w-[24ch] font-display text-[32px] font-medium leading-tight text-ink md:text-[58px]">
            A deep toolkit, never sold off a menu.
          </h1>
          <p className="mx-auto mt-4 max-w-[56ch] text-[15px] leading-relaxed text-body md:mt-4.5 md:text-[18px]">
            Every therapy here is physician-ordered off your labs, and matched to you, as one tool inside a plan
            treating the actual cause of how you feel.
          </p>
        </div>
      </section>

      <section className="bg-sand px-6 pb-14 md:px-[clamp(40px,6vw,100px)] md:pb-28">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {TREATMENTS_INDEX.map((t) => (
            <Link
              key={t.slug}
              href={`/treatments/${t.slug}`}
              className="block overflow-hidden rounded-[16px] bg-cream shadow-[0_12px_28px_rgba(46,33,27,0.08)] transition-shadow hover:shadow-[0_20px_40px_rgba(46,33,27,0.14)] md:rounded-[20px]"
            >
              <ImageSlot
                id={treatmentCardImage(t.slug)}
                alt={t.name}
                placeholder="Photo"
                className="h-[120px] w-full md:h-[180px]"
              />
              <div className="p-3.5 pb-4 md:p-5.5 md:pb-6.5">
                <div className="font-display text-[16px] text-ink md:text-[20px]">{t.name}</div>
                <div className="mt-1 text-[12px] leading-relaxed text-muted md:mt-1.5 md:text-[13.5px]">{t.teaser}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
