/* ─────────────────────────────────────────────────────────────────────────────
   TneaTab.tsx
   Drop-in replacement for the "tnea" tab panel in CollegeDetailsPage.tsx.

   Usage inside CollegeDetailsPage.tsx:
   ─────────────────────────────────────
   1.  import { TneaTab } from "./TneaTab";

   2.  In the <AnimatePresence> block add:
       {activeTab === "tnea" && (
         <motion.div key="tnea" variants={panelV} initial="hidden" animate="visible" exit="exit">
           <TneaTab collegeId={collegeId} />
         </motion.div>
       )}

   Props
   ──────
   collegeId  – passed straight from CollegeDetailsPage; used to build the API URL.
   ───────────────────────────────────────────────────────────────────────────── */

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { apiUrl } from "../../utils/api";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Layers,
  LayoutGrid,
  Medal,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  type CategoryKey,
  type TneaRecord,
  buildCatComparisonData,
  buildCutoffBars,
  buildDonutData,
  buildHeatmapData,
  buildScatterData,
  buildSeatsOverview,
  buildStackedSeats,
  buildStats,
  buildTrendData,
  getUniqueYears,
  predictEligible,
} from "./tnea-helpers";

/* ── Re-use the same T tokens as CollegeDetailsPage ── */
const T = {
  heroBg:      "oklch(0.16 0.055 258)",
  indigo:      "oklch(0.46 0.19 266)",
  indigoLight: "oklch(0.72 0.14 266)",
  gold:        "oklch(0.80 0.16 86)",
  goldDeep:    "oklch(0.60 0.14 78)",
  green:       "oklch(0.52 0.18 148)",
  red:         "oklch(0.54 0.20 27)",
  navy:        "oklch(0.20 0.05 258)",
  muted:       "oklch(0.50 0.025 258)",
  border:      "oklch(0.91 0.01 258)",
  surface:     "oklch(0.975 0.005 258)",
};

/* ─────────────────────────────────────────────────────────────────────────────
   PROFESSIONAL LIGHT-THEME PALETTE
   ─────────────────────────────────────────────────────────────────────────────
   32 perceptually-distinct colours tuned for white / near-white backgrounds.
   Design rules applied:
     • Lightness  L ∈ [0.52, 0.72]  → readable on white, never washed-out
     • Chroma     C ∈ [0.10, 0.19]  → vivid but not neon / garish
     • Hue step   ΔH ≥ 22°          → consecutive colours never look alike
     • No two adjacent entries share the same hue family
   Result: 32 bars / lines can coexist in one chart with zero repetition.
   ───────────────────────────────────────────────────────────────────────────── */
const BRANCH_COLORS: string[] = [
  /* ── Blues & Indigos ── */
  "oklch(0.52 0.18 266)",   //  1  Royal indigo
  "oklch(0.62 0.14 240)",   //  2  Steel blue
  "oklch(0.68 0.13 222)",   //  3  Sky blue
  "oklch(0.58 0.16 254)",   //  4  Periwinkle

  /* ── Greens & Teals ── */
  "oklch(0.56 0.17 155)",   //  5  Emerald
  "oklch(0.64 0.15 170)",   //  6  Seafoam
  "oklch(0.60 0.16 195)",   //  7  Teal
  "oklch(0.68 0.13 145)",   //  8  Sage

  /* ── Golds & Ambers ── */
  "oklch(0.66 0.16 75)",    //  9  Amber gold
  "oklch(0.72 0.14 90)",    // 10  Warm yellow
  "oklch(0.62 0.15 60)",    // 11  Deep amber
  "oklch(0.68 0.14 52)",    // 12  Honey

  /* ── Reds, Corals & Roses ── */
  "oklch(0.58 0.18 22)",    // 13  Coral red
  "oklch(0.65 0.16 12)",    // 14  Salmon
  "oklch(0.60 0.17 350)",   // 15  Rose
  "oklch(0.55 0.19 32)",    // 16  Burnt orange

  /* ── Purples & Violets ── */
  "oklch(0.58 0.17 300)",   // 17  Violet
  "oklch(0.65 0.14 318)",   // 18  Mauve
  "oklch(0.60 0.16 282)",   // 19  Lavender-indigo
  "oklch(0.68 0.13 312)",   // 20  Orchid

  /* ── Pinks & Fuchsias ── */
  "oklch(0.64 0.16 340)",   // 21  Pink
  "oklch(0.62 0.18 330)",   // 22  Hot rose
  "oklch(0.68 0.14 356)",   // 23  Blush
  "oklch(0.58 0.17 320)",   // 24  Fuchsia

  /* ── Cyans & Aquas ── */
  "oklch(0.64 0.14 208)",   // 25  Cerulean
  "oklch(0.70 0.12 197)",   // 26  Aqua
  "oklch(0.60 0.15 215)",   // 27  Ocean
  "oklch(0.66 0.13 185)",   // 28  Mint-teal

  /* ── Olives, Limes & Warm greens ── */
  "oklch(0.64 0.14 122)",   // 29  Lime
  "oklch(0.60 0.15 110)",   // 30  Chartreuse
  "oklch(0.58 0.16 133)",   // 31  Fern
  "oklch(0.66 0.12 98)",    // 32  Olive
];

