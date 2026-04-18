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
  let startPage = Math.max(1, safeCurrentPage - Math.floor(MAX_VISIBLE / 2));
  let endPage   = startPage + MAX_VISIBLE - 1;
  if (endPage > totalPages) {
    endPage   = totalPages;
    startPage = Math.max(1, endPage - MAX_VISIBLE + 1);
  }
  const visiblePages: number[] = [];
  for (let p = startPage; p <= endPage; p++) visiblePages.push(p);

  const navBtn =
    "inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium transition-all " +
    "bg-white border border-[rgba(99,82,200,0.22)] text-[#534AB7] " +
    "hover:bg-[rgba(83,74,183,0.07)] hover:border-[rgba(83,74,183,0.45)] " +
    "disabled:opacity-35 disabled:pointer-events-none";

  return (
    <div
      className="flex items-center justify-between flex-wrap gap-4 mt-8 pt-6"
      style={{ borderTop: "0.5px solid rgba(99,82,200,0.15)" }}
    >
      {/* Page info */}
      <p className="text-sm" style={{ color: "#888780" }}>
        Page{" "}
        <span className="font-bold" style={{ color: "#1a1540" }}>{safeCurrentPage}</span>
        {" "}of{" "}
        <span className="font-bold" style={{ color: "#1a1540" }}>{totalPages}</span>
      </p>

      <div className="flex items-center gap-1.5">

        {/* Prev */}
        <button
          data-ocid="rankings.pagination_prev"
          onClick={() => onGoToPage(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          className={navBtn}
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">

          {startPage > 1 && (
            <>
              <PageBtn p={1} active={false} onClick={() => onGoToPage(1)} />
              {startPage > 2 && <Ellipsis />}
            </>
          )}

          {visiblePages.map((p) => (
            <PageBtn
              key={p}
              p={p}
              active={p === safeCurrentPage}
              onClick={() => onGoToPage(p)}
            />
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <Ellipsis />}
              <PageBtn p={totalPages} active={false} onClick={() => onGoToPage(totalPages)} />
            </>
          )}
        </div>

        {/* Next */}
        <button
          data-ocid="rankings.pagination_next"
          onClick={() => onGoToPage(safeCurrentPage + 1)}
          disabled={safeCurrentPage === totalPages}
          className={navBtn}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}

function PageBtn({
  p, active, onClick,
}: { p: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-9 h-9 rounded-lg text-sm font-semibold transition-all " 
      style={
        active
          ? {
              background: "linear-gradient(135deg, #1a1540, #2d1f7a)",
              color:      "#ffffff",
              boxShadow:  "0 2px 10px rgba(83,74,183,0.30)",
              fontWeight: 700,
            }
          : {
              background: "transparent",
              color:      "#888780",
            }
      }
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "rgba(83,74,183,0.07)";
          (e.currentTarget as HTMLElement).style.color      = "#534AB7";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color      = "#888780";
        }
      }}
    >
      {p}
    </button>
  );
}

function Ellipsis() {
  return (
    <span className="text-sm px-0.5" style={{ color: "#B4B2A9" }}>···</span>
  );
}