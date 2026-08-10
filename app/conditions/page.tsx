import type { Metadata } from "next";
import Link from "next/link";
import Eyebrow from "@/components/ui/Eyebrow";
import ImageSlot from "@/components/ui/ImageSlot";
import { resolveIndex } from "@/lib/cms/resolve";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Conditions We Treat",
  description:
    "Root-cause functional medicine care for fatigue, gut health, hair loss, hormones, menopause, metabolic health, mood, PCOS, sexual health, unexplained symptoms, and weight, in Atlanta and virtually across Georgia.",
  alternates: { canonical: "/conditions" },
};

export default async function ConditionsIndexPage() {
  const items = await resolveIndex("condition");

  return (
    <>
      <section className="px-6 pb-8 pt-10 md:px-[clamp(40px,6vw,100px)] md:pb-14 md:pt-20">
        <div className="mx-auto max-w-5xl text-center">
          <Eyebrow label="Conditions we treat" align="center" />
          <h1 className="mx-auto mt-4 max-w-[20ch] font-display text-[32px] font-medium leading-tight text-ink md:text-[58px]">
            Whatever changed, we&rsquo;ll find out why.
          </h1>
          <p className="mx-auto mt-4 max-w-[56ch] text-[15px] leading-relaxed text-body md:mt-4.5 md:text-[18px]">
            Every one of these starts the same way: your labs looked &ldquo;normal,&rdquo; but you didn&rsquo;t feel
            it. We read deeper, connect the dots, and build a plan around your body.
          </p>
        </div>
      </section>

      <section className="bg-sand px-6 pb-14 md:px-[clamp(40px,6vw,100px)] md:pb-28">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {items.map((c) => (
            <Link
              key={c.slug}
              href={`/conditions/${c.slug}`}
              className="block overflow-hidden rounded-[16px] bg-cream shadow-[0_12px_28px_rgba(46,33,27,0.08)] transition-shadow hover:shadow-[0_20px_40px_rgba(46,33,27,0.14)] md:rounded-[20px]"
            >
              <ImageSlot
                src={c.coverImageUrl}
                alt={c.name}
                placeholder="Photo"
                className="h-[120px] w-full md:h-[180px]"
              />
              <div className="p-3.5 pb-4 md:p-5.5 md:pb-6.5">
                <div className="font-display text-[16px] text-ink md:text-[20px]">{c.name}</div>
                <div className="mt-1 text-[12px] leading-relaxed text-muted md:mt-1.5 md:text-[13.5px]">{c.teaser}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
