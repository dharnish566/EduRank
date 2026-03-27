import type { College } from "../../data/colleges";
import {
  BarChart3, BookOpen, Building2, Calendar,
  MapPin, Scissors, TrendingDown, TrendingUp, Trophy, Award,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";

import { getNaacBadgeStyle, getTypeBadgeStyle } from "../../utils/rankingStyles";
import { getHighlight, cellStyle, valueColor } from "../../utils/compareUtils";
import { T } from "../../utils/compareTokens";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { ModeToggle, type ComparisonMode } from "../compare/ModeToggle";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CollegeWithCriteria = College;
// ─── Criterion metadata ───────────────────────────────────────────────────────

export const CRITERION_LABELS: Record<number, string> = {
  1: "Curricular Aspects",
  2: "Teaching-Learning & Evaluation",
  3: "Research, Innovations & Extension",
  4: "Infrastructure & Learning Resources",
  5: "Student Support & Progression",
  6: "Governance, Leadership & Management",
  7: "Institutional Values & Best Practices",
};

const CRITERION_FIELD_MAP: Record<string, number> = {
  criterion1: 1, criterion2: 2, criterion3: 3,
  criterion4: 4, criterion5: 5, criterion6: 6, criterion7: 7,
};

// ─── Backend parser ───────────────────────────────────────────────────────────

export function parseCollegeResponse(raw: Record<string, unknown>): CollegeWithCriteria {
  const CRITERION_FIELD_MAP: Record<string, number> = {
    criterion1: 1,
    criterion2: 2,
    criterion3: 3,
    criterion4: 4,
    criterion5: 5,
    criterion6: 6,
    criterion7: 7,
  };

  const naacCriteria: Record<number, number> = {};

  Object.entries(CRITERION_FIELD_MAP).forEach(([field, no]) => {
    const cgpa = raw[field] != null ? parseFloat(String(raw[field])) : 0;
    naacCriteria[no] = isNaN(cgpa) ? 0 : cgpa;
  });

  const validGrades = ["A++", "A+", "A", "B++", "B+", "B", "C"] as const;
  type NaacGrade = typeof validGrades[number];

  const rawGrade = raw.naacgrade as string;
  const naacGrade: NaacGrade | undefined =
    validGrades.includes(rawGrade as NaacGrade)
      ? (rawGrade as NaacGrade)
      : undefined;

  return {
    id: Number(raw.id),
    name: String(raw.name),

    district: (raw.district as string) ?? "-",
    city: (raw.city as string) ?? "-",
    state: (raw.state as string) ?? "-",

    type: (raw.type as string) ?? "-",

    overallScore:
      raw.overall_score != null
        ? parseFloat(String(raw.overall_score))
        : undefined,

    established: Number(raw.establishment_year) || 0,

    naacGrade,
    naacScore:
      raw.naacscore != null
        ? parseFloat(String(raw.naacscore))
        : undefined,

    nirfRank: raw.rank != null ? Number(raw.rank) : 0,

    placementPct:
      raw.placement_percentage != null
        ? parseFloat(String(raw.placement_percentage))
        : undefined,

    avgCutoff:
      raw.avg_cutoff != null
        ? parseFloat(String(raw.avg_cutoff))
        : undefined,

    highestCutoff:
      raw.highest_cutoff != null
        ? parseFloat(String(raw.highest_cutoff))
        : undefined,

    courseCount:
      raw.course_count != null
        ? parseInt(String(raw.course_count), 10)
        : undefined,

    courses: [],

    naacCriteria, // ✅ MAP STRUCTURE
  };
}

// ─── Small shared UI pieces ───────────────────────────────────────────────────

function BestLabel() {
  return (
    <span className="text-[10px] font-semibold mt-1 flex items-center gap-0.5" style={{ color: T.goldText }}>
      <Trophy className="w-2.5 h-2.5" /> Best
    </span>
  );
}

function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
  return (
    <div className="mt-2 w-full h-1.5 rounded-full overflow-hidden" style={{ background: T.border }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, (value / max) * 100)}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${T.indigo}, ${T.gold})` }}
      />
    </div>
  );
}

function Dash() {
  return <span className="text-base" style={{ color: T.muted }}>–</span>;
}

function allEmpty(vals: (number | null | undefined)[]) {
  return vals.every((v) => v == null || v === 0);
}

// ─── Row definition type ──────────────────────────────────────────────────────

interface RowDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  isCriterion?: boolean;
  render: (c: CollegeWithCriteria) => React.ReactNode;
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ComparisonTableProps {
  colleges: CollegeWithCriteria[];
}

export function ComparisonTable({ colleges }: ComparisonTableProps) {
  const [mode, setMode] = useState<ComparisonMode>("overall");

  // Pre-compute highlight arrays
  const overallScores  = colleges.map((c) => c.overallScore ?? 0);
  const nirfRanks      = colleges.map((c) => c.nirfRank ?? 9999);
  const naacScores     = colleges.map((c) => c.naacScore ?? 0);
  const placementPcts  = colleges.map((c) => c.placementPct ?? 0);
  const avgCutoffs     = colleges.map((c) => c.avgCutoff ?? 0);
  const highestCutoffs = colleges.map((c) => c.highestCutoff ?? 0);
  const courseCounts   = colleges.map((c) => c.courseCount ?? 0);

  // ── Overall mode rows ───────────────────────────────────────────────────────
  const overallRows: RowDef[] = useMemo(() => [
    {
      id: "overall",
      label: "Overall Score",
      icon: <Trophy className="w-4 h-4" style={{ color: `${T.gold}CC` }} />,
      render: (c) => {
        const val = c.overallScore ?? 0;
        const kind = allEmpty(overallScores) ? "neutral" : getHighlight(val, overallScores);
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]" style={val > 0 ? cellStyle(kind) : {}}>
            {val > 0 ? (<>
              <span className="font-heading font-black text-xl leading-none" style={{ color: valueColor(kind) }}>{val}</span>
              <ScoreBar value={val} max={100} />
              {kind === "best" && <BestLabel />}
            </>) : <Dash />}
          </td>
        );
      },
    },
    {
      id: "nirf",
      label: "NIRF Rank",
      icon: <BarChart3 className="w-4 h-4" style={{ color: `${T.indigo}B3` }} />,
      render: (c) => {
        const hasRank = c.nirfRank != null && c.nirfRank > 0;
        const kind = allEmpty(nirfRanks.map((v) => v === 9999 ? null : v))
          ? "neutral" : getHighlight(c.nirfRank ?? 9999, nirfRanks, true);
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]" style={hasRank ? cellStyle(kind) : {}}>
            {hasRank ? (<>
              <span className="font-heading font-black text-xl" style={{ color: valueColor(kind) }}>#{c.nirfRank}</span>
              {kind === "best" && (
                <div className="text-[10px] font-semibold mt-0.5 flex items-center gap-0.5" style={{ color: T.goldText }}>
                  <Trophy className="w-2.5 h-2.5" /> Highest Rank
                </div>
              )}
            </>) : <Dash />}
          </td>
        );
      },
    },
    {
      id: "type",
      label: "College Type",
      icon: <Building2 className="w-4 h-4" style={{ color: T.muted }} />,
      render: (c) => (
        <td key={c.id} className="px-5 py-4 min-w-[160px]">
          {c.type && c.type !== "-"
            ? <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getTypeBadgeStyle(c.type)}`}>{c.type}</span>
            : <Dash />}
        </td>
      ),
    },
    {
      id: "city",
      label: "City / District",
      icon: <MapPin className="w-4 h-4" style={{ color: T.muted }} />,
      render: (c) => {
        const location = c.district && c.district !== "-" ? c.district : c.city;
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]">
            {location && location !== "-" ? (<>
              <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: T.navy }}>
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: T.gold }} />{location}
              </div>
              {c.state && c.state !== "-" && <div className="text-xs mt-0.5" style={{ color: T.muted }}>{c.state}</div>}
            </>) : <Dash />}
          </td>
        );
      },
    },
    {
      id: "established",
      label: "Established",
      icon: <Calendar className="w-4 h-4" style={{ color: T.muted }} />,
      render: (c) => {
        const year = c.established;
        const age = year != null && year > 0 ? new Date().getFullYear() - year : null;
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]">
            {year != null && year > 0 ? (<>
              <span className="font-heading font-bold text-sm" style={{ color: T.navy }}>{year}</span>
              <div className="text-xs mt-0.5" style={{ color: T.muted }}>{age} yrs</div>
            </>) : <Dash />}
          </td>
        );
      },
    },
    {
      id: "placement",
      label: "Placement %",
      icon: <TrendingUp className="w-4 h-4" style={{ color: `${T.green}B3` }} />,
      render: (c) => {
        const val = c.placementPct ?? 0;
        const kind = allEmpty(placementPcts) ? "neutral" : getHighlight(val, placementPcts);
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]" style={val > 0 ? cellStyle(kind) : {}}>
            {val > 0 ? (<>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xl" style={{ color: valueColor(kind) }}>{val}%</span>
                {c.trend === "up" && <TrendingUp className="w-4 h-4" style={{ color: T.greenTx }} />}
                {c.trend === "down" && <TrendingDown className="w-4 h-4" style={{ color: T.redTx }} />}
              </div>
              {kind === "best" && <BestLabel />}
            </>) : <Dash />}
          </td>
        );
      },
    },
    {
      id: "avgCutoff",
      label: "Avg OC Cutoff",
      icon: <Scissors className="w-4 h-4" style={{ color: T.muted }} />,
      render: (c) => {
        const val = c.avgCutoff ?? 0;
        const kind = allEmpty(avgCutoffs) ? "neutral" : getHighlight(val, avgCutoffs);
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]" style={val > 0 ? cellStyle(kind) : {}}>
            {val > 0 ? (<>
              <span className="font-heading font-black text-xl" style={{ color: valueColor(kind) }}>{val.toFixed(2)}</span>
              {kind === "best" && <BestLabel />}
            </>) : <Dash />}
          </td>
        );
      },
    },
    {
      id: "highestCutoff",
      label: "Highest OC Cutoff",
      icon: <Scissors className="w-4 h-4" style={{ color: T.goldText }} />,
      render: (c) => {
        const val = c.highestCutoff ?? 0;
        const kind = allEmpty(highestCutoffs) ? "neutral" : getHighlight(val, highestCutoffs);
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]" style={val > 0 ? cellStyle(kind) : {}}>
            {val > 0 ? (<>
              <span className="font-heading font-black text-xl" style={{ color: valueColor(kind) }}>{val.toFixed(2)}</span>
              {kind === "best" && <BestLabel />}
            </>) : <Dash />}
          </td>
        );
      },
    },
    {
      id: "courses",
      label: "No. of Courses",
      icon: <BookOpen className="w-4 h-4" style={{ color: T.muted }} />,
      render: (c) => {
        const val = c.courseCount ?? 0;
        const kind = allEmpty(courseCounts) ? "neutral" : getHighlight(val, courseCounts);
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]" style={val > 0 ? cellStyle(kind) : {}}>
            {val > 0 ? (<>
              <span className="font-heading font-black text-xl" style={{ color: valueColor(kind) }}>{val}</span>
              <div className="text-[10px] mt-0.5" style={{ color: T.muted }}>branches</div>
              {kind === "best" && <BestLabel />}
            </>) : <Dash />}
          </td>
        );
      },
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [colleges]);

  // ── NAAC mode rows ──────────────────────────────────────────────────────────
  const naacRows: RowDef[] = useMemo(() => {
    const fixed: RowDef[] = [
      {
        id: "naacGrade",
        label: "NAAC Grade",
        icon: <Trophy className="w-4 h-4" style={{ color: `${T.gold}B3` }} />,
        render: (c) => (
          <td key={c.id} className="px-5 py-4 min-w-[160px]">
            {c.naacGrade
              ? <span className={`inline-block px-3 py-1 rounded-md text-sm ${getNaacBadgeStyle(c.naacGrade)}`}>{c.naacGrade}</span>
              : <Dash />}
          </td>
        ),
      },
      {
        id: "naacScore",
        label: "NAAC Score",
        icon: <Trophy className="w-4 h-4" style={{ color: `${T.gold}80` }} />,
        render: (c) => {
          const val = c.naacScore ?? 0;
          const kind = allEmpty(naacScores) ? "neutral" : getHighlight(val, naacScores);
          return (
            <td key={c.id} className="px-5 py-4 min-w-[160px]" style={val > 0 ? cellStyle(kind) : {}}>
              {val > 0 ? (<>
                <span className="font-heading font-black text-xl" style={{ color: valueColor(kind) }}>{val.toFixed(2)}</span>
                <ScoreBar value={val} max={4} />
                {kind === "best" && <BestLabel />}
              </>) : <Dash />}
            </td>
          );
        },
      },
    ];

    const criterionRows: RowDef[] = Array.from({ length: 7 }, (_, i) => {
  const no = i + 1;
  const name = CRITERION_LABELS[no];

  const vals = colleges.map((c) => c.naacCriteria?.[no] ?? 0);

  return {
    id: `criterion_${no}`,
    label: `C${no}: ${name}`,
    isCriterion: true,
    icon: (
      <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-indigo-100 text-indigo-600 rounded">
        {no}
      </span>
    ),
    render: (c) => {
      const val = c.naacCriteria?.[no] ?? 0;
      const kind = allEmpty(vals) ? "neutral" : getHighlight(val, vals);

      return (
        <td
          key={`criterion-${no}-${c.id}`}
          className="px-5 py-4"
          style={val > 0 ? cellStyle(kind) : {}}
        >
          {val > 0 ? (
            <>
              <span style={{ color: valueColor(kind) }}>
                {val.toFixed(2)}
              </span>
              {kind === "best" && <BestLabel />}
            </>
          ) : (
            <Dash />
          )}
        </td>
      );
    },
  };
});

    return [...fixed, ...criterionRows];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colleges]);

  const rows = mode === "overall" ? overallRows : naacRows;
  const colWidth = `${100 / (colleges.length + 1)}%`;

  return (
    <div className="flex flex-col gap-0">

      {/* ════════════════════════════════════════════════════
          TOOLBAR — sits ABOVE the table, right-aligned.
          Left: row count pill  |  Right: mode toggle
          This is the correct professional placement —
          never inside the sticky header cell.
      ════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between mb-3 px-1">

        {/* Left: contextual label that changes with mode */}
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-1.5"
            >
              {mode === "overall" ? (
                <BarChart3 className="w-3.5 h-3.5" style={{ color: T.indigo }} />
              ) : (
                <Trophy className="w-3.5 h-3.5" style={{ color: T.goldText }} />
              )}
              <span
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: mode === "naac" ? T.goldText : T.muted }}
              >
                {mode === "overall" ? "Overall Comparison" : "NAAC Analysis Mode"}
              </span>

              {/* Row count badge */}
              <span
                className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  background: mode === "naac" ? `${T.indigo}18` : `${T.border}`,
                  color: mode === "naac" ? T.indigo : T.muted,
                  border: `1px solid ${mode === "naac" ? T.indigo + "30" : T.border}`,
                }}
              >
                {rows.length} rows
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: the toggle */}
        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      {/* ════════════════════════════════════════════════════
          TABLE
      ════════════════════════════════════════════════════ */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          border: `1px solid ${T.border}`,
          boxShadow: `0 8px 32px oklch(0.16 0.055 258 / 0.08), 0 2px 8px oklch(0 0 0 / 0.04)`,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <thead>
              <tr style={{ background: T.heroBg }}>

                {/* Sticky first column — ONLY "Parameter" label, nothing else */}
                <th
                  className="px-5 py-4 text-left sticky left-0 z-20"
                  style={{
                    width: colWidth,
                    background: T.heroBg,
                    borderRight: "1px solid oklch(1 0 0 / 0.10)",
                  }}
                >
                  <span className="font-semibold text-[11px] uppercase tracking-wider text-white/70">
                    Parameter
                  </span>
                </th>

                {colleges.map((c) => (
                  <th
                    key={c.id}
                    className="px-5 py-4 text-left"
                    style={{ width: colWidth, background: T.heroBg }}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-heading font-black text-[11px] mt-0.5"
                        style={{ background: `${T.gold}26`, color: T.gold, border: `1px solid ${T.gold}40` }}
                      />
                      <div className="min-w-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="font-heading font-bold text-white text-xs mr-10 leading-snug truncate cursor-pointer">
                              {c.name}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>{c.name}</TooltipContent>
                        </Tooltip>
                        <p className="text-white/50 text-[10px] mt-0.5">
                          {c.district && c.district !== "-" ? c.district
                            : c.city && c.city !== "-" ? c.city : ""}
                        </p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>

              {/* NAAC mode sub-header banner */}
              <AnimatePresence>
                {mode === "naac" && (
                  <motion.tr
                    key="naac-banner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* <td
                      colSpan={colleges.length + 1}
                      className="px-5 py-2 text-center text-[11px] font-semibold uppercase tracking-widest"
                      style={{
                        background: `linear-gradient(90deg, ${T.indigo}22, ${T.gold}18, ${T.indigo}22)`,
                        color: T.goldText,
                        borderBottom: `1px solid ${T.gold}30`,
                      }}
                    >
                      <Trophy className="w-3 h-3 inline mr-1.5 mb-0.5" />
                      Criteria Breakdown — Scale: 0–4 CGPA
                    </td> */}
                  </motion.tr>
                )}
              </AnimatePresence>
            </thead>

            {/* ── Body ───────────────────────────────────────────────────── */}
            <tbody>
              <AnimatePresence mode="popLayout" initial={false}>
                {rows.map((row, rowIdx) => (
                  <motion.tr
                    key={`${mode}-${row.id}`}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, delay: rowIdx * 0.025 }}
                    style={{
                      borderTop: `1px solid ${T.border}`,
                      background: rowIdx % 2 === 0 ? "#fff" : T.surface,
                    }}
                  >
                    <td
                      className="px-5 py-4 sticky left-0 z-10"
                      style={{
                        width: colWidth,
                        background: rowIdx % 2 === 0 ? "#fff" : T.surface,
                        borderRight: `1px solid ${T.border}`,
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="shrink-0">{row.icon}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className="font-semibold text-xs uppercase tracking-wide truncate max-w-[300px] cursor-default"
                              style={{ color: row.isCriterion ? T.indigo : T.muted }}
                            >
                              {row.label}
                            </span>
                          </TooltipTrigger>
                          {row.isCriterion && (
                            <TooltipContent>
                              {CRITERION_LABELS[parseInt(row.id.split("_")[1])]}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </div>
                    </td>
                    {colleges.map((c) => row.render(c))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* ── Legend ─────────────────────────────────────────────────────── */}
        <div
          className="px-5 py-3.5 flex items-center gap-6 flex-wrap"
          style={{ borderTop: `1px solid ${T.border}`, background: T.surface }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: T.muted }}>
            Legend:
          </span>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-sm"
              style={{ background: "oklch(0.80 0.16 86 / 0.25)", border: `1px solid ${T.gold}88` }} />
            <span style={{ color: T.muted }}>Best value</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-sm"
              style={{ background: "oklch(0.54 0.20 27 / 0.14)", border: `1px solid ${T.red}66` }} />
            <span style={{ color: T.muted }}>Lowest value</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span style={{ color: T.muted }}>– = data not available</span>
          </div>
          {mode === "naac" && (
            <div className="flex items-center gap-2 text-xs ml-auto">
              <Award className="w-3.5 h-3.5" style={{ color: T.indigo }} />
              <span style={{ color: T.muted }}>Criteria on 0–4 CGPA scale</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}