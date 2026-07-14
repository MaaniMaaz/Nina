import Link from "next/link";
import ImageSlot from "@/components/ui/ImageSlot";

export default function BylineBand({ note, avatarSlotId }: { note: string; avatarSlotId?: string }) {
  return (
    <section className="bg-[#1f1610] px-6 py-8.5 sm:px-10 md:px-[clamp(40px,6vw,100px)]">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3.75">
          <ImageSlot id={avatarSlotId} alt="" shape="circle" className="h-9 w-9 flex-none" />
          <p className="text-xs leading-relaxed text-[#8a7d6f]">
            {note}{" "}
            <Link href="/about" className="font-semibold text-[#b6a796] no-underline hover:text-cream-deep">
              Dr. Nina Ross, ND PhD
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