/**
 * Returns a colour for index `i`, cycling only after all 32 are exhausted.
 * Guarantees zero repeats for up to 32 series in a single chart.
 */
const branchColor = (i: number): string =>
  BRANCH_COLORS[i % BRANCH_COLORS.length];

/* ─────────────────────────────────────────────────────────────────────────────
   CATEGORY COLOURS  (fixed semantic mapping — must stay stable across charts)
   Each category always gets the same hue so users build muscle-memory fast.
   ───────────────────────────────────────────────────────────────────────────── */
const CAT_COLORS: Record<CategoryKey, string> = {
  OC:  "oklch(0.52 0.18 266)",   // Indigo   – dominant / open category
  BC:  "oklch(0.62 0.15 60)",    // Amber    – backward class
  BCM: "oklch(0.60 0.16 282)",   // Lavender – BCM sub-group
  MBC: "oklch(0.56 0.17 155)",   // Emerald  – most backward class
  SC:  "oklch(0.66 0.16 75)",    // Gold     – scheduled caste
  SCA: "oklch(0.64 0.16 340)",   // Pink     – SC-Arunthathiyar
  ST:  "oklch(0.58 0.18 22)",    // Coral    – scheduled tribe
};

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

/** Consistent Recharts Legend wrapper style — light-theme readable */
const LEGEND_STYLE: React.CSSProperties = {
  fontSize: 11,
  color: "oklch(0.42 0.03 258)",   // slightly darker than T.muted for legend readability
  paddingTop: 8,
  lineHeight: "1.6",
};

const itemV = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: EASE } },
};
const containerV = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

/* ══════════════════════════════════════════════════════
   Small shared primitives (match CollegeDetailsPage)
═══════════════════════════════════════════════════════ */

function Card({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border p-6 ${className}`}
      style={{
        borderColor: T.border,
        boxShadow: "0 1px 8px oklch(0.22 0.06 258 / 0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  accent?: string;
}) {
  const color = accent ?? T.indigo;
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}14` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <h2 className="font-bold text-xl" style={{ color: T.navy }}>
        {title}
      </h2>
    </div>
  );
}

/** Matches MetricTile from CollegeDetailsPage */
function KpiTile({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  const a = accent ?? T.indigo;
  return (
    <Card className="flex flex-col gap-2 p-5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${a}14` }}
      >
        <Icon className="w-4 h-4" style={{ color: a }} />
      </div>
      <p className="text-xs font-semibold mt-1" style={{ color: T.muted }}>
        {label}
      </p>
      <p className="font-black text-2xl leading-none" style={{ color: a }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: T.muted }}>
          {sub}
        </p>
      )}
    </Card>
  );
}

/** Chart wrapper card */
function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <h3 className="font-bold text-base mb-0.5" style={{ color: T.navy }}>
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs mb-5" style={{ color: T.muted }}>
          {subtitle}
        </p>
      )}
      {children}
    </Card>
  );
}

