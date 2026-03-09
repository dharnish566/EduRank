import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { COLLEGES, type College } from "../data/colleges";
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
import { useEffect, useRef, useState } from "react";
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

interface CollegeDetailsPageProps {
  collegeId: number;
  onNavigateBack: () => void;
  onAddToCompare: (id: number) => void;
  compareIds: number[];
}

type TabKey = "overview" | "placement" | "courses" | "admission" | "facilities";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "placement", label: "Placement & Stats" },
  { key: "courses", label: "Courses & Fees" },
  { key: "admission", label: "Admission" },
  { key: "facilities", label: "Facilities & Recruiters" },
];

function getTypeBadgeStyle(type: College["type"]) {
  switch (type) {
    case "IIT":
      return "bg-[oklch(0.45_0.18_265/0.18)] text-[oklch(0.28_0.18_265)] border border-[oklch(0.45_0.18_265/0.40)]";
    case "NIT":
      return "bg-[oklch(0.55_0.18_165/0.18)] text-[oklch(0.30_0.18_165)] border border-[oklch(0.55_0.18_165/0.40)]";
    case "Deemed":
      return "bg-[oklch(0.80_0.15_75/0.20)] text-[oklch(0.42_0.15_75)] border border-[oklch(0.78_0.15_85/0.40)]";
    case "State":
      return "bg-[oklch(0.55_0.05_240/0.18)] text-[oklch(0.32_0.05_240)] border border-[oklch(0.55_0.05_240/0.40)]";
    case "Private":
      return "bg-[oklch(0.55_0.18_300/0.15)] text-[oklch(0.32_0.18_300)] border border-[oklch(0.55_0.18_300/0.35)]";
  }
}

function getNaacColor(grade: College["naacGrade"]) {
  switch (grade) {
    case "A++":
      return {
        bg: "oklch(0.78 0.15 85 / 0.18)",
        border: "oklch(0.78 0.15 85 / 0.50)",
        text: "oklch(0.42 0.15 75)",
      };
    case "A+":
      return {
        bg: "oklch(0.55 0.18 145 / 0.18)",
        border: "oklch(0.55 0.18 145 / 0.45)",
        text: "oklch(0.30 0.18 145)",
      };
    case "A":
      return {
        bg: "oklch(0.45 0.18 265 / 0.15)",
        border: "oklch(0.45 0.18 265 / 0.40)",
        text: "oklch(0.28 0.18 265)",
      };
    case "B++":
      return {
        bg: "oklch(0.55 0.05 240 / 0.15)",
        border: "oklch(0.55 0.05 240 / 0.38)",
        text: "oklch(0.35 0.05 240)",
      };
  }
}

