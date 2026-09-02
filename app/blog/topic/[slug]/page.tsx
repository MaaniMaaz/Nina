import type { Metadata } from "next";
import SmartImage from "@/components/ui/SmartImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogTopicSlug } from "@/content/blog";
import { resolveBlogCards } from "@/lib/cms/resolve";

// Cached between visits; publishing revalidates /blog/topic/[slug], so edits
// still appear immediately without querying Mongo on every request.
export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cards = await resolveBlogCards();
  const label = cards.find((a) => blogTopicSlug(a.cat) === slug)?.cat ?? null;
  if (!label) return { title: "Topic" };
  return {
    title: `${label} | The Journal`,
    description: `Articles, videos, and guides on ${label} from Dr. Nina Ross, ND PhD.`,
    alternates: { canonical: `/blog/topic/${slug}` },
  };
}

export default async function BlogTopicPage({ params }: Props) {
  const { slug } = await params;
  const cards = await resolveBlogCards();
  const label = cards.find((a) => blogTopicSlug(a.cat) === slug)?.cat ?? null;
  if (!label) notFound();
  const items = cards.filter((a) => blogTopicSlug(a.cat) === slug);

  return (
    <div className="min-h-screen bg-cream-deep font-sans">
      <section className="bg-ink px-[22px] py-10 md:px-[clamp(28px,4vw,56px)] md:py-14">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex items-center gap-2 text-[11px] tracking-[0.04em] md:text-xs">
            <Link href="/" className="text-[#b09a7d] no-underline hover:text-cream-deep">
              Home
            </Link>
            <span className="text-[#7d6a55]">/</span>
            <Link href="/blog" className="text-[#b09a7d] no-underline hover:text-cream-deep">
              The Journal
            </Link>
            <span className="text-[#7d6a55]">/</span>
            <span className="text-[#d9ccbe]">{label}</span>
          </div>
          <h1 className="mt-5 font-display text-[34px] font-medium leading-[1.08] tracking-[-0.02em] text-cream-deep md:text-[clamp(42px,4vw,58px)]">
            {label}
          </h1>
          <p className="mt-3 text-[15px] text-[#d9ccbe] md:text-base">
            {items.length} {items.length === 1 ? "piece" : "pieces"} in The Journal
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] grid-cols-1 gap-5 px-[22px] py-10 md:grid-cols-[repeat(auto-fill,minmax(272px,1fr))] md:gap-6 md:px-[clamp(28px,4vw,56px)] md:py-14">
        {items.map((it) => (
          <Link
            key={it.id}
            href={it.href}
            className="overflow-hidden rounded-2xl border border-[rgba(46,33,27,0.09)] bg-cream no-underline"
          >
            <div className="relative h-[160px] bg-[#E7DCC9] md:h-[186px]">
              <SmartImage src={it.img} alt={it.alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              <span
                className="absolute top-[13px] left-[13px] rounded-full px-[11px] py-[5px] text-[8.5px] font-bold tracking-[0.14em] text-cream uppercase"
                style={{ background: it.fmtColor }}
              >
                {it.fmt}
              </span>
            </div>
            <div className="px-5 py-[18px]">
              <h2 className="font-display text-[22px] leading-[1.16] font-medium text-ink">{it.title}</h2>
              <p className="mt-[11px] text-[14.5px] leading-[1.58] text-body">{it.dek}</p>
              <div className="mt-[15px] text-[11.5px] tracking-[0.05em] text-[#8a7a68]">
                {it.meta} · {it.cat}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
