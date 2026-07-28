"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CARE_TOOLKIT_FOOTNOTE,
  CARE_TOOLKIT_STATS,
  TOOLKIT_CONCERNS,
  TOOLKIT_TREATMENTS,
} from "@/content/care-toolkit";

interface CareToolkitProps {
  number?: string;
  eyebrow: string;
  heading: string;
  intro: string;
  currentKey: string;
  footnote?: string;
}

export default function CareToolkit({
  eyebrow,
  heading,
  intro,
  currentKey,
  footnote = CARE_TOOLKIT_FOOTNOTE,
}: CareToolkitProps) {
  const [concern, setConcern] = useState("all");
  const active = TOOLKIT_CONCERNS.find((c) => c.key === concern) ?? TOOLKIT_CONCERNS[0];
  const allMode = active.key === "all";

  return (
    <section id="toolkit" className="relative overflow-hidden bg-[#233019] px-6 py-14 md:px-[clamp(40px,6vw,100px)] md:py-[clamp(64px,7vw,104px)]">
      <div className="grain-overlay pointer-events-none opacity-20 mix-blend-overlay" style={{ backgroundSize: "200px" }} />
      <div className="relative z-[2] mx-auto max-w-[1240px]">
        <div className="grid items-start gap-10 md:grid-cols-[0.82fr_1.18fr] md:gap-[clamp(40px,5vw,72px)]">
          <div className="md:sticky md:top-[90px]">
            <div className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-[#E9B45A]">{eyebrow}</div>
            <h2 className="mt-3.5 font-display text-[28px] font-medium leading-[1.08] text-[#FBF3E6] md:text-[clamp(28px,3vw,42px)]">
              {heading}
            </h2>
            <p className="mt-[18px] text-[15.5px] leading-[1.6] text-[#cdd6c0]">{intro}</p>
            <div className="mt-7 flex items-stretch border-y border-[rgba(246,238,225,0.14)] py-[18px]">
              {CARE_TOOLKIT_STATS.map((s, i) => (
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
                <path d="M12 2L4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" />
              </svg>
              <p className="m-0 font-display text-[17px] italic leading-[1.4] text-[#f0e7d6]">{active.for}</p>
            </div>
            <p className="mt-[18px] text-[12.5px] leading-[1.5] text-[#8c9a7d]">{footnote}</p>
          </div>

          <div>
            <div className="mb-[22px] flex flex-wrap gap-[9px]">
              {TOOLKIT_CONCERNS.map((c) => {
                const on = c.key === concern;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setConcern(c.key)}
                    className={`flex-none rounded-full border px-3.5 py-[7px] text-[12.5px] font-semibold whitespace-nowrap transition-all ${
                      on
                        ? "border-[#E9B45A] bg-[#E9B45A] text-ink"
                        : "border-[rgba(246,238,225,0.2)] bg-[rgba(246,238,225,0.06)] text-[#d8cdbe] hover:bg-[rgba(246,238,225,0.12)]"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
            <div className="mb-[22px] h-px bg-[rgba(246,238,225,0.14)]" />
            <div className="grid grid-cols-2 gap-[11px] md:grid-cols-3">
              {TOOLKIT_TREATMENTS.map((t) => {
                const on = !allMode && !!active.tx?.includes(t.key);
                const dim = !allMode && !on;
                const here = t.key === currentKey;
                return (
                  <Link
                    key={t.key}
                    href={t.href}
                    className={`block min-w-0 rounded-[15px] border p-4 no-underline transition-all duration-300 ${
                      on
                        ? "border-[rgba(233,180,90,0.6)] bg-[rgba(233,180,90,0.18)] opacity-100 hover:bg-[rgba(233,180,90,0.26)]"
                        : dim
                          ? "border-[rgba(246,238,225,0.07)] bg-[rgba(246,238,225,0.03)] opacity-[0.34]"
                          : "border-[rgba(246,238,225,0.14)] bg-[rgba(246,238,225,0.06)] opacity-100 hover:bg-[rgba(246,238,225,0.1)]"
                    }`}
                  >
                    <div className="flex items-center gap-[7px]">
                      <span
                        className={`h-[7px] w-[7px] flex-none rounded-full ${on ? "bg-[#E9B45A]" : "bg-[#6f7d5f]"}`}
                      />
                      <span
                        className={`text-[15px] font-bold leading-[1.15] ${on ? "text-[#FBF3E6]" : "text-[#F2EAD9]"}`}
                      >
                        {t.name}
                      </span>
                    </div>
                    <div
                      className={`mt-[7px] text-[10px] font-semibold uppercase tracking-[0.07em] ${
                        on ? "text-[#c7b07f]" : "text-[#94a07f]"
                      }`}
                    >
                      {t.cat}
                    </div>
                    {here && (
                      <div className="mt-2 text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#E9B45A]">
                        • You&rsquo;re here
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
