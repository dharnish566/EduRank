// ─────────────────────────────────────────────────────────
//  src/pages/RankingsPage.tsx  (refactored)
//
//  What changed vs original:
//    • All state/logic moved to useRankingsState()
//    • Each visual section moved to its own component file
//    • The JSX rendered here is structurally identical —
//      same elements, same classes, same data-ocid attributes
//    • Zero visual or behavioural differences
// ─────────────────────────────────────────────────────────

import { Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { AnimatePresence, motion } from "motion/react";

import { RankingsHeader }      from "../components/rankings/RankingsHeader";
import { RankingsControlsBar } from "../components/rankings/RankingsControlsBar";
import { RankingsTable }       from "../components/rankings/RankingsTable";
import { RankingsMobileList }  from "../components/rankings/RankingsMobileList";
import { RankingsPagination }  from "../components/rankings/RankingsPagination";
import { CompareBar }          from "../components/ui/compareBar";
import { PageFooter }          from "../components/layout/PageFooter";

import { useRankingsState }    from "../hooks/useRankingsState";
import { SORT_LABELS }         from "../utils/rankingStyles";
import type { RankingsPageProps } from "../types/rankings";

export function RankingsPage({
  onNavigateHome,
  onNavigateToCompare,
  onNavigateToDetails,
  compareIds,
  onCompareIdsChange,
}: RankingsPageProps) {
  const {
    search,     setSearch,
    cityFilter, setCityFilter,
    typeFilter, setTypeFilter,
    naacFilter, setNaacFilter,
    sortKey,    setSortKey,
    cities,
    hasActiveFilters,
    activeFilterCount,
    clearFilters,
    filtered,
    paginated,
    totalPages,
    safeCurrentPage,
    goToPage,
    ITEMS_PER_PAGE,
    compareWarning,
    toggleCompare,
    MAX_COMPARE,
    setPage,
  } = useRankingsState(compareIds, onCompareIdsChange);

  return (
    <div className="min-h-screen bg-background font-body antialiased">

      {/* ── Page Header ── */}
      <RankingsHeader onNavigateHome={onNavigateHome} />

      {/* ── Sticky Controls Bar ── */}
      <RankingsControlsBar
        search={search}
        cityFilter={cityFilter}
        typeFilter={typeFilter}
        naacFilter={naacFilter}
        sortKey={sortKey}
        cities={cities}
        hasActiveFilters={hasActiveFilters}
        activeFilterCount={activeFilterCount}
        onSearchChange={(v) => { setSearch(v);     setPage(1); }}
        onCityChange={(v)   => { setCityFilter(v); setPage(1); }}
        onTypeChange={(v)   => { setTypeFilter(v); setPage(1); }}
        onNaacChange={(v)   => { setNaacFilter(v); setPage(1); }}
        onSortChange={(v)   => { setSortKey(v);    setPage(1); }}
        onClearFilters={clearFilters}
      />

      {/* ── Main Content ── */}
      <main className="container mx-auto px-4 py-6">

        {/* Results Summary bar */}
        <div className="flex items-center justify-between mb-5 text-sm">
          <p className="text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filtered.length === 0
                ? "0"
                : `${(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                    safeCurrentPage * ITEMS_PER_PAGE,
                    filtered.length,
                  )}`}
            </span>
            {" "}of{" "}
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            colleges
          </p>
          <p className="text-muted-foreground hidden sm:block">
            Sorted by:{" "}
            <span className="font-semibold text-foreground">
              {SORT_LABELS[sortKey]}
            </span>
          </p>
        </div>

        {/* Empty State */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              data-ocid="rankings.empty_state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "oklch(0.46 0.19 266 / 0.08)" }}
              >
                <Search className="w-9 h-9 text-indigo/50" />
              </div>
              <h3 className="font-heading text-xl font-bold text-navy mb-2">
                No colleges match your filters
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mb-6">
                Try adjusting your search terms or clearing the active filters
                to see more results.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-navy text-white hover:bg-navy/90 font-semibold"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results (desktop table + mobile cards + pagination) */}
        {filtered.length > 0 && (
          <>
            {/* ── Desktop Table ── */}
            <RankingsTable
              paginated={paginated}
              compareIds={compareIds}
              safeCurrentPage={safeCurrentPage}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              onToggleCompare={toggleCompare}
              onViewDetails={onNavigateToDetails}
            />

            {/* ── Mobile Card List ── */}
            <RankingsMobileList
              paginated={paginated}
              compareIds={compareIds}
              safeCurrentPage={safeCurrentPage}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              onToggleCompare={toggleCompare}
              onViewDetails={onNavigateToDetails}
            />

            {/* ── Pagination ── */}
            <RankingsPagination
              safeCurrentPage={safeCurrentPage}
              totalPages={totalPages}
              onGoToPage={goToPage}
            />
          </>
        )}
      </main>

      {/* ── Sticky Compare Bar ── */}
      <CompareBar
        compareIds={compareIds}
        compareWarning={compareWarning}
        MAX_COMPARE={MAX_COMPARE}
        onClear={() => onCompareIdsChange([])}
        onCompareNow={() => onNavigateToCompare(compareIds)}
      />

      {/* Bottom padding when compare bar is visible */}
      {compareIds.length > 0 && <div className="h-16" />}

      {/* ── Footer ── */}
      <PageFooter />
    </div>
  );
}