// src/hooks/useRankingsData.ts

import { useState, useEffect, useCallback, useRef } from "react";
import { apiUrl } from "../utils/api";
import type { College } from "../data/colleges";

export interface RankingsApiResponse {
  data:        College[];
  total:       number;
  totalPages:  number;
  page:        number;
  limit:       number;
  searchMode?: boolean;
}

export interface RankingsFilters {
  search:     string;
  cityFilter: string;
  typeFilter: string;
  naacFilter: string;
  sortKey:    string;
}

interface UseRankingsDataReturn {
  colleges:    College[];
  total:       number;
  totalPages:  number;
  currentPage: number;
  limit:       number;
  isLoading:   boolean;
  isError:     boolean;
  searchMode:  boolean;
  goToPage:    (p: number) => void;
}

export function useRankingsData(
  limit: number = 10,
  filters?: RankingsFilters,
): UseRankingsDataReturn {

  const [colleges,    setColleges]    = useState<College[]>([]);
  const [total,       setTotal]       = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading,   setIsLoading]   = useState(false);
  const [isError,     setIsError]     = useState(false);
  const [searchMode,  setSearchMode]  = useState(false);

  // Internal page state — separate from currentPage (which reflects server response)
  const [page, setPage] = useState(1);

  // Track previous filter values to detect changes and auto-reset to page 1
  const prevFiltersRef = useRef(filters);

  useEffect(() => {
    const prev = prevFiltersRef.current;
    const filtersChanged =
      prev?.search     !== filters?.search     ||
      prev?.cityFilter !== filters?.cityFilter ||
      prev?.typeFilter !== filters?.typeFilter ||
      prev?.naacFilter !== filters?.naacFilter ||
      prev?.sortKey    !== filters?.sortKey;

    prevFiltersRef.current = filters;

    // If filters changed, always reset to page 1
    const targetPage = filtersChanged ? 1 : page;
    if (filtersChanged && page !== 1) {
      setPage(1);
      // setPage is async — the effect will re-run with page=1
      // so we can return early here; the fetch happens on the next render
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const params = new URLSearchParams();
        params.set("page",  String(targetPage));
        params.set("limit", String(limit));

        if (filters) {
          if (filters.sortKey)              params.set("sort", filters.sortKey);
          if (filters.search.trim())        params.set("q",    filters.search.trim());
          if (filters.cityFilter !== "all") params.set("city", filters.cityFilter);
          if (filters.typeFilter !== "all") params.set("type", filters.typeFilter);
          if (filters.naacFilter !== "all") params.set("naac", filters.naacFilter);
        }

        const res = await fetch(apiUrl(`/colleges/rankings?${params.toString()}`));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json: RankingsApiResponse = await res.json();

        if (!cancelled) {
          setColleges(json.data);
          setTotal(json.total);
          setTotalPages(json.totalPages);
          setCurrentPage(json.page);
          setSearchMode(json.searchMode ?? false);
        }
      } catch (err) {
        console.error("Failed to fetch rankings:", err);
        if (!cancelled) setIsError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();

    return () => { cancelled = true; };

  }, [
    page,
    limit,
    filters?.search,
    filters?.cityFilter,
    filters?.typeFilter,
    filters?.naacFilter,
    filters?.sortKey,
  ]);

  const goToPage = useCallback((p: number) => {
    setPage(p);
  }, []);

  return {
    colleges,
    total,
    totalPages,
    currentPage,
    limit,
    isLoading,
    isError,
    searchMode,
    goToPage,
  };
}