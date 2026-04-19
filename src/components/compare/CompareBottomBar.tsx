import { Button } from "../ui/button";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { College } from "../../data/colleges";
import { T } from "../../utils/compareTokens";

interface CompareBottomBarProps {
  canCompare:        boolean;
  selectedColleges:  College[];
  onClearAll:        () => void;
  onNavigateToRankings: () => void;
}

export function CompareBottomBar({
  canCompare,
  selectedColleges,
  onClearAll,
  onNavigateToRankings,
}: CompareBottomBarProps) {
  return (
    <>
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
            }}
          >
            <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
              {/* Left: rank avatar stack + label */}
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

              {/* Right: clear + add from rankings */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  data-ocid="compare.cancel_button"
                  onClick={onClearAll}
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
                  style={{
                  background:  selectedColleges.length >= 2
                    ? "linear-gradient(135deg, #f5c842 0%, #e8a820 100%)"
                    : "linear-gradient(135deg, #f5c842 0%, #e8a820 100%)",
                  color:       "#1e1456",
                  border:      "none",
                  boxShadow:   selectedColleges.length >= 2
                    ? "0 2px 12px rgba(245, 200, 66, 0.30)"
                    : "none",
                }}
                >
                  + Add from Rankings
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer so content isn't hidden behind sticky bar */}
      {canCompare && <div className="h-16" />}
    </>
  );
}