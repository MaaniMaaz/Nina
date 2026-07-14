// Maps a /treatments/:slug to its decoded slot-image id prefix, so condition
// and treatment pages can show the linked treatment's real hero photo on
// "Treatments we may use" cards instead of a placeholder.
export const TREATMENT_SLOT_PREFIX: Record<string, string> = {
  "advanced-lab-testing": "lab",
  "dutch-test": "dut",
  "eboo-therapy": "ebo",
  "gi-map-test": "gim",
  "glp-1-weight-loss": "glp",
  "hormone-restoration": "hrm",
  "hyperbaric-oxygen-therapy": "hbo",
  "iv-therapy": "ivt",
  "lymphatic-drainage": "lym",
  "ozone-therapy": "ozo",
  "peptide-therapy": "pep",
  "red-light-therapy": "red",
  "vitamin-injections": "vit",
  "holistic-nutrition": "hnu",
};

export function treatmentCardImage(slug: string): string | undefined {
  const prefix = TREATMENT_SLOT_PREFIX[slug];
  return prefix ? `${prefix}D-hero` : undefined;
}
