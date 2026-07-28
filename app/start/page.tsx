import type { Metadata } from "next";
import StartBookingPage from "@/components/booking/StartBookingPage";

export const metadata: Metadata = {
  title: "Book the $99 Symptom Consultation",
  description:
    "For $99, sit down with Dr. Nina Ross and finally get heard. Same half hour, same price, in our Atlanta studio or on secure video. Book in-person or virtual.",
  alternates: { canonical: "/start" },
};

export default function StartPage() {
  return <StartBookingPage />;
}
