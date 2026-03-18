// ─────────────────────────────────────────────────────────
//  src/utils/compareUtils.ts
//  Extracted from: ComparePage.tsx
//    → type HighlightKind
//    → getHighlight()   — decides best/worst/neutral for a value
//    → cellStyle()      — returns CSSProperties for a table cell
//    → valueColor()     — returns text colour string for a value
//  These are pure functions with zero React dependency.
//  Used by CompareTable.tsx.
// ─────────────────────────────────────────────────────────

import type React from "react";
import { T } from "./compareTokens";

export type HighlightKind = "best" | "worst" | "neutral";

/**
 * Given a single value and the full array of values for that row,
 * returns whether this value is the best, worst, or neutral.
 * `lowerIsBetter` flips the comparison (e.g. NIRF rank).
 */
export function getHighlight(
  value: number,
  values: number[],
  lowerIsBetter = false,
): HighlightKind {
  const best  = lowerIsBetter ? Math.min(...values) : Math.max(...values);
  const worst = lowerIsBetter ? Math.max(...values) : Math.min(...values);
  if (value === best)  return "best";
  if (value === worst) return "worst";
  return "neutral";
}

/**
 * Returns the CSSProperties (background + borderLeft accent) for a
 * table cell based on its highlight kind.
 */
export function cellStyle(kind: HighlightKind): React.CSSProperties {
  if (kind === "best")
    return {
      background:  "oklch(0.80 0.16 86 / 0.10)",
      borderLeft: `3px solid ${T.gold}`,
    };
  if (kind === "worst")
    return {
      background:  "oklch(0.54 0.20 27 / 0.08)",
      borderLeft: `3px solid ${T.red}88`,
    };
  return {};
}

/**
 * Returns the text colour token for a cell value
 * based on best/worst/neutral classification.
 */
export function valueColor(kind: HighlightKind): string {
  if (kind === "best")  return T.goldText;
  if (kind === "worst") return T.redTx;
  return T.navy;
}