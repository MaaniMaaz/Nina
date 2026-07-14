import slotImages from "@/content/slot-images.generated.json";

const manifest: Record<string, string> = slotImages;

/**
 * Real photography decoded from the design tool's .image-slots.state.json
 * sidecar. Ids are suffixed D (desktop) or F ("full" mobile) per source;
 * since this app renders one responsive page, we prefer the D variant and
 * fall back to F if only one side was ever filled in.
 */
export function getSlotImage(id: string | undefined): string | undefined {
  if (!id) return undefined;
  if (manifest[id]) return manifest[id];
  const swapped = id.endsWith("D") ? id.slice(0, -1) + "F" : id.endsWith("F") ? id.slice(0, -1) + "D" : null;
  if (swapped && manifest[swapped]) return manifest[swapped];
  return undefined;
}
