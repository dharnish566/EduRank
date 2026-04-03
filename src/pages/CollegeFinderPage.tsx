import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import {
  findCollegesApi,
  fetchDistricts,
  fetchCourses,
  type CollegeWithScore,
  type FinderFilters,
} from "../services/collegeFinderApi.ts";
import {
  ArrowLeft,
  BarChart3,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  GitCompare,
  Home,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CollegeFinderPageProps {
  onNavigateHome: () => void;
  onNavigateToDetails: (id: number) => void;
  onNavigateToCompare: (ids: number[]) => void;
}

// FinderInputs matches FinderFilters from collegeFinderApi exactly
interface FinderInputs {
  district: string;
  universityType: "any" | "IIT" | "NIT" | "Deemed" | "State" | "Private";
  naacGrade: "any" | "A++" | "A+" | "A" | "B++";
  minNaacScore: number;
  useNaacScore: boolean;
  nirfTopN: "any" | "top10" | "top25" | "top50" | "top100";
  tneaMaxCutoff: number;
  courseName: string;
  minPlacementPct: number;
}

type SortKey = "matchScore" | "nirfRank" | "avgPackageLPA" | "feeMin";

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────────────────── */
const T = {
  heroBg:      "oklch(0.16 0.055 258)",
  surface:     "oklch(0.975 0.005 258)",
  white:       "oklch(1 0 0)",
  indigo:      "oklch(0.46 0.19 266)",
  indigoDim:   "oklch(0.46 0.19 266 / 0.12)",
  indigoGhost: "oklch(0.46 0.19 266 / 0.06)",
  gold:        "oklch(0.80 0.16 86)",
  goldMid:     "oklch(0.60 0.14 78)",
  goldText:    "oklch(0.42 0.14 78)",
  goldGhost:   "oklch(0.80 0.16 86 / 0.10)",
  green:       "oklch(0.52 0.18 148)",
  greenText:   "oklch(0.32 0.18 148)",
  red:         "oklch(0.54 0.20 27)",
  redText:     "oklch(0.40 0.20 27)",
  navy:        "oklch(0.20 0.05 258)",
  muted:       "oklch(0.50 0.025 258)",
  border:      "oklch(0.91 0.01 258)",
} as const;

/* ─── Type badge ─── */
function getTypeBadgeStyle(type: CollegeWithScore["type"]) {
  switch (type) {
    case "IIT":     return "bg-[oklch(0.46_0.19_266/0.12)] text-[oklch(0.30_0.18_266)] border border-[oklch(0.46_0.19_266/0.35)]";
    case "NIT":     return "bg-[oklch(0.52_0.18_148/0.12)] text-[oklch(0.28_0.18_148)] border border-[oklch(0.52_0.18_148/0.35)]";
    case "Deemed":  return "bg-[oklch(0.80_0.16_86/0.14)]  text-[oklch(0.42_0.14_78)]  border border-[oklch(0.80_0.16_86/0.38)]";
    case "State":   return "bg-[oklch(0.54_0.06_240/0.12)] text-[oklch(0.30_0.05_240)] border border-[oklch(0.54_0.06_240/0.35)]";
    case "Private": return "bg-[oklch(0.56_0.18_305/0.12)] text-[oklch(0.32_0.17_305)] border border-[oklch(0.56_0.18_305/0.35)]";
  }
}

/* ─── NAAC badge ─── */
function getNaacBadgeStyle(grade: CollegeWithScore["naacGrade"]) {
  switch (grade) {
    case "A++": return "bg-[oklch(0.80_0.16_86/0.15)]  text-[oklch(0.42_0.14_78)]  border border-[oklch(0.80_0.16_86/0.45)]  font-bold";
    case "A+":  return "bg-[oklch(0.52_0.18_148/0.12)] text-[oklch(0.28_0.18_148)] border border-[oklch(0.52_0.18_148/0.42)] font-bold";
    case "A":   return "bg-[oklch(0.46_0.19_266/0.12)] text-[oklch(0.28_0.18_266)] border border-[oklch(0.46_0.19_266/0.38)] font-bold";
    case "B++": return "bg-[oklch(0.54_0.06_240/0.12)] text-[oklch(0.34_0.05_240)] border border-[oklch(0.54_0.06_240/0.35)] font-bold";
  }
}

/* ─── Match helpers ─── */
function getMatchColor(score: number): string {
  if (score >= 80) return T.green;
  if (score >= 60) return T.gold;
  return T.red;
}

function getMatchLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Low";
}

