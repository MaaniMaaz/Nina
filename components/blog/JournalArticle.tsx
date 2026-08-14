"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEdit } from "@/components/admin/EditContext";
import EditableText from "@/components/admin/EditableText";
import EditableImage from "@/components/admin/EditableImage";
import { isJournalContent } from "@/lib/cms/types";
import {
  FORMAT_ACCENT,
  resolveCtaHref,
  type JournalArticle as JournalArticleData,
  type JournalBodyBlock,
  type JournalFormat,
} from "@/content/journal";
import {
  DEFAULT_WAVE,
  useArticleAudio,
  type ArticleAudioControls,
} from "@/components/blog/useArticleAudio";

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type Props = {
  article: JournalArticleData;
  showStickyCta?: boolean;
};

const SPEEDS = ["1x", "1.5x", "2x"] as const;
const SPEED_RATES = [1, 1.5, 2];
const LISTEN_SPEEDS = ["1x", "1.25x", "1.5x", "2x"] as const;
const LISTEN_RATES = [1, 1.25, 1.5, 2];

const FORMAT_BADGE: Record<JournalFormat, { bg: string; fg: string }> = {
  Read: { bg: "var(--color-terracotta)", fg: "var(--color-cream)" },
  Guide: { bg: "#8a6a3a", fg: "var(--color-cream)" },
  Watch: { bg: "#4a6340", fg: "var(--color-cream)" },
  Listen: { bg: "#B08A3E", fg: "var(--color-ink)" },
  Protocol: { bg: "var(--color-ink)", fg: "var(--color-cream)" },
};

type TimelineRow = {
  n?: string;
  label?: string;
  text?: string;
  title?: string;
  when?: string;
  what?: string;
};

function mmss(s: number): string {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r < 10 ? "0" : ""}${r}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function isRemote(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

function ArticleImg({
  src,
  alt,
  className,
  fill,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : 1200}
      height={fill ? undefined : 800}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={isRemote(src)}
    />
  );
}

