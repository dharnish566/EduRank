// ─────────────────────────────────────────────────────────
//  src/components/rankings/RankingsTable.tsx
//  Extracted from: RankingsPage.tsx
//    → The desktop table block  (hidden md:block ... </div>)
//    → Inline getRankMedalStyle calls replaced with import
//    → Inline getTypeBadgeStyle / getNaacBadgeStyle replaced
//    → TrendBadge replaced with import
//  JSX is 100% identical — only import sources changed.
// ─────────────────────────────────────────────────────────

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { College } from "../../data/colleges";

import { TrendBadge } from "./TrendBadge";
import { getRankMedalStyle, getTypeBadgeStyle, getNaacBadgeStyle } from "../../utils/rankingStyles";

interface RankingsTableProps {
  paginated: College[];
  compareIds: number[];
  safeCurrentPage: number;
  ITEMS_PER_PAGE: number;
  onToggleCompare: (id: number) => void;
  onViewDetails: (id: number) => void;
}

export function RankingsTable({
  paginated, compareIds, safeCurrentPage,
  ITEMS_PER_PAGE, onToggleCompare, onViewDetails,
}: RankingsTableProps) {
  return (
    <div
      className="hidden md:block rounded-xl overflow-hidden"
      style={{
        border: "0.5px solid rgba(99,82,200,0.20)",
        boxShadow: "0 4px 24px rgba(26,21,64,0.08)",
      }}
    >
      <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>

        {/* ── Header ── */}
        <thead>
          <tr style={{ background: "linear-gradient(135deg, #1a1540 0%, #221960 100%)" }}>
            <th className="px-3 py-3.5 w-10">
              <span className="sr-only">Compare</span>
            </th>
            {["Rank", "College", "Type", "City", "NAAC", "NIRF", "Score", "Placement", "Action"].map((h) => (
              <th
                key={h}
                className="px-4 py-3.5 text-left whitespace-nowrap"
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  color: "rgba(180,165,255,0.65)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody>
          <AnimatePresence mode="popLayout">
            {paginated.map((college, i) => {
              const rowIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE + i + 1;
              const medal = getRankMedalStyle(college.rank ?? 999);
              const isEven = i % 2 === 0;

              return (
                <motion.tr
                  key={college.id}
                  data-ocid={`rankings.item.${rowIndex}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="group cursor-default"
                  style={{
                    background: isEven ? "#ffffff" : "oklch(0.975 0.005 258 / 0.5)",
                    borderTop: "0.5px solid rgba(99,82,200,0.10)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "oklch(0.97 0.01 266)";
                    const cell = e.currentTarget.cells[0].querySelector("div") as HTMLElement;
                    if (cell) cell.style.borderLeft = "3px solid oklch(0.46 0.19 266)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      isEven ? "#ffffff" : "oklch(0.975 0.005 258 / 0.5)";
                    const cell = e.currentTarget.cells[0].querySelector("div") as HTMLElement;
                    if (cell) cell.style.borderLeft = "3px solid transparent";
                  }}
                >
                  {/* Checkbox — wrapped in div to carry the left accent border */}
                  <td className="p-0">
                    <div
                      className="px-3 py-3.5 transition-all"
                      style={{ borderLeft: "3px solid transparent" }}
                    >
                      <Checkbox
                        data-ocid={`compare.checkbox.${rowIndex}`}
                        checked={compareIds.includes(college.id)}
                        onCheckedChange={() => onToggleCompare(college.id)}
                        aria-label={`Compare ${college.shortName}`}
                        className=" border-[rgba(83,74,183,0.40)] data-[state=checked]:bg-[#534AB7] data-[state=checked]:border-[#534AB7]
                                   data-[state=checked]:text-white focus-visible:ring-[#534AB7]/30 " />
                    </div>
                  </td>

                  {/* Rank medal */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                      style={{
                        background: medal.bg,
                        color: medal.text,
                        boxShadow: medal.shadow,
                      }}
                    >
                      {college.rank}
                    </div>
                  </td>

                  {/* College name */}
                  <td className="px-4 py-3.5" style={{ maxWidth: "200px" }}>
                    <p
                      className="font-bold text-sm leading-tight truncate transition-colors"
                      style={{ color: "#1a1540" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.46 0.19 266)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#1a1540")}
                    >
                      {college.name}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#888780" }}>
                      Est. {college.established}
                    </p>
                  </td>

                  {/* Type badge */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${getTypeBadgeStyle(college.type)}`}
                    >
                      {college.type}
                    </span>
                  </td>

                  {/* City */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-xs" style={{ color: "#5F5E5A" }}>
                      <MapPin className="w-3 h-3 shrink-0" />
                      {college.city}
                    </div>
                  </td>

                  {/* NAAC badge */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${getNaacBadgeStyle(college.naacGrade)}`}
                    >
                      {college.naacGrade}
                    </span>
                  </td>

                  {/* NIRF */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-black text-sm" style={{ color: "#1a1540" }}>
                      #{college.nirfRank}
                    </span>
                  </td>

                  {/* Score + bar */}
                  <td className="px-4 py-3.5 whitespace-nowrap" style={{ minWidth: "100px" }}>
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-sm" style={{ color: "#1a1540" }}>
                        {college.overallScore}
                      </span>
                      <div
                        className="w-16 h-[5px] rounded-full overflow-hidden"
                        style={{ background: "#E1F5EE" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${college.overallScore}%`,
                            background: "linear-gradient(90deg, #534AB7, #f5c442)",
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Placement */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-semibold text-sm" style={{ color: "#1D9E75" }}>
                      {college.placementPct}%
                    </span>
                  </td>

                  {/* View button */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <Button
                      data-ocid={`rankings.item.button.${rowIndex}`}
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(college.id)}
                      className="h-7 px-3 text-xs font-semibold transition-all"
                      style={{
                        background: "rgba(83,74,183,0.08)",
                        border: "0.5px solid rgba(83,74,183,0.30)",
                        borderRadius: "7px",
                        color: "#534AB7",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = "rgba(83,74,183,0.15)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = "rgba(83,74,183,0.08)")
                      }
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