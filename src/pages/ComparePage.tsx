import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { COLLEGES, type College } from "../data/colleges";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  ChevronDown,
  GitCompare,
  MapPin,
  Plus,
  TrendingDown,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

interface ComparePageProps {
  initialIds?: number[];
  onNavigateHome: () => void;
  onNavigateToRankings: () => void;
}

const MAX_COMPARE = 4;

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

interface CollegeSelectorProps {
  selectedIds: number[];
  onAdd: (id: number) => void;
  onRemove: (index: number) => void;
  onClearAll: () => void;
}

function CollegeSelector({
  selectedIds,
  onAdd,
  onRemove,
  onClearAll,
}: CollegeSelectorProps) {
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const available = useMemo(() => {
    const sorted = [...COLLEGES].sort((a, b) => a.rank - b.rank);
    const filtered = sorted.filter(
      (c) =>
        !selectedIds.includes(c.id) &&
        (search === "" ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.shortName.toLowerCase().includes(search.toLowerCase()) ||
          c.city.toLowerCase().includes(search.toLowerCase())),
    );
    return filtered;
  }, [selectedIds, search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenSlot(null);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const slots = [...selectedIds];
  // Add empty slots to have at least 2 visible
  while (slots.length < 2) slots.push(-1);

  const canAddMore = selectedIds.length < MAX_COMPARE;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-wrap gap-4 items-stretch">
        {slots.map((id, slotIndex) => {
          const college = id > 0 ? COLLEGES.find((c) => c.id === id) : null;
          const isOpen = openSlot === slotIndex;

          if (college) {
            // Filled slot
            return (
              <motion.div
                key={`filled-${college.id}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative flex-1 min-w-[180px] max-w-[280px] rounded-xl p-4"
                style={{
                  background: "oklch(1 0 0)",
                  border: "2px solid oklch(0.45 0.18 265 / 0.5)",
                  boxShadow:
                    "0 4px 20px oklch(0.45 0.18 265 / 0.10), 0 1px 4px oklch(0 0 0 / 0.05)",
                }}
              >
                {/* Remove button */}
                <button
                  type="button"
                  data-ocid={`compare.remove_button.${slotIndex + 1}`}
                  onClick={() => onRemove(slotIndex)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "oklch(0.55 0.22 25)",
                    color: "white",
                    boxShadow: "0 2px 8px oklch(0.55 0.22 25 / 0.4)",
                  }}
                  aria-label={`Remove ${college.shortName}`}
                >
                  <X className="w-3 h-3" />
                </button>

                {/* College info */}
                <div
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg mb-3 font-heading font-black text-sm"
                  style={{
                    background: "oklch(0.22 0.06 255)",
                    color: "oklch(0.78 0.15 85)",
                  }}
                >
                  #{college.rank}
                </div>
                <p className="font-heading font-bold text-navy text-sm leading-snug mb-1 line-clamp-2">
                  {college.shortName}
                </p>
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>{college.city}</span>
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${getTypeBadgeStyle(college.type)}`}
                  >
                    {college.type}
                  </span>
                </div>
              </motion.div>
            );
          }

          // Empty slot
          const emptyKey = `empty-pos-${slotIndex}-of-${slots.length}`;
          return (
            <motion.div
              key={emptyKey}
              layout
              className="relative flex-1 min-w-[180px] max-w-[280px]"
            >
              <button
                type="button"
                data-ocid="compare.add_college_button"
                onClick={() => {
                  setOpenSlot(isOpen ? null : slotIndex);
                  setSearch("");
                }}
                className="w-full h-full min-h-[120px] rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200 group"
                style={{
                  border: "2px dashed oklch(0.45 0.18 265 / 0.3)",
                  background: "oklch(0.97 0.005 255 / 0.6)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "oklch(0.45 0.18 265 / 0.65)";
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "oklch(0.45 0.18 265 / 0.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "oklch(0.45 0.18 265 / 0.3)";
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "oklch(0.97 0.005 255 / 0.6)";
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                  style={{
                    background: "oklch(0.45 0.18 265 / 0.10)",
                  }}
                >
                  <Plus className="w-5 h-5 text-indigo/60 group-hover:text-indigo transition-colors" />
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-indigo transition-colors">
                  Add College
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-muted-foreground/60 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-2 w-80 rounded-xl overflow-hidden z-50"
                    style={{
                      background: "oklch(1 0 0)",
                      border: "1px solid oklch(0.88 0.01 255)",
                      boxShadow:
                        "0 16px 48px oklch(0.22 0.06 255 / 0.18), 0 4px 16px oklch(0 0 0 / 0.08)",
                    }}
                  >
                    {/* Search input */}
                    <div
                      className="p-3 border-b"
                      style={{ borderColor: "oklch(0.91 0.005 255)" }}
                    >
                      <Input
                        autoFocus
                        placeholder="Search colleges..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-8 text-sm border-border"
                      />
                    </div>

                    {/* Options list */}
                    <div
                      className="overflow-y-auto"
                      style={{ maxHeight: "280px" }}
                    >
                      {available.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                          No colleges found
                        </div>
                      ) : (
                        available.map((c) => (
                          <button
                            type="button"
                            key={c.id}
                            onClick={() => {
                              onAdd(c.id);
                              setOpenSlot(null);
                              setSearch("");
                            }}
                            className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors duration-150 border-b last:border-0"
                            style={{ borderColor: "oklch(0.95 0.003 255)" }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.background =
                                "oklch(0.45 0.18 265 / 0.05)";
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.background = "transparent";
                            }}
                          >
                            <div
                              className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-heading font-black text-[11px]"
                              style={{
                                background: "oklch(0.22 0.06 255)",
                                color: "oklch(0.78 0.15 85)",
                              }}
                            >
                              #{c.rank}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-heading font-bold text-navy text-xs leading-snug truncate">
                                {c.shortName}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                {c.city} · {c.type}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 inline-block px-2 py-0.5 rounded text-[10px] ${getNaacBadgeStyle(c.naacGrade)}`}
                            >
                              {c.naacGrade}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* "Add more" button (shown after filled slots when can add more and all slots are filled) */}
        {canAddMore && selectedIds.length === slots.length && (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex-1 min-w-[160px] max-w-[240px]"
          >
            <button
              type="button"
              data-ocid="compare.add_college_button"
              onClick={() => {
                setOpenSlot(slots.length);
                setSearch("");
              }}
              className="w-full h-full min-h-[120px] rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200 group"
              style={{
                border: "2px dashed oklch(0.78 0.15 85 / 0.4)",
                background: "oklch(0.78 0.15 85 / 0.04)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "oklch(0.78 0.15 85 / 0.75)";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "oklch(0.78 0.15 85 / 0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "oklch(0.78 0.15 85 / 0.4)";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "oklch(0.78 0.15 85 / 0.04)";
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                style={{ background: "oklch(0.78 0.15 85 / 0.15)" }}
              >
                <Plus className="w-5 h-5 text-[oklch(0.55_0.15_75)] group-hover:text-[oklch(0.45_0.15_75)] transition-colors" />
              </div>
              <span className="text-xs font-medium text-[oklch(0.55_0.12_75)] group-hover:text-[oklch(0.45_0.12_75)] transition-colors">
                Add College +
              </span>
              <span className="text-[10px] text-muted-foreground/60">
                {MAX_COMPARE - selectedIds.length} slot
                {MAX_COMPARE - selectedIds.length !== 1 ? "s" : ""} left
              </span>
            </button>

            <AnimatePresence>
              {openSlot === slots.length && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 mt-2 w-80 rounded-xl overflow-hidden z-50"
                  style={{
                    background: "oklch(1 0 0)",
                    border: "1px solid oklch(0.88 0.01 255)",
                    boxShadow:
                      "0 16px 48px oklch(0.22 0.06 255 / 0.18), 0 4px 16px oklch(0 0 0 / 0.08)",
                  }}
                >
                  <div
                    className="p-3 border-b"
                    style={{ borderColor: "oklch(0.91 0.005 255)" }}
                  >
                    <Input
                      autoFocus
                      placeholder="Search colleges..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-8 text-sm border-border"
                    />
                  </div>
                  <div
                    className="overflow-y-auto"
                    style={{ maxHeight: "280px" }}
                  >
                    {available.length === 0 ? (
                      <div className="py-8 text-center text-sm text-muted-foreground">
                        No colleges found
                      </div>
                    ) : (
                      available.map((c) => (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => {
                            onAdd(c.id);
                            setOpenSlot(null);
                            setSearch("");
                          }}
                          className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors duration-150 border-b last:border-0"
                          style={{ borderColor: "oklch(0.95 0.003 255)" }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "oklch(0.45 0.18 265 / 0.05)";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "transparent";
                          }}
                        >
                          <div
                            className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-heading font-black text-[11px]"
                            style={{
                              background: "oklch(0.22 0.06 255)",
                              color: "oklch(0.78 0.15 85)",
                            }}
                          >
                            #{c.rank}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-heading font-bold text-navy text-xs leading-snug truncate">
                              {c.shortName}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                              {c.city} · {c.type}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 inline-block px-2 py-0.5 rounded text-[10px] ${getNaacBadgeStyle(c.naacGrade)}`}
                          >
                            {c.naacGrade}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Clear all – only show when ≥1 selected */}
      {selectedIds.length > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all selections
          </button>
        </div>
      )}
    </div>
  );
}

// ── Comparison Table ──────────────────────────────────────────────────────────

interface ComparisonTableProps {
  colleges: College[];
}

type HighlightKind = "best" | "worst" | "neutral";

function getHighlight(
  value: number,
  values: number[],
  lowerIsBetter = false,
): HighlightKind {
  const best = lowerIsBetter ? Math.min(...values) : Math.max(...values);
  const worst = lowerIsBetter ? Math.max(...values) : Math.min(...values);
  if (value === best) return "best";
  if (value === worst && values.length > 2) return "worst";
  if (value === worst && values.length === 2) return "worst";
  return "neutral";
}

function cellHighlightStyle(kind: HighlightKind) {
  if (kind === "best")
    return {
      background: "oklch(0.78 0.15 85 / 0.12)",
      borderLeft: "3px solid oklch(0.78 0.15 85)",
    };
  if (kind === "worst")
    return {
      background: "oklch(0.55 0.22 25 / 0.07)",
      borderLeft: "3px solid oklch(0.55 0.22 25 / 0.5)",
    };
  return {};
}

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="mt-1.5 w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.45 0.18 265), oklch(0.78 0.15 85))",
        }}
      />
    </div>
  );
}

function ComparisonTable({ colleges }: ComparisonTableProps) {
  const overallScores = colleges.map((c) => c.overallScore);
  const nirfRanks = colleges.map((c) => c.nirfRank);
  const placementPcts = colleges.map((c) => c.placementPct);
  const avgPackages = colleges.map((c) => c.avgPackageLPA);
  const highestPackages = colleges.map((c) => c.highestPackageLPA);

  const rows = [
    {
      id: "overall",
      label: "Overall Score",
      icon: <Trophy className="w-4 h-4 text-gold/80" />,
      render: (c: College) => {
        const kind = getHighlight(c.overallScore, overallScores);
        return (
          <td
            key={c.id}
            className="px-4 py-4 min-w-[160px]"
            style={cellHighlightStyle(kind)}
          >
            <div className="flex flex-col">
              <span
                className={`font-heading font-black text-xl ${kind === "best" ? "text-[oklch(0.45_0.15_75)]" : kind === "worst" ? "text-[oklch(0.50_0.22_25)]" : "text-navy"}`}
              >
                {c.overallScore}
              </span>
              <ScoreBar value={c.overallScore} />
              {kind === "best" && (
                <span className="text-[10px] text-[oklch(0.50_0.15_75)] font-semibold mt-1 flex items-center gap-0.5">
                  <Trophy className="w-2.5 h-2.5" /> Best
                </span>
              )}
            </div>
          </td>
        );
      },
    },
    {
      id: "nirf",
      label: "NIRF Rank",
      icon: <BarChart3 className="w-4 h-4 text-indigo/70" />,
      render: (c: College) => {
        const kind = getHighlight(c.nirfRank, nirfRanks, true);
        return (
          <td
            key={c.id}
            className="px-4 py-4 min-w-[160px]"
            style={cellHighlightStyle(kind)}
          >
            <span
              className={`font-heading font-black text-xl ${kind === "best" ? "text-[oklch(0.45_0.15_75)]" : kind === "worst" ? "text-[oklch(0.50_0.22_25)]" : "text-navy"}`}
            >
              #{c.nirfRank}
            </span>
            {kind === "best" && (
              <div className="text-[10px] text-[oklch(0.50_0.15_75)] font-semibold mt-0.5 flex items-center gap-0.5">
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
      icon: <Badge className="w-4 h-4 text-gold/70" />,
      render: (c: College) => (
        <td key={c.id} className="px-4 py-4 min-w-[160px]">
          <span
            className={`inline-block px-3 py-1 rounded-md text-sm ${getNaacBadgeStyle(c.naacGrade)}`}
          >
            {c.naacGrade}
          </span>
        </td>
      ),
    },
    {
      id: "type",
      label: "College Type",
      icon: <Building2 className="w-4 h-4 text-muted-foreground" />,
      render: (c: College) => (
        <td key={c.id} className="px-4 py-4 min-w-[160px]">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getTypeBadgeStyle(c.type)}`}
          >
            {c.type}
          </span>
        </td>
      ),
    },
    {
      id: "city",
      label: "City",
      icon: <MapPin className="w-4 h-4 text-muted-foreground" />,
      render: (c: College) => (
        <td key={c.id} className="px-4 py-4 min-w-[160px]">
          <div className="flex items-center gap-1.5 text-foreground text-sm">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="font-medium">{c.city}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{c.state}</div>
        </td>
      ),
    },
    {
      id: "established",
      label: "Established",
      icon: <Calendar className="w-4 h-4 text-muted-foreground" />,
      render: (c: College) => (
        <td key={c.id} className="px-4 py-4 min-w-[160px]">
          <span className="font-heading font-bold text-navy text-sm">
            {c.established}
          </span>
          <div className="text-xs text-muted-foreground mt-0.5">
            {new Date().getFullYear() - c.established} years
          </div>
        </td>
      ),
    },
    {
      id: "placement",
      label: "Placement %",
      icon: (
        <TrendingUp className="w-4 h-4 text-[oklch(0.45_0.18_145)] opacity-70" />
      ),
      render: (c: College) => {
        const kind = getHighlight(c.placementPct, placementPcts);
        return (
          <td
            key={c.id}
            className="px-4 py-4 min-w-[160px]"
            style={cellHighlightStyle(kind)}
          >
            <div className="flex items-center gap-2">
              <span
                className={`font-heading font-black text-xl ${kind === "best" ? "text-[oklch(0.45_0.15_75)]" : kind === "worst" ? "text-[oklch(0.50_0.22_25)]" : "text-navy"}`}
              >
                {c.placementPct}%
              </span>
              {c.trend === "up" && (
                <TrendingUp className="w-4 h-4 text-[oklch(0.40_0.18_145)]" />
              )}
              {c.trend === "down" && (
                <TrendingDown className="w-4 h-4 text-[oklch(0.50_0.22_25)]" />
              )}
            </div>
            {kind === "best" && (
              <div className="text-[10px] text-[oklch(0.50_0.15_75)] font-semibold mt-0.5 flex items-center gap-0.5">
                <Trophy className="w-2.5 h-2.5" /> Best
              </div>
            )}
          </td>
        );
      },
    },
    {
      id: "avgPkg",
      label: "Avg Package",
      icon: (
        <span className="text-xs font-bold text-[oklch(0.45_0.15_145)]">₹</span>
      ),
      render: (c: College) => {
        const kind = getHighlight(c.avgPackageLPA, avgPackages);
        return (
          <td
            key={c.id}
            className="px-4 py-4 min-w-[160px]"
            style={cellHighlightStyle(kind)}
          >
            <span
              className={`font-heading font-black text-xl ${kind === "best" ? "text-[oklch(0.45_0.15_75)]" : kind === "worst" ? "text-[oklch(0.50_0.22_25)]" : "text-navy"}`}
            >
              {c.avgPackageLPA}{" "}
              <span className="text-sm font-semibold text-muted-foreground">
                LPA
              </span>
            </span>
            {kind === "best" && (
              <div className="text-[10px] text-[oklch(0.50_0.15_75)] font-semibold mt-0.5 flex items-center gap-0.5">
                <Trophy className="w-2.5 h-2.5" /> Best
              </div>
            )}
          </td>
        );
      },
    },
    {
      id: "highestPkg",
      label: "Highest Package",
      icon: (
        <span className="text-xs font-bold text-[oklch(0.50_0.22_75)]">₹₹</span>
      ),
      render: (c: College) => {
        const kind = getHighlight(c.highestPackageLPA, highestPackages);
        return (
          <td
            key={c.id}
            className="px-4 py-4 min-w-[160px]"
            style={cellHighlightStyle(kind)}
          >
            <span
              className={`font-heading font-black text-xl ${kind === "best" ? "text-[oklch(0.45_0.15_75)]" : kind === "worst" ? "text-[oklch(0.50_0.22_25)]" : "text-navy"}`}
            >
              {c.highestPackageLPA}{" "}
              <span className="text-sm font-semibold text-muted-foreground">
                LPA
              </span>
            </span>
            {kind === "best" && (
              <div className="text-[10px] text-[oklch(0.50_0.15_75)] font-semibold mt-0.5 flex items-center gap-0.5">
                <Trophy className="w-2.5 h-2.5" /> Best
              </div>
            )}
          </td>
        );
      },
    },
    {
      id: "courses",
      label: "Courses Offered",
      icon: <BookOpen className="w-4 h-4 text-muted-foreground" />,
      render: (c: College) => (
        <td key={c.id} className="px-4 py-4 min-w-[160px]">
          <div className="flex flex-wrap gap-1">
            {c.courses.slice(0, 4).map((course) => (
              <span
                key={course}
                className="inline-block px-2 py-0.5 rounded text-[10px] font-medium"
                style={{
                  background: "oklch(0.45 0.18 265 / 0.08)",
                  color: "oklch(0.35 0.15 265)",
                  border: "1px solid oklch(0.45 0.18 265 / 0.20)",
                }}
              >
                {course}
              </span>
            ))}
            {c.courses.length > 4 && (
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium text-muted-foreground border border-border">
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
      data-ocid="compare.table"
      className="rounded-xl overflow-hidden border border-border shadow-card"
      style={{
        boxShadow:
          "0 8px 32px oklch(0.22 0.06 255 / 0.08), 0 2px 8px oklch(0 0 0 / 0.04)",
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "oklch(0.22 0.06 255)" }}>
              {/* Parameter label column header */}
              <th
                className="px-4 py-4 text-left sticky left-0 z-10 font-semibold text-[11px] uppercase tracking-wider text-white/70 min-w-[160px]"
                style={{ background: "oklch(0.22 0.06 255)" }}
              >
                Parameter
              </th>
              {/* College column headers */}
              {colleges.map((c, i) => (
                <motion.th
                  key={c.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.35 }}
                  className="px-4 py-4 text-left min-w-[160px]"
                  style={{ background: "oklch(0.22 0.06 255)" }}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-heading font-black text-[11px] mt-0.5"
                      style={{
                        background: "oklch(0.78 0.15 85 / 0.15)",
                        color: "oklch(0.78 0.15 85)",
                        border: "1px solid oklch(0.78 0.15 85 / 0.25)",
                      }}
                    >
                      #{c.rank}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-white text-sm leading-snug line-clamp-2">
                        {c.shortName}
                      </p>
                      <p className="text-white/50 text-[10px] mt-0.5">
                        {c.city}
                      </p>
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
                className="border-t border-border"
                style={{
                  background:
                    rowIdx % 2 === 0
                      ? "oklch(1 0 0)"
                      : "oklch(0.98 0.005 240 / 0.5)",
                }}
              >
                {/* Row label — sticky on mobile */}
                <td
                  className="px-4 py-4 sticky left-0 z-10 min-w-[160px]"
                  style={{
                    background:
                      rowIdx % 2 === 0
                        ? "oklch(1 0 0)"
                        : "oklch(0.98 0.005 240 / 0.5)",
                    borderRight: "1px solid oklch(0.91 0.005 255)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="shrink-0">{row.icon}</span>
                    <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
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
        className="px-4 py-3 flex items-center gap-6 flex-wrap border-t border-border"
        style={{ background: "oklch(0.97 0.005 255)" }}
      >
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
          Legend:
        </span>
        <div className="flex items-center gap-2 text-xs">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ background: "oklch(0.78 0.15 85 / 0.25)" }}
          />
          <span className="text-muted-foreground">Best value</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ background: "oklch(0.55 0.22 25 / 0.12)" }}
          />
          <span className="text-muted-foreground">Lowest value</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function ComparePage({
  initialIds = [],
  onNavigateHome,
  onNavigateToRankings,
}: ComparePageProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>(
    initialIds.slice(0, MAX_COMPARE),
  );

  const selectedColleges = useMemo(
    () =>
      selectedIds
        .map((id) => COLLEGES.find((c) => c.id === id))
        .filter((c): c is College => c !== undefined),
    [selectedIds],
  );

  const handleAdd = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.length >= MAX_COMPARE || prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const handleRemove = (slotIndex: number) => {
    setSelectedIds((prev) => {
      const filled = prev.filter((id) => id > 0);
      return filled.filter((_, i) => i !== slotIndex);
    });
  };

  const handleClearAll = () => setSelectedIds([]);

  const canCompare = selectedIds.length >= 2;

  return (
    <div className="min-h-screen bg-background font-body antialiased">
      {/* ── Page Header ── */}
      <header
        className="relative bg-navy overflow-hidden"
        style={{ paddingTop: "5rem", paddingBottom: "4rem" }}
      >
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-20" />

        {/* Radial glows */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 10% 50%, oklch(0.55 0.18 300 / 0.15) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 90% 20%, oklch(0.78 0.15 85 / 0.12) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <button
              type="button"
              data-ocid="compare.link"
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Home</span>
            </button>
            <span className="text-white/25">/</span>
            <button
              type="button"
              data-ocid="compare.rankings_link"
              onClick={onNavigateToRankings}
              className="text-white/60 hover:text-white transition-colors"
            >
              Rankings
            </button>
            <span className="text-white/25">/</span>
            <span className="text-white/80 font-medium">Compare Colleges</span>
          </nav>

          {/* Heading */}
          <div className="max-w-3xl">
            <div
              className="eyebrow-tag mb-4"
              style={{ color: "oklch(0.78 0.15 85 / 0.8)" }}
            >
              Side-by-Side Analysis
            </div>
            <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
              Compare{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.90 0.18 88), oklch(0.72 0.18 72))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Colleges
              </span>
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl leading-relaxed">
              Select up to{" "}
              <span className="text-white/80 font-semibold">{MAX_COMPARE}</span>{" "}
              colleges and compare them side-by-side across rankings,
              placements, fees, and more.
            </p>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { label: "Parameters Compared", value: "10" },
              { label: "Max Colleges", value: `${MAX_COMPARE}` },
              { label: "Selected", value: `${selectedIds.length}` },
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

      {/* ── Main Content ── */}
      <main className="container mx-auto px-4 py-8">
        {/* ── College Selector ── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-navy text-lg flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-indigo" />
              Select Colleges to Compare
            </h2>
            <button
              type="button"
              data-ocid="compare.rankings_link"
              onClick={onNavigateToRankings}
              className="text-sm text-indigo hover:text-indigo/80 font-medium transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Rankings
            </button>
          </div>

          <CollegeSelector
            selectedIds={selectedIds}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onClearAll={handleClearAll}
          />
        </section>

        {/* ── Comparison Area ── */}
        <AnimatePresence mode="wait">
          {!canCompare ? (
            <motion.div
              key="empty"
              data-ocid="compare.empty_state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 3,
                }}
                className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.45 0.18 265 / 0.08), oklch(0.78 0.15 85 / 0.06))",
                  border: "1px solid oklch(0.45 0.18 265 / 0.12)",
                }}
              >
                <GitCompare className="w-11 h-11 text-indigo/40" />
              </motion.div>
              <h3 className="font-heading text-2xl font-bold text-navy mb-3">
                No comparison yet
              </h3>
              <p className="text-muted-foreground text-base max-w-sm mb-8 leading-relaxed">
                Select at least{" "}
                <strong className="text-foreground">2 colleges</strong> above to
                start comparing their rankings, placements, and metrics.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  data-ocid="compare.primary_button"
                  onClick={onNavigateToRankings}
                  className="bg-navy text-white hover:bg-navy/90 font-semibold px-6"
                >
                  Browse Rankings
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Comparison header bar */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading font-bold text-navy text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo" />
                  Comparison Results
                  <span
                    className="ml-1 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                    style={{ background: "oklch(0.45 0.18 265)" }}
                  >
                    {selectedColleges.length}
                  </span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="w-4 h-4 text-gold/70" />
                  <span>Gold = best value in row</span>
                </div>
              </div>

              <ComparisonTable colleges={selectedColleges} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Sticky Bottom Bar (when comparing) ── */}
      <AnimatePresence>
        {canCompare && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40"
            style={{
              background: "oklch(0.22 0.06 255 / 0.97)",
              backdropFilter: "blur(12px)",
              borderTop: "1px solid oklch(1 0 0 / 0.10)",
              boxShadow: "0 -4px 24px oklch(0.22 0.06 255 / 0.30)",
            }}
          >
            <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {selectedColleges.slice(0, 4).map((c, i) => (
                    <div
                      key={c.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-heading font-black text-[11px] border-2"
                      style={{
                        background: "oklch(0.35 0.08 255)",
                        color: "oklch(0.78 0.15 85)",
                        borderColor: "oklch(0.22 0.06 255)",
                        zIndex: 4 - i,
                      }}
                    >
                      #{c.rank}
                    </div>
                  ))}
                </div>
                <span className="text-white/80 text-sm font-medium">
                  Comparing{" "}
                  <strong className="text-white">
                    {selectedColleges.length}
                  </strong>{" "}
                  college{selectedColleges.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  data-ocid="compare.cancel_button"
                  onClick={handleClearAll}
                  className="text-white/60 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear All
                </button>
                <Button
                  data-ocid="compare.secondary_button"
                  onClick={onNavigateToRankings}
                  size="sm"
                  className="bg-gold text-foreground hover:brightness-95 font-semibold text-sm"
                >
                  + Add from Rankings
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom padding to account for sticky bar */}
      {canCompare && <div className="h-16" />}

      {/* ── Footer ── */}
      <footer
        className="mt-16 py-8 border-t border-border"
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
