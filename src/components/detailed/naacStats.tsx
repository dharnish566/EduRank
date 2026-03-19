/* ─────────────────────────────────────────────────────────────────────────────
   naacStats.tsx  –  NAAC Accreditation tab panel
   Usage in CollegeDetailsPage:
     import { NaacTab } from "../components/detailed/naacStats";
     {activeTab === "naac" && (
       <motion.div key="naac" variants={panelV} initial="hidden" animate="visible" exit="exit">
         <NaacTab collegeId={collegeId} />
       </motion.div>
     )}
   ───────────────────────────────────────────────────────────────────────────── */

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell,
} from "recharts";
import {
  Award, TrendingUp, TrendingDown, Hash, ChevronDown,
  BookOpen, FlaskConical, Users, LayoutGrid, Star,
  Lightbulb, Shield, CheckCircle2, AlertCircle, Info,
  GraduationCap, Building2, HeartHandshake,
} from "lucide-react";

/* ─── Font injection ──────────────────────────────── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    .naac-root * { box-sizing: border-box; }
    .naac-root { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
    .naac-root ::-webkit-scrollbar { width: 5px; height: 5px; }
    .naac-root ::-webkit-scrollbar-track { background: #F1F5F9; }
    .naac-root ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }
  `}</style>
);

/* ─── Design tokens ───────────────────────────────── */
const C = {
  navy:       "#1E3A8A",
  blue:       "#2563EB",
  blueLight:  "#3B82F6",
  bluePale:   "#EFF6FF",
  blueMid:    "#BFDBFE",
  slate:      "#475569",
  slateLight: "#94A3B8",
  border:     "#E2E8F0",
  surface:    "#F8FAFC",
  white:      "#FFFFFF",
  green:      "#059669",
  greenPale:  "#ECFDF5",
  amber:      "#D97706",
  red:        "#DC2626",
  text:       "#0F172A",
  muted:      "#64748B",
} as const;

/* ─── API shape — exported so CollegeDetailsPage can type its fetch state ── */
export interface RawIndicator {
  indicatorNumber:     number;
  indicatorName:       string;
  weightage:           string;
  weightedGradePoints: string;
}

export interface RawCriterion {
  criterionId:   number;          // present in real API response
  criterionNo:   number;
  criterionName: string;
  criterionCGPA: string;
  indicators:    RawIndicator[];
}

/** Full shape returned by GET /api/colleges/:id/naac */
export interface NaacApiResponse {
  naacGrade:           string;
  naacOverallScore:    string;
  collegeOverallScore: number;
  nirfRank:            number | null;
  criteria:            RawCriterion[];
}

/** Alias kept for any existing imports of NaacResponse */
export type NaacResponse = NaacApiResponse;

/* ─── Transformed shape ───────────────────────────── */
interface Indicator {
  indicatorNumber:    number;
  indicatorName:      string;
  weightage:          number;
  weightedGradePoints: number;
  shortName:          string;
}
interface Criterion {
  criterionNo:   number;
  criterionName: string;
  criterionCGPA: number;
  shortName:     string;
  icon:          React.ElementType;
  indicators:    Indicator[];
}

const CRITERION_ICONS: React.ElementType[] = [
  BookOpen, GraduationCap, FlaskConical, Building2, Users, Shield, HeartHandshake,
];

/* ─────────────────────────────────────────────────────────────────────────────
   FIX 6: Guard empty array before reduce — return early null set if no data
   FIX 3: Accept raw[] as parameter (previously RAW_DATA constant was used)
   ───────────────────────────────────────────────────────────────────────────── */
