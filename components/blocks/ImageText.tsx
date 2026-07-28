import Eyebrow from "@/components/ui/Eyebrow";
import ImageSlot from "@/components/ui/ImageSlot";

interface ImageTextProps {
  number: string;
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
  imageSlotId?: string;
  imageAlt?: string;
  reverse?: boolean;
}

export default function ImageText({
  number,
  eyebrow,
  heading,
  paragraphs,
  imageSlotId,
  imageAlt,
  reverse,
}: ImageTextProps) {
  return (
    <section className="bg-cream px-6 py-14 md:px-10 md:py-28">
      <div
        className={`mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-16 ${
          reverse ? "[&>*:first-child]:sm:order-2" : ""
        }`}
      >
        <div>
          {eyebrow && <Eyebrow number={number} label={eyebrow} />}
          <h2 className="mt-3.5 font-display text-[26px] font-medium leading-tight text-ink sm:text-[32px] md:text-[36px]">
            {heading}
          </h2>
          {paragraphs.map((p) => (
            <p key={p} className="mt-4 text-[15.5px] leading-relaxed text-body">
              {p}
            </p>
          ))}
        </div>
        <ImageSlot
          id={imageSlotId}
          alt={imageAlt ?? heading}
          placeholder="Photo"
          className="h-[280px] w-full rounded-[22px] sm:h-[340px]"
        />
      </div>
    </section>
  );
}
