// src/hooks/useRankingsData.ts

import { useState, useEffect, useCallback } from "react";
import type { College } from "../data/colleges";

export interface RankingsApiResponse {
  data:       College[];
  total:      number;
  totalPages: number;
  page:       number;
  limit:      number;
}

interface UseRankingsDataReturn {
  colleges:    College[];
  total:       number;
  totalPages:  number;
  currentPage: number;
  limit:       number;
  isLoading:   boolean;
  isError:     boolean;
  goToPage:    (p: number) => void;
}

export function useRankingsData(limit = 10): UseRankingsDataReturn {
  const [colleges,    setColleges]    = useState<College[]>([]);
  const [total,       setTotal]       = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading,   setIsLoading]   = useState(false);
  const [isError,     setIsError]     = useState(false);

  const fetchPage = useCallback(async (page: number) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fetch(`http://localhost:5000/api/colleges/rankings?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json: RankingsApiResponse = await res.json();

      setColleges(json.data);
      setTotal(json.total);
      setTotalPages(json.totalPages);
      setCurrentPage(json.page);
    } catch (err) {
      console.error("Failed to fetch rankings:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  // Initial load
  useEffect(() => { fetchPage(1); }, [fetchPage]);

  const goToPage = useCallback((p: number) => {
    if (p < 1 || p > totalPages) return;
    fetchPage(p);
  }, [fetchPage, totalPages]);

  return {
    colleges,
    total,
    totalPages,
    currentPage,
    limit,
    isLoading,
    isError,
    goToPage,
  };
}