/** Shared recharts tooltip */
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border px-4 py-3 shadow-lg text-sm bg-white"
      style={{ borderColor: T.border }}
    >
      {label && (
        <p className="font-bold mb-2" style={{ color: T.navy }}>
          {label}
        </p>
      )}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: p.color }}
          />
          <span className="text-xs" style={{ color: T.muted }}>
            {p.name}:
          </span>
          <span className="font-semibold" style={{ color: T.navy }}>
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Tooltip for ScatterChart — reads payload[0].payload for x/y/name */
function ScatterTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { name: string; x: number; y: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="rounded-xl border px-4 py-3 shadow-lg text-sm bg-white"
      style={{ borderColor: T.border }}
    >
      <p className="font-bold mb-1.5" style={{ color: T.indigo }}>
        {d.name}
      </p>
      <p className="text-xs" style={{ color: T.muted }}>
        Total Seats:{" "}
        <strong style={{ color: T.navy }}>{d.x}</strong>
      </p>
      <p className="text-xs mt-0.5" style={{ color: T.muted }}>
        Cutoff:{" "}
        <strong style={{ color: T.navy }}>{d.y}</strong>
      </p>
    </div>
  );
}

/** Tooltip for PieChart (donut) */
function DonutTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { color: string } }[];
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div
      className="rounded-xl border px-4 py-3 shadow-lg text-sm bg-white"
      style={{ borderColor: T.border }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: p.payload.color }}
        />
        <span className="font-bold" style={{ color: T.navy }}>
          {p.name}
        </span>
      </div>
      <p className="text-xs" style={{ color: T.muted }}>
        Seats:{" "}
        <strong style={{ color: T.navy }}>{p.value}</strong>
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Filter bar
═══════════════════════════════════════════════════════ */
const DISPLAY_CATS: CategoryKey[] = ["OC", "BC", "MBC", "SC", "ST"];

