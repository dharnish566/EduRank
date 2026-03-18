// ─────────────────────────────────────────────────────────
//  src/utils/rankingStyles.ts
//  Extracted from: RankingsPage.tsx
//    → getTypeBadgeStyle()    (was a local function)
//    → getNaacBadgeStyle()    (was a local function)
//    → getRankMedalStyle()    (was a local function)
//    → SORT_LABELS constant   (was an inline Record inside the component)
//  No logic changed — identical implementations, just moved out.
// ─────────────────────────────────────────────────────────

import type { College } from "../data/colleges";
import type { SortKey } from "../types/rankings";

export function getTypeBadgeStyle(type: College["type"]): string {
  switch (type) {
    case "IIT":
      return "bg-[oklch(0.46_0.19_266/0.12)] text-[oklch(0.30_0.18_266)] border border-[oklch(0.46_0.19_266/0.35)]";
    case "NIT":
      return "bg-[oklch(0.52_0.18_148/0.12)] text-[oklch(0.28_0.18_148)] border border-[oklch(0.52_0.18_148/0.35)]";
    case "Deemed":
      return "bg-[oklch(0.80_0.16_86/0.15)] text-[oklch(0.42_0.14_78)] border border-[oklch(0.80_0.16_86/0.40)]";
    case "State":
      return "bg-[oklch(0.54_0.06_240/0.12)] text-[oklch(0.30_0.05_240)] border border-[oklch(0.54_0.06_240/0.35)]";
    case "Private":
      return "bg-[oklch(0.56_0.18_305/0.12)] text-[oklch(0.32_0.17_305)] border border-[oklch(0.56_0.18_305/0.35)]";
  }
}

export function getNaacBadgeStyle(grade: College["naacGrade"]): string {
  switch (grade) {
    case "A++":
      return "bg-[oklch(0.80_0.16_86/0.16)] text-[oklch(0.42_0.14_78)] border border-[oklch(0.80_0.16_86/0.48)] font-bold";
    case "A+":
      return "bg-[oklch(0.52_0.18_148/0.14)] text-[oklch(0.28_0.18_148)] border border-[oklch(0.52_0.18_148/0.42)] font-bold";
    case "A":
      return "bg-[oklch(0.46_0.19_266/0.13)] text-[oklch(0.28_0.18_266)] border border-[oklch(0.46_0.19_266/0.38)] font-bold";
    case "B++":
      return "bg-[oklch(0.54_0.06_240/0.13)] text-[oklch(0.34_0.05_240)] border border-[oklch(0.54_0.06_240/0.36)] font-bold";
  }
}

export function getRankMedalStyle(rank: number): {
  bg: string;
  text: string;
  shadow: string;
} {
  if (rank === 1)
    return {
      bg: "radial-gradient(ellipse at 30% 30%, oklch(0.92 0.18 90), oklch(0.72 0.18 72))",
      text: "oklch(0.30 0.08 70)",
      shadow: "0 4px 16px oklch(0.80 0.16 86 / 0.50)",
    };
  if (rank === 2)
    return {
      bg: "radial-gradient(ellipse at 30% 30%, oklch(0.88 0.01 250), oklch(0.70 0.01 250))",
      text: "oklch(0.30 0.02 250)",
      shadow: "0 4px 16px oklch(0.70 0.01 250 / 0.45)",
    };
  if (rank === 3)
    return {
      bg: "radial-gradient(ellipse at 30% 30%, oklch(0.78 0.12 55), oklch(0.60 0.12 52))",
      text: "oklch(0.25 0.08 50)",
      shadow: "0 4px 16px oklch(0.65 0.12 55 / 0.45)",
    };
  return {
    bg: "oklch(0.16 0.055 258)",
    text: "oklch(0.98 0.005 258)",
    shadow: "none",
  };
}

// Was an inline `sortLabels` Record inside RankingsPage — moved here
// so the controls bar and results summary row can share it.
export const SORT_LABELS: Record<SortKey, string> = {
  overallScore: "Overall Score ↓",
  nirfRank:     "NIRF Rank ↑",
  placementPct: "Placement % ↓",
  avgPackageLPA:"Avg Package ↓",
};