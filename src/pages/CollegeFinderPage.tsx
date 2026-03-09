import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Switch } from "../components/ui/switch";
import { COLLEGES, type College } from "../data/colleges";
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
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CollegeFinderPageProps {
  onNavigateHome: () => void;
  onNavigateToDetails: (id: number) => void;
  onNavigateToCompare: (ids: number[]) => void;
}

interface FinderInputs {
  cutoffScore: number;
  academicPct: number;
  category: "general" | "obc" | "sc_st" | "ews";
  degreeType: "engineering" | "management" | "medical" | "arts";
  specialization: string;
  preferredState: string;
  preferredCity: string;
  maxAnnualFee: number;
  scholarshipPreference: boolean;
  collegeTypes: ("IIT" | "NIT" | "Deemed" | "State" | "Private")[];
  minPlacementPct: number;
  nirfTopN: "any" | "top10" | "top25" | "top50" | "top100";
  hostelRequired: boolean;
}

interface CollegeWithScore extends College {
  matchScore: number;
  scoreBreakdown: {
    cutoff: number;
    course: number;
    location: number;
    budget: number;
    prefs: number;
  };
}

type SortKey = "matchScore" | "nirfRank" | "avgPackageLPA" | "feeMin";

const SPECIALIZATIONS: Record<string, string[]> = {
  engineering: [
    "Any Specialization",
    "CSE",
    "ECE",
    "Mechanical",
    "Civil",
    "EEE",
    "IT",
    "Data Science",
    "AI & ML",
  ],
  management: ["Any Specialization", "MBA", "BBA"],
  medical: ["Any Specialization", "MBBS", "BDS"],
  arts: ["Any Specialization", "B.Sc", "B.A", "B.Com"],
};

const STATES = [
  "Any State",
  "Tamil Nadu",
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Telangana",
  "West Bengal",
  "Rajasthan",
  "Uttar Pradesh",
];

const CITIES_BY_STATE: Record<string, string[]> = {
  "Tamil Nadu": [
    "Any City",
    "Chennai",
    "Coimbatore",
    "Vellore",
    "Trichy",
    "Thanjavur",
  ],
  Maharashtra: ["Any City", "Mumbai", "Pune", "Nagpur"],
  Delhi: ["Any City", "New Delhi"],
  Karnataka: ["Any City", "Bangalore", "Mysore"],
  Telangana: ["Any City", "Hyderabad"],
  "West Bengal": ["Any City", "Kolkata"],
  Rajasthan: ["Any City", "Jaipur"],
  "Uttar Pradesh": ["Any City", "Lucknow", "Kanpur"],
};

const NIRF_TOP_N_LABELS: Record<string, string> = {
  any: "Any Rank",
  top10: "Top 10",
  top25: "Top 25",
  top50: "Top 50",
  top100: "Top 100",
};

function getNirfLimit(nirfTopN: FinderInputs["nirfTopN"]): number {
  switch (nirfTopN) {
    case "top10":
      return 10;
    case "top25":
      return 25;
    case "top50":
      return 50;
    case "top100":
      return 100;
    default:
      return Number.POSITIVE_INFINITY;
  }
}

