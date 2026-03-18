// ─────────────────────────────────────────────────────────
//  src/components/rankings/RankingsHeader.tsx
//  Extracted from: RankingsPage.tsx
//    → The entire <header> block (lines ~130–215 of original)
//  Zero JSX or style changes. Props match what the original
//  component had in scope at that point.
// ─────────────────────────────────────────────────────────

import {
  ArrowLeft,
  BarChart3,
  Clock,
  Database,
  SlidersHorizontal,
} from "lucide-react";

interface RankingsHeaderProps {
  onNavigateHome: () => void;
}

export function RankingsHeader({ onNavigateHome }: RankingsHeaderProps) {
  return (
    <header
      className="relative overflow-hidden"
      style={{
        background: "oklch(0.16 0.055 258)",
        paddingTop: "5rem",
        paddingBottom: "4rem",
      }}
    >
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      {/* Radial glow accent */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 15% 50%, oklch(0.46 0.19 266 / 0.30) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 85% 20%, oklch(0.80 0.16 86 / 0.10) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-4">
        {/* Go Back Button */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Heading */}
        <div className="max-w-3xl">
          <div className="eyebrow-tag text-gold/80 mb-4">
            Comprehensive Analytics
          </div>
          <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
            College{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.92 0.18 90), oklch(0.72 0.18 72))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Rankings
            </span>{" "}
            2024
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-2xl leading-relaxed">
            Comprehensive rankings based on NAAC, NIRF &amp; TNEA integrated
            scoring — your trusted guide to higher education in Tamil Nadu and
            beyond.
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-6 mt-8">
          {[
            { icon: BarChart3,        label: "Total Colleges",   value: "1,200+" },
            { icon: Database,         label: "Data Sources",     value: "3"       },
            { icon: Clock,            label: "Last Updated",     value: "Jan 2024"},
            { icon: SlidersHorizontal,label: "Ranking Criteria", value: "6"       },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg"
              style={{
                background: "oklch(1 0 0 / 0.055)",
                border: "1px solid oklch(1 0 0 / 0.10)",
                backdropFilter: "blur(12px)",
              }}
            >
              <stat.icon className="w-4 h-4 text-gold/80" />
              <div>
                <p className="text-[10px] text-white/45 uppercase tracking-wider font-medium leading-none mb-0.5">
                  {stat.label}
                </p>
                <p className="text-white font-bold text-sm font-heading leading-none">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}