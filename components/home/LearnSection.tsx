"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { LEARN_ITEMS, LEARN_TOPICS } from "@/content/home";

interface LearnSectionProps {
  nodPhrase: string;
  nodTopic: string | null;
}

const FEED_IMAGES: Record<string, string> = {
  a4: "/images/home-media/feed-a4.webp",
  a5: "/images/home-media/feed-a5.webp",
  v3: "/images/home-media/feed-v3.webp",
};

/**
 * Mobile = dump §08: left-aligned pinned header, horizontal topic rail,
 * stacked feed with compact article rows.
 */
export default function LearnSection({ nodPhrase, nodTopic }: LearnSectionProps) {
  const mappedIdx = nodTopic ? LEARN_TOPICS.indexOf(nodTopic as (typeof LEARN_TOPICS)[number]) : 0;
  const [topicIdx, setTopicIdx] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState("q1");

  const activeTopicIdx = topicIdx ?? Math.max(mappedIdx, 0);
  const showNod = nodPhrase.length > 0 && mappedIdx > 0 && activeTopicIdx === mappedIdx && topicIdx === null;
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (q) {
      return LEARN_ITEMS.filter((it) =>
        `${it.title} ${it.topic} ${it.answer ?? ""}`.toLowerCase().includes(q)
      );
    }
    return LEARN_ITEMS.filter((it) => it.topic === LEARN_TOPICS[activeTopicIdx]);
  }, [q, activeTopicIdx]);

  const qas = filtered.filter((i) => i.kind === "qa");
  const articles = filtered.filter((i) => i.kind === "article");
  const videos = filtered.filter((i) => i.kind === "video");

  return (
    <section id="learn" className="relative overflow-hidden bg-[#F2EBDD] px-[22px] py-[22px] md:px-[clamp(40px,6vw,110px)] md:py-37.5">
      <div className="grain-overlay opacity-40 mix-blend-multiply" style={{ backgroundSize: "180px" }} />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 hidden h-130 w-225 -translate-x-1/2 rounded-full md:block"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.12), rgba(176,138,62,0) 68%)" }}
      />
      <div className="relative z-[1] mx-auto max-w-295">
        <div className="mx-auto max-w-190 text-left md:text-center">
          <div className="flex items-center gap-[9px] md:justify-center md:gap-3.25">
            <span className="h-px w-[22px] bg-[#B08A3E] md:hidden" />
            <span className="hidden font-display text-sm italic text-terracotta md:inline">08</span>
            <span className="hidden h-px w-9 bg-gold-deep md:block" />
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-terracotta md:text-xs md:tracking-[0.2em]">
              Learn &amp; answers
            </span>
            <span className="hidden h-px w-9 bg-gold-deep md:block" />
          </div>
          <h2 className="mt-[11px] max-w-[16ch] font-display text-[27px] font-medium leading-[1.04] tracking-[-0.02em] text-ink md:mx-auto md:mt-5.5 md:text-[62px] md:leading-[1.02] md:tracking-tight">
            Start with a <span className="italic text-terracotta">question.</span>
          </h2>
          <p className="mx-auto mt-4 hidden max-w-[54ch] text-[18px] leading-relaxed text-body-soft md:mt-5 md:block">
            Articles, videos, and quick answers, all in one place. Search it, or browse by topic, and pick how you want
            to learn: read it, listen to it, or watch it.
          </p>

          {showNod && (
            <div className="mt-[11px] flex flex-wrap items-center gap-[7px] rounded-xl border border-terracotta/25 bg-terracotta/[0.08] px-3 py-2 md:mx-auto md:mt-5.5 md:inline-flex md:rounded-full md:px-4.5 md:py-2.25">
              <span className="text-[11.5px] text-[#5a4d43] md:text-[13px] md:text-body">
                Because you want to <em className="font-semibold italic text-terracotta">{nodPhrase}</em>, we started
                you in
              </span>
              <span className="rounded-full bg-terracotta px-[9px] py-[3px] text-[9px] font-bold uppercase tracking-[0.08em] text-cream md:px-2.75 md:py-1 md:text-[11px]">
                {nodTopic}
              </span>
            </div>
          )}

          <div className="mt-[11px] flex items-center gap-[9px] rounded-[11px] border border-ink/10 bg-cream px-[13px] py-2.5 shadow-none md:mx-auto md:mt-6.5 md:max-w-135 md:gap-3 md:rounded-[14px] md:px-5 md:py-3.75 md:shadow-[0_8px_22px_rgba(46,33,27,0.08)]">
            <span className="text-[15px] text-[#9a8b7a] md:text-lg md:text-muted">⚲</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search thyroid, gut, insurance…"
              className="min-w-0 flex-1 border-none bg-transparent text-[13px] text-ink outline-none md:text-[15px]"
            />
            {query.length > 0 && (
              <button type="button" onClick={() => setQuery("")} className="text-[17px] text-[#9a8b7a]" aria-label="Clear search">
                ×
              </button>
            )}
          </div>

          <div className="nr-rail mt-[11px] flex gap-[7px] overflow-x-auto pb-0.5 md:mt-4.5 md:flex-wrap md:justify-center md:gap-2.25 md:overflow-visible">
            {LEARN_TOPICS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setTopicIdx(i)}
                className={`flex-none whitespace-nowrap rounded-full border px-[13px] py-[7px] text-[11.5px] font-semibold md:px-4.25 md:py-2.25 md:text-[12.5px] ${
                  i === activeTopicIdx && !q
                    ? "border-terracotta bg-terracotta text-cream"
                    : "border-ink/20 bg-transparent text-body"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-[22px] md:mt-12.5 md:grid md:grid-cols-3 md:items-start md:gap-5.5">
          {qas.length > 0 && (
            <div>
              <div className="mb-[11px] flex items-baseline gap-2 border-0 pb-0 md:mb-4 md:gap-2.25 md:border-b md:border-ink/[0.14] md:pb-3">
                <span className="rounded-full bg-gold-deep px-[9px] py-[3px] text-[8px] font-bold uppercase tracking-[0.1em] text-ink md:px-2.5 md:py-1 md:text-[8.5px]">
                  Quick answers
                </span>
                <span className="text-[10px] text-[#9a8b7a] md:text-[11px] md:text-muted">{qas.length}</span>
              </div>
              <div className="flex flex-col gap-2.5 md:gap-3.5">
                {qas.map((f) => {
                  const open = openKey === f.key;
                  return (
                    <div
                      key={f.key}
                      onClick={() => setOpenKey(open ? "" : f.key)}
                      className="cursor-pointer rounded-[14px] border border-ink/[0.08] bg-cream px-4 py-[15px] shadow-[0_3px_10px_rgba(46,33,27,0.05)] md:rounded-2xl md:p-5 md:shadow-[0_4px_14px_rgba(46,33,27,0.06)]"
                    >
                      <div className="mb-[7px] text-[9.5px] text-[#9a8b7a] md:mb-2 md:text-[10px] md:text-muted">{f.topic}</div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex-1 font-display text-base font-medium leading-[1.26] text-ink md:text-[18px] md:leading-snug">
                          {f.title}
                        </span>
                        <span className="text-[17px] leading-none text-terracotta">{open ? "\u2013" : "+"}</span>
                      </div>
                      {open && (
                        <div>
                          <p className="mt-[11px] text-[13px] leading-[1.55] text-[#5a4d43] md:mt-3 md:text-sm md:leading-relaxed md:text-body">
                            {f.answer}
                          </p>
                          <div className="mt-[13px] flex flex-wrap gap-2 md:mt-3.75">
                            {f.readMin && (
                              <span className="min-w-[84px] flex-1 rounded-[9px] border border-ink/[0.16] bg-[#F4ECDD] px-2.5 py-[9px] text-center text-[11px] font-semibold text-ink md:min-w-23 md:rounded-[10px] md:bg-cream-deep md:py-2.5 md:text-[11.5px]">
                                Read · {f.readMin}
                              </span>
                            )}
                            {f.audioLen && (
                              <span className="flex min-w-[84px] flex-1 items-center justify-center gap-1.5 rounded-[9px] bg-[#7C8A5E] px-2.5 py-[9px] text-center text-[11px] font-semibold text-cream md:min-w-23 md:rounded-[10px] md:py-2.5 md:text-[11.5px]">
                                ♫ Listen · {f.audioLen}
                              </span>
                            )}
                            {f.watchMin && (
                              <span className="min-w-[84px] flex-1 rounded-[9px] bg-terracotta px-2.5 py-[9px] text-center text-[11px] font-semibold text-cream md:min-w-23 md:rounded-[10px] md:py-2.5 md:text-[11.5px]">
                                ▶ Watch · {f.watchMin}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {articles.length > 0 && (
            <div>
              <div className="mb-[11px] flex items-baseline gap-2 md:mb-4 md:gap-2.25 md:border-b md:border-ink/[0.14] md:pb-3">
                <span className="rounded-full bg-[#B08A3E] px-[9px] py-[3px] text-[8px] font-bold uppercase tracking-[0.1em] text-cream md:bg-gold-deep md:px-2.5 md:py-1 md:text-[8.5px]">
                  Articles
                </span>
                <span className="text-[10px] text-[#9a8b7a] md:text-[11px] md:text-muted">{articles.length}</span>
              </div>
              <div className="flex flex-col gap-2.5 md:gap-3.5">
                {articles.map((f) => (
                  <div key={f.key}>
                    {/* Mobile: horizontal row */}
                    <a
                      href="#"
                      className="flex items-center gap-[13px] rounded-[14px] border border-ink/[0.08] bg-cream p-[11px] no-underline shadow-[0_3px_10px_rgba(46,33,27,0.05)] md:hidden"
                    >
                      <div className="relative h-[68px] w-[84px] flex-none overflow-hidden rounded-[10px] bg-sand-deep">
                        {FEED_IMAGES[f.key] && <Image src={FEED_IMAGES[f.key]} alt={f.title} fill className="object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[9.5px] text-[#9a8b7a]">
                          {f.topic} · {f.readMin} read
                        </div>
                        <div className="mt-[5px] font-display text-[15px] font-medium leading-[1.2] text-ink">{f.title}</div>
                      </div>
                    </a>
                    {/* Desktop: stacked card */}
                    <div className="hidden overflow-hidden rounded-2xl border border-ink/[0.08] bg-cream shadow-[0_4px_14px_rgba(46,33,27,0.06)] md:block">
                      <div className="relative h-42 bg-sand-deep">
                        {FEED_IMAGES[f.key] && <Image src={FEED_IMAGES[f.key]} alt={f.title} fill className="object-cover" />}
                      </div>
                      <div className="p-4.5">
                        <div className="text-[10px] text-muted">
                          {f.topic} · {f.readMin} read
                        </div>
                        <div className="mt-1.5 font-display text-[18px] font-medium leading-snug text-ink">{f.title}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {videos.length > 0 && (
            <div>
              <div className="mb-[11px] flex items-baseline gap-2 md:mb-4 md:gap-2.25 md:border-b md:border-ink/[0.14] md:pb-3">
                <span className="rounded-full bg-terracotta px-[9px] py-[3px] text-[8px] font-bold uppercase tracking-[0.1em] text-cream md:px-2.5 md:py-1 md:text-[8.5px]">
                  ▶ Videos
                </span>
                <span className="text-[10px] text-[#9a8b7a] md:text-[11px] md:text-muted">{videos.length}</span>
              </div>
              <div className="flex flex-col gap-2.5 md:gap-3.5">
                {videos.map((f) => (
                  <div
                    key={f.key}
                    className="relative h-[190px] overflow-hidden rounded-[14px] border border-ink/[0.08] bg-sand-deep shadow-[0_3px_10px_rgba(46,33,27,0.05)] md:h-47.5 md:rounded-2xl md:shadow-[0_4px_14px_rgba(46,33,27,0.06)]"
                  >
                    {FEED_IMAGES[f.key] && <Image src={FEED_IMAGES[f.key]} alt={f.title} fill className="object-cover" />}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{ background: "linear-gradient(180deg, rgba(20,12,7,0) 42%, rgba(20,12,7,0.66))" }}
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-gold-deep px-2.25 py-1 text-[8.5px] font-bold uppercase tracking-[0.1em] text-ink">
                      {f.watchMin}
                    </div>
                    <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-terracotta/94 shadow-[0_12px_28px_rgba(20,12,7,0.45)]">
                      <span className="ml-1 border-y-[10px] border-l-[16px] border-y-transparent border-l-cream" />
                    </div>
                    <div className="absolute inset-x-4 bottom-3.5">
                      <span className="text-[10px] text-[#e0d4c5]">{f.topic}</span>
                      <div className="mt-0.75 font-display text-[18px] font-medium leading-snug text-cream-deep">{f.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {filtered.length === 0 && (
          <div className="py-10 text-center">
            <div className="font-display text-[22px] italic text-body">No match for &ldquo;{query}&rdquo; yet.</div>
            <div className="mt-2 font-hand text-[26px] text-terracotta">Ask Dr. Nina and we&rsquo;ll cover it.</div>
          </div>
        )}

        <div className="mt-9 text-center font-hand text-[26px] text-terracotta">Still wondering? Just ask Dr. Nina.</div>
      </div>
    </section>
  );
}
