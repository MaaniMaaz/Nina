import SmartImage from "@/components/ui/SmartImage";
import { shouldUnoptimizeImage } from "@/lib/images";
import { getSlotImage } from "@/lib/slot-images";

interface ImageSlotProps {
  id?: string;
  /** Absolute / Cloudinary URL wins over slot id when set */
  src?: string;
  alt: string;
  placeholder?: string;
  className?: string;
  shape?: "rect" | "circle";
  /** Only for LCP / above-the-fold heroes — everything else lazy-loads. */
  priority?: boolean;
  sizes?: string;
}

/**
 * Renders real photography when a decoded image exists for this slot id,
 * otherwise a styled placeholder box (no photography was ever supplied for
 * this slot in the source design, so we don't fabricate a stock photo).
 */
export default function ImageSlot({
  id,
  src: srcProp,
  alt,
  placeholder = "Photo",
  className = "",
  shape = "rect",
  priority = false,
  sizes,
}: ImageSlotProps) {
  const src = srcProp || getSlotImage(id);
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
      <SmartImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
        unoptimized={shouldUnoptimizeImage(src)}
      />
    </div>
  );
}
