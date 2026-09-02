/** Shared Acuity booking URLs — single source for CTAs and embeds. */
export const ACUITY = {
  owner: "12622771",
  inperson:
    "https://app.acuityscheduling.com/schedule.php?owner=12622771&appointmentType=36940894",
  virtual:
    "https://app.acuityscheduling.com/schedule.php?owner=12622771&appointmentType=42808083",
} as const;

export type BookingDoor = "inperson" | "virtual";

export function acuitySrc(door: BookingDoor): string {
  return ACUITY[door];
}
