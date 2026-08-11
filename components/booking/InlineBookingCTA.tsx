"use client";

import { useState } from "react";
import BookingDoorCard from "./BookingDoorCard";
import EditableText from "@/components/admin/EditableText";
import { useEdit } from "@/components/admin/EditContext";

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

/** Compact booking CTA at end of longform pages — doors match CLAUDE.md / Booking dumps. */
export default function InlineBookingCTA({ heading, intro, avatarSlotId }: InlineBookingCTAProps) {
  const [door, setDoor] = useState<Door>(null);
  const edit = useEdit();
  const E = edit?.enabled;

  return (
    <section className="relative overflow-hidden bg-ink px-6 py-[34px] md:px-10 md:py-30">
      <div className="grain-overlay opacity-25 mix-blend-overlay" />
      <div className="relative z-10 mx-auto max-w-[640px] text-center">
        {/* Avatar removed by request: no circular photo above heading */}
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold md:text-[11px]">Start here</div>
        <h2 className="mt-2.5 font-display text-[26px] font-medium leading-tight text-cream-deep md:mt-3 md:text-[42px]">
          {E ? (
            <EditableText path="startHere.heading" value={heading} multiline />
          ) : (
            heading
          )}
        </h2>
        <p className="mx-auto mt-2 max-w-[30em] text-[14px] leading-relaxed text-[#d8cdbe] md:text-[16px]">
          {E ? (
            <EditableText path="startHere.intro" value={intro} multiline />
          ) : (
            intro
          )}
        </p>

        {!door && (
          <>
            <div className="mx-auto mt-5 flex max-w-[30em] items-center gap-3 md:mt-6.5">
              <span className="h-px flex-1 bg-cream-deep/16" />
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[#b3a797] md:text-[10px]">
                Choose your path
              </span>
              <span className="h-px flex-1 bg-cream-deep/16" />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 text-left md:mt-5.5 md:grid-cols-2 md:gap-5">
              <BookingDoorCard kind="inperson" selected={false} onSelect={() => setDoor("inperson")} />
              <BookingDoorCard kind="virtual" selected={false} onSelect={() => setDoor("virtual")} />
            </div>
            <p className="mt-4 text-[11.5px] text-[#9a8d7e] md:mt-5.5 md:text-xs">
              No referral needed · HSA / FSA eligible
            </p>
          </>
        )}

        {door && (
          <>
            <button
              type="button"
              onClick={() => setDoor(null)}
              className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-gold md:mt-6.5 md:text-sm"
            >
              <span aria-hidden className="text-lg">
                ←
              </span>{" "}
              Back to options
            </button>
            <div className="mb-3 mt-3.5 flex items-center justify-center gap-2.5 md:mb-4 md:mt-4">
              <span className="h-[1.5px] w-5 bg-gold" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold md:text-[11px]">
                {DOOR_LABEL[door]}
              </span>
            </div>
            <div className="mx-auto max-w-[600px] overflow-hidden rounded-[14px] border border-ink/10 bg-cream shadow-[0_20px_44px_rgba(0,0,0,0.28)] md:rounded-2xl">
              <iframe
                src={SCHEDULER_SRC[door]}
                title="Book your $99 consultation"
                width="100%"
                height="640"
                className="block h-[640px] w-full border-0 md:h-[720px]"
                allow="payment"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
