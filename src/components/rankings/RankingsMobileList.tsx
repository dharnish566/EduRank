// ─────────────────────────────────────────────────────────
//  src/components/rankings/RankingsMobileList.tsx
//  Extracted from: RankingsPage.tsx
//    → The mobile card list block (md:hidden ... </div>)
//  JSX is 100% identical — only import sources changed.
// ─────────────────────────────────────────────────────────

import { Button } from "../ui/button";
import { MapPin }  from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { College } from "../../data/colleges";

import { TrendBadge }                                             from "./TrendBadge";
import { getRankMedalStyle, getTypeBadgeStyle, getNaacBadgeStyle } from "../../utils/rankingStyles";

interface RankingsMobileListProps {
  paginated:       College[];
  compareIds:      number[];
  safeCurrentPage: number;
  ITEMS_PER_PAGE:  number;
  onToggleCompare: (id: number) => void;
  onViewDetails:   (id: number) => void;
}

export function RankingsMobileList({
  paginated,
  compareIds,
  safeCurrentPage,
  ITEMS_PER_PAGE,
  onToggleCompare,
  onViewDetails,
}: RankingsMobileListProps) {
  return (
    <div className="md:hidden flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {paginated.map((college, i) => {
          const medal    = getRankMedalStyle(college.rank);
          const rowIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE + i + 1;

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
                    color:      medal.text,
                    boxShadow:  medal.shadow,
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
                      width:      `${college.overallScore}%`,
                      background: "linear-gradient(90deg, oklch(0.46 0.19 266), oklch(0.80 0.16 86))",
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
                    onClick={() => onToggleCompare(college.id)}
                    className={`h-7 px-3 text-xs font-semibold rounded-md border transition-all ${
                      compareIds.includes(college.id)
                        ? "bg-indigo/10 border-indigo/50 text-indigo"
                        : "border-border text-muted-foreground hover:border-indigo/30 hover:text-indigo"
                    }`}
                  >
                    {compareIds.includes(college.id) ? "✓ Compare" : "+ Compare"}
                  </button>
                  <Button
                    data-ocid={`rankings.item.button.${rowIndex}`}
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(college.id)}
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
  );
}