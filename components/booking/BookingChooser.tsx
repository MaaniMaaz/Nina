"use client";

import { useState } from "react";
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

/** Full standalone booking chooser used on the /start page. */
export default function BookingChooser() {
  const [door, setDoor] = useState<Door>(null);

  return (
    <div>
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-6.5 sm:grid-cols-2">
        <BookingDoorCard kind="inperson" selected={door === "inperson"} onSelect={() => setDoor("inperson")} />
        <BookingDoorCard kind="virtual" selected={door === "virtual"} onSelect={() => setDoor("virtual")} />
      </div>

      {door && (
        <div className="mx-auto mt-10 max-w-[1100px]">
          <div className="overflow-hidden rounded-[20px] border border-ink/10 bg-cream shadow-[0_24px_54px_rgba(46,33,27,0.14)]">
            <div className="flex items-center justify-between gap-4 border-b border-ink/[0.08] px-6.5 py-5">
              <div className="flex items-center gap-2.5">
                <span className="h-[1.5px] w-5.5 bg-gold-deep" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">
                  Booking · {DOOR_LABEL[door]}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDoor(door === "inperson" ? "virtual" : "inperson")}
                className="cursor-pointer text-[13.5px] font-semibold text-body-soft underline decoration-1 underline-offset-[3px]"
              >
                {door === "inperson" ? "Prefer virtual instead?" : "Prefer in-person instead?"}
              </button>
            </div>
            <iframe
              src={SCHEDULER_SRC[door]}
              title="Book your $99 consultation"
              width="100%"
              height="820"
              className="block w-full border-0"
              allow="payment"
            />
          </div>
        </div>
      )}
    </div>
  );
}
