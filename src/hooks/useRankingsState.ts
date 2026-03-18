// ─────────────────────────────────────────────────────────
//  src/hooks/useRankingsState.ts
//  Extracted from: RankingsPage.tsx
//    → All useState declarations (search, cityFilter, typeFilter,
//      naacFilter, sortKey, page, compareWarning)
//    → cities useMemo
//    → hasActiveFilters / activeFilterCount derived values
//    → clearFilters()
//    → filtered useMemo  (the filter + sort pipeline)
//    → totalPages / safeCurrentPage / paginated derived values
//    → goToPage()
//    → toggleCompare()
//  The component body stays as JSX-only after this extraction.
//  All logic is IDENTICAL — no behaviour changed.
// ─────────────────────────────────────────────────────────

import { useMemo, useState } from "react";
import { COLLEGES } from "../data/colleges";
import type { SortKey } from "../types/rankings";

const ITEMS_PER_PAGE = 10;
const MAX_COMPARE    = 4;

export function useRankingsState(
  compareIds: number[],
  onCompareIdsChange: (ids: number[]) => void,
) {
  // ── Filter state ──────────────────────────────────────
  const [search,     setSearch]     = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [naacFilter, setNaacFilter] = useState("all");
  const [sortKey,    setSortKey]    = useState<SortKey>("overallScore");
  const [page,       setPage]       = useState(1);

  // ── Compare warning flash ─────────────────────────────
  const [compareWarning, setCompareWarning] = useState(false);

  // Static list — kept in useMemo exactly as original
  const cities = useMemo(
    () => [
      "Chennai",
      "Coimbatore",
      "Vellore",
      "Trichy",
      "Madurai",
      "Erode",
      "Thanjavur",
      "Puducherry",
    ],
    [],
  );

  // ── Derived filter meta ───────────────────────────────
  const hasActiveFilters =
    search !== "" ||
    cityFilter !== "all" ||
    typeFilter !== "all" ||
    naacFilter !== "all";

  const activeFilterCount = [
    search      !== "",
    cityFilter  !== "all",
    typeFilter  !== "all",
    naacFilter  !== "all",
  ].filter(Boolean).length;

  // ── Actions ───────────────────────────────────────────
  const clearFilters = () => {
    setSearch("");
    setCityFilter("all");
    setTypeFilter("all");
    setNaacFilter("all");
    setPage(1);
  };

  // ── Filter + sort pipeline (identical to original useMemo) ──
  const filtered = useMemo(() => {
    let result = [...COLLEGES];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortName.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q),
      );
    }

    if (cityFilter !== "all") result = result.filter((c) => c.city       === cityFilter);
    if (typeFilter !== "all") result = result.filter((c) => c.type       === typeFilter);
    if (naacFilter !== "all") result = result.filter((c) => c.naacGrade  === naacFilter);

    result.sort((a, b) => {
      if (sortKey === "nirfRank")      return a.nirfRank      - b.nirfRank;
      if (sortKey === "overallScore")  return b.overallScore  - a.overallScore;
      if (sortKey === "placementPct")  return b.placementPct  - a.placementPct;
      if (sortKey === "avgPackageLPA") return b.avgPackageLPA - a.avgPackageLPA;
      return 0;
    });

    return result;
  }, [search, cityFilter, typeFilter, naacFilter, sortKey]);

  // ── Pagination ────────────────────────────────────────
  const totalPages      = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(page, totalPages);
  const paginated       = filtered.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage       * ITEMS_PER_PAGE,
  );

  const goToPage = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Compare toggle ────────────────────────────────────
  const toggleCompare = (id: number) => {
    if (compareIds.includes(id)) {
      onCompareIdsChange(compareIds.filter((cid) => cid !== id));
    } else {
      if (compareIds.length >= MAX_COMPARE) {
        setCompareWarning(true);
        setTimeout(() => setCompareWarning(false), 2500);
        return;
      }
      onCompareIdsChange([...compareIds, id]);
    }
  };

  return {
    // Filter state (needed by controls bar)
    search,     setSearch,
    cityFilter, setCityFilter,
    typeFilter, setTypeFilter,
    naacFilter, setNaacFilter,
    sortKey,    setSortKey,
    cities,
    hasActiveFilters,
    activeFilterCount,
    clearFilters,
    // Results
    filtered,
    paginated,
    totalPages,
    safeCurrentPage,
    // Pagination
    goToPage,
    ITEMS_PER_PAGE,
    // Compare
    compareWarning,
    toggleCompare,
    MAX_COMPARE,
    setPage,
  };
}