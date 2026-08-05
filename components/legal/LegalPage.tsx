import Link from "next/link";
import type { LegalBullet, LegalDoc } from "@/content/legal/types";

function isLabeledBullet(b: LegalBullet): b is { label: string; text: string } {
  return typeof b === "object" && b !== null && "label" in b;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Shared legal document layout from Legal Pages handoff.
 * Uses shell Header/Footer; renders hero, sticky TOC, sections, contact card.
 */
export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const { hero, sections, contact } = doc;

  return (
    <div className="min-h-screen scroll-smooth bg-cream-deep font-sans [scroll-padding-top:220px] md:[scroll-padding-top:250px]">
      {/* Title / hero */}
      <section className="relative overflow-hidden bg-ink">
        <div className="grain-overlay opacity-40 mix-blend-overlay" style={{ backgroundSize: "180px" }} />
        <div className="relative mx-auto max-w-[1100px] px-[clamp(20px,5vw,60px)] pt-[clamp(34px,5vw,64px)] pb-[clamp(30px,4vw,52px)]">
          <div className="flex items-center gap-2.5">
            <span className="h-px w-6 bg-[#B08A3E]" />
            <span className="text-[10px] font-semibold tracking-[0.22em] text-gold-deep uppercase">Legal</span>
          </div>
          <h1
            className="mt-3.5 font-display font-medium leading-[1.04] tracking-[-0.025em] text-cream-deep"
            style={{ fontSize: hero.titleClamp }}
          >
            {hero.title}
          </h1>

          {hero.deckVariant === "hipaa" ? (
            <p className="mt-4 max-w-[68ch] text-[clamp(13px,1.3vw,15px)] font-semibold tracking-[0.03em] text-gold uppercase">
              {hero.deck}
            </p>
          ) : (
            <p className="mt-4 max-w-[62ch] text-[clamp(15px,1.35vw,17px)] leading-[1.62] text-[#d9ccbe]">
              {hero.deck}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-newsreader text-[clamp(13px,1.3vw,15px)] text-[#b09a7d]">
            {hero.lastUpdated ? <span>Last updated {hero.lastUpdated}</span> : null}
            {hero.lastUpdated && hero.effective ? <span aria-hidden>·</span> : null}
            {hero.effective ? <span>Effective {hero.effective}</span> : null}
            {hero.orgLine ? (
              <>
                <span aria-hidden>·</span>
                <span>{hero.orgLine}</span>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* Sticky TOC */}
      <nav
        aria-label="On this page"
        className="sticky top-[84px] z-40 border-b border-[rgba(46,33,27,0.1)] bg-[rgba(246,238,225,0.95)] backdrop-blur-[10px] xl:top-[114px]"
      >
        <div className="mx-auto flex max-w-[1100px] flex-wrap gap-2 px-[clamp(20px,5vw,60px)] py-3.5">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border border-[rgba(46,33,27,0.14)] bg-cream px-3 py-1.5 pb-[7px] text-[11.5px] font-semibold text-[#5a4d43] no-underline transition-colors hover:border-ink hover:text-ink"
            >
              {s.short}
            </a>
          ))}
        </div>
      </nav>

      {/* Sections */}
      <div className="mx-auto max-w-[1100px] px-[clamp(20px,5vw,60px)] pt-[clamp(36px,4vw,56px)] pb-4">
        {sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className="scroll-mt-[220px] border-b border-[rgba(46,33,27,0.08)] py-[clamp(28px,3.2vw,42px)] md:scroll-mt-[250px] last:border-b-0"
          >
            <div className="flex gap-[clamp(12px,2vw,22px)]">
              <span className="shrink-0 font-display text-[clamp(15px,1.5vw,18px)] font-medium text-[#B08A3E]">
                {pad(i + 1)}
              </span>
              <div className="min-w-0 flex-1 pl-[clamp(0px,3vw,31px)]">
                <h2 className="font-display text-[clamp(23px,2.6vw,33px)] font-medium leading-[1.12] tracking-[-0.02em] text-ink">
                  {s.title}
                </h2>
                <div className="mt-4 max-w-[74ch] space-y-4 text-[clamp(15.5px,1.4vw,17.5px)] leading-[1.72] text-[#3d332b]">
                  {s.paras.map((p) => (
                    <p key={p.slice(0, 48)}>{p}</p>
                  ))}
                </div>
                {s.bullets.length > 0 ? (
                  <ul className="mt-4 max-w-[74ch] space-y-[11px] md:space-y-[13px]">
                    {s.bullets.map((b, bi) => (
                      <li key={bi} className="flex gap-3 text-[clamp(15.5px,1.4vw,17.5px)] leading-[1.72]">
                        <span className="mt-[0.35em] shrink-0 text-[10px] text-[#B08A3E]" aria-hidden>
                          ●
                        </span>
                        <span className="text-[#3d332b]">
                          {isLabeledBullet(b) ? (
                            <>
                              <strong className="font-semibold text-ink">{b.label}</strong> {b.text}
                            </>
                          ) : (
                            b
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Contact card */}
      <div className="mx-auto max-w-[1100px] px-[clamp(20px,5vw,60px)] pb-[clamp(50px,6vw,84px)]">
        <div className="rounded-2xl bg-[#E7DCC9] p-[clamp(24px,3vw,38px)]">
          <h2 className="font-display text-[clamp(22px,2.2vw,28px)] font-medium leading-tight text-ink">
            {contact.heading}
          </h2>
          <div className="mt-3 space-y-0.5 text-[15px] leading-relaxed text-[#5a4d43]">
            {contact.lines.map((line) => (
              <div key={line}>{line}</div>
            ))}
            <a href={`mailto:${contact.email}`} className="inline-block text-terracotta no-underline hover:text-[#8f4324]">
              {contact.email}
            </a>
          </div>
          {contact.note ? (
            <p className="mt-4 max-w-[62ch] text-[14.5px] leading-[1.62] text-[#5a4d43]">{contact.note}</p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-2.5">
            {contact.links.map((l) =>
              l.variant === "primary" ? (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className="rounded-full bg-terracotta px-[17px] py-2.5 text-[13.5px] font-semibold text-cream no-underline transition-colors hover:bg-terracotta-hover"
                >
                  {l.label}
                </Link>
              ) : (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className="rounded-full border border-[rgba(46,33,27,0.16)] bg-cream px-[17px] py-2.5 text-[13.5px] font-semibold text-ink no-underline transition-colors hover:border-ink"
                >
                  {l.label}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
