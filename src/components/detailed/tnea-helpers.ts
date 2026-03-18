/* ─────────────────────────────────────────────────────────────────────────────
   tnea-helpers.ts
   Pure data-transformation utilities for the TNEA Statistics tab.
   Zero UI – safe to import anywhere.
   ───────────────────────────────────────────────────────────────────────────── */

// ── Raw API shape ─────────────────────────────────────────────────────────────
export interface SeatSlot {
  total:     number;
  available: number;
}

export type CategoryKey = "OC" | "BC" | "BCM" | "MBC" | "SC" | "SCA" | "ST";

export interface TneaRecord {
  branchCode: string;
  branchName: string;
  year:       number;
  seats:      Partial<Record<CategoryKey, SeatSlot>>;
  cutoff:     Partial<Record<CategoryKey, string | null>>;
}

// ── Derived shapes consumed by charts ────────────────────────────────────────

/** One bar in the cutoff-comparison chart */
export interface CutoffBar {
  name:   string;   // branchCode [· year] depending on filter
  code:   string;
  value:  number;
}

/** One data-point in the year-wise trend line chart */
export interface TrendPoint {
  year: number;
  [branchCode: string]: number | undefined | null;
}

/** One row in the category-grouped-bar chart */
export interface CatRow {
  name: string;   // branchCode
  OC?:  number | null;
  BC?:  number | null;
  MBC?: number | null;
  SC?:  number | null;
  ST?:  number | null;
}

/** Dual-bar seats overview */
export interface SeatsRow {
  name:      string;
  Total:     number;
  Available: number;
}

/** Stacked seat distribution per category */
export interface StackedRow {
  name: string;
  OC?:  number;
  BC?:  number;
  MBC?: number;
  SC?:  number;
  ST?:  number;
}

/** Scatter point: totalSeats × cutoff */
export interface ScatterPoint {
  x:    number;   // total seats
  y:    number;   // cutoff value
  name: string;   // branchCode
}

/** Donut slice */
export interface DonutSlice {
  name:  string;
  value: number;
  color: string;
}

