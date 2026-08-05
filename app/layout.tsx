import type { Metadata } from "next";
import { Caveat, Fraunces, Hanken_Grotesk, Newsreader } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader-face",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ninarossfm.com"),
  title: {
    default: "Nina Ross Functional Medicine, Atlanta",
    template: "%s | Nina Ross Functional Medicine",
  },
  description:
    "Root-cause functional medicine care with Dr. Nina Ross, ND PhD, in Atlanta and virtually across Georgia. Book the $99 Symptom Consultation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} ${caveat.variable} ${newsreader.variable}`}
    >
      <body className="flex min-h-full flex-col bg-cream font-sans antialiased text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
