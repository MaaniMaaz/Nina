import type { Metadata } from "next";
import Link from "next/link";
import Eyebrow from "@/components/ui/Eyebrow";
import ImageSlot from "@/components/ui/ImageSlot";
import { CONDITIONS_INDEX } from "@/content/conditions";

export const metadata: Metadata = {
  title: "Conditions We Treat",
  description:
    "Root-cause functional medicine care for fatigue, gut health, hair loss, hormones, menopause, metabolic health, mood, PCOS, sexual health, unexplained symptoms, and weight, in Atlanta and virtually across Georgia.",
  alternates: { canonical: "/conditions" },
};

export default function ConditionsIndexPage() {
  return (
    <>
      <section className="px-6 pb-10 pt-14 sm:px-10 sm:pb-14 sm:pt-20 md:px-[clamp(40px,6vw,100px)]">
        <div className="mx-auto max-w-5xl text-center">
          <Eyebrow label="Conditions we treat" align="center" />
          <h1 className="mx-auto mt-4 max-w-[20ch] font-display text-[38px] font-medium leading-tight text-ink sm:text-[50px] md:text-[58px]">
            Whatever changed, we&rsquo;ll find out why.
          </h1>
          <p className="mx-auto mt-4.5 max-w-[56ch] text-[16px] leading-relaxed text-body sm:text-[18px]">
            Every one of these starts the same way: your labs looked &ldquo;normal,&rdquo; but you didn&rsquo;t feel
            it. We read deeper, connect the dots, and build a plan around your body.
          </p>
        </div>
      </section>

      <section className="bg-sand px-6 pb-20 sm:px-10 sm:pb-28 md:px-[clamp(40px,6vw,100px)]">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {CONDITIONS_INDEX.map((c) => (
            <Link
              key={c.slug}
              href={`/conditions/${c.slug}`}
              className="block overflow-hidden rounded-[20px] bg-cream shadow-[0_12px_28px_rgba(46,33,27,0.08)] transition-shadow hover:shadow-[0_20px_40px_rgba(46,33,27,0.14)]"
            >
              <ImageSlot alt={c.name} placeholder="Photo" className="h-[180px] w-full" />
              <div className="p-5.5 pb-6.5">
                <div className="font-display text-[20px] text-ink">{c.name}</div>
                <div className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{c.teaser}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
