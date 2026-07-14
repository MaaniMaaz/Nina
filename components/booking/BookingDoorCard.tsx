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
    desc: "Our Atlanta studio at 8735 Dunwoody Place. Sit down with us face to face and walk out with a plan.",
    bg: "/images/clinic-bg.png",
    opacity: "opacity-85",
  },
  virtual: {
    label: "From anywhere",
    title: "Virtual",
    desc: "Secure video from anywhere in the country. The same half hour, the same care, from your couch.",
    bg: "/images/virtual-bg.png",
    opacity: "opacity-95",
  },
} as const;

/**
 * The shared in-person / virtual booking choice card. Per project convention,
 * every screen that presents this choice reuses this exact treatment.
 */
export default function BookingDoorCard({
  kind,
  selected,
  onSelect,
  mediaHeightClassName = "h-[180px] sm:h-[220px]",
}: BookingDoorCardProps) {
  const copy = COPY[kind];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`overflow-hidden rounded-[20px] bg-cream text-left shadow-[0_20px_44px_rgba(46,33,27,0.12)] transition-colors ${
        selected ? "border-2 border-terracotta" : "border-2 border-ink/[0.08] hover:border-terracotta/40"
      }`}
    >
      <div className={`relative bg-ink ${mediaHeightClassName}`}>
        <Image src={copy.bg} alt="" fill className={`object-cover ${copy.opacity}`} />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/5 to-ink/50" />
        <span className="absolute bottom-4.5 left-5.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
          {copy.label}
        </span>
      </div>
      <div className="p-6 pb-6.5">
        <div className="flex items-baseline justify-between">
          <div className="font-display text-[26px] font-medium text-ink">{copy.title}</div>
          <span className="text-sm font-semibold text-terracotta">{selected ? "Selected ✓" : "Choose →"}</span>
        </div>
        <div className="mt-1.5 text-[14px] leading-relaxed text-body-soft">{copy.desc}</div>
      </div>
    </button>
  );
}
