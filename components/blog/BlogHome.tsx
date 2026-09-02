"use client";

import { useMemo, useState } from "react";
import SmartImage from "@/components/ui/SmartImage";
import Link from "next/link";
import {
  BLOG_ARTICLES,
  SHELF_DEFS,
  FORMAT_FILTERS,
  filterBlogArticles,
  buildBlogTopics,
  blogTopicSlug,
  type BlogArticle,
  type BlogFormat,
} from "@/content/blog";
import { useSiteMedia } from "@/components/media/SiteMediaContext";

function PlayDisc({ size }: { size: number }) {
  return (
    <span
      className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(46,33,27,0.72)]"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className="ml-0.5 border-y-[6px] border-l-[10px] border-y-transparent border-l-cream border-r-0"
        style={{
          borderTopWidth: size > 60 ? 9 : 6,
          borderBottomWidth: size > 60 ? 9 : 6,
          borderLeftWidth: size > 60 ? 14 : 10,
        }}
      />
    </span>
  );
}

function SearchIcon() {
  return (
    <span className="relative h-[15px] w-[15px] shrink-0" aria-hidden>
      <span className="absolute top-0 left-0 h-[11px] w-[11px] rounded-full border-[1.6px] border-gold-deep" />
      <span className="absolute right-0 bottom-0 h-[1.6px] w-1.5 origin-right rotate-45 bg-gold-deep" />
    </span>
  );
}

