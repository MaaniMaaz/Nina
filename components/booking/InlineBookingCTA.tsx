"use client";

import { useState } from "react";
import ImageSlot from "@/components/ui/ImageSlot";
import BookingDoorCard from "./BookingDoorCard";

type Door = "inperson" | "virtual" | null;

const SCHEDULER_SRC: Record<"inperson" | "virtual", string> = {
  inperson: "https://app.acuityscheduling.com/schedule.php?owner=12622771&appointmentType=36940894",
  virtual: "https://app.acuityscheduling.com/schedule.php?owner=12622771&appointmentType=42808083",
};

const DOOR_LABEL: Record<"inperson" | "virtual", string> = {
  inperson: "In-Person · Atlanta studio",
  virtual: "Virtual · secure video",
};

interface InlineBookingCTAProps {
  heading: string;
  intro: string;
  avatarSlotId?: string;
}

/** The compact "Start here" booking CTA embedded at the end of every content page. */
export default function InlineBookingCTA({ heading, intro, avatarSlotId }: InlineBookingCTAProps) {
  const [door, setDoor] = useState<Door>(null);

  return (
    <section className="relative overflow-hidden bg-ink px-6 py-18 sm:px-10 sm:py-28 md:py-30">
      <div className="grain-overlay opacity-25 mix-blend-overlay" />
      <div className="relative z-10 mx-auto max-w-[640px] text-center">
        <ImageSlot
          id={avatarSlotId}
          alt="Dr. Nina Ross, ND PhD"
          shape="circle"
          className="mx-auto mb-5 h-[92px] w-[92px] shadow-[0_10px_26px_rgba(0,0,0,0.32)] outline outline-2 outline-offset-[3px] outline-gold/55"
        />
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Start here</div>
        <h2 className="mt-3 font-display text-[32px] font-medium leading-tight text-cream-deep sm:text-[42px]">
          {heading}
        </h2>
        <p className="mx-auto mt-2 max-w-[30em] text-[16px] leading-relaxed text-[#d8cdbe]">{intro}</p>

        {!door && (
          <>
            <div className="mx-auto mt-6.5 flex max-w-[30em] items-center gap-3">
              <span className="h-px flex-1 bg-cream-deep/16" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b3a797]">
                Choose your path
              </span>
              <span className="h-px flex-1 bg-cream-deep/16" />
            </div>
            <div className="mt-5.5 grid grid-cols-1 gap-5 text-left sm:grid-cols-2">
              <BookingDoorCard kind="inperson" selected={false} onSelect={() => setDoor("inperson")} mediaHeightClassName="h-[170px]" />
              <BookingDoorCard kind="virtual" selected={false} onSelect={() => setDoor("virtual")} mediaHeightClassName="h-[170px]" />
            </div>
            <p className="mt-5.5 text-xs text-[#9a8d7e]">No referral needed · HSA / FSA eligible</p>
          </>
        )}

        {door && (
          <>
            <button
              type="button"
              onClick={() => setDoor(null)}
              className="mt-6.5 inline-flex items-center gap-2 text-sm font-semibold text-gold"
            >
              <span aria-hidden className="text-lg">
                ←
              </span>{" "}
              Back to options
            </button>
            <div className="mb-4 mt-4 flex items-center justify-center gap-2.5">
              <span className="h-[1.5px] w-5 bg-gold" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                {DOOR_LABEL[door]}
              </span>
            </div>
            <div className="mx-auto max-w-[600px] overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-[0_20px_44px_rgba(0,0,0,0.28)]">
              <iframe
                src={SCHEDULER_SRC[door]}
                title="Book your $99 consultation"
                width="100%"
                height="720"
                className="block w-full border-0"
                allow="payment"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
