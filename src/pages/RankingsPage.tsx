import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { COLLEGES, type College } from "../data/colleges";
import {
  ArrowLeft,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Clock,
  Database,
  Filter,
  GitCompare,
  MapPin,
  Search,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

interface RankingsPageProps {
  onNavigateHome: () => void;
  onNavigateToCompare: (ids: number[]) => void;
  onNavigateToDetails: (id: number) => void;
  compareIds: number[];
  onCompareIdsChange: (ids: number[]) => void;
}

const ITEMS_PER_PAGE = 10;

type SortKey = "overallScore" | "nirfRank" | "placementPct" | "avgPackageLPA";

function getTypeBadgeStyle(type: College["type"]) {
  switch (type) {
    case "IIT":
      return "bg-[oklch(0.46_0.19_266/0.12)] text-[oklch(0.30_0.18_266)] border border-[oklch(0.46_0.19_266/0.35)]";
    case "NIT":
      return "bg-[oklch(0.52_0.18_148/0.12)] text-[oklch(0.28_0.18_148)] border border-[oklch(0.52_0.18_148/0.35)]";
    case "Deemed":
      return "bg-[oklch(0.80_0.16_86/0.15)] text-[oklch(0.42_0.14_78)] border border-[oklch(0.80_0.16_86/0.40)]";
    case "State":
      return "bg-[oklch(0.54_0.06_240/0.12)] text-[oklch(0.30_0.05_240)] border border-[oklch(0.54_0.06_240/0.35)]";
    case "Private":
      return "bg-[oklch(0.56_0.18_305/0.12)] text-[oklch(0.32_0.17_305)] border border-[oklch(0.56_0.18_305/0.35)]";
  }
}

function getNaacBadgeStyle(grade: College["naacGrade"]) {
  switch (grade) {
    case "A++":
      return "bg-[oklch(0.80_0.16_86/0.16)] text-[oklch(0.42_0.14_78)] border border-[oklch(0.80_0.16_86/0.48)] font-bold";
    case "A+":
      return "bg-[oklch(0.52_0.18_148/0.14)] text-[oklch(0.28_0.18_148)] border border-[oklch(0.52_0.18_148/0.42)] font-bold";
    case "A":
      return "bg-[oklch(0.46_0.19_266/0.13)] text-[oklch(0.28_0.18_266)] border border-[oklch(0.46_0.19_266/0.38)] font-bold";
    case "B++":
      return "bg-[oklch(0.54_0.06_240/0.13)] text-[oklch(0.34_0.05_240)] border border-[oklch(0.54_0.06_240/0.36)] font-bold";
  }
}

function getRankMedalStyle(rank: number): {
  bg: string;
  text: string;
  shadow: string;
} {
  if (rank === 1)
    return {
      bg: "radial-gradient(ellipse at 30% 30%, oklch(0.92 0.18 90), oklch(0.72 0.18 72))",
      text: "oklch(0.30 0.08 70)",
      shadow: "0 4px 16px oklch(0.80 0.16 86 / 0.50)",
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
    bg: "oklch(0.16 0.055 258)",
    text: "oklch(0.98 0.005 258)",
    shadow: "none",
  };
}

function TrendBadge({
  trend,
  change,
}: { trend: College["trend"]; change: number }) {
  if (trend === "up")
    return (
      <span className="inline-flex items-center gap-0.5 text-[oklch(0.32_0.18_148)] text-xs font-semibold">
        <TrendingUp className="w-3 h-3" />+{change}
      </span>
    );
  if (trend === "down")
    return (
      <span className="inline-flex items-center gap-0.5 text-[oklch(0.40_0.20_27)] text-xs font-semibold">
        <TrendingDown className="w-3 h-3" />
        {change}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 text-muted-foreground text-xs font-medium">
      <span className="text-base leading-none">→</span> —
    </span>
  );
}

const MAX_COMPARE = 4;

export function RankingsPage({
  onNavigateHome,
  onNavigateToCompare,
  onNavigateToDetails,
  compareIds,
  onCompareIdsChange,
}: RankingsPageProps) {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [naacFilter, setNaacFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("overallScore");
  const [page, setPage] = useState(1);

  const cities = useMemo(
    () => [
      "Chennai",
      "Coimbatore",
      "Vellore",
      "Trichy",
      "Madurai",
      "Erode",
      "Thanjavur",
      "Puducherry",
    ],
    [],
  );

  const hasActiveFilters =
    search !== "" ||
    cityFilter !== "all" ||
    typeFilter !== "all" ||
    naacFilter !== "all";

  const activeFilterCount = [
    search !== "",
    cityFilter !== "all",
    typeFilter !== "all",
    naacFilter !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setCityFilter("all");
    setTypeFilter("all");
    setNaacFilter("all");
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...COLLEGES];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortName.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q),
      );
    }

    if (cityFilter !== "all") {
      result = result.filter((c) => c.city === cityFilter);
    }
    if (typeFilter !== "all") {
      result = result.filter((c) => c.type === typeFilter);
    }
    if (naacFilter !== "all") {
      result = result.filter((c) => c.naacGrade === naacFilter);
    }

    result.sort((a, b) => {
      if (sortKey === "nirfRank") return a.nirfRank - b.nirfRank;
      if (sortKey === "overallScore") return b.overallScore - a.overallScore;
      if (sortKey === "placementPct") return b.placementPct - a.placementPct;
      if (sortKey === "avgPackageLPA") return b.avgPackageLPA - a.avgPackageLPA;
      return 0;
    });

    return result;
  }, [search, cityFilter, typeFilter, naacFilter, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  const goToPage = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortLabels: Record<SortKey, string> = {
    overallScore: "Overall Score ↓",
    nirfRank: "NIRF Rank ↑",
    placementPct: "Placement % ↓",
    avgPackageLPA: "Avg Package ↓",
  };

  const [compareWarning, setCompareWarning] = useState(false);

  const toggleCompare = (id: number) => {
    if (compareIds.includes(id)) {
      onCompareIdsChange(compareIds.filter((cid) => cid !== id));
    } else {
      if (compareIds.length >= MAX_COMPARE) {
        setCompareWarning(true);
        setTimeout(() => setCompareWarning(false), 2500);
        return;
      }
      onCompareIdsChange([...compareIds, id]);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body antialiased">
      {/* ── Page Header ── */}
      <header
        className="relative overflow-hidden"
        style={{
          background: "oklch(0.16 0.055 258)",
          paddingTop: "5rem",
          paddingBottom: "4rem",
        }}
      >
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        {/* Radial glow accent */}
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
          
          {/* Go Back Button */}
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Heading */}
          <div className="max-w-3xl">
            <div className="eyebrow-tag text-gold/80 mb-4">
              Comprehensive Analytics
            </div>
            <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
              College{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.92 0.18 90), oklch(0.72 0.18 72))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Rankings
              </span>{" "}
              2024
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl leading-relaxed">
              Comprehensive rankings based on NAAC, NIRF &amp; TNEA integrated
              scoring — your trusted guide to higher education in Tamil Nadu and
              beyond.
            </p>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { icon: BarChart3, label: "Total Colleges", value: "1,200+" },
              { icon: Database, label: "Data Sources", value: "3" },
              { icon: Clock, label: "Last Updated", value: "Jan 2024" },
              {
                icon: SlidersHorizontal,
                label: "Ranking Criteria",
                value: "6",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg"
                style={{
                  background: "oklch(1 0 0 / 0.055)",
                  border: "1px solid oklch(1 0 0 / 0.10)",
                  backdropFilter: "blur(12px)",
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

      {/* ── Sticky Controls Bar ── */}
      <div
        className="sticky top-0 z-40 bg-white border-b border-border"
        style={{
          boxShadow:
            "0 2px 16px oklch(0.22 0.06 258 / 0.08), 0 1px 0 oklch(0.91 0.01 258)",
        }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                data-ocid="rankings.search_input"
                type="text"
                placeholder="Search colleges..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-9 text-sm border-border focus:border-indigo focus:ring-indigo/20"
              />
            </div>

            {/* Filter icon label (visible on sm+) */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground font-medium shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Filters:
            </div>

            {/* City filter */}
            <Select
              value={cityFilter}
              onValueChange={(v) => {
                setCityFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger
                data-ocid="rankings.city_select"
                className="h-9 text-sm w-[140px] border-border"
              >
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type filter */}
            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger
                data-ocid="rankings.type_select"
                className="h-9 text-sm w-[130px] border-border"
              >
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="IIT">IIT</SelectItem>
                <SelectItem value="NIT">NIT</SelectItem>
                <SelectItem value="Deemed">Deemed</SelectItem>
                <SelectItem value="State">State</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
              </SelectContent>
            </Select>

            {/* NAAC filter */}
            <Select
              value={naacFilter}
              onValueChange={(v) => {
                setNaacFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger
                data-ocid="rankings.naac_select"
                className="h-9 text-sm w-[140px] border-border"
              >
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="A++">A++</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B++">B++</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={sortKey}
              onValueChange={(v) => {
                setSortKey(v as SortKey);
                setPage(1);
              }}
            >
              <SelectTrigger
                data-ocid="rankings.sort_select"
                className="h-9 text-sm w-[175px] border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overallScore">Overall Score ↓</SelectItem>
                <SelectItem value="nirfRank">NIRF Rank ↑</SelectItem>
                <SelectItem value="placementPct">Placement % ↓</SelectItem>
                <SelectItem value="avgPackageLPA">Avg Package ↓</SelectItem>
              </SelectContent>
            </Select>

            {/* Active filter count + Clear */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 ml-auto">
                <Badge
                  className="h-7 px-2.5 text-xs font-semibold bg-indigo/10 text-indigo border-indigo/25 hover:bg-indigo/15"
                  variant="outline"
                >
                  {activeFilterCount} active
                </Badge>
                <Button
                  data-ocid="rankings.cancel_button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="container mx-auto px-4 py-6">
        {/* Results Summary bar */}
        <div className="flex items-center justify-between mb-5 text-sm">
          <p className="text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filtered.length === 0
                ? "0"
                : `${(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                  safeCurrentPage * ITEMS_PER_PAGE,
                  filtered.length,
                )}`}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            colleges
          </p>
          <p className="text-muted-foreground hidden sm:block">
            Sorted by:{" "}
            <span className="font-semibold text-foreground">
              {sortLabels[sortKey]}
            </span>
          </p>
        </div>

        {/* Empty State */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              data-ocid="rankings.empty_state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "oklch(0.46 0.19 266 / 0.08)" }}
              >
                <Search className="w-9 h-9 text-indigo/50" />
              </div>
              <h3 className="font-heading text-xl font-bold text-navy mb-2">
                No colleges match your filters
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mb-6">
                Try adjusting your search terms or clearing the active filters
                to see more results.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-navy text-white hover:bg-navy/90 font-semibold"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Desktop Table ── */}
        {filtered.length > 0 && (
          <>
            <div className="hidden md:block rounded-xl overflow-hidden border border-border shadow-card">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="text-left"
                    style={{ background: "oklch(0.16 0.055 258)" }}
                  >
                    <th className="px-3 py-3.5 font-semibold text-[11px] uppercase tracking-wider text-white/70 whitespace-nowrap w-10">
                      <span className="sr-only">Compare</span>
                    </th>
                    {[
                      "Rank",
                      "College",
                      "Type",
                      "City",
                      "NAAC",
                      "NIRF",
                      "Score",
                      "Placement",
                      "Avg Pkg",
                      "Action",
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
                  <AnimatePresence mode="popLayout">
                    {paginated.map((college, i) => {
                      const medal = getRankMedalStyle(college.rank);
                      const isTopThree = college.rank <= 3;
                      const rowIndex =
                        (safeCurrentPage - 1) * ITEMS_PER_PAGE + i + 1;
                      return (
                        <motion.tr
                          key={college.id}
                          data-ocid={`rankings.item.${rowIndex}`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ delay: i * 0.04, duration: 0.3 }}
                          className="group border-t border-border transition-all duration-200 cursor-default"
                          style={{
                            background:
                              i % 2 === 0
                                ? "oklch(1 0 0)"
                                : "oklch(0.975 0.005 258 / 0.5)",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              "oklch(0.46 0.19 266 / 0.05)";
                            (e.currentTarget as HTMLElement).style.borderLeft =
                              "3px solid oklch(0.46 0.19 266)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              i % 2 === 0
                                ? "oklch(1 0 0)"
                                : "oklch(0.975 0.005 258 / 0.5)";
                            (e.currentTarget as HTMLElement).style.borderLeft =
                              "";
                          }}
                        >
                          {/* Compare checkbox */}
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <Checkbox
                              data-ocid={`compare.checkbox.${rowIndex}`}
                              checked={compareIds.includes(college.id)}
                              onCheckedChange={() => toggleCompare(college.id)}
                              aria-label={`Compare ${college.shortName}`}
                              className="border-indigo/40 data-[state=checked]:bg-indigo data-[state=checked]:border-indigo"
                            />
                          </td>

                          {/* Rank */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center font-heading font-black text-base"
                              style={{
                                background: medal.bg,
                                color: medal.text,
                                boxShadow: medal.shadow,
                                fontVariationSettings: isTopThree
                                  ? '"wdth" 125, "wght" 900'
                                  : undefined,
                              }}
                            >
                              {college.rank}
                            </div>
                          </td>

                          {/* College name */}
                          <td className="px-4 py-3.5 max-w-[220px]">
                            <p className="font-heading font-bold text-navy text-sm leading-tight truncate group-hover:text-indigo transition-colors">
                              {college.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Est. {college.established}
                            </p>
                          </td>

                          {/* Type */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${getTypeBadgeStyle(college.type)}`}
                            >
                              {college.type}
                            </span>
                          </td>

                          {/* City */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-muted-foreground text-xs">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span>{college.city}</span>
                            </div>
                          </td>

                          {/* NAAC */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-[11px] ${getNaacBadgeStyle(college.naacGrade)}`}
                            >
                              {college.naacGrade}
                            </span>
                          </td>

                          {/* NIRF */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="font-heading font-black text-navy text-sm">
                              #{college.nirfRank}
                            </span>
                          </td>

                          {/* Score */}
                          <td className="px-4 py-3.5 whitespace-nowrap min-w-[100px]">
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
                                      "linear-gradient(90deg, oklch(0.46 0.19 266), oklch(0.80 0.16 86))",
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Placement */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-sm text-foreground">
                                {college.placementPct}%
                              </span>
                              <TrendBadge
                                trend={college.trend}
                                change={college.trendChange}
                              />
                            </div>
                          </td>

                          {/* Avg Package */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="font-semibold text-sm text-foreground">
                              {college.avgPackageLPA} LPA
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <Button
                              data-ocid={`rankings.item.button.${rowIndex}`}
                              variant="outline"
                              size="sm"
                              onClick={() => onNavigateToDetails(college.id)}
                              className="h-7 px-3 text-xs font-semibold border-indigo/30 text-indigo hover:bg-indigo/8 hover:border-indigo/60 transition-all"
                            >
                              View →
                            </Button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* ── Mobile Card List ── */}
            <div className="md:hidden flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {paginated.map((college, i) => {
                  const medal = getRankMedalStyle(college.rank);
                  const rowIndex =
                    (safeCurrentPage - 1) * ITEMS_PER_PAGE + i + 1;
                  return (
                    <motion.div
                      key={college.id}
                      data-ocid={`rankings.item.${rowIndex}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-xl border border-border p-4 shadow-card"
                    >
                      <div className="flex items-start gap-3">
                        {/* Rank badge */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center font-heading font-black text-base shrink-0"
                          style={{
                            background: medal.bg,
                            color: medal.text,
                            boxShadow: medal.shadow,
                          }}
                        >
                          {college.rank}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading font-bold text-navy text-sm leading-snug line-clamp-2">
                            {college.name}
                          </h3>
                          <div className="flex items-center gap-1 mt-0.5 text-muted-foreground text-xs">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span>{college.city}</span>
                            <span className="mx-1">·</span>
                            <span>Est. {college.established}</span>
                          </div>
                        </div>
                        {/* NAAC */}
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[11px] shrink-0 ${getNaacBadgeStyle(college.naacGrade)}`}
                        >
                          {college.naacGrade}
                        </span>
                      </div>

                      {/* Score bar */}
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                            Overall Score
                          </span>
                          <span className="font-heading font-black text-sm text-navy">
                            {college.overallScore}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${college.overallScore}%`,
                              background:
                                "linear-gradient(90deg, oklch(0.46 0.19 266), oklch(0.80 0.16 86))",
                            }}
                          />
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                            NIRF:
                          </span>
                          <span className="font-heading font-black text-xs text-navy">
                            #{college.nirfRank}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                            Placement:
                          </span>
                          <span className="font-semibold text-xs">
                            {college.placementPct}%
                          </span>
                          <TrendBadge
                            trend={college.trend}
                            change={college.trendChange}
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                            Avg:
                          </span>
                          <span className="font-semibold text-xs">
                            {college.avgPackageLPA} LPA
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${getTypeBadgeStyle(college.type)}`}
                        >
                          {college.type}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            data-ocid={`compare.checkbox.${rowIndex}`}
                            onClick={() => toggleCompare(college.id)}
                            className={`h-7 px-3 text-xs font-semibold rounded-md border transition-all ${compareIds.includes(college.id)
                                ? "bg-indigo/10 border-indigo/50 text-indigo"
                                : "border-border text-muted-foreground hover:border-indigo/30 hover:text-indigo"
                              }`}
                          >
                            {compareIds.includes(college.id)
                              ? "✓ Compare"
                              : "+ Compare"}
                          </button>
                          <Button
                            data-ocid={`rankings.item.button.${rowIndex}`}
                            variant="outline"
                            size="sm"
                            onClick={() => onNavigateToDetails(college.id)}
                            className="h-7 px-3 text-xs font-semibold border-indigo/30 text-indigo hover:bg-indigo/8 hover:border-indigo/60"
                          >
                            View →
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page{" "}
                  <span className="font-semibold text-foreground">
                    {safeCurrentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {totalPages}
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    data-ocid="rankings.pagination_prev"
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    className="h-9 px-4 gap-1.5 font-medium border-border text-sm disabled:opacity-40 hover:border-indigo/40 hover:text-indigo transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </Button>

                  {/* Page number pills */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          type="button"
                          key={p}
                          onClick={() => goToPage(p)}
                          className="w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200"
                          style={
                            p === safeCurrentPage
                              ? {
                                background: "oklch(0.16 0.055 258)",
                                color: "oklch(0.98 0.005 258)",
                              }
                              : {
                                background: "transparent",
                                color: "oklch(0.50 0.025 258)",
                              }
                          }
                        >
                          {p}
                        </button>
                      ),
                    )}
                  </div>

                  <Button
                    data-ocid="rankings.pagination_next"
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    className="h-9 px-4 gap-1.5 font-medium border-border text-sm disabled:opacity-40 hover:border-indigo/40 hover:text-indigo transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Sticky Compare Bar ── */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40"
            style={{
              background: "oklch(0.16 0.055 258 / 0.97)",
              backdropFilter: "blur(12px)",
              borderTop: "1px solid oklch(1 0 0 / 0.10)",
              boxShadow: "0 -4px 24px oklch(0.16 0.055 258 / 0.30)",
            }}
          >
            <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <GitCompare className="w-4 h-4 text-gold/80" />
                <span className="text-white/80 text-sm font-medium">
                  <strong className="text-white">{compareIds.length}</strong>{" "}
                  college
                  {compareIds.length !== 1 ? "s" : ""} selected for comparison
                  {compareIds.length < 2 && (
                    <span className="text-white/50 ml-2 text-xs">
                      (select at least 2)
                    </span>
                  )}
                </span>
                {compareWarning && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-medium"
                    style={{ color: "oklch(0.80 0.16 86)" }}
                  >
                    Max {MAX_COMPARE} colleges allowed
                  </motion.span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onCompareIdsChange([])}
                  className="text-white/60 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
                <Button
                  data-ocid="rankings.compare_button"
                  disabled={compareIds.length < 2}
                  onClick={() => onNavigateToCompare(compareIds)}
                  size="sm"
                  className="bg-gold text-foreground hover:brightness-95 font-bold text-sm disabled:opacity-50"
                >
                  Compare Now →
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom padding for sticky bar */}
      {compareIds.length > 0 && <div className="h-16" />}

      {/* ── Footer ── */}
      <footer
        className="mt-16 py-8 border-t border-border"
        style={{ background: "oklch(0.975 0.005 258)" }}
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