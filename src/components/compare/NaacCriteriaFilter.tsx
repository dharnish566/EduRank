import { motion, AnimatePresence } from "motion/react";
import { T } from "../../utils/compareTokens";

export const CRITERION_LABELS: Record<number, string> = {
  1: "Curricular Aspects",
  2: "Teaching-Learning & Evaluation",
  3: "Research, Innovations & Extension",
  4: "Infrastructure & Learning Resources",
  5: "Student Support & Progression",
  6: "Governance, Leadership & Management",
  7: "Institutional Values & Best Practices",
};

export type CriterionFilter = "all" | number;

interface NaacCriteriaFilterProps {
  active: CriterionFilter;
  onChange: (f: CriterionFilter) => void;
}

const FILTERS: { label: string; value: CriterionFilter }[] = [
  { label: "All Criteria", value: "all" },
  ...Array.from({ length: 7 }, (_, i) => ({
    label: `C${i + 1}`,
    value: i + 1,
  })),
];

export function NaacCriteriaFilter({ active, onChange }: NaacCriteriaFilterProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2 px-5 py-4 rounded-2xl"
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        boxShadow: `0 2px 8px oklch(0 0 0 / 0.04)`,
      }}
    >
      {/* Label */}
      <span
        className="text-[11px] font-semibold uppercase tracking-wider mr-1 shrink-0"
        style={{ color: T.muted }}
      >
        NAAC Filter:
      </span>

      {/* Pills */}
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => {
          const isActive = active === f.value;
          return (
            <button
              key={String(f.value)}
              onClick={() => onChange(f.value)}
              className="relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 focus:outline-none"
              style={{
                color: isActive ? "#fff" : T.muted,
                background: isActive ? "transparent" : "transparent",
                border: `1.5px solid ${isActive ? T.indigo : T.border}`,
              }}
            >
              {/* Animated background */}
              {isActive && (
                <motion.span
                  layoutId="naac-filter-active"
                  className="absolute inset-0 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.gold})` }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active criterion full name */}
      <AnimatePresence mode="wait">
        {active !== "all" && (
          <motion.span
            key={active}
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.18 }}
            className="ml-2 text-[11px] font-medium px-2.5 py-1 rounded-lg"
            style={{
              color: T.navy,
              background: `${T.indigo}18`,
              border: `1px solid ${T.indigo}30`,
            }}
          >
            {CRITERION_LABELS[active as number]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}