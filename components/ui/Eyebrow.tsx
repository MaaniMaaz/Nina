interface EyebrowProps {
  number?: string;
  label: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
}

const toneColor: Record<"light" | "dark", string> = {
  light: "text-[#9a7b54]",
  dark: "text-gold",
};

const numberColor: Record<"light" | "dark", string> = {
  light: "text-terracotta",
  dark: "text-gold",
};

const lineColor: Record<"light" | "dark", string> = {
  light: "bg-terracotta/60",
  dark: "bg-gold/60",
};

export default function Eyebrow({ number, label, tone = "light", align = "left" }: EyebrowProps) {
  return (
    <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
      {number && (
        <>
          <span className={`font-display text-sm italic ${numberColor[tone]}`}>{number}</span>
          <span className={`h-px w-9 ${lineColor[tone]}`} />
        </>
      )}
      <span className={`text-[11.5px] font-semibold uppercase tracking-[0.22em] ${toneColor[tone]}`}>
        {label}
      </span>
    </div>
  );
}
