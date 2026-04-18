import { Button } from "../ui/button";
import { GitCompare, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface CompareBarProps {
  compareIds:     number[];
  compareWarning: boolean;
  MAX_COMPARE:    number;
  onClear:        () => void;
  onCompareNow:   () => void;
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
            background:     "oklch(0.16 0.055 258)",
            backdropFilter: "blur(12px)",
            // borderTop:      "1px solid rgba(160, 140, 255, 0.22)",
            // boxShadow:      "0 -6px 32px rgba(80, 50, 200, 0.22)",
          }}
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <GitCompare className="w-4 h-4" style={{ color: "#c4b5fd" }} />

              <span className="text-sm font-normal" style={{ color: "rgba(200, 185, 255, 0.85)" }}>
                <strong className="font-semibold text-[15px]" style={{ color: "#f0e6ff" }}>
                  {compareIds.length}
                </strong>{" "}
                college{compareIds.length !== 1 ? "s" : ""} selected for comparison
                {compareIds.length < 2 && (
                  <span className="ml-2 text-xs" style={{ color: "rgba(180, 160, 255, 0.45)" }}>
                    (select at least 2)
                  </span>
                )}
              </span>

              {compareWarning && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    color:      "#fbbf24",
                    background: "rgba(251, 191, 36, 0.12)",
                    border:     "0.5px solid rgba(251, 191, 36, 0.25)",
                  }}
                >
                  Max {MAX_COMPARE} colleges allowed
                </motion.span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Clear button */}
              <button
                type="button"
                onClick={onClear}
                className="text-sm font-medium flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all"
                style={{ color: "rgba(180, 160, 255, 0.75)" }}
                onMouseOver={e =>
                  Object.assign((e.currentTarget as HTMLElement).style, {
                    background: "rgba(255,255,255,0.08)",
                    color: "#f0e6ff",
                  })
                }
                onMouseOut={e =>
                  Object.assign((e.currentTarget as HTMLElement).style, {
                    background: "transparent",
                    color: "rgba(180, 160, 255, 0.75)",
                  })
                }
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>

              {/* Compare Now button */}
              <Button
                data-ocid="rankings.compare_button"
                disabled={compareIds.length < 2}
                onClick={onCompareNow}
                size="sm"
                className="font-bold text-sm disabled:opacity-35"
                style={{
                  background:  compareIds.length >= 2
                    ? "linear-gradient(135deg, #f5c842 0%, #e8a820 100%)"
                    : "linear-gradient(135deg, #f5c842 0%, #e8a820 100%)",
                  color:       "#1e1456",
                  border:      "none",
                  boxShadow:   compareIds.length >= 2
                    ? "0 2px 12px rgba(245, 200, 66, 0.30)"
                    : "none",
                }}
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