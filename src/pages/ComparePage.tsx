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

/* ─── Design tokens — mirrors CollegeDetailsPage & RankingsPage exactly ─── */
const T = {
  heroBg:   "oklch(0.16 0.055 258)",
  indigo:   "oklch(0.46 0.19 266)",
  gold:     "oklch(0.80 0.16 86)",
  goldDeep: "oklch(0.60 0.14 78)",
  goldText: "oklch(0.42 0.14 78)",
  green:    "oklch(0.52 0.18 148)",
  greenTx:  "oklch(0.32 0.18 148)",
  red:      "oklch(0.54 0.20 27)",
  redTx:    "oklch(0.40 0.20 27)",
  navy:     "oklch(0.20 0.05 258)",
  muted:    "oklch(0.50 0.025 258)",
  border:   "oklch(0.91 0.01 258)",
  surface:  "oklch(0.975 0.005 258)",
};

/* ── Type badge ── */
function getTypeBadgeStyle(type: College["type"]) {
  switch (type) {
    case "IIT":     return "bg-[oklch(0.46_0.19_266/0.12)] text-[oklch(0.30_0.18_266)] border border-[oklch(0.46_0.19_266/0.35)]";
    case "NIT":     return "bg-[oklch(0.52_0.18_148/0.12)] text-[oklch(0.28_0.18_148)] border border-[oklch(0.52_0.18_148/0.35)]";
    case "Deemed":  return "bg-[oklch(0.80_0.16_86/0.15)]  text-[oklch(0.42_0.14_78)]  border border-[oklch(0.80_0.16_86/0.40)]";
    case "State":   return "bg-[oklch(0.54_0.06_240/0.12)] text-[oklch(0.30_0.05_240)] border border-[oklch(0.54_0.06_240/0.35)]";
    case "Private": return "bg-[oklch(0.56_0.18_305/0.12)] text-[oklch(0.32_0.17_305)] border border-[oklch(0.56_0.18_305/0.35)]";
  }
}

/* ── NAAC badge ── */
function getNaacBadgeStyle(grade: College["naacGrade"]) {
  switch (grade) {
    case "A++": return "bg-[oklch(0.80_0.16_86/0.16)]  text-[oklch(0.42_0.14_78)]  border border-[oklch(0.80_0.16_86/0.48)]  font-bold";
    case "A+":  return "bg-[oklch(0.52_0.18_148/0.14)] text-[oklch(0.28_0.18_148)] border border-[oklch(0.52_0.18_148/0.42)] font-bold";
    case "A":   return "bg-[oklch(0.46_0.19_266/0.13)] text-[oklch(0.28_0.18_266)] border border-[oklch(0.46_0.19_266/0.38)] font-bold";
    case "B++": return "bg-[oklch(0.54_0.06_240/0.13)] text-[oklch(0.34_0.05_240)] border border-[oklch(0.54_0.06_240/0.36)] font-bold";
  }
}

/* ═══════════════════════════════════════════════════════════════
   COLLEGE SELECTOR
═══════════════════════════════════════════════════════════════ */
interface CollegeSelectorProps {
  selectedIds: number[];
  onAdd: (id: number) => void;
  onRemove: (index: number) => void;
  onClearAll: () => void;
}

