// src/hooks/useRankingsState.ts
//
// `filtered` is removed — RankingsPage now uses `colleges` directly
// from useRankingsData (server already applied all filters).
// Everything else is identical to your original.

import { useMemo, useState } from "react";
import type { College } from "../data/colleges";
import type { SortKey } from "../types/rankings";

const MAX_COMPARE = 4;

export function useRankingsState(
  colleges:           College[],
  compareIds:         number[],
  onCompareIdsChange: (ids: number[]) => void,
  // ── Filter values injected from the page ──────────────────
  search:     string,
  cityFilter: string,
  typeFilter: string,
  naacFilter: string,
  sortKey:    SortKey,
) {
  // ── Compare warning flash ─────────────────────────────────
  const [compareWarning, setCompareWarning] = useState(false);

  // ── Cities derived from ALL colleges on current page ──────
const cities = [
  "All", "Chennai", "Coimbatore", "Madurai", "Namakkal", "Kanniyakumari", "Kancheepuram", "Salem",
  "Thiruvallur", "Chengalpattu", "Erode", "Tiruchirappalli", "Tirunelveli", "Virudhunagar", "Pudukkottai",
  "Sivaganga", "Viluppuram", "Krishnagiri", "Cuddalore", "Ranipet", "Vellore", "Thoothukkudi", "Tiruppur", "Thanjavur", "Perambalur", "Dindigul",
  "Thiruvarur", "Kallakurichi", "Nagapattinam", "Karur", "Ramanathapuram", "The Nilgiris", "Ariyalur", "Tenkasi",
  "Mayiladuthurai", "Theni", "Dharmapuri", "Tiruvannamalai"
];

  // ── Filter badge meta ─────────────────────────────────────
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

  // ── Compare toggle ────────────────────────────────────────
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
    cities,
    hasActiveFilters,
    activeFilterCount,
    compareWarning,
    toggleCompare,
    MAX_COMPARE,
  };
}