/** Summary KPIs */
export interface TneaStats {
  maxCutoff:   number | string;
  avgCutoff:   number | string;
  minCutoff:   number | string;
  totalSeats:  number;
  branchCount: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Safely parse a cutoff string to number. Returns null on nullish / empty. */
export const toNum = (v: string | null | undefined): number | null =>
  v ? parseFloat(v) : null;

/** All unique years from the dataset, ascending. */
export function getUniqueYears(data: TneaRecord[]): number[] {
  return [...new Set(data.map((d) => d.year))].sort((a, b) => a - b);
}

/** All unique branches (code + name) from the dataset. */
export function getUniqueBranches(
  data: TneaRecord[]
): { code: string; name: string }[] {
  const map: Record<string, string> = {};
  data.forEach((d) => { map[d.branchCode] = d.branchName; });
  return Object.entries(map).map(([code, name]) => ({ code, name }));
}

/**
 * Sum all category seats for a single record.
 * Optionally restrict to a list of categories.
 */
export function sumSeats(
  record: TneaRecord,
  field: "total" | "available",
  cats: CategoryKey[] = ["OC", "BC", "MBC", "SC", "ST"]
): number {
  return cats.reduce((acc, c) => acc + (record.seats[c]?.[field] ?? 0), 0);
}

// ── Chart data builders ───────────────────────────────────────────────────────

/**
 * Chart 1 – Cutoff Comparison bars.
 * If year === "All", one bar per record labelled "CODE·YEAR".
 * Otherwise one bar per branch for the selected year.
 */
export function buildCutoffBars(
  data: TneaRecord[],
  year: string,
  cat: CategoryKey
): CutoffBar[] {
  return data
    .map((d) => {
      const value = toNum(d.cutoff[cat]);
      if (value === null) return null;
      return {
        name:  year === "All" ? `${d.branchCode}·${d.year}` : d.branchCode,
        code:  d.branchCode,
        value,
      };
    })
    .filter((x): x is CutoffBar => x !== null);
}

/**
 * Chart 2 – Year-wise trend lines (always uses ALL data, ignores year filter).
 * Returns one object per year with a key per branch code.
 */
export function buildTrendData(
  allData: TneaRecord[],
  cat: CategoryKey
): TrendPoint[] {
  const byYear: Record<number, TrendPoint> = {};
  allData.forEach((d) => {
    if (!byYear[d.year]) byYear[d.year] = { year: d.year };
    const v = toNum(d.cutoff[cat]);
    if (v !== null) byYear[d.year][d.branchCode] = v;
  });
  return Object.values(byYear).sort((a, b) => a.year - b.year);
}

/**
 * Chart 3 – Category-wise grouped bars (OC / BC / MBC / SC / ST per branch).
 * Uses the latest year when "All" is selected.
 */
export function buildCatComparisonData(
  allData: TneaRecord[],
  filteredData: TneaRecord[],
  year: string
): CatRow[] {
  const source =
    year === "All"
      ? allData.filter(
          (d) => d.year === Math.max(...allData.map((x) => x.year))
        )
      : filteredData;

  return source.map((d) => ({
    name: d.branchCode,
    OC:   toNum(d.cutoff.OC),
    BC:   toNum(d.cutoff.BC),
    MBC:  toNum(d.cutoff.MBC),
    SC:   toNum(d.cutoff.SC),
    ST:   toNum(d.cutoff.ST),
  }));
}

/**
 * Chart 4 – Seats overview: Total vs Available per branch (filtered).
 */
export function buildSeatsOverview(data: TneaRecord[]): SeatsRow[] {
  return data.map((d) => ({
    name:      d.branchCode,
    Total:     sumSeats(d, "total"),
    Available: sumSeats(d, "available"),
  }));
}

/**
 * Chart 5 – Stacked seat distribution: category totals per branch.
 */
export function buildStackedSeats(data: TneaRecord[]): StackedRow[] {
  return data.map((d) => ({
    name: d.branchCode,
    OC:   d.seats.OC?.total  ?? 0,
    BC:   d.seats.BC?.total  ?? 0,
    MBC:  d.seats.MBC?.total ?? 0,
    SC:   d.seats.SC?.total  ?? 0,
    ST:   d.seats.ST?.total  ?? 0,
  }));
}

/**
 * Chart 7 – Scatter: total seats (X) vs cutoff (Y).
 */
export function buildScatterData(
  data: TneaRecord[],
  cat: CategoryKey
): ScatterPoint[] {
  return data
    .map((d) => {
      const y = toNum(d.cutoff[cat]);
      if (y === null) return null;
      return { x: sumSeats(d, "total"), y, name: d.branchCode };
    })
    .filter((x): x is ScatterPoint => x !== null);
}

/**
 * Chart 9 – Donut: filled vs available seats across the filtered set.
 */
export function buildDonutData(
  data: TneaRecord[],
  colors: { filled: string; available: string }
): DonutSlice[] {
  let total = 0;
  let avail = 0;
  data.forEach((d) => {
    (["OC", "BC", "MBC", "SC", "ST"] as CategoryKey[]).forEach((c) => {
      total += d.seats[c]?.total     ?? 0;
      avail += d.seats[c]?.available ?? 0;
    });
  });
  return [
    { name: "Filled",    value: total - avail, color: colors.filled    },
    { name: "Available", value: avail,          color: colors.available },
  ];
}

/**
 * Heatmap: latest-year matrix of branch × category cutoffs.
 */
export interface HeatmapRow {
  code:   string;
  values: Partial<Record<CategoryKey, number | null>>;
}

export function buildHeatmapData(
  allData: TneaRecord[],
  year: string
): HeatmapRow[] {
  const source =
    year === "All"
      ? allData.filter(
          (d) => d.year === Math.max(...allData.map((x) => x.year))
        )
      : allData.filter((d) => String(d.year) === year);

  return source.map((d) => ({
    code: d.branchCode,
    values: {
      OC:  toNum(d.cutoff.OC),
      BC:  toNum(d.cutoff.BC),
      MBC: toNum(d.cutoff.MBC),
      SC:  toNum(d.cutoff.SC),
      ST:  toNum(d.cutoff.ST),
    },
  }));
}

/**
 * KPI summary derived from filtered data + selected category.
 */
export function buildStats(
  data: TneaRecord[],
  cat: CategoryKey
): TneaStats {
  const vals = data
    .map((d) => toNum(d.cutoff[cat]))
    .filter((v): v is number => v !== null);

  const totalSeats = data.reduce((acc, d) => acc + sumSeats(d, "total"), 0);

  return {
    maxCutoff:   vals.length ? Math.max(...vals) : "—",
    avgCutoff:   vals.length
                   ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1))
                   : "—",
    minCutoff:   vals.length ? Math.min(...vals) : "—",
    totalSeats,
    branchCount: data.length,
  };
}

/**
 * Admission predictor: branches where user's cutoff ≥ branch cutoff.
 * Uses the latest year in the full dataset.
 */
export interface PredictorResult {
  branchCode: string;
  branchName: string;
  cutoff:     number;
}

export function predictEligible(
  allData: TneaRecord[],
  userCutoff: number,
  cat: CategoryKey
): PredictorResult[] {
  const maxYear = Math.max(...allData.map((d) => d.year));
  return allData
    .filter((d) => d.year === maxYear)
    .reduce<PredictorResult[]>((acc, d) => {
      const bc = toNum(d.cutoff[cat]);
      if (bc !== null && userCutoff >= bc) {
        acc.push({ branchCode: d.branchCode, branchName: d.branchName, cutoff: bc });
      }
      return acc;
    }, [])
    .sort((a, b) => b.cutoff - a.cutoff);
}