function CollegeSelector({ selectedIds, onAdd, onRemove, onClearAll }: CollegeSelectorProps) {
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const [search, setSearch]     = useState("");
  const dropdownRef             = useRef<HTMLDivElement>(null);

  const available = useMemo(() => {
    const sorted = [...COLLEGES].sort((a, b) => a.rank - b.rank);
    return sorted.filter(
      (c) =>
        !selectedIds.includes(c.id) &&
        (search === "" ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.shortName.toLowerCase().includes(search.toLowerCase()) ||
          c.city.toLowerCase().includes(search.toLowerCase())),
    );
  }, [selectedIds, search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenSlot(null);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const slots      = [...selectedIds];
  while (slots.length < 2) slots.push(-1);
  const canAddMore = selectedIds.length < MAX_COMPARE;

  /* Shared dropdown list */
  function DropdownList() {
    return (
      <div className="overflow-y-auto" style={{ maxHeight: "280px" }}>
        {available.length === 0 ? (
          <div className="py-8 text-center text-sm" style={{ color: T.muted }}>No colleges found</div>
        ) : (
          available.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => { onAdd(c.id); setOpenSlot(null); setSearch(""); }}
              className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors duration-150 border-b last:border-0"
              style={{ borderColor: T.surface }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${T.indigo}0D`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <div
                className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-heading font-black text-[11px]"
                style={{ background: T.heroBg, color: T.gold }}
              >
                #{c.rank}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-xs leading-snug truncate" style={{ color: T.navy }}>{c.shortName}</p>
                <p className="text-[10px] mt-0.5 truncate" style={{ color: T.muted }}>{c.city} · {c.type}</p>
              </div>
              <span className={`shrink-0 inline-block px-2 py-0.5 rounded text-[10px] ${getNaacBadgeStyle(c.naacGrade)}`}>
                {c.naacGrade}
              </span>
            </button>
          ))
        )}
      </div>
    );
  }

  function DropdownPanel() {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.18 }}
        className="absolute top-full left-0 mt-2 w-80 rounded-xl overflow-hidden z-50"
        style={{
          background: "#fff",
          border:     `1px solid ${T.border}`,
          boxShadow:  `0 16px 48px ${T.heroBg}30, 0 4px 16px oklch(0 0 0 / 0.08)`,
        }}
      >
        <div className="p-3 border-b" style={{ borderColor: T.border }}>
          <Input autoFocus placeholder="Search colleges..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="h-8 text-sm border-border" />
        </div>
        <DropdownList />
      </motion.div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-wrap gap-4 items-stretch">

        {/* Filled / empty slots */}
        {slots.map((id, slotIndex) => {
          const college = id > 0 ? COLLEGES.find((c) => c.id === id) : null;
          const isOpen  = openSlot === slotIndex;

          if (college) {
            return (
              <motion.div
                key={`filled-${college.id}`}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.22 }}
                className="relative flex-1 min-w-[180px] max-w-[280px] rounded-2xl p-5 border border-dashed border-gray-400"
                style={{
                  background: "#fff",
                  border:     `2px solid ${T.indigo}70`,
                  boxShadow:  `0 4px 20px ${T.indigo}1A, 0 1px 4px oklch(0 0 0 / 0.05)`,
                }}
              >
                {/* Remove */}
                <button
                  type="button"
                  data-ocid={`compare.remove_button.${slotIndex + 1}`}
                  onClick={() => onRemove(slotIndex)}
                  className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
                  style={{ background: T.red, color: "#fff", boxShadow: `0 2px 8px ${T.red}66` }}
                  aria-label={`Remove ${college.shortName}`}
                >
                  <X className="w-3 h-3" />
                </button>

                {/* Rank badge */}
                <div
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3 font-heading font-black text-sm "
                  style={{ background: T.heroBg, color: T.gold }}
                >
                  #{college.rank}
                </div>

                <p className="font-heading font-bold text-sm leading-snug mb-1.5 line-clamp-2" style={{ color: T.navy }}>
                  {college.shortName}
                </p>

                <div className="flex items-center gap-1 text-xs mb-3" style={{ color: T.muted }}>
                  <MapPin className="w-3 h-3 shrink-0" style={{ color: T.gold }} />
                  <span>{college.city}</span>
                </div>

                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getTypeBadgeStyle(college.type)}`}>
                  {college.type}
                </span>
              </motion.div>
            );
          }

          /* Empty slot */
          return (
            <motion.div
              key={`empty-pos-${slotIndex}-of-${slots.length}`}
              layout
              className="relative flex-1 min-w-[180px] max-w-[280px]"
            >
              <button
                type="button"
                data-ocid="compare.add_college_button"
                onClick={() => { setOpenSlot(isOpen ? null : slotIndex); setSearch(""); }}
                className="w-full h-full min-h-[130px] rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all duration-200 group border border-dashed border-gray-400"
                style={{ border: `2px dashed ${T.indigo}47`, background: `${T.surface}99` }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = `${T.indigo}99`;
                  el.style.background  = `${T.indigo}0A`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = `${T.indigo}47`;
                  el.style.background  = `${T.surface}99`;
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 border border-dashed border-amber-700"
                  style={{ background: `${T.indigo}14` }}
                >
                  <Plus className="w-5 h-5" style={{ color: `${T.indigo}99` }} />
                </div>
                <span className="text-xs font-semibold" style={{ color: T.muted }}>Add College</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  style={{ color: `${T.muted}99` }}
                />
              </button>

              <AnimatePresence>{isOpen && <DropdownPanel />}</AnimatePresence>
            </motion.div>
          );
        })}

        {/* Add more button */}
        {canAddMore && selectedIds.length === slots.length && (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex-1 min-w-[160px] max-w-[240px]"
          >
            <button
              type="button"
              data-ocid="compare.add_college_button"
              onClick={() => { setOpenSlot(slots.length); setSearch(""); }}
              className="w-full h-full min-h-[130px] rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all duration-200 border border-dashed border-gray-400 "
              style={{ border: `2px dashed ${T.gold}66`, background: `${T.gold}08` }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `${T.gold}BB`;
                el.style.background  = `${T.gold}12`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `${T.gold}66`;
                el.style.background  = `${T.gold}08`;
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 border border-amber-950 border-dashed"
                style={{ background: `${T.gold}22` }}
              >
                <Plus className="w-5 h-5" style={{ color: T.goldDeep }} />
              </div>
              <span className="text-xs font-semibold" style={{ color: T.goldDeep }}>Add College +</span>
              <span className="text-[10px]" style={{ color: `${T.muted}99` }}>
                {MAX_COMPARE - selectedIds.length} slot{MAX_COMPARE - selectedIds.length !== 1 ? "s" : ""} left
              </span>
            </button>

            <AnimatePresence>{openSlot === slots.length && <DropdownPanel />}</AnimatePresence>
          </motion.div>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs flex items-center gap-1 transition-colors hover:text-destructive"
            style={{ color: T.muted }}
          >
            <X className="w-3 h-3" />
            Clear all selections
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPARISON TABLE
═══════════════════════════════════════════════════════════════ */
interface ComparisonTableProps { colleges: College[]; }
type HighlightKind = "best" | "worst" | "neutral";

function getHighlight(value: number, values: number[], lowerIsBetter = false): HighlightKind {
  const best  = lowerIsBetter ? Math.min(...values) : Math.max(...values);
  const worst = lowerIsBetter ? Math.max(...values) : Math.min(...values);
  if (value === best)  return "best";
  if (value === worst) return "worst";
  return "neutral";
}

function cellStyle(kind: HighlightKind): React.CSSProperties {
  if (kind === "best")  return { background: `oklch(0.80 0.16 86 / 0.10)`, borderLeft: `3px solid ${T.gold}` };
  if (kind === "worst") return { background: `oklch(0.54 0.20 27 / 0.08)`, borderLeft: `3px solid ${T.red}88` };
  return {};
}

function valueColor(kind: HighlightKind) {
  if (kind === "best")  return T.goldText;
  if (kind === "worst") return T.redTx;
  return T.navy;
}

function BestLabel() {
  return (
    <span className="text-[10px] font-semibold mt-1 flex items-center gap-0.5" style={{ color: T.goldText }}>
      <Trophy className="w-2.5 h-2.5" /> Best
    </span>
  );
}

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="mt-2 w-full h-1.5 rounded-full overflow-hidden" style={{ background: T.border }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${T.indigo}, ${T.gold})` }}
      />
    </div>
  );
}

function ComparisonTable({ colleges }: ComparisonTableProps) {
  const overallScores   = colleges.map((c) => c.overallScore);
  const nirfRanks       = colleges.map((c) => c.nirfRank);
  const placementPcts   = colleges.map((c) => c.placementPct);
  const avgPackages     = colleges.map((c) => c.avgPackageLPA);
  const highestPackages = colleges.map((c) => c.highestPackageLPA);

  const rows = [
    {
      id: "overall", label: "Overall Score",
      icon: <Trophy className="w-4 h-4" style={{ color: `${T.gold}CC` }} />,
      render: (c: College) => {
        const kind = getHighlight(c.overallScore, overallScores);
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]" style={cellStyle(kind)}>
            <span className="font-heading font-black text-xl leading-none" style={{ color: valueColor(kind) }}>
              {c.overallScore}
            </span>
            <ScoreBar value={c.overallScore} />
            {kind === "best" && <BestLabel />}
          </td>
        );
      },
    },
    {
      id: "nirf", label: "NIRF Rank",
      icon: <BarChart3 className="w-4 h-4" style={{ color: `${T.indigo}B3` }} />,
      render: (c: College) => {
        const kind = getHighlight(c.nirfRank, nirfRanks, true);
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]" style={cellStyle(kind)}>
            <span className="font-heading font-black text-xl" style={{ color: valueColor(kind) }}>
              #{c.nirfRank}
            </span>
            {kind === "best" && (
              <div className="text-[10px] font-semibold mt-0.5 flex items-center gap-0.5" style={{ color: T.goldText }}>
                <Trophy className="w-2.5 h-2.5" /> Highest Rank
              </div>
            )}
          </td>
        );
      },
    },
    {
      id: "naac", label: "NAAC Grade",
      icon: <Trophy className="w-4 h-4" style={{ color: `${T.gold}B3` }} />,
      render: (c: College) => (
        <td key={c.id} className="px-5 py-4 min-w-[160px]">
          <span className={`inline-block px-3 py-1 rounded-md text-sm ${getNaacBadgeStyle(c.naacGrade)}`}>
            {c.naacGrade}
          </span>
        </td>
      ),
    },
    {
      id: "type", label: "College Type",
      icon: <Building2 className="w-4 h-4" style={{ color: T.muted }} />,
      render: (c: College) => (
        <td key={c.id} className="px-5 py-4 min-w-[160px]">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getTypeBadgeStyle(c.type)}`}>
            {c.type}
          </span>
        </td>
      ),
    },
    {
      id: "city", label: "City",
      icon: <MapPin className="w-4 h-4" style={{ color: T.muted }} />,
      render: (c: College) => (
        <td key={c.id} className="px-5 py-4 min-w-[160px]">
          <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: T.navy }}>
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: T.gold }} />
            {c.city}
          </div>
          <div className="text-xs mt-0.5" style={{ color: T.muted }}>{c.state}</div>
        </td>
      ),
    },
    {
      id: "established", label: "Established",
      icon: <Calendar className="w-4 h-4" style={{ color: T.muted }} />,
      render: (c: College) => (
        <td key={c.id} className="px-5 py-4 min-w-[160px]">
          <span className="font-heading font-bold text-sm" style={{ color: T.navy }}>{c.established}</span>
          <div className="text-xs mt-0.5" style={{ color: T.muted }}>
            {new Date().getFullYear() - c.established} years
          </div>
        </td>
      ),
    },
    {
      id: "placement", label: "Placement %",
      icon: <TrendingUp className="w-4 h-4" style={{ color: `${T.green}B3` }} />,
      render: (c: College) => {
        const kind = getHighlight(c.placementPct, placementPcts);
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]" style={cellStyle(kind)}>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-xl" style={{ color: valueColor(kind) }}>
                {c.placementPct}%
              </span>
              {c.trend === "up"   && <TrendingUp   className="w-4 h-4" style={{ color: T.greenTx }} />}
              {c.trend === "down" && <TrendingDown  className="w-4 h-4" style={{ color: T.redTx   }} />}
            </div>
            {kind === "best" && <BestLabel />}
          </td>
        );
      },
    },
    {
      id: "avgPkg", label: "Avg Package",
      icon: <span className="text-xs font-bold" style={{ color: T.greenTx }}>₹</span>,
      render: (c: College) => {
        const kind = getHighlight(c.avgPackageLPA, avgPackages);
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]" style={cellStyle(kind)}>
            <span className="font-heading font-black text-xl" style={{ color: valueColor(kind) }}>
              {c.avgPackageLPA}{" "}
              <span className="text-sm font-semibold" style={{ color: T.muted }}>LPA</span>
            </span>
            {kind === "best" && <BestLabel />}
          </td>
        );
      },
    },
    {
      id: "highestPkg", label: "Highest Package",
      icon: <span className="text-xs font-bold" style={{ color: T.goldText }}>₹₹</span>,
      render: (c: College) => {
        const kind = getHighlight(c.highestPackageLPA, highestPackages);
        return (
          <td key={c.id} className="px-5 py-4 min-w-[160px]" style={cellStyle(kind)}>
            <span className="font-heading font-black text-xl" style={{ color: valueColor(kind) }}>
              {c.highestPackageLPA}{" "}
              <span className="text-sm font-semibold" style={{ color: T.muted }}>LPA</span>
            </span>
            {kind === "best" && <BestLabel />}
          </td>
        );
      },
    },
    {
      id: "courses", label: "Courses Offered",
      icon: <BookOpen className="w-4 h-4" style={{ color: T.muted }} />,
      render: (c: College) => (
        <td key={c.id} className="px-5 py-4 min-w-[160px]">
          <div className="flex flex-wrap gap-1">
            {c.courses.slice(0, 4).map((course) => (
              <span
                key={course}
                className="inline-block px-2 py-0.5 rounded text-[10px] font-medium"
                style={{
                  background: `${T.indigo}0F`,
                  color:      "oklch(0.30 0.18 266)",
                  border:     `1px solid ${T.indigo}33`,
                }}
              >
                {course}
              </span>
            ))}
            {c.courses.length > 4 && (
              <span
                className="inline-block px-2 py-0.5 rounded text-[10px] font-medium border"
                style={{ color: T.muted, borderColor: T.border }}
              >
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
      className="rounded-2xl overflow-hidden"
      style={{
        border:    `1px solid ${T.border}`,
        boxShadow: `0 8px 32px oklch(0.16 0.055 258 / 0.08), 0 2px 8px oklch(0 0 0 / 0.04)`,
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: T.heroBg }}>
              <th
                className="px-5 py-4 text-left sticky left-0 z-10 font-semibold text-[11px] uppercase tracking-wider text-white/70 min-w-[160px]"
                style={{ background: T.heroBg, borderRight: "1px solid oklch(1 0 0 / 0.10)" }}
              >
                Parameter
              </th>
              {colleges.map((c, i) => (
                <motion.th
                  key={c.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.32 }}
                  className="px-5 py-4 text-left min-w-[160px]"
                  style={{ background: T.heroBg }}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-heading font-black text-[11px] mt-0.5"
                      style={{
                        background: `${T.gold}26`,
                        color:      T.gold,
                        border:     `1px solid ${T.gold}40`,
                      }}
                    >
                      #{c.rank}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-white text-sm leading-snug line-clamp-2">{c.shortName}</p>
                      <p className="text-white/50 text-[10px] mt-0.5">{c.city}</p>
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
                style={{
                  borderTop:  `1px solid ${T.border}`,
                  background: rowIdx % 2 === 0 ? "#fff" : T.surface,
                }}
              >
                <td
                  className="px-5 py-4 sticky left-0 z-10 min-w-[160px]"
                  style={{
                    background:  rowIdx % 2 === 0 ? "#fff" : T.surface,
                    borderRight: `1px solid ${T.border}`,
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="shrink-0">{row.icon}</span>
                    <span className="font-semibold text-xs uppercase tracking-wide" style={{ color: T.muted }}>
                      {row.label}
                    </span>
                  </div>
                </td>
                {colleges.map((c) => row.render(c))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div
        className="px-5 py-3.5 flex items-center gap-6 flex-wrap"
        style={{ borderTop: `1px solid ${T.border}`, background: T.surface }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: T.muted }}>
          Legend:
        </span>
        <div className="flex items-center gap-2 text-xs">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ background: `oklch(0.80 0.16 86 / 0.25)`, border: `1px solid ${T.gold}88` }}
          />
          <span style={{ color: T.muted }}>Best value</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ background: `oklch(0.54 0.20 27 / 0.14)`, border: `1px solid ${T.red}66` }}
          />
          <span style={{ color: T.muted }}>Lowest value</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export function ComparePage({ initialIds = [], onNavigateHome, onNavigateToRankings }: ComparePageProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>(initialIds.slice(0, MAX_COMPARE));

  const selectedColleges = useMemo(
    () => selectedIds.map((id) => COLLEGES.find((c) => c.id === id)).filter((c): c is College => c !== undefined),
    [selectedIds],
  );

  const handleAdd      = (id: number) => setSelectedIds((p) => p.length >= MAX_COMPARE || p.includes(id) ? p : [...p, id]);
  const handleRemove   = (idx: number) => setSelectedIds((p) => p.filter((id) => id > 0).filter((_, i) => i !== idx));
  const handleClearAll = () => setSelectedIds([]);
  const canCompare     = selectedIds.length >= 2;

  return (
    <div className="min-h-screen bg-background font-body antialiased">

      {/* ════ HERO ════ */}
      <header
        className="relative overflow-hidden"
        style={{ background: T.heroBg, paddingTop: "5rem", paddingBottom: "4rem" }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(1 0 0 / 0.25) 1px, transparent 1px)",
            backgroundSize:  "28px 28px",
          }}
        />
        {/* Indigo glow */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 80% at 10% 50%, ${T.indigo}4D 0%, transparent 65%)` }} />
        {/* Gold glow */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 50% 60% at 90% 20%, ${T.gold}1A 0%, transparent 60%)` }} />
        {/* Decorative circle */}
        <div
          className="absolute right-0 bottom-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: T.gold, opacity: 0.035, transform: "translate(42%, 42%)" }}
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <button
              type="button"
              data-ocid="compare.link"
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Home
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
            <div className="eyebrow-tag mb-4" style={{ color: `${T.gold}CC` }}>
              Side-by-Side Analysis
            </div>
            <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-white mb-4 tracking-tight">
              Compare{" "}
              <span
                style={{
                  background:           "linear-gradient(135deg, oklch(0.92 0.18 90), oklch(0.72 0.18 72))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor:  "transparent",
                  backgroundClip:       "text",
                }}
              >
                Colleges
              </span>
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl leading-relaxed">
              Select up to{" "}
              <span className="text-white/80 font-semibold">{MAX_COMPARE}</span>{" "}
              colleges and compare them side-by-side across rankings, placements, fees, and more.
            </p>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { label: "Parameters Compared", value: "10"              },
              { label: "Max Colleges",         value: `${MAX_COMPARE}` },
              { label: "Selected",             value: `${selectedIds.length}` },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                style={{
                  background:     "oklch(1 0 0 / 0.055)",
                  border:         "1px solid oklch(1 0 0 / 0.10)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div>
                  <p className="text-[10px] text-white/45 uppercase tracking-wider font-medium leading-none mb-0.5">
                    {stat.label}
                  </p>
                  <p className="text-white font-bold text-sm font-heading leading-none">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ════ MAIN ════ */}
      <main className="container mx-auto px-4 sm:px-6 py-8">

        {/* Selector section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-lg flex items-center gap-2" style={{ color: T.navy }}>
              <GitCompare className="w-5 h-5" style={{ color: T.indigo }} />
              Select Colleges to Compare
            </h2>
            <button
              type="button"
              data-ocid="compare.rankings_link"
              onClick={onNavigateToRankings}
              className="text-sm font-medium transition-colors flex items-center gap-1 hover:opacity-75"
              style={{ color: T.indigo }}
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

        {/* Comparison area */}
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
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: `linear-gradient(135deg, ${T.indigo}14, ${T.gold}0F)`,
                  border:     `1px solid ${T.indigo}1F`,
                }}
              >
                <GitCompare className="w-11 h-11" style={{ color: `${T.indigo}66` }} />
              </motion.div>
              <h3 className="font-heading text-2xl font-bold mb-3" style={{ color: T.navy }}>
                No comparison yet
              </h3>
              <p className="text-base max-w-sm mb-8 leading-relaxed" style={{ color: T.muted }}>
                Select at least <strong style={{ color: T.navy }}>2 colleges</strong> above to start comparing their rankings, placements, and metrics.
              </p>
              <Button
                data-ocid="compare.primary_button"
                onClick={onNavigateToRankings}
                className="bg-navy text-white hover:bg-navy/90 font-semibold px-6"
              >
                Browse Rankings
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading font-bold text-lg flex items-center gap-2" style={{ color: T.navy }}>
                  <BarChart3 className="w-5 h-5" style={{ color: T.indigo }} />
                  Comparison Results
                  <span
                    className="ml-1 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                    style={{ background: T.indigo }}
                  >
                    {selectedColleges.length}
                  </span>
                </h2>
                <div className="flex items-center gap-2 text-sm" style={{ color: T.muted }}>
                  <Trophy className="w-4 h-4" style={{ color: `${T.gold}B3` }} />
                  <span>Gold = best value in row</span>
                </div>
              </div>

              <ComparisonTable colleges={selectedColleges} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ════ STICKY BOTTOM BAR ════ */}
      <AnimatePresence>
        {canCompare && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40"
            style={{
              background:     "oklch(0.16 0.055 258 / 0.97)",
              backdropFilter: "blur(12px)",
              borderTop:      "1px solid oklch(1 0 0 / 0.10)",
              boxShadow:      "0 -4px 24px oklch(0.16 0.055 258 / 0.30)",
            }}
          >
            <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {selectedColleges.slice(0, 4).map((c, i) => (
                    <div
                      key={c.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-heading font-black text-[11px] border-2"
                      style={{
                        background:  "oklch(0.26 0.07 258)",
                        color:       T.gold,
                        borderColor: T.heroBg,
                        zIndex:      4 - i,
                      }}
                    >
                      #{c.rank}
                    </div>
                  ))}
                </div>
                <span className="text-white/80 text-sm font-medium">
                  Comparing{" "}
                  <strong className="text-white">{selectedColleges.length}</strong>{" "}
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

      {canCompare && <div className="h-16" />}

      {/* ════ FOOTER ════ */}
      <footer
        className="mt-16 py-8"
        style={{ borderTop: `1px solid ${T.border}`, background: T.surface }}
      >
        <div
          className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
          style={{ color: T.muted }}
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" style={{ color: T.indigo }} />
            <span>College Ranking Analytics Platform</span>
          </div>
          <p>
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
              style={{ color: T.indigo }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}