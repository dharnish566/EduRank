// ─────────────────────────────────────────────────────────
//  src/utils/compareTokens.ts
//  Extracted from: ComparePage.tsx
//    → The `T` design-token object (was module-level const)
//  Centralised so CompareTable, CollegeSelector, and
//  ComparePage all import from one place instead of
//  duplicating the token map.
// ─────────────────────────────────────────────────────────

export const T = {
  heroBg:   "oklch(0.16 0.055 258)",
  indigo:   "oklch(0.46 0.19 266)",
  gold:     "oklch(0.80 0.16 86)",
  goldDeep: "oklch(0.60 0.14 78)",
  goldText: "oklch(0.42 0.14 78)",
  green:    "oklch(0.52 0.18 148)",
  greenTx:  "oklch(0.32 0.18 148)",
  red:      "oklch(0.54 0.20 27)",
  redTx:    "oklch(0.40 0.20 27)",
  navy:     "oklch(0.20 0.05 258)",
  muted:    "oklch(0.50 0.025 258)",
  border:   "oklch(0.91 0.01 258)",
  surface:  "oklch(0.975 0.005 258)",
} as const;