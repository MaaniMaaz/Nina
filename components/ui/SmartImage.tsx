"use client";

import Image, { type ImageProps } from "next/image";
import { useHomeImageWarm } from "@/components/home/HomeImageWarmContext";

type SmartImageProps = Omit<ImageProps, "loading"> & {
  /** Defaults to lazy unless `priority` is set (LCP / above-the-fold only). */
  loading?: "lazy" | "eager";
};

/** Sensible default for `fill` images when callers omit `sizes`. */
const DEFAULT_FILL_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

/**
 * Site-wide image primitive: lazy-loads by default, async decode, and
 * requires an explicit `priority` for above-the-fold / LCP images.
 * Home warm-up can force eager so chip unlock feels instant.
 */
export default function SmartImage({
  priority = false,
  fill,
  sizes,
  decoding = "async",
  loading,
  alt,
  ...rest
}: SmartImageProps) {
  const warm = useHomeImageWarm();
  const resolvedLoading =
    priority || warm ? "eager" : (loading ?? "lazy");
  const resolvedSizes = fill ? (sizes ?? DEFAULT_FILL_SIZES) : sizes;

  return (
    <Image
      {...rest}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={resolvedSizes}
      decoding={decoding}
      loading={resolvedLoading}
    />
  );
}
