// ─────────────────────────────────────────────────────────
//  src/types/rankings.ts
//  Extracted from: RankingsPage.tsx (top-level type declarations)
//  No logic changed — just moved here so every file can import
//  without creating circular dependencies.
// ─────────────────────────────────────────────────────────

// Re-export College from the data layer so consumers only need one import
export type { College } from "../data/colleges";

export type SortKey =
  | "overallScore"
  | "nirfRank"
  | "placementPct"
  | "avgPackageLPA";

export interface RankingsPageProps {
  onNavigateHome: () => void;
  onNavigateToCompare: (ids: number[]) => void;
  onNavigateToDetails: (id: number) => void;
  compareIds: number[];
  onCompareIdsChange: (ids: number[]) => void;
}