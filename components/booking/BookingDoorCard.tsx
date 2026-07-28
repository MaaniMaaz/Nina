import Image from "next/image";

interface BookingDoorCardProps {
  kind: "inperson" | "virtual";
  selected: boolean;
  onSelect: () => void;
  mediaHeightClassName?: string;
}

const COPY = {
  inperson: {
    label: "In the studio",
    title: "In-Person",
    descMobile: "Our Atlanta studio, 8735 Dunwoody Place. Sit down with us face to face.",
    descDesktop: "Our Atlanta studio at 8735 Dunwoody Place. Sit down with us face to face and walk out with a plan.",
    bg: "/images/clinic-bg.png",
    opacity: "opacity-85",
  },
  virtual: {
    label: "From anywhere",
    title: "Virtual",
    descMobile: "Secure video from anywhere in the country. Same care, your couch.",
    descDesktop: "Secure video from anywhere in the country. The same half hour, the same care, from your couch.",
    bg: "/images/virtual-bg.png",
    opacity: "opacity-95",
  },
} as const;

/**
 * Shared In-Person / Virtual booking card.
 * Specs from Nina sent CLAUDE.md + Booking Chosen Mobile/Desktop dumps.
 */
export default function BookingDoorCard({
  kind,
  selected,
  onSelect,
  mediaHeightClassName = "h-[110px] md:h-[220px]",
}: BookingDoorCardProps) {
  const copy = COPY[kind];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full overflow-hidden rounded-[16px] bg-cream text-left shadow-[0_14px_32px_rgba(46,33,27,0.1)] transition-colors md:rounded-[20px] md:shadow-[0_20px_44px_rgba(46,33,27,0.12)] ${
        selected
          ? "border-2 border-terracotta"
          : "border border-ink/[0.08] md:border-2 hover:border-terracotta/40"
      }`}
    >
      <div className={`relative bg-ink ${mediaHeightClassName}`}>
        <Image src={copy.bg} alt="" fill className={`object-cover ${copy.opacity}`} />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(46,33,27,0.1), rgba(46,33,27,0.55))",
          }}
        />
        <span className="absolute bottom-3 left-3.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-gold md:bottom-[18px] md:left-[22px] md:text-[10px] md:tracking-[0.18em]">
          {copy.label}
        </span>
      </div>
      <div className="px-[18px] pb-[17px] pt-[15px] md:px-[26px] md:pb-[26px] md:pt-6">
        <div className="flex items-baseline justify-between gap-2">
          <div className="font-display text-[20px] font-medium text-ink md:text-[28px]">{copy.title}</div>
          <span className="flex-none text-[12.5px] font-semibold text-terracotta md:text-sm">
            {selected ? "Selected ✓" : "Choose →"}
          </span>
        </div>
        <div className="mt-1 text-[12.5px] leading-[1.5] text-body-soft md:mt-[7px] md:text-[14.5px] md:leading-[1.55]">
          <span className="md:hidden">{copy.descMobile}</span>
          <span className="hidden md:inline">{copy.descDesktop}</span>
        </div>
      </div>
    </button>
  );
}
