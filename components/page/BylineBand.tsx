"use client";

import Link from "next/link";
import ImageSlot from "@/components/ui/ImageSlot";
import EditableText from "@/components/admin/EditableText";
import { useEdit } from "@/components/admin/EditContext";

/**
 * E-E-A-T byline — matches Condition/Treatment dump §10.
 */
export default function BylineBand({ note, avatarSlotId }: { note: string; avatarSlotId?: string }) {
  const edit = useEdit();
  const E = edit?.enabled;

  return (
    <section className="bg-[#1f1610] px-6 py-[26px] md:px-[clamp(40px,6vw,100px)] md:py-[34px] md:pb-11">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex items-center gap-[15px]">
          <ImageSlot id={avatarSlotId} alt="Dr. Nina Ross" shape="circle" className="h-14 w-14 flex-none" />
          <div>
            <div className="text-[13.5px] leading-[1.45] text-[#cdbfae]">
              Medically reviewed by{" "}
              <Link href="/about" className="font-bold text-cream-deep no-underline hover:text-gold">
                Dr. Nina Ross, ND PhD
              </Link>
            </div>
            <div className="mt-[3px] text-[11.5px] text-[#8a7c6c]">
              Board-Certified in Holistic Health &amp; Trichology · Reviewed June 2026
            </div>
          </div>
        </div>
        <p className="mt-[18px] max-w-[60em] text-[11.5px] leading-[1.55] text-[#6f6353]">
          {E ? <EditableText path="bylineNote" value={note} multiline /> : note}
        </p>
      </div>
    </section>
  );
}
