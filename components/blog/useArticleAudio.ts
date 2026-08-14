"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

/** Prefer local `/audio/…`, then production CDN mirrors. */
export function resolveAudioCandidates(
  src?: string | null,
  slug?: string | null,
): string[] {
  const out: string[] = [];
  const push = (raw?: string | null) => {
    if (!raw?.trim()) return;
    const v = raw.trim();
    if (v.startsWith("http")) {
      out.push(v);
      return;
    }
    const path = v.startsWith("/") ? v : `/${v}`;
    out.push(path, `https://ninarossfm.com${path}`, `https://www.ninarossfm.com${path}`);
  };

  push(src);
  if (slug?.trim()) {
    const s = slug.trim();
    push(`/audio/${s}.mp3`);
    push(`/audio/${s}-recap.mp3`);
  }

  return [...new Set(out)];
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
 * Plays a real MP3 when available. Otherwise advances a timed UI and, when
 * `speakText` is provided (Read/Guide recaps), speaks that text via the browser.
 */
export function useArticleAudio(opts: {
  src?: string | null;
  slug?: string | null;
  speakText?: string | null;
  duration: number;
  rates?: number[];
  labels?: string[];
}): ArticleAudioControls {
  const rates = opts.rates ?? [1, 1.5, 2];
  const labels = opts.labels ?? ["1x", "1.5x", "2x"];
  const duration = Math.max(1, opts.duration || 1);
  const candidatesKey = resolveAudioCandidates(opts.src, opts.slug).join("|");
  const candidates = candidatesKey ? candidatesKey.split("|") : [];
  const speakText = opts.speakText?.trim() || "";

  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [speedIx, setSpeedIx] = useState(0);
  const [usingMedia, setUsingMedia] = useState(false);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);
  const speedIxRef = useRef(0);
  const usingMediaRef = useRef(false);
  const durationRef = useRef(duration);
  const ratesRef = useRef(rates);
  const speakTextRef = useRef(speakText);

  playingRef.current = playing;
  speedIxRef.current = speedIx;
  usingMediaRef.current = usingMedia;
  durationRef.current = duration;
  ratesRef.current = rates;
  speakTextRef.current = speakText;

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const startSpeech = useCallback(() => {
    stopSpeech();
    const text = speakTextRef.current;
    if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return false;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.rate = ratesRef.current[speedIxRef.current] ?? 1;
    u.onend = () => {
      playingRef.current = false;
      setPlaying(false);
      clearTimer();
      setT(durationRef.current);
    };
    u.onerror = () => {
      /* timer keeps running as visual fallback */
    };
    window.speechSynthesis.speak(u);
    return true;
  }, [clearTimer, stopSpeech]);

  const runTimer = useCallback(() => {
    clearTimer();
    const rate = ratesRef.current[speedIxRef.current] ?? 1;
    timer.current = setInterval(() => {
      setT((prev) => {
        const n = prev + rate;
        if (n >= durationRef.current) {
          clearTimer();
          playingRef.current = false;
          setPlaying(false);
          stopSpeech();
          return durationRef.current;
        }
        return n;
      });
    }, 1000);
  }, [clearTimer, stopSpeech]);

  // Mount / swap media element when source candidates change.
  useEffect(() => {
    clearTimer();
    stopSpeech();
    setPlaying(false);
    playingRef.current = false;
    setT(0);
    setUsingMedia(false);
    usingMediaRef.current = false;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
      audioRef.current = null;
    }

    if (!candidates.length) return;

    let cancelled = false;
    let ix = 0;
    const el = new Audio();
    el.preload = "metadata";
    audioRef.current = el;

    const onTime = () => setT(el.currentTime || 0);
    const onEnded = () => {
      playingRef.current = false;
      setPlaying(false);
      setT(el.duration || durationRef.current);
    };
    const onPlay = () => {
      playingRef.current = true;
      setPlaying(true);
    };
    const onPause = () => {
      playingRef.current = false;
      setPlaying(false);
    };
    const onMeta = () => {
      if (cancelled) return;
      setUsingMedia(true);
      usingMediaRef.current = true;
    };
    const tryNext = () => {
      ix += 1;
      if (cancelled) return;
      if (ix < candidates.length) {
        el.src = candidates[ix];
        el.load();
        return;
      }
      setUsingMedia(false);
      usingMediaRef.current = false;
    };
    const onError = () => tryNext();

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("error", onError);
    el.src = candidates[0];
    el.load();

    return () => {
      cancelled = true;
      clearTimer();
      stopSpeech();
      el.pause();
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("error", onError);
      el.removeAttribute("src");
      el.load();
      if (audioRef.current === el) audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidatesKey, clearTimer, stopSpeech]);

  const seek = useCallback(
    (seconds: number) => {
      const clamped = Math.max(0, Math.min(durationRef.current, seconds));
      setT(clamped);
      const el = audioRef.current;
      if (el && usingMediaRef.current) {
        try {
          el.currentTime = clamped;
        } catch {
          /* ignore */
        }
      }
    },
    [],
  );

  const togglePlay = useCallback(() => {
    const el = audioRef.current;

    // Real MP3 path
    if (el && usingMediaRef.current) {
      el.playbackRate = ratesRef.current[speedIxRef.current] ?? 1;
      if (el.paused) {
        if (el.currentTime >= (el.duration || durationRef.current) - 0.25) {
          el.currentTime = 0;
          setT(0);
        }
        void el.play().catch(() => {
          setUsingMedia(false);
          usingMediaRef.current = false;
          playingRef.current = true;
          setPlaying(true);
          runTimer();
          startSpeech();
        });
      } else {
        el.pause();
      }
      return;
    }

    // Timed UI + optional spoken recap (Read/Guide without an MP3)
    const next = !playingRef.current;
    clearTimer();
    stopSpeech();
    if (next) {
      setT((prev) => (prev >= durationRef.current ? 0 : prev));
      playingRef.current = true;
      setPlaying(true);
      runTimer();
      startSpeech();
    } else {
      playingRef.current = false;
      setPlaying(false);
    }
  }, [clearTimer, runTimer, startSpeech, stopSpeech]);

  const cycleSpeed = useCallback(() => {
    const ix = (speedIxRef.current + 1) % labels.length;
    setSpeedIx(ix);
    speedIxRef.current = ix;
    const el = audioRef.current;
    if (el && usingMediaRef.current) {
      el.playbackRate = ratesRef.current[ix] ?? 1;
      return;
    }
    if (playingRef.current) {
      // Restart speech at new rate; keep timer in sync
      stopSpeech();
      startSpeech();
      clearTimer();
      runTimer();
    }
  }, [clearTimer, labels.length, runTimer, startSpeech, stopSpeech]);

  const skip = useCallback((delta: number) => seek(t + delta), [seek, t]);

  useEffect(() => () => {
    clearTimer();
    stopSpeech();
  }, [clearTimer, stopSpeech]);

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
