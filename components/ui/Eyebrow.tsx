interface EyebrowProps {
  number?: string;
  label: string;
  tone?: "light" | "dark" | "onTerracotta";
  align?: "left" | "center";
}

const toneColor: Record<"light" | "dark" | "onTerracotta", string> = {
  light: "text-terracotta",
  dark: "text-gold",
  onTerracotta: "text-[#F6D9A8]",
};

const numberColor: Record<"light" | "dark" | "onTerracotta", string> = {
  light: "text-terracotta",
  dark: "text-gold",
  onTerracotta: "text-[#F6D9A8]",
};

const lineColor: Record<"light" | "dark" | "onTerracotta", string> = {
  light: "bg-terracotta/60",
  dark: "bg-gold/60",
  onTerracotta: "bg-[#F6D9A8]/60",
};

/** Dump eyebrows are 10px / 0.18em tracking / terracotta on cream|sand sections. */
export default function Eyebrow({ number, label, tone = "light", align = "left" }: EyebrowProps) {
  return (
    <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
      {number && (
        <>
          <span className={`font-display text-sm italic ${numberColor[tone]}`}>{number}</span>
          <span className={`h-px w-9 ${lineColor[tone]}`} />
        </>
      )}
      <span className={`text-[10px] font-semibold uppercase tracking-[0.18em] md:text-[11.5px] md:tracking-[0.22em] ${toneColor[tone]}`}>
        {label}
      </span>
    </div>
  );
}
