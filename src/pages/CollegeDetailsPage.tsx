import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { COLLEGES, type College } from "../data/colleges";
import { TneaTab } from "../components/detailed/tneaStats";
import { NaacTab, type RawCriterion } from "../components/detailed/naacStats";
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  GraduationCap,
  Home,
  MapPin,
  Medal,
  Star,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiUrl } from "../utils/api";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* ─── Design Tokens ────────────────────────────────────────────────────────
   Navy-slate hero → clean white content panels → gold/indigo accents.
   Every colour is derived from these four variables so swapping theme is
   one-place change.
   ────────────────────────────────────────────────────────────────────────── */
const T = {
  /* Hero background – deep navy */
  heroBg: "oklch(0.16 0.055 258)",
  /* Primary accent – royal indigo */
  indigo: "oklch(0.46 0.19 266)",
  indigoLight: "oklch(0.72 0.14 266)",
  /* Secondary accent – warm gold */
  gold: "oklch(0.80 0.16 86)",
  goldDeep: "oklch(0.60 0.14 78)",
  /* Success green */
  green: "oklch(0.52 0.18 148)",
  /* Danger red */
  red: "oklch(0.54 0.20 27)",
  /* Neutral text */
  navy: "oklch(0.20 0.05 258)",
  muted: "oklch(0.50 0.025 258)",
  border: "oklch(0.91 0.01 258)",
  surface: "oklch(0.975 0.005 258)",
};

export const DEGREE_MAP: Record<string, "B.Tech"> = {
  "AGRICULTURAL ENGINEERING": "B.Tech",
  "BIO TECHNOLOGY": "B.Tech",
  "Artificial Intelligence and Machine Learning": "B.Tech",
  "Artificial Intelligence and Data Science": "B.Tech",
  "COMPUTER SCIENCE AND BUSSINESS SYSTEM": "B.Tech",
  "INFORMATION TECHNOLOGY": "B.Tech",
  "INFORMATION TECHNOLOGY (SS)": "B.Tech",
  "GEO INFORMATICS": "B.Tech",
  "Electronics Engineering (VLSI Design and Technology) (SS)": "B.Tech"
};

interface CollegeDetailsPageProps {
  collegeId: number;
  onNavigateBack: () => void;
  onAddToCompare: (id: number) => void;
  compareIds: number[];
}

type TabKey = "overview" | "placement" | "courses" | "admission" | "facilities" | "tnea" | "naac";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  // { key: "placement", label: "Placement & Stats" },
  { key: "courses", label: "Courses & Fees" },
  { key: "admission", label: "Admission" },
  { key: "facilities", label: "Facilities & Recruiters" },
  { key: "tnea", label: "Tnea Statistics" },
  { key: "naac", label: "Naac Statistics" },
];

/* ── Type badge colours ── */
function getTypeBadge(type: College["type"]) {
  const map: Record<College["type"], { bg: string; text: string; border: string }> = {
    IIT: { bg: "oklch(0.46 0.19 266 / 0.12)", text: "oklch(0.30 0.18 266)", border: "oklch(0.46 0.19 266 / 0.35)" },
    NIT: { bg: "oklch(0.52 0.18 148 / 0.12)", text: "oklch(0.28 0.18 148)", border: "oklch(0.52 0.18 148 / 0.35)" },
    Deemed: { bg: "oklch(0.80 0.16 86  / 0.15)", text: "oklch(0.42 0.14 78)", border: "oklch(0.80 0.16 86  / 0.40)" },
    State: { bg: "oklch(0.54 0.06 240 / 0.12)", text: "oklch(0.30 0.05 240)", border: "oklch(0.54 0.06 240 / 0.35)" },
    Private: { bg: "oklch(0.56 0.18 305 / 0.12)", text: "oklch(0.32 0.17 305)", border: "oklch(0.56 0.18 305 / 0.35)" },
  };
  return map[type];
}

