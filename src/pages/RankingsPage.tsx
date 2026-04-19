import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { AnimatePresence, motion } from "motion/react";

import { RankingsHeader } from "../components/rankings/RankingsHeader";
import { RankingsControlsBar } from "../components/rankings/RankingsControlsBar";
import { RankingsTable } from "../components/rankings/RankingsTable";
import { RankingsMobileList } from "../components/rankings/RankingsMobileList";
import { RankingsPagination } from "../components/rankings/RankingsPagination";
import { CompareBar } from "../components/ui/compareBar";
import { PageFooter } from "../components/layout/PageFooter";

import { useRankingsState } from "../hooks/useRankingsState";
import { useRankingsData } from "../hooks/useRankingData";
import { SORT_LABELS } from "../utils/rankingStyles";
import type { RankingsPageProps, SortKey } from "../types/rankings";

const ITEMS_PER_PAGE = 10;

export function RankingsPage({
  onNavigateHome,
  onNavigateToCompare,
  onNavigateToDetails,
  compareIds,
  onCompareIdsChange,
}: RankingsPageProps) {

  // ── Filter state ──────────────────────────────────────────
  const [search,     setSearch]     = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [naacFilter, setNaacFilter] = useState("all");
  const [sortKey,    setSortKey]    = useState<SortKey>("overallScore");

  // ── Server state ──────────────────────────────────────────
  // Backend always paginates (10 per page) regardless of filters.
  // `total` and `totalPages` reflect the FILTERED count, so
  // pagination automatically adjusts to the search results.
  const {
    colleges,
    total,
    totalPages,
    currentPage,
    isLoading,
    isError,
    searchMode,   // true = filters active; used for UI copy only
    goToPage,
  } = useRankingsData(ITEMS_PER_PAGE, {
    search,
    cityFilter,
    typeFilter,
    naacFilter,
    sortKey,
  });

  // ── Client state: cities dropdown, compare, filter badges ─
  const {
    cities,
    hasActiveFilters,
    activeFilterCount,
    compareWarning,
    toggleCompare,
    MAX_COMPARE,
  } = useRankingsState(
    colleges,
    compareIds,
    onCompareIdsChange,
    search,
    cityFilter,
    typeFilter,
    naacFilter,
    sortKey,
  );

  // ── Clear all filters ─────────────────────────────────────
  const clearFilters = () => {
    setSearch("");
    setCityFilter("all");
    setTypeFilter("all");
    setNaacFilter("all");
    setSortKey("overallScore");
    // goToPage(1);
  };

  // ── Display list ──────────────────────────────────────────
  // Always use `colleges` directly — the backend has already applied
  // all filters and returned exactly 10 rows for the current page.
  // No client-side re-filtering needed or wanted.
  const displayList = colleges;

  return (
    <div className="min-h-screen bg-background font-body antialiased">

      <RankingsHeader onNavigateHome={onNavigateHome} />

      <RankingsControlsBar
        search={search}
        cityFilter={cityFilter}
        typeFilter={typeFilter}
        naacFilter={naacFilter}
        sortKey={sortKey}
        cities={cities}
        hasActiveFilters={hasActiveFilters}
        activeFilterCount={activeFilterCount}
        onSearchChange={(v) => { setSearch(v)}}
        onCityChange={(v)   => { setCityFilter(v)}}
        onTypeChange={(v)   => { setTypeFilter(v)}}
        onNaacChange={(v)   => { setNaacFilter(v)}}
        onSortChange={(v)   => { setSortKey(v)}}
        onClearFilters={clearFilters}
      />

      <main className="container mx-auto px-4 py-6">

        {/* Results summary */}
        <div className="flex items-center justify-between mb-5 text-sm">
          <p className="text-muted-foreground">
            {isLoading   ? (
              <span className="animate-pulse text-muted-foreground">Loading…</span>
            ) : searchMode ? (
              // Filters active → show "100 results for 'iit'" + page range
              <>
                <span className="font-semibold text-foreground">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, total)}
                </span>
                {" "}of{" "}
                <span className="font-semibold text-foreground">{total}</span>{" "}
                result{total !== 1 ? "s" : ""}
                {search.trim() && (
                  <>
                    {" "}for{" "}
                    <span className="font-semibold text-foreground">
                      "{search.trim()}"
                    </span>
                  </>
                )}
              </>
            ) : (
              // Normal browse → show "1–10 of 450 colleges"
              <>
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {total === 0
                    ? "0"
                    : `${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                        currentPage * ITEMS_PER_PAGE,
                        total,
                      )}`}
                </span>
                {" "}of{" "}
                <span className="font-semibold text-foreground">{total}</span>{" "}
                colleges
              </>
            )}
          </p>
          <p className="text-muted-foreground hidden sm:block">
            Sorted by:{" "}
            <span className="font-semibold text-foreground">
              {SORT_LABELS[sortKey]}
            </span>
          </p>
        </div>

        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-destructive font-semibold mb-3">
              Failed to load rankings.
            </p>
            <Button onClick={() => goToPage(currentPage)} className="bg-navy text-white">
              Retry
            </Button>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-xl bg-muted animate-pulse"
                style={{ opacity: 1 - i * 0.07 }}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        <AnimatePresence>
          {!isLoading && !isError && displayList.length === 0 && (
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
                Try adjusting your search terms or clearing the active filters.
              </p>
              <Button
                onClick={() => { clearFilters(); goToPage(1); }}
                className="bg-navy text-white hover:bg-navy/90 font-semibold"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {!isLoading && !isError && displayList.length > 0 && (
          <>
            <RankingsTable
              paginated={displayList}
              compareIds={compareIds}
              safeCurrentPage={currentPage}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              onToggleCompare={toggleCompare}
              onViewDetails={onNavigateToDetails}
            />

            <RankingsMobileList
              paginated={displayList}
              compareIds={compareIds}
              safeCurrentPage={currentPage}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              onToggleCompare={toggleCompare}
              onViewDetails={onNavigateToDetails}
            />

            {/* Pagination always shown — totalPages reflects filtered count
                so "100 matches" correctly shows 10 pages of 10, not 44     */}
            <RankingsPagination
              safeCurrentPage={currentPage}
              totalPages={totalPages}
              onGoToPage={goToPage}
            />
          </>
        )}
      </main>

      <CompareBar
        compareIds={compareIds}
        compareWarning={compareWarning}
        MAX_COMPARE={MAX_COMPARE}
        onClear={() => onCompareIdsChange([])}
        onCompareNow={() => onNavigateToCompare(compareIds)}
      />

      {compareIds.length > 0 && <div className="h-16" />}

      <PageFooter />
    </div>
  );
}