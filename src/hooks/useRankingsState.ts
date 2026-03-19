// src/hooks/useRankingsState.ts

import { useMemo, useState } from "react";
import type { College } from "../data/colleges";  // ← import type, not COLLEGES data
import type { SortKey } from "../types/rankings";

const MAX_COMPARE = 4;

export function useRankingsState(
  colleges: College[],                            // ← NEW: injected from useRankingsData
  compareIds: number[],
  onCompareIdsChange: (ids: number[]) => void,
) {
  // ── Filter state ──────────────────────────────────────
  const [search,     setSearch]     = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [naacFilter, setNaacFilter] = useState("all");
  const [sortKey,    setSortKey]    = useState<SortKey>("overallScore");

  // ── Compare warning flash ─────────────────────────────
  const [compareWarning, setCompareWarning] = useState(false);

  // ── Cities derived from the injected colleges ─────────
  const cities = useMemo(
    () => [...new Set(colleges.map((c) => c.city).filter(Boolean))].sort(),
    [colleges],                                   // ← was a hardcoded static array
  );

  // ── Derived filter meta ───────────────────────────────
  const hasActiveFilters =
    search !== "" ||
    cityFilter !== "all" ||
    typeFilter !== "all" ||
    naacFilter !== "all";

  const activeFilterCount = [
    search     !== "",
    cityFilter !== "all",
    typeFilter !== "all",
    naacFilter !== "all",
  ].filter(Boolean).length;

  // ── Actions ───────────────────────────────────────────
  const clearFilters = () => {
    setSearch("");
    setCityFilter("all");
    setTypeFilter("all");
    setNaacFilter("all");
    // NOTE: no setPage(1) here — page is owned by useRankingsData now
  };

  // ── Client-side filter of the current server page ─────
  // Sorting is handled server-side (ORDER BY final_score DESC).
  // Client sort below is a fallback for the current page slice only.
  const filtered = useMemo(() => {
    let result = [...colleges];                   // ← was [...COLLEGES]

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortName?.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q),
      );
    }

    if (cityFilter !== "all") result = result.filter((c) => c.city      === cityFilter);
    if (typeFilter !== "all") result = result.filter((c) => c.type      === typeFilter);
    if (naacFilter !== "all") result = result.filter((c) => c.naacGrade === naacFilter);

    // result.sort((a, b) => {
    //   if (sortKey === "nirfRank")      return a.nirfRank      - b.nirfRank;
    //   if (sortKey === "overallScore")  return b.overallScore  - a.overallScore;
    //   if (sortKey === "placementPct")  return b.placementPct  - a.placementPct;
    //   if (sortKey === "avgPackageLPA") return b.avgPackageLPA - a.avgPackageLPA;
    //   return 0;
    // });

    return result;
  }, [colleges, search, cityFilter, typeFilter, naacFilter, sortKey]);
  // ↑ `colleges` replaces `COLLEGES` in the dependency array

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
    // Filter state
    search,     setSearch,
    cityFilter, setCityFilter,
    typeFilter, setTypeFilter,
    naacFilter, setNaacFilter,
    sortKey,    setSortKey,
    cities,
    hasActiveFilters,
    activeFilterCount,
    clearFilters,
    // Results (client-filtered slice of the current server page)
    filtered,
    // Compare
    compareWarning,
    toggleCompare,
    MAX_COMPARE,
  };
  // ↑ Removed: paginated, totalPages, safeCurrentPage, goToPage,
  //            ITEMS_PER_PAGE, setPage — all live in useRankingsData now
}