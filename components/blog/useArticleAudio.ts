"use client";

import { useEffect, useRef, useState } from "react";

export const DEFAULT_WAVE = [
  14, 22, 31, 26, 38, 44, 33, 47, 39, 28, 35, 46, 52, 41, 30, 24, 33, 42, 49, 44,
  36, 27, 21, 30, 40, 47, 51, 43, 34, 25, 32, 41, 48, 38, 29, 23, 31, 39, 45, 50,
  42, 33, 26, 20, 28, 36,
];

function mmss(s: number): string {
  const m = Math.floor(Math.max(0, s) / 60);
  const r = Math.floor(Math.max(0, s) % 60);
  return `${m}:${r < 10 ? "0" : ""}${r}`;
}

/** Prefer local `/audio/…`, fall back to production CDN on the same path. */
export function resolveAudioCandidates(src?: string | null): string[] {
  if (!src?.trim()) return [];
  const raw = src.trim();
  if (raw.startsWith("http")) return [raw];
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return [path, `https://ninarossfm.com${path}`, `https://www.ninarossfm.com${path}`];
}

export type ArticleAudioControls = {
  playing: boolean;
  t: number;
  duration: number;
  speedLabel: string;
  togglePlay: () => void;
  cycleSpeed: () => void;
  seek: (seconds: number) => void;
  skip: (delta: number) => void;
  pct: number;
  elapsed: string;
  remaining: string;
  total: string;
  hasSource: boolean;
  usingMedia: boolean;
};

/**
 * Real HTMLAudioElement when a source loads; otherwise the same deterministic
 * setInterval player the Articles HTML handoff used.
 */
export function useArticleAudio(opts: {
  src?: string | null;
  duration: number;
  rates?: number[];
  labels?: string[];
}): ArticleAudioControls {
  const rates = opts.rates ?? [1, 1.5, 2];
  const labels = opts.labels ?? ["1x", "1.5x", "2x"];
  const duration = Math.max(1, opts.duration || 1);
  const candidates = resolveAudioCandidates(opts.src);

  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [speedIx, setSpeedIx] = useState(0);
  const [usingMedia, setUsingMedia] = useState(false);
  const [candidateIx, setCandidateIx] = useState(0);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speedIxRef = useRef(0);
  const usingMediaRef = useRef(false);
  const durationRef = useRef(duration);

  speedIxRef.current = speedIx;
  usingMediaRef.current = usingMedia;
  durationRef.current = duration;

  const clearTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  // Mount / swap media element when source candidates change.
  useEffect(() => {
    clearTimer();
    setPlaying(false);
    setT(0);
    setUsingMedia(false);
    usingMediaRef.current = false;
    setCandidateIx(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    if (!candidates.length) return;

    const el = new Audio();
    el.preload = "metadata";
    audioRef.current = el;

    const onTime = () => setT(el.currentTime || 0);
    const onEnded = () => {
      setPlaying(false);
      setT(el.duration || durationRef.current);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onMeta = () => {
      setUsingMedia(true);
      usingMediaRef.current = true;
      if (Number.isFinite(el.duration) && el.duration > 0) {
        // Prefer declared article duration for UI consistency with HTML.
      }
    };
    const onError = () => {
      setCandidateIx((i) => {
        const next = i + 1;
        if (next < candidates.length && audioRef.current) {
          audioRef.current.src = candidates[next];
          audioRef.current.load();
          return next;
        }
        setUsingMedia(false);
        usingMediaRef.current = false;
        return i;
      });
    };

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("error", onError);
    el.src = candidates[0];
    el.load();

    return () => {
      clearTimer();
      el.pause();
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("error", onError);
      el.src = "";
      if (audioRef.current === el) audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates.join("|")]);

  const runTimer = () => {
    clearTimer();
    const rate = rates[speedIxRef.current] ?? 1;
    timer.current = setInterval(() => {
      setT((prev) => {
        const n = prev + rate;
        if (n >= durationRef.current) {
          clearTimer();
          setPlaying(false);
          return durationRef.current;
        }
        return n;
      });
    }, 1000);
  };

  const seek = (seconds: number) => {
    const clamped = Math.max(0, Math.min(durationRef.current, seconds));
    setT(clamped);
    const el = audioRef.current;
    if (el && usingMediaRef.current) {
      try {
        el.currentTime = clamped;
      } catch {
        /* ignore seek errors before ready */
      }
    }
  };

  const togglePlay = () => {
    const el = audioRef.current;
    if (el && usingMediaRef.current) {
      el.playbackRate = rates[speedIxRef.current] ?? 1;
      if (el.paused) {
        if (el.currentTime >= (el.duration || durationRef.current) - 0.25) {
          el.currentTime = 0;
        }
        void el.play().catch(() => {
          // Media blocked / missing → fall back to timer.
          setUsingMedia(false);
          usingMediaRef.current = false;
          setPlaying(true);
          runTimer();
        });
      } else {
        el.pause();
      }
      return;
    }

    const next = !playing;
    clearTimer();
    if (next) {
      setT((prev) => (prev >= durationRef.current ? 0 : prev));
      setPlaying(true);
      runTimer();
    } else {
      setPlaying(false);
    }
  };

  const cycleSpeed = () => {
    const ix = (speedIx + 1) % labels.length;
    setSpeedIx(ix);
    speedIxRef.current = ix;
    const el = audioRef.current;
    if (el && usingMediaRef.current) {
      el.playbackRate = rates[ix] ?? 1;
      return;
    }
    if (playing) {
      clearTimer();
      runTimer();
    }
  };

  const skip = (delta: number) => seek(t + delta);

  return {
    playing,
    t,
    duration,
    speedLabel: labels[speedIx] ?? "1x",
    togglePlay,
    cycleSpeed,
    seek,
    skip,
    pct: duration > 0 ? Math.min(100, (t / duration) * 100) : 0,
    elapsed: mmss(t),
    remaining: `-${mmss(Math.max(0, duration - t))}`,
    total: mmss(duration),
    hasSource: candidates.length > 0,
    usingMedia,
  };
}
