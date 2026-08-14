"use client";

import { useState } from "react";
import Image from "next/image";
import { useSiteMedia, useSiteMediaMap } from "@/components/media/SiteMediaContext";
import EditableText from "@/components/admin/EditableText";
import { useHomeContent } from "./HomeContentContext";

export default function PatientStories() {
  const [storyIndex, setStoryIndex] = useState(0);
  const [tab, setTab] = useState(0);
  const [playing, setPlaying] = useState(false);
  const media = useSiteMediaMap();
  const drNina = useSiteMedia("dr-nina");
  const content = useHomeContent();
  const chrome = content.storiesChrome;
  const stories = content.stories;
  const n = stories.length;
  const safeIndex = n > 0 ? Math.min(storyIndex, n - 1) : 0;
  const story = stories[safeIndex];
  const storySrc = story
    ? media.images[`patient-${story.key}`] || story.imageUrl
    : "";
  const storyWistia = story
    ? (media.wistia[story.key] || story.wistia || "").trim()
    : "";
  const hasVideo = storyWistia.length > 0;

  function go(i: number) {
    if (n === 0) return;
    setStoryIndex(((i % n) + n) % n);
    setTab(0);
    setPlaying(false);
  }

  if (!story) return null;

  return (
    <section id="patient-stories" className="relative overflow-hidden bg-olive md:px-[clamp(40px,6vw,110px)] md:py-38">
      <div className="pointer-events-none absolute inset-0 bg-[#2c3524]/95" />
      <div className="grain-overlay pointer-events-none opacity-50 mix-blend-overlay" />
      <div
        className="pointer-events-none absolute -top-40 -right-20 hidden h-180 w-180 rounded-full md:block"
        style={{ background: "radial-gradient(circle, rgba(207,168,90,0.16), rgba(207,168,90,0) 64%)" }}
      />
      <div className="relative z-[1] mx-auto max-w-295">
        {/* Desktop section header only */}
        <div className="mx-auto mb-13.5 hidden max-w-180 text-center md:block">
          <div className="flex items-center justify-center gap-3.25">
            <span className="font-display text-sm italic text-gold">06</span>
            <span className="h-px w-9 bg-gold" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold">
              <EditableText path="storiesChrome.eyebrow" value={chrome.eyebrow} as="span" />
            </span>
            <span className="h-px w-9 bg-gold" />
          </div>
          <h2 className="mx-auto mt-5 max-w-[17ch] font-display text-[60px] font-medium leading-[1.03] tracking-tight text-cream-deep">
            <EditableText path="storiesChrome.headingLead" value={chrome.headingLead} as="span" />{" "}
            <span className="italic text-gold">
              <EditableText path="storiesChrome.headingEmph" value={chrome.headingEmph} as="span" />
            </span>
          </h2>
        </div>

        <div className="grid overflow-hidden md:grid-cols-[0.82fr_1fr] md:rounded-[22px] md:shadow-[0_40px_90px_rgba(20,12,7,0.45)]">
          {/* Editorial hero — dump mobile height ~290px */}
          <div className="relative h-[290px] flex-none bg-[#2a3322] md:min-h-140 md:h-auto">
            <Image
              src={storySrc}
              alt={story.name}
              fill
              className="object-cover"
              unoptimized={storySrc.startsWith("http")}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(20,12,7,0.34) 0%, rgba(20,12,7,0.04) 28%, rgba(20,12,7,0.3) 56%, rgba(20,12,7,0.92))",
              }}
            />
            <div className="grain-overlay pointer-events-none opacity-40 mix-blend-overlay" style={{ backgroundSize: "180px" }} />
            <div className="absolute right-4 top-4 rounded-full bg-[rgba(20,12,7,0.5)] px-[11px] py-1 text-[10px] font-semibold text-cream-deep md:right-5.5 md:top-5.5">
              {safeIndex + 1} / {n}
            </div>
            <div className="absolute inset-x-[22px] bottom-[18px] md:inset-x-7.5 md:bottom-7.5">
              <div className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                A patient story ·{" "}
                <EditableText path={`stories.${safeIndex}.category`} value={story.category} as="span" />
              </div>
              <h3 className="mt-2 font-display text-[30px] font-medium leading-[1.04] tracking-[-0.02em] text-cream-deep md:mt-2.5 md:text-[40px]">
                <EditableText path={`stories.${safeIndex}.heroLead`} value={story.heroLead} as="span" />{" "}
                <span className="italic text-gold">
                  <EditableText path={`stories.${safeIndex}.heroEmph`} value={story.heroEmph} as="span" />
                </span>
              </h3>
              <div className="mt-[11px] flex items-center gap-2.5 md:mt-3.5 md:gap-3">
                <span className="text-xs font-semibold text-cream-deep md:text-sm">
                  <EditableText path={`stories.${safeIndex}.name`} value={story.name} as="span" />
                </span>
                <span className="h-1 w-1 rounded-full bg-cream-deep/50" />
                <span className="font-display text-sm italic text-gold md:text-[16px]">
                  <EditableText path={`stories.${safeIndex}.timeframe`} value={story.timeframe} as="span" />
                </span>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col bg-[#F2EBDD]">
            <div className="nr-rail flex flex-none gap-[3px] overflow-x-auto border-b border-ink/10 px-3.5 pt-3 md:gap-1 md:px-7.5 md:pt-5">
              {chrome.tabs.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setTab(i);
                    setPlaying(false);
                  }}
                  className={`-mb-px flex-1 border-b-2 px-0.5 pb-[11px] pt-2 text-center md:flex-none md:px-5 md:pb-4 md:pt-3 ${
                    i === tab ? "border-terracotta" : "border-transparent"
                  }`}
                >
                  <div
                    className={`flex h-[17px] items-center justify-center font-serif text-xs italic md:h-6.5 md:text-[19px] ${
                      i === tab ? "text-terracotta" : "text-muted"
                    }`}
                  >
                    {i === 3 ? (
                      <svg width="21" height="17" viewBox="0 0 24 20" fill="none" aria-hidden className="md:hidden">
                        <rect x="2" y="0.5" width="20" height="14" rx="2.4" fill="#B5572F" />
                        <path d="M10 4.6 L15.4 7.5 L10 10.4 Z" fill="#FBF6EC" />
                        <line x1="2" y1="18.4" x2="22" y2="18.4" stroke="#B08A3E" strokeWidth="1.6" strokeLinecap="round" />
                        <circle cx="7" cy="18.4" r="2.6" fill="#34402C" />
                      </svg>
                    ) : (
                      String(i + 1).padStart(2, "0")
                    )}
                    {i === 3 && <span className="hidden md:inline">{String(i + 1).padStart(2, "0")}</span>}
                  </div>
                  <div
                    className={`mt-[3px] whitespace-nowrap text-[9.5px] font-semibold md:mt-1.5 md:text-[13.5px] ${
                      i === tab ? "text-terracotta" : "text-muted"
                    }`}
                  >
                    <EditableText path={`storiesChrome.tabs.${i}`} value={label} as="span" />
                  </div>
                </button>
              ))}
            </div>

            <div className="relative min-h-[280px] flex-1 px-[22px] py-5 md:min-h-90 md:p-10">
              <div className="grain-overlay pointer-events-none opacity-35 mix-blend-multiply" style={{ backgroundSize: "180px" }} />
              <div className="relative">
                {tab === 0 && (
                  <div>
                    <p className="text-[15px] leading-[1.66] text-[#4a3f36] md:text-[18px] md:leading-relaxed">
                      <span className="float-left mr-[9px] -mb-1 mt-1 font-display text-[52px] font-medium leading-[0.78] text-terracotta md:mr-3 md:text-[64px]">
                        {story.intake.charAt(0)}
                      </span>
                      {story.intake.slice(1)}
                    </p>
                    <div className="mt-[18px] flex flex-wrap gap-[7px] md:mt-6 md:gap-2.25">
                      {story.symptoms.map((s, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-terracotta/22 bg-terracotta/[0.08] px-[13px] py-1.5 text-xs text-[#b06a4a] md:px-3.75 md:py-1.75 md:text-[13px]"
                        >
                          <EditableText path={`stories.${safeIndex}.symptoms.${i}`} value={s} as="span" />
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {tab === 1 && (
                  <div className="relative rounded-xl border border-ink/10 border-l-[3px] border-l-gold-deep bg-cream px-[19px] py-5 md:rounded-[14px] md:p-7">
                    <span className="absolute right-4 top-4 font-serif text-[32px] text-gold-deep/50 md:right-5.5 md:top-5 md:text-[42px]">
                      ℞
                    </span>
                    <div className="mb-2.5 text-[9px] font-bold uppercase tracking-[0.16em] text-terracotta md:mb-3 md:text-[10px]">
                      <EditableText path="storiesChrome.drReadLabel" value={chrome.drReadLabel} as="span" />
                    </div>
                    <p className="max-w-[28ch] font-serif text-[17px] leading-[1.52] text-ink md:max-w-[38ch] md:text-[21px] md:leading-snug">
                      <EditableText path={`stories.${safeIndex}.drNotes`} value={story.drNotes} as="span" multiline />
                    </p>
                    <div className="mt-3.5 flex items-center gap-2.5 md:mt-5 md:gap-3">
                      <div className="relative h-[38px] w-[38px] flex-none overflow-hidden rounded-full border border-gold-deep/55 md:h-11.5 md:w-11.5">
                        <Image
                          src={drNina}
                          alt=""
                          fill
                          className="object-cover object-[50%_18%]"
                          unoptimized={drNina.startsWith("http")}
                        />
                      </div>
                      <div>
                        <div className="font-hand text-[23px] leading-[0.9] text-terracotta md:text-[26px]">
                          <EditableText path="storiesChrome.attributionName" value={chrome.attributionName} as="span" />
                        </div>
                        <div className="mt-0.75 text-[8px] tracking-[0.1em] uppercase text-muted md:text-[9px]">
                          <EditableText path="storiesChrome.attributionCreds" value={chrome.attributionCreds} as="span" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tab === 2 && (
                  <div>
                    <div className="flex flex-col gap-2.5 md:hidden">
                      {story.actions.map((a, i) => (
                        <div key={i} className="flex items-start gap-[11px]">
                          <span className="mt-px flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-[#7C8A5E] text-[11px] text-cream">
                            ✓
                          </span>
                          <span className="flex-1 text-[13.5px] leading-[1.5] text-[#5a4d43]">
                            <EditableText path={`stories.${safeIndex}.actions.${i}`} value={a} as="span" />
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-[18px] rounded-[14px] bg-olive px-[18px] pb-3.5 pt-[18px] md:mt-0 md:hidden">
                      <div className="mb-[15px] text-[9px] font-semibold uppercase tracking-[0.14em] text-[#cdd4ba]">
                        <EditableText path="storiesChrome.markersHeading" value={chrome.markersHeading} as="span" />
                      </div>
                      {story.markers.map((mk, i) => (
                        <div key={i} className="mb-4">
                          <div className="flex items-baseline justify-between">
                            <span className="text-[12.5px] font-semibold text-cream-deep">
                              <EditableText path={`stories.${safeIndex}.markers.${i}.label`} value={mk.label} as="span" />
                            </span>
                            <span className="font-display text-[21px] font-semibold leading-none text-[#9fb07a]">
                              <EditableText path={`stories.${safeIndex}.markers.${i}.to`} value={mk.to} as="span" />
                            </span>
                          </div>
                          <div
                            className="relative mt-[9px] h-[7px] rounded"
                            style={{ background: "linear-gradient(90deg, rgba(181,87,47,0.5), rgba(124,138,94,0.55))" }}
                          >
                            <span
                              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-olive bg-[#d88a5f]"
                              style={{ left: mk.fromPct }}
                            />
                            <span
                              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-olive bg-[#9fb07a]"
                              style={{ left: mk.toPct }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Desktop two-col */}
                    <div className="hidden items-start gap-6 md:grid md:grid-cols-2">
                      <div className="flex flex-col gap-3.25">
                        {story.actions.map((a, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#7C8A5E] text-xs text-cream">
                              ✓
                            </span>
                            <span className="flex-1 text-[14.5px] leading-relaxed text-body">
                              <EditableText path={`stories.${safeIndex}.actions.${i}`} value={a} as="span" />
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-2xl bg-olive p-5.5 pb-4">
                        <div className="mb-4.5 text-[9.5px] font-semibold tracking-[0.14em] uppercase text-[#cdd4ba]">
                          <EditableText path="storiesChrome.markersHeading" value={chrome.markersHeading} as="span" />
                        </div>
                        {story.markers.map((mk, i) => (
                          <div key={i} className="mb-4.5">
                            <div className="flex items-baseline justify-between">
                              <span className="text-[13px] font-semibold text-cream-deep">
                                <EditableText path={`stories.${safeIndex}.markers.${i}.label`} value={mk.label} as="span" />
                              </span>
                              <span className="font-display text-[23px] font-semibold leading-none text-[#9fb07a]">
                                <EditableText path={`stories.${safeIndex}.markers.${i}.to`} value={mk.to} as="span" />
                              </span>
                            </div>
                            <div
                              className="relative mt-2.5 h-2 rounded-full"
                              style={{ background: "linear-gradient(90deg, rgba(181,87,47,0.5), rgba(124,138,94,0.55))" }}
                            >
                              <span
                                className="absolute top-1/2 h-3.25 w-3.25 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-olive bg-[#d88a5f]"
                                style={{ left: mk.fromPct }}
                              />
                              <span
                                className="absolute top-1/2 h-3.75 w-3.75 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-olive bg-[#9fb07a]"
                                style={{ left: mk.toPct }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {tab === 3 && (
                  <div
                    className={
                      hasVideo
                        ? "grid items-center gap-4 md:grid-cols-[auto_1fr] md:gap-7.5"
                        : "grid items-center gap-4"
                    }
                  >
                    {hasVideo && (
                      <div className="relative mx-auto aspect-[9/16] w-[200px] overflow-hidden rounded-2xl bg-[#2a3322] shadow-[0_14px_32px_rgba(46,33,27,0.2)] md:mx-0 md:w-56 md:rounded-[18px]">
                        {playing ? (
                          <iframe
                            src={`https://fast.wistia.net/embed/iframe/${storyWistia}?autoPlay=true&playerColor=41633b&fitStrategy=cover&seo=false`}
                            title={`${story.first} video testimonial`}
                            allow="autoplay; fullscreen"
                            className="absolute inset-0 h-full w-full border-0"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPlaying(true)}
                            aria-label={`Play ${story.first}'s story`}
                            className="absolute inset-0"
                          >
                            <Image
                              src={storySrc}
                              alt={story.name}
                              fill
                              className="object-cover"
                              unoptimized={storySrc.startsWith("http")}
                            />
                            <div
                              className="pointer-events-none absolute inset-0"
                              style={{
                                background:
                                  "linear-gradient(180deg, rgba(20,12,7,0.18) 0%, rgba(20,12,7,0.02) 30%, rgba(20,12,7,0.7))",
                              }}
                            />
                            <div className="absolute left-3 top-3 flex items-center gap-1.25 rounded-full bg-gold px-2.25 py-1 text-[9px] font-bold tracking-[0.1em] uppercase text-ink">
                              ▶ Video
                            </div>
                            <div className="absolute right-3 top-3 rounded-full bg-[rgba(20,12,7,0.55)] px-2.5 py-1 text-[10px] font-semibold text-cream-deep">
                              <EditableText path={`stories.${safeIndex}.videoLen`} value={story.videoLen} as="span" />
                            </div>
                            <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-terracotta/94 shadow-[0_12px_28px_rgba(20,12,7,0.42)]">
                              <span className="ml-1 border-y-[11px] border-l-[18px] border-y-transparent border-l-cream" />
                            </div>
                            <div className="absolute inset-x-3.5 bottom-3 text-center text-[11px] font-semibold text-cream-deep md:hidden">
                              ▶ Watch {story.first}&rsquo;s story
                            </div>
                          </button>
                        )}
                      </div>
                    )}
                    <div className="text-center md:text-left">
                      <span className="font-display text-[44px] leading-[0.4] text-gold-deep/45 md:text-[60px]">&ldquo;</span>
                      <p className="mt-3 font-display text-[21px] italic leading-[1.3] text-ink md:mt-4 md:text-[28px]">
                        <EditableText path={`stories.${safeIndex}.quote`} value={story.quote} as="span" multiline />
                      </p>
                      <div className="mt-2 font-hand text-[23px] text-terracotta md:text-[27px]">
                        — <EditableText path={`stories.${safeIndex}.first`} value={story.first} as="span" />
                      </div>
                      {hasVideo && (
                        <button
                          type="button"
                          onClick={() => setPlaying(true)}
                          className="mt-1 hidden text-xs text-muted md:block"
                        >
                          ▶ Watch {story.first}&rsquo;s story
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile dump: olive sticky rail at bottom of section */}
        <div className="flex items-center gap-2.5 border-t border-gold/25 bg-olive px-4 py-3.5 md:mt-9.5 md:justify-center md:gap-4 md:border-0 md:bg-transparent md:px-0 md:py-0">
          <button
            type="button"
            onClick={() => go(safeIndex - 1)}
            aria-label="Previous patient"
            className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full border-[1.5px] border-cream-deep/30 text-base text-cream-deep hover:border-gold md:h-12 md:w-12 md:text-lg"
          >
            ←
          </button>
          <div className="nr-rail flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 py-0.5 md:max-w-190 md:flex-none md:gap-3.5">
            {stories.map((c, i) => {
              const thumb = media.images[`patient-${c.key}`] || c.imageUrl;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => go(i)}
                  className="flex w-[42px] flex-none flex-col items-center gap-1 md:w-15 md:gap-1.5"
                >
                  <span
                    className="h-[42px] w-[42px] overflow-hidden rounded-full border-2 bg-[#2a3322] md:h-13.5 md:w-13.5"
                    style={{
                      borderColor: i === safeIndex ? "#E9B45A" : "rgba(246,238,225,0.25)",
                      boxShadow: i === safeIndex ? "0 0 0 3px rgba(233,180,90,0.25)" : undefined,
                    }}
                  >
                    <span className="relative block h-full w-full">
                      <Image
                        src={thumb}
                        alt={c.first}
                        fill
                        className="object-cover"
                        unoptimized={thumb.startsWith("http")}
                      />
                    </span>
                  </span>
                  <span
                    className={`text-[8.5px] font-semibold md:text-[10px] ${
                      i === safeIndex ? "text-cream-deep" : "text-[#9aa585]"
                    }`}
                  >
                    <EditableText path={`stories.${i}.first`} value={c.first} as="span" />
                  </span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => go(safeIndex + 1)}
            aria-label="Next patient"
            className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-terracotta text-base text-cream hover:bg-terracotta-hover md:h-12 md:w-12 md:text-lg"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
