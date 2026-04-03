// ─────────────────────────────────────────────────────────
//  src/components/rankings/RankingsTable.tsx
//  Extracted from: RankingsPage.tsx
//    → The desktop table block  (hidden md:block ... </div>)
//    → Inline getRankMedalStyle calls replaced with import
//    → Inline getTypeBadgeStyle / getNaacBadgeStyle replaced
//    → TrendBadge replaced with import
//  JSX is 100% identical — only import sources changed.
// ─────────────────────────────────────────────────────────

import { Button }   from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { MapPin }   from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { College } from "../../data/colleges";

import { TrendBadge } from "./TrendBadge";
import { getRankMedalStyle, getTypeBadgeStyle, getNaacBadgeStyle } from "../../utils/rankingStyles";

interface RankingsTableProps {
  paginated:        College[];
  compareIds:       number[];
  safeCurrentPage:  number;
  ITEMS_PER_PAGE:   number;
  onToggleCompare:  (id: number) => void;
  onViewDetails:    (id: number) => void;
}

export function RankingsTable({
  paginated,
  compareIds,
  safeCurrentPage,
  ITEMS_PER_PAGE,
  onToggleCompare,
  onViewDetails,
}: RankingsTableProps) {

  
  return (
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
              const rowIndex   = (safeCurrentPage - 1) * ITEMS_PER_PAGE + i + 1;

              const medal = getRankMedalStyle(college.rank ?? 999);

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
                    (e.currentTarget as HTMLElement).style.borderLeft = "";
                  }}
                >
                  {/* Compare checkbox */}
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <Checkbox
                      data-ocid={`compare.checkbox.${rowIndex}`}
                      checked={compareIds.includes(college.id)}
                      onCheckedChange={() => onToggleCompare(college.id)}
                      aria-label={`Compare ${college.shortName}`}
                      className="border-indigo/40 data-[state=checked]:bg-indigo data-[state=checked]:border-indigo"
                    />
                  </td>

                  {/* Rank */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-heading font-black text-base`}
                      style={{background : medal.bg , color : medal.text , boxShadow: medal.shadow}}>
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
                            width:      `${college.overallScore}%`,
                            background: "linear-gradient(90deg, oklch(0.46 0.19 266), oklch(0.80 0.16 86))",
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Placement percentage*/}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-semibold text-sm text-foreground">
                        {college.placementPct}%
                      </span>
                  </td>


                  {/* Action */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <Button
                      data-ocid={`rankings.item.button.${rowIndex}`}
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(college.id)}
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
  );
}