import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";

const NAV_ITEMS = [
  { label: "Our Approach", href: "/approach" },
  { label: "Conditions", href: "/conditions" },
  { label: "Treatments", href: "/treatments" },
  { label: "The Journal", href: "/blog" },
  { label: "Dr. Nina", href: "/about" },
];

const ROUTES = [
  {
    title: "Start here",
    body: "A half hour with our team. Bring the whole story and whatever labs you already have.",
    cta: "Book a $99 consult",
    href: "/start",
    edge: "#B5572F",
  },
  {
    title: "Conditions",
    body: "Hormones, thyroid, gut, weight, hair loss, and the ones nobody has named yet.",
    cta: "See all conditions",
    href: "/conditions",
    edge: "#B5572F",
  },
  {
    title: "Treatments",
    body: "Testing, IV therapy, peptides, hormone restoration, and the rest of the toolkit.",
    cta: "See all treatments",
    href: "/treatments",
    edge: "#4a6340",
  },
  {
    title: "The Journal",
    body: "Articles, videos, and audio from Dr. Nina on how your body actually works.",
    cta: "Browse the library",
    href: "/blog",
    edge: "#8a6a3a",
  },
];

const CONDITIONS = [
  { label: "Hormonal problems", href: "/conditions/hormone-imbalance" },
  { label: "PCOS", href: "/conditions/pcos" },
  { label: "Perimenopause", href: "/conditions/menopause" },
  { label: "Insulin resistance", href: "/conditions/insulin-resistance" },
  { label: "Chronic fatigue", href: "/conditions/chronic-fatigue" },
  { label: "Gut health", href: "/conditions/gut-health" },
  { label: "Weight that will not move", href: "/conditions/weight-loss" },
  { label: "Hair loss", href: "/conditions/hair-loss" },
];

const TREATMENTS = [
  { label: "Advanced lab testing", href: "/treatments/advanced-lab-testing" },
  { label: "DUTCH test", href: "/treatments/dutch-test" },
  { label: "GI-MAP test", href: "/treatments/gi-map-test" },
  { label: "IV therapy", href: "/treatments/iv-therapy" },
  { label: "Hormone restoration", href: "/treatments/hormone-restoration" },
  { label: "Peptide therapy", href: "/treatments/peptide-therapy" },
  { label: "GLP-1 weight loss", href: "/treatments/glp-1-weight-loss" },
  { label: "Red light therapy", href: "/treatments/red-light-therapy" },
];

const FOOTER_LINKS = [
  { label: "The Journal", href: "/blog" },
  { label: "Conditions", href: "/conditions" },
  { label: "Treatments", href: "/treatments" },
  { label: "Patient Stories", href: "/#patient-stories" },
  { label: "About Dr. Nina", href: "/about" },
  { label: "Book a Consult", href: "/start" },
];

export const metadata = {
  title: "Page Not Found | Nina Ross Functional Medicine",
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F6EEE1] text-ink">
      <header className="border-b border-ink/10 bg-[#FBF6EC]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="block">
            <SmartImage
              src="/images/nina-ross-logo-dark.png"
              alt="Nina Ross Functional Medicine"
              width={176}
              height={44}
              className="h-11 w-auto"
              priority
            />
          </Link>

          <nav className="flex w-full flex-col gap-2 pt-4 md:w-auto md:flex-row md:items-center md:gap-6 md:pt-0">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="text-[13px] text-ink md:px-0">
                {item.label}
              </Link>
            ))}
            <Link
              href="/start"
              className="inline-flex rounded bg-terracotta px-3 py-2 text-[13px] font-semibold text-cream"
            >
              Start · $99
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_0.9fr] md:items-start">
          <section>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-serif text-2xl">℞</span>
              <span className="h-px w-6 bg-[#B08A3E]" />
              <span className="text-[11px] uppercase tracking-[0.28em] text-[#CFA85A]">
                Error 404 · page not found
              </span>
            </div>
            <h1 className="mt-6 font-display text-[34px] leading-tight text-[#2E211B] sm:text-[40px] md:text-[56px]">
              This page went looking for answers too.
            </h1>
            <p className="mt-4 text-[18px] italic text-[#E9B45A]">
              It didn&apos;t find any. Let&apos;s get you somewhere useful.
            </p>
            <p className="mt-4 max-w-2xl text-[15px] text-[#6b6054]">
              The page you were after has moved or no longer exists. Search below, or pick up from one of
              the places most people are heading.
            </p>

            <form action="/search" method="get" className="mt-8 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="notfound-search" className="sr-only">
                Search conditions, treatments, or the Journal
              </label>
              <input
                id="notfound-search"
                name="q"
                placeholder="Search conditions, treatments, or the Journal"
                className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
              />
              <button
                type="submit"
                className="rounded-lg bg-terracotta px-4 py-3 text-sm font-semibold text-cream shadow-sm transition hover:bg-terracotta-hover"
              >
                Search
              </button>
            </form>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-lg bg-terracotta px-4 py-3 text-sm font-semibold text-cream shadow-sm transition hover:bg-terracotta-hover"
              >
                Back to the homepage
              </Link>
              <Link
                href="/start"
                className="rounded-lg border border-[#E9B45A] px-4 py-3 text-sm font-semibold text-[#E9B45A] transition hover:bg-[#FBF6EC]"
              >
                Book a $99 consult
              </Link>
            </div>
          </section>

          <aside className="rounded-[28px] border border-ink/10 bg-[#FBF6EC] p-6 shadow-sm sm:p-8">
            <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full bg-[#43312a] sm:h-32 sm:w-32">
              <SmartImage
                src="/images/dr-nina.png"
                alt="Dr. Nina Ross, ND; Ph.D"
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
            <p className="mt-6 text-[22px] font-hand leading-snug text-[#E9B45A]">
              A dead end is still information. Try one of these instead.
            </p>
            <div className="mt-6 grid gap-3">
              {ROUTES.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="block rounded-2xl border-l-4 border-[#B5572F] bg-[#FBF6EC] px-5 py-4 text-sm font-semibold text-[#2E211B] transition hover:bg-white"
                  style={{ borderLeftColor: route.edge }}
                >
                  {route.title} · {route.cta}
                </Link>
              ))}
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="h-px flex-1 bg-ink/10" />
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#B5572F]">Where most people go</span>
            <span className="h-px flex-1 bg-ink/10" />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {ROUTES.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="group rounded-[18px] border border-ink/10 border-l-4 bg-[#FBF6EC] p-6 transition hover:border-ink/20 hover:bg-white"
                style={{ borderLeftColor: route.edge }}
              >
                <span className="block text-[18px] text-[#2E211B]">℞</span>
                <h2 className="mt-4 text-xl font-semibold text-[#2E211B]">{route.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#5a4d43]">{route.body}</p>
                <span className="mt-5 inline-flex text-sm font-semibold text-[#B5572F]">{route.cta} →</span>
              </Link>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9a8b7a]">
                Looked-for conditions
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {CONDITIONS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-ink/10 bg-[#FBF6EC] px-4 py-2 text-sm text-[#2E211B] transition hover:border-ink/20"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9a8b7a]">
                Looked-for treatments
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {TREATMENTS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-ink/10 bg-[#FBF6EC] px-4 py-2 text-sm text-[#2E211B] transition hover:border-ink/20"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#2E211B] text-[#d8cab8]">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <SmartImage
              src="/images/nina-ross-logo-cream.png"
              alt="Nina Ross Functional Medicine, Atlanta"
              width={180}
              height={56}
              className="h-auto w-auto"
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            {FOOTER_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-[#d8cab8] transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 text-sm text-[#d8cab8]">
            <span className="text-lg">℞</span>
            <span>Atlanta, Georgia · In person and virtual worldwide</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
