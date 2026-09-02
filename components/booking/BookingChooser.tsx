"use client";

import { useState } from "react";
import BookingDoorCard from "./BookingDoorCard";

import { acuitySrc } from "@/lib/booking";

type Door = "inperson" | "virtual" | null;

const SCHEDULER_SRC: Record<"inperson" | "virtual", string> = {
  inperson: acuitySrc("inperson"),
  virtual: acuitySrc("virtual"),
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
      {/* Mobile: hide doors once a path is chosen (matches Chosen Mobile dump) */}
      <div className={`mx-auto grid max-w-[1100px] grid-cols-1 gap-3 md:grid-cols-2 md:gap-[26px] ${door ? "hidden md:grid" : ""}`}>
        <BookingDoorCard kind="inperson" selected={door === "inperson"} onSelect={() => setDoor("inperson")} />
        <BookingDoorCard kind="virtual" selected={door === "virtual"} onSelect={() => setDoor("virtual")} />
      </div>

      {door && (
        <>
          {/* Mobile scheduler view */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setDoor(null)}
              className="mb-3.5 inline-flex items-center gap-[7px] text-[13px] font-semibold text-terracotta"
            >
              <span className="text-base" aria-hidden>
                ←
              </span>{" "}
              Back to options
            </button>
            <div className="mb-3 flex items-center gap-[9px]">
              <span className="h-[1.5px] w-[18px] bg-[#B08A3E]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                {DOOR_LABEL[door]}
              </span>
            </div>
            <div className="overflow-hidden rounded-[14px] border border-ink/10 bg-cream shadow-[0_14px_34px_rgba(46,33,27,0.1)]">
              <iframe
                src={SCHEDULER_SRC[door]}
                title="Book your $99 consultation"
                width="100%"
                height="640"
                className="block h-[640px] w-full border-0"
                allow="payment"
              />
            </div>
          </div>

          {/* Desktop scheduler below doors */}
          <div className="mx-auto mt-10 hidden max-w-[1100px] md:block">
            <div className="overflow-hidden rounded-[20px] border border-ink/10 bg-cream shadow-[0_24px_54px_rgba(46,33,27,0.14)]">
              <div className="flex items-center justify-between gap-4 border-b border-ink/[0.08] px-[26px] py-5">
                <div className="flex items-center gap-[11px]">
                  <span className="h-[1.5px] w-[22px] bg-[#B08A3E]" />
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
                className="block h-[820px] w-full border-0"
                allow="payment"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
