// ─────────────────────────────────────────────────────────
//  src/components/compare/CompareBar.tsx
//  Extracted from: RankingsPage.tsx
//    → The sticky compare bar (AnimatePresence > motion.div)
//  JSX is 100% identical — no changes at all.
// ─────────────────────────────────────────────────────────

import { Button } from "../ui/button";
import { GitCompare, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface CompareBarProps {
  compareIds:      number[];
  compareWarning:  boolean;
  MAX_COMPARE:     number;
  onClear:         () => void;
  onCompareNow:    () => void;
}

export function CompareBar({
  compareIds,
  compareWarning,
  MAX_COMPARE,
  onClear,
  onCompareNow,
}: CompareBarProps) {
  return (
    <AnimatePresence>
      {compareIds.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
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
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <GitCompare className="w-4 h-4 text-gold/80" />
              <span className="text-white/80 text-sm font-medium">
                <strong className="text-white">{compareIds.length}</strong>{" "}
                college{compareIds.length !== 1 ? "s" : ""} selected for comparison
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
                onClick={onClear}
                className="text-white/60 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
              <Button
                data-ocid="rankings.compare_button"
                disabled={compareIds.length < 2}
                onClick={onCompareNow}
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
  );
}