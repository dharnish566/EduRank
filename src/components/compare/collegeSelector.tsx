import { Input } from "../ui/input";
import { ChevronDown, Loader2, MapPin, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiUrl } from "../../utils/api";

import { getNaacBadgeStyle, getTypeBadgeStyle } from "../../utils/rankingStyles";
import { T } from "../../utils/compareTokens";
import type { College } from "../../data/colleges";

const MAX_COMPARE = 4;

interface RawCollege {
  id:                   number;
  name:                 string;
  district:             string;
  state?:               string;
  type:                 string;
  overall_score:        number;
  establishment_year:   number;
  naacgrade:            string;
  naacscore:            string;
  nirfscore:            number;
  rank:                 number;
  placement_percentage: string;
  avg_cutoff:           string;
  course_count:         string;
  highest_cutoff:       string;
  criterion1?:          string;
  criterion2?:          string;
  criterion3?:          string;
  criterion4?:          string;
  criterion5?:          string;
  criterion6?:          string;
  criterion7?:          string;
}

function mapCollege(raw: RawCollege): College {
  const naacCriteria: Record<number, number> = {};
  const criterionFields: Record<string, number> = {
    criterion1: 1, criterion2: 2, criterion3: 3,
    criterion4: 4, criterion5: 5, criterion6: 6, criterion7: 7,
  };
  for (const [field, no] of Object.entries(criterionFields)) {
    const val = raw[field as keyof RawCollege];
    const cgpa = val != null ? parseFloat(String(val)) : 0;
    naacCriteria[no] = isNaN(cgpa) ? 0 : cgpa;
  }

  return {
    id:            raw.id,
    name:          raw.name,
    shortName:     raw.name,
    district:      raw.district,
    city:          raw.district,
    state:         raw.state ?? "",
    type:          raw.type as College["type"],
    rank:          raw.rank ?? 0,
    nirfRank:      raw.nirfscore > 0 ? raw.nirfscore : null,
    overallScore:  raw.overall_score ?? 0,
    established:   raw.establishment_year,
    naacGrade:     raw.naacgrade as College["naacGrade"],
    naacScore:     parseFloat(raw.naacscore)            || 0,
    placementPct:  parseFloat(raw.placement_percentage) || 0,
    avgCutoff:     parseFloat(raw.avg_cutoff)           || 0,
    highestCutoff: parseFloat(raw.highest_cutoff)       || 0,
    courseCount:   parseInt(raw.course_count, 10)       || 0,
    courses:       [],
    naacCriteria,  
  };
}

interface SearchCollege {
  id:        number;
  name:      string;
  shortName: string;
  district:  string;
  state:     string;
  type:      string;
  naacGrade: "A++" | "A+" | "A" | "B++" | "B+" | "B" | "C" | undefined;
  rank:      number;
}

export interface CollegeSelectorProps {
  selectedIds:       number[];
  onAdd:             (id: number) => void;
  onRemove:          (index: number) => void;
  onClearAll:        () => void;
  onDetailMapChange: (map: Map<number, College>) => void;
}

// ─────────────────────────────────────────────────────────
//  Stable module-level sub-components (not inside render)
//  Avoids React remounting them every render → keeps autoFocus
// ─────────────────────────────────────────────────────────

interface DropdownListProps {
  searchLoading: boolean;
  searchResults: SearchCollege[];
  onSelect:      (id: number) => void;
}

function DropdownList({ searchLoading, searchResults, onSelect }: DropdownListProps) {
  if (searchLoading) {
    return (
      <div className="py-8 flex items-center justify-center gap-2 text-sm" style={{ color: T.muted }}>
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading…
      </div>
    );
  }
  if (searchResults.length === 0) {
    return (
      <div className="py-8 text-center text-sm" style={{ color: T.muted }}>
        No colleges found
      </div>
    );
  }
  return (
    <div className="overflow-y-auto" style={{ maxHeight: "280px" }}>
      {searchResults.map((c) => (
        <button
          type="button"
          key={c.id}
          onClick={() => onSelect(c.id)}
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
            <p className="font-heading font-bold text-xs leading-snug truncate" style={{ color: T.navy }}>
              {c.shortName}
            </p>
            <p className="text-[10px] mt-0.5 truncate" style={{ color: T.muted }}>
              {c.district}{c.district ? ` · ${c.state}` : c.state} · {c.type}
            </p>
          </div>
          <span className={`shrink-0 inline-block px-2 py-0.5 rounded text-[10px] ${getNaacBadgeStyle(c.naacGrade)}`}>
            {c.naacGrade}
          </span>
        </button>
      ))}
    </div>
  );
}