/* ─── Rank medal ─── */
function getRankMedalStyle(rank: number) {
  if (rank === 1) return {
    bg:     `radial-gradient(ellipse at 30% 30%, oklch(0.92 0.18 90), oklch(0.72 0.18 72))`,
    text:   "oklch(0.30 0.08 70)",
    shadow: `0 4px 16px ${T.gold}80`,
  };
  if (rank === 2) return {
    bg:     "radial-gradient(ellipse at 30% 30%, oklch(0.88 0.01 250), oklch(0.70 0.01 250))",
    text:   "oklch(0.30 0.02 250)",
    shadow: "0 4px 16px oklch(0.70 0.01 250 / 0.45)",
  };
  if (rank === 3) return {
    bg:     "radial-gradient(ellipse at 30% 30%, oklch(0.78 0.12 55), oklch(0.60 0.12 52))",
    text:   "oklch(0.25 0.08 50)",
    shadow: "0 4px 16px oklch(0.65 0.12 55 / 0.45)",
  };
  return {
    bg:     T.heroBg,
    text:   "oklch(0.98 0.005 240)",
    shadow: "none",
  };
}

/* ─── Static fallbacks (shown while API loads) ─── */
const NIRF_TOP_N_LABELS: Record<string, string> = {
  any: "Any Rank", top10: "Top 10", top25: "Top 25", top50: "Top 50", top100: "Top 100",
};

const NAAC_GRADES = ["any", "A++", "A+", "A", "B++"] as const;