/* ── NAAC grade colours ── */
function getNaacColor(grade: College["naacGrade"]) {
  const map: Record<string, { bg: string; border: string; text: string }> = {
    "A++": { bg: "oklch(0.80 0.16 86  / 0.16)", border: "oklch(0.80 0.16 86  / 0.48)", text: "oklch(0.42 0.14 78)" },
    "A+": { bg: "oklch(0.52 0.18 148 / 0.14)", border: "oklch(0.52 0.18 148 / 0.42)", text: "oklch(0.28 0.18 148)" },
    "A": { bg: "oklch(0.46 0.19 266 / 0.13)", border: "oklch(0.46 0.19 266 / 0.38)", text: "oklch(0.28 0.18 266)" },
    "B++": { bg: "oklch(0.54 0.06 240 / 0.13)", border: "oklch(0.54 0.06 240 / 0.36)", text: "oklch(0.34 0.05 240)" },
    "B+": { bg: "oklch(0.54 0.06 240 / 0.13)", border: "oklch(0.54 0.06 240 / 0.36)", text: "oklch(0.34 0.05 240)" },
    "B": { bg: "oklch(0.54 0.06 240 / 0.13)", border: "oklch(0.54 0.06 240 / 0.36)", text: "oklch(0.34 0.05 240)" },
    "C": { bg: "oklch(0.54 0.06 240 / 0.13)", border: "oklch(0.54 0.06 240 / 0.36)", text: "oklch(0.34 0.05 240)" },
  };
  return map[grade ?? "-"] ?? map["A"];
}

/* ─────────────────── Score Ring ─────────────────── */
function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg width="144" height="144" viewBox="0 0 144 144"
        className="absolute inset-0 -rotate-90" aria-label={`Score ${score}`} role="img">
        {/* Track */}
        <circle cx="72" cy="72" r={r} fill="none"
          stroke="oklch(1 0 0 / 0.10)" strokeWidth="10" />
        {/* Glow ring behind progress */}
        <circle cx="72" cy="72" r={r} fill="none"
          stroke="oklch(0.80 0.16 86 / 0.18)" strokeWidth="14"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        {/* Progress */}
        <circle cx="72" cy="72" r={r} fill="none"
          stroke="url(#sgGrad)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`} />
        <defs>
          <linearGradient id="sgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.80 0.16 86)" />
            <stop offset="100%" stopColor="oklch(0.92 0.18 90)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center z-10">
        <p className="text-3xl font-black text-white leading-none tracking-tight">{score}</p>
        <p className="text-[10px] text-white/55 uppercase tracking-widest font-semibold mt-0.5">Score</p>
      </div>
    </div>
  );
}

/* -------------format Nirf Rank--------------------------*/
function formatNirfRank(rank: number | null | undefined): string {
    if (rank === null || rank === undefined) return "-";

    if (rank == 150) return "101-150";
    if (rank == 200) return "151-200";
    if (rank == 300) return "201-300";

    return rank.toString();
  }

/* ─────────────────── Hero Stat Card ─────────────────── */
function HeroStatCard({
  icon: Icon, label, value, sub, accent,
}: { icon: React.ElementType; label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="flex flex-col gap-1.5 px-5 py-4 rounded-2xl flex-1 min-w-[130px]"
      style={{
        background: "oklch(1 0 0 / 0.055)",
        border: "1px solid oklch(1 0 0 / 0.10)",
        backdropFilter: "blur(12px)",
      }}>
      <Icon className="w-4 h-4 mb-0.5" style={{ color: T.gold }} />
      <p className="text-[10px] text-white/45 uppercase tracking-wider font-semibold leading-none">{label}</p>
      <p className="font-black text-xl text-white leading-none" style={accent ? { color: accent } : {}}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-white/40 leading-none">{sub}</p>}
    </div>
  );
}

/* ─────────────────── Chart Tooltips ─────────────────── */
function LineTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border px-4 py-3 shadow-lg text-sm bg-white"
      style={{ borderColor: T.border }}>
      <p className="font-bold mb-2" style={{ color: T.navy }}>{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="text-xs" style={{ color: T.muted }}>
            {p.dataKey === "pct" ? "Placement" : "Avg LPA"}:
          </span>
          <span className="font-semibold" style={{ color: T.navy }}>
            {p.dataKey === "pct" ? `${p.value}%` : `${p.value} LPA`}
          </span>
        </div>
      ))}
    </div>
  );
}

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border px-4 py-3 shadow-lg text-sm bg-white"
      style={{ borderColor: T.border }}>
      <p className="font-bold mb-1" style={{ color: T.navy }}>{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: T.muted }}>Students:</span>
        <span className="font-semibold" style={{ color: T.navy }}>{payload[0].value}</span>
      </div>
    </div>
  );
}

/* ─────────────────── Section Heading ─────────────────── */
function SectionHeading({ icon: Icon, title, accent }: { icon: React.ElementType; title: string; accent?: string }) {
  const bg = accent ? `${accent}14` : `${T.indigo}12`;
  const color = accent ?? T.indigo;
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: bg }}>
        <Icon className="w-4.5 h-4.5" style={{ color }} />
      </div>
      <h2 className="font-bold text-xl" style={{ color: T.navy }}>{title}</h2>
    </div>
  );
}

