import { Button } from "../components/ui/button";
import { COLLEGES, type College } from "../data/colleges";
import {
  Activity,
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  Building2,
  GitCompare,
  MapPin,
  Medal,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AnalyticsDashboardPageProps {
  onNavigateHome: () => void;
  onNavigateToRankings: () => void;
  onNavigateToCompare: () => void;
  onNavigateToDetails: (id: number) => void;
}

// ── Badge helpers (re-used from RankingsPage) ──────────────────────────────
function getTypeBadgeStyle(type: College["type"]) {
  switch (type) {
    case "IIT":
      return "bg-[oklch(0.45_0.18_265/0.15)] text-[oklch(0.30_0.18_265)] border border-[oklch(0.45_0.18_265/0.35)]";
    case "NIT":
      return "bg-[oklch(0.55_0.18_165/0.15)] text-[oklch(0.32_0.18_165)] border border-[oklch(0.55_0.18_165/0.35)]";
    case "Deemed":
      return "bg-[oklch(0.80_0.15_75/0.18)] text-[oklch(0.45_0.15_75)] border border-[oklch(0.78_0.15_85/0.35)]";
    case "State":
      return "bg-[oklch(0.55_0.05_240/0.15)] text-[oklch(0.35_0.05_240)] border border-[oklch(0.55_0.05_240/0.35)]";
    case "Private":
      return "bg-[oklch(0.55_0.18_300/0.12)] text-[oklch(0.35_0.18_300)] border border-[oklch(0.55_0.18_300/0.30)]";
  }
}

function getNaacBadgeStyle(grade: College["naacGrade"]) {
  switch (grade) {
    case "A++":
      return "bg-gold/15 text-[oklch(0.50_0.15_75)] border border-gold/40 font-bold";
    case "A+":
      return "bg-[oklch(0.55_0.18_145/0.15)] text-[oklch(0.33_0.18_145)] border border-[oklch(0.55_0.18_145/0.40)] font-bold";
    case "A":
      return "bg-indigo/10 text-indigo border border-indigo/30 font-bold";
    case "B++":
      return "bg-[oklch(0.55_0.05_240/0.12)] text-[oklch(0.38_0.05_240)] border border-[oklch(0.55_0.05_240/0.30)] font-bold";
  }
}

// ── Recharts tooltip style ─────────────────────────────────────────────────
const TOOLTIP_STYLE = {
  backgroundColor: "oklch(1 0 0)",
  border: "1px solid oklch(0.88 0.01 255)",
  borderRadius: "10px",
  fontSize: "12px",
  boxShadow: "0 4px 16px oklch(0.22 0.06 255 / 0.12)",
};

const AXIS_TICK_STYLE = { fontSize: 11, fill: "oklch(0.45 0.04 255)" };
const GRID_STROKE = "oklch(0.93 0.01 255)";

// ── Chart colour palette ───────────────────────────────────────────────────
const NAAC_COLORS: Record<string, string> = {
  "A++": "oklch(0.78 0.15 85)",
  "A+": "oklch(0.65 0.18 145)",
  A: "oklch(0.45 0.18 265)",
  "B++": "oklch(0.55 0.05 240)",
};

const TYPE_COLORS: Record<string, string> = {
  IIT: "oklch(0.45 0.18 265)",
  NIT: "oklch(0.55 0.18 165)",
  Deemed: "oklch(0.78 0.15 85)",
  State: "oklch(0.55 0.05 240)",
  Private: "oklch(0.55 0.18 300)",
};

const LINE_COLORS = [
  "oklch(0.78 0.15 85)",
  "oklch(0.45 0.18 265)",
  "oklch(0.65 0.18 145)",
  "oklch(0.55 0.18 300)",
  "oklch(0.70 0.18 32)",
];

// ── Section header sub-component ──────────────────────────────────────────
function ChartCard({
  title,
  subtitle,
  children,
  ocid,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  ocid: string;
  className?: string;
}) {
  return (
    <motion.div
      data-ocid={ocid}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`bg-white border border-border rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300 ${className}`}
    >
      <h3 className="font-heading text-base font-bold text-navy mb-0.5">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>
      )}
      {children}
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function AnalyticsDashboardPage({
  onNavigateHome,
  onNavigateToRankings,
  onNavigateToCompare,
  onNavigateToDetails,
}: AnalyticsDashboardPageProps) {
  // ── Computed KPIs ────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const total = COLLEGES.length;
    const aPP = COLLEGES.filter((c) => c.naacGrade === "A++").length;
    const avgScore = COLLEGES.reduce((s, c) => s + c.overallScore, 0) / total;
    const bestPlacement = Math.max(...COLLEGES.map((c) => c.placementPct));
    const avgPackage =
      COLLEGES.reduce((s, c) => s + c.avgPackageLPA, 0) / total;
    const highestPkg = Math.max(...COLLEGES.map((c) => c.highestPackageLPA));
    return { total, aPP, avgScore, bestPlacement, avgPackage, highestPkg };
  }, []);

  // ── Chart datasets ───────────────────────────────────────────────────────
  const top10ByScore = useMemo(
    () =>
      [...COLLEGES]
        .sort((a, b) => b.overallScore - a.overallScore)
        .slice(0, 10)
        .map((c) => ({ name: c.shortName, score: c.overallScore })),
    [],
  );

  const naacDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of COLLEGES)
      counts[c.naacGrade] = (counts[c.naacGrade] ?? 0) + 1;
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  const typeDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of COLLEGES) counts[c.type] = (counts[c.type] ?? 0) + 1;
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  const top10ByPlacement = useMemo(
    () =>
      [...COLLEGES]
        .sort((a, b) => b.placementPct - a.placementPct)
        .slice(0, 10)
        .map((c) => ({ name: c.shortName, pct: c.placementPct })),
    [],
  );

  const top10ByPackage = useMemo(
    () =>
      [...COLLEGES]
        .sort((a, b) => b.avgPackageLPA - a.avgPackageLPA)
        .slice(0, 10)
        .map((c) => ({ name: c.shortName, avg: c.avgPackageLPA })),
    [],
  );

  const cityCount = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of COLLEGES) counts[c.city] = (counts[c.city] ?? 0) + 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([city, count]) => ({ city, count }));
  }, []);

  // 5-year placement trend for 5 colleges
  const trendColleges = useMemo(() => {
    const names = [
      "IIT Madras",
      "NIT Trichy",
      "Amrita University",
      "VIT Vellore",
      "SRM Institute",
    ];
    return COLLEGES.filter((c) => names.includes(c.shortName));
  }, []);

  const trendData = useMemo(() => {
    const years = [2020, 2021, 2022, 2023, 2024];
    return years.map((year) => {
      const row: Record<string, number | string> = { year: year.toString() };
      for (const college of trendColleges) {
        const point = college.placementTrend.find((p) => p.year === year);
        if (point) row[college.shortName] = point.pct;
      }
      return row;
    });
  }, [trendColleges]);

  // Fee range by type (min/max average)
  const feeByType = useMemo(() => {
    const groups: Record<string, { mins: number[]; maxs: number[] }> = {};
    for (const c of COLLEGES) {
      if (!groups[c.type]) groups[c.type] = { mins: [], maxs: [] };
      groups[c.type].mins.push(c.feeRange.min);
      groups[c.type].maxs.push(c.feeRange.max);
    }
    return Object.entries(groups).map(([type, { mins, maxs }]) => ({
      type,
      minFee: Math.round(mins.reduce((a, b) => a + b, 0) / mins.length),
      maxFee: Math.round(maxs.reduce((a, b) => a + b, 0) / maxs.length),
    }));
  }, []);

  // ── KPI card definitions ─────────────────────────────────────────────────
  const kpiCards = [
    {
      label: "Total Colleges",
      value: kpis.total.toString(),
      icon: Building2,
      accent: "oklch(0.45 0.18 265)",
      bg: "oklch(0.45 0.18 265 / 0.08)",
    },
    {
      label: "A++ Graded",
      value: kpis.aPP.toString(),
      icon: Medal,
      accent: "oklch(0.78 0.15 85)",
      bg: "oklch(0.78 0.15 85 / 0.10)",
    },
    {
      label: "Avg Overall Score",
      value: kpis.avgScore.toFixed(1),
      icon: Award,
      accent: "oklch(0.65 0.18 145)",
      bg: "oklch(0.65 0.18 145 / 0.08)",
    },
    {
      label: "Best Placement %",
      value: `${kpis.bestPlacement}%`,
      icon: TrendingUp,
      accent: "oklch(0.55 0.18 165)",
      bg: "oklch(0.55 0.18 165 / 0.08)",
    },
    {
      label: "Avg Package (LPA)",
      value: `${kpis.avgPackage.toFixed(1)}`,
      icon: BookOpen,
      accent: "oklch(0.70 0.18 32)",
      bg: "oklch(0.70 0.18 32 / 0.08)",
    },
    {
      label: "Highest Package (LPA)",
      value: kpis.highestPkg.toFixed(1),
      icon: Activity,
      accent: "oklch(0.55 0.18 300)",
      bg: "oklch(0.55 0.18 300 / 0.08)",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-background font-body antialiased">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <header
        className="relative bg-navy overflow-hidden"
        style={{ paddingTop: "5rem", paddingBottom: "4rem" }}
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        {/* Radial glows */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 15% 50%, oklch(0.45 0.18 265 / 0.22) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 85% 20%, oklch(0.78 0.15 85 / 0.10) 0%, transparent 60%)",
          }}
        />
        {/* Decorative chart icon shape */}
        <div
          className="absolute right-8 top-8 opacity-5 pointer-events-none"
          style={{ transform: "rotate(-15deg)" }}
        >
          <BarChart3
            className="text-white"
            style={{ width: 220, height: 220 }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <button
              type="button"
              data-ocid="analytics_dashboard.home_link"
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Home</span>
            </button>
            <span className="text-white/25">/</span>
            <span className="text-white/80 font-medium">
              Analytics Dashboard
            </span>
          </nav>

          {/* Heading */}
          <div className="max-w-3xl">
            <div className="eyebrow-tag text-gold/80 mb-4">
              Platform Analytics
            </div>
            <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
              Analytics{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.90 0.18 88), oklch(0.72 0.18 72))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Dashboard
              </span>
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl leading-relaxed">
              Platform-wide statistical analysis of college rankings,
              placements, and performance metrics across all 20 institutions.
            </p>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { icon: Building2, label: "Total Colleges", value: "20" },
              {
                icon: Medal,
                label: "A++ Graded",
                value: `${kpis.aPP}`,
              },
              {
                icon: TrendingUp,
                label: "Avg Overall Score",
                value: kpis.avgScore.toFixed(1),
              },
              {
                icon: Activity,
                label: "Best Placement %",
                value: `${kpis.bestPlacement}%`,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg"
                style={{
                  background: "oklch(1 0 0 / 0.07)",
                  border: "1px solid oklch(1 0 0 / 0.12)",
                  backdropFilter: "blur(8px)",
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

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="container mx-auto px-4 py-10">
        {/* ── KPI Cards ───────────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10"
        >
          {kpiCards.map((kpi) => (
            <motion.div
              key={kpi.label}
              variants={cardVariants}
              className="bg-white border border-border rounded-xl p-4 shadow-card flex flex-col gap-3"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: kpi.bg }}
              >
                <kpi.icon
                  className="w-4.5 h-4.5"
                  style={{ color: kpi.accent, width: 18, height: 18 }}
                />
              </div>
              <div>
                <p
                  className="font-heading font-black text-2xl leading-none mb-0.5"
                  style={{ color: kpi.accent }}
                >
                  {kpi.value}
                </p>
                <p className="text-[11px] text-muted-foreground font-medium leading-tight">
                  {kpi.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Charts Grid ─────────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
        >
          {/* Chart 1 — Top 10 by Overall Score */}
          <motion.div variants={chartVariants}>
            <ChartCard
              ocid="analytics_dashboard.chart.1"
              title="Top 10 Colleges by Overall Score"
              subtitle="Combined NAAC · NIRF · Placement weighted score"
              className="lg:col-span-2"
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={top10ByScore}
                  layout="vertical"
                  margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={GRID_STROKE}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    domain={[60, 100]}
                    tick={AXIS_TICK_STYLE}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ ...AXIS_TICK_STYLE, fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v) => `${(v as number) ?? 0} Score`}
                  />
                  <Bar
                    dataKey="score"
                    name="Score"
                    radius={[0, 6, 6, 0]}
                    label={{
                      position: "right",
                      fontSize: 10,
                      fill: "oklch(0.45 0.04 255)",
                    }}
                  >
                    {top10ByScore.map((entry, i) => (
                      <Cell
                        key={entry.name}
                        fill={
                          i === 0
                            ? "oklch(0.78 0.15 85)"
                            : i < 3
                              ? "oklch(0.65 0.16 85)"
                              : "oklch(0.45 0.18 265)"
                        }
                        fillOpacity={1 - i * 0.04}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          {/* Chart 2 — NAAC Grade Distribution */}
          <motion.div variants={chartVariants}>
            <ChartCard
              ocid="analytics_dashboard.chart.2"
              title="NAAC Grade Distribution"
              subtitle="Proportion of colleges per accreditation band"
            >
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={naacDistribution}
                    cx="50%"
                    cy="48%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {naacDistribution.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={NAAC_COLORS[entry.name] ?? "oklch(0.65 0.08 255)"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v) => `${(v as number) ?? 0} Colleges`}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          {/* Chart 3 — College Type Distribution */}
          <motion.div variants={chartVariants}>
            <ChartCard
              ocid="analytics_dashboard.chart.3"
              title="College Type Distribution"
              subtitle="IIT · NIT · Deemed · State · Private breakdown"
            >
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    cx="50%"
                    cy="48%"
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {typeDistribution.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={TYPE_COLORS[entry.name] ?? "oklch(0.65 0.08 255)"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v) => `${(v as number) ?? 0} Colleges`}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          {/* Chart 4 — Top 10 Placement Rate */}
          <motion.div variants={chartVariants}>
            <ChartCard
              ocid="analytics_dashboard.chart.4"
              title="Top 10 Placement Rate %"
              subtitle="Highest campus placement percentages"
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={top10ByPlacement}
                  margin={{ top: 4, right: 16, left: -8, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                  <XAxis
                    dataKey="name"
                    tick={{ ...AXIS_TICK_STYLE, fontSize: 9 }}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    domain={[70, 100]}
                    tick={AXIS_TICK_STYLE}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v) => `${(v as number) ?? 0}%`}
                  />
                  <Bar
                    dataKey="pct"
                    name="Placement %"
                    fill="oklch(0.45 0.18 265)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          {/* Chart 5 — Avg Package Comparison */}
          <motion.div variants={chartVariants}>
            <ChartCard
              ocid="analytics_dashboard.chart.5"
              title="Avg Package Comparison (LPA)"
              subtitle="Top 10 colleges by average placement package"
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={top10ByPackage}
                  margin={{ top: 4, right: 16, left: -8, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                  <XAxis
                    dataKey="name"
                    tick={{ ...AXIS_TICK_STYLE, fontSize: 9 }}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    tick={AXIS_TICK_STYLE}
                    tickFormatter={(v: number) => `₹${v}L`}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v) => `₹${(v as number) ?? 0} LPA`}
                  />
                  <Bar dataKey="avg" name="Avg Package" radius={[6, 6, 0, 0]}>
                    {top10ByPackage.map((entry, i) => (
                      <Cell
                        key={entry.name}
                        fill={`oklch(${0.65 - i * 0.02} 0.18 145)`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          {/* Chart 6 — City-wise College Count */}
          <motion.div variants={chartVariants}>
            <ChartCard
              ocid="analytics_dashboard.chart.6"
              title="City-wise College Count"
              subtitle="Distribution of ranked colleges across cities"
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={cityCount}
                  layout="vertical"
                  margin={{ top: 0, right: 40, left: 16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={GRID_STROKE}
                    horizontal={false}
                  />
                  <XAxis type="number" tick={AXIS_TICK_STYLE} />
                  <YAxis
                    type="category"
                    dataKey="city"
                    width={90}
                    tick={AXIS_TICK_STYLE}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v) => `${(v as number) ?? 0} Colleges`}
                  />
                  <Bar
                    dataKey="count"
                    name="Colleges"
                    fill="oklch(0.55 0.18 300)"
                    radius={[0, 6, 6, 0]}
                    label={{
                      position: "right",
                      fontSize: 11,
                      fill: "oklch(0.45 0.04 255)",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          {/* Chart 7 — 5-Year Placement Trend (spans 2 cols) */}
          <motion.div variants={chartVariants} className="lg:col-span-2">
            <ChartCard
              ocid="analytics_dashboard.chart.7"
              title="5-Year Placement Trend (2020–2024)"
              subtitle="Placement % trajectory for top 5 institutions"
            >
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={trendData}
                  margin={{ top: 8, right: 24, left: -8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                  <XAxis dataKey="year" tick={AXIS_TICK_STYLE} />
                  <YAxis
                    domain={[80, 100]}
                    tick={AXIS_TICK_STYLE}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v) => `₹${(v as number) ?? 0}%`}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                  {trendColleges.map((college, i) => (
                    <Line
                      key={college.shortName}
                      type="monotone"
                      dataKey={college.shortName}
                      stroke={LINE_COLORS[i % LINE_COLORS.length]}
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          {/* Chart 8 — Fee Range Overview (spans 2 cols) */}
          <motion.div variants={chartVariants} className="lg:col-span-2">
            <ChartCard
              ocid="analytics_dashboard.chart.8"
              title="Fee Range Overview by College Type (₹K/yr)"
              subtitle="Average minimum and maximum annual fee per institution category"
            >
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={feeByType}
                  margin={{ top: 4, right: 24, left: -4, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                  <XAxis dataKey="type" tick={AXIS_TICK_STYLE} />
                  <YAxis
                    tick={AXIS_TICK_STYLE}
                    tickFormatter={(v: number) => `₹${v}K`}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v) => `₹${(v as number) ?? 0}K/yr`}
                  />
                  <Legend
                    iconType="square"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                  <Bar
                    dataKey="minFee"
                    name="Min Fee"
                    fill="oklch(0.45 0.18 265)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="maxFee"
                    name="Max Fee"
                    fill="oklch(0.78 0.15 85)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>
        </motion.div>

        {/* ── Rankings Summary Table ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-navy">
                All Colleges Overview
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Complete ranking summary — click a college name to view its full
                profile
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full">
              <Users className="w-3.5 h-3.5" />
              {COLLEGES.length} institutions
            </div>
          </div>

          {/* Desktop Table */}
          <div
            data-ocid="analytics_dashboard.table"
            className="hidden md:block rounded-xl overflow-hidden border border-border shadow-card"
          >
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="text-left"
                  style={{ background: "oklch(0.22 0.06 255)" }}
                >
                  {[
                    "Rank",
                    "College",
                    "Type",
                    "NAAC",
                    "Score",
                    "Placement %",
                    "Avg Package",
                    "City",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3.5 font-semibold text-[11px] uppercase tracking-wider text-white/70 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COLLEGES.map((college, i) => (
                  <tr
                    key={college.id}
                    data-ocid={`analytics_dashboard.row.${college.rank}`}
                    className="group border-t border-border transition-all duration-200"
                    style={{
                      background:
                        i % 2 === 0
                          ? "oklch(1 0 0)"
                          : "oklch(0.98 0.005 240 / 0.5)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "oklch(0.45 0.18 265 / 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        i % 2 === 0
                          ? "oklch(1 0 0)"
                          : "oklch(0.98 0.005 240 / 0.5)";
                    }}
                  >
                    {/* Rank */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className="inline-flex w-8 h-8 rounded-lg items-center justify-center font-heading font-black text-sm"
                        style={{
                          background:
                            college.rank <= 3
                              ? "linear-gradient(135deg, oklch(0.90 0.18 88), oklch(0.72 0.18 72))"
                              : "oklch(0.22 0.06 255)",
                          color:
                            college.rank <= 3
                              ? "oklch(0.30 0.08 70)"
                              : "oklch(0.98 0.005 240)",
                        }}
                      >
                        {college.rank}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3 max-w-[200px]">
                      <button
                        type="button"
                        onClick={() => onNavigateToDetails(college.id)}
                        className="font-heading font-bold text-navy text-sm leading-tight truncate block text-left hover:text-indigo transition-colors group-hover:text-indigo"
                        title={college.name}
                      >
                        {college.name}
                      </button>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getTypeBadgeStyle(college.type)}`}
                      >
                        {college.type}
                      </span>
                    </td>

                    {/* NAAC */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] ${getNaacBadgeStyle(college.naacGrade)}`}
                      >
                        {college.naacGrade}
                      </span>
                    </td>

                    {/* Score */}
                    <td className="px-4 py-3 whitespace-nowrap min-w-[100px]">
                      <div className="flex flex-col gap-1">
                        <span className="font-heading font-black text-sm text-navy">
                          {college.overallScore}
                        </span>
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${college.overallScore}%`,
                              background:
                                "linear-gradient(90deg, oklch(0.45 0.18 265), oklch(0.78 0.15 85))",
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Placement */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-semibold text-sm">
                        {college.placementPct}%
                      </span>
                    </td>

                    {/* Package */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-semibold text-sm">
                        {college.avgPackageLPA} LPA
                      </span>
                    </td>

                    {/* City */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{college.city}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3">
            {COLLEGES.map((college) => (
              <div
                key={college.id}
                data-ocid={`analytics_dashboard.row.${college.rank}`}
                className="bg-white rounded-xl border border-border p-4 shadow-card"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-heading font-black text-sm shrink-0"
                    style={{
                      background:
                        college.rank <= 3
                          ? "linear-gradient(135deg, oklch(0.90 0.18 88), oklch(0.72 0.18 72))"
                          : "oklch(0.22 0.06 255)",
                      color:
                        college.rank <= 3
                          ? "oklch(0.30 0.08 70)"
                          : "oklch(0.98 0.005 240)",
                    }}
                  >
                    {college.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => onNavigateToDetails(college.id)}
                      className="font-heading font-bold text-navy text-sm leading-snug text-left hover:text-indigo transition-colors line-clamp-2"
                    >
                      {college.name}
                    </button>
                    <div className="flex items-center gap-1 mt-0.5 text-muted-foreground text-xs">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{college.city}</span>
                    </div>
                  </div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[11px] shrink-0 ${getNaacBadgeStyle(college.naacGrade)}`}
                  >
                    {college.naacGrade}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between mb-1 text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                    <span>Overall Score</span>
                    <span className="font-heading font-black text-sm text-navy">
                      {college.overallScore}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${college.overallScore}%`,
                        background:
                          "linear-gradient(90deg, oklch(0.45 0.18 265), oklch(0.78 0.15 85))",
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Placement:
                    </span>
                    <span className="font-semibold text-xs">
                      {college.placementPct}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Avg:
                    </span>
                    <span className="font-semibold text-xs">
                      {college.avgPackageLPA} LPA
                    </span>
                  </div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${getTypeBadgeStyle(college.type)}`}
                  >
                    {college.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Footer CTA Strip ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 rounded-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.22 0.06 255) 0%, oklch(0.30 0.12 265) 100%)",
          }}
        >
          <div className="relative px-8 py-10">
            {/* Background decoration */}
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 80% at 90% 50%, oklch(0.78 0.15 85 / 0.12) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-heading text-2xl font-bold text-white mb-1">
                  Ready to explore deeper?
                </h3>
                <p className="text-white/60 text-sm max-w-md">
                  View the full ranked list or start comparing colleges
                  side-by-side.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  data-ocid="analytics_dashboard.rankings_button"
                  onClick={onNavigateToRankings}
                  className="bg-gold text-foreground hover:brightness-95 font-bold px-5"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Full Rankings
                </Button>
                <Button
                  data-ocid="analytics_dashboard.compare_button"
                  onClick={onNavigateToCompare}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold px-5"
                >
                  <GitCompare className="w-4 h-4 mr-2" />
                  Compare Colleges
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ── Page Footer ──────────────────────────────────────────────── */}
      <footer
        className="mt-10 py-8 border-t border-border"
        style={{ background: "oklch(0.97 0.005 255)" }}
      >
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo" />
            <span>College Ranking Analytics Platform</span>
          </div>
          <p>
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