function ArticleThumb({
  article,
  className,
  playSize,
}: {
  article: BlogArticle;
  className: string;
  playSize?: number;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#E7DCC9] ${className}`}>
      <SmartImage
          src={article.img}
          alt={article.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized={article.img.startsWith("http")}
        />
      {article.isPlay && playSize ? <PlayDisc size={playSize} /> : null}
    </div>
  );
}

/**
 * The Journal — Blog Home from handoff Full Desktop + Full Mobile (Direction 1b).
 * Shell Header stays global; this owns masthead through page footer.
 */
export default function BlogHome({ articles = BLOG_ARTICLES }: { articles?: BlogArticle[] }) {
  const [fmt, setFmt] = useState<"All" | BlogFormat>("All");
  const [q, setQ] = useState("");
  const drNina = useSiteMedia("dr-nina");

  const pool = useMemo(() => filterBlogArticles(fmt, q, articles), [fmt, q, articles]);
  const feat = pool[0] ?? null;
  const rail = pool.slice(1, 4);
  const shelves = useMemo(
    () =>
      SHELF_DEFS.map((s) => {
        const items = pool.filter((a) => (s.cats as readonly string[]).includes(a.cat));
        return {
          ...s,
          count: items.length,
          items,
          href: `/blog/topic/${blogTopicSlug(s.cats[0])}`,
        };
      }).filter((s) => s.items.length > 0),
    [pool],
  );
  const topics = useMemo(() => buildBlogTopics(articles), [articles]);
  const countLabel = `${pool.length} ${pool.length === 1 ? "piece" : "pieces"}`;
  const isEmpty = pool.length === 0;

  return (
    <div className="min-h-screen bg-cream-deep font-sans">
      {/* Masthead */}
      <section className="relative overflow-hidden bg-ink">
        <div
          className="grain-overlay opacity-40 mix-blend-overlay"
          style={{ backgroundSize: "180px" }}
        />
        <div
          className="pointer-events-none absolute -top-20 -right-16 h-[420px] w-[420px] rounded-full md:h-[520px] md:w-[520px]"
          style={{ background: "radial-gradient(circle, rgba(207,168,90,0.16), rgba(207,168,90,0) 68%)" }}
        />

        <div className="relative mx-auto max-w-[1240px] px-[22px] pt-[18px] pb-6 md:px-[clamp(28px,4vw,56px)] md:pt-[clamp(26px,3vw,38px)] md:pb-[clamp(48px,5vw,72px)]">
          <div className="flex items-center gap-[7px] md:gap-2">
            <Link
              href="/"
              className="text-[11px] tracking-[0.04em] text-[#b09a7d] no-underline transition-colors hover:text-cream-deep md:text-xs"
            >
              Home
            </Link>
            <span className="text-[11px] text-[#7d6a55] md:text-xs">/</span>
            <span className="text-[11px] tracking-[0.04em] text-[#d9ccbe] md:text-xs">The Journal</span>
          </div>

          <div className="mt-4 grid items-end gap-0 md:mt-0 md:grid-cols-[1.35fr_1fr] md:gap-[clamp(32px,4vw,72px)]">
            <div>
              <div className="mt-4 flex items-center gap-[9px] md:mt-[clamp(22px,2.4vw,30px)]">
                <span className="h-px w-[22px] bg-[#B08A3E] md:w-[30px]" />
                <span className="text-[9.5px] font-semibold tracking-[0.22em] text-gold-deep uppercase md:text-[10.5px]">
                  The journal
                </span>
              </div>
              <h1 className="mt-3 max-w-[22ch] font-display text-[31px] leading-[1.06] font-medium tracking-[-0.02em] text-cream-deep md:mt-4 md:text-[clamp(46px,5.4vw,76px)] md:leading-none md:tracking-[-0.03em]">
                Everything we know, written down for you.
              </h1>
            </div>
            <div className="mt-[13px] md:mt-0">
              <p className="max-w-[44ch] text-[15px] leading-[1.6] text-[#d9ccbe] md:text-[clamp(16px,1.3vw,18.5px)] md:leading-[1.64]">
                Functional medicine explained in plain language by Dr. Nina Ross, ND; Ph.D. Read it, watch it, or listen
                on your commute.
              </p>
              <label className="mt-[18px] flex max-w-[460px] cursor-text items-center gap-[11px] rounded-xl border border-[rgba(207,168,90,0.36)] bg-[rgba(246,238,225,0.1)] px-4 py-3.5 md:mt-[22px] md:gap-3.5 md:px-5 md:py-[17px]">
                <SearchIcon />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search the library"
                  aria-label="Search the library"
                  className="min-w-0 flex-1 bg-transparent text-[14.5px] text-cream-deep outline-none placeholder:text-[#9a8870] md:hidden"
                />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={`Search ${articles.length} articles, videos, and audio`}
                  aria-label="Search the library"
                  className="hidden min-w-0 flex-1 bg-transparent text-base text-cream-deep outline-none placeholder:text-[#9a8870] md:block"
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Format filter */}
      <div className="border-b border-[rgba(46,33,27,0.1)] bg-cream-deep md:sticky md:top-[84px] md:z-20 md:border-[rgba(46,33,27,0.12)] md:bg-[rgba(246,238,225,0.94)] md:backdrop-blur-[10px] xl:top-[114px]">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-0 py-4 md:px-[clamp(28px,4vw,56px)] md:py-4">
          <div className="nr-rail flex gap-2 overflow-x-auto px-[22px] md:flex-wrap md:gap-[9px] md:overflow-visible md:px-0">
            {FORMAT_FILTERS.map((f) => {
              const on = f === fmt;
              const label = f === "Protocol" ? "Protocols" : f;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFmt(f)}
                  className={`shrink-0 rounded-full border px-[15px] py-[9px] pb-2.5 text-[12.5px] font-semibold tracking-[0.04em] transition-[border-color,transform] md:px-[18px] md:py-2.5 md:pb-[11px] md:text-[13.5px] ${
                    on
                      ? "border-ink bg-ink text-cream"
                      : "border-[rgba(46,33,27,0.16)] bg-cream text-[#4a4038] hover:border-ink hover:-translate-y-px"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <span className="hidden shrink-0 font-newsreader text-base text-[#7d6f60] md:inline">{countLabel}</span>
        </div>
      </div>

      {isEmpty ? (
        <div className="mx-auto max-w-[1240px] px-[22px] py-16 text-center md:px-[clamp(28px,4vw,56px)] md:py-20">
          <div className="font-display text-[28px] leading-[1.12] font-medium text-ink md:text-[32px]">
            Nothing matches that yet.
          </div>
          <p className="mx-auto mt-3 max-w-[48ch] text-base leading-[1.62] text-body">
            Try a broader word, or clear the filter to see all {articles.length} pieces.
          </p>
          <button
            type="button"
            onClick={() => {
              setFmt("All");
              setQ("");
            }}
            className="mt-5 rounded-[9px] bg-terracotta px-[26px] py-[15px] text-[15px] font-semibold text-cream hover:bg-terracotta-hover"
          >
            Show everything
          </button>
        </div>
      ) : (
        <>
          {/* Featured + rail */}
          <section className="mx-auto max-w-[1240px] px-[22px] pt-5 md:px-[clamp(28px,4vw,56px)] md:pt-[clamp(34px,4vw,56px)]">
            <div className="grid gap-4 md:grid-cols-[1.5fr_1fr] md:gap-[clamp(22px,2.4vw,34px)]">
              {feat ? (
                <Link
                  href={feat.href}
                  className="group block overflow-hidden rounded-[14px] border border-[rgba(46,33,27,0.09)] bg-cream no-underline shadow-[0_12px_32px_rgba(46,33,27,0.13)] transition-transform md:rounded-[18px] md:hover:-translate-y-[3px] md:hover:shadow-[0_18px_40px_rgba(46,33,27,0.16)]"
                >
                  <div className="relative">
                    <ArticleThumb
                      article={feat}
                      className="h-[220px] md:h-[clamp(300px,30vw,420px)]"
                      playSize={72}
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 40%, rgba(46,33,27,0.18) 100%)",
                      }}
                    />
                    <span className="absolute top-5 left-5 rounded-full bg-gold px-[15px] py-2 text-[10px] font-bold tracking-[0.16em] text-ink uppercase">
                      {feat.fmt} · start here
                    </span>
                  </div>
                  <div className="px-[18px] py-[18px] md:px-7 md:py-7">
                    <h2 className="font-display text-[25px] leading-[1.08] font-medium tracking-[-0.02em] text-ink md:text-[clamp(30px,2.9vw,42px)]">
                      {feat.title}
                    </h2>
                    <p className="mt-[13px] max-w-[58ch] text-[14.5px] leading-[1.64] text-body md:mt-[15px] md:text-[clamp(16px,1.2vw,18px)]">
                      {feat.dek}
                    </p>
                    <div className="mt-4 flex items-center gap-2.5 md:mt-5">
                      <div className="relative h-6 w-6 overflow-hidden rounded-full md:h-[34px] md:w-[34px]">
                        <SmartImage src={drNina} alt="" fill className="object-cover object-[50%_20%]" unoptimized={drNina.startsWith("http")} />
                      </div>
                      <span className="text-[12px] tracking-[0.05em] text-[#8a7a68] md:text-[12.5px]">
                        <span className="hidden md:inline">Dr. Nina Ross, ND; Ph.D · </span>
                        {feat.fmt} · {feat.meta} · {feat.cat}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : null}

              <div>
                <h2 className="mb-3.5 text-[10.5px] font-semibold tracking-[0.22em] text-terracotta uppercase">
                  Also worth your time
                </h2>
                <div className="overflow-hidden rounded-[14px] border border-[rgba(46,33,27,0.09)] bg-cream md:border-0 md:bg-transparent md:rounded-none">
                  {rail.map((r, i) => (
                    <Link
                      key={r.id}
                      href={r.href}
                      className={`flex items-center gap-3.5 no-underline transition-colors md:mb-3.5 md:rounded-[14px] md:border md:border-[rgba(46,33,27,0.09)] md:bg-cream md:px-[18px] md:py-4 md:hover:bg-cream-deep ${
                        i > 0 ? "border-t border-[rgba(46,33,27,0.08)] md:border" : ""
                      } px-3.5 py-3`}
                    >
                      <ArticleThumb article={r} className="h-[46px] w-[46px] shrink-0 rounded-[8px] md:h-[88px] md:w-[108px] md:rounded-[10px]" playSize={28} />
                      <div className="min-w-0">
                        <span
                          className="text-[9px] font-bold tracking-[0.14em] uppercase"
                          style={{ color: r.fmtColor }}
                        >
                          {r.fmt} · {r.meta}
                        </span>
                        <h3 className="mt-1.5 font-display text-[16.5px] leading-[1.18] font-medium text-ink md:mt-[7px] md:text-xl">
                          {r.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Shelves */}
          {shelves.map((sh) => (
            <section key={sh.title} className="mx-auto max-w-[1240px] pt-[30px] md:px-[clamp(28px,4vw,56px)] md:pt-[clamp(40px,4.4vw,62px)]">
              <div className="flex items-end justify-between gap-4 border-b border-[rgba(46,33,27,0.1)] px-[22px] pb-3.5 md:px-0 md:pb-4">
                <div>
                  <span className="text-[10.5px] font-semibold tracking-[0.22em] uppercase" style={{ color: sh.color }}>
                    {sh.kicker}
                  </span>
                  <h2 className="mt-[9px] font-display text-[23px] leading-[1.1] font-medium tracking-[-0.02em] text-ink md:text-[clamp(28px,2.6vw,38px)]">
                    {sh.title}
                  </h2>
                </div>
                <Link
                  href={sh.href}
                  className="shrink-0 text-[13px] font-semibold text-terracotta no-underline transition-colors hover:text-[#8f4324] md:text-[13.5px]"
                >
                  All {sh.count} →
                </Link>
              </div>

              {/* Mobile horizontal shelf */}
              <div className="nr-rail flex gap-3 overflow-x-auto px-[22px] pt-[15px] pb-1.5 md:hidden">
                {sh.items.map((it) => (
                  <Link
                    key={it.id}
                    href={it.href}
                    className="block w-[208px] shrink-0 overflow-hidden rounded-[14px] border border-[rgba(46,33,27,0.09)] bg-cream no-underline"
                  >
                    <div className="relative">
                      <ArticleThumb article={it} className="h-[132px]" playSize={40} />
                      <span
                        className="absolute top-[13px] left-[13px] rounded-full px-[11px] py-[5px] text-[8.5px] font-bold tracking-[0.14em] text-cream uppercase"
                        style={{ background: it.fmtColor }}
                      >
                        {it.fmt}
                      </span>
                    </div>
                    <div className="px-3.5 py-3.5">
                      <h3 className="font-display text-lg leading-[1.16] font-medium text-ink">{it.title}</h3>
                      <div className="mt-2.5 text-[11px] tracking-[0.05em] text-[#8a7a68]">
                        {it.meta} · {it.cat}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Desktop grid */}
              <div className="mt-[clamp(18px,1.8vw,26px)] hidden grid-cols-[repeat(auto-fill,minmax(272px,1fr))] gap-[clamp(18px,1.8vw,26px)] md:grid">
                {sh.items.map((it) => (
                  <Link
                    key={it.id}
                    href={it.href}
                    className="group block overflow-hidden rounded-2xl border border-[rgba(46,33,27,0.09)] bg-cream no-underline transition-transform hover:-translate-y-0.5"
                  >
                    <div className="relative">
                      <ArticleThumb article={it} className="h-[186px]" playSize={52} />
                      <span
                        className="absolute top-[13px] left-[13px] rounded-full px-[11px] py-[5px] text-[8.5px] font-bold tracking-[0.14em] text-cream uppercase"
                        style={{ background: it.fmtColor }}
                      >
                        {it.fmt}
                      </span>
                    </div>
                    <div className="px-5 py-[18px]">
                      <h3 className="font-display text-[22px] leading-[1.16] font-medium text-ink">{it.title}</h3>
                      <p className="mt-[11px] text-[14.5px] leading-[1.58] text-body">{it.dek}</p>
                      <div className="mt-[15px] text-[11.5px] tracking-[0.05em] text-[#8a7a68]">
                        {it.meta} · {it.cat}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {/* Consult CTA */}
          <section className="mx-auto max-w-[1240px] px-[22px] pt-[30px] md:px-[clamp(28px,4vw,56px)] md:pt-[clamp(48px,5vw,76px)]">
            <div className="flex flex-col items-center gap-5 rounded-[18px] bg-[#E7DCC9] px-6 py-8 text-center md:flex-row md:items-center md:gap-7 md:px-8 md:py-8 md:text-left">
              <div className="relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-full border-2 border-[rgba(46,33,27,0.12)] md:h-[92px] md:w-[92px]">
                <SmartImage src={drNina} alt="Dr. Nina Ross" fill className="object-cover object-[50%_20%]" unoptimized={drNina.startsWith("http")} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-[23px] leading-[1.1] font-medium tracking-[-0.015em] text-ink md:text-[clamp(26px,2.4vw,34px)]">
                  Ready to make this personal?
                </div>
                <p className="mt-[11px] max-w-[60ch] text-[15px] leading-[1.62] text-body md:text-base">
                  <span className="md:hidden">A half hour with our team turns all of this reading into your own answers.</span>
                  <span className="hidden md:inline">
                    A half hour with our team turns all of this reading into your own answers, read off your own labs and
                    your own story.
                  </span>
                </p>
              </div>
              <Link
                href="/start"
                className="shrink-0 rounded-[9px] bg-terracotta px-[30px] py-[17px] text-[15px] font-semibold whitespace-nowrap text-cream no-underline transition-colors hover:bg-terracotta-hover"
              >
                Book a $99 consult
              </Link>
            </div>
          </section>

          {/* Full index */}
          <section className="mx-auto max-w-[1240px] px-[22px] pt-[30px] md:px-[clamp(28px,4vw,56px)] md:pt-[clamp(48px,5vw,76px)]">
            <div className="flex items-end justify-between gap-4 border-b border-[rgba(46,33,27,0.1)] pb-3.5 md:pb-4">
              <div>
                <span className="text-[10.5px] font-semibold tracking-[0.22em] text-terracotta uppercase">
                  The whole library
                </span>
                <h2 className="mt-[9px] font-display text-[23px] leading-[1.1] font-medium tracking-[-0.02em] text-ink md:text-[clamp(28px,2.6vw,38px)]">
                  <span className="md:hidden">Every piece in the library</span>
                  <span className="hidden md:inline">Every piece in one list</span>
                </h2>
              </div>
              <span className="hidden shrink-0 font-newsreader text-base text-[#7d6f60] md:inline">Newest first</span>
              <span className="shrink-0 text-[13px] text-[#7d6f60] md:hidden">
                {countLabel}, newest first.
              </span>
            </div>
            <div className="mt-2 md:mt-3 md:grid md:grid-cols-2 md:gap-x-8">
              {pool.map((it) => (
                <Link
                  key={it.id}
                  href={it.href}
                  className="flex items-start gap-3 border-b border-[rgba(46,33,27,0.08)] py-3.5 no-underline transition-colors hover:bg-cream md:items-center md:gap-4 md:rounded-lg md:border-0 md:px-2 md:py-3"
                >
                  <span
                    className="w-[68px] shrink-0 text-[9px] font-bold tracking-[0.12em] uppercase"
                    style={{ color: it.fmtColor }}
                  >
                    {it.fmt}
                  </span>
                  <span className="min-w-0 flex-1 text-[14px] leading-[1.48] text-[#3d332b] md:text-[15.5px]">
                    {it.title}
                  </span>
                  <span className="hidden shrink-0 text-[11.5px] tracking-[0.05em] text-[#9a8870] md:inline">
                    {it.meta}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Topics */}
          <section className="mx-auto max-w-[1240px] px-[22px] pt-7 md:px-[clamp(28px,4vw,56px)] md:pt-[clamp(44px,4.6vw,66px)]">
            <span className="text-[10.5px] font-semibold tracking-[0.22em] text-terracotta uppercase">
              <span className="md:hidden">Browse by topic</span>
              <span className="hidden md:inline">Browse by</span>
            </span>
            <h2 className="mt-[9px] font-display text-[21px] leading-[1.1] font-medium tracking-[-0.02em] text-ink md:text-[clamp(28px,2.6vw,38px)]">
              <span className="md:hidden">Find your topic</span>
              <span className="hidden md:inline">Find your topic</span>
            </h2>
            <div className="mt-4 flex flex-wrap gap-2.5 md:mt-5 md:gap-3">
              {topics.map((t) => (
                <Link
                  key={t.label}
                  href={t.href}
                  className="group rounded-full border border-[rgba(46,33,27,0.14)] bg-cream px-[15px] py-2.5 text-sm font-medium text-[#4a4038] no-underline transition-colors hover:border-ink hover:bg-ink hover:text-cream md:px-[19px] md:py-3"
                >
                  {t.label}{" "}
                  <span className="text-xs text-[#9a8870] group-hover:text-[#d9ccbe]">{t.n}</span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Page footer (handoff) — shell Footer is suppressed on /blog */}
      <footer className="mt-[30px] bg-ink md:mt-[clamp(52px,5.4vw,84px)]">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-[22px] py-[30px] pb-[34px] md:grid-cols-[1.2fr_1fr] md:gap-12 md:px-[clamp(28px,4vw,56px)] md:py-12 md:pb-10">
          <div>
            <div className="font-display text-[23px] leading-[1.1] font-medium tracking-[-0.015em] text-cream-deep md:text-[clamp(26px,2.4vw,34px)]">
              Quick question instead?
            </div>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.62] text-[#b09a7d] md:mt-3 md:text-base">
              Learn &amp; Answers holds the short ones, answered in a sentence or two by Dr. Nina and the team.
            </p>
            <Link
              href="/#learn"
              className="mt-5 inline-block rounded-lg bg-gold px-6 py-3.5 text-[14.5px] font-semibold text-ink no-underline transition-colors hover:bg-[#f0c273]"
            >
              Go to Learn &amp; Answers
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 content-start">
            <Link href="/conditions" className="text-[14.5px] text-[#d8cab8] no-underline hover:text-cream-deep">
              Conditions
            </Link>
            <Link href="/treatments" className="text-[14.5px] text-[#d8cab8] no-underline hover:text-cream-deep">
              Treatments
            </Link>
            <Link href="/#patient-stories" className="text-[14.5px] text-[#d8cab8] no-underline hover:text-cream-deep">
              Patient Stories
            </Link>
            <Link href="/about" className="hidden text-[14.5px] text-[#d8cab8] no-underline hover:text-cream-deep md:inline">
              About Dr. Nina
            </Link>
            <Link href="/start" className="text-[14.5px] text-[#d8cab8] no-underline hover:text-cream-deep">
              Book a Consult
            </Link>
            <Link href="/about" className="hidden text-[14.5px] text-[#d8cab8] no-underline hover:text-cream-deep md:inline">
              Contact
            </Link>
          </div>
        </div>
        <div className="mx-auto hidden max-w-[1240px] items-center gap-3.5 border-t border-cream-deep/10 px-[clamp(28px,4vw,56px)] py-6 md:flex">
          <SmartImage
            src="/images/nina-ross-logo-cream.png"
            alt="Nina Ross Functional Medicine, Atlanta"
            width={220}
            height={62}
            className="h-[clamp(50px,4vw,62px)] w-auto"
          />
          <span className="font-newsreader text-[22px] leading-[0.7] text-gold-deep">℞</span>
          <span className="text-[12.5px] tracking-[0.04em] text-[#8a7a68]">
            Atlanta, Georgia · In person and virtual worldwide
          </span>
        </div>
      </footer>
    </div>
  );
}