function computeMatchScore(
  college: College,
  inputs: FinderInputs,
): CollegeWithScore {
  let cutoffScore = 0;
  let courseScore = 0;
  let locationScore = 0;
  let budgetScore = 0;
  let prefsScore = 0;

  // ── Cutoff / Score eligibility (25 pts) ──────────────────────────────────
  const cutoffRequirements: Record<College["type"], number> = {
    IIT: 170,
    NIT: 150,
    Deemed: 120,
    State: 100,
    Private: 90,
  };
  const req = cutoffRequirements[college.type];
  if (inputs.cutoffScore >= req) {
    cutoffScore = 25;
  } else if (inputs.cutoffScore >= req - 20) {
    cutoffScore = Math.round(25 * (1 - (req - inputs.cutoffScore) / 20));
  }

  // ── Course match (25 pts) ─────────────────────────────────────────────────
  const degreeKeywords: Record<string, string[]> = {
    engineering: ["B.E", "B.Tech", "M.E", "M.Tech", "BE", "BTech"],
    management: ["MBA", "BBA"],
    medical: ["MBBS", "BDS", "MBBS/BDS"],
    arts: ["B.Sc", "B.A", "B.Com", "BSc", "BA", "BCom"],
  };
  const keywords = degreeKeywords[inputs.degreeType] || [];
  const hasDegreeMatch = college.courses.some((c) =>
    keywords.some((k) => c.toLowerCase().includes(k.toLowerCase())),
  );
  if (hasDegreeMatch) {
    if (
      inputs.specialization &&
      inputs.specialization !== "Any Specialization"
    ) {
      const hasSpec = college.coursesDetailed.some((cd) =>
        cd.name.toLowerCase().includes(inputs.specialization.toLowerCase()),
      );
      courseScore = hasSpec ? 25 : 15;
    } else {
      courseScore = 25;
    }
  }

  // ── Location match (20 pts) ───────────────────────────────────────────────
  if (!inputs.preferredState || inputs.preferredState === "Any State") {
    locationScore = 20;
  } else if (college.state === inputs.preferredState) {
    if (!inputs.preferredCity || inputs.preferredCity === "Any City") {
      locationScore = 20;
    } else if (college.city === inputs.preferredCity) {
      locationScore = 20;
    } else {
      locationScore = 12;
    }
  }

  // ── Budget match (15 pts) ─────────────────────────────────────────────────
  const feeInRupees = college.feeRange.min * 1000;
  const maxFee = inputs.maxAnnualFee;
  if (feeInRupees <= maxFee) {
    budgetScore = 15;
  } else if (feeInRupees <= maxFee * 1.2) {
    budgetScore = Math.round(
      15 * (1 - (feeInRupees - maxFee) / (maxFee * 0.2)),
    );
  }

  // ── Additional preferences (15 pts) ──────────────────────────────────────
  if (
    inputs.collegeTypes.length === 0 ||
    inputs.collegeTypes.includes(college.type)
  ) {
    prefsScore += 5;
  }
  if (college.placementPct >= inputs.minPlacementPct) {
    prefsScore += 5;
  }
  const hasHostel = college.facilities.some((f) =>
    f.name.toLowerCase().includes("hostel"),
  );
  if (!inputs.hostelRequired || hasHostel) {
    prefsScore += 5;
  }

  const total = Math.min(
    100,
    cutoffScore + courseScore + locationScore + budgetScore + prefsScore,
  );

  return {
    ...college,
    matchScore: total,
    scoreBreakdown: {
      cutoff: cutoffScore,
      course: courseScore,
      location: locationScore,
      budget: budgetScore,
      prefs: prefsScore,
    },
  };
}

function getMatchColor(score: number): string {
  if (score >= 80) return "oklch(0.55 0.18 145)";
  if (score >= 60) return "oklch(0.72 0.17 75)";
  return "oklch(0.55 0.22 25)";
}

function getMatchLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Low";
}

function getTypeBadgeStyle(type: College["type"]) {
  switch (type) {
    case "IIT":
      return "bg-[oklch(0.45_0.18_265/0.15)] text-[oklch(0.28_0.18_265)] border border-[oklch(0.45_0.18_265/0.35)]";
    case "NIT":
      return "bg-[oklch(0.55_0.18_165/0.15)] text-[oklch(0.30_0.18_165)] border border-[oklch(0.55_0.18_165/0.35)]";
    case "Deemed":
      return "bg-[oklch(0.80_0.15_75/0.18)] text-[oklch(0.42_0.15_75)] border border-[oklch(0.78_0.15_85/0.35)]";
    case "State":
      return "bg-[oklch(0.55_0.05_240/0.15)] text-[oklch(0.32_0.05_240)] border border-[oklch(0.55_0.05_240/0.35)]";
    case "Private":
      return "bg-[oklch(0.55_0.18_300/0.12)] text-[oklch(0.32_0.18_300)] border border-[oklch(0.55_0.18_300/0.30)]";
  }
}

function getNaacBadgeStyle(grade: College["naacGrade"]) {
  switch (grade) {
    case "A++":
      return "bg-gold/15 text-[oklch(0.48_0.15_75)] border border-gold/40 font-bold";
    case "A+":
      return "bg-[oklch(0.55_0.18_145/0.15)] text-[oklch(0.30_0.18_145)] border border-[oklch(0.55_0.18_145/0.40)] font-bold";
    case "A":
      return "bg-indigo/10 text-indigo border border-indigo/30 font-bold";
    case "B++":
      return "bg-[oklch(0.55_0.05_240/0.12)] text-[oklch(0.38_0.05_240)] border border-[oklch(0.55_0.05_240/0.30)] font-bold";
  }
}

