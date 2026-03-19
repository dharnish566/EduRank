// src/pages/RankingsPage.tsx

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
import { useRankingsData }     from "../hooks/useRankingData";   // ← NEW
import { SORT_LABELS }         from "../utils/rankingStyles";
import type { RankingsPageProps } from "../types/rankings";

const ITEMS_PER_PAGE = 10;

export function RankingsPage({
  onNavigateHome,
  onNavigateToCompare,
  onNavigateToDetails,
  compareIds,
  onCompareIdsChange,
}: RankingsPageProps) {

  // ── Server state (pagination + raw data) ─────────────────────────
  const {
    colleges,
    total,
    totalPages,
    currentPage,
    isLoading,
    isError,
    goToPage,
  } = useRankingsData(ITEMS_PER_PAGE);

  // ── Client state (search / filters / compare) ─────────────────────
  // Pass `colleges` (current page slice) as the source list so the
  // filter hook only filters what the server already returned.
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
    filtered,          // ← client-side filtered view of the current page
    compareWarning,
    toggleCompare,
    MAX_COMPARE,
  } = useRankingsState(colleges, compareIds, onCompareIdsChange);
  // NOTE: useRankingsState signature change — accepts `colleges` as first arg.
  // See section 5 below for the small update needed in that hook.

  // When any filter changes, jump back to page 1 on the server too
  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    goToPage(1);
  };

  const displayList = filtered; // what the table/mobile list render

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
        onSearchChange={handleFilterChange(setSearch)}
        onCityChange={handleFilterChange(setCityFilter)}
        onTypeChange={handleFilterChange(setTypeFilter)}
        onNaacChange={handleFilterChange(setNaacFilter)}
        onSortChange={(v) => { setSortKey(v); goToPage(1); }}
        onClearFilters={() => { clearFilters(); goToPage(1); }}
      />

      <main className="container mx-auto px-4 py-6">

        {/* Results summary */}
        <div className="flex items-center justify-between mb-5 text-sm">
          <p className="text-muted-foreground">
            {isLoading ? (
              <span className="animate-pulse text-muted-foreground">Loading…</span>
            ) : (
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
              paginated={displayList}           // ← server page, optionally client-filtered
              compareIds={compareIds}
              safeCurrentPage={currentPage}     // ← from API hook
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

            <RankingsPagination
              safeCurrentPage={currentPage}     // ← from API hook
              totalPages={totalPages}            // ← from API response
              onGoToPage={goToPage}              // ← calls fetchPage()
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