// ─────────────────────────────────────────────────────────
//  src/components/compare/CompareTable.tsx
//  Extracted from: ComparePage.tsx
//    → ComparisonTableProps interface
//    → ComparisonTable component  (was a local function)
//    → BestLabel inner component  (was a local function)
//    → ScoreBar inner component   (was a local function)
//    → `rows` row-definition array
//
//  Reuses from existing shared files:
//    → getNaacBadgeStyle  from ../../utils/rankingStyles  (already exists)
//    → getTypeBadgeStyle  from ../../utils/rankingStyles  (already exists)
//
//  Reuses from new utils:
//    → getHighlight, cellStyle, valueColor  from ../../utils/compareUtils
//    → T tokens                             from ../../utils/compareTokens
//
//  JSX is 100% identical — only import sources changed.
// ─────────────────────────────────────────────────────────

import type { College } from "../../data/colleges";
import {
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  MapPin,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";

// ── Reuse shared style helpers ──
import { getNaacBadgeStyle, getTypeBadgeStyle } from "../../utils/rankingStyles";

// ── Reuse pure compare logic ──
import { getHighlight, cellStyle, valueColor } from "../../utils/compareUtils";
import { T } from "../../utils/compareTokens";

interface ComparisonTableProps {
  colleges: College[];
}

// ── Inner: "Best" trophy label used in multiple rows ─────
function BestLabel() {
  return (
    <span
      className="text-[10px] font-semibold mt-1 flex items-center gap-0.5"
      style={{ color: T.goldText }}
    >
      <Trophy className="w-2.5 h-2.5" /> Best
    </span>
  );
}

// ── Inner: animated score progress bar ───────────────────
function ScoreBar({ value }: { value: number }) {
  return (
    <div
      className="mt-2 w-full h-1.5 rounded-full overflow-hidden"
      style={{ background: T.border }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${T.indigo}, ${T.gold})` }}
      />
    </div>
  );
}

export function ComparisonTable({ colleges }: ComparisonTableProps) {
  // Pre-compute value arrays for each numeric row (used by getHighlight)
  const overallScores   = colleges.map((c) => c.overallScore);
  const nirfRanks       = colleges.map((c) => c.nirfRank);
  const placementPcts   = colleges.map((c) => c.placementPct);
  const avgPackages     = colleges.map((c) => c.avgPackageLPA);
  const highestPackages = colleges.map((c) => c.highestPackageLPA);

  // Row definitions — each row knows its label, icon, and how to render a cell
  const rows = [
    {
      id: "overall",
      label: "Overall Score",
      icon: <Trophy className="w-4 h-4" style={{ color: `${T.gold}CC` }} />,
      render: (c: College) => {
        const kind = getHighlight(c.overallScore, overallScores);
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]" style={cellStyle(kind)}>
            <span
              className="font-heading font-black text-xl leading-none"
              style={{ color: valueColor(kind) }}
            >
              {c.overallScore}
            </span>
            <ScoreBar value={c.overallScore} />
            {kind === "best" && <BestLabel />}
          </td>
        );
      },
    },
    {
      id: "nirf",
      label: "NIRF Rank",
      icon: <BarChart3 className="w-4 h-4" style={{ color: `${T.indigo}B3` }} />,
      render: (c: College) => {
        const kind = getHighlight(c.nirfRank, nirfRanks, true);
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]" style={cellStyle(kind)}>
            <span className="font-heading font-black text-xl" style={{ color: valueColor(kind) }}>
              #{c.nirfRank}
            </span>
            {kind === "best" && (
              <div
                className="text-[10px] font-semibold mt-0.5 flex items-center gap-0.5"
                style={{ color: T.goldText }}
              >
                <Trophy className="w-2.5 h-2.5" /> Highest Rank
              </div>
            )}
          </td>
        );
      },
    },
    {
      id: "naac",
      label: "NAAC Grade",
      icon: <Trophy className="w-4 h-4" style={{ color: `${T.gold}B3` }} />,
      render: (c: College) => (
        <td key={c.id} className="px-5 py-4 min-w-[160px]">
          <span className={`inline-block px-3 py-1 rounded-md text-sm ${getNaacBadgeStyle(c.naacGrade)}`}>
            {c.naacGrade}
          </span>
        </td>
      ),
    },
    {
      id: "type",
      label: "College Type",
      icon: <Building2 className="w-4 h-4" style={{ color: T.muted }} />,
      render: (c: College) => (
        <td key={c.id} className="px-5 py-4 min-w-[160px]">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getTypeBadgeStyle(c.type)}`}>
            {c.type}
          </span>
        </td>
      ),
    },
    {
      id: "city",
      label: "City",
      icon: <MapPin className="w-4 h-4" style={{ color: T.muted }} />,
      render: (c: College) => (
        <td key={c.id} className="px-5 py-4 min-w-[160px]">
          <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: T.navy }}>
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: T.gold }} />
            {c.city}
          </div>
          <div className="text-xs mt-0.5" style={{ color: T.muted }}>{c.state}</div>
        </td>
      ),
    },
    {
      id: "established",
      label: "Established",
      icon: <Calendar className="w-4 h-4" style={{ color: T.muted }} />,
      render: (c: College) => (
        <td key={c.id} className="px-5 py-4 min-w-[160px]">
          <span className="font-heading font-bold text-sm" style={{ color: T.navy }}>
            {c.established}
          </span>
          <div className="text-xs mt-0.5" style={{ color: T.muted }}>
            {new Date().getFullYear() - c.established} years
          </div>
        </td>
      ),
    },
    {
      id: "placement",
      label: "Placement %",
      icon: <TrendingUp className="w-4 h-4" style={{ color: `${T.green}B3` }} />,
      render: (c: College) => {
        const kind = getHighlight(c.placementPct, placementPcts);
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]" style={cellStyle(kind)}>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-xl" style={{ color: valueColor(kind) }}>
                {c.placementPct}%
              </span>
              {c.trend === "up"   && <TrendingUp   className="w-4 h-4" style={{ color: T.greenTx }} />}
              {c.trend === "down" && <TrendingDown  className="w-4 h-4" style={{ color: T.redTx   }} />}
            </div>
            {kind === "best" && <BestLabel />}
          </td>
        );
      },
    },
    {
      id: "avgPkg",
      label: "Avg Package",
      icon: <span className="text-xs font-bold" style={{ color: T.greenTx }}>₹</span>,
      render: (c: College) => {
        const kind = getHighlight(c.avgPackageLPA, avgPackages);
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]" style={cellStyle(kind)}>
            <span className="font-heading font-black text-xl" style={{ color: valueColor(kind) }}>
              {c.avgPackageLPA}{" "}
              <span className="text-sm font-semibold" style={{ color: T.muted }}>LPA</span>
            </span>
            {kind === "best" && <BestLabel />}
          </td>
        );
      },
    },
    {
      id: "highestPkg",
      label: "Highest Package",
      icon: <span className="text-xs font-bold" style={{ color: T.goldText }}>₹₹</span>,
      render: (c: College) => {
        const kind = getHighlight(c.highestPackageLPA, highestPackages);
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]" style={cellStyle(kind)}>
            <span className="font-heading font-black text-xl" style={{ color: valueColor(kind) }}>
              {c.highestPackageLPA}{" "}
              <span className="text-sm font-semibold" style={{ color: T.muted }}>LPA</span>
            </span>
            {kind === "best" && <BestLabel />}
          </td>
        );
      },
    },
    {
      id: "courses",
      label: "Courses Offered",
      icon: <BookOpen className="w-4 h-4" style={{ color: T.muted }} />,
      render: (c: College) => (
        <td key={c.id} className="px-5 py-4 min-w-[160px]">
          <div className="flex flex-wrap gap-1">
            {c.courses.slice(0, 4).map((course) => (
              <span
                key={course}
                className="inline-block px-2 py-0.5 rounded text-[10px] font-medium"
                style={{
                  background: `${T.indigo}0F`,
                  color:      "oklch(0.30 0.18 266)",
                  border:     `1px solid ${T.indigo}33`,
                }}
              >
                {course}
              </span>
            ))}
            {c.courses.length > 4 && (
              <span
                className="inline-block px-2 py-0.5 rounded text-[10px] font-medium border"
                style={{ color: T.muted, borderColor: T.border }}
              >
                +{c.courses.length - 4} more
              </span>
            )}
          </div>
        </td>
      ),
    },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border:    `1px solid ${T.border}`,
        boxShadow: `0 8px 32px oklch(0.16 0.055 258 / 0.08), 0 2px 8px oklch(0 0 0 / 0.04)`,
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: T.heroBg }}>
              {/* Sticky "Parameter" label column */}
              <th
                className="px-5 py-4 text-left sticky left-0 z-10 font-semibold text-[11px] uppercase tracking-wider text-white/70 min-w-[160px]"
                style={{ background: T.heroBg, borderRight: "1px solid oklch(1 0 0 / 0.10)" }}
              >
                Parameter
              </th>

              {/* College header columns */}
              {colleges.map((c, i) => (
                <motion.th
                  key={c.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.32 }}
                  className="px-5 py-4 text-left min-w-[160px]"
                  style={{ background: T.heroBg }}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-heading font-black text-[11px] mt-0.5"
                      style={{
                        background: `${T.gold}26`,
                        color:      T.gold,
                        border:     `1px solid ${T.gold}40`,
                      }}
                    >
                      #{c.rank}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-white text-sm leading-snug line-clamp-2">
                        {c.shortName}
                      </p>
                      <p className="text-white/50 text-[10px] mt-0.5">{c.city}</p>
                    </div>
                  </div>
                </motion.th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={row.id}
                style={{
                  borderTop:  `1px solid ${T.border}`,
                  background: rowIdx % 2 === 0 ? "#fff" : T.surface,
                }}
              >
                {/* Sticky parameter label cell */}
                <td
                  className="px-5 py-4 sticky left-0 z-10 min-w-[160px]"
                  style={{
                    background:  rowIdx % 2 === 0 ? "#fff" : T.surface,
                    borderRight: `1px solid ${T.border}`,
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="shrink-0">{row.icon}</span>
                    <span
                      className="font-semibold text-xs uppercase tracking-wide"
                      style={{ color: T.muted }}
                    >
                      {row.label}
                    </span>
                  </div>
                </td>

                {/* Data cells */}
                {colleges.map((c) => row.render(c))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div
        className="px-5 py-3.5 flex items-center gap-6 flex-wrap"
        style={{ borderTop: `1px solid ${T.border}`, background: T.surface }}
      >
        <span
          className="text-[11px] font-semibold uppercase tracking-wide"
          style={{ color: T.muted }}
        >
          Legend:
        </span>
        <div className="flex items-center gap-2 text-xs">
          <div
            className="w-3 h-3 rounded-sm"
            style={{
              background: "oklch(0.80 0.16 86 / 0.25)",
              border:     `1px solid ${T.gold}88`,
            }}
          />
          <span style={{ color: T.muted }}>Best value</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div
            className="w-3 h-3 rounded-sm"
            style={{
              background: "oklch(0.54 0.20 27 / 0.14)",
              border:     `1px solid ${T.red}66`,
            }}
          />
          <span style={{ color: T.muted }}>Lowest value</span>
        </div>
      </div>
    </div>
  );
}