function useNaacData(raw: RawCriterion[]) {
  return useMemo(() => {
    /* Guard: return safe nulls while fetch is pending */
    if (!raw || raw.length === 0) return null;

    const criteria: Criterion[] = raw.map((c, idx) => ({
      ...c,
      criterionCGPA: parseFloat(c.criterionCGPA),
      shortName:     `C${c.criterionNo}`,
      icon:          CRITERION_ICONS[idx] ?? Star,
      indicators:    c.indicators.map((ind) => ({
        ...ind,
        weightage:          parseFloat(ind.weightage),
        weightedGradePoints: parseFloat(ind.weightedGradePoints),
        shortName:          `${c.criterionNo}.${ind.indicatorNumber}`,
        /* Sanitize newlines from API strings */
        indicatorName:      ind.indicatorName.replace(/\r\n|\n/g, " ").trim(),
      })),
      /* Sanitize newlines in criterion names too */
      criterionName: c.criterionName.replace(/\r\n|\n/g, " ").trim(),
    }));

    const overallCGPA = (
      criteria.reduce((s, c) => s + c.criterionCGPA, 0) / criteria.length
    ).toFixed(2);

    const best  = criteria.reduce((a, b) => a.criterionCGPA > b.criterionCGPA ? a : b);
    const worst = criteria.reduce((a, b) => a.criterionCGPA < b.criterionCGPA ? a : b);
    const totalIndicators = criteria.reduce((s, c) => s + c.indicators.length, 0);

    const radarData = criteria.map((c) => ({
      subject:  c.shortName,
      fullName: c.criterionName,
      value:    c.criterionCGPA,
    }));

    const barData = criteria.map((c) => ({
      name:     c.shortName,
      fullName: c.criterionName,
      cgpa:     c.criterionCGPA,
    }));

    const scatterData = criteria.flatMap((c) =>
      c.indicators.map((ind) => ({
        x:           ind.weightage,
        y:           ind.weightedGradePoints,
        z:           120,
        name:        ind.indicatorName,
        criterion:   c.criterionName,
        criterionNo: c.criterionNo,
      }))
    );

    return { criteria, overallCGPA, best, worst, totalIndicators, radarData, barData, scatterData };
  }, [raw]);
}

/* ─── Performance Badge ───────────────────────────── */
function PerfBadge({ cgpa }: { cgpa: number }) {
  if (cgpa >= 3.5)
    return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#ECFDF5", color: "#059669" }}><CheckCircle2 size={11} /> Excellent</span>;
  if (cgpa >= 3.0)
    return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#EFF6FF", color: "#2563EB" }}><Info size={11} /> Good</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#FEF2F2", color: "#DC2626" }}><AlertCircle size={11} /> Needs Improvement</span>;
}

/* ─── Chart Tooltips ──────────────────────────────── */
function ChartTip({ active, payload, label }: {
  active?: boolean;
  payload?: { color?: string; value: number | string; payload?: { fullName?: string; name?: string } }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.10)", minWidth: 160 }}>
      <p style={{ fontSize: 11, color: "#64748B", marginBottom: 6, fontWeight: 600 }}>
        {payload[0]?.payload?.fullName ?? payload[0]?.payload?.name ?? label}
      </p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color ?? C.blue, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "#0F172A", fontWeight: 700 }}>
            {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function ScatterTip({ active, payload }: {
  active?: boolean;
  payload?: { payload: { name: string; criterion: string; x: number; y: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.10)", maxWidth: 220 }}>
      <p style={{ fontSize: 11, color: "#64748B", marginBottom: 4, fontWeight: 600, lineHeight: 1.4 }}>{d.name}</p>
      <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 8 }}>{d.criterion}</p>
      <div style={{ display: "flex", gap: 16 }}>
        <div><p style={{ fontSize: 10, color: "#94A3B8" }}>Weightage</p><p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{d.x}</p></div>
        <div><p style={{ fontSize: 10, color: "#94A3B8" }}>WGP</p><p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{d.y}</p></div>
      </div>
    </div>
  );
}

