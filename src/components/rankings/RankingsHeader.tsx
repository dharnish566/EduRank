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
        paddingTop: "2rem",
        paddingBottom: "4rem",
      }}
    >
      <div className="absolute inset-0 grid-pattern opacity-20" />
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

        {/* Back button — now has a subtle pill border so it reads as a real button */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2 mb-8 group transition-colors"
          style={{
            background: "oklch(1 0 0 / 0.06)",
            border: "0.5px solid oklch(1 0 0 / 0.14)",
            borderRadius: "8px",
            padding: "6px 14px",
            color: "oklch(0.82 0.06 265)",
          }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Replace the existing <div className="max-w-3xl"> + stats bar with this: */}

        <div className="flex items-center gap-10 flex-wrap">

          {/* LEFT — heading + description */}
          <div className="flex-1 min-w-[260px]">
            <div
              className="inline-flex items-center gap-1.5 mb-5 px-3.5 py-1"
              style={{
                background: "oklch(0.80 0.16 86 / 0.10)",
                border: "0.5px solid oklch(0.80 0.16 86 / 0.30)",
                borderRadius: "20px",
              }}
            >
              <span
                className="text-[11px] font-semibold tracking-widest uppercase"
                style={{ color: "oklch(0.80 0.16 86)" }}
              >
                Comprehensive Analytics
              </span>
            </div>

            <h1
              className="heading-display text-4xl sm:text-5xl lg:text-[3rem] mb-4"
              style={{
                color: "#ffffff",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              College{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, oklch(0.92 0.18 90), oklch(0.72 0.18 72))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Rankings
              </span>{" "}
              2025
            </h1>

            <p
              className="text-[15.5px] leading-relaxed"
              style={{ color: "oklch(0.76 0.07 270)" }}
            >
              Explore 1,200+ colleges ranked by NAAC, NIRF &amp; TNEA scores.
              Compare institutions across academics,<br></br> infrastructure, and placements
              — and find the right fit for your future.
            </p>
          </div>

          {/* RIGHT — 2×2 stat grid */}
          <div
            className="grid grid-cols-2 gap-3 flex-shrink-0"
            style={{ minWidth: "480px" }}
          >
            {[
              {
                icon: BarChart3,
                label: "Total Colleges",
                value: "600+",
                iconColor: "oklch(0.80 0.16 86)",
                iconBg: "oklch(0.80 0.16 86 / 0.13)",
              },
              {
                icon: Database,
                label: "Data Sources",
                value: "3",
                iconColor: "#7ec8f5",
                iconBg: "rgba(99,196,255,0.11)",
              },
              {
                icon: Clock,
                label: "Last Updated",
                value: "Jan 2024",
                iconColor: "#68dfaa",
                iconBg: "rgba(100,220,160,0.11)",
              },
              {
                icon: SlidersHorizontal,
                label: "Ranking Criteria",
                value: "6",
                iconColor: "#c4a8ff",
                iconBg: "rgba(180,140,255,0.13)",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-2.5 p-4 rounded-xl"
                style={{
                  background: "oklch(1 0 0 / 0.055)",
                  border: "0.5px solid oklch(1 0 0 / 0.13)",
                }}
              >
                <div
                  className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center"
                  style={{ background: stat.iconBg }}
                >
                  <stat.icon className="w-4 h-4" style={{ color: stat.iconColor }} />
                </div>
                <div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-widest leading-none mb-1"
                    style={{ color: "rgba(160,148,220,0.60)" }}
                  >
                    {stat.label}
                  </p>
                  <p className="text-[22px] font-bold leading-none" style={{ color: "#ffffff" }}>
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </header>
  );
}