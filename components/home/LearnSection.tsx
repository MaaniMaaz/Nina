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
    <section className="relative overflow-hidden bg-[#F2EBDD] px-6 py-20 sm:px-10 sm:py-24 md:px-[clamp(40px,6vw,110px)] md:py-37.5">
      <div className="grain-overlay opacity-40 mix-blend-multiply" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-130 w-225 -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.12), rgba(176,138,62,0) 68%)" }}
      />
      <div className="relative z-[1] mx-auto max-w-295">
        <div className="mx-auto max-w-190 text-center">
          <div className="flex items-center justify-center gap-3.25">
            <span className="font-display text-sm italic text-terracotta">08</span>
            <span className="h-px w-9 bg-gold-deep" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-terracotta">Learn &amp; answers</span>
            <span className="h-px w-9 bg-gold-deep" />
          </div>
          <h2 className="mx-auto mt-5.5 max-w-[16ch] font-display text-[40px] font-medium leading-[1.02] tracking-tight text-ink sm:text-[52px] md:text-[62px]">
            Start with a <span className="italic text-terracotta">question.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[54ch] text-[15px] leading-relaxed text-body-soft sm:text-[18px]">
            Articles, videos, and quick answers, all in one place. Search it, or browse by topic, and pick how you
            want to learn: read it, listen to it, or watch it.
          </p>

          {showNod && (
            <div className="mx-auto mt-5.5 inline-flex items-center gap-2.25 rounded-full border border-terracotta/25 bg-terracotta/[0.08] px-4.5 py-2.25">
              <span className="text-[13px] text-body">
                Because you want to <em className="font-semibold not-italic text-terracotta">{nodPhrase}</em>, we started you in
              </span>
              <span className="rounded-full bg-terracotta px-2.75 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-cream">
                {nodTopic}
              </span>
            </div>
          )}

          <div className="mx-auto mt-6.5 flex max-w-135 items-center gap-3 rounded-[14px] border border-ink/10 bg-cream px-5 py-3.75 shadow-[0_8px_22px_rgba(46,33,27,0.08)]">
            <span className="text-lg text-muted">⚲</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search thyroid, fatigue, gut, insurance…"
              className="min-w-0 flex-1 border-none bg-transparent text-[15px] text-ink outline-none"
            />
            {query.length > 0 && (
              <button type="button" onClick={() => setQuery("")} className="text-xl text-muted" aria-label="Clear search">
                ×
              </button>
            )}
          </div>

          <div className="mt-4.5 flex flex-wrap justify-center gap-2.25">
            {LEARN_TOPICS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setTopicIdx(i)}
                className={`rounded-full border px-4.25 py-2.25 text-[12.5px] font-semibold ${
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

        <div className="mt-8.5 grid grid-cols-1 items-start gap-5.5 sm:mt-12.5 md:grid-cols-3">
          {qas.length > 0 && (
            <div>
              <div className="mb-4 flex items-baseline gap-2.25 border-b border-ink/[0.14] pb-3">
                <span className="rounded-full bg-gold-deep px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.1em] text-ink">
                  Quick answers
                </span>
                <span className="text-[11px] text-muted">{qas.length}</span>
              </div>
              <div className="flex flex-col gap-3.5">
                {qas.map((f) => {
                  const open = openKey === f.key;
                  return (
                    <div
                      key={f.key}
                      onClick={() => setOpenKey(open ? "" : f.key)}
                      className="cursor-pointer rounded-2xl border border-ink/[0.08] bg-cream p-5 shadow-[0_4px_14px_rgba(46,33,27,0.06)]"
                    >
                      <div className="mb-2 text-[10px] text-muted">{f.topic}</div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex-1 font-display text-[18px] font-medium leading-snug text-ink">{f.title}</span>
                        <span className="text-[21px] leading-none text-terracotta">{open ? "\u2013" : "+"}</span>
                      </div>
                      {open && (
                        <div>
                          <p className="mt-3 text-sm leading-relaxed text-body">{f.answer}</p>
                          <div className="mt-3.75 flex flex-wrap gap-2">
                            {f.readMin && (
                              <span className="min-w-23 flex-1 rounded-[10px] border border-ink/[0.16] bg-cream-deep px-2.5 py-2.5 text-center text-[11.5px] font-semibold text-ink">
                                Read · {f.readMin}
                              </span>
                            )}
                            {f.audioLen && (
                              <span className="flex min-w-23 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-[#7C8A5E] px-2.5 py-2.5 text-center text-[11.5px] font-semibold text-cream">
                                ♫ Listen · {f.audioLen}
                              </span>
                            )}
                            {f.watchMin && (
                              <span className="min-w-23 flex-1 rounded-[10px] bg-terracotta px-2.5 py-2.5 text-center text-[11.5px] font-semibold text-cream">
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
              <div className="mb-4 flex items-baseline gap-2.25 border-b border-ink/[0.14] pb-3">
                <span className="rounded-full bg-gold-deep px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.1em] text-cream">
                  Articles
                </span>
                <span className="text-[11px] text-muted">{articles.length}</span>
              </div>
              <div className="flex flex-col gap-3.5">
                {articles.map((f) => (
                  <div key={f.key} className="overflow-hidden rounded-2xl border border-ink/[0.08] bg-cream shadow-[0_4px_14px_rgba(46,33,27,0.06)]">
                    <div className="relative h-42 bg-sand-deep">
                      {FEED_IMAGES[f.key] && <Image src={FEED_IMAGES[f.key]} alt={f.title} fill className="object-cover" />}
                    </div>
                    <div className="p-4.5 pb-4.5">
                      <div className="text-[10px] text-muted">
                        {f.topic} · {f.readMin} read
                      </div>
                      <div className="mt-1.5 font-display text-[18px] font-medium leading-snug text-ink">{f.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {videos.length > 0 && (
            <div>
              <div className="mb-4 flex items-baseline gap-2.25 border-b border-ink/[0.14] pb-3">
                <span className="rounded-full bg-terracotta px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.1em] text-cream">
                  ▶ Videos
                </span>
                <span className="text-[11px] text-muted">{videos.length}</span>
              </div>
              <div className="flex flex-col gap-3.5">
                {videos.map((f) => (
                  <div key={f.key} className="relative h-47.5 overflow-hidden rounded-2xl border border-ink/[0.08] bg-sand-deep shadow-[0_4px_14px_rgba(46,33,27,0.06)]">
                    {FEED_IMAGES[f.key] && <Image src={FEED_IMAGES[f.key]} alt={f.title} fill className="object-cover" />}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{ background: "linear-gradient(180deg, rgba(20,12,7,0) 42%, rgba(20,12,7,0.66))" }}
                    />
                    <div className="absolute left-3.25 top-3.25 rounded-full bg-gold-deep px-2.25 py-1 text-[8.5px] font-bold uppercase tracking-[0.1em] text-ink">
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
            <div className="mt-2 font-[Caveat,cursive] text-[26px] text-terracotta">Ask Dr. Nina and we&rsquo;ll cover it.</div>
          </div>
        )}

        <div className="mt-9 text-center font-[Caveat,cursive] text-[26px] text-terracotta">
          Still wondering? Just ask Dr. Nina.
        </div>
      </div>
    </section>
  );
}
