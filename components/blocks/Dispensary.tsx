"use client";

import { useState } from "react";
import EditableText from "@/components/admin/EditableText";
import { useEdit } from "@/components/admin/EditContext";
import {
  DISPENSARY_FOOTNOTE,
  DISPENSARY_INTRO,
  DISPENSARY_STATS,
  IV_BLENDS,
  IV_INGREDIENTS,
} from "@/content/dispensary";

function nameFont(len: number) {
  if (len >= 12) return "13px";
  if (len >= 11) return "13.5px";
  if (len >= 9) return "14px";
  return "15px";
}

export default function Dispensary({
  eyebrow = "The dispensary",
  heading = "A deep shelf to draw from, then one bag built for you",
  intro = DISPENSARY_INTRO,
  footnote = DISPENSARY_FOOTNOTE,
  blockIndex = 0,
}: {
  number?: string;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  footnote?: string;
  blockIndex?: number;
}) {
  const edit = useEdit();
  const E = edit?.enabled;
  const base = `blocks.${blockIndex}`;
  const [blend, setBlend] = useState("all");
  const active = IV_BLENDS.find((b) => b.key === blend) ?? IV_BLENDS[0];
  const allMode = active.key === "all";

  return (
    <section id="dispensary" className="relative overflow-hidden bg-[#233019] px-6 py-14 md:px-[clamp(40px,6vw,100px)] md:py-[clamp(64px,7vw,104px)]">
      <div className="pointer-events-none absolute inset-0 bg-[#233019]/95" />
      <div className="grain-overlay pointer-events-none opacity-20 mix-blend-overlay" style={{ backgroundSize: "200px" }} />
      <div className="relative z-[2] mx-auto max-w-[1240px]">
        <div className="grid items-start gap-10 md:grid-cols-[0.82fr_1.18fr] md:gap-[clamp(40px,5vw,72px)]">
          <div className="md:sticky md:top-[90px]">
            <div className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-[#E9B45A]">
              {E ? <EditableText path={`${base}.eyebrow`} value={eyebrow} /> : eyebrow}
            </div>
            <h2 className="mt-3.5 font-display text-[28px] font-medium leading-[1.08] text-[#FBF3E6] md:text-[clamp(28px,3vw,42px)]">
              {E ? (
                <EditableText path={`${base}.heading`} value={heading} multiline />
              ) : (
                heading
              )}
            </h2>
            <p className="mt-[18px] text-[15.5px] leading-[1.6] text-[#cdd6c0]">
              {E ? (
                <EditableText path={`${base}.intro`} value={intro} multiline />
              ) : (
                intro
              )}
            </p>
            <div className="mt-7 flex items-stretch border-y border-[rgba(246,238,225,0.14)] py-[18px]">
              {DISPENSARY_STATS.map((s, i) => (
                <div key={s.label} className="flex flex-1 items-stretch">
                  {i > 0 && <div className="w-px bg-[rgba(246,238,225,0.14)]" />}
                  <div className="flex-1 text-center">
                    <div className={`font-display text-[26px] ${i === 2 ? "text-[#E9B45A]" : "text-[#FBF3E6]"}`}>
                      {s.value}
                    </div>
                    <div className="text-[9.5px] uppercase tracking-[0.05em] text-[#9aa78c]">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex min-h-14 items-start gap-[11px] rounded-[14px] border border-[rgba(246,238,225,0.12)] bg-[rgba(246,238,225,0.05)] p-[18px]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E9B45A" strokeWidth="1.8" className="mt-px flex-none">
                <path d="M12 2v6M12 8c-3 3-5 5-5 8a5 5 0 0 0 10 0c0-3-2-5-5-8z" />
              </svg>
              <p className="m-0 font-display text-[17px] italic leading-[1.4] text-[#f0e7d6]">{active.for}</p>
            </div>
            <p className="mt-[18px] text-[12.5px] leading-[1.5] text-[#8c9a7d]">
              {E ? (
                <EditableText path={`${base}.footnote`} value={footnote} multiline />
              ) : (
                footnote
              )}
            </p>
          </div>

          <div>
            <div className="mb-[22px] flex flex-wrap gap-[9px]">
              {IV_BLENDS.map((b) => {
                const on = b.key === blend;
                return (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => setBlend(b.key)}
                    className={`flex-none rounded-full border px-[13px] py-[7px] text-xs font-semibold whitespace-nowrap transition-all ${
                      on
                        ? "border-[#E9B45A] bg-[#E9B45A] text-ink"
                        : "border-[rgba(246,238,225,0.2)] bg-[rgba(246,238,225,0.06)] text-[#d8cdbe] hover:bg-[rgba(246,238,225,0.12)]"
                    }`}
                  >
                    {b.name}
                  </button>
                );
              })}
            </div>
            <div className="mb-[22px] h-px bg-[rgba(246,238,225,0.14)]" />
            <div className="grid grid-cols-3 gap-2.5 md:grid-cols-4 md:gap-2.5">
              {IV_INGREDIENTS.map((ig) => {
                const on = !allMode && !!active.items?.includes(ig.abbr);
                const dim = !allMode && !on;
                let abbrBg = "rgba(246,238,225,0.16)";
                let abbrCol = "#FBF3E6";
                let nameCol = "#9a9483";
                if (on) {
                  abbrBg = "#E9B45A";
                  abbrCol = "#2E211B";
                  nameCol = "#FBF3E6";
                } else if (allMode) {
                  abbrBg = ig.cat;
                  abbrCol = "#FBF3E6";
                  nameCol = "#e6ddcd";
                }
                return (
                  <div
                    key={ig.abbr}
                    className={`flex min-w-0 flex-col items-center justify-center gap-[9px] rounded-2xl border px-2.5 py-3.5 text-center transition-all duration-300 ${
                      on
                        ? "border-[rgba(233,180,90,0.6)] bg-[rgba(233,180,90,0.18)] opacity-100"
                        : dim
                          ? "border-[rgba(246,238,225,0.07)] bg-[rgba(246,238,225,0.03)] opacity-[0.32]"
                          : "border-[rgba(246,238,225,0.14)] bg-[rgba(246,238,225,0.06)] opacity-100"
                    }`}
                  >
                    <span
                      className="flex h-11 w-11 flex-none items-center justify-center rounded-[11px] text-sm font-bold"
                      style={{ background: abbrBg, color: abbrCol }}
                    >
                      {ig.abbr}
                    </span>
                    <span
                      className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-semibold leading-[1.12]"
                      style={{ fontSize: nameFont(ig.name.length), color: nameCol }}
                    >
                      {ig.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
