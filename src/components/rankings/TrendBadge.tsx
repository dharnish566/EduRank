// ─────────────────────────────────────────────────────────
//  src/components/rankings/TrendBadge.tsx
//  Extracted from: RankingsPage.tsx
//    → TrendBadge function component (was a local function)
//  Zero changes to JSX or logic.
// ─────────────────────────────────────────────────────────

import { TrendingDown, TrendingUp } from "lucide-react";
import type { College } from "../../data/colleges";

export function TrendBadge({
  trend,
  change,
}: {
  trend: College["trend"];
  change: number;
}) {
  if (trend === "up")
    return (
      <span className="inline-flex items-center gap-0.5 text-[oklch(0.32_0.18_148)] text-xs font-semibold">
        <TrendingUp className="w-3 h-3" />+{change}
      </span>
    );
  if (trend === "down")
    return (
      <span className="inline-flex items-center gap-0.5 text-[oklch(0.40_0.20_27)] text-xs font-semibold">
        <TrendingDown className="w-3 h-3" />
        {change}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 text-muted-foreground text-xs font-medium">
      <span className="text-base leading-none">→</span> —
    </span>
  );
}