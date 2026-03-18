    // ─────────────────────────────────────────────────────────
//  src/components/rankings/RankingsPagination.tsx
//  Extracted from: RankingsPage.tsx
//    → The pagination block (totalPages > 1 && ...)
//  JSX is 100% identical — no changes at all.
// ─────────────────────────────────────────────────────────

import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RankingsPaginationProps {
  safeCurrentPage: number;
  totalPages:      number;
  onGoToPage:      (p: number) => void;
}

export function RankingsPagination({
  safeCurrentPage,
  totalPages,
  onGoToPage,
}: RankingsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
      <p className="text-sm text-muted-foreground">
        Page{" "}
        <span className="font-semibold text-foreground">{safeCurrentPage}</span>
        {" "}of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          data-ocid="rankings.pagination_prev"
          variant="outline"
          size="sm"
          onClick={() => onGoToPage(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          className="h-9 px-4 gap-1.5 font-medium border-border text-sm disabled:opacity-40 hover:border-indigo/40 hover:text-indigo transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </Button>

        {/* Page number pills */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => onGoToPage(p)}
              className="w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200"
              style={
                p === safeCurrentPage
                  ? { background: "oklch(0.16 0.055 258)", color: "oklch(0.98 0.005 258)" }
                  : { background: "transparent",           color: "oklch(0.50 0.025 258)" }
              }
            >
              {p}
            </button>
          ))}
        </div>

        <Button
          data-ocid="rankings.pagination_next"
          variant="outline"
          size="sm"
          onClick={() => onGoToPage(safeCurrentPage + 1)}
          disabled={safeCurrentPage === totalPages}
          className="h-9 px-4 gap-1.5 font-medium border-border text-sm disabled:opacity-40 hover:border-indigo/40 hover:text-indigo transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}