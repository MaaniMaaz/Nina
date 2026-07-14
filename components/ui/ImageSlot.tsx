import Image from "next/image";
import { getSlotImage } from "@/lib/slot-images";

interface ImageSlotProps {
  id?: string;
  alt: string;
  placeholder?: string;
  className?: string;
  shape?: "rect" | "circle";
  priority?: boolean;
}

/**
 * Renders real photography when a decoded image exists for this slot id,
 * otherwise a styled placeholder box (no photography was ever supplied for
 * this slot in the source design, so we don't fabricate a stock photo).
 */
export default function ImageSlot({
  id,
  alt,
  placeholder = "Photo",
  className = "",
  shape = "rect",
  priority = false,
}: ImageSlotProps) {
  const src = getSlotImage(id);
  const radius = shape === "circle" ? "rounded-full" : "";

  if (!src) {
    return (
      <div
        className={`relative flex items-center justify-center bg-cream-deep border border-dashed border-ink/15 text-muted text-xs font-medium ${radius} ${className}`}
      >
        {placeholder}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${radius} ${className}`}>
      <Image src={src} alt={alt} fill priority={priority} className="object-cover" />
    </div>
  );
}