/* ─────────────────── Content Card ─────────────────── */
function Card({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`bg-white rounded-2xl border p-6 ${className}`}
      style={{ borderColor: T.border, boxShadow: "0 1px 8px oklch(0.22 0.06 258 / 0.06)", ...style }}>
      {children}
    </div>
  );
}

/* ─────────────────── Metric Tile ─────────────────── */
function MetricTile({ icon: Icon, label, value, sub, accent }: {
  icon: React.ElementType; label: string; value: string; sub?: string; accent?: string;
}) {
  const a = accent ?? T.indigo;
  return (
    <Card className="flex flex-col gap-2 p-5">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${a}14` }}>
        <Icon className="w-4.5 h-4.5" style={{ color: a }} />
      </div>
      <p className="text-xs font-semibold mt-1" style={{ color: T.muted }}>{label}</p>
      <p className="font-black text-2xl leading-none" style={{ color: a }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: T.muted }}>{sub}</p>}
    </Card>
  );
}

/* ─────────────────── Animation helpers ─────────────────── */
const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const containerV = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemV = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: EASE } },
};
const panelV = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
export function CollegeDetailsPage({ collegeId, onNavigateBack, onAddToCompare, compareIds }: CollegeDetailsPageProps) {

  // ── Server state ─────────────────────────────────────────────────
  const [college, setCollege] = useState<College | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);  // for retry button

  // ── Existing UI state (unchanged) ────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const tabsRef = useRef<HTMLDivElement>(null);
  const [tabsSticky, setTabsSticky] = useState(false);
  const isInCompare = compareIds.includes(collegeId);

  // ── Fetch college details ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchCollege = async () => {
      setIsLoading(true);
      setIsError(false);
      setCollege(null);

      try {
        const res = await fetch(apiUrl(`/colleges/${collegeId}`));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();

        // ── Map backend response shape → College interface ──────────
        if (!json.success || !json.data) throw new Error("Invalid response");

        const d = json.data;
        console.log(d);

        const mapped: College = {
          id: d.id,
          name: d.name,
          shortName: d.name,                        // backend has no shortName yet

          // Classification — backend doesn't return type yet, fallback to "State"
          type: d.type ?? "State",

          // Location
          city: d.city ?? "",
          state: d.state ?? "",
          location: d.location ?? "",
          website: d.website ?? "",

          // Rankings & Scores
          nirfRank: d.nirf?.rank ?? null,
          overallScore: d.scores?.overall ?? 0,
          finalScore: d.scores?.final ?? 0,

          // NAAC
          naacGrade: d.naac?.grade ?? undefined,
          naacScore: d.naac?.score ?? undefined,
          naacAddress: d.naac?.address ?? undefined,

          // Establishment
          established: d.establishedYear ?? 0,

          // Placement
          placementPct: d.placementPercentage ?? 0,

          // Courses — already in the right shape
          courses: d.courses ?? [],
          courseCount: d.courseCount ?? 0,

          // Trend (not in response yet)
          trend: "stable",
          trendChange: 0,

          // Optional fields not yet in API
          about: d.about ?? undefined,
          facilities: d.facilities ?? [],
          admissionInfo: d.admissionInfo ?? {
            process: [],
            eligibility: [],
            keyDates: [],
          },
        };

        setCollege(mapped);
      } catch (err) {
        console.error("Failed to fetch college details:", err);
        if (!cancelled) setIsError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchCollege();
    return () => { cancelled = true; };
  }, [collegeId, retryCount]);   // retryCount re-triggers fetch on retry click

  // ── Scroll to top on mount ────────────────────────────────────────
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // ── Sticky tab bar ────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      if (!tabsRef.current) return;
      setTabsSticky(tabsRef.current.getBoundingClientRect().top <= 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Loading state ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: T.surface }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-4 animate-spin"
            style={{
              borderColor: `${T.indigo}30`,
              borderTopColor: T.indigo,
            }}
          />
          <p className="text-sm font-semibold" style={{ color: T.muted }}>
            Loading college details…
          </p>
        </div>
      </div>
    );
  }

  // ── Error / not found state ───────────────────────────────────────
  if (isError || !college) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: T.surface }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: T.navy }}>
            {isError ? "Failed to load college" : "College not found"}
          </h2>
          <p className="text-sm mb-6" style={{ color: T.muted }}>
            {isError
              ? "Something went wrong while fetching the data."
              : "This college does not exist or has been removed."}
          </p>
          <div className="flex gap-3 justify-center">
            {isError && (
              <Button
                onClick={() => setRetryCount((n) => n + 1)}
                style={{ background: T.indigo, color: "#fff" }}
              >
                Retry
              </Button>
            )}
            <Button onClick={onNavigateBack} style={{ background: T.navy, color: "#fff" }}>
              Back to Rankings
            </Button>
          </div>
        </div>
      </div>
    );
  }


  const naacColor = getNaacColor(college.naacGrade);
  const typeBadge = getTypeBadge(college.type);
  // const totalPlaced = college.salaryBands.reduce((a, b) => a + b.count, 0);
  // const companiesVisited = college.topRecruiters.length * 12;

  return (
    <div className="min-h-screen antialiased" style={{ background: T.surface, fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ══════════════ HERO HEADER ══════════════ */}
      <header className="relative overflow-hidden" style={{ background: T.heroBg, paddingTop: "4.5rem", paddingBottom: "3.5rem" }}>
        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, oklch(1 0 0 / 0.25) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Gradient pools */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 90% at 0% 50%, oklch(0.46 0.19 266 / 0.30) 0%, transparent 60%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 45% 55% at 100% 0%, oklch(0.80 0.16 86 / 0.10) 0%, transparent 55%)" }} />
        {/* Decorative circle */}
        <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: T.gold, transform: "translate(42%, 42%)" }} />

        <div className="relative z-10 container mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs mb-7 text-white/45">
            <button type="button" onClick={onNavigateBack}
              className="flex items-center gap-1 hover:text-white transition-colors group">
              <Home className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-white/25" />
            <button type="button" onClick={onNavigateBack} className="hover:text-white transition-colors">Rankings</button>
            <ChevronRight className="w-3 h-3 text-white/25" />
            <span className="text-white/75 font-medium truncate max-w-[200px]">{college.shortName}</span>
          </nav>

          {/* Hero body */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">

            {/* Left: info */}
            <motion.div className="flex-1"
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, ease: EASE }}>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {/* Type */}
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold leading-none"
                  style={{ background: typeBadge.bg, color: typeBadge.text, border: `1px solid ${typeBadge.border}` }}>
                  {college.type}
                </span>
                {/* NAAC */}
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black leading-none"
                  style={{ background: naacColor.bg, border: `1px solid ${naacColor.border}`, color: naacColor.text }}>
                  NAAC {college.naacGrade}
                </span>
                {/* Est */}
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold text-white/60"
                  style={{ background: "oklch(1 0 0 / 0.07)", border: "1px solid oklch(1 0 0 / 0.13)" }}>
                  Est. {college.established}
                </span>
                {/* Trend */}
                {college.trend !== "stable" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold"
                    style={college.trend === "up"
                      ? { background: "oklch(0.52 0.18 148 / 0.16)", color: "oklch(0.32 0.18 148)", border: "1px solid oklch(0.52 0.18 148 / 0.38)" }
                      : { background: "oklch(0.54 0.20 27  / 0.16)", color: "oklch(0.40 0.20 27)", border: "1px solid oklch(0.54 0.20 27  / 0.38)" }}>
                    {college.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    Rank {college.trend === "up" ? `+${college.trendChange}` : college.trendChange}
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 leading-tight max-w-10xl tracking-tight">
                {college.name}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-white/50 text-sm mb-2">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: T.gold }} />
                <span>{college.city}, {college.state}</span>
              </div>

              {/* Back */}
              <button type="button" onClick={onNavigateBack}
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-white/45 hover:text-white transition-colors group">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Rankings
              </button>
            </motion.div>

            {/* Right: score + compare */}
            <motion.div className="flex flex-row lg:flex-col items-center gap-5 lg:items-end"
              initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.48, delay: 0.10, ease: EASE }}>
              {/* <ScoreRing score={college.overallScore} /> */}
              <button type="button"
                onClick={() => onAddToCompare(collegeId)}
                className="font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 leading-none"
                style={isInCompare
                  ? { background: T.indigo, color: "#fff", border: `1px solid oklch(0.55 0.18 266 / 0.50)`, boxShadow: `0 0 0 3px oklch(0.46 0.19 266 / 0.20)` }
                  : { background: T.gold, color: T.navy, boxShadow: `0 4px 18px oklch(0.80 0.16 86 / 0.38)` }}>
                {isInCompare ? "✓ In Compare" : "+ Add to Compare"}
              </button>
            </motion.div>
          </div>

          {/* Quick stats strip */}
          <motion.div className="flex flex-wrap gap-3 mt-8"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.18 }}>
            <HeroStatCard icon={Medal} label="NIRF Rank" value={`${formatNirfRank(college.nirfRank)}`} sub="National Ranking" />
            <HeroStatCard icon={BarChart3} label="Overall Score" value={`${(college.overallScore ?? 0) > (college.finalScore ?? 0)
                ? college.overallScore
                : college.finalScore
              }`} sub="Platform Score" accent={T.gold} />
            <HeroStatCard icon={Users} label="Placement" value={`${college.placementPct}%`} sub="2024 Batch" />
            <HeroStatCard icon={DollarSign} label="Naac Grade" value={`${college.naacGrade}`} sub="Annual CTC" />
            {/* <HeroStatCard icon={Trophy} label="Naac score" value={`${college.avgPackageLPA}`} sub="Annual CTC" /> */}
          </motion.div>
        </div>
      </header>

      {/* ══════════════ TAB NAV ══════════════ */}
      <div ref={tabsRef} className="sticky top-0 z-40 bg-white"
        style={{
          borderBottom: `1px solid ${T.border}`,
          boxShadow: tabsSticky ? "0 2px 16px oklch(0.22 0.06 258 / 0.08)" : "none",
          transition: "box-shadow 0.3s ease",
        }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-none -mb-px">
            {TABS.map((tab, idx) => (
              <button key={tab.key} type="button"
                data-ocid={`college_detail.tab.${idx + 1}`}
                onClick={() => setActiveTab(tab.key)}
                className="relative shrink-0 px-5 py-4 text-sm font-semibold transition-all duration-200 whitespace-nowrap focus-visible:outline-none"
                style={{ color: activeTab === tab.key ? T.navy : T.muted }}>
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-full"
                    style={{ background: T.indigo }}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════ TAB PANELS ══════════════ */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div key="overview" variants={panelV} initial="hidden" animate="visible" exit="exit">
              <OverviewTab college={college} />
            </motion.div>
          )}
          {activeTab === "placement" && (
            <motion.div key="placement" variants={panelV} initial="hidden" animate="visible" exit="exit">
              {/* <PlacementTab college={college} totalPlaced={totalPlaced} companiesVisited={companiesVisited} /> */}
            </motion.div>
          )}
          {activeTab === "courses" && (
            <motion.div key="courses" variants={panelV} initial="hidden" animate="visible" exit="exit">
              <CoursesTab college={college} />
            </motion.div>
          )}
          {activeTab === "admission" && (
            <motion.div key="admission" variants={panelV} initial="hidden" animate="visible" exit="exit">
              <AdmissionTab college={college} />
            </motion.div>
          )}
          {activeTab === "facilities" && (
            <motion.div key="facilities" variants={panelV} initial="hidden" animate="visible" exit="exit">
              <FacilitiesTab college={college} />
            </motion.div>
          )}

          {activeTab === "tnea" && (
            <motion.div key="tnea" variants={panelV} initial="hidden" animate="visible" exit="exit">
              <TneaTab collegeId={collegeId} />
            </motion.div>
          )}

          {activeTab === "naac" && (
            <motion.div key="naac" variants={panelV} initial="hidden" animate="visible" exit="exit">
              <NaacTab collegeId={collegeId} />
            </motion.div>
          )};
        </AnimatePresence>
      </main>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="mt-12 py-8" style={{ borderTop: `1px solid ${T.border}`, background: "oklch(0.97 0.006 258)" }}>
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm"
          style={{ color: T.muted }}>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" style={{ color: T.indigo }} />
            <span>College Ranking Analytics Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   OVERVIEW TAB
═══════════════════════════════════════════════════════════════════════════ */
function OverviewTab({ college }: { college: College }) {
  // ✅ Title Case Function
  function toTitleCase(str: string) {
    return str
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  

  return (
    <motion.div variants={containerV} initial="hidden" animate="visible" className="space-y-8">

      {/* About */}
      <motion.div variants={itemV}>
        <Card>
          <SectionHeading icon={BookOpen} title="About the Institution" />

          <div className="space-y-4">
            {/* About Section */}
            {college.about &&
              college.about.split("\n\n").map((para) => (
                <p
                  key={para.slice(0, 40)}
                  className="leading-relaxed text-sm"
                  style={{ color: T.muted }}
                >
                  {para}
                </p>
              ))}

              

            {/* Address Section */}
            {college.naacAddress && (
              <div
                className="mt-4 pt-4"
                style={{ borderTop: `1px solid ${T.border}` }}
              >
                <p
                  className="text-xs font-semibold mb-2 flex items-center gap-2"
                  style={{ color: T.navy }}
                >
                  <MapPin className="w-4 h-4" style={{ color: T.indigo }} />
                  ADDRESS
                </p>

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: T.muted }}
                >
                  {toTitleCase(college.naacAddress)}
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Ranking overview */}
      <motion.div variants={itemV}>
        <h2 className="font-bold text-xl mb-4" style={{ color: T.navy }}>Ranking Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Award, label: "NAAC Accreditation", value: college.naacGrade, sub: "National Assessment Grade", accent: T.goldDeep, bg: "oklch(0.80 0.16 86  / 0.07)", border: "oklch(0.80 0.16 86  / 0.22)" },
            { icon: Trophy, label: "NIRF National Rank", value: `${formatNirfRank(college.nirfRank)}`, sub: "National Institutional Ranking", accent: T.indigo, bg: "oklch(0.46 0.19 266 / 0.06)", border: "oklch(0.46 0.19 266 / 0.18)" },
            { icon: Star, label: "Platform Score", value: `${college.overallScore}`, sub: "Combined Analytics Score", accent: T.navy, bg: "oklch(0.20 0.05 258 / 0.04)", border: "oklch(0.20 0.05 258 / 0.14)" },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl p-6 flex flex-col gap-3"
              style={{ background: card.bg, border: `1px solid ${card.border}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${card.accent}18` }}>
                <card.icon className="w-5 h-5" style={{ color: card.accent }} />
              </div>
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: T.muted }}>{card.label}</p>
                <p className="font-black text-3xl leading-none" style={{ color: card.accent }}>{card.value}</p>
                <p className="text-xs mt-1" style={{ color: T.muted }}>{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Key metrics */}
      <motion.div variants={itemV}>
        <h2 className="font-bold text-xl mb-4" style={{ color: T.navy }}>Key Metrics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricTile icon={BookOpen} label="Total Programmes" value={`${college.courses.length}`} sub="UG + PG" accent={T.indigo} />
          {/* <MetricTile icon={DollarSign} label="Avg Package" value={`${college.avgPackageLPA} LPA`} sub="2024 Batch" accent={T.goldDeep} /> */}
          <MetricTile icon={Users} label="Placement Rate" value={`${college.placementPct}%`} sub="2024 Batch" accent={T.green} />
          <MetricTile icon={Calendar} label="Established" value={`${college.established}`} sub={`${new Date().getFullYear() - college.established} years`} accent={T.navy} />
        </div>
      </motion.div>

      {/* Programmes offered */}
      <motion.div variants={itemV}>
        <Card>
          <SectionHeading icon={GraduationCap} title="Programmes Offered" accent={T.goldDeep} />
          <div className="flex flex-wrap gap-2.5">
            {college.courses.map((c) => (
              <span key={c.course_code}
                className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: `${T.indigo}0D`, border: `1px solid ${T.indigo}28`, color: T.indigo }}>
                {c.course_code}
              </span>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PLACEMENT TAB
═══════════════════════════════════════════════════════════════════════════ */
function PlacementTab({ college, totalPlaced, companiesVisited }: { college: College; totalPlaced: number; companiesVisited: number }) {
  return (
    <motion.div variants={containerV} initial="hidden" animate="visible" className="space-y-8">

      {/* KPI row */}
      <motion.div variants={itemV} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* <MetricTile icon={Trophy} label="Highest Package" value={`${college.highestPackageLPA} LPA`} accent={T.goldDeep} /> */}
        <MetricTile icon={Users} label="Students Placed" value={`${totalPlaced}+`} accent={T.indigo} />
        <MetricTile icon={Building2} label="Companies Visited" value={`${companiesVisited}+`} accent={T.navy} />
        {/* <MetricTile icon={DollarSign} label="Avg Package" value={`${college.avgPackageLPA} LPA`} accent={T.green} /> */}
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemV} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line chart */}
        {/* <Card>
          <h3 className="font-bold text-lg mb-1" style={{ color: T.navy }}>Placement Trend (2020–2024)</h3>
          <p className="text-xs mb-5" style={{ color: T.muted }}>Placement percentage over last 5 years</p>
          <div data-ocid="college_detail.chart_point" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              {/* <LineChart data={college.placementTrend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}> */}
        {/* <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: T.muted }} />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11, fill: T.muted }} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<LineTooltip />} />
                <Line type="monotone" dataKey="pct" stroke={T.indigo} strokeWidth={2.5}
                  dot={{ fill: T.indigo, r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: T.indigo, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card> */}

        {/* Bar chart */}
        <Card>
          <h3 className="font-bold text-lg mb-1" style={{ color: T.navy }}>Salary Distribution</h3>
          <p className="text-xs mb-5" style={{ color: T.muted }}>Number of students per salary band</p>
          <div data-ocid="college_detail.chart_point" style={{ height: 220 }}>
            {/* <ResponsiveContainer width="100%" height="100%"> */}
            {/* <BarChart data={college.salaryBands} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}> */}
            {/* <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: T.muted }} />
                <YAxis tick={{ fontSize: 11, fill: T.muted }} />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill={T.gold} /> */}
            {/* </BarChart> */}
            {/* </ResponsiveContainer> */}
          </div>
        </Card>
      </motion.div>

      {/* Year-wise table */}
      <motion.div variants={itemV} className="bg-white rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${T.border}`, boxShadow: "0 1px 8px oklch(0.22 0.06 258 / 0.06)" }}>
        <div className="px-6 py-5" style={{ borderBottom: `1px solid ${T.border}` }}>
          <h3 className="font-bold text-lg" style={{ color: T.navy }}>Year-wise Placement Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: T.surface }}>
                {["Year", "Placement %", "Avg Package", "Change"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: T.muted }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            {/* <tbody>
              {[...college.placementTrend].reverse().map((row, i) => {
                const prev = college.placementTrend[college.placementTrend.length - 2 - i];
                const pctChg = prev ? +(row.pct - prev.pct).toFixed(1) : null;
                const lpaChg = prev ? +(row.avgLPA - prev.avgLPA).toFixed(1) : null;
                return (
                  <tr key={row.year} data-ocid="college_detail.row"
                    style={{ borderTop: `1px solid ${T.border}`, background: i % 2 === 0 ? "#fff" : T.surface }}>
                    <td className="px-6 py-4">
                      <span className="font-bold" style={{ color: T.navy }}>{row.year}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold" style={{ color: T.navy }}>{row.pct}%</span>
                        <div className="flex-1 max-w-[80px] h-1.5 rounded-full overflow-hidden"
                          style={{ background: `${T.border}` }}>
                          <div className="h-full rounded-full"
                            style={{ width: `${row.pct}%`, background: `linear-gradient(90deg, ${T.indigo}, ${T.gold})` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold" style={{ color: T.navy }}>{row.avgLPA} LPA</td>
                    <td className="px-6 py-4">
                      {pctChg !== null ? (
                        <span className="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={pctChg >= 0
                            ? { background: "oklch(0.52 0.18 148 / 0.10)", color: "oklch(0.30 0.18 148)" }
                            : { background: "oklch(0.54 0.20 27  / 0.10)", color: "oklch(0.38 0.20 27)" }}>
                          {pctChg >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {pctChg >= 0 ? "+" : ""}{pctChg}% | {lpaChg !== null && (lpaChg >= 0 ? "+" : "")}{lpaChg} LPA
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: T.muted }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody> */}
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COURSES TAB
═══════════════════════════════════════════════════════════════════════════ */


function CoursesTab({ college }: { college: College }) {
  const cutoffs = college.courses.map(c => c.avg_cutoff);

  const maxCutoff = cutoffs.length ? Math.max(...cutoffs) : 0;
  const minCutoff = cutoffs.length ? Math.min(...cutoffs) : 0;
  return (
    <motion.div variants={containerV} initial="hidden" animate="visible" className="space-y-6">

      {/* Fee banner */}
      <motion.div variants={itemV}>
        <div className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
          style={{ background: `linear-gradient(135deg, ${T.heroBg}, oklch(0.24 0.08 262))` }}>
          <div>
            <p className="text-white/55 text-sm font-medium mb-1">Annual CutOff Range</p>
            {/* <p className="font-black text-3xl text-white tracking-tight">
              ₹{maxCutoff}K – ₹{min}K
            </p> */}
            <p className="text-white/45 text-xs mt-1">Per academic year (approx.)</p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="font-black text-2xl" style={{ color: T.gold }}>{minCutoff}</p>
              <p className="text-white/80 text-xs mt-0.5">Min cutoff</p>
            </div>
            <div className="w-px self-stretch" style={{ background: "oklch(1 0 0 / 0.50)" }} />
            <div className="text-center">
              <p className="font-black text-2xl" style={{ color: T.gold }}>{maxCutoff}</p>
              <p className="text-white/80 text-xs mt-0.5">Max cutoff</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Courses table */}
      <motion.div variants={itemV} className="bg-white rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${T.border}`, boxShadow: "0 1px 8px oklch(0.22 0.06 258 / 0.06)" }}>
        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${T.border}` }}>
          <h3 className="font-bold text-lg" style={{ color: T.navy }}>Programme Details</h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: `${T.indigo}0F`, border: `1px solid ${T.indigo}28`, color: T.indigo }}>
            {/* {college.coursesDetailed.length} Programmes */}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: T.surface }}>
                {["Programme", "Degree", "Duration", "Average Cutoff"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap"
                    style={{ color: T.muted }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {college.courses.map((course, i) => (
                <tr key={`${course.course_code}-${i}`} data-ocid="college_detail.row"
                  style={{ borderTop: `1px solid ${T.border}`, background: i % 2 === 0 ? "#fff" : T.surface }}>
                  <td className="px-5 py-4">
                    <span className="font-semibold" style={{ color: T.navy }}>{course.course_name.toUpperCase()}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold"
                      style={{ background: `${T.indigo}0F`, border: `1px solid ${T.indigo}28`, color: T.indigo }}>
                      {DEGREE_MAP[course.course_name] || "B.E"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5" style={{ color: T.muted }}>
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>4 years</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold" style={{ color: T.navy }}>{course.avg_cutoff}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ADMISSION TAB
═══════════════════════════════════════════════════════════════════════════ */
function AdmissionTab({ college }: { college: College }) {
  return (
    <motion.div variants={containerV} initial="hidden" animate="visible">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Process */}
        <motion.div variants={itemV}>
          <Card className="h-full">
            <SectionHeading icon={BookOpen} title="Admission Process" />
            <div className="space-y-4">
              {college.admissionInfo?.process?.map((step, idx) => (
                <div key={step.slice(0, 30)} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-black text-xs text-white"
                    style={{ background: T.indigo, boxShadow: `0 2px 8px ${T.indigo}50` }}>
                    {idx + 1}
                  </div>
                  <p className="text-sm leading-relaxed pt-0.5" style={{ color: T.muted }}>{step}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Eligibility */}
        <motion.div variants={itemV}>
          <Card className="h-full">
            <SectionHeading icon={CheckCircle2} title="Eligibility Criteria" accent={T.green} />
            <div className="space-y-3">
              {college.admissionInfo?.eligibility?.map((item) => (
                <div key={item.slice(0, 30)} className="flex gap-3 items-start">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: T.green }} />
                  <p className="text-sm leading-relaxed" style={{ color: T.muted }}>{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Key dates */}
        <motion.div variants={itemV}>
          <Card className="h-full">
            <SectionHeading icon={Calendar} title="Key Dates" accent={T.goldDeep} />
            <div className="relative pl-5">
              {/* Timeline line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 rounded-full"
                style={{ background: `${T.gold}55` }} />
              <div className="space-y-5">
                {college.admissionInfo?.keyDates?.map((kd) => (
                  <div key={kd.event} className="relative">
                    <div className="absolute -left-[25px] top-[5px] w-3 h-3 rounded-full border-2"
                      style={{ background: "#fff", borderColor: T.gold }} />
                    <p className="text-xs font-semibold" style={{ color: T.muted }}>{kd.event}</p>
                    <p className="font-bold text-sm mt-0.5" style={{ color: T.navy }}>{kd.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FACILITIES TAB
═══════════════════════════════════════════════════════════════════════════ */
function FacilitiesTab({ college }: { college: College }) {
  // const maxPkg = Math.max(...college.topRecruiters.map((r) => r.avgPackage));

  return (
    <motion.div variants={containerV} initial="hidden" animate="visible" className="space-y-10">

      {/* Facilities grid */}
      <motion.div variants={itemV}>
        <h2 className="font-bold text-xl mb-5" style={{ color: T.navy }}>Campus Facilities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {college?.facilities?.map((fac) => (
            <motion.div key={fac.name} variants={itemV}
              whileHover={{ y: -3, boxShadow: `0 8px 24px oklch(0.22 0.06 258 / 0.10)` }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-2xl border p-5 flex flex-col gap-3"
              style={{ borderColor: T.border }}>
              <span className="text-3xl">{fac.icon}</span>
              <div>
                <p className="font-bold text-sm mb-1" style={{ color: T.navy }}>{fac.name}</p>
                <p className="text-xs leading-relaxed" style={{ color: T.muted }}>{fac.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}