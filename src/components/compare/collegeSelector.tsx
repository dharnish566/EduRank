// ─────────────────────────────────────────────────────────
//  src/components/compare/CollegeSelector.tsx
//  Extracted from: ComparePage.tsx
//    → CollegeSelectorProps interface
//    → CollegeSelector component  (was a local function)
//    → DropdownList inner component
//    → DropdownPanel inner component
//
//  Reuses from existing shared files:
//    → getNaacBadgeStyle  from ../../utils/rankingStyles  (already exists)
//    → getTypeBadgeStyle  from ../../utils/rankingStyles  (already exists)
//    → T tokens           from ../../utils/compareTokens
//
//  JSX is 100% identical — only import sources changed.
// ─────────────────────────────────────────────────────────

import { Input }  from "../ui/input";
import { COLLEGES } from "../../data/colleges";
import { ChevronDown, MapPin, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

// ── Reuse shared style helpers (already live in rankingStyles.ts) ──
import { getNaacBadgeStyle, getTypeBadgeStyle } from "../../utils/rankingStyles";
import { T } from "../../utils/compareTokens";

const MAX_COMPARE = 4;

export interface CollegeSelectorProps {
  selectedIds: number[];
  onAdd:       (id: number) => void;
  onRemove:    (index: number) => void;
  onClearAll:  () => void;
}

export function CollegeSelector({
  selectedIds,
  onAdd,
  onRemove,
  onClearAll,
}: CollegeSelectorProps) {
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const [search,   setSearch]   = useState("");
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

  // Close dropdown when clicking outside
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

  // ── Inner: scrollable list of available colleges ──────
  function DropdownList() {
    return (
      <div className="overflow-y-auto" style={{ maxHeight: "280px" }}>
        {available.length === 0 ? (
          <div className="py-8 text-center text-sm" style={{ color: T.muted }}>
            No colleges found
          </div>
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
                <p className="font-heading font-bold text-xs leading-snug truncate" style={{ color: T.navy }}>
                  {c.shortName}
                </p>
                <p className="text-[10px] mt-0.5 truncate" style={{ color: T.muted }}>
                  {c.city} · {c.type}
                </p>
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

  // ── Inner: animated dropdown panel ───────────────────
  function DropdownPanel() {
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
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm border-border"
          />
        </div>
        <DropdownList />
      </motion.div>
    );
  }

  // ── Render ────────────────────────────────────────────
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
                animate={{ opacity: 1, scale: 1    }}
                exit={{ opacity: 0,   scale: 0.92  }}
                transition={{ duration: 0.22 }}
                className="relative flex-1 min-w-[180px] max-w-[280px] rounded-2xl p-5 border border-dashed border-gray-400"
                style={{
                  background: "#fff",
                  border:     `2px solid ${T.indigo}70`,
                  boxShadow:  `0 4px 20px ${T.indigo}1A, 0 1px 4px oklch(0 0 0 / 0.05)`,
                }}
              >
                {/* Remove button */}
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
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3 font-heading font-black text-sm"
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

        {/* Add more button (3rd / 4th slot) */}
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
              className="w-full h-full min-h-[130px] rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all duration-200 border border-dashed border-gray-400"
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

      {/* Clear all link */}
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