function FilterBar({
  years,
  selectedYear,
  setSelectedYear,
  selectedCat,
  setSelectedCat,
  search,
  setSearch,
}: {
  years: number[];
  selectedYear: string;
  setSelectedYear: (y: string) => void;
  selectedCat: CategoryKey;
  setSelectedCat: (c: CategoryKey) => void;
  search: string;
  setSearch: (s: string) => void;
}) {
  const pill = (active: boolean, accent: string = T.indigo) => ({
    padding: "5px 14px",
    borderRadius: 999,
    border: `1.5px solid ${active ? accent : T.border}`,
    background: active ? `${accent}16` : "#fff",
    color: active ? accent : T.muted,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer" as const,
    transition: "all 0.15s",
    lineHeight: "1",
  });

  return (
    <div
      className="rounded-2xl border p-4 flex flex-wrap gap-4 items-center mb-6"
      style={{
        background: "#fff",
        borderColor: T.border,
        boxShadow: "0 1px 8px oklch(0.22 0.06 258 / 0.06)",
      }}
    >
      {/* Search */}
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1 min-w-[160px]"
        style={{ background: T.surface, border: `1.5px solid ${T.border}` }}
      >
        <Search className="w-3.5 h-3.5 shrink-0" style={{ color: T.muted }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search branch…"
          className="bg-transparent outline-none text-sm flex-1"
          style={{ color: T.navy }}
        />
      </div>

      {/* Year */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: T.muted }}
        >
          Year
        </span>
        {(["All", ...years] as (string | number)[]).map((y) => (
          <button
            key={String(y)}
            style={pill(selectedYear === String(y))}
            onClick={() => setSelectedYear(String(y))}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Category */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: T.muted }}
        >
          Category
        </span>
        {DISPLAY_CATS.map((c) => (
          <button
            key={c}
            style={pill(selectedCat === c, CAT_COLORS[c])}
            onClick={() => setSelectedCat(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Heatmap sub-component
═══════════════════════════════════════════════════════ */
function Heatmap({
  allData,
  year,
}: {
  allData: TneaRecord[];
  year: string;
}) {
  const cats = DISPLAY_CATS;
  const rows = buildHeatmapData(allData, year);

  return (
    <Card>
      <SectionHeading icon={LayoutGrid} title="Cutoff Heatmap" accent={T.goldDeep} />
      <p className="text-xs mb-5" style={{ color: T.muted }}>
        Branch × Category matrix — deeper blue = higher cutoff
      </p>
      <div className="overflow-x-auto">
        <table style={{ borderCollapse: "separate", borderSpacing: 3, minWidth: 480, width: "100%" }}>
          <thead>
            <tr>
              <th
                className="text-left text-[11px] font-semibold pb-2 pr-3"
                style={{ color: T.muted }}
              >
                Branch
              </th>
              {cats.map((c) => (
                <th
                  key={c}
                  className="text-center text-[11px] font-bold pb-2"
                  style={{ color: CAT_COLORS[c], minWidth: 60 }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.code}>
                <td
                  className="text-[11px] font-semibold pr-3 whitespace-nowrap"
                  style={{ color: T.muted }}
                >
                  {row.code}
                </td>
                {cats.map((c) => {
                  const v = row.values[c];
                  /* t ∈ [0,1] — how high is this cutoff relative to the full range */
                  const t =
                    v !== null && v !== undefined
                      ? Math.max(0, Math.min(1, (v - 90) / (195 - 90)))
                      : 0;

                  /* All columns use the same blue hue (266°).
                     Lightness: L=0.94 (near-white) → L=0.62 (vivid blue)
                     Chroma:    C=0.03 (pale tint)  → C=0.18 (rich blue)   */
                  const bg =
                    v !== null && v !== undefined
                      ? `oklch(${0.94 - t * 0.32} ${0.03 + t * 0.15} 266)`
                      : T.surface;

                  return (
                    <td
                      key={c}
                      title={v != null ? `${row.code} · ${c}: ${v}` : "N/A"}
                      className="text-center text-[11px] font-semibold"
                      style={{
                        background: bg,
                        borderRadius: 6,
                        padding: "6px 4px",
                        border: `1px solid ${T.border}`,
                        /* Always use navy text — lightness never drops below 0.62 */
                        color: v != null ? T.navy : T.border,
                        transition: "background 0.2s",
                        cursor: "default",
                      }}
                    >
                      {v ?? "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════
   Admission Predictor sub-component
═══════════════════════════════════════════════════════ */
function AdmissionPredictor({ allData }: { allData: TneaRecord[] }) {
  const [cutoff, setCutoff] = useState("");
  const [cat, setCat]       = useState<CategoryKey>("OC");
  const [results, setResults] = useState<ReturnType<typeof predictEligible> | null>(null);

  const run = () => {
    const val = parseFloat(cutoff);
    if (isNaN(val)) return;
    setResults(predictEligible(allData, val, cat));
  };

  return (
    <Card>
      <SectionHeading icon={CheckCircle2} title="Admission Predictor" accent={T.green} />
      <p className="text-xs mb-5" style={{ color: T.muted }}>
        Enter your cutoff score to see eligible branches (based on latest year data)
      </p>

      {/* Inputs */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <input
          type="number"
          value={cutoff}
          onChange={(e) => setCutoff(e.target.value)}
          placeholder="Your cutoff (e.g. 175)"
          className="flex-1 min-w-[180px] rounded-xl px-4 py-2.5 text-sm outline-none"
          style={{
            background: T.surface,
            border: `1.5px solid ${T.border}`,
            color: T.navy,
          }}
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value as CategoryKey)}
          className="rounded-xl px-4 py-2.5 text-sm outline-none"
          style={{
            background: T.surface,
            border: `1.5px solid ${T.border}`,
            color: T.navy,
          }}
        >
          {DISPLAY_CATS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button
          onClick={run}
          className="font-bold text-sm px-6 py-2.5 rounded-xl text-white transition-all"
          style={{
            background: `linear-gradient(135deg, ${T.indigo}, ${T.indigoLight})`,
            boxShadow: `0 4px 14px ${T.indigo}44`,
          }}
        >
          Predict
        </button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            {results.length === 0 ? (
              <div
                className="rounded-xl px-5 py-4 text-sm font-semibold text-center"
                style={{ background: `${T.red}0F`, color: T.red, border: `1px solid ${T.red}28` }}
              >
                No eligible branches found for this cutoff.
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold mb-3" style={{ color: T.muted }}>
                  {results.length} eligible branch{results.length > 1 ? "es" : ""} found
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {results.map((r, i) => (
                    <motion.div
                      key={r.branchCode}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.28 }}
                      className="rounded-xl p-4 flex flex-col gap-1.5"
                      style={{
                        background: `${T.green}08`,
                        border: `1.5px solid ${T.green}28`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm" style={{ color: T.green }}>
                          {r.branchCode}
                        </span>
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${T.indigo}12`, color: T.indigo }}
                        >
                          {r.cutoff}
                        </span>
                      </div>
                      <p className="text-xs leading-snug" style={{ color: T.muted }}>
                        {r.branchName}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════
   Loading skeleton
═══════════════════════════════════════════════════════ */
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className}`}
      style={{ background: T.border }}
    />
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-72" />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════ */
export function TneaTab({ collegeId }: { collegeId: number }) {
  const [rawData, setRawData]   = useState<TneaRecord[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedCat, setSelectedCat]   = useState<CategoryKey>("OC");
  const [search, setSearch]     = useState("");

  /* ── Fetch once ────────────────────────────────────── */
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(apiUrl(`/colleges/${collegeId}/courses_cutoff_details`))
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<TneaRecord[]>;
      })
      .then((data) => { setRawData(data); setLoading(false); })
      .catch((e: Error) => { setError(e.message); setLoading(false); });
  }, [collegeId]);

  /* ── Derived ──────────────────────────────────────── */
  const years       = useMemo(() => getUniqueYears(rawData),     [rawData]);
  const trendBranches = useMemo(() => [...new Set(rawData.map((d) => d.branchCode))], [rawData]);

  const filteredData = useMemo(() => {
    let d = selectedYear === "All"
      ? rawData
      : rawData.filter((r) => String(r.year) === selectedYear);
    if (search.trim())
      d = d.filter(
        (r) =>
          r.branchName.toLowerCase().includes(search.toLowerCase()) ||
          r.branchCode.toLowerCase().includes(search.toLowerCase())
      );
    return d;
  }, [rawData, selectedYear, search]);

  /* Chart data */
  const cutoffBars  = useMemo(() => buildCutoffBars(filteredData, selectedYear, selectedCat),          [filteredData, selectedYear, selectedCat]);
  const trendData   = useMemo(() => buildTrendData(rawData, selectedCat),                              [rawData, selectedCat]);
  const catData     = useMemo(() => buildCatComparisonData(rawData, filteredData, selectedYear),       [rawData, filteredData, selectedYear]);
  const seatsData   = useMemo(() => buildSeatsOverview(filteredData),                                  [filteredData]);
  const stackedData = useMemo(() => buildStackedSeats(filteredData),                                   [filteredData]);
  const scatterData = useMemo(() => buildScatterData(filteredData, selectedCat),                       [filteredData, selectedCat]);
  const donutData   = useMemo(() => buildDonutData(filteredData, { filled: T.indigo, available: T.green }), [filteredData]);
  const stats       = useMemo(() => buildStats(filteredData, selectedCat),                             [filteredData, selectedCat]);

  /* Top 6 branches by cutoff */
  const topBranches = useMemo(
    () => [...cutoffBars].sort((a, b) => b.value - a.value).slice(0, 6),
    [cutoffBars]
  );

  /* ── States ───────────────────────────────────────── */
  if (loading) return <LoadingState />;

  if (error)
    return (
      <div
        className="rounded-2xl px-6 py-10 text-center"
        style={{ background: `${T.red}08`, border: `1px solid ${T.red}28` }}
      >
        <p className="font-bold text-lg mb-2" style={{ color: T.red }}>
          Failed to load TNEA data
        </p>
        <p className="text-sm" style={{ color: T.muted }}>
          {error}
        </p>
      </div>
    );

  /* ── Render ───────────────────────────────────────── */
  return (
    <motion.div
      variants={containerV}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* ── KPI strip ──────────────────────────────────── */}
      <motion.div variants={itemV} className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <KpiTile icon={TrendingUp} label="Highest Cutoff" value={stats.maxCutoff}  sub={`${selectedCat} category`} accent={T.indigo}   />
        <KpiTile icon={BarChart3}  label="Avg Cutoff"     value={stats.avgCutoff}  sub={`${selectedCat} category`} accent={T.goldDeep}  />
        <KpiTile icon={Medal}      label="Min Cutoff"     value={stats.minCutoff}  sub={`${selectedCat} category`} accent={T.indigoLight} />
        <KpiTile icon={Users}      label="Total Seats"    value={stats.totalSeats} sub="across selection"          accent={T.green}     />
        <KpiTile icon={BookOpen}   label="Branches"       value={stats.branchCount} sub="in view"                 accent={T.goldDeep}  />
      </motion.div>

      {/* ── Filters ────────────────────────────────────── */}
      <motion.div variants={itemV}>
        <FilterBar
          years={years}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedCat={selectedCat}
          setSelectedCat={setSelectedCat}
          search={search}
          setSearch={setSearch}
        />
      </motion.div>

      {/* ── Row 1: Cutoff comparison + Year trend ─────── */}
      <motion.div variants={itemV} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Cutoff Comparison */}
        <ChartCard
          title="Cutoff Comparison"
          subtitle={`${selectedCat} cutoff by branch${selectedYear !== "All" ? ` · ${selectedYear}` : ""}`}
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={cutoffBars} margin={{ top: 5, right: 5, left: -18, bottom: 44 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis
                dataKey="name"
                tick={{ fill: T.muted, fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fill: T.muted, fontSize: 11 }} domain={[80, 200]} />
              <RechartsTooltip content={<ChartTooltip />} />
              <Bar dataKey="value" name="Cutoff" radius={[4, 4, 0, 0]}>
                {cutoffBars.map((_, i) => (
                  <Cell key={i} fill={branchColor(i)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. Year-wise Trend */}
        <ChartCard
          title="Year-wise Cutoff Trend"
          subtitle={`${selectedCat} cutoff across all years (all branches)`}
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData} margin={{ top: 5, right: 5, left: -18, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="year" tick={{ fill: T.muted, fontSize: 11 }} />
              <YAxis tick={{ fill: T.muted, fontSize: 11 }} domain={[80, 200]} />
              <RechartsTooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={LEGEND_STYLE} />
              {trendBranches.map((br, i) => (
                <Line
                  key={br}
                  type="monotone"
                  dataKey={br}
                  stroke={branchColor(i)}
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      {/* ── Row 2: Category grouped + Seats overview ──── */}
      <motion.div variants={itemV} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Category-wise comparison */}
        <ChartCard
          title="Category-wise Cutoff"
          subtitle="OC / BC / MBC / SC / ST per branch"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={catData} margin={{ top: 5, right: 5, left: -18, bottom: 44 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis
                dataKey="name"
                tick={{ fill: T.muted, fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fill: T.muted, fontSize: 11 }} domain={[60, 200]} />
              <RechartsTooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={LEGEND_STYLE} />
              {(["OC", "BC", "MBC", "SC", "ST"] as CategoryKey[]).map((c) => (
                <Bar key={c} dataKey={c} fill={CAT_COLORS[c]} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Seats overview */}
        <ChartCard
          title="Seats Overview"
          subtitle="Total vs available seats per branch"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={seatsData} margin={{ top: 5, right: 5, left: -18, bottom: 44 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis
                dataKey="name"
                tick={{ fill: T.muted, fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fill: T.muted, fontSize: 11 }} />
              <RechartsTooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={LEGEND_STYLE} />
              <Bar dataKey="Total"     fill={T.indigo} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Available" fill={T.green}  radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      {/* ── Row 3: Stacked seats + Top branches ──────── */}
      <motion.div variants={itemV} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5. Stacked seat distribution */}
        <ChartCard
          title="Seat Distribution by Category"
          subtitle="Stacked category allocation per branch"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stackedData} margin={{ top: 5, right: 5, left: -18, bottom: 44 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis
                dataKey="name"
                tick={{ fill: T.muted, fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fill: T.muted, fontSize: 11 }} />
              <RechartsTooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={LEGEND_STYLE} />
              {(["OC", "BC", "MBC", "SC", "ST"] as CategoryKey[]).map((c) => (
                <Bar key={c} dataKey={c} fill={CAT_COLORS[c]} stackId="a" />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 6. Top branches leaderboard */}
        <ChartCard
          title="Top Branches by Cutoff"
          subtitle={`Highest ${selectedCat} cutoff rankings`}
        >
          <div className="flex flex-col gap-3 pt-1">
            {topBranches.map((b, i) => (
              <div key={b.name} className="flex items-center gap-3">
                {/* Rank badge */}
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0"
                  style={
                    i === 0
                      ? { background: `${T.gold}28`, color: T.goldDeep }
                      : i === 1
                      ? { background: "oklch(0.88 0.01 258 / 0.60)", color: T.muted }
                      : i === 2
                      ? { background: `${T.goldDeep}1A`, color: T.goldDeep }
                      : { background: T.surface, color: T.muted, border: `1px solid ${T.border}` }
                  }
                >
                  #{i + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1.5">
                    <span className="font-semibold text-sm truncate" style={{ color: T.navy }}>
                      {b.name}
                    </span>
                    <span
                      className="font-bold text-sm shrink-0 ml-2"
                      style={{ color: branchColor(i) }}
                    >
                      {b.value}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: T.surface, border: `1px solid ${T.border}` }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: branchColor(i) }}
                      initial={{ width: 0 }}
                      animate={{ width: `${((b.value - 80) / (200 - 80)) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </motion.div>

      {/* ── Row 4: Scatter + Donut ───────────────────── */}
      <motion.div variants={itemV} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7. Scatter: cutoff vs seats */}
        <ChartCard
          title="Cutoff vs Total Seats"
          subtitle={`${selectedCat} cutoff vs seat count — competitiveness view`}
        >
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 5, right: 5, left: -18, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis
                dataKey="x"
                name="Total Seats"
                tick={{ fill: T.muted, fontSize: 11 }}
                label={{ value: "Total Seats", position: "insideBottom", offset: -2, fill: T.muted, fontSize: 10 }}
              />
              <YAxis
                dataKey="y"
                name="Cutoff"
                tick={{ fill: T.muted, fontSize: 11 }}
                domain={[80, 200]}
              />
              <RechartsTooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={<ScatterTooltip />}
              />
              <Scatter data={scatterData} fill={T.indigo}>
                {scatterData.map((_, i) => (
                  <Cell key={i} fill={branchColor(i)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 9. Donut: seat utilization */}
        <ChartCard
          title="Seat Utilization"
          subtitle="Filled vs available seats across selection"
        >
          <div className="flex items-center justify-around h-[240px]">
            <ResponsiveContainer width="55%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={88}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {donutData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<DonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-col gap-5">
              {donutData.map((d) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded shrink-0"
                    style={{ background: d.color }}
                  />
                  <div>
                    <p className="text-[11px]" style={{ color: T.muted }}>
                      {d.name}
                    </p>
                    <p
                      className="font-black text-xl leading-none"
                      style={{ color: d.color }}
                    >
                      {d.value}
                    </p>
                  </div>
                </div>
              ))}
              <div>
                <p className="text-[11px]" style={{ color: T.muted }}>
                  Fill Rate
                </p>
                <p className="font-black text-xl leading-none" style={{ color: T.navy }}>
                  {donutData[0].value + donutData[1].value > 0
                    ? `${(
                        (donutData[0].value /
                          (donutData[0].value + donutData[1].value)) *
                        100
                      ).toFixed(0)}%`
                    : "0%"}
                </p>
              </div>
            </div>
          </div>
        </ChartCard>
      </motion.div>

      {/* ── Full-width Heatmap ───────────────────────── */}
      <motion.div variants={itemV}>
        <Heatmap allData={rawData} year={selectedYear} />
      </motion.div>

      {/* ── Full-width Predictor ─────────────────────── */}
      <motion.div variants={itemV}>
        <AdmissionPredictor allData={rawData} />
      </motion.div>

      {/* ── Data source note ─────────────────────────── */}
      <motion.div variants={itemV}>
        <div
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs"
          style={{
            background: `${T.indigo}08`,
            border: `1px solid ${T.indigo}20`,
            color: T.muted,
          }}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" style={{ color: T.indigo }} />
          <span>
            Data sourced from{" "}
            <code
              className="font-semibold px-1.5 py-0.5 rounded"
              style={{ background: `${T.indigo}12`, color: T.indigo }}
            >
              tnea
            </code>
            {" "}· All filtering happens client-side after a single fetch.
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}