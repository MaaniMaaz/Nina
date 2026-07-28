const ICONS = {
  slash: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B5572F" strokeWidth="1.6">
      <path d="M4 4l16 16M9 4h11v11" />
    </svg>
  ),
  clock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B5572F" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  x: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B5572F" strokeWidth="1.6">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  pencil: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B5572F" strokeWidth="1.6">
      <path d="M16 4l4 4-9 9H7v-4z" />
    </svg>
  ),
  chart: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B5572F" strokeWidth="1.6">
      <path d="M12 3v18M5 8l7-5 7 5" />
    </svg>
  ),
  heart: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B5572F" strokeWidth="1.6">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  ),
} as const;

export default function IconCardGrid({
  number,
  eyebrow,
  heading,
  cards,
  footnote,
}: {
  number?: string;
  eyebrow: string;
  heading: string;
  cards: { icon: keyof typeof ICONS; title: string }[];
  footnote?: string;
}) {
  return (
    <section className="bg-[#ECE3D2] px-6 py-14 md:px-[clamp(40px,6vw,100px)] md:py-[clamp(64px,7vw,104px)]">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-[13px]">
            {number && <span className="font-display text-sm italic text-terracotta">{number}</span>}
            <span className="h-px w-[38px] bg-terracotta/60" />
            <span className="text-[11.5px] uppercase tracking-[0.22em] text-[#9a7b54]">{eyebrow}</span>
          </div>
          <h2 className="mt-3.5 max-w-[18em] font-display text-[28px] font-medium leading-[1.08] text-ink md:text-[clamp(28px,3vw,40px)]">
            {heading}
          </h2>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:mt-11 md:grid-cols-3 md:gap-[18px]">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-[18px] border border-ink/[0.07] bg-cream px-4 py-5 md:px-6 md:py-[26px]"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFE7D7] md:mb-4">
                {ICONS[c.icon]}
              </div>
              <div className="font-display text-[15px] leading-[1.2] text-ink md:text-[19px]">{c.title}</div>
            </div>
          ))}
        </div>
        {footnote && (
          <p className="mt-6 text-center text-[15px] leading-[1.5] text-body-soft md:mt-8">{footnote}</p>
        )}
      </div>
    </section>
  );
}