/* ─── KPI Cards ───────────────────────────────────── */
function KPISection({ overallCGPA, best, worst, totalIndicators }: {
  overallCGPA: string;
  best: Criterion;
  worst: Criterion;
  totalIndicators: number;
}) {
  const cards = [
    { icon: Award,         label: "Overall CGPA",    value: overallCGPA,                                    sub: "Weighted average across all criteria", color: C.navy,  bg: C.bluePale },
    { icon: TrendingUp,    label: "Best Criterion",   value: `C${best.criterionNo}: ${best.criterionCGPA.toFixed(2)}`,   sub: best.criterionName,  color: C.green, bg: "#ECFDF5" },
    { icon: TrendingDown,  label: "Needs Focus",      value: `C${worst.criterionNo}: ${worst.criterionCGPA.toFixed(2)}`, sub: worst.criterionName, color: C.red,   bg: "#FEF2F2" },
    { icon: Hash,          label: "Total Indicators", value: String(totalIndicators),                        sub: `Across ${7} criteria`,               color: C.blue,  bg: "#F0F9FF" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(30,58,138,0.12)" }}
          style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 22px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", cursor: "default" }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 10, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <card.icon size={18} color={card.color} />
          </div>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{card.label}</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: card.color, marginBottom: 4, lineHeight: 1.1 }}>{card.value}</p>
          <p style={{ fontSize: 11, color: C.slateLight, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Radar Chart ─────────────────────────────────── */
function RadarChartComponent({ radarData }: { radarData: { subject: string; fullName: string; value: number }[] }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
      style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 3 }}>Performance Radar</p>
      <p style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>CGPA across all NAAC criteria</p>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 700, fill: C.navy }} />
          <PolarRadiusAxis angle={90} domain={[0, 4]} tick={{ fontSize: 9, fill: C.slateLight }} tickCount={5} axisLine={false} />
          <Radar name="CGPA" dataKey="value" stroke={C.blue} fill={C.blueLight} fillOpacity={0.18} strokeWidth={2.5} dot={{ fill: C.navy, r: 4, strokeWidth: 0 }} />
          <Tooltip content={<ChartTip />} />
        </RadarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 12 }}>
        {radarData.map((d, i) => (
          <span key={i} style={{ fontSize: 10, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontWeight: 700, color: C.navy }}>{d.subject}</span>
            {d.fullName.length > 22 ? d.fullName.slice(0, 22) + "…" : d.fullName}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Bar Chart ───────────────────────────────────── */
function BarChartComponent({ barData }: { barData: { name: string; fullName: string; cgpa: number }[] }) {
  const getBarColor = (val: number) => val >= 3.5 ? C.navy : val >= 3.0 ? C.blue : C.blueLight;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
      style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 3 }}>Criteria CGPA Comparison</p>
      <p style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Darker = higher performance</p>
      <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
        {[{ color: C.navy, label: "Excellent (≥3.5)" }, { color: C.blue, label: "Good (≥3.0)" }, { color: C.blueLight, label: "Needs Focus" }].map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: l.color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: C.muted }}>{l.label}</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={barData} margin={{ top: 4, right: 8, left: -18, bottom: 4 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700, fill: C.navy }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 4]} tick={{ fontSize: 11, fill: C.slateLight }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTip />} cursor={{ fill: "#F8FAFC" }} />
          <Bar dataKey="cgpa" radius={[6, 6, 0, 0]} maxBarSize={52}>
            {barData.map((entry, i) => <Cell key={i} fill={getBarColor(entry.cgpa)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <span style={{ fontSize: 10, color: C.slateLight, whiteSpace: "nowrap" }}>Max CGPA = 4.00</span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>
    </motion.div>
  );
}

/* ─── Indicator mini chart ────────────────────────── */
function IndicatorChart({ indicators }: { indicators: Indicator[] }) {
  const data = indicators.map((ind) => ({ name: ind.shortName, fullName: ind.indicatorName, wgp: ind.weightedGradePoints }));
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Weighted Grade Points</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 2, right: 8, left: -22, bottom: 2 }} barCategoryGap="28%">
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600, fill: C.navy }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: C.slateLight }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTip />} cursor={{ fill: "#F8FAFC" }} />
          <Bar dataKey="wgp" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? C.blue : C.blueLight} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Indicator table ─────────────────────────────── */
