// ─────────────────────────────────────────────────────────
//  src/components/rankings/RankingsPagination.tsx
// ─────────────────────────────────────────────────────────

import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RankingsPaginationProps {
  safeCurrentPage: number;
  totalPages: number;
  onGoToPage: (p: number) => void;
}

export function RankingsPagination({
  safeCurrentPage,
  totalPages,
  onGoToPage,
}: RankingsPaginationProps) {
  if (totalPages <= 1) return null;

  const MAX_VISIBLE = 5;

  let startPage = Math.max(
    1,
    safeCurrentPage - Math.floor(MAX_VISIBLE / 2)
  );

  let endPage = startPage + MAX_VISIBLE - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - MAX_VISIBLE + 1);
  }

  const visiblePages: number[] = [];
  for (let p = startPage; p <= endPage; p++) {
    visiblePages.push(p);
  }

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
      <p className="text-sm text-muted-foreground">
        Page{" "}
        <span className="font-semibold text-foreground">{safeCurrentPage}</span>
        {" "}of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        {/* Prev Button */}
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

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {/* First page + ellipsis */}
          {startPage > 1 && (
            <>
              <button
                onClick={() => onGoToPage(1)}
                className="w-9 h-9 rounded-lg text-sm font-semibold"
              >
                1
              </button>
              {startPage > 2 && <span className="px-1">...</span>}
            </>
          )}

          {/* Visible pages */}
          {visiblePages.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => onGoToPage(p)}
              className="w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200"
              style={
                p === safeCurrentPage
                  ? {
                      background: "oklch(0.16 0.055 258)",
                      color: "oklch(0.98 0.005 258)",
                    }
                  : {
                      background: "transparent",
                      color: "oklch(0.50 0.025 258)",
                    }
              }
            >
              {p}
            </button>
          ))}

          {/* Last page + ellipsis */}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-1">...</span>
              )}
              <button
                onClick={() => onGoToPage(totalPages)}
                className="w-9 h-9 rounded-lg text-sm font-semibold"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
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