function NinaAvatar({
  size,
  className = "",
}: {
  size: number;
  className?: string;
}) {
  const [src, setSrc] = useState("/images/dr-nina.png");
  return (
    <span
      className={`relative block overflow-hidden rounded-full bg-[#E7DCC9] ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt="Dr. Nina Ross, ND; Ph.D"
        fill
        className="object-cover"
        sizes={`${size}px`}
        onError={() => setSrc("/images/dr-nina.jpg")}
      />
    </span>
  );
}

function useFakeAudio(
  duration: number,
  src?: string | null,
  opts?: { slug?: string | null; speakText?: string | null },
) {
  return useArticleAudio({
    src,
    slug: opts?.slug,
    speakText: opts?.speakText,
    duration,
    rates: [...SPEED_RATES],
    labels: [...SPEEDS],
  });
}

function SharePills({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const email = () => {
    const url = window.location.href;
    window.location.href = `mailto:?subject=${encodeURIComponent(document.title)}&body=${encodeURIComponent(url)}`;
  };

  const text = () => {
    const url = window.location.href;
    window.location.href = `sms:?&body=${encodeURIComponent(url)}`;
  };

  const items = [
    {
      label: copied ? "Copied" : "Copy link",
      onClick: copy,
      active: copied,
    },
    { label: "Email", onClick: email, active: false },
    { label: "Text", onClick: text, active: false },
  ];

  return (
    <div className="flex items-center gap-[9px]">
      <span
        className={`font-sans font-bold uppercase tracking-[0.16em] text-[#9a8b7a] ${
          compact ? "text-[9px]" : "text-[9px]"
        }`}
      >
        Share
      </span>
      {items.map((s) => (
        <button
          key={s.label}
          type="button"
          onClick={s.onClick}
          className={`cursor-pointer rounded-full border font-sans font-semibold tracking-[0.03em] transition-[border-color] duration-[180ms] hover:border-ink ${
            compact
              ? "px-[11px] py-[6px] pb-[7px] text-[11px]"
              : "px-[15px] py-2 pb-[9px] text-xs"
          }`}
          style={{
            color: s.active ? "var(--color-cream)" : "#4a4038",
            background: s.active ? "var(--color-ink)" : "var(--color-cream)",
            borderColor: s.active ? "var(--color-ink)" : "rgba(46,33,27,0.16)",
          }}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

function Breadcrumbs({
  topicHref,
  topicLabel,
  dark = false,
}: {
  topicHref: string;
  topicLabel: string;
  dark?: boolean;
}) {
  const link = dark
    ? "text-[#b09a7d] hover:text-cream-deep"
    : "text-[#9a8b7a] hover:text-ink";
  const sep = dark ? "text-[#7d6a55]" : "text-[#b5a795]";
  const last = dark ? "text-[#d9ccbe] hover:text-cream-deep" : link;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/"
        className={`font-sans text-xs tracking-[0.04em] no-underline ${link}`}
      >
        Home
      </Link>
      <span className={`font-sans text-xs ${sep}`}>/</span>
      <Link
        href="/blog"
        className={`font-sans text-xs tracking-[0.04em] no-underline ${link}`}
      >
        The Journal
      </Link>
      {(topicLabel || topicHref) && (
        <>
          <span className={`font-sans text-xs ${sep}`}>/</span>
          <Link
            href={topicHref || "/blog"}
            className={`font-sans text-xs tracking-[0.04em] no-underline ${last}`}
          >
            <EditableText
              path="topicLabel"
              value={topicLabel || "Topic"}
              as="span"
            />
          </Link>
        </>
      )}
    </div>
  );
}

function FormatBadge({ format }: { format: JournalFormat }) {
  const { bg, fg } = FORMAT_BADGE[format] || FORMAT_BADGE.Read;
  return (
    <span
      className="rounded-full px-[13px] py-1.5 font-sans text-[9.5px] font-bold uppercase tracking-[0.16em]"
      style={{ background: bg, color: fg }}
    >
      {format}
    </span>
  );
}

function BylineRow({
  article,
  showShare = true,
}: {
  article: JournalArticleData;
  showShare?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 border-b border-[rgba(46,33,27,0.12)] pb-5">
      <div className="flex items-center gap-[13px]">
        <Link href="/about" className="block flex-none">
          <NinaAvatar size={52} />
        </Link>
        <div>
          <Link
            href="/about"
            className="font-sans text-[15px] font-semibold text-ink no-underline hover:text-terracotta"
          >
            Nina Ross, ND; Ph.D
          </Link>
          <div className="mt-[3px] font-sans text-[11.5px] tracking-[0.04em] text-[#8a7a68]">
            <EditableText path="dateLabel" value={article.dateLabel} as="span" /> ·
            Medically reviewed by Dr. Nina
          </div>
        </div>
      </div>
      {showShare ? <SharePills /> : null}
    </div>
  );
}

function ShortAnswer({
  text,
  accent,
  borderAccent,
}: {
  text: string;
  accent: string;
  borderAccent?: string;
}) {
  if (!text) return null;
  return (
    <div
      className="rounded-2xl border border-[rgba(46,33,27,0.1)] bg-cream p-[clamp(24px,2.4vw,32px)]"
      style={{ borderLeftWidth: 3, borderLeftColor: borderAccent || accent }}
    >
      <div
        className="font-sans text-[10px] font-bold uppercase tracking-[0.18em]"
        style={{
          color:
            accent === "#4a6340" || accent === "#B08A3E"
              ? accent
              : "var(--color-terracotta)",
        }}
      >
        The short answer
      </div>
      <p className="mt-3.5 max-w-[62ch] font-display text-[clamp(20px,1.7vw,24px)] font-normal leading-[1.44] text-ink">
        <EditableText path="shortAnswer" value={text} as="span" multiline />
      </p>
    </div>
  );
}

function DarkAudioRecap({
  duration,
  title,
  eyebrow = "Short on time",
  compact = false,
  src,
  slug,
  speakText,
}: {
  duration: number;
  title: string;
  eyebrow?: string;
  compact?: boolean;
  src?: string | null;
  slug?: string | null;
  speakText?: string | null;
}) {
  const audio = useFakeAudio(duration, src, { slug, speakText });
  const btn = compact ? 48 : 52;
  const playSize = compact ? 14 : 15;

  return (
    <div
      className={`bg-ink ${compact ? "rounded-2xl px-[22px] py-6 pb-[26px]" : "rounded-[18px] px-[22px] py-6 pb-[26px]"}`}
    >
      <div className="flex items-center gap-[9px]">
        <span
          className="h-px bg-[#B08A3E]"
          style={{ width: compact ? 18 : 20 }}
        />
        <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-gold-deep">
          {eyebrow}
        </span>
      </div>
      <div
        className={`mt-[11px] font-display font-medium leading-[1.18] text-cream-deep ${
          compact ? "text-xl" : "text-[21px]"
        }`}
      >
        {title}
      </div>
      <div className={`mt-[18px] flex items-center ${compact ? "gap-[13px]" : "gap-3.5"}`}>
        <button
          type="button"
          onClick={audio.togglePlay}
          aria-label={audio.playing ? "Pause the audio recap" : "Play the audio recap"}
          className="flex flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-gold p-0 transition-colors duration-[180ms] hover:bg-[#f0c273]"
          style={{ width: btn, height: btn }}
        >
          {audio.playing ? (
            <span className="flex gap-1">
              <span className="w-1 rounded-px bg-ink" style={{ height: compact ? 16 : 18 }} />
              <span className="w-1 rounded-px bg-ink" style={{ height: compact ? 16 : 18 }} />
            </span>
          ) : (
            <span
              className="ml-1 border-y-transparent border-l-ink border-r-0"
              style={{
                width: 0,
                height: 0,
                borderLeftWidth: playSize,
                borderTopWidth: compact ? 9 : 10,
                borderBottomWidth: compact ? 9 : 10,
                borderStyle: "solid",
              }}
            />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="h-[5px] rounded-[3px] bg-[rgba(246,238,225,0.22)]">
            <div
              className="h-[5px] rounded-[3px] bg-gold"
              style={{ width: `${audio.pct}%` }}
            />
          </div>
          {compact ? (
            <div className="mt-2 font-newsreader text-[12.5px] text-[#b09a7d]">
              {audio.elapsed} / {audio.total}
            </div>
          ) : (
            <div className="mt-[9px] flex items-center justify-between">
              <span className="font-newsreader text-[13px] text-[#b09a7d]">
                {audio.elapsed} / {audio.total}
              </span>
              <button
                type="button"
                onClick={audio.cycleSpeed}
                className="cursor-pointer rounded-full border border-[rgba(207,168,90,0.4)] bg-transparent px-[11px] py-1 font-sans text-[10.5px] font-semibold tracking-[0.06em] text-gold-deep"
              >
                {audio.speedLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LightAudioPlayer({
  duration,
  title,
  eyebrow = "Rather just listen",
}: {
  duration: number;
  title: string;
  eyebrow?: string;
}) {
  const audio = useFakeAudio(duration);
  return (
    <div className="rounded-[18px] border border-[rgba(46,33,27,0.1)] border-l-[3px] border-l-[#B08A3E] bg-cream px-5 py-[22px] pb-6">
      <div className="font-sans text-[9.5px] font-bold uppercase tracking-[0.18em] text-terracotta">
        {eyebrow}
      </div>
      <div className="mt-2.5 font-display text-xl font-medium leading-[1.16] text-ink">
        {title}
      </div>
      <div className="mt-4 flex items-center gap-[13px]">
        <button
          type="button"
          onClick={audio.togglePlay}
          aria-label={audio.playing ? "Pause audio" : "Play audio"}
          className="flex h-[50px] w-[50px] flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-ink p-0 transition-colors duration-[180ms] hover:bg-[#43312a]"
        >
          {audio.playing ? (
            <span className="flex gap-1">
              <span className="h-[17px] w-1 rounded-px bg-gold" />
              <span className="h-[17px] w-1 rounded-px bg-gold" />
            </span>
          ) : (
            <span
              className="ml-1"
              style={{
                width: 0,
                height: 0,
                borderLeft: "14px solid var(--color-gold)",
                borderTop: "9px solid transparent",
                borderBottom: "9px solid transparent",
              }}
            />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="h-[5px] rounded-[3px] bg-[rgba(46,33,27,0.14)]">
            <div
              className="h-[5px] rounded-[3px] bg-terracotta"
              style={{ width: `${audio.pct}%` }}
            />
          </div>
          <div className="mt-[9px] flex items-center justify-between">
            <span className="font-newsreader text-[13px] text-[#8a7a68]">
              {audio.elapsed} / {audio.total}
            </span>
            <button
              type="button"
              onClick={audio.cycleSpeed}
              className="cursor-pointer rounded-full border border-[rgba(181,87,47,0.4)] bg-transparent px-[11px] py-1 font-sans text-[10.5px] font-semibold tracking-[0.06em] text-terracotta"
            >
              {audio.speedLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SideCta({ article }: { article: JournalArticleData }) {
  const href = resolveCtaHref(article.cta.href);
  return (
    <div className="mt-4 rounded-[18px] border border-[rgba(46,33,27,0.1)] border-l-[3px] border-l-terracotta bg-cream px-[22px] py-6 pb-[26px]">
      <div className="font-display text-[22px] font-medium leading-[1.14] text-ink">
        <EditableText path="cta.title" value={article.cta.title} as="span" />
      </div>
      <p className="mt-[11px] font-sans text-[14.5px] leading-[1.6] text-body">
        <EditableText path="cta.body" value={article.cta.body} as="span" multiline />
      </p>
      <Link
        href={href}
        className="mt-4 block rounded-[9px] bg-terracotta px-[18px] py-3.5 text-center font-sans text-[14.5px] font-semibold text-cream no-underline transition-colors duration-[180ms] hover:bg-terracotta-hover"
      >
        <EditableText path="cta.ctaLabel" value={article.cta.ctaLabel} as="span" />
      </Link>
      <div className="mt-[11px] text-center font-sans text-[11px] tracking-[0.04em] text-[#9a8b7a]">
        In person in Atlanta or virtual worldwide
      </div>
    </div>
  );
}

function NextSidebar({
  items,
  label,
  accent,
  showPlay = false,
}: {
  items: JournalArticleData["next"];
  label: string;
  accent: string;
  showPlay?: boolean;
}) {
  if (!items?.length) return null;
  return (
    <div className="mt-4">
      <h2
        className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{ color: accent }}
      >
        {label}
      </h2>
      <div className="flex flex-col gap-2.5">
        {items.map((n, i) => (
          <Link
            key={n.href + n.title}
            href={n.href}
            className="flex items-center gap-[13px] rounded-[14px] border border-[rgba(46,33,27,0.08)] bg-cream px-[13px] py-[11px] no-underline transition-[transform,border-color] duration-[180ms] hover:-translate-y-0.5 hover:border-[rgba(46,33,27,0.22)]"
          >
            <span
              className={`relative flex-none overflow-hidden rounded-[9px] bg-[#E7DCC9] ${
                showPlay ? "h-[52px] w-[78px]" : "h-14 w-[66px]"
              }`}
            >
              {n.img ? (
                <ArticleImg
                  src={n.img}
                  alt={n.title}
                  fill
                  className="object-cover"
                  sizes="78px"
                />
              ) : null}
              {showPlay && (n.fmt === "Watch" || n.fmt === "Listen") ? (
                <span className="absolute inset-0 flex items-center justify-center bg-[rgba(20,12,7,0.24)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(246,238,225,0.94)]">
                    <span
                      className="ml-0.5"
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: "7px solid var(--color-terracotta)",
                        borderTop: "5px solid transparent",
                        borderBottom: "5px solid transparent",
                      }}
                    />
                  </span>
                </span>
              ) : null}
            </span>
            <div className="min-w-0 flex-1">
              <span
                className="font-sans text-[8px] font-bold uppercase tracking-[0.14em]"
                style={{ color: n.fmtColor || accent }}
              >
                {n.fmt} ·{" "}
                <EditableText path={`next.${i}.meta`} value={n.meta} as="span" />
              </span>
              <div className="mt-1 font-display text-[15.5px] font-medium leading-[1.2] text-ink">
                <EditableText path={`next.${i}.title`} value={n.title} as="span" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NextCards3Up({
  items,
}: {
  items: JournalArticleData["next"];
}) {
  if (!items?.length) return null;
  return (
    <div className="mt-[clamp(34px,3.4vw,48px)]">
      <h2 className="m-0 font-display text-[clamp(24px,2vw,30px)] font-medium leading-[1.14] tracking-[-0.015em] text-ink">
        Read next
      </h2>
      <div className="mt-[18px] grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((n, i) => (
          <Link
            key={n.href + n.title}
            href={n.href}
            className="flex flex-col overflow-hidden rounded-2xl border border-[rgba(46,33,27,0.09)] bg-cream no-underline transition-[transform,border-color] duration-[180ms] hover:-translate-y-[3px] hover:border-[rgba(46,33,27,0.24)]"
          >
            <div className="relative h-[148px] bg-[#E7DCC9]">
              {n.img ? (
                <ArticleImg
                  src={n.img}
                  alt={n.title}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              ) : null}
            </div>
            <div className="px-[18px] pt-[18px] pb-5">
              <span
                className="font-sans text-[8.5px] font-bold uppercase tracking-[0.14em]"
                style={{ color: n.fmtColor || "var(--color-terracotta)" }}
              >
                {n.fmt} ·{" "}
                <EditableText path={`next.${i}.meta`} value={n.meta} as="span" />
              </span>
              <div className="mt-[7px] font-display text-[19px] font-medium leading-[1.18] text-ink">
                <EditableText path={`next.${i}.title`} value={n.title} as="span" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Takeaways({ items }: { items: JournalArticleData["takeaways"] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-[clamp(36px,3.6vw,52px)] rounded-[18px] bg-[#34402C] p-[clamp(28px,2.8vw,40px)]">
      <div className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
        Take this with you
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2 md:gap-x-8">
        {items.map((t, i) => (
          <div key={t.n + t.text} className="flex items-start gap-3.5">
            <span className="flex-none font-display text-[17px] font-medium leading-[1.5] text-gold">
              <EditableText path={`takeaways.${i}.n`} value={t.n} as="span" />
            </span>
            <span className="flex-1 font-sans text-base leading-[1.6] text-[#e8e4d6]">
              <EditableText path={`takeaways.${i}.text`} value={t.text} as="span" multiline />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Related({ items }: { items: JournalArticleData["related"] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-[clamp(36px,3.6vw,52px)]">
      <h2 className="m-0 font-display text-[clamp(24px,2vw,30px)] font-medium leading-[1.14] tracking-[-0.015em] text-ink">
        Where this connects
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((r, i) => (
          <Link
            key={r.href + r.label}
            href={r.href}
            className="flex items-center gap-[13px] rounded-xl border border-[rgba(46,33,27,0.09)] bg-cream px-[17px] py-4 no-underline transition-[transform,border-color] duration-[180ms] hover:-translate-y-0.5 hover:border-[rgba(46,33,27,0.24)]"
          >
            <span
              className="flex-none rounded-full px-2.5 py-1 font-sans text-[8.5px] font-bold uppercase tracking-[0.14em]"
              style={{ color: r.kindColor, background: r.kindBg }}
            >
              {r.kind}
            </span>
            <span className="flex-1 font-sans text-[15px] font-medium text-[#3d332b]">
              <EditableText path={`related.${i}.label`} value={r.label} as="span" />
            </span>
            <span className="flex-none font-sans text-[15px] text-terracotta">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AuthorCard() {
  return (
    <div className="mt-[clamp(30px,3vw,42px)] rounded-[18px] border border-[rgba(46,33,27,0.1)] bg-cream p-[clamp(26px,2.6vw,36px)]">
      <div className="flex flex-col items-start gap-[22px] sm:flex-row sm:items-center">
        <NinaAvatar size={96} className="flex-none" />
        <div className="min-w-0 flex-1">
          <div className="font-display text-[clamp(22px,1.9vw,27px)] font-medium leading-[1.14] text-ink">
            Nina Ross, ND; Ph.D
          </div>
          <div className="mt-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a8b7a]">
            Naturopathic doctor · Board-certified trichologist · Atlanta
          </div>
          <p className="mt-3 max-w-[62ch] font-sans text-[15.5px] leading-[1.62] text-body">
            Dr. Nina reads the full panel, connects it to how you actually feel, and builds
            the plan from there. She sees patients in Atlanta and virtually worldwide.
          </p>
          <Link
            href="/about"
            className="mt-3 inline-block font-sans text-[13.5px] font-semibold text-terracotta no-underline hover:text-[#8f4324]"
          >
            More about Dr. Nina →
          </Link>
        </div>
      </div>
    </div>
  );
}

function TranscriptAccordion({
  transcript,
  onSeek,
}: {
  transcript: JournalArticleData["transcript"];
  onSeek?: (seconds: number) => void;
}) {
  const [open, setOpen] = useState(false);
  if (!transcript?.length) return null;

  const seekSeconds = (tr: JournalArticleData["transcript"][number]) => {
    if (typeof tr.t === "number") return tr.t;
    if (typeof tr.t === "string" && tr.t.includes(":")) {
      const [m, s] = tr.t.split(":").map(Number);
      return (m || 0) * 60 + (s || 0);
    }
    if (tr.time && tr.time.includes(":")) {
      const [m, s] = tr.time.split(":").map(Number);
      return (m || 0) * 60 + (s || 0);
    }
    return 0;
  };

  return (
    <div className="mt-[clamp(34px,3.4vw,48px)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full cursor-pointer items-center justify-between gap-4 border border-[rgba(46,33,27,0.1)] bg-cream px-[22px] py-5 text-left transition-[border-color] duration-[180ms] hover:border-[rgba(46,33,27,0.26)] ${
          open ? "rounded-t-2xl rounded-b-none" : "rounded-2xl"
        }`}
      >
        <span>
          <span className="block font-sans text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#9a8b7a]">
            Full transcript
          </span>
          <span className="mt-[5px] block font-display text-[21px] font-medium leading-[1.16] text-ink">
            {open ? "Hide the transcript" : "Read the transcript"}
          </span>
        </span>
        <span className="flex-none font-sans text-[22px] text-terracotta">
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? (
        <div className="-mt-2 rounded-b-2xl border border-t-0 border-[rgba(46,33,27,0.1)] bg-cream px-[22px] py-6 pb-[26px]">
          {transcript.map((tr, i) => (
            <button
              key={(tr.time || String(tr.t) || "") + i}
              type="button"
              onClick={() => onSeek?.(seekSeconds(tr))}
              disabled={!onSeek}
              className={`mb-1.5 flex w-full items-start gap-[18px] rounded-lg border-0 bg-transparent p-2 text-left ${
                onSeek
                  ? "cursor-pointer transition-colors duration-[180ms] hover:bg-cream-deep"
                  : "cursor-default"
              }`}
            >
              <span className="w-10 flex-none font-newsreader text-sm text-terracotta">
                {tr.time || tr.t || ""}
              </span>
              <p className="m-0 max-w-[64ch] min-w-0 flex-1 font-sans text-base leading-[1.72] text-[#3d332b]">
                {tr.text}
              </p>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PanelList({
  items,
  accent,
  cols = false,
}: {
  items: JournalArticleData["panelItems"];
  accent: string;
  cols?: boolean;
}) {
  if (!items?.length) return null;
  return (
    <div
      className={`mt-[22px] ${
        cols ? "grid gap-[18px] gap-x-7 sm:grid-cols-2" : "flex flex-col gap-4"
      }`}
    >
      {items.map((p, i) => (
        <div key={p.name} className="flex items-start gap-3.5">
          <span
            className="flex-none font-newsreader text-[17px] leading-[1.5]"
            style={{ color: accent }}
            dangerouslySetInnerHTML={{ __html: "&#8478;" }}
          />
          <div className="min-w-0 flex-1">
            <span className="font-newsreader text-xl text-ink">
              <EditableText path={`panelItems.${i}.name`} value={p.name} as="span" />
            </span>
            <p className="mt-1 font-sans text-[15.5px] leading-[1.6] text-body">
              <EditableText path={`panelItems.${i}.why`} value={p.why} as="span" multiline />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function MarkerList({
  items,
  accent,
}: {
  items: JournalArticleData["markers"];
  accent: string;
}) {
  if (!items?.length) return null;
  return (
    <div className="mt-[22px] flex flex-col gap-4">
      {items.map((m, i) => {
        const name = m.name || m.label || "";
        const why = m.why || m.note || "";
        return (
          <div key={name + i} className="flex items-start gap-3.5">
            <span
              className="flex-none font-newsreader text-[17px] leading-[1.5]"
              style={{ color: accent }}
              dangerouslySetInnerHTML={{ __html: "&#8478;" }}
            />
            <div className="min-w-0 flex-1">
              <span className="font-newsreader text-xl text-ink">{name}</span>
              {why ? (
                <p className="mt-1 font-sans text-[15.5px] leading-[1.6] text-body">
                  {why}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimelineList({
  items,
  accent,
}: {
  items: JournalArticleData["timeline"];
  accent: string;
}) {
  if (!items?.length) return null;
  const rows = items as TimelineRow[];
  return (
    <div className="mt-[26px] flex max-w-[76ch] flex-col">
      {rows.map((tl, i) => {
        const left = tl.when || tl.n || tl.label || tl.title || "";
        const right = tl.what || tl.text || tl.label || "";
        return (
          <div
            key={left + i}
            className="flex items-baseline gap-[22px] border-b border-[rgba(46,33,27,0.1)] py-4"
          >
            <span
              className="w-[120px] flex-none font-newsreader text-[17px]"
              style={{ color: accent }}
            >
              {left}
            </span>
            <span className="flex-1 font-sans text-base leading-[1.6] text-[#3d332b]">
              {right}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function BodyBlocks({
  article,
  accent,
  isGuide = false,
}: {
  article: JournalArticleData;
  accent: string;
  isGuide?: boolean;
}) {
  const edit = useEdit();
  const blocks = article.body || [];

  const nodes = blocks.map((block, i) => {
    const key = `${block.type}-${i}`;
    const prev = blocks[i - 1];

    if (block.type === "paragraph") {
      const mt =
        i === 0
          ? "mt-0"
          : prev?.type === "heading"
            ? "mt-4"
            : prev?.type === "panelList" || prev?.type === "markerList"
              ? "mt-6"
              : "mt-5";
      const linkHtml = block.html
        ? block.html.replace(
            /<a /g,
            '<a class="text-terracotta no-underline border-b border-[rgba(181,87,47,0.4)]" ',
          )
        : null;
      if (linkHtml && !edit?.enabled) {
        return (
          <p
            key={key}
            className={`max-w-[68ch] font-sans text-[clamp(17px,1.35vw,19px)] leading-[1.76] text-[#3d332b] ${mt}`}
            dangerouslySetInnerHTML={{ __html: linkHtml }}
          />
        );
      }
      return (
        <p
          key={key}
          className={`max-w-[68ch] font-sans text-[clamp(17px,1.35vw,19px)] leading-[1.76] text-[#3d332b] ${mt}`}
        >
          <EditableText
            path={`body.${i}.text`}
            value={block.text || ""}
            as="span"
            multiline
          />
        </p>
      );
    }

    if (block.type === "heading") {
      const id = block.id || slugifyHeading(block.text);
      if (isGuide && block.chapterLabel) {
        return (
          <h2
            key={key}
            id={id}
            className="mt-[clamp(38px,3.8vw,54px)] scroll-mt-32"
          >
            <span
              className="mb-2.5 block font-sans text-[9.5px] font-bold uppercase tracking-[0.2em]"
              style={{ color: accent }}
            >
              <EditableText
                path={`body.${i}.chapterLabel`}
                value={block.chapterLabel}
                as="span"
              />
            </span>
            <span className="block font-display text-[clamp(28px,2.4vw,36px)] font-medium leading-[1.12] tracking-[-0.02em] text-ink">
              <EditableText path={`body.${i}.text`} value={block.text} as="span" />
            </span>
          </h2>
        );
      }
      const lines = block.text.split("\n");
      if (isGuide && lines.length > 1) {
        if (edit?.enabled) {
          return (
            <h2
              key={key}
              id={id}
              className="mt-[clamp(38px,3.8vw,54px)] scroll-mt-32 font-display text-[clamp(28px,2.4vw,36px)] font-medium leading-[1.12] tracking-[-0.02em] text-ink"
            >
              <EditableText
                path={`body.${i}.text`}
                value={block.text}
                as="span"
                multiline
              />
            </h2>
          );
        }
        return (
          <h2
            key={key}
            id={id}
            className="mt-[clamp(38px,3.8vw,54px)] scroll-mt-32"
          >
            <span
              className="mb-2.5 block font-sans text-[9.5px] font-bold uppercase tracking-[0.2em]"
              style={{ color: accent }}
            >
              {lines[0]}
            </span>
            <span className="block font-display text-[clamp(28px,2.4vw,36px)] font-medium leading-[1.12] tracking-[-0.02em] text-ink">
              {lines.slice(1).join(" ")}
            </span>
          </h2>
        );
      }
      return (
        <h2
          key={key}
          id={id}
          className={`${
            i === 0 ? "mt-0" : "mt-[clamp(34px,3.4vw,48px)]"
          } scroll-mt-32 font-display text-[clamp(26px,2.2vw,36px)] font-medium leading-[1.12] tracking-[-0.02em] text-ink`}
        >
          <EditableText path={`body.${i}.text`} value={block.text} as="span" />
        </h2>
      );
    }

    if (block.type === "pullQuote") {
      const quoteColor =
        accent === "#8a6a3a" || accent === "#4a6340" || accent === "#B08A3E"
          ? accent
          : FORMAT_ACCENT.Read;
      return (
        <blockquote
          key={key}
          className="m-0 mt-[clamp(30px,3vw,42px)] max-w-[60ch] p-0"
        >
          <div
            className="font-display text-[60px] leading-[0.55]"
            style={{ color: hexToRgba(accent, 0.45) }}
          >
            “
          </div>
          <p
            className="mt-2.5 font-display text-[clamp(26px,2.4vw,34px)] font-medium italic leading-[1.28]"
            style={{ color: quoteColor }}
          >
            <EditableText
              path={`body.${i}.text`}
              value={block.text}
              as="span"
              multiline
            />
          </p>
        </blockquote>
      );
    }

    if (block.type === "figure") {
      return (
        <figure key={key} className="m-0 mt-[clamp(30px,3vw,42px)]">
          <div className="relative h-[clamp(280px,26vw,380px)] overflow-hidden rounded-[18px] bg-[#E7DCC9]">
            <ArticleImg
              src={block.src}
              alt={block.alt}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 70vw"
            />
          </div>
          {block.caption ? (
            <figcaption className="mt-2.5 font-sans text-xs leading-[1.5] text-[#9a8b7a]">
              <EditableText
                path={`body.${i}.caption`}
                value={block.caption}
                as="span"
              />
            </figcaption>
          ) : null}
        </figure>
      );
    }

    if (block.type === "aside") {
      return (
        <div
          key={key}
          className="mt-[clamp(28px,2.8vw,38px)] flex items-center gap-5 rounded-2xl bg-[#E7DCC9] p-[clamp(22px,2.2vw,30px)]"
        >
          <NinaAvatar size={76} className="flex-none bg-cream" />
          <div className="min-w-0 flex-1">
            <p className="m-0 font-hand text-[clamp(24px,2.2vw,30px)] leading-[1.24] text-terracotta">
              <EditableText
                path={`body.${i}.text`}
                value={block.text.split("\n")[0]}
                as="span"
                multiline
              />
            </p>
            <div className="mt-2.5 font-sans text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#9a8b7a]">
              Nina Ross, ND; Ph.D
            </div>
          </div>
        </div>
      );
    }

    if (block.type === "panelList") {
      return (
        <PanelList
          key={key}
          items={article.panelItems}
          accent={isGuide ? accent : FORMAT_ACCENT.Read}
          cols={isGuide}
        />
      );
    }

    if (block.type === "markerList") {
      return <MarkerList key={key} items={article.markers} accent={accent} />;
    }

    if (block.type === "timeline") {
      return (
        <TimelineList key={key} items={article.timeline} accent={accent} />
      );
    }

    return null;
  });

  return (
    <div
      className={
        isGuide
          ? "mt-[clamp(32px,3.4vw,46px)]"
          : "mt-[clamp(30px,3.2vw,44px)] max-w-[68ch]"
      }
    >
      {nodes}
    </div>
  );
}

function GuideCtaBand({ article }: { article: JournalArticleData }) {
  return (
    <div className="mt-[clamp(30px,3vw,42px)] grid items-center gap-[clamp(22px,2.4vw,34px)] rounded-[18px] border border-[rgba(46,33,27,0.1)] border-l-[3px] border-l-terracotta bg-cream p-[clamp(26px,2.6vw,36px)] md:grid-cols-[auto_1fr_auto]">
      <NinaAvatar size={82} className="flex-none" />
      <div>
        <div className="font-display text-[clamp(24px,2.2vw,32px)] font-medium leading-[1.12] tracking-[-0.015em] text-ink">
          <EditableText path="cta.title" value={article.cta.title} as="span" />
        </div>
        <p className="mt-2.5 max-w-[58ch] font-sans text-base leading-[1.62] text-body">
          <EditableText path="cta.body" value={article.cta.body} as="span" multiline />
        </p>
      </div>
      <Link
        href={resolveCtaHref(article.cta.href)}
        className="flex-none whitespace-nowrap rounded-[9px] bg-terracotta px-[30px] py-[17px] text-center font-sans text-[15px] font-semibold text-cream no-underline transition-colors duration-[180ms] hover:bg-terracotta-hover"
      >
        <EditableText path="cta.ctaLabel" value={article.cta.ctaLabel} as="span" />
      </Link>
    </div>
  );
}

function DarkFooterCta({ article }: { article: JournalArticleData }) {
  const band = article.footerCta || article.cta;
  const pathPrefix =
    article.footerCta ? "footerCta" : "cta";
  return (
    <div className="mt-[clamp(56px,5.6vw,88px)] bg-ink">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-[clamp(30px,4vw,72px)] px-[clamp(24px,6vw,100px)] py-[clamp(40px,4.4vw,64px)] pb-[clamp(34px,3.6vw,52px)] md:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="font-display text-[clamp(26px,2.4vw,34px)] font-medium leading-[1.1] tracking-[-0.015em] text-cream-deep">
            <EditableText
              path={`${pathPrefix}.title`}
              value={band.title}
              as="span"
            />
          </div>
          <p className="mt-3 max-w-[52ch] font-sans text-base leading-[1.62] text-[#b09a7d]">
            <EditableText
              path={`${pathPrefix}.body`}
              value={band.body}
              as="span"
              multiline
            />
          </p>
          <Link
            href={resolveCtaHref(band.href)}
            className="mt-5 inline-block rounded-lg bg-gold px-6 py-3.5 font-sans text-[14.5px] font-semibold text-ink no-underline transition-colors duration-[180ms] hover:bg-[#f0c273]"
          >
            <EditableText
              path={`${pathPrefix}.ctaLabel`}
              value={band.ctaLabel}
              as="span"
            />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 self-center">
          {[
            { href: "/blog", label: "The Journal" },
            { href: "/conditions", label: "Conditions" },
            { href: "/treatments", label: "Treatments" },
            { href: "/start", label: "Start · $99" },
            { href: "/about", label: "Dr. Nina" },
            { href: "/#patient-stories", label: "Patient stories" },
          ].map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="font-sans text-[14.5px] text-[#d8cab8] no-underline transition-colors hover:text-cream-deep"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 border-t border-[rgba(246,238,225,0.12)] px-[clamp(24px,6vw,100px)] py-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/nina-ross-logo-cream.png"
          alt="Nina Ross Functional Medicine, Atlanta"
          className="block h-[clamp(50px,5vw,62px)] w-auto"
        />
        <p className="m-0 font-sans text-[12px] tracking-[0.04em] text-[#8a7a68]">
          Atlanta · Virtual care nationwide
        </p>
      </div>
    </div>
  );
}

function MobileStickyCta({ article }: { article: JournalArticleData }) {
  return (
    <div className="sticky bottom-0 z-[45] flex items-center gap-[13px] border-t border-[rgba(46,33,27,0.12)] bg-[rgba(251,246,236,0.96)] px-5 py-[13px] pb-4 backdrop-blur-[12px] md:hidden">
      <div className="min-w-0 flex-1">
        <div className="font-display text-[15.5px] font-medium leading-[1.16] text-ink">
          <EditableText path="cta.title" value={article.cta.title} as="span" />
        </div>
        <div className="mt-0.5 font-sans text-[10.5px] tracking-[0.04em] text-[#8a7a68]">
          A half hour with our team
        </div>
      </div>
      <Link
        href={resolveCtaHref(article.cta.href)}
        className="flex-none whitespace-nowrap rounded-lg bg-terracotta px-[18px] py-[13px] font-sans text-[13.5px] font-semibold text-cream no-underline"
      >
        $99 consult
      </Link>
    </div>
  );
}

function deriveChapters(article: JournalArticleData) {
  if (article.chapters?.length) return article.chapters;
  return article.body
    .filter((b): b is Extract<JournalBodyBlock, { type: "heading" }> => b.type === "heading")
    .map((h, i) => {
      const lines = h.text.split("\n");
      const label =
        lines.length > 1
          ? lines.slice(1).join(" ").trim()
          : h.text.replace(/^chapter\s+\w+\s*/i, "").trim() || h.text;
      return {
        href: `#${h.id || slugifyHeading(h.text)}`,
        n: String(i + 1).padStart(2, "0"),
        label,
      };
    });
}

function VideoTheater({
  article,
  accent,
}: {
  article: JournalArticleData;
  accent: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [startAt, setStartAt] = useState(0);
  const poster =
    article.mediaPoster || article.hero?.src || "/images/home-media/feed-a4.webp";
  const durationLabel = article.readTime.split("·")[0]?.trim() || "";
  const vid = article.youtubeId;
  const canEmbed = Boolean(vid && vid !== "VIDEO_ID");

  const play = (at = 0) => {
    setStartAt(at);
    if (canEmbed) setPlaying(true);
  };

  return (
    <div className="relative overflow-hidden bg-ink">
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/images/grain.png')] bg-[length:180px] opacity-35 mix-blend-overlay"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1240px] px-[clamp(24px,6vw,100px)] py-[clamp(28px,3vw,44px)] pb-[clamp(34px,3.4vw,50px)]">
        <div className="mb-[clamp(18px,2vw,26px)]">
          <Breadcrumbs
            topicHref={article.topicHref || "/blog/format/watch"}
            topicLabel={article.topicLabel || "Watch"}
            dark
          />
        </div>

        <div className="grid items-start gap-[clamp(24px,2.6vw,40px)] md:grid-cols-[minmax(0,1fr)_306px]">
          <div className="relative aspect-video w-full overflow-hidden rounded-[18px] bg-[#1a1410] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            {playing && canEmbed ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1&start=${startAt || 0}`}
                title={article.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <button
                type="button"
                onClick={() => play(0)}
                aria-label="Play the video on YouTube"
                className="absolute inset-0 block h-full w-full cursor-pointer border-0 bg-transparent p-0"
              >
                <ArticleImg
                  src={poster}
                  alt={article.hero?.alt || article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 70vw"
                  priority
                />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,12,7,0.3)_0%,rgba(20,12,7,0.06)_42%,rgba(20,12,7,0.52))]" />
                <span className="absolute top-1/2 left-1/2 flex h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(246,238,225,0.95)] shadow-[0_12px_34px_rgba(0,0,0,0.4)]">
                  <span
                    className="ml-[7px]"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "28px solid var(--color-terracotta)",
                      borderTop: "18px solid transparent",
                      borderBottom: "18px solid transparent",
                    }}
                  />
                </span>
                {durationLabel ? (
                  <span className="absolute right-[18px] bottom-[18px] rounded-md bg-[rgba(20,12,7,0.72)] px-3 py-[7px] font-sans text-xs font-bold tracking-[0.1em] text-cream-deep">
                    <EditableText
                      path="readTime"
                      value={durationLabel.replace(/\s*watch$/i, "")}
                      as="span"
                    />
                  </span>
                ) : null}
                <span className="absolute bottom-[18px] left-[18px] rounded-full bg-gold px-3.5 py-[7px] font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
                  Watch on YouTube
                </span>
              </button>
            )}
          </div>

          {article.videoChapters?.length ? (
            <div>
              <div className="flex items-center gap-2.5">
                <span className="h-px w-5 bg-[#B08A3E]" />
                <span className="font-sans text-[9.5px] font-bold uppercase tracking-[0.2em] text-gold-deep">
                  Chapters
                </span>
              </div>
              <div className="mt-3.5 flex flex-col gap-0.5">
                {article.videoChapters.map((c, i) => (
                  <button
                    key={(c.time || c.t || "") + i}
                    type="button"
                    onClick={() => play(c.start || 0)}
                    className="flex cursor-pointer items-baseline gap-[13px] border-0 border-b border-[rgba(246,238,225,0.12)] bg-transparent px-1.5 py-3 text-left transition-colors duration-[180ms] hover:bg-[rgba(246,238,225,0.07)]"
                  >
                    <span className="w-[34px] flex-none font-newsreader text-sm text-gold">
                      {c.time || c.t || ""}
                    </span>
                    <span className="flex-1 font-sans text-sm font-medium leading-[1.4] text-cream-deep">
                      {c.label || ""}
                    </span>
                  </button>
                ))}
              </div>
              <Link
                href="/blog?fmt=Watch"
                className="mt-[18px] inline-block font-sans text-[12.5px] font-semibold text-gold no-underline hover:text-[#f0c273]"
              >
                All videos →
              </Link>
            </div>
          ) : (
            <div className="hidden md:block">
              <div className="flex items-center gap-2.5">
                <span className="h-px w-5 bg-[#B08A3E]" />
                <span className="font-sans text-[9.5px] font-bold uppercase tracking-[0.2em] text-gold-deep">
                  About this video
                </span>
              </div>
              <p className="mt-3.5 font-sans text-sm leading-relaxed text-[#d9ccbe]">
                <EditableText path="dek" value={article.dek} as="span" multiline />
              </p>
              <Link
                href="/blog?fmt=Watch"
                className="mt-[18px] inline-block font-sans text-[12.5px] font-semibold text-gold no-underline hover:text-[#f0c273]"
              >
                All videos →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ListenHero({
  article,
  audio,
}: {
  article: JournalArticleData;
  audio: ArticleAudioControls;
}) {
  const poster =
    article.mediaPoster || article.hero?.src || "/images/dr-nina.png";
  const wave = article.wave?.length ? article.wave : DEFAULT_WAVE;
  const playedBars = (audio.t / audio.duration) * wave.length;
  const downloadHref = article.audioUrl || undefined;

  let activeChapter = 0;
  (article.videoChapters || []).forEach((c, i) => {
    const start = c.start ?? 0;
    if (audio.t >= start) activeChapter = i;
  });

  return (
    <div className="relative overflow-hidden bg-ink">
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/images/grain.png')] bg-[length:180px] opacity-35 mix-blend-overlay"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-[-260px] right-[-120px] h-[520px] w-[720px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(233,180,90,0.17), rgba(233,180,90,0))",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1240px] px-[clamp(24px,6vw,100px)] py-[clamp(26px,3vw,40px)] pb-[clamp(36px,3.6vw,54px)]">
        <div className="mb-[clamp(20px,2.2vw,30px)]">
          <Breadcrumbs
            topicHref={article.topicHref || "/blog/format/listen"}
            topicLabel={article.topicLabel || "Listen"}
            dark
          />
        </div>

        <div className="grid items-start gap-[clamp(28px,3vw,48px)] md:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[210px_minmax(0,1fr)_300px]">
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-[18px] bg-[#43312a] shadow-[0_18px_44px_rgba(0,0,0,0.38)]">
              <ArticleImg
                src={poster}
                alt={article.hero?.alt || article.title}
                fill
                className="object-cover"
                sizes="210px"
                priority
              />
            </div>
            <div className="mt-3.5 flex items-center gap-[9px]">
              <span className="h-px w-4 bg-[#B08A3E]" />
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-gold-deep">
                From the studio
              </span>
            </div>
          </div>

          <div>
            <h1 className="m-0 font-display text-[clamp(34px,3.4vw,48px)] font-medium leading-[1.06] tracking-[-0.025em] text-cream-deep">
              <EditableText path="title" value={article.title} as="span" multiline />
            </h1>
            <div className="mt-3 font-sans text-[12.5px] tracking-[0.06em] text-[#b09a7d]">
              Dr. Nina Ross, ND; Ph.D · {audio.total}
              {article.articleSection ? (
                <>
                  {" · "}
                  <EditableText
                    path="articleSection"
                    value={article.articleSection}
                    as="span"
                  />
                </>
              ) : null}
            </div>

            {/* Waveform — matches Articles HTML WAVE bars */}
            <div className="mt-[clamp(22px,2.4vw,32px)] flex h-[88px] items-center gap-[3px]">
              {wave.map((h, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Seek to ${mmss(Math.round((i / wave.length) * audio.duration))}`}
                  onClick={() =>
                    audio.seek(Math.round((i / wave.length) * audio.duration))
                  }
                  className="flex h-[88px] min-w-0 flex-1 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
                >
                  <span
                    className="block w-full rounded-[3px]"
                    style={{
                      height: Math.round(h * 1.6),
                      background:
                        i <= playedBars
                          ? "#E9B45A"
                          : "rgba(246,238,225,0.24)",
                    }}
                  />
                </button>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="font-newsreader text-sm text-gold-deep">
                {audio.elapsed}
              </span>
              <span className="font-newsreader text-sm text-[#8a7a68]">
                {audio.remaining}
              </span>
            </div>

            <div className="mt-[clamp(18px,2vw,26px)] flex flex-wrap items-center gap-3 md:gap-5">
              <button
                type="button"
                onClick={audio.togglePlay}
                aria-label={audio.playing ? "Pause" : "Play"}
                className="flex h-[72px] w-[72px] flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-gold p-0 transition-colors duration-[180ms] hover:bg-[#f0c273]"
              >
                {audio.playing ? (
                  <span className="flex gap-1.5">
                    <span className="h-[25px] w-1.5 rounded-px bg-ink" />
                    <span className="h-[25px] w-1.5 rounded-px bg-ink" />
                  </span>
                ) : (
                  <span
                    className="ml-1.5"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "22px solid var(--color-ink)",
                      borderTop: "14px solid transparent",
                      borderBottom: "14px solid transparent",
                    }}
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => audio.skip(-15)}
                className="flex cursor-pointer items-center gap-[7px] rounded-full border border-[rgba(246,238,225,0.24)] bg-transparent px-4 py-2.5 transition-[border-color] duration-[180ms] hover:border-[rgba(233,180,90,0.7)]"
              >
                <span className="font-sans text-base leading-none text-cream-deep">
                  ↺
                </span>
                <span className="font-sans text-xs font-semibold tracking-[0.06em] text-[#d9ccbe]">
                  15s
                </span>
              </button>

              <button
                type="button"
                onClick={() => audio.skip(30)}
                className="flex cursor-pointer items-center gap-[7px] rounded-full border border-[rgba(246,238,225,0.24)] bg-transparent px-4 py-2.5 transition-[border-color] duration-[180ms] hover:border-[rgba(233,180,90,0.7)]"
              >
                <span className="font-sans text-base leading-none text-cream-deep">
                  ↻
                </span>
                <span className="font-sans text-xs font-semibold tracking-[0.06em] text-[#d9ccbe]">
                  30s
                </span>
              </button>

              <button
                type="button"
                onClick={audio.cycleSpeed}
                className="cursor-pointer rounded-full border border-[rgba(207,168,90,0.4)] bg-transparent px-[17px] py-[11px] font-sans text-xs font-semibold tracking-[0.06em] text-gold-deep transition-[border-color] duration-[180ms] hover:border-[rgba(233,180,90,0.9)]"
              >
                {audio.speedLabel}
              </button>

              {downloadHref ? (
                <a
                  href={downloadHref}
                  download
                  className="font-sans text-xs font-semibold tracking-[0.06em] text-[#b09a7d] no-underline transition-colors hover:text-cream-deep"
                >
                  Download
                </a>
              ) : null}
            </div>
          </div>

          {article.videoChapters?.length ? (
            <div className="hidden xl:block">
              <div className="font-sans text-[9.5px] font-bold uppercase tracking-[0.2em] text-gold-deep">
                Chapters
              </div>
              <div className="mt-3.5 flex flex-col">
                {article.videoChapters.map((c, i) => {
                  const active = i === activeChapter;
                  return (
                    <button
                      key={(c.time || "") + i}
                      type="button"
                      onClick={() => audio.seek(c.start ?? 0)}
                      className="flex cursor-pointer items-baseline gap-3 border-0 border-b border-[rgba(246,238,225,0.12)] bg-transparent px-1.5 py-3 text-left transition-colors duration-[180ms] hover:bg-[rgba(246,238,225,0.07)]"
                    >
                      <span
                        className="w-[34px] flex-none font-newsreader text-[13.5px]"
                        style={{ color: active ? "#E9B45A" : "#b09a7d" }}
                      >
                        {c.time || ""}
                      </span>
                      <span
                        className="flex-1 font-sans text-[13.5px] leading-[1.4]"
                        style={{
                          color: active ? "#E9B45A" : "#F6EEE1",
                          fontWeight: active ? 600 : 500,
                        }}
                      >
                        {c.label || ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {/* Mobile / tablet chapters under transport */}
        {article.videoChapters?.length ? (
          <div className="mt-8 xl:hidden">
            <div className="font-sans text-[9.5px] font-bold uppercase tracking-[0.2em] text-gold-deep">
              Chapters
            </div>
            <div className="mt-3 flex flex-col">
              {article.videoChapters.map((c, i) => {
                const active = i === activeChapter;
                return (
                  <button
                    key={`m-${(c.time || "") + i}`}
                    type="button"
                    onClick={() => audio.seek(c.start ?? 0)}
                    className="flex cursor-pointer items-baseline gap-3 border-0 border-b border-[rgba(246,238,225,0.12)] bg-transparent px-1.5 py-3 text-left"
                  >
                    <span
                      className="w-[34px] flex-none font-newsreader text-[13.5px]"
                      style={{ color: active ? "#E9B45A" : "#b09a7d" }}
                    >
                      {c.time || ""}
                    </span>
                    <span
                      className="flex-1 font-sans text-[13.5px] leading-[1.4]"
                      style={{
                        color: active ? "#E9B45A" : "#F6EEE1",
                        fontWeight: active ? 600 : 500,
                      }}
                    >
                      {c.label || ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ArticleHead({
  article,
  accent,
  showBreadcrumbs = true,
}: {
  article: JournalArticleData;
  accent: string;
  showBreadcrumbs?: boolean;
}) {
  return (
    <div className="mx-auto max-w-[1240px] px-[clamp(24px,6vw,100px)] pt-[clamp(30px,3.4vw,48px)]">
      {showBreadcrumbs ? (
        <Breadcrumbs
          topicHref={article.topicHref}
          topicLabel={article.topicLabel || article.articleSection}
        />
      ) : null}
      <div
        className={`${showBreadcrumbs ? "mt-[clamp(22px,2.4vw,32px)]" : ""} max-w-[860px]`}
      >
        <div className="flex items-center gap-[11px]">
          <FormatBadge format={article.format} />
          {article.readTime ? (
            <span className="font-sans text-[11.5px] tracking-[0.06em] text-[#8a7a68]">
              <EditableText path="readTime" value={article.readTime} as="span" />
            </span>
          ) : null}
        </div>
        <h1 className="mt-[18px] font-display text-[clamp(40px,4.4vw,62px)] font-medium leading-[1.04] tracking-[-0.025em] text-ink">
          <EditableText path="title" value={article.title} as="span" multiline />
        </h1>
        {article.dek ? (
          <p
            className="mt-[18px] max-w-[40ch] font-display text-[clamp(19px,1.8vw,25px)] font-medium italic leading-[1.32]"
            style={{ color: accent }}
          >
            <EditableText path="dek" value={article.dek} as="span" multiline />
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ReadSidebar({
  article,
  accent,
  showStickyCta,
  nextLabel = "Read next",
  lightAudio = false,
}: {
  article: JournalArticleData;
  accent: string;
  showStickyCta: boolean;
  nextLabel?: string;
  lightAudio?: boolean;
}) {
  const dur = article.audioRecapSeconds || 192;
  const watchMeta =
    article.readTime.split("·")[0]?.trim() || mmss(dur);
  return (
    <aside className="hidden md:block md:sticky md:top-[116px]">
      {article.showAudioRecap !== false ? (
        lightAudio ? (
          <LightAudioPlayer
            duration={dur}
            title={`The same ${watchMeta}, audio only`}
          />
        ) : (
          <DarkAudioRecap
            duration={dur}
            title={`Hear Dr. Nina's ${mmss(dur)} recap`}
            eyebrow={article.audioRecapEyebrow || "Short on time"}
            src={article.audioUrl}
            slug={article.slug}
            speakText={
              article.shortAnswer
                ? `${article.title}. ${article.shortAnswer}`
                : article.title
            }
          />
        )
      ) : null}
      {showStickyCta ? <SideCta article={article} /> : null}
      <NextSidebar
        items={article.next}
        label={nextLabel}
        accent={accent}
        showPlay={article.format === "Watch"}
      />
    </aside>
  );
}

export default function JournalArticle({
  article,
  showStickyCta = true,
}: Props) {
  const edit = useEdit();
  const live =
    edit?.enabled && isJournalContent(edit.content)
      ? (edit.content as JournalArticleData)
      : article;
  const accent = FORMAT_ACCENT[live.format] || FORMAT_ACCENT.Read;
  const [progress, setProgress] = useState(0);
  const [activeChapterHref, setActiveChapterHref] = useState("");
  const format = live.format;
  const isGuide = format === "Guide";
  const isWatch = format === "Watch";
  const isListen = format === "Listen";
  const chapters = isGuide ? deriveChapters(live) : [];

  const listenAudio = useArticleAudio({
    src: isListen ? live.audioUrl : null,
    slug: isListen ? live.slug : null,
    duration: live.audioSeconds || live.audioRecapSeconds || 500,
    rates: [...LISTEN_RATES],
    labels: [...LISTEN_SPEEDS],
  });

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);

      if (isGuide && chapters.length) {
        let current = chapters[0]?.href || "";
        for (const ch of chapters) {
          const id = ch.href.replace(/^#/, "");
          const node = document.getElementById(id);
          if (node && node.getBoundingClientRect().top <= 140) {
            current = ch.href;
          }
        }
        setActiveChapterHref(current);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isGuide, chapters]);

  const shortBorder =
    isGuide || isWatch || isListen ? accent : "#B08A3E";

  const heroImage = (hero: NonNullable<JournalArticleData["hero"]>, sizes: string) =>
    edit?.enabled ? (
      <EditableImage
        urlPath="hero.src"
        src={hero.src}
        alt={hero.alt}
        className="h-full w-full"
      />
    ) : (
      <ArticleImg
        src={hero.src}
        alt={hero.alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority
      />
    );

  return (
    <div className="bg-cream-deep font-sans text-ink">
      {/* Progress bar sticky under the site Header */}
      <div className="sticky top-[84px] z-[45] h-[3px] w-full bg-[rgba(46,33,27,0.09)] xl:top-[114px]">
        <div
          className="h-[3px] transition-[width] duration-75 ease-out"
          style={{
            width: `${Math.round(progress * 100)}%`,
            background: accent,
          }}
        />
      </div>

      {isWatch ? <VideoTheater article={live} accent={accent} /> : null}
      {isListen ? <ListenHero article={live} audio={listenAudio} /> : null}

      {!isWatch && !isListen ? (
        <ArticleHead article={live} accent={accent} />
      ) : isWatch ? (
        <ArticleHead article={live} accent={accent} showBreadcrumbs={false} />
      ) : null}

      {/* Main layouts */}
      {isGuide ? (
        <div className="mx-auto max-w-[1240px] px-[clamp(24px,6vw,100px)] pt-[clamp(30px,3.2vw,44px)]">
          <div className="grid items-start gap-[clamp(36px,4vw,68px)] md:grid-cols-[268px_minmax(0,1fr)]">
            <aside className="hidden md:sticky md:top-[116px] md:block">
              <div className="border-l-2 border-[rgba(46,33,27,0.12)] pl-5">
                <div
                  className="font-sans text-[9.5px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: accent }}
                >
                  In this guide
                </div>
                <div className="mt-1.5 font-newsreader text-sm text-[#9a8870]">
                  {Math.round(progress * 100)}% read
                </div>
                <div className="mt-[18px] flex flex-col">
                  {chapters.map((ch) => {
                    const active = activeChapterHref === ch.href;
                    return (
                      <a
                        key={ch.href}
                        href={ch.href}
                        className="-ml-8 flex items-baseline gap-3 border-l-2 py-[11px] pr-2.5 pb-3 pl-[30px] no-underline transition-[border-color,color] duration-200"
                        style={{
                          borderLeftColor: active ? accent : "transparent",
                        }}
                      >
                        <span
                          className="w-5 flex-none font-display text-[13px] font-medium"
                          style={{ color: active ? accent : "#b5a795" }}
                        >
                          {ch.n}
                        </span>
                        <span
                          className="flex-1 font-sans text-sm leading-[1.38]"
                          style={{
                            color: active ? "#2E211B" : "#7d6f60",
                            fontWeight: active ? 600 : 500,
                          }}
                        >
                          {ch.label}
                        </span>
                      </a>
                    );
                  })}
                </div>
                <div className="mt-[22px] flex items-center gap-2 border-t border-[rgba(46,33,27,0.12)] pt-[18px]">
                  <SharePills compact />
                </div>
              </div>
            </aside>

            <div>
              <div className="flex items-center gap-[13px] border-b border-[rgba(46,33,27,0.12)] pb-5">
                <Link href="/about" className="block flex-none">
                  <NinaAvatar size={52} />
                </Link>
                <div>
                  <Link
                    href="/about"
                    className="font-sans text-[15px] font-semibold text-ink no-underline hover:text-terracotta"
                  >
                    Nina Ross, ND; Ph.D
                  </Link>
                  <div className="mt-[3px] font-sans text-[11.5px] tracking-[0.04em] text-[#8a7a68]">
                    Naturopathic doctor ·{" "}
                    <EditableText path="dateLabel" value={live.dateLabel} as="span" /> ·
                    Medically reviewed by Dr. Nina
                  </div>
                </div>
              </div>

              {live.hero ? (
                <figure className="m-0 mt-[clamp(24px,2.6vw,34px)]">
                  <div className="relative h-[clamp(320px,32vw,440px)] overflow-hidden rounded-[18px] bg-[#E7DCC9]">
                    {heroImage(live.hero, "(max-width:768px) 100vw, 70vw")}
                  </div>
                  {live.hero.caption ? (
                    <figcaption className="mt-2.5 font-sans text-xs leading-[1.5] text-[#9a8b7a]">
                      <EditableText
                        path="hero.caption"
                        value={live.hero.caption}
                        as="span"
                      />
                    </figcaption>
                  ) : null}
                </figure>
              ) : null}

              <div className="mt-[clamp(26px,2.8vw,36px)] grid gap-4 md:grid-cols-2">
                <ShortAnswer
                  text={live.shortAnswer}
                  accent={FORMAT_ACCENT.Read}
                  borderAccent={accent}
                />
                {live.showAudioRecap !== false ? (
                  <DarkAudioRecap
                    duration={live.audioRecapSeconds || 232}
                    title={`Hear the ${mmss(live.audioRecapSeconds || 232)} version`}
                    eyebrow={live.audioRecapEyebrow || "Short on time"}
                    compact
                    src={live.audioUrl}
                    slug={live.slug}
                    speakText={
                      live.shortAnswer
                        ? `${live.title}. ${live.shortAnswer}`
                        : live.title
                    }
                  />
                ) : null}
              </div>

              <BodyBlocks article={live} accent={accent} isGuide />
              <Takeaways items={live.takeaways} />
              {showStickyCta ? <GuideCtaBand article={live} /> : null}
              <Related items={live.related} />
              <AuthorCard />
              <NextCards3Up items={live.next} />
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-[1240px] px-[clamp(24px,6vw,100px)] pt-[clamp(28px,3.2vw,44px)]">
          {isListen ? (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-6 border-b border-[rgba(46,33,27,0.12)] pb-5">
              <div className="flex items-center gap-[13px]">
                <FormatBadge format="Listen" />
                <div className="font-sans text-[11.5px] tracking-[0.04em] text-[#8a7a68]">
                  <EditableText path="dateLabel" value={live.dateLabel} as="span" /> ·
                  Medically reviewed by Dr. Nina
                </div>
              </div>
              <SharePills />
            </div>
          ) : null}

          <div className="grid items-start gap-[clamp(36px,4vw,76px)] md:grid-cols-[minmax(0,1fr)_330px]">
            <div>
              {!isListen ? <BylineRow article={live} /> : null}

              {!isWatch && !isListen && live.hero ? (
                <figure className="m-0 mt-[clamp(24px,2.6vw,34px)]">
                  <div className="relative h-[clamp(320px,32vw,460px)] overflow-hidden rounded-[18px] bg-[#E7DCC9]">
                    {heroImage(live.hero, "(max-width:768px) 100vw, 70vw")}
                  </div>
                  {live.hero.caption ? (
                    <figcaption className="mt-2.5 font-sans text-xs leading-[1.5] text-[#9a8b7a]">
                      <EditableText
                        path="hero.caption"
                        value={live.hero.caption}
                        as="span"
                      />
                    </figcaption>
                  ) : null}
                </figure>
              ) : null}

              <div
                className={
                  isWatch || isListen
                    ? "mt-[clamp(26px,2.8vw,36px)]"
                    : "mt-[clamp(26px,2.8vw,38px)]"
                }
              >
                <ShortAnswer
                  text={live.shortAnswer}
                  accent={isWatch ? accent : FORMAT_ACCENT.Read}
                  borderAccent={shortBorder}
                />
              </div>

              <BodyBlocks article={live} accent={accent} />

              {(isWatch || isListen) && live.transcript?.length ? (
                <TranscriptAccordion
                  transcript={live.transcript}
                  onSeek={isListen ? listenAudio.seek : undefined}
                />
              ) : null}

              <Takeaways items={live.takeaways} />
              <Related items={live.related} />
              <AuthorCard />
            </div>

            <ReadSidebar
              article={live}
              accent={accent}
              showStickyCta={showStickyCta}
              nextLabel={
                isWatch ? "Watch next" : isListen ? "Listen next" : "Read next"
              }
              lightAudio={isWatch}
            />
          </div>
        </div>
      )}

      <DarkFooterCta article={live} />
      {showStickyCta ? <MobileStickyCta article={live} /> : null}
    </div>
  );
}
