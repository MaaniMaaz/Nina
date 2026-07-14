import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import HomeInteractive from "@/components/home/HomeInteractive";

export const metadata: Metadata = {
  title: "Nina Ross Functional Medicine, Atlanta",
  description:
    "Physician-led functional medicine in Atlanta and virtual care nationwide. Root-cause care with Dr. Nina Ross, ND PhD. Start with the $99 Symptom Consultation.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeInteractive />
    </>
  );
}
