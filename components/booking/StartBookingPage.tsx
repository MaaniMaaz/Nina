"use client";

import { useState } from "react";
import BookingDoorCard from "@/components/booking/BookingDoorCard";

type Door = "inperson" | "virtual" | null;

const SCHEDULER_SRC: Record<"inperson" | "virtual", string> = {
  inperson: "https://app.acuityscheduling.com/schedule.php?owner=12622771&appointmentType=36940894",
  virtual: "https://app.acuityscheduling.com/schedule.php?owner=12622771&appointmentType=42808083",
};

const DOOR_LABEL: Record<"inperson" | "virtual", string> = {
  inperson: "In-Person · Atlanta studio",
  virtual: "Virtual · secure video",
};

const WALKTHROUGH = [
  {
    title: "Tell us the whole story",
    desc: "Every symptom, every \u201Cnormal\u201D lab, every thing you were told to live with.",
  },
  {
    title: "Get a first read",
    desc: "Our honest take on what may be driving how you feel.",
  },
  {
    title: "See the path forward",
    desc: "A clear picture of what working together would look like.",
  },
];

/**
 * Pixel-matched to:
 * - Nina Ross Booking - Chosen (Mobile).dc.html  (bg #ECE3D2)
 * - Nina Ross Booking - Desktop.dc.html
 */
export default function StartBookingPage() {
  const [door, setDoor] = useState<Door>(null);

  return (
    <div className="relative min-h-full bg-sand">
      <div className="grain-overlay opacity-40 mix-blend-multiply" style={{ backgroundSize: "180px" }} />

      {/* ─── MOBILE (Chosen dump) ─── */}
      <div className="relative z-[2] px-[22px] pb-7 pt-6 md:hidden">
        {!door ? (
          <>
            <div className="text-center">
              <div className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-terracotta">
                The $99 Symptom Consultation
              </div>
              <h1 className="mt-[9px] font-display text-[32px] font-medium leading-[1.04] tracking-[-0.02em] text-ink">
                Two ways to <span className="italic text-terracotta">start.</span>
              </h1>
              <p className="mt-2.5 text-[13.5px] leading-[1.55] text-body">
                For $99, you sit down with us and finally get heard. Here&rsquo;s how it goes.
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-[11px]">
              {WALKTHROUGH.map((step, i) => (
                <div key={step.title} className="flex items-start gap-3">
                  <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-ink font-display text-sm text-gold-deep">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-display text-[15.5px] font-medium text-ink">{step.title}</div>
                    <div className="mt-px text-xs leading-[1.45] text-body-soft">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-1 mt-5 flex items-center gap-2.5">
              <span className="h-px flex-1 bg-ink/[0.12]" />
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#9a8b7a]">
                Choose your path
              </span>
              <span className="h-px flex-1 bg-ink/[0.12]" />
            </div>

            <div className="mt-3 flex flex-col gap-3">
              <BookingDoorCard kind="inperson" selected={false} onSelect={() => setDoor("inperson")} />
              <BookingDoorCard kind="virtual" selected={false} onSelect={() => setDoor("virtual")} />
            </div>

            <div className="mt-[18px] flex items-center justify-center gap-[11px]">
              <span className="text-xs tracking-[2px] text-gold-deep">★★★★★</span>
              <span className="text-[11.5px] text-body-soft">
                <strong>4.9</strong> · 300+ patients · self-pay, transparent
              </span>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* ─── DESKTOP (Booking Desktop dump) ─── */}
      <div className="relative z-[2] hidden md:block">
        <section className="mx-auto max-w-[1180px] px-[clamp(40px,6vw,92px)] pt-[clamp(48px,6vw,84px)] text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-terracotta">
            Start here · The $99 Symptom Consultation
          </div>
          <h1 className="mt-4 font-display text-[clamp(44px,5.4vw,74px)] font-medium leading-[1.02] tracking-[-0.02em] text-ink">
            Two ways to <span className="italic text-terracotta">start.</span>
          </h1>
          <p className="mx-auto mt-[18px] max-w-[50ch] text-[clamp(16px,1.4vw,19px)] leading-[1.6] text-body">
            For $99, you sit down with us and finally get heard. Same half hour, same price, in the studio or on
            secure video. Here&rsquo;s how it goes.
          </p>
        </section>

        <section className="mx-auto grid max-w-[1100px] grid-cols-3 gap-[30px] px-[clamp(40px,6vw,92px)] pt-[clamp(36px,4vw,56px)]">
          {WALKTHROUGH.map((step, i) => (
            <div key={step.title} className="text-center">
              <div className="mx-auto flex h-[46px] w-[46px] items-center justify-center rounded-full bg-ink font-display text-[22px] text-gold-deep">
                {i + 1}
              </div>
              <div className="mt-4 font-display text-[21px] font-medium text-ink">{step.title}</div>
              <div className="mt-[7px] text-[14.5px] leading-[1.55] text-body-soft">{step.desc}</div>
            </div>
          ))}
        </section>

        <div className="mx-auto mt-[clamp(44px,5vw,64px)] flex max-w-[1100px] items-center gap-[18px] px-[clamp(40px,6vw,92px)]">
          <span className="h-px flex-1 bg-ink/[0.14]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a8b7a]">
            Choose your path
          </span>
          <span className="h-px flex-1 bg-ink/[0.14]" />
        </div>

        <section className="mx-auto mt-7 max-w-[1100px] px-[clamp(40px,6vw,92px)]">
          <div className="grid grid-cols-2 gap-[26px]">
            <BookingDoorCard
              kind="inperson"
              selected={door === "inperson"}
              onSelect={() => setDoor("inperson")}
            />
            <BookingDoorCard
              kind="virtual"
              selected={door === "virtual"}
              onSelect={() => setDoor("virtual")}
            />
          </div>

          {door && (
            <div className="mt-10 overflow-hidden rounded-[20px] border border-ink/10 bg-cream shadow-[0_24px_54px_rgba(46,33,27,0.14)]">
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
          )}
        </section>

        <div className="mx-auto mt-[clamp(40px,5vw,60px)] flex max-w-[1100px] flex-wrap items-center justify-center gap-4 px-[clamp(40px,6vw,92px)] pb-[clamp(56px,6vw,84px)]">
          <span className="text-[15px] tracking-[3px] text-gold-deep">★★★★★</span>
          <span className="text-sm text-body">
            <strong>4.9</strong> from 300+ patients
          </span>
          <span className="h-1 w-1 rounded-full bg-[#c5b9a8]" />
          <span className="text-sm text-body">Self-pay, transparent pricing</span>
          <span className="h-1 w-1 rounded-full bg-[#c5b9a8]" />
          <span className="text-sm text-body">No referral needed</span>
        </div>
      </div>
    </div>
  );
}