function IndicatorTable({ indicators }: { indicators: Indicator[] }) {
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: C.surface }}>
            {["#", "Indicator", "Weightage", "WGP"].map((h, i) => (
              <th key={h} style={{ padding: "10px 14px", textAlign: i > 1 ? "right" : "left", fontWeight: 600, color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {indicators.map((ind, i) => (
            <tr key={i} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? "#fff" : C.surface }}>
              <td style={{ padding: "10px 14px", color: C.navy, fontWeight: 700, fontSize: 11 }}>{ind.shortName}</td>
              <td style={{ padding: "10px 14px", color: C.text, lineHeight: 1.5 }}>{ind.indicatorName}</td>
              <td style={{ padding: "10px 14px", textAlign: "right" }}>
                <span style={{ background: C.bluePale, color: C.blue, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{ind.weightage}</span>
              </td>
              <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: C.navy }}>{ind.weightedGradePoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Criteria Accordion ──────────────────────────── */
function CriteriaAccordion({ criteria }: { criteria: Criterion[] }) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
      style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
      <div style={{ padding: "22px 28px", borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 3 }}>Criteria Detail</p>
        <p style={{ fontSize: 12, color: C.muted }}>Expand each criterion to view indicator breakdown</p>
      </div>

      {criteria.map((c, idx) => {
        const isOpen = openId === c.criterionNo;
        const Icon = c.icon;
        return (
          <div key={c.criterionNo} style={{ borderBottom: idx < criteria.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <button
              onClick={() => setOpenId(isOpen ? null : c.criterionNo)}
              style={{ width: "100%", textAlign: "left", padding: "18px 28px", display: "flex", alignItems: "center", gap: 14, background: isOpen ? C.bluePale : "transparent", border: "none", cursor: "pointer", transition: "background 0.18s" }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: isOpen ? "#DBEAFE" : C.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={16} color={isOpen ? C.navy : C.muted} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: C.navy }}>C{c.criterionNo}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.criterionName}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: C.muted }}>{c.indicators.length} indicators</span>
                  <PerfBadge cgpa={c.criterionCGPA} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{c.criterionCGPA.toFixed(2)}</p>
                  <p style={{ fontSize: 10, color: C.muted }}>/ 4.00</p>
                </div>
                {/* Progress ring */}
                <svg width="38" height="38" viewBox="0 0 38 38" style={{ flexShrink: 0 }}>
                  <circle cx="19" cy="19" r="15" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                  <circle cx="19" cy="19" r="15" fill="none" stroke={C.blue} strokeWidth="3.5"
                    strokeDasharray={`${(c.criterionCGPA / 4) * 94.2} 94.2`}
                    strokeLinecap="round" transform="rotate(-90 19 19)" />
                </svg>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22 }}>
                  <ChevronDown size={16} color={C.muted} />
                </motion.div>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ padding: "20px 28px 24px", background: "#FAFBFF", borderTop: `1px solid ${C.border}` }}>
                    <IndicatorChart indicators={c.indicators} />
                    <IndicatorTable indicators={c.indicators} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.div>
  );
}

/* ─── Scatter Plot ────────────────────────────────── */
/* FIX 9: removed RAW_DATA.map() in legend — now derives legend from criteria prop */
const CRITERION_COLORS = ["#1E3A8A","#2563EB","#7C3AED","#0891B2","#059669","#D97706","#DC2626"];

function ScatterPlotComponent({ scatterData, criteria }: {
  scatterData: { x: number; y: number; z: number; name: string; criterion: string; criterionNo: number }[];
  criteria: Criterion[];
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
      style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 3 }}>Weightage vs Performance</p>
      <p style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Each dot = one indicator. Top-right = high importance AND high performance.</p>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="x" name="Weightage" type="number" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false}
            label={{ value: "Weightage", position: "insideBottom", offset: -10, fontSize: 11, fill: C.muted }} />
          <YAxis dataKey="y" name="WGP" type="number" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false}
            label={{ value: "Weighted Grade Points", angle: -90, position: "insideLeft", offset: 14, fontSize: 11, fill: C.muted }} />
          <ZAxis dataKey="z" range={[60, 60]} />
          <Tooltip content={<ScatterTip />} cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={scatterData}>
            {scatterData.map((entry, i) => (
              <Cell key={i} fill={CRITERION_COLORS[(entry.criterionNo - 1) % CRITERION_COLORS.length]} fillOpacity={0.82} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      {/* FIX 9: legend now comes from criteria (live data), not the deleted RAW_DATA const */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", marginTop: 10 }}>
        {criteria.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: CRITERION_COLORS[i % CRITERION_COLORS.length], flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: C.muted }}>C{c.criterionNo}: {c.criterionName.length > 18 ? c.criterionName.slice(0, 18) + "…" : c.criterionName}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Insights ────────────────────────────────────── */
function Insights({ criteria, overallCGPA }: { criteria: Criterion[]; overallCGPA: string }) {
  const insights = useMemo(() => {
    const sorted = [...criteria].sort((a, b) => b.criterionCGPA - a.criterionCGPA);
    const top    = sorted[0];
    const bottom = sorted[sorted.length - 1];
    const cgpaNum = parseFloat(overallCGPA);
    const grade  = cgpaNum >= 3.75 ? "A++" : cgpaNum >= 3.5 ? "A+" : cgpaNum >= 3.25 ? "A" : "B++";

    const list: { type: "info" | "success" | "warning"; text: string }[] = [
      { type: "info",    text: `Overall CGPA of ${overallCGPA} projects a NAAC grade of ${grade}.` },
      { type: "success", text: `${top.criterionName} leads with ${top.criterionCGPA.toFixed(2)} CGPA — excellent performance.` },
      { type: "warning", text: `${bottom.criterionName} needs focus (CGPA: ${bottom.criterionCGPA.toFixed(2)}).` },
    ];

    const belowExcellent = criteria.filter((c) => c.criterionCGPA < 3.5 && c.criterionCGPA >= 3.0);
    if (belowExcellent.length)
      list.push({ type: "info", text: `${belowExcellent.map((c) => `C${c.criterionNo}`).join(", ")} are Good but can reach Excellent with improvement.` });

    criteria.forEach((c) => {
      c.indicators.forEach((ind) => {
        if (ind.weightage >= 40 && ind.weightedGradePoints / ind.weightage < 3.5)
          list.push({ type: "warning", text: `"${ind.indicatorName}" — high weightage (${ind.weightage}) but moderate WGP (${ind.weightedGradePoints}). Priority area.` });
      });
    });

    criteria.forEach((c) => {
      c.indicators.forEach((ind) => {
        if (ind.weightedGradePoints >= 180)
          list.push({ type: "success", text: `"${ind.indicatorName}" scores ${ind.weightedGradePoints} WGP — a top-performing indicator.` });
      });
    });

    return list.slice(0, 7);
  }, [criteria, overallCGPA]);

  const S = {
    success: { icon: CheckCircle2, bg: "#ECFDF5", border: "#A7F3D0", iconColor: "#059669", textColor: "#064E3B" },
    warning: { icon: AlertCircle,  bg: "#FFFBEB", border: "#FCD34D", iconColor: "#D97706", textColor: "#78350F" },
    info:    { icon: Info,         bg: "#EFF6FF", border: "#93C5FD", iconColor: "#2563EB", textColor: "#1E3A8A" },
  } as const;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
      style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEF9C3", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lightbulb size={17} color="#CA8A04" />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Smart Insights</p>
          <p style={{ fontSize: 12, color: C.muted }}>Auto-generated from performance data</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {insights.map((ins, i) => {
          const s = S[ins.type];
          const Icon = s.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 + i * 0.07, duration: 0.32 }}
              style={{ display: "flex", gap: 10, padding: "12px 14px", borderRadius: 10, background: s.bg, border: `1px solid ${s.border}` }}>
              <Icon size={15} color={s.iconColor} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: s.textColor, lineHeight: 1.6 }}>{ins.text}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── CGPA Progress Strip ─────────────────────────── */
function CriteriaProgressStrip({ criteria }: { criteria: Criterion[] }) {
  const barColor = (cgpa: number) => cgpa >= 3.5 ? C.navy : cgpa >= 3.0 ? C.blue : C.blueLight;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
      style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>CGPA Progress</p>
      <p style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Out of 4.00 maximum</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {criteria.map((c, i) => {
          const Icon = c.icon;
          const color = barColor(c.criterionCGPA);
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon size={13} color={C.muted} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>
                    C{c.criterionNo}: {c.criterionName.length > 32 ? c.criterionName.slice(0, 32) + "…" : c.criterionName}
                  </span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color, marginLeft: 8, flexShrink: 0 }}>{c.criterionCGPA.toFixed(2)}</span>
              </div>
              <div style={{ height: 7, borderRadius: 99, background: C.surface, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(c.criterionCGPA / 4) * 100}%` }}
                  transition={{ duration: 0.9, delay: 0.4 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: "100%", borderRadius: 99, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NaacTab — fetches its own data, CollegeDetailsPage only passes
   collegeId.  Usage:
     <NaacTab collegeId={collegeId} />
═══════════════════════════════════════════════════════════════ */
export function NaacTab({ collegeId }: { collegeId: number }) {
  const [rawData,  setRawData]  = useState<NaacResponse | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  /* Stable fetch function — also used as onRetry */
  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:5000/api/colleges/${collegeId}/naac`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} — ${r.statusText}`);
        return r.json() as Promise<NaacResponse>;
      })
      .then((json) => { setRawData(json); setLoading(false); })
      .catch((e: Error) => { setError(e.message); setLoading(false); });
  }, [collegeId]);

  /* Fetch once on mount; re-fetch if collegeId changes */
  useEffect(() => { fetchData(); }, [fetchData]);

  /* Transform the criteria array — null-safe via guard inside hook */
  const derived = useNaacData(rawData?.criteria ?? []);

  return (
    <>
      <FontLink />
      <div className="naac-root" style={{ background: "#F8FAFC", minHeight: "60vh" }}>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div
              className="animate-spin rounded-full"
              style={{ width: 32, height: 32, border: `3px solid ${C.border}`, borderTopColor: C.blue }}
            />
            <p style={{ fontSize: 13, color: C.muted }}>Loading NAAC data…</p>
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertCircle size={22} color={C.red} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.red }}>Failed to load NAAC data</p>
            <p style={{ fontSize: 12, color: C.muted }}>{error}</p>
            <button
              onClick={fetchData}
              style={{ background: C.navy, color: "#fff", border: "none", borderRadius: 10, padding: "8px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Content — renders only when derived (transformed data) is ready ── */}
        {!loading && !error && derived && (() => {
          const { criteria, overallCGPA, best, worst, totalIndicators, radarData, barData, scatterData } = derived;
          return (
            <div>
              {/* Summary header strip */}
              <div style={{ background: C.navy, borderRadius: 16, padding: "20px 28px", marginBottom: 28, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Award size={20} color="#93C5FD" />
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>NAAC Accreditation</p>
                    <p style={{ fontSize: 11, color: "#93C5FD", marginTop: 2 }}>Performance Analytics</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { label: "Overall CGPA", value: overallCGPA },
                    { label: "Criteria",     value: String(criteria.length) },
                    { label: "Indicators",   value: String(totalIndicators) },
                  ].map((s, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, padding: "8px 16px", textAlign: "center" }}>
                      <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{s.value}</p>
                      <p style={{ fontSize: 10, color: "#93C5FD", marginTop: 2 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPI row */}
              <KPISection overallCGPA={overallCGPA} best={best} worst={worst} totalIndicators={totalIndicators} />

              {/* Radar + Bar */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                <RadarChartComponent radarData={radarData} />
                <BarChartComponent   barData={barData} />
              </div>

              {/* Progress + Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                <CriteriaProgressStrip criteria={criteria} />
                <Insights criteria={criteria} overallCGPA={overallCGPA} />
              </div>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "28px 0 16px" }}>
                <div style={{ flex: 1, height: 1, background: C.border }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>Detailed Criteria Breakdown</span>
                <div style={{ flex: 1, height: 1, background: C.border }} />
              </div>

              {/* Accordion */}
              <div style={{ marginBottom: 20 }}>
                <CriteriaAccordion criteria={criteria} />
              </div>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "28px 0 16px" }}>
                <div style={{ flex: 1, height: 1, background: C.border }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>Advanced Analytics</span>
                <div style={{ flex: 1, height: 1, background: C.border }} />
              </div>

              {/* Scatter */}
              <ScatterPlotComponent scatterData={scatterData} criteria={criteria} />

              {/* Footer */}
              <div style={{ marginTop: 40, textAlign: "center", borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                <p style={{ fontSize: 11, color: C.slateLight }}>
                  NAAC Performance Analytics · Overall CGPA:{" "}
                  <span style={{ color: C.blue, fontWeight: 600 }}>{overallCGPA}</span>
                </p>
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
}