interface DropdownPanelProps extends DropdownListProps {
  search:         string;
  onSearchChange: (v: string) => void;
}

function DropdownPanel({ search, onSearchChange, ...listProps }: DropdownPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{ opacity: 0,   y: -8,  scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="absolute top-full left-0 mt-2 w-80 rounded-xl overflow-hidden z-50"
      style={{
        background: "#fff",
        border:     `1px solid ${T.border}`,
        boxShadow:  `0 16px 48px ${T.heroBg}30, 0 4px 16px oklch(0 0 0 / 0.08)`,
      }}
    >
      <div className="p-3 border-b" style={{ borderColor: T.border }}>
        <Input
          autoFocus
          placeholder="Search colleges..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 text-sm border-border"
        />
      </div>
      <DropdownList {...listProps} />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
//  Main component
// ─────────────────────────────────────────────────────────
export function CollegeSelector({
  selectedIds,
  onAdd,
  onRemove,
  onClearAll,
  onDetailMapChange,
}: CollegeSelectorProps) {
  const [openSlot,        setOpenSlot]        = useState<number | null>(null);
  const [search,          setSearch]          = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchResults,   setSearchResults]   = useState<SearchCollege[]>([]);
  const [searchLoading,   setSearchLoading]   = useState(false);
  const [detailMap,       setDetailMap]       = useState<Map<number, College>>(new Map());
  const [detailLoading,   setDetailLoading]   = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef<string>("");

  const idsKey = selectedIds.join(",");

  // ── Notify parent on map change ─────────────────────────
  useEffect(() => {
    onDetailMapChange(detailMap);
  }, [detailMap, onDetailMapChange]);

  // ── Outside-click closes dropdown ──────────────────────
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

  // ── Debounce search ────────────────────────────────────
  useEffect(() => {
    const tid = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(tid);
  }, [search]);

  // ── Search dropdown fetch ──────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(apiUrl(`/colleges/search?query=${encodeURIComponent(debouncedSearch)}`));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: SearchCollege[] = await res.json();
        if (!cancelled) {
          const current = idsKey ? idsKey.split(",").map(Number) : [];
          setSearchResults(data.filter((c) => !current.includes(c.id)));
        }
      } catch (err) {
        console.error("[CollegeSelector] search fetch failed", err);
        if (!cancelled) setSearchResults([]);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, idsKey]);

  // ── Single merged prune-then-fetch effect ──────────────
  //
  // One effect handles both pruning stale ids from the map
  // AND fetching missing ids, using a functional setDetailMap
  // updater so we always operate on the latest state without
  // stale closure issues.
  useEffect(() => {
    if (selectedIds.length === 0) {
      setDetailMap(new Map());
      fetchingRef.current = "";
      return;
    }

    if (fetchingRef.current === idsKey) return;
    fetchingRef.current = idsKey;

    let cancelled = false;

    setDetailMap((prev) => {
      // Step 1: prune ids that are no longer selected
      const pruned = new Map<number, College>();
      for (const [k, v] of prev) {
        if (selectedIds.includes(k)) pruned.set(k, v);
      }

      // Step 2: find missing ids from the pruned map
      const missing = selectedIds.filter((id) => !pruned.has(id));

      if (missing.length > 0) {
        // Step 3: fetch missing ids and map raw → College
        setDetailLoading(true);
        fetch(apiUrl("/colleges/compare"), {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ ids: missing }),
        })
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json() as Promise<RawCollege[]>; // ✅ typed as RawCollege[]
          })
          .then((data) => {
            if (cancelled) return;
            setDetailMap((current) => {
              const next = new Map(current);
              for (const raw of data) next.set(raw.id, mapCollege(raw)); // ✅ mapped here
              return next;
            });
          })
          .catch((err) => {
            console.error("[CollegeSelector] compare fetch failed", err);
          })
          .finally(() => {
            if (!cancelled) setDetailLoading(false);
          });
      }

      return pruned;
    });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  // ── Handlers ───────────────────────────────────────────
  const handleClose = useCallback(() => {
    setOpenSlot(null);
    setSearch("");
  }, []);

  const handleSelect = useCallback((id: number) => {
    onAdd(id);
    handleClose();
  }, [onAdd, handleClose]);

  // ── Slot layout ────────────────────────────────────────
  const slots      = [...selectedIds];
  while (slots.length < 2) slots.push(-1);
  const canAddMore = selectedIds.length < MAX_COMPARE;

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-wrap gap-4 items-stretch">

        {slots.map((id, slotIndex) => {
          const college = id > 0 ? detailMap.get(id) ?? null : null;
          const isOpen  = openSlot === slotIndex;

          // ── Filled card ─────────────────────────────────
          if (college) {
            return (
              <motion.div
                key={`filled-${college.id}`}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1    }}
                exit={{ opacity: 0,   scale: 0.92  }}
                transition={{ duration: 0.22 }}
                className="relative flex-1 min-w-[180px] max-w-[280px] rounded-2xl p-5 border border-gray-400 border-dashed rounded-3xl"
                style={{
                  background: "#fff",
                  border:     `2px solid ${T.indigo}70`,
                  boxShadow:  `0 4px 20px ${T.indigo}1A, 0 1px 4px oklch(0 0 0 / 0.05)`,
                }}
              >
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

                <div
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3 font-heading font-black text-sm"
                  style={{ background: T.heroBg, color: T.gold }}
                >
                  #{college.rank ?? college.id}
                </div>

                <p className="font-heading font-bold text-sm leading-snug mb-1.5 line-clamp-2" style={{ color: T.navy }}>
                  {college.name}
                </p>

                <div className="flex items-center gap-1 text-xs mb-3" style={{ color: T.muted }}>
                  <MapPin className="w-3 h-3 shrink-0" style={{ color: T.gold }} />
                  <span>{college.district ?? college.city}</span>
                </div>

                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getTypeBadgeStyle(college.type)}`}>
                  {college.type !== "-" ? college.type : "Unknown"}
                </span>
              </motion.div>
            );
          }

          // ── Loading shimmer ─────────────────────────────
          if (id > 0 && detailLoading) {
            return (
              <motion.div
                key={`pending-${id}`}
                layout
                className="relative flex-1 min-w-[180px] max-w-[280px] rounded-2xl p-5 animate-pulse"
                style={{ background: T.surface, border: `2px solid ${T.border}` }}
              >
                <div className="w-9 h-9 rounded-xl mb-3" style={{ background: T.border }} />
                <div className="h-3 rounded mb-2 w-3/4"  style={{ background: T.border }} />
                <div className="h-3 rounded w-1/2"        style={{ background: T.border }} />
              </motion.div>
            );
          }

          // ── Empty / add slot ────────────────────────────
          const slotKey = id > 0 ? `empty-${id}` : `pad-${slotIndex}`;

          return (
            <motion.div
              key={slotKey}
              layout
              className="relative flex-1 min-w-[180px] max-w-[280px] border border-gray-400 border-dashed rounded-3xl" 
            >
              <button
                type="button"
                data-ocid="compare.add_college_button"
                onClick={() => { setOpenSlot(isOpen ? null : slotIndex); setSearch(""); }}
                className="w-full h-full min-h-[130px] rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all duration-200 group"
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

              <AnimatePresence>
                {isOpen && (
                  <DropdownPanel
                    search={search}
                    onSearchChange={setSearch}
                    searchLoading={searchLoading}
                    searchResults={searchResults}
                    onSelect={handleSelect}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* ── Add 3rd / 4th slot button ── */}
        {canAddMore && selectedIds.length === slots.length && (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex-1 min-w-[160px] max-w-[240px] border border-gray-400 border-dashed rounded-3xl"
          >
            <button
              type="button"
              data-ocid="compare.add_college_button"
              onClick={() => { setOpenSlot(slots.length); setSearch(""); }}
              className="w-full h-full min-h-[130px] rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all duration-200"
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
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 border border-dashed border-amber-950"
                style={{ background: `${T.gold}22` }}
              >
                <Plus className="w-5 h-5" style={{ color: T.goldDeep }} />
              </div>
              <span className="text-xs font-semibold" style={{ color: T.goldDeep }}>Add College</span>
              <span className="text-[10px]" style={{ color: `${T.muted}99` }}>
                {MAX_COMPARE - selectedIds.length} slot{MAX_COMPARE - selectedIds.length !== 1 ? "s" : ""} left
              </span>
            </button>

            <AnimatePresence>
              {openSlot === slots.length && (
                <DropdownPanel
                  search={search}
                  onSearchChange={setSearch}
                  searchLoading={searchLoading}
                  searchResults={searchResults}
                  onSelect={handleSelect}
                />
              )}
            </AnimatePresence>
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