function getRankMedalStyle(rank: number) {
  if (rank === 1)
    return {
      bg: "radial-gradient(ellipse at 30% 30%, oklch(0.90 0.18 88), oklch(0.72 0.18 72))",
      text: "oklch(0.30 0.08 70)",
      shadow: "0 4px 16px oklch(0.78 0.15 85 / 0.5)",
    };
  if (rank === 2)
    return {
      bg: "radial-gradient(ellipse at 30% 30%, oklch(0.88 0.01 250), oklch(0.70 0.01 250))",
      text: "oklch(0.30 0.02 250)",
      shadow: "0 4px 16px oklch(0.70 0.01 250 / 0.45)",
    };
  if (rank === 3)
    return {
      bg: "radial-gradient(ellipse at 30% 30%, oklch(0.78 0.12 55), oklch(0.60 0.12 52))",
      text: "oklch(0.25 0.08 50)",
      shadow: "0 4px 16px oklch(0.65 0.12 55 / 0.45)",
    };
  return {
    bg: "oklch(0.22 0.06 255)",
    text: "oklch(0.98 0.005 240)",
    shadow: "none",
  };
}

function MatchScoreRing({
  score,
  size = 72,
}: { score: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = getMatchColor(score);

  return (
    <svg
      width={size}
      height={size}
      className="rotate-[-90deg]"
      role="img"
      aria-label={`Match score: ${score}%`}
    >
      <title>Match score: {score}%</title>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="oklch(0.22 0.06 255 / 0.12)"
        strokeWidth={7}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
      <text
        x={size / 2}
        y={size / 2 + 5}
        textAnchor="middle"
        fill={color}
        fontSize={size * 0.24}
        fontWeight={700}
        style={{
          transform: "rotate(90deg)",
          transformOrigin: `${size / 2}px ${size / 2}px`,
          fontFamily: "Bricolage Grotesque, sans-serif",
        }}
        className="rotate-90"
      >
        {score}%
      </text>
    </svg>
  );
}

// ─── Section: Form ────────────────────────────────────────────────────────────

function FormSection({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-4 w-0.5 rounded-full bg-gold" />
        <h3 className="font-heading font-bold text-navy text-sm uppercase tracking-widest">
          {label}
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div className="sm:col-span-2 space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-foreground">{label}</Label>
        <span className="text-sm font-bold text-indigo bg-indigo/10 px-2.5 py-0.5 rounded-full border border-indigo/20">
          {format(value)}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CollegeFinderPage({
  onNavigateHome,
  onNavigateToDetails,
  onNavigateToCompare,
}: CollegeFinderPageProps) {
  const resultsRef = useRef<HTMLDivElement>(null);

  const [inputs, setInputs] = useState<FinderInputs>({
    cutoffScore: 140,
    academicPct: 75,
    category: "general",
    degreeType: "engineering",
    specialization: "Any Specialization",
    preferredState: "Any State",
    preferredCity: "Any City",
    maxAnnualFee: 300000,
    scholarshipPreference: false,
    collegeTypes: [],
    minPlacementPct: 60,
    nirfTopN: "any",
    hostelRequired: false,
  });

  const [results, setResults] = useState<CollegeWithScore[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("matchScore");
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [shortlistOpen, setShortlistOpen] = useState(false);

  const update = useCallback(
    <K extends keyof FinderInputs>(key: K, value: FinderInputs[K]) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const cities =
    inputs.preferredState !== "Any State"
      ? (CITIES_BY_STATE[inputs.preferredState] ?? ["Any City"])
      : ["Any City"];

  const specializations = SPECIALIZATIONS[inputs.degreeType] ?? [
    "Any Specialization",
  ];

  const handleFind = async () => {
    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 600));

    const nirfLimit = getNirfLimit(inputs.nirfTopN);
    const scored = COLLEGES.filter((c) => c.nirfRank <= nirfLimit)
      .map((c) => computeMatchScore(c, inputs))
      .filter((c) => c.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    setResults(scored);
    setIsAnalyzing(false);
    setSortKey("matchScore");

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const sortedResults = useMemo(() => {
    if (!results) return null;
    return [...results].sort((a, b) => {
      switch (sortKey) {
        case "matchScore":
          return b.matchScore - a.matchScore;
        case "nirfRank":
          return a.nirfRank - b.nirfRank;
        case "avgPackageLPA":
          return b.avgPackageLPA - a.avgPackageLPA;
        case "feeMin":
          return a.feeRange.min - b.feeRange.min;
      }
    });
  }, [results, sortKey]);

  const toggleSave = (id: number) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleCollegeType = (
    type: "IIT" | "NIT" | "Deemed" | "State" | "Private",
  ) => {
    setInputs((prev) => ({
      ...prev,
      collegeTypes: prev.collegeTypes.includes(type)
        ? prev.collegeTypes.filter((t) => t !== type)
        : [...prev.collegeTypes, type],
    }));
  };

  const savedColleges = COLLEGES.filter((c) => savedIds.includes(c.id));
  const top3Results = sortedResults?.slice(0, 3) ?? [];

  // Chart data
  const matchBarData =
    sortedResults?.slice(0, 8).map((c) => ({
      name: c.shortName,
      score: c.matchScore,
      fill: getMatchColor(c.matchScore),
    })) ?? [];

  const packageBarData =
    sortedResults?.slice(0, 8).map((c) => ({
      name: c.shortName,
      pkg: c.avgPackageLPA,
    })) ?? [];

  const trendData = top3Results.flatMap((c) =>
    c.placementTrend.map((t) => ({ year: t.year, [c.shortName]: t.avgLPA })),
  );
  const trendYears = [...new Set(trendData.map((d) => d.year))].sort();
  const trendChartData = trendYears.map((yr) => {
    const row: Record<string, number | string> = { year: yr };
    for (const c of top3Results) {
      const pt = c.placementTrend.find((t) => t.year === yr);
      if (pt) row[c.shortName] = pt.avgLPA;
    }
    return row;
  });
  const trendColors = [
    "oklch(0.78 0.15 85)",
    "oklch(0.45 0.18 265)",
    "oklch(0.55 0.18 145)",
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      {/* ─── Hero Banner ──────────────────────────────────────────────────────── */}
      <section className="relative bg-navy overflow-hidden pt-16">
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-40" />
        {/* Radial glows */}
        <div
          className="absolute top-0 right-[15%] w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.45 0.18 265 / 0.22) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-[10%] w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.78 0.15 85 / 0.15) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 container mx-auto px-4 pt-10 pb-12">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1.5 text-white/50 text-xs mb-8"
          >
            <button
              type="button"
              data-ocid="finder.home_link"
              onClick={onNavigateHome}
              className="flex items-center gap-1 hover:text-gold transition-colors"
            >
              <Home className="w-3 h-3" />
              Home
            </button>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <span className="text-gold font-semibold">
              Smart College Finder
            </span>
          </motion.nav>

          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 mb-5"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span className="text-gold text-xs font-bold tracking-widest uppercase">
                AI-Powered Matching
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="heading-display text-4xl md:text-5xl lg:text-6xl text-white mb-4"
            >
              Smart <span className="text-gradient-gold">College Finder</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="text-white/70 text-base md:text-lg leading-relaxed mb-2 max-w-xl"
            >
              Find the best colleges that match your academic performance and
              preferences.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="text-white/50 text-sm leading-relaxed mb-8 max-w-lg"
            >
              Enter your details below and get personalized college
              recommendations instantly.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap gap-3"
            >
              {[
                { icon: BarChart3, label: "20+ Colleges Analyzed" },
                { icon: Target, label: "7 Match Parameters" },
                { icon: Zap, label: "Instant Results" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 bg-white/8 border border-white/12 rounded-full px-3 py-1.5"
                >
                  <Icon className="w-3.5 h-3.5 text-gold" />
                  <span className="text-white/80 text-xs font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Input Form ───────────────────────────────────────────────────────── */}
      <section className="bg-muted/30 py-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-card border border-border overflow-hidden"
          >
            {/* Form header */}
            <div className="px-6 pt-6 pb-4 border-b border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo/10 flex items-center justify-center flex-shrink-0">
                <SlidersHorizontal
                  className="w-4.5 h-4.5 text-indigo"
                  style={{ width: 18, height: 18 }}
                />
              </div>
              <div>
                <h2 className="font-heading font-bold text-navy text-lg">
                  Your Preferences
                </h2>
                <p className="text-muted-foreground text-xs">
                  Fill in your details to get personalized recommendations
                </p>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Academic Details */}
              <FormSection label="Academic Details">
                <SliderField
                  label="TNEA Cutoff / Entrance Score"
                  value={inputs.cutoffScore}
                  min={0}
                  max={200}
                  step={1}
                  format={(v) => `${v} / 200`}
                  onChange={(v) => update("cutoffScore", v)}
                  hint="Your TNEA cutoff marks or JEE/entrance exam score"
                />
                <SliderField
                  label="Academic Percentage (%)"
                  value={inputs.academicPct}
                  min={0}
                  max={100}
                  step={1}
                  format={(v) => `${v}%`}
                  onChange={(v) => update("academicPct", v)}
                />
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Category</Label>
                  <Select
                    value={inputs.category}
                    onValueChange={(v) =>
                      update("category", v as FinderInputs["category"])
                    }
                  >
                    <SelectTrigger
                      data-ocid="finder.category_select"
                      className="bg-background"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="obc">OBC</SelectItem>
                      <SelectItem value="sc_st">SC / ST</SelectItem>
                      <SelectItem value="ews">EWS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormSection>

              <div className="border-t border-border/60" />

              {/* Course Preference */}
              <FormSection label="Course Preference">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Degree Type</Label>
                  <Select
                    value={inputs.degreeType}
                    onValueChange={(v) => {
                      update("degreeType", v as FinderInputs["degreeType"]);
                      update("specialization", "Any Specialization");
                    }}
                  >
                    <SelectTrigger
                      data-ocid="finder.degree_select"
                      className="bg-background"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="arts">Arts &amp; Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Course Specialization
                  </Label>
                  <Select
                    value={inputs.specialization}
                    onValueChange={(v) => update("specialization", v)}
                  >
                    <SelectTrigger
                      data-ocid="finder.specialization_select"
                      className="bg-background"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </FormSection>

              <div className="border-t border-border/60" />

              {/* Location Preference */}
              <FormSection label="Location Preference">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Preferred State
                  </Label>
                  <Select
                    value={inputs.preferredState}
                    onValueChange={(v) => {
                      update("preferredState", v);
                      update("preferredCity", "Any City");
                    }}
                  >
                    <SelectTrigger
                      data-ocid="finder.state_select"
                      className="bg-background"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Preferred City
                  </Label>
                  <Select
                    value={inputs.preferredCity}
                    onValueChange={(v) => update("preferredCity", v)}
                    disabled={inputs.preferredState === "Any State"}
                  >
                    <SelectTrigger
                      data-ocid="finder.city_select"
                      className="bg-background"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </FormSection>

              <div className="border-t border-border/60" />

              {/* Budget Preference */}
              <FormSection label="Budget Preference">
                <SliderField
                  label="Maximum Annual Fee"
                  value={inputs.maxAnnualFee}
                  min={50000}
                  max={500000}
                  step={10000}
                  format={(v) => `₹${(v / 100000).toFixed(1)} L`}
                  onChange={(v) => update("maxAnnualFee", v)}
                  hint="Per year tuition fee limit"
                />
                <div className="flex items-center gap-3 pt-1">
                  <Checkbox
                    id="scholarship"
                    data-ocid="finder.scholarship_checkbox"
                    checked={inputs.scholarshipPreference}
                    onCheckedChange={(v) =>
                      update("scholarshipPreference", !!v)
                    }
                  />
                  <Label
                    htmlFor="scholarship"
                    className="text-sm cursor-pointer"
                  >
                    I prefer colleges offering scholarships
                  </Label>
                </div>
              </FormSection>

              <div className="border-t border-border/60" />

              {/* Additional Preferences */}
              <FormSection label="Additional Preferences">
                {/* College Type checkboxes */}
                <div className="sm:col-span-2 space-y-2">
                  <Label className="text-sm font-semibold">
                    College Type (select all that apply)
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(
                      ["IIT", "NIT", "Deemed", "State", "Private"] as const
                    ).map((type) => (
                      <button
                        key={type}
                        type="button"
                        data-ocid="finder.type_toggle"
                        onClick={() => toggleCollegeType(type)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                          inputs.collegeTypes.includes(type)
                            ? "bg-navy text-white border-navy shadow-sm"
                            : "bg-background text-muted-foreground border-border hover:border-navy/40 hover:text-navy"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                    {inputs.collegeTypes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => update("collegeTypes", [])}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-dashed border-muted-foreground/30 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {inputs.collegeTypes.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      All types selected (leave blank for no preference)
                    </p>
                  )}
                </div>

                <SliderField
                  label="Minimum Placement %"
                  value={inputs.minPlacementPct}
                  min={0}
                  max={100}
                  step={5}
                  format={(v) => `${v}%`}
                  onChange={(v) => update("minPlacementPct", v)}
                />

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    NIRF Rank Range
                  </Label>
                  <Select
                    value={inputs.nirfTopN}
                    onValueChange={(v) =>
                      update("nirfTopN", v as FinderInputs["nirfTopN"])
                    }
                  >
                    <SelectTrigger
                      data-ocid="finder.nirf_select"
                      className="bg-background"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        ["any", "top10", "top25", "top50", "top100"] as const
                      ).map((k) => (
                        <SelectItem key={k} value={k}>
                          {NIRF_TOP_N_LABELS[k]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between bg-muted/40 border border-border rounded-xl px-4 py-3">
                  <div>
                    <Label className="text-sm font-semibold">
                      Hostel Required
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Only show colleges with hostel facilities
                    </p>
                  </div>
                  <Switch
                    data-ocid="finder.hostel_switch"
                    checked={inputs.hostelRequired}
                    onCheckedChange={(v) => update("hostelRequired", v)}
                  />
                </div>
              </FormSection>
            </div>

            {/* Submit */}
            <div className="px-6 py-5 bg-muted/20 border-t border-border">
              <Button
                data-ocid="finder.submit_button"
                onClick={handleFind}
                disabled={isAnalyzing}
                className="w-full bg-gold text-navy hover:brightness-95 font-bold text-base py-6 rounded-xl shadow-sm transition-all"
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

      {/* ─── Results Section ──────────────────────────────────────────────────── */}
      <div ref={resultsRef} />
      <AnimatePresence mode="wait">
        {sortedResults !== null && (
          <motion.section
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-muted/30 pb-10"
          >
            <div className="container mx-auto px-4">
              {/* Results header */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-4"
              >
                <div className="flex items-center gap-3">
                  <h2 className="font-heading font-bold text-navy text-xl md:text-2xl">
                    Your Personalized Recommendations
                  </h2>
                  <Badge
                    className="bg-indigo/10 text-indigo border border-indigo/25 font-bold"
                    data-ocid="finder.results_section"
                  >
                    {sortedResults.length} matches
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm whitespace-nowrap">
                    Sort by:
                  </span>
                  <Select
                    value={sortKey}
                    onValueChange={(v) => setSortKey(v as SortKey)}
                  >
                    <SelectTrigger
                      data-ocid="finder.sort_select"
                      className="w-[170px] bg-white text-sm h-9"
                    >
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
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
                    <Search className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                  <h3 className="font-heading font-bold text-navy text-xl mb-2">
                    No Matches Found
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                    Try adjusting your filters — lower the minimum placement %,
                    increase the budget, or select "Any State" for location.
                  </p>
                  <Button
                    data-ocid="finder.adjust_filters_button"
                    variant="outline"
                    className="border-2 border-navy text-navy hover:bg-navy/5 font-semibold"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Adjust Filters
                  </Button>
                </motion.div>
              ) : (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                  data-ocid="finder.list"
                >
                  {sortedResults.map((college, idx) => {
                    const medalStyle = getRankMedalStyle(idx + 1);
                    const isSaved = savedIds.includes(college.id);
                    return (
                      <motion.article
                        key={college.id}
                        data-ocid={`finder.item.${idx + 1}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        className="bg-white border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group flex flex-col"
                      >
                        {/* Card top */}
                        <div className="p-5 pb-4 flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            {/* Rank medal */}
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{
                                background: medalStyle.bg,
                                color: medalStyle.text,
                                boxShadow: medalStyle.shadow,
                              }}
                            >
                              {idx < 3
                                ? ["🥇", "🥈", "🥉"][idx]
                                : `#${idx + 1}`}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-heading font-bold text-navy text-sm leading-tight line-clamp-2 group-hover:text-indigo transition-colors">
                                {college.name}
                              </h3>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full ${getTypeBadgeStyle(college.type)}`}
                                >
                                  {college.type}
                                </span>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full ${getNaacBadgeStyle(college.naacGrade)}`}
                                >
                                  NAAC {college.naacGrade}
                                </span>
                              </div>
                            </div>
                            {/* Bookmark */}
                            <button
                              type="button"
                              data-ocid={`finder.toggle.${idx + 1}`}
                              onClick={() => toggleSave(college.id)}
                              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                isSaved
                                  ? "bg-gold/15 text-gold hover:bg-gold/25"
                                  : "bg-muted text-muted-foreground hover:bg-muted hover:text-foreground"
                              }`}
                              title={
                                isSaved
                                  ? "Remove from shortlist"
                                  : "Add to shortlist"
                              }
                            >
                              {isSaved ? (
                                <BookmarkCheck className="w-4 h-4" />
                              ) : (
                                <Bookmark className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-4">
                            <MapPin className="w-3 h-3" />
                            {college.city}, {college.state}
                          </div>

                          {/* Match score + stats */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                              <MatchScoreRing
                                score={college.matchScore}
                                size={68}
                              />
                              <div
                                className="absolute -bottom-1 -right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                style={{
                                  background: `${getMatchColor(college.matchScore)}22`,
                                  color: getMatchColor(college.matchScore),
                                  border: `1px solid ${getMatchColor(college.matchScore)}44`,
                                }}
                              >
                                {getMatchLabel(college.matchScore)}
                              </div>
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-y-2 gap-x-3">
                              <div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                  Avg Pkg
                                </div>
                                <div className="font-bold text-navy text-sm">
                                  ₹{college.avgPackageLPA}L
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                  Placement
                                </div>
                                <div className="font-bold text-navy text-sm">
                                  {college.placementPct}%
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                  Annual Fee
                                </div>
                                <div className="font-bold text-navy text-sm">
                                  ₹{college.feeRange.min}K–
                                  {college.feeRange.max}K
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                  NIRF Rank
                                </div>
                                <div className="font-bold text-navy text-sm">
                                  #{college.nirfRank}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Courses chips */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {college.courses.slice(0, 3).map((c) => (
                              <span
                                key={c}
                                className="text-[10px] px-2 py-0.5 bg-muted/60 text-muted-foreground rounded-full border border-border"
                              >
                                {c}
                              </span>
                            ))}
                            {college.courses.length > 3 && (
                              <span className="text-[10px] px-2 py-0.5 bg-muted/40 text-muted-foreground/70 rounded-full border border-border border-dashed">
                                +{college.courses.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="px-4 pb-4 pt-3 border-t border-border/60 flex gap-2">
                          <Button
                            data-ocid={`finder.primary_button.${idx + 1}`}
                            size="sm"
                            className="flex-1 bg-indigo text-white hover:bg-indigo/90 text-xs font-semibold"
                            onClick={() => onNavigateToDetails(college.id)}
                          >
                            View Details
                          </Button>
                          <Button
                            data-ocid={`finder.secondary_button.${idx + 1}`}
                            size="sm"
                            variant="outline"
                            className="flex-1 border-navy/30 text-navy hover:bg-navy/5 text-xs font-semibold"
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

      {/* ─── Visual Insights Section ──────────────────────────────────────────── */}
      <AnimatePresence>
        {sortedResults && sortedResults.length >= 3 && (
          <motion.section
            key="insights"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-navy py-14"
          >
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/25 mb-4">
                  <TrendingUp className="w-3.5 h-3.5 text-gold" />
                  <span className="text-gold text-xs font-bold tracking-widest uppercase">
                    Visual Analytics
                  </span>
                </div>
                <h2 className="heading-display text-2xl md:text-3xl text-white mb-2">
                  Visual Insights for Your Recommendations
                </h2>
                <p className="text-white/50 text-sm">
                  Comparing top matched colleges across key metrics
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart 1: Match Score Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-white/6 border border-white/10 rounded-2xl p-5"
                  data-ocid="finder.chart_point"
                >
                  <h3 className="font-heading font-bold text-white text-sm mb-1">
                    Admission Probability
                  </h3>
                  <p className="text-white/40 text-xs mb-4">
                    Match score by college
                  </p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={matchBarData}
                      layout="vertical"
                      margin={{ left: 0, right: 16, top: 4, bottom: 4 }}
                    >
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fill: "oklch(1 0 0 / 0.35)", fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: "oklch(1 0 0 / 0.55)", fontSize: 10 }}
                        width={72}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        formatter={(v) => `₹${(v as number) ?? 0}%`}
                        contentStyle={{
                          background: "oklch(0.18 0.05 255)",
                          border: "1px solid oklch(1 0 0 / 0.12)",
                          borderRadius: 8,
                          color: "#fff",
                          fontSize: 12,
                        }}
                      />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                        {matchBarData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Chart 2: Package Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.18 }}
                  className="bg-white/6 border border-white/10 rounded-2xl p-5"
                  data-ocid="finder.chart_point"
                >
                  <h3 className="font-heading font-bold text-white text-sm mb-1">
                    Average Package (LPA)
                  </h3>
                  <p className="text-white/40 text-xs mb-4">
                    Top matched colleges
                  </p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={packageBarData}
                      margin={{ left: 0, right: 8, top: 4, bottom: 30 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(1 0 0 / 0.06)"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "oklch(1 0 0 / 0.45)", fontSize: 9 }}
                        tickLine={false}
                        axisLine={false}
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis
                        tick={{ fill: "oklch(1 0 0 / 0.35)", fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        formatter={(v) => `₹${(v as number) ?? 0} LPA`}
                        contentStyle={{
                          background: "oklch(0.18 0.05 255)",
                          border: "1px solid oklch(1 0 0 / 0.12)",
                          borderRadius: 8,
                          color: "#fff",
                          fontSize: 12,
                        }}
                      />
                      <Bar
                        dataKey="pkg"
                        fill="oklch(0.45 0.18 265)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Chart 3: Placement Trend */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.26 }}
                  className="bg-white/6 border border-white/10 rounded-2xl p-5"
                  data-ocid="finder.chart_point"
                >
                  <h3 className="font-heading font-bold text-white text-sm mb-1">
                    Placement Trend
                  </h3>
                  <p className="text-white/40 text-xs mb-4">
                    Avg LPA – top 3 matches (2020–2024)
                  </p>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                      data={trendChartData}
                      margin={{ left: 0, right: 8, top: 4, bottom: 4 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(1 0 0 / 0.06)"
                      />
                      <XAxis
                        dataKey="year"
                        tick={{ fill: "oklch(1 0 0 / 0.45)", fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fill: "oklch(1 0 0 / 0.35)", fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        formatter={(v) => `₹${(v as number) ?? 0} LPA`}
                        contentStyle={{
                          background: "oklch(0.18 0.05 255)",
                          border: "1px solid oklch(1 0 0 / 0.12)",
                          borderRadius: 8,
                          color: "#fff",
                          fontSize: 12,
                        }}
                      />
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
                  {/* Legend */}
                  <div className="flex flex-wrap gap-3 mt-3">
                    {top3Results.map((c, i) => (
                      <div key={c.id} className="flex items-center gap-1.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: trendColors[i] }}
                        />
                        <span className="text-white/50 text-[10px]">
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

      {/* ─── Footer Attribution ───────────────────────────────────────────────── */}
      <section className="bg-muted/30 border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo hover:text-navy transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </section>

      {/* ─── Floating Shortlist Button ────────────────────────────────────────── */}
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
              className="flex items-center gap-2 bg-gold text-navy font-bold text-sm px-4 py-3 rounded-2xl shadow-[0_4px_24px_oklch(0.78_0.15_85/0.45)] hover:brightness-95 transition-all"
            >
              <BookmarkCheck className="w-4 h-4" />
              Shortlist ({savedIds.length})
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Shortlist Drawer ─────────────────────────────────────────────────── */}
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
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-[0_-8px_40px_oklch(0.22_0.06_255/0.25)] max-h-[70vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="w-5 h-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy text-base">
                    Shortlisted Colleges
                  </h3>
                  <Badge className="bg-gold/15 text-[oklch(0.48_0.15_75)] border border-gold/35 font-bold">
                    {savedIds.length}
                  </Badge>
                </div>
                <button
                  type="button"
                  data-ocid="finder.close_button"
                  onClick={() => setShortlistOpen(false)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-4 space-y-3">
                {savedColleges.map((c, idx) => (
                  <div
                    key={c.id}
                    data-ocid={`finder.shortlist.item.${idx + 1}`}
                    className="flex items-center gap-3 bg-muted/40 rounded-xl px-4 py-3 border border-border"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-heading font-bold text-navy text-sm truncate">
                        {c.name}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {c.city} · NIRF #{c.nirfRank}
                      </div>
                    </div>
                    <button
                      type="button"
                      data-ocid={`finder.delete_button.${idx + 1}`}
                      onClick={() => toggleSave(c.id)}
                      className="w-7 h-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <Button
                  data-ocid="finder.compare_shortlist_button"
                  className="w-full bg-indigo text-white hover:bg-indigo/90 font-bold"
                  onClick={() => {
                    setShortlistOpen(false);
                    onNavigateToCompare(savedIds);
                  }}
                  disabled={savedIds.length < 2}
                >
                  <GitCompare className="w-4 h-4 mr-2" />
                  Compare Shortlist ({savedIds.length})
                </Button>
                {savedIds.length < 2 && (
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    Add at least 2 colleges to compare
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Back to top nav button */}
      <div className="hidden">
        <button
          type="button"
          data-ocid="finder.home_link"
          onClick={onNavigateHome}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
    </div>
  );
}
