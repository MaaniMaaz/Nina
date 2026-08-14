import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SiteMediaShell from "@/components/media/SiteMediaShell";
import "./globals.css";

// Load fonts via Google Fonts stylesheet rather than `next/font` so Vercel
// Turbopack environment does not require the internal font runtime.
// The actual font-family values are exposed as CSS variables in `globals.css`.

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
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Fraunces:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Caveat:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;1,400;0,500;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-cream font-sans antialiased text-ink">
        <SiteMediaShell>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SiteMediaShell>
      </body>
    </html>
  );
}
