import Link from "next/link";
import NotFoundSearch from "@/components/NotFoundSearch";

export const metadata = {
  title: "Page Not Found | Nina Ross Functional Medicine",
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F6EEE1] text-ink">
      <header className="bg-[#FBF6EC] border-b border-ink/10">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="block">
            <img src="/images/nina-ross-logo-dark.png" alt="Nina Ross" className="h-11" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/approach" className="text-[13px] text-ink">Our Approach</Link>
            <Link href="/conditions" className="text-[13px] text-ink">Conditions</Link>
            <Link href="/treatments" className="text-[13px] text-ink">Treatments</Link>
            <Link href="/blog" className="text-[13px] text-ink">The Journal</Link>
            <Link href="/about" className="text-[13px] text-ink">Dr. Nina</Link>
            <Link href="/book" className="bg-terracotta text-cream px-3 py-2 rounded font-semibold">Start · $99</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl">℞</span>
              <span className="w-6 h-px bg-[#B08A3E] inline-block" />
              <span className="uppercase text-[11px] tracking-wider text-[#CFA85A]">Error 404 · page not found</span>
            </div>

            <h1 className="mt-6 font-display text-[40px] md:text-[56px] text-[#2E211B]">This page went looking for answers too.</h1>
            <p className="mt-4 italic text-[18px] text-[#E9B45A]">It didn't find any. Let's get you somewhere useful.</p>
            <p className="mt-4 text-[15px] text-[#6b6054]">The page you were after has moved or no longer exists. Search below, or pick up from one of the places most people are heading.</p>

            <NotFoundSearch />

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/" className="bg-terracotta text-cream px-4 py-2 rounded font-semibold">Back to the homepage</Link>
              <Link href="/book" className="border border-[#E9B45A] text-[#E9B45A] px-4 py-2 rounded font-semibold">Book a $99 consult</Link>
            </div>
          </div>

          <aside className="flex flex-col items-start">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-[#43312a]">
              <img src="/images/dr-nina.png" alt="Dr. Nina Ross" className="w-full h-full object-cover" />
            </div>
            <p className="mt-5 text-[22px] font-cursive text-[#E9B45A]">A dead end is still information. Try one of these instead.</p>
            <div className="mt-6 grid grid-cols-1 gap-3 w-full">
              <Link href="/book" className="block bg-[#FBF6EC] border-l-4 border-[#B5572F] p-4 rounded">Start here · Book a $99 consult</Link>
              <Link href="/conditions" className="block bg-[#FBF6EC] border-l-4 border-[#B5572F] p-4 rounded">Conditions · See all conditions</Link>
              <Link href="/treatments" className="block bg-[#FBF6EC] border-l-4 border-[#4a6340] p-4 rounded">Treatments · See all treatments</Link>
              <Link href="/blog" className="block bg-[#FBF6EC] border-l-4 border-[#8a6a3a] p-4 rounded">The Journal · Browse the library</Link>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-[#2E211B] text-[#d8cab8] mt-12">
        <div className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between">
          <img src="/images/nina-ross-logo-cream.png" alt="Nina Ross" className="h-12" />
          <div className="text-sm">Atlanta, Georgia · In person and virtual worldwide</div>
        </div>
      </footer>
    </div>
  );
}