/* ═══════════════════════════════════════════════════════════════════════════
   MATCH SCORE RING
═══════════════════════════════════════════════════════════════════════════ */
function MatchScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const r      = (size - 10) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color  = getMatchColor(score);

  return (
    <svg
      width={size}
      height={size}
      className="rotate-[-90deg]"
      role="img"
      aria-label={`Match score: ${score}%`}
    >
      <title>Match score: {score}%</title>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`${T.heroBg}1F`} strokeWidth={7} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
      />
      <text
        x={size / 2} y={size / 2 + 5}
        textAnchor="middle"
        fill={color}
        fontSize={size * 0.24}
        fontWeight={700}
        style={{
          transform:       "rotate(90deg)",
          transformOrigin: `${size / 2}px ${size / 2}px`,
          fontFamily:      "Bricolage Grotesque, sans-serif",
        }}
      >
        {score}%
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FORM HELPERS
═══════════════════════════════════════════════════════════════════════════ */
function FormSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="h-4 w-0.5 rounded-full" style={{ background: T.gold }} />
        <h3
          className="font-heading font-bold text-sm uppercase tracking-widest"
          style={{ color: T.navy }}
        >
          {label}
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function SliderField({
  label, value, min, max, step, format, onChange, hint,
}: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void; hint?: string;
}) {
  return (
    <div className="sm:col-span-2 space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold" style={{ color: T.navy }}>{label}</Label>
        <span
          className="text-sm font-bold px-2.5 py-0.5 rounded-full"
          style={{
            color:      T.indigo,
            background: T.indigoDim,
            border:     `1px solid ${T.indigo}33`,
          }}
        >
          {format(value)}
        </span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} className="w-full" />
      {hint && <p className="text-xs" style={{ color: T.muted }}>{hint}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export function CollegeFinderPage({
  onNavigateHome,
  onNavigateToDetails,
  onNavigateToCompare,
}: CollegeFinderPageProps) {
  const resultsRef = useRef<HTMLDivElement>(null);

  const [inputs, setInputs] = useState<FinderInputs>({
    district:        "Any District",
    universityType:  "any",
    naacGrade:       "any",
    minNaacScore:    3.0,
    useNaacScore:    false,
    nirfTopN:        "any",
    tneaMaxCutoff:   140,
    courseName:      "Any Course",
    minPlacementPct: 60,
  });

  const [results, setResults]             = useState<CollegeWithScore[] | null>(null);
  const [isAnalyzing, setIsAnalyzing]     = useState(false);
  const [sortKey, setSortKey]             = useState<SortKey>("matchScore");
  const [savedIds, setSavedIds]           = useState<number[]>([]);
  const [shortlistOpen, setShortlistOpen] = useState(false);

  // ── CHANGE (Optional): Live dropdowns from API ──────────────────────────
  const [districtOptions, setDistrictOptions] = useState<string[]>(["Any District"]);
  const [courseOptions, setCourseOptions]     = useState<string[]>(["Any Course"]);

  useEffect(() => {
    fetchDistricts().then(setDistrictOptions).catch(console.error);
    fetchCourses().then(setCourseOptions).catch(console.error);
  }, []);

  const update = useCallback(
    <K extends keyof FinderInputs>(key: K, value: FinderInputs[K]) =>
      setInputs((prev) => ({ ...prev, [key]: value })),
    [],
  );

  // ── CHANGE 2: handleFind — calls API instead of filtering static data ───
  const handleFind = async () => {
    setIsAnalyzing(true);
    try {
      const data = await findCollegesApi(inputs as FinderFilters); // inputs shape is identical to FinderFilters
      setResults(data);
      setSortKey("matchScore");
      setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        100
      );
    } catch (err) {
      console.error("[CollegeFinderPage] API error:", err);
      setResults([]); // show empty state — user sees "No Matches Found" + adjust filters button
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sortedResults = useMemo(() => {
    if (!results) return null;
    return [...results].sort((a, b) => {
      switch (sortKey) {
        case "matchScore":    return b.matchScore - a.matchScore;
        case "nirfRank":      return (a.nirfRank ?? Infinity) - (b.nirfRank ?? Infinity);
        case "avgPackageLPA": return b.avgPackageLPA - a.avgPackageLPA;
        case "feeMin":        return a.feeRange.min - b.feeRange.min;
        default:              return 0;
      }
    });
  }, [results, sortKey]);

  const toggleSave = (id: number) =>
    setSavedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  // ── CHANGE 3: savedColleges — reads from API results, not static COLLEGES
  const savedColleges = (results ?? []).filter((c) => savedIds.includes(c.id));

  const top3Results = sortedResults?.slice(0, 3) ?? [];

  const matchBarData = sortedResults?.slice(0, 8).map((c) => ({
    name:  c.shortName,
    score: c.matchScore,
    fill:  getMatchColor(c.matchScore),
  })) ?? [];

  const packageBarData = sortedResults?.slice(0, 8).map((c) => ({
    name: c.shortName,
    pkg:  c.avgPackageLPA,
  })) ?? [];

  const trendYears = [...new Set(top3Results.flatMap((c) => c.placementTrend.map((t) => t.year)))].sort();
  const trendChartData = trendYears.map((yr) => {
    const row: Record<string, number | string> = { year: yr };
    for (const c of top3Results) {
      const pt = c.placementTrend.find((t) => t.year === yr);
      if (pt) row[c.shortName] = pt.avgLPA;
    }
    return row;
  });

  const trendColors = [T.gold, T.indigo, T.green];

  const tooltipStyle = {
    background:   T.heroBg,
    border:       `1px solid oklch(1 0 0 / 0.12)`,
    borderRadius: 10,
    color:        "#fff",
    fontSize:     12,
  };

  return (
    <div className="min-h-screen bg-background font-body">

      {/* ══════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-16" style={{ background: T.heroBg }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(1 0 0 / 0.18) 1px, transparent 1px)",
            backgroundSize:  "28px 28px",
            opacity:         0.55,
          }}
        />
        <div
          className="absolute top-0 right-[15%] w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(ellipse, ${T.indigo}38 0%, transparent 70%)` }}
        />
        <div
          className="absolute bottom-0 left-[10%] w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(ellipse, ${T.gold}26 0%, transparent 70%)` }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: "520px", height: "520px", borderRadius: "50%",
            right: "-100px", bottom: "-220px",
            background: T.indigo, opacity: 0.04,
          }}
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1.5 text-xs mb-8"
            style={{ color: "oklch(1 0 0 / 0.50)" }}
          >
            <button
              type="button"
              data-ocid="finder.home_link"
              onClick={onNavigateHome}
              className="flex items-center gap-1 hover:text-white transition-colors group"
            >
              <Home className="w-3 h-3" />
              Home
            </button>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <span className="font-semibold" style={{ color: T.gold }}>
              Smart College Finder
            </span>
          </motion.nav>

          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
              style={{ background: `${T.gold}1F`, border: `1px solid ${T.gold}40` }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: T.gold }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: T.gold }}>
                AI-Powered Matching
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="heading-display text-4xl md:text-5xl lg:text-6xl text-white mb-4 tracking-tight leading-[1.05]"
            >
              Smart{" "}
              <span
                style={{
                  background:           `linear-gradient(135deg, oklch(0.94 0.18 90), oklch(0.70 0.18 72))`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor:  "transparent",
                  backgroundClip:       "text",
                }}
              >
                College Finder
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="text-base md:text-lg leading-relaxed mb-2 max-w-xl"
              style={{ color: "oklch(1 0 0 / 0.65)" }}
            >
              Find the best colleges that match your academic performance and preferences.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="text-sm leading-relaxed mb-9 max-w-lg"
              style={{ color: "oklch(1 0 0 / 0.45)" }}
            >
              Enter your details below and get personalized college recommendations instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap gap-3"
            >
              {[
                { icon: BarChart3, label: "20+ Colleges Analyzed" },
                { icon: Target,    label: "7 Match Parameters"    },
                { icon: Zap,       label: "Instant Results"       },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2"
                  style={{
                    background:     "oklch(1 0 0 / 0.055)",
                    border:         "1px solid oklch(1 0 0 / 0.10)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: T.gold }} />
                  <span className="text-xs font-medium" style={{ color: "oklch(1 0 0 / 0.75)" }}>
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          INPUT FORM
      ══════════════════════════════════════════ */}
      <section className="py-10" style={{ background: T.surface }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: T.white,
              border:     `1px solid ${T.border}`,
              boxShadow:  `0 8px 40px oklch(0.16 0.055 258 / 0.08), 0 2px 8px oklch(0 0 0 / 0.04)`,
            }}
          >
            {/* Form header */}
            <div
              className="px-6 pt-6 pb-4 flex items-center gap-3"
              style={{ borderBottom: `1px solid ${T.border}` }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: T.indigoDim }}
              >
                <SlidersHorizontal className="w-[18px] h-[18px]" style={{ color: T.indigo }} />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg" style={{ color: T.navy }}>
                  Your Preferences
                </h2>
                <p className="text-xs" style={{ color: T.muted }}>
                  Fill in your details to get personalized recommendations
                </p>
              </div>
            </div>

            <div className="p-6 space-y-8">

              {/* ── Location & Institution ── */}
              <FormSection label="Location & Institution">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold" style={{ color: T.navy }}>District</Label>
                  {/* CHANGE (Optional): uses live districtOptions from API */}
                  <Select value={inputs.district} onValueChange={(v) => update("district", v)}>
                    <SelectTrigger data-ocid="finder.district_select" className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {districtOptions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold" style={{ color: T.navy }}>University Type</Label>
                  <Select
                    value={inputs.universityType}
                    onValueChange={(v) => update("universityType", v as FinderInputs["universityType"])}
                  >
                    <SelectTrigger data-ocid="finder.university_type_select" className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Type</SelectItem>
                      <SelectItem value="IIT">IIT</SelectItem>
                      <SelectItem value="NIT">NIT</SelectItem>
                      <SelectItem value="Deemed">Deemed</SelectItem>
                      <SelectItem value="State">State University</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormSection>

              <div className="border-t" style={{ borderColor: `${T.border}99` }} />

              {/* ── Accreditation ── */}
              <FormSection label="Accreditation">
                {/* Toggle: grade vs score */}
                <div className="sm:col-span-2 flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: T.surface, border: `1px solid ${T.border}` }}
                >
                  <span className="text-sm font-semibold flex-1" style={{ color: T.navy }}>
                    Filter NAAC by
                  </span>
                  <div className="flex gap-2">
                    {[
                      { key: false, label: "Grade" },
                      { key: true,  label: "Score" },
                    ].map(({ key, label }) => (
                      <button
                        key={String(key)}
                        type="button"
                        onClick={() => update("useNaacScore", key)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150"
                        style={
                          inputs.useNaacScore === key
                            ? { background: T.navy, color: T.white, borderColor: T.navy, boxShadow: `0 2px 8px ${T.navy}40` }
                            : { background: T.surface, color: T.muted, borderColor: T.border }
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {!inputs.useNaacScore ? (
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-semibold" style={{ color: T.navy }}>
                      Minimum NAAC Grade
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {NAAC_GRADES.map((g) => {
                        const active = inputs.naacGrade === g;
                        return (
                          <button
                            key={g}
                            type="button"
                            data-ocid="finder.naac_grade_toggle"
                            onClick={() => update("naacGrade", g)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150"
                            style={
                              active
                                ? { background: T.navy, color: T.white, borderColor: T.navy, boxShadow: `0 2px 8px ${T.navy}40` }
                                : { background: T.surface, color: T.muted, borderColor: T.border }
                            }
                          >
                            {g === "any" ? "Any" : `NAAC ${g}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <SliderField
                    label="Minimum NAAC Score"
                    value={inputs.minNaacScore}
                    min={1.0} max={4.0} step={0.01}
                    format={(v) => v.toFixed(2)}
                    onChange={(v) => update("minNaacScore", v)}
                    hint="NAAC score ranges: A++ (3.76–4.0), A+ (3.51–3.75), A (3.26–3.50), B++ (3.01–3.25)"
                  />
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-semibold" style={{ color: T.navy }}>
                    NIRF Rank Range{" "}
                    <span className="font-normal text-xs" style={{ color: T.muted }}>(optional)</span>
                  </Label>
                  <Select
                    value={inputs.nirfTopN}
                    onValueChange={(v) => update("nirfTopN", v as FinderInputs["nirfTopN"])}
                  >
                    <SelectTrigger data-ocid="finder.nirf_select" className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["any", "top10", "top25", "top50", "top100"] as const).map((k) => (
                        <SelectItem key={k} value={k}>{NIRF_TOP_N_LABELS[k]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </FormSection>

              <div className="border-t" style={{ borderColor: `${T.border}99` }} />

              {/* ── Academic & Course ── */}
              <FormSection label="Academic & Course">
                <SliderField
                  label="TNEA Average Cutoff"
                  value={inputs.tneaMaxCutoff}
                  min={0} max={200} step={1}
                  format={(v) => `${v} / 200`}
                  onChange={(v) => update("tneaMaxCutoff", v)}
                  hint="Your TNEA cutoff marks or entrance exam score"
                />

                <div className="space-y-2">
                  <Label className="text-sm font-semibold" style={{ color: T.navy }}>Course Name</Label>
                  {/* CHANGE (Optional): uses live courseOptions from API */}
                  <Select
                    value={inputs.courseName}
                    onValueChange={(v) => update("courseName", v)}
                  >
                    <SelectTrigger data-ocid="finder.course_select" className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {courseOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <SliderField
                  label="Minimum Placement %"
                  value={inputs.minPlacementPct}
                  min={0} max={100} step={5}
                  format={(v) => `${v}%`}
                  onChange={(v) => update("minPlacementPct", v)}
                />
              </FormSection>
            </div>

            {/* Submit */}
            <div
              className="px-6 py-5"
              style={{ background: `${T.surface}CC`, borderTop: `1px solid ${T.border}` }}
            >
              <Button
                data-ocid="finder.submit_button"
                onClick={handleFind}
                disabled={isAnalyzing}
                className="w-full font-bold text-base py-6 rounded-xl shadow-sm transition-all"
                style={{ background: T.gold, color: T.navy }}
                size="lg"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing your profile...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Find My Colleges
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          RESULTS
      ══════════════════════════════════════════ */}
      <div ref={resultsRef} />
      <AnimatePresence mode="wait">
        {sortedResults !== null && (
          <motion.section
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-10"
            style={{ background: T.surface }}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-6"
              >
                <div className="flex items-center gap-3">
                  <h2 className="font-heading font-bold text-xl md:text-2xl" style={{ color: T.navy }}>
                    Your Personalized Recommendations
                  </h2>
                  <Badge
                    data-ocid="finder.results_section"
                    className="font-bold"
                    style={{ background: T.indigoDim, color: T.indigo, border: `1px solid ${T.indigo}33` }}
                  >
                    {sortedResults.length} matches
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm whitespace-nowrap" style={{ color: T.muted }}>Sort by:</span>
                  <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
                    <SelectTrigger data-ocid="finder.sort_select" className="w-[170px] bg-white text-sm h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matchScore">Match Score</SelectItem>
                      <SelectItem value="nirfRank">NIRF Ranking</SelectItem>
                      <SelectItem value="avgPackageLPA">Avg Package</SelectItem>
                      <SelectItem value="feeMin">Lowest Fee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>

              {/* Empty state */}
              {sortedResults.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                  data-ocid="finder.empty_state"
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: T.indigoDim }}
                  >
                    <Search className="w-10 h-10" style={{ color: `${T.indigo}66` }} />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-2" style={{ color: T.navy }}>
                    No Matches Found
                  </h3>
                  <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: T.muted }}>
                    Try adjusting your filters — lower the minimum placement %, change the district to "Any District", or select a different course.
                  </p>
                  <Button
                    data-ocid="finder.adjust_filters_button"
                    variant="outline"
                    className="border-2 font-semibold"
                    style={{ borderColor: T.navy, color: T.navy }}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    Adjust Filters
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" data-ocid="finder.list">
                  {sortedResults.map((college, idx) => {
                    const medalStyle = getRankMedalStyle(idx + 1);
                    const isSaved    = savedIds.includes(college.id);

                    return (
                      <motion.article
                        key={college.id}
                        data-ocid={`finder.item.${idx + 1}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 group"
                        style={{
                          background: T.white,
                          border:     `1px solid ${T.border}`,
                          boxShadow:  `0 2px 12px oklch(0.16 0.055 258 / 0.05)`,
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px oklch(0.16 0.055 258 / 0.10)`;
                          (e.currentTarget as HTMLElement).style.transform  = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 12px oklch(0.16 0.055 258 / 0.05)`;
                          (e.currentTarget as HTMLElement).style.transform  = "translateY(0)";
                        }}
                      >
                        <div className="p-5 pb-4 flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                              style={{ background: medalStyle.bg, color: medalStyle.text, boxShadow: medalStyle.shadow }}
                            >
                              {idx < 3 ? ["🥇","🥈","🥉"][idx] : `#${idx + 1}`}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3
                                className="font-heading font-bold text-sm leading-tight line-clamp-2 transition-colors group-hover:text-[oklch(0.46_0.19_266)]"
                                style={{ color: T.navy }}
                              >
                                {college.name}
                              </h3>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${getTypeBadgeStyle(college.type)}`}>
                                  {college.type}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${getNaacBadgeStyle(college.naacGrade)}`}>
                                  NAAC {college.naacGrade}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              data-ocid={`finder.toggle.${idx + 1}`}
                              onClick={() => toggleSave(college.id)}
                              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                              style={isSaved ? { background: `${T.gold}22`, color: T.goldText } : { background: T.surface, color: T.muted }}
                              onMouseEnter={(e) => { if (!isSaved) (e.currentTarget as HTMLElement).style.color = T.navy; }}
                              onMouseLeave={(e) => { if (!isSaved) (e.currentTarget as HTMLElement).style.color = T.muted; }}
                              title={isSaved ? "Remove from shortlist" : "Add to shortlist"}
                            >
                              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                            </button>
                          </div>

                          <div className="flex items-center gap-1 text-xs mb-4" style={{ color: T.muted }}>
                            <MapPin className="w-3 h-3" style={{ color: T.gold }} />
                            {college.city}, {college.state}
                          </div>

                          <div className="flex items-center gap-4 mb-4">
                            <div className="relative shrink-0">
                              <MatchScoreRing score={college.matchScore} size={68} />
                              <div
                                className="absolute -bottom-1 -right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                style={{
                                  background: `${getMatchColor(college.matchScore)}22`,
                                  color:      getMatchColor(college.matchScore),
                                  border:     `1px solid ${getMatchColor(college.matchScore)}44`,
                                }}
                              >
                                {getMatchLabel(college.matchScore)}
                              </div>
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-y-2 gap-x-3">
                              {[
                                { label: "Placement", value: `${college.placementPct}%` },
                                { label: "NIRF Rank", value: college.nirfRank != null ? `#${college.nirfRank}` : "N/A" },
                                { label: "NAAC",      value: college.naacGrade           },
                              ].map(({ label, value }) => (
                                <div key={label}>
                                  <div className="text-[10px] uppercase tracking-wide" style={{ color: T.muted }}>{label}</div>
                                  <div className="font-bold text-sm" style={{ color: T.navy }}>{value}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {college.courses.slice(0, 3).map((c, i) => (
                              <span
                                key={`${college.id}-course-${i}`}
                                className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{ background: T.surface, color: T.muted, border: `1px solid ${T.border}` }}
                              >
                                {c.course_name}
                              </span>
                            ))}
                            {college.courses.length > 3 && (
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-full border border-dashed"
                                style={{ color: `${T.muted}AA`, borderColor: `${T.border}AA` }}
                              >
                                +{college.courses.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="px-4 pb-4 pt-3 flex gap-2" style={{ borderTop: `1px solid ${T.border}99` }}>
                          <Button
                            data-ocid={`finder.primary_button.${idx + 1}`}
                            size="sm"
                            className="flex-1 text-xs font-semibold text-white"
                            style={{ background: T.indigo }}
                            onClick={() => onNavigateToDetails(college.id)}
                          >
                            View Details
                          </Button>
                          <Button
                            data-ocid={`finder.secondary_button.${idx + 1}`}
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs font-semibold"
                            style={{ borderColor: `${T.navy}44`, color: T.navy }}
                            onClick={() => onNavigateToCompare([college.id])}
                          >
                            <GitCompare className="w-3 h-3 mr-1" />
                            Compare
                          </Button>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          VISUAL INSIGHTS
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {sortedResults && sortedResults.length >= 3 && (
          <motion.section
            key="insights"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="py-14"
            style={{ background: T.heroBg }}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                  style={{ background: `${T.gold}1F`, border: `1px solid ${T.gold}33` }}
                >
                  <TrendingUp className="w-3.5 h-3.5" style={{ color: T.gold }} />
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: T.gold }}>
                    Visual Analytics
                  </span>
                </div>
                <h2 className="heading-display text-2xl md:text-3xl text-white mb-2">
                  Visual Insights for Your Recommendations
                </h2>
                <p className="text-sm" style={{ color: "oklch(1 0 0 / 0.45)" }}>
                  Comparing top matched colleges across key metrics
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart 1: Match Score */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.10 }}
                  data-ocid="finder.chart_point"
                  className="rounded-2xl p-5"
                  style={{ background: "oklch(1 0 0 / 0.055)", border: "1px solid oklch(1 0 0 / 0.10)" }}
                >
                  <h3 className="font-heading font-bold text-white text-sm mb-1">Admission Probability</h3>
                  <p className="text-xs mb-4" style={{ color: "oklch(1 0 0 / 0.40)" }}>Match score by college</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={matchBarData} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
                      <XAxis type="number" domain={[0, 100]}
                        tick={{ fill: "oklch(1 0 0 / 0.35)", fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="name" width={72}
                        tick={{ fill: "oklch(1 0 0 / 0.55)", fontSize: 10 }} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(v) => [`${v}%`, "Match"]} contentStyle={tooltipStyle} />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                        {matchBarData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Chart 2: Package */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.18 }}
                  data-ocid="finder.chart_point"
                  className="rounded-2xl p-5"
                  style={{ background: "oklch(1 0 0 / 0.055)", border: "1px solid oklch(1 0 0 / 0.10)" }}
                >
                  <h3 className="font-heading font-bold text-white text-sm mb-1">Average Package (LPA)</h3>
                  <p className="text-xs mb-4" style={{ color: "oklch(1 0 0 / 0.40)" }}>Top matched colleges</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={packageBarData} margin={{ left: 0, right: 8, top: 4, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                      <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0}
                        tick={{ fill: "oklch(1 0 0 / 0.45)", fontSize: 9 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: "oklch(1 0 0 / 0.35)", fontSize: 10 }} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(v) => [`₹${v} LPA`, "Avg Package"]} contentStyle={tooltipStyle} />
                      <Bar dataKey="pkg" fill={T.indigo} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Chart 3: Placement Trend */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.26 }}
                  data-ocid="finder.chart_point"
                  className="rounded-2xl p-5"
                  style={{ background: "oklch(1 0 0 / 0.055)", border: "1px solid oklch(1 0 0 / 0.10)" }}
                >
                  <h3 className="font-heading font-bold text-white text-sm mb-1">Placement Trend</h3>
                  <p className="text-xs mb-4" style={{ color: "oklch(1 0 0 / 0.40)" }}>
                    Avg LPA – top 3 matches (2020–2024)
                  </p>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={trendChartData} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                      <XAxis dataKey="year"
                        tick={{ fill: "oklch(1 0 0 / 0.45)", fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: "oklch(1 0 0 / 0.35)", fontSize: 10 }} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(v) => [`₹${v} LPA`, ""]} contentStyle={tooltipStyle} />
                      {top3Results.map((c, i) => (
                        <Line
                          key={c.id}
                          type="monotone"
                          dataKey={c.shortName}
                          stroke={trendColors[i]}
                          strokeWidth={2}
                          dot={{ r: 3, fill: trendColors[i], strokeWidth: 0 }}
                          activeDot={{ r: 5 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {top3Results.map((c, i) => (
                      <div key={c.id} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: trendColors[i] }} />
                        <span className="text-[10px]" style={{ color: "oklch(1 0 0 / 0.50)" }}>
                          {c.shortName}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="py-8" style={{ background: T.surface, borderTop: `1px solid ${T.border}` }}>
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm" style={{ color: T.muted }}>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" style={{ color: T.indigo }} />
            <span>College Ranking Analytics Platform</span>
          </div>
          <p>
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: T.indigo }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* ══════════════════════════════════════════
          FLOATING SHORTLIST BUTTON
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {savedIds.length > 0 && (
          <motion.div
            key="shortlist-fab"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <button
              type="button"
              data-ocid="finder.shortlist_button"
              onClick={() => setShortlistOpen(true)}
              className="flex items-center gap-2 font-bold text-sm px-4 py-3 rounded-2xl transition-all hover:brightness-95"
              style={{ background: T.gold, color: T.navy, boxShadow: `0 4px 24px ${T.gold}70` }}
            >
              <BookmarkCheck className="w-4 h-4" />
              Shortlist ({savedIds.length})
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          SHORTLIST DRAWER
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {shortlistOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
              onClick={() => setShortlistOpen(false)}
            />
            <motion.div
              key="drawer"
              data-ocid="finder.sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl max-h-[70vh] flex flex-col"
              style={{ background: T.white, boxShadow: `0 -8px 40px oklch(0.16 0.055 258 / 0.25)` }}
            >
              <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="w-5 h-5" style={{ color: T.gold }} />
                  <h3 className="font-heading font-bold text-base" style={{ color: T.navy }}>
                    Shortlisted Colleges
                  </h3>
                  <Badge
                    className="font-bold"
                    style={{ background: `${T.gold}22`, color: T.goldText, border: `1px solid ${T.gold}44` }}
                  >
                    {savedIds.length}
                  </Badge>
                </div>
                <button
                  type="button"
                  data-ocid="finder.close_button"
                  onClick={() => setShortlistOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: T.surface, color: T.muted }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = T.navy; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = T.muted; }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-4 space-y-3">
                {savedColleges.map((c, idx) => (
                  <div
                    key={c.id}
                    data-ocid={`finder.shortlist.item.${idx + 1}`}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ background: T.surface, border: `1px solid ${T.border}` }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-heading font-bold text-sm truncate" style={{ color: T.navy }}>
                        {c.name}
                      </div>
                      <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: T.muted }}>
                        <MapPin className="w-3 h-3" style={{ color: T.gold }} />
                        {c.city} · NIRF #{c.nirfRank ?? "N/A"}
                      </div>
                    </div>
                    <button
                      type="button"
                      data-ocid={`finder.delete_button.${idx + 1}`}
                      onClick={() => toggleSave(c.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                      style={{ background: `${T.red}14`, color: T.red }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${T.red}28`; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = `${T.red}14`; }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4" style={{ borderTop: `1px solid ${T.border}` }}>
                <Button
                  data-ocid="finder.compare_shortlist_button"
                  className="w-full font-bold text-white"
                  style={{ background: T.indigo }}
                  onClick={() => { setShortlistOpen(false); onNavigateToCompare(savedIds); }}
                  disabled={savedIds.length < 2}
                >
                  <GitCompare className="w-4 h-4 mr-2" />
                  Compare Shortlist ({savedIds.length})
                </Button>
                {savedIds.length < 2 && (
                  <p className="text-center text-xs mt-2" style={{ color: T.muted }}>
                    Add at least 2 colleges to compare
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hidden nav button (preserved) */}
      <div className="hidden">
        <button type="button" data-ocid="finder.home_link" onClick={onNavigateHome}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
    </div>
  );
}