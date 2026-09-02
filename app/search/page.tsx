import type { Metadata } from "next";
import Link from "next/link";
import { searchSite } from "@/lib/site-search";

export const metadata: Metadata = {
  title: "Search",
  description: "Search conditions, treatments, and The Journal at Nina Ross Functional Medicine.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ q?: string }> };

const KIND_LABEL: Record<string, string> = {
  condition: "Condition",
  treatment: "Treatment",
  journal: "Journal",
  page: "Page",
};

export default async function SearchPage({ searchParams }: Props) {
  const { q: raw = "" } = await searchParams;
  const q = raw.trim();
  const hits = searchSite(q);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:px-10 md:py-20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-terracotta">Search</p>
      <h1 className="mt-3 font-display text-[32px] font-medium leading-tight text-ink md:text-[44px]">
        {q ? (
          <>
            Results for <span className="italic text-terracotta">&ldquo;{q}&rdquo;</span>
          </>
        ) : (
          <>Find a page, condition, or article</>
        )}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-body">
        Search conditions, treatments, positioning pages, and The Journal — or jump straight to booking.
      </p>

      <form action="/search" method="get" className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="site-search" className="sr-only">
          Search the site
        </label>
        <input
          id="site-search"
          name="q"
          defaultValue={q}
          placeholder="e.g. PCOS, DUTCH test, fatigue…"
          className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
        />
        <button
          type="submit"
          className="rounded-lg bg-terracotta px-4 py-3 text-sm font-semibold text-cream shadow-sm transition hover:bg-terracotta-hover"
        >
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/start"
          className="rounded-full border border-ink/15 bg-cream-deep px-3 py-1.5 text-[12px] font-semibold text-ink no-underline"
        >
          Book · $99 consult
        </Link>
        <Link
          href="/conditions"
          className="rounded-full border border-ink/15 bg-cream-deep px-3 py-1.5 text-[12px] font-semibold text-ink no-underline"
        >
          All conditions
        </Link>
        <Link
          href="/treatments"
          className="rounded-full border border-ink/15 bg-cream-deep px-3 py-1.5 text-[12px] font-semibold text-ink no-underline"
        >
          All treatments
        </Link>
        <Link
          href="/blog"
          className="rounded-full border border-ink/15 bg-cream-deep px-3 py-1.5 text-[12px] font-semibold text-ink no-underline"
        >
          The Journal
        </Link>
      </div>

      <ul className="mt-10 divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-cream">
        {hits.length === 0 ? (
          <li className="px-5 py-8 text-[14px] text-muted">
            No matches. Try another term, or{" "}
            <Link href="/start" className="font-semibold text-terracotta">
              book a consult
            </Link>
            .
          </li>
        ) : (
          hits.map((hit) => (
            <li key={`${hit.kind}-${hit.href}`}>
              <Link
                href={hit.href}
                className="block px-5 py-4 no-underline transition hover:bg-cream-deep"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  {KIND_LABEL[hit.kind] ?? hit.kind}
                </span>
                <span className="mt-1 block font-display text-[18px] font-medium text-ink">
                  {hit.title}
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-body line-clamp-2">
                  {hit.teaser}
                </span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