function ScoreRing({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (score / 100) * circumference;

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg
        width="144"
        height="144"
        viewBox="0 0 144 144"
        className="absolute inset-0 -rotate-90"
        aria-label={`Score: ${score}`}
        role="img"
      >
        {/* Track */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          stroke="oklch(1 0 0 / 0.10)"
          strokeWidth="10"
        />
        {/* Progress */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.78 0.15 85)" />
            <stop offset="100%" stopColor="oklch(0.90 0.18 88)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center z-10">
        <p className="text-3xl font-heading font-black text-white leading-none">
          {score}
        </p>
        <p className="text-[10px] text-white/60 uppercase tracking-widest font-medium mt-0.5">
          Score
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      className="flex flex-col gap-1.5 px-5 py-4 rounded-xl flex-1 min-w-[130px]"
      style={{
        background: "oklch(1 0 0 / 0.06)",
        border: "1px solid oklch(1 0 0 / 0.12)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Icon className="w-4 h-4 text-gold/80 mb-0.5" />
      <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium leading-none">
        {label}
      </p>
      <p
        className="font-heading font-black text-xl text-white leading-none"
        style={accent ? { color: accent } : {}}
      >
        {value}
      </p>
      {sub && <p className="text-[10px] text-white/45 leading-none">{sub}</p>}
    </div>
  );
}

function CustomLineTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-white px-4 py-3 shadow-card text-sm">
      <p className="font-heading font-bold text-navy mb-2 text-base">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs capitalize">
            {p.dataKey === "pct" ? "Placement" : "Avg LPA"}:
          </span>
          <span className="font-semibold text-navy">
            {p.dataKey === "pct" ? `${p.value}%` : `${p.value} LPA`}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomBarTooltip({
  active,
  payload,
  label,
}: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-white px-4 py-3 shadow-card text-sm">
      <p className="font-heading font-bold text-navy mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs">Students:</span>
        <span className="font-semibold text-navy">{payload[0].value}</span>
      </div>
    </div>
  );
}

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
};

const tabPanelVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export function CollegeDetailsPage({
  collegeId,
  onNavigateBack,
  onAddToCompare,
  compareIds,
}: CollegeDetailsPageProps) {
  const college = COLLEGES.find((c) => c.id === collegeId);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const tabsRef = useRef<HTMLDivElement>(null);
  const [tabsSticky, setTabsSticky] = useState(false);
  const isInCompare = compareIds.includes(collegeId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!tabsRef.current) return;
      const rect = tabsRef.current.getBoundingClientRect();
      setTabsSticky(rect.top <= 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!college) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-navy mb-3">
            College not found
          </h2>
          <Button onClick={onNavigateBack} className="bg-navy text-white">
            Back to Rankings
          </Button>
        </div>
      </div>
    );
  }

  const naacColor = getNaacColor(college.naacGrade);
  const totalStudentsPlaced = college.salaryBands.reduce(
    (acc, b) => acc + b.count,
    0,
  );
  const companiesVisited = college.topRecruiters.length * 12; // estimate

  return (
    <div className="min-h-screen bg-background font-body antialiased">
      {/* ── Hero Header ── */}
      <header
        className="relative overflow-hidden"
        style={{
          background: "oklch(0.18 0.06 255)",
          paddingTop: "4.5rem",
          paddingBottom: "3.5rem",
        }}
      >
        {/* Layered bg */}
        <div className="absolute inset-0 grid-pattern opacity-15" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 100% at 5% 40%, oklch(0.45 0.18 265 / 0.28) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 70% at 90% 10%, oklch(0.78 0.15 85 / 0.12) 0%, transparent 55%)",
          }}
        />
        {/* Decorative arc */}
        <div
          className="absolute right-0 bottom-0 w-80 h-80 rounded-full opacity-5"
          style={{
            background: "oklch(0.78 0.15 85)",
            transform: "translate(40%, 40%)",
          }}
        />

        <div className="relative z-10 container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs mb-7 text-white/50">
            <button
              type="button"
              data-ocid="college_detail.link"
              onClick={onNavigateBack}
              className="flex items-center gap-1 hover:text-white transition-colors group"
            >
              <Home className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-white/30" />
            <button
              type="button"
              onClick={onNavigateBack}
              className="hover:text-white transition-colors"
            >
              Rankings
            </button>
            <ChevronRight className="w-3 h-3 text-white/30" />
            <span className="text-white/80 font-medium truncate max-w-[200px]">
              {college.shortName}
            </span>
          </nav>

          {/* Main hero content */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Left: College info */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${getTypeBadgeStyle(college.type)}`}
                >
                  {college.type}
                </span>
                <span
                  className="inline-block px-2.5 py-1 rounded-full text-[11px] font-black"
                  style={{
                    background: naacColor.bg,
                    border: `1px solid ${naacColor.border}`,
                    color: naacColor.text,
                  }}
                >
                  NAAC {college.naacGrade}
                </span>
                <span
                  className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold text-white/70"
                  style={{
                    background: "oklch(1 0 0 / 0.08)",
                    border: "1px solid oklch(1 0 0 / 0.15)",
                  }}
                >
                  Est. {college.established}
                </span>
                {college.trend !== "stable" && (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      college.trend === "up"
                        ? "bg-[oklch(0.55_0.18_145/0.18)] text-[oklch(0.35_0.18_145)] border border-[oklch(0.55_0.18_145/0.40)]"
                        : "bg-[oklch(0.55_0.22_25/0.18)] text-[oklch(0.42_0.22_25)] border border-[oklch(0.55_0.22_25/0.40)]"
                    }`}
                  >
                    {college.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    Rank{" "}
                    {college.trend === "up"
                      ? `+${college.trendChange}`
                      : college.trendChange}
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="heading-display text-3xl sm:text-4xl lg:text-5xl text-white mb-2 leading-tight max-w-2xl">
                {college.name}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-white/55 text-sm mb-2">
                <MapPin className="w-4 h-4 shrink-0 text-gold/70" />
                <span>
                  {college.city}, {college.state}
                </span>
              </div>

              {/* Back link */}
              <button
                type="button"
                data-ocid="college_detail.link"
                onClick={onNavigateBack}
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Rankings
              </button>
            </motion.div>

            {/* Right: Score ring + Compare button */}
            <motion.div
              className="flex flex-row lg:flex-col items-center gap-5 lg:items-end"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT }}
            >
              <ScoreRing score={college.overallScore} />
              <Button
                data-ocid="college_detail.compare_button"
                onClick={() => onAddToCompare(collegeId)}
                className={`font-bold text-sm px-5 py-2.5 h-auto rounded-xl transition-all duration-200 ${
                  isInCompare
                    ? "bg-[oklch(0.45_0.18_265)] text-white hover:bg-[oklch(0.40_0.18_265)] border border-[oklch(0.55_0.18_265/0.50)]"
                    : "bg-gold text-[oklch(0.15_0.02_255)] hover:brightness-95 shadow-[0_4px_16px_oklch(0.78_0.15_85/0.35)]"
                }`}
              >
                {isInCompare ? "✓ In Compare" : "+ Add to Compare"}
              </Button>
            </motion.div>
          </div>

          {/* ── Quick stats row ── */}
          <motion.div
            className="flex flex-wrap gap-3 mt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatCard
              icon={Medal}
              label="NIRF Rank"
              value={`#${college.nirfRank}`}
              sub="National Ranking"
            />
            <StatCard
              icon={BarChart3}
              label="Overall Score"
              value={`${college.overallScore}`}
              sub="Platform Score"
              accent="oklch(0.88 0.18 88)"
            />
            <StatCard
              icon={Users}
              label="Placement"
              value={`${college.placementPct}%`}
              sub="2024 Batch"
            />
            <StatCard
              icon={DollarSign}
              label="Avg Package"
              value={`${college.avgPackageLPA} LPA`}
              sub="Annual CTC"
            />
            <StatCard
              icon={Trophy}
              label="Highest Pkg"
              value={`${college.highestPackageLPA} LPA`}
              sub="Annual CTC"
            />
          </motion.div>
        </div>
      </header>

      {/* ── Sticky Tab Navigation ── */}
      <div
        ref={tabsRef}
        className="sticky top-0 z-40 bg-white border-b border-border"
        style={{
          boxShadow: tabsSticky
            ? "0 2px 20px oklch(0.22 0.06 255 / 0.10), 0 1px 0 oklch(0.88 0.01 255)"
            : "0 1px 0 oklch(0.88 0.01 255)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-none -mb-px">
            {TABS.map((tab, idx) => (
              <button
                key={tab.key}
                type="button"
                data-ocid={`college_detail.tab.${idx + 1}`}
                onClick={() => setActiveTab(tab.key)}
                className={`relative shrink-0 px-5 py-4 text-sm font-semibold transition-all duration-200 whitespace-nowrap focus-visible:outline-none ${
                  activeTab === tab.key
                    ? "text-navy"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                    style={{ background: "oklch(0.78 0.15 85)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Panels ── */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              variants={tabPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <OverviewTab college={college} />
            </motion.div>
          )}
          {activeTab === "placement" && (
            <motion.div
              key="placement"
              variants={tabPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <PlacementTab
                college={college}
                totalPlaced={totalStudentsPlaced}
                companiesVisited={companiesVisited}
              />
            </motion.div>
          )}
          {activeTab === "courses" && (
            <motion.div
              key="courses"
              variants={tabPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <CoursesTab college={college} />
            </motion.div>
          )}
          {activeTab === "admission" && (
            <motion.div
              key="admission"
              variants={tabPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <AdmissionTab college={college} />
            </motion.div>
          )}
          {activeTab === "facilities" && (
            <motion.div
              key="facilities"
              variants={tabPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <FacilitiesTab college={college} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Footer ── */}
      <footer
        className="mt-12 py-8 border-t border-border"
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

// ─────────────────────────────────────────────
// Overview Tab
// ─────────────────────────────────────────────
function OverviewTab({ college }: { college: College }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* About */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-border shadow-card p-7"
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(0.45 0.18 265 / 0.10)" }}
          >
            <BookOpen className="w-5 h-5 text-indigo" />
          </div>
          <h2 className="font-heading font-bold text-xl text-navy">
            About the Institution
          </h2>
        </div>
        <div className="space-y-4">
          {college.about.split("\n\n").map((para) => (
            <p
              key={para.slice(0, 40)}
              className="text-muted-foreground leading-relaxed text-sm"
            >
              {para}
            </p>
          ))}
        </div>
      </motion.div>

      {/* Ranking Overview */}
      <motion.div variants={itemVariants}>
        <h2 className="font-heading font-bold text-xl text-navy mb-4">
          Ranking Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Award,
              label: "NAAC Accreditation",
              value: college.naacGrade,
              sublabel: "National Assessment Grade",
              accent: "oklch(0.78 0.15 85)",
              bg: "oklch(0.78 0.15 85 / 0.08)",
              border: "oklch(0.78 0.15 85 / 0.25)",
            },
            {
              icon: Trophy,
              label: "NIRF National Rank",
              value: `#${college.nirfRank}`,
              sublabel: "National Institutional Rankings",
              accent: "oklch(0.45 0.18 265)",
              bg: "oklch(0.45 0.18 265 / 0.06)",
              border: "oklch(0.45 0.18 265 / 0.20)",
            },
            {
              icon: Star,
              label: "Platform Score",
              value: `${college.overallScore}`,
              sublabel: "Combined Analytics Score",
              accent: "oklch(0.22 0.06 255)",
              bg: "oklch(0.22 0.06 255 / 0.05)",
              border: "oklch(0.22 0.06 255 / 0.15)",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl p-6 flex flex-col gap-3"
              style={{
                background: card.bg,
                border: `1px solid ${card.border}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${card.accent}18` }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.accent }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  {card.label}
                </p>
                <p
                  className="font-heading font-black text-3xl"
                  style={{ color: card.accent }}
                >
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.sublabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={itemVariants}>
        <h2 className="font-heading font-bold text-xl text-navy mb-4">
          Key Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: BookOpen,
              label: "Total Programmes",
              value: `${college.courses.length}`,
              sub: "UG + PG",
            },
            {
              icon: DollarSign,
              label: "Avg Package",
              value: `${college.avgPackageLPA} LPA`,
              sub: "2024 Batch",
            },
            {
              icon: Users,
              label: "Placement Rate",
              value: `${college.placementPct}%`,
              sub: "2024 Batch",
            },
            {
              icon: Calendar,
              label: "Established",
              value: `${college.established}`,
              sub: `${new Date().getFullYear() - college.established} years`,
            },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-white rounded-2xl border border-border shadow-card p-5 flex flex-col gap-2"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.22 0.06 255 / 0.07)" }}
              >
                <m.icon className="w-4.5 h-4.5 text-navy" />
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                {m.label}
              </p>
              <p className="font-heading font-black text-2xl text-navy leading-none">
                {m.value}
              </p>
              <p className="text-xs text-muted-foreground">{m.sub}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Courses offered */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-border shadow-card p-7"
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(0.78 0.15 85 / 0.10)" }}
          >
            <GraduationCap className="w-5 h-5 text-gold" />
          </div>
          <h2 className="font-heading font-bold text-xl text-navy">
            Programmes Offered
          </h2>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {college.courses.map((c) => (
            <span
              key={c}
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: "oklch(0.22 0.06 255 / 0.06)",
                border: "1px solid oklch(0.22 0.06 255 / 0.15)",
                color: "oklch(0.22 0.06 255)",
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Placement & Stats Tab
// ─────────────────────────────────────────────
function PlacementTab({
  college,
  totalPlaced,
  companiesVisited,
}: { college: College; totalPlaced: number; companiesVisited: number }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Summary KPIs */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          {
            icon: Trophy,
            label: "Highest Package",
            value: `${college.highestPackageLPA} LPA`,
            accent: "oklch(0.78 0.15 85)",
          },
          {
            icon: Users,
            label: "Students Placed",
            value: `${totalPlaced}+`,
            accent: "oklch(0.45 0.18 265)",
          },
          {
            icon: Building2,
            label: "Companies Visited",
            value: `${companiesVisited}+`,
            accent: "oklch(0.22 0.06 255)",
          },
          {
            icon: DollarSign,
            label: "Avg Package",
            value: `${college.avgPackageLPA} LPA`,
            accent: "oklch(0.65 0.18 145)",
          },
        ].map((k) => (
          <div
            key={k.label}
            className="bg-white rounded-2xl border border-border shadow-card p-5 flex flex-col gap-2"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `${k.accent}18` }}
            >
              <k.icon className="w-4.5 h-4.5" style={{ color: k.accent }} />
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {k.label}
            </p>
            <p
              className="font-heading font-black text-2xl leading-none"
              style={{ color: k.accent }}
            >
              {k.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Charts row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Placement Trend Chart */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6">
          <h3 className="font-heading font-bold text-lg text-navy mb-1">
            Placement Trend (2020–2024)
          </h3>
          <p className="text-xs text-muted-foreground mb-5">
            Placement percentage over the last 5 years
          </p>
          <div data-ocid="college_detail.chart_point" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={college.placementTrend}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.88 0.01 255)"
                />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "oklch(0.45 0.04 255)" }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 11, fill: "oklch(0.45 0.04 255)" }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="pct"
                  stroke="oklch(0.45 0.18 265)"
                  strokeWidth={2.5}
                  dot={{ fill: "oklch(0.45 0.18 265)", r: 4, strokeWidth: 0 }}
                  activeDot={{
                    r: 6,
                    fill: "oklch(0.45 0.18 265)",
                    strokeWidth: 0,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Distribution Chart */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6">
          <h3 className="font-heading font-bold text-lg text-navy mb-1">
            Salary Distribution
          </h3>
          <p className="text-xs text-muted-foreground mb-5">
            Number of students per salary band
          </p>
          <div data-ocid="college_detail.chart_point" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={college.salaryBands}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.88 0.01 255)"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "oklch(0.45 0.04 255)" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.45 0.04 255)" }} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                  fill="oklch(0.78 0.15 85)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Year-wise placement summary table */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-border shadow-card overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-border">
          <h3 className="font-heading font-bold text-lg text-navy">
            Year-wise Placement Summary
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "oklch(0.97 0.005 255)" }}>
                {["Year", "Placement %", "Avg Package", "Change"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...college.placementTrend].reverse().map((row, i) => {
                const prev =
                  college.placementTrend[college.placementTrend.length - 2 - i];
                const pctChange = prev
                  ? +(row.pct - prev.pct).toFixed(1)
                  : null;
                const lpaChange = prev
                  ? +(row.avgLPA - prev.avgLPA).toFixed(1)
                  : null;
                return (
                  <tr
                    key={row.year}
                    data-ocid="college_detail.row"
                    className="border-t border-border"
                    style={{
                      background:
                        i % 2 === 0
                          ? "oklch(1 0 0)"
                          : "oklch(0.98 0.005 240 / 0.4)",
                    }}
                  >
                    <td className="px-6 py-4">
                      <span className="font-heading font-bold text-navy">
                        {row.year}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{row.pct}%</span>
                        <div className="flex-1 max-w-[80px] h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(row.pct / 100) * 100}%`,
                              background:
                                "linear-gradient(90deg, oklch(0.45 0.18 265), oklch(0.78 0.15 85))",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {row.avgLPA} LPA
                    </td>
                    <td className="px-6 py-4">
                      {pctChange !== null ? (
                        <span
                          className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                            pctChange >= 0
                              ? "bg-[oklch(0.55_0.18_145/0.12)] text-[oklch(0.32_0.18_145)]"
                              : "bg-[oklch(0.55_0.22_25/0.12)] text-[oklch(0.40_0.22_25)]"
                          }`}
                        >
                          {pctChange >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {pctChange >= 0 ? "+" : ""}
                          {pctChange}% |{" "}
                          {lpaChange !== null && (lpaChange >= 0 ? "+" : "")}
                          {lpaChange} LPA
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Courses & Fees Tab
// ─────────────────────────────────────────────
function CoursesTab({ college }: { college: College }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Fee range summary */}
      <motion.div variants={itemVariants}>
        <div
          className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.22 0.06 255), oklch(0.30 0.10 260))",
          }}
        >
          <div>
            <p className="text-white/60 text-sm font-medium mb-1">
              Annual Fee Range
            </p>
            <p className="font-heading font-black text-3xl text-white">
              ₹{college.feeRange.min}K – ₹{college.feeRange.max}K
            </p>
            <p className="text-white/50 text-xs mt-1">
              Per academic year (approx.)
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="font-heading font-black text-2xl text-gold">
                ₹{college.feeRange.min}K
              </p>
              <p className="text-white/55 text-xs">Min. (Govt Prog.)</p>
            </div>
            <div className="w-px bg-white/15 self-stretch" />
            <div className="text-center">
              <p className="font-heading font-black text-2xl text-gold">
                ₹{college.feeRange.max}K
              </p>
              <p className="text-white/55 text-xs">Max (PG/Mgmt)</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Courses table */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-border shadow-card overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-navy">
            Programme Details
          </h3>
          <Badge
            variant="outline"
            className="text-xs border-indigo/30 text-indigo bg-indigo/5"
          >
            {college.coursesDetailed.length} Programmes
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "oklch(0.97 0.005 255)" }}>
                {["Programme", "Degree", "Duration", "Annual Fee", "Seats"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {college.coursesDetailed.map((course, i) => (
                <tr
                  key={`${course.name}-${i}`}
                  data-ocid="college_detail.row"
                  className="border-t border-border"
                  style={{
                    background:
                      i % 2 === 0
                        ? "oklch(1 0 0)"
                        : "oklch(0.98 0.005 240 / 0.4)",
                  }}
                >
                  <td className="px-5 py-4">
                    <span className="font-semibold text-navy">
                      {course.name}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold"
                      style={{
                        background: "oklch(0.45 0.18 265 / 0.10)",
                        border: "1px solid oklch(0.45 0.18 265 / 0.25)",
                        color: "oklch(0.28 0.18 265)",
                      }}
                    >
                      {course.degree}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{course.duration}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-heading font-bold text-navy">
                      ₹{(course.annualFee / 1000).toFixed(0)}K
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      /yr
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="font-semibold px-3 py-1 rounded-lg text-sm"
                      style={{
                        background: "oklch(0.78 0.15 85 / 0.12)",
                        color: "oklch(0.40 0.15 75)",
                      }}
                    >
                      {course.seats}
                    </span>
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

// ─────────────────────────────────────────────
// Admission Tab
// ─────────────────────────────────────────────
function AdmissionTab({ college }: { college: College }) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admission Process */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl border border-border shadow-card p-6"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.45 0.18 265 / 0.10)" }}
            >
              <BookOpen className="w-5 h-5 text-indigo" />
            </div>
            <h3 className="font-heading font-bold text-lg text-navy">
              Admission Process
            </h3>
          </div>
          <div className="space-y-4">
            {college.admissionInfo.process.map((step, stepIdx) => (
              <div key={step.slice(0, 30)} className="flex gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-heading font-black text-xs"
                  style={{
                    background: "oklch(0.45 0.18 265)",
                    color: "oklch(0.98 0 0)",
                    boxShadow: "0 2px 8px oklch(0.45 0.18 265 / 0.35)",
                  }}
                >
                  {stepIdx + 1}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Eligibility */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl border border-border shadow-card p-6"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.65 0.18 145 / 0.10)" }}
            >
              <CheckCircle2
                className="w-5 h-5"
                style={{ color: "oklch(0.45 0.18 145)" }}
              />
            </div>
            <h3 className="font-heading font-bold text-lg text-navy">
              Eligibility Criteria
            </h3>
          </div>
          <div className="space-y-3">
            {college.admissionInfo.eligibility.map((item) => (
              <div key={item.slice(0, 30)} className="flex gap-3 items-start">
                <CheckCircle2
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: "oklch(0.50 0.18 145)" }}
                />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Key Dates */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl border border-border shadow-card p-6"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.78 0.15 85 / 0.12)" }}
            >
              <Calendar className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-heading font-bold text-lg text-navy">
              Key Dates
            </h3>
          </div>
          <div className="relative pl-5">
            {/* Timeline line */}
            <div
              className="absolute left-[7px] top-2 bottom-2 w-0.5 rounded-full"
              style={{ background: "oklch(0.78 0.15 85 / 0.35)" }}
            />
            <div className="space-y-5">
              {college.admissionInfo.keyDates.map((kd) => (
                <div key={kd.event} className="relative">
                  <div
                    className="absolute -left-[13px] top-[5px] w-3 h-3 rounded-full border-2"
                    style={{
                      background: "oklch(1 0 0)",
                      borderColor: "oklch(0.78 0.15 85)",
                    }}
                  />
                  <p className="text-xs font-semibold text-muted-foreground">
                    {kd.event}
                  </p>
                  <p className="font-heading font-bold text-sm text-navy mt-0.5">
                    {kd.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Facilities & Recruiters Tab
// ─────────────────────────────────────────────
function FacilitiesTab({ college }: { college: College }) {
  const maxPkg = Math.max(...college.topRecruiters.map((r) => r.avgPackage));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Facilities Grid */}
      <motion.div variants={itemVariants}>
        <h2 className="font-heading font-bold text-xl text-navy mb-5">
          Campus Facilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {college.facilities.map((fac) => (
            <motion.div
              key={fac.name}
              variants={itemVariants}
              whileHover={{
                y: -3,
                boxShadow: "0 8px 24px oklch(0.22 0.06 255 / 0.12)",
              }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-3"
            >
              <span className="text-3xl">{fac.icon}</span>
              <div>
                <p className="font-heading font-bold text-navy text-sm mb-1">
                  {fac.name}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {fac.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Top Recruiters */}
      <motion.div variants={itemVariants}>
        <h2 className="font-heading font-bold text-xl text-navy mb-5">
          Top Recruiters
        </h2>
        <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-navy">
                {college.topRecruiters.length}
              </span>{" "}
              top companies recruit from this campus
            </p>
          </div>
          <div className="divide-y divide-border">
            {college.topRecruiters.map((r, i) => {
              const barPct = (r.avgPackage / maxPkg) * 100;
              return (
                <div
                  key={r.name}
                  data-ocid="college_detail.row"
                  className="px-6 py-4 flex items-center gap-4"
                >
                  {/* Rank */}
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-heading font-black text-sm shrink-0"
                    style={{
                      background:
                        i < 3
                          ? "oklch(0.78 0.15 85 / 0.15)"
                          : "oklch(0.22 0.06 255 / 0.06)",
                      color:
                        i < 3 ? "oklch(0.40 0.15 75)" : "oklch(0.45 0.04 255)",
                    }}
                  >
                    {i + 1}
                  </span>
                  {/* Company avatar */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-heading font-black text-sm"
                    style={{
                      background: "oklch(0.45 0.18 265 / 0.08)",
                      color: "oklch(0.35 0.18 265)",
                      border: "1px solid oklch(0.45 0.18 265 / 0.20)",
                    }}
                  >
                    {r.name.slice(0, 2).toUpperCase()}
                  </div>
                  {/* Name + role */}
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-navy text-sm truncate">
                      {r.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {r.role}
                    </p>
                  </div>
                  {/* Package bar */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-24 hidden sm:block">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background:
                              "linear-gradient(90deg, oklch(0.45 0.18 265), oklch(0.78 0.15 85))",
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${barPct}%` }}
                          transition={{
                            duration: 0.8,
                            delay: i * 0.06,
                            ease: EASE_OUT,
                          }}
                        />
                      </div>
                    </div>
                    <span
                      className="font-heading font-bold text-sm"
                      style={{ color: "oklch(0.45 0.18 265)" }}
                    >
                      {r.avgPackage} LPA
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
