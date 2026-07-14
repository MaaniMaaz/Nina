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
      <section className="px-6 pb-10 pt-14 sm:px-10 sm:pb-14 sm:pt-20 md:px-[clamp(40px,6vw,100px)]">
        <div className="mx-auto max-w-5xl text-center">
          <Eyebrow label="Treatments we use" align="center" />
          <h1 className="mx-auto mt-4 max-w-[24ch] font-display text-[38px] font-medium leading-tight text-ink sm:text-[50px] md:text-[58px]">
            A deep toolkit, never sold off a menu.
          </h1>
          <p className="mx-auto mt-4.5 max-w-[56ch] text-[16px] leading-relaxed text-body sm:text-[18px]">
            Every therapy here is physician-ordered off your labs, and matched to you, as one tool inside a plan
            treating the actual cause of how you feel.
          </p>
        </div>
      </section>

      <section className="bg-sand px-6 pb-20 sm:px-10 sm:pb-28 md:px-[clamp(40px,6vw,100px)]">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {TREATMENTS_INDEX.map((t) => (
            <Link
              key={t.slug}
              href={`/treatments/${t.slug}`}
              className="block overflow-hidden rounded-[20px] bg-cream shadow-[0_12px_28px_rgba(46,33,27,0.08)] transition-shadow hover:shadow-[0_20px_40px_rgba(46,33,27,0.14)]"
            >
              <ImageSlot
                id={treatmentCardImage(t.slug)}
                alt={t.name}
                placeholder="Photo"
                className="h-[180px] w-full"
              />
              <div className="p-5.5 pb-6.5">
                <div className="font-display text-[20px] text-ink">{t.name}</div>
                <div className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{t.teaser}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
