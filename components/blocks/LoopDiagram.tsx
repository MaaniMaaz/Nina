import Eyebrow from "@/components/ui/Eyebrow";
import type { BulletItem } from "@/content/types";

interface LoopDiagramProps {
  number: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  drivers: BulletItem[];
  centerLabel?: string;
}

const nodePositions = [
  { cx: 170, cy: 50 },
  { cx: 290, cy: 160 },
  { cx: 170, cy: 270 },
  { cx: 50, cy: 160 },
];

export default function LoopDiagram({
  number,
  eyebrow,
  heading,
  paragraphs,
  drivers,
  centerLabel = "THE LOOP",
}: LoopDiagramProps) {
  const nodes = drivers.slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-olive px-6 py-17 md:px-10 md:py-28">
      <div className="grain-overlay opacity-25 mix-blend-overlay" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <Eyebrow number={number} label={eyebrow} tone="dark" align="center" />
          <h2 className="mt-3.5 font-display text-[30px] font-medium leading-tight text-cream-deep sm:text-[36px] md:text-[44px]">
            {heading}
          </h2>
          {paragraphs.slice(0, 1).map((p) => (
            <p key={p} className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-[#d3dcc6]">
              {p}
            </p>
          ))}
        </div>
        <div className="mt-12 grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <svg viewBox="0 0 340 320" className="mx-auto block h-auto w-full max-w-[380px]">
            <defs>
              <marker id="loop-arrow" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#E9B45A" />
              </marker>
            </defs>
            <path
              d="M 196 64 A 110 110 0 0 1 276 196"
              fill="none"
              stroke="#E9B45A"
              strokeWidth="2"
              strokeDasharray="3 5"
              markerEnd="url(#loop-arrow)"
              opacity="0.7"
            />
            <path
              d="M 262 230 A 110 110 0 0 1 150 286"
              fill="none"
              stroke="#E9B45A"
              strokeWidth="2"
              strokeDasharray="3 5"
              markerEnd="url(#loop-arrow)"
              opacity="0.7"
            />
            <path
              d="M 110 278 A 110 110 0 0 1 56 154"
              fill="none"
              stroke="#E9B45A"
              strokeWidth="2"
              strokeDasharray="3 5"
              markerEnd="url(#loop-arrow)"
              opacity="0.7"
            />
            <path
              d="M 66 116 A 110 110 0 0 1 150 56"
              fill="none"
              stroke="#E9B45A"
              strokeWidth="2"
              strokeDasharray="3 5"
              markerEnd="url(#loop-arrow)"
              opacity="0.7"
            />
            <circle cx="170" cy="160" r="48" fill="none" stroke="rgba(246,238,225,0.22)" strokeWidth="1" />
            <text x="170" y="156" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="17" fontWeight="600" fill="#F6EEE1">
              {centerLabel.split(" ")[0]}
            </text>
            <text x="170" y="174" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="8.5" letterSpacing="0.12em" fill="#9fb08c">
              {centerLabel}
            </text>
            {nodes.map((node, i) => {
              const pos = nodePositions[i];
              const lines = node.label.split(" & ");
              return (
                <g key={node.label}>
                  <circle cx={pos.cx} cy={pos.cy} r="44" fill="#3c4a30" stroke="#E9B45A" strokeWidth="1.4" />
                  {lines.length > 1 ? (
                    <>
                      <text x={pos.cx} y={pos.cy - 4} textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="700" fill="#F6EEE1">
                        {lines[0]}
                      </text>
                      <text x={pos.cx} y={pos.cy + 10} textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="700" fill="#F6EEE1">
                        &amp; {lines[1]}
                      </text>
                    </>
                  ) : (
                    <text x={pos.cx} y={pos.cy + 4} textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="700" fill="#F6EEE1">
                      {node.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <div>
            {paragraphs.slice(1).map((p) => (
              <p key={p} className="mb-5 text-[14.5px] leading-relaxed text-[#d3dcc6]">
                {p}
              </p>
            ))}
            <div className="flex flex-col gap-4">
              {drivers.map((d) => (
                <div key={d.label} className="flex items-start gap-3">
                  <span className="mt-1.5 h-[7px] w-[7px] flex-none rounded-full bg-gold" />
                  <span className="text-sm leading-relaxed text-[#e6ecdb]">
                    <strong className="text-cream-deep">{d.label}</strong>, {d.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
