/**
 * src/services/collegeFinderApi.ts
 * ─────────────────────────────────────────────────────────────────────────
 * API service + data mapper.
 *
 * The backend returns ApiCollege (snake_case, flat).
 * CollegeFinderPage needs CollegeWithScore (camelCase, rich).
 * mapToCollegeWithScore() bridges the two — zero changes to either side.
 */

// ── 1. Backend response shape ────────────────────────────────────────────

export interface ApiCourse {
  branch_code: string;
  branch_name: string;
}

export interface ApiCollege {
  id:              number;
  name:            string;
  district:        string | null;
  state:           string | null;
  college_type:    string | null;
  university_type: string | null;
  naac_grade:      string | null;
  naac_score:      string | null;    // Postgres NUMERIC comes as string
  nirf_rank:       number | null;
  overall_score:   string | null;    // same
  placement_pct:   string | null;
  courses:         ApiCourse[];
}

// ── 2. Frontend shape (matches existing College + CollegeWithScore) ───────

export type CollegeType = "IIT" | "NIT" | "Deemed" | "State" | "Private";
export type NaacGrade   = "A++" | "A+" | "A" | "B++";

export interface FrontendCourse {
  course_name: string;
}

export interface PlacementTrendPoint {
  year:   number;
  avgLPA: number;
}

export interface CollegeWithScore {
  id:            number;
  name:          string;
  shortName:     string;        // chart Y-axis label
  city:          string;        // cards show college.city
  state:         string;
  type:          CollegeType;
  naacGrade:     NaacGrade;
  nirfRank:      number | null;
  naacScore:     number | null;
  placementPct:  number;
  avgPackageLPA: number;        // chart — stubbed if backend doesn't expose
  placementTrend: PlacementTrendPoint[];   // chart — stubbed
  feeRange:      { min: number; max: number };  // sort by feeMin
  courses:       FrontendCourse[];
  matchScore:    number;
  scoreBreakdown: {
    district: number; type: number; naac: number;
    nirf: number;     tnea: number; course: number; placement: number;
  };
}

// ── 3. Filter input shape (matches page's FinderInputs exactly) ──────────

export interface FinderFilters {
  district:        string;
  universityType:  "any" | CollegeType;
  naacGrade:       "any" | NaacGrade;
  minNaacScore:    number;
  useNaacScore:    boolean;
  nirfTopN:        "any" | "top10" | "top25" | "top50" | "top100";
  tneaMaxCutoff:   number;
  courseName:      string;
  minPlacementPct: number;
}

// ── 4. Small helpers ─────────────────────────────────────────────────────

/** Postgres NUMERIC → float. Returns fallback for null/empty. */
function toFloat(v: string | number | null | undefined, fallback = 0): number {
  if (v == null || v === "") return fallback;
  const n = typeof v === "number" ? v : parseFloat(v as string);
  return Number.isFinite(n) ? n : fallback;
}

/** Maps university_type DB string → strict CollegeType union. */
function resolveType(raw: string | null): CollegeType {
  if (!raw) return "Private";
  const t = raw.toLowerCase();
  if (t.includes("iit"))    return "IIT";
  if (t.includes("nit"))    return "NIT";
  if (t.includes("deemed")) return "Deemed";
  if (t.includes("state") || t.includes("government")) return "State";
  return "Private";
}

/** Maps NAAC grade string → strict NaacGrade union (safe fallback: "A"). */
function resolveGrade(raw: string | null): NaacGrade {
  if (raw === "A++" || raw === "A+" || raw === "A" || raw === "B++") return raw;
  return "A";
}

/** First 2 words — used for chart Y-axis labels. */
function toShortName(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).join(" ");
}

/** Strips UI sentinel values so only real filter values go to the API. */
function cleanFilters(f: FinderFilters): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  if (f.district && f.district !== "Any District")
    out.district = f.district;

  if (f.universityType !== "any")
    out.universityType = f.universityType;

  if (f.useNaacScore) {
    out.useNaacScore = true;
    out.minNaacScore = f.minNaacScore;
  } else if (f.naacGrade !== "any") {
    out.useNaacScore = false;
    out.naacGrade    = f.naacGrade;
  }

  if (f.nirfTopN !== "any")
    out.nirfTopN = f.nirfTopN;

  out.tneaMaxCutoff   = f.tneaMaxCutoff;
  out.minPlacementPct = f.minPlacementPct;

  if (f.courseName && f.courseName !== "Any Course")
    out.courseName = f.courseName;

  return out;
}

// ── 5. Core mapper: ApiCollege → CollegeWithScore ─────────────────────────

const GRADE_ORDER: Record<string, number> = { "A++": 4, "A+": 3, A: 2, "B++": 1 };
const GRADE_TO_SCORE: Record<string, number> = { "A++": 3.76, "A+": 3.51, "A": 3.26, "B++": 3.01 };
const NIRF_LIMITS: Record<string, number>   = { top10: 10, top25: 25, top50: 50, top100: 100 };
const CUTOFF_REQ:  Record<CollegeType, number> = { IIT: 170, NIT: 150, Deemed: 120, State: 100, Private: 90 };

export function mapToCollegeWithScore(
  api: ApiCollege,
  filters: FinderFilters
): CollegeWithScore {
  const placementPct = toFloat(api.placement_pct, 0);
  const mappedType   = resolveType(api.university_type);

  // ── Client-side match score (mirrors original computeMatchScore) ──────
  // The backend already filtered; this scores HOW WELL each result matches.

  // District (20 pts)
  let districtScore = 0;
  if (!filters.district || filters.district === "Any District") {
    districtScore = 20;
  } else if (
    api.district?.toLowerCase() === filters.district.toLowerCase() ||
    api.state?.toLowerCase()    === filters.district.toLowerCase()
  ) {
    districtScore = 20;
  }

  // Type (15 pts)
  let typeScore = 0;
  if (filters.universityType === "any" || mappedType === filters.universityType) {
    typeScore = 15;
  }

  // NAAC (15 pts)
  let naacScore = 0;
  if (filters.useNaacScore) {
    const cs = GRADE_TO_SCORE[api.naac_grade ?? ""] ?? 0;
    if (cs >= filters.minNaacScore) {
      naacScore = 15;
    } else if (cs >= filters.minNaacScore - 0.25) {
      naacScore = Math.round(15 * (1 - (filters.minNaacScore - cs) / 0.25));
    }
  } else {
    if (filters.naacGrade === "any") {
      naacScore = 15;
    } else {
      const req = GRADE_ORDER[filters.naacGrade] ?? 0;
      const got = GRADE_ORDER[api.naac_grade ?? ""] ?? 0;
      if (got >= req) naacScore = 15;
    }
  }

  // NIRF (10 pts)
  let nirfScore = 0;
  const nirfLimit = NIRF_LIMITS[filters.nirfTopN] ?? Infinity;
  if (api.nirf_rank != null && api.nirf_rank <= nirfLimit) nirfScore = 10;
  if (filters.nirfTopN === "any") nirfScore = 10;

  // TNEA (20 pts)
  let tneaScore = 0;
  const req = CUTOFF_REQ[mappedType];
  if (filters.tneaMaxCutoff >= req) {
    tneaScore = 20;
  } else if (filters.tneaMaxCutoff >= req - 20) {
    tneaScore = Math.round(20 * (1 - (req - filters.tneaMaxCutoff) / 20));
  }

  // Course (15 pts)
  let courseScore = 0;
  if (!filters.courseName || filters.courseName === "Any Course") {
    courseScore = 15;
  } else {
    const kw = filters.courseName.replace(/^B\.Tech\s+/i, "").toLowerCase();
    if (api.courses.some((c) => c.branch_name.toLowerCase().includes(kw))) {
      courseScore = 15;
    }
  }

  // Placement (5 pts)
  let placementScore = 0;
  if (placementPct >= filters.minPlacementPct) {
    placementScore = 5;
  } else if (placementPct >= filters.minPlacementPct - 10) {
    placementScore = Math.round(5 * (1 - (filters.minPlacementPct - placementPct) / 10));
  }

  const matchScore = Math.min(
    100,
    districtScore + typeScore + naacScore + nirfScore + tneaScore + courseScore + placementScore
  );

  // ── Derive chart fields the backend doesn't expose yet ────────────────
  // avgPackageLPA  — estimated from overall_score (3–21 LPA range)
  // placementTrend — simulated slight upward trend anchored to avgPackageLPA
  // feeRange       — static stub (add a fees table to the backend when ready)
  const overallScore   = toFloat(api.overall_score, 50);
  const avgPackageLPA  = parseFloat(((overallScore / 100) * 18 + 3).toFixed(1));
  const placementTrend: PlacementTrendPoint[] = [2020, 2021, 2022, 2023, 2024].map((year) => ({
    year,
    avgLPA: parseFloat((avgPackageLPA * (0.88 + (year - 2020) * 0.03)).toFixed(1)),
  }));

  return {
    id:            api.id,
    name:          api.name,
    shortName:     toShortName(api.name),
    city:          api.district ?? "Unknown",
    state:         api.state    ?? "Unknown",
    type:          mappedType,
    naacGrade:     resolveGrade(api.naac_grade),
    nirfRank:      api.nirf_rank,
    naacScore:     api.naac_score ? parseFloat(api.naac_score) : null,
    placementPct,
    avgPackageLPA,
    placementTrend,
    feeRange:      { min: 50_000, max: 200_000 },
    courses:       api.courses.map((c) => ({ course_name: c.branch_name })),
    matchScore,
    scoreBreakdown: {
      district: districtScore, type: typeScore,  naac: naacScore,
      nirf:     nirfScore,     tnea: tneaScore,  course: courseScore,
      placement: placementScore,
    },
  };
}

// ── 6. API calls ─────────────────────────────────────────────────────────

// const BASE = "http://localhost:5000/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res  = await fetch(`${import.meta.env.VITE_API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const json = await res
    .json()
    .catch(() => ({ success: false, error: `HTTP ${res.status}` }));
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? (json.errors as string[] | undefined)?.join(", ") ?? `HTTP ${res.status}`);
  }
  return json.data as T;
}

/**
 * findCollegesApi
 * ────────────────
 * Drop-in replacement for:
 *   COLLEGES.filter(...).map(c => computeMatchScore(c, inputs))
 *
 * Usage in CollegeFinderPage.tsx — replace handleFind body with:
 *
 *   const data = await findCollegesApi(inputs);
 *   setResults(data);
 */
export async function findCollegesApi(filters: FinderFilters): Promise<CollegeWithScore[]> {
  const raw = await apiFetch<ApiCollege[]>("/finder/find", {
    method: "POST",
    body:   JSON.stringify(cleanFilters(filters)),
  });

  return raw
    .map((c) => mapToCollegeWithScore(c, filters))
    .filter((c) => c.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

/** Fetch one college's full detail (for the "View Details" page). */
export async function getCollegeDetail(id: number): Promise<ApiCollege> {
  return apiFetch<ApiCollege>(`/finder/${id}`);
}

/** Live district list for the dropdown (replaces static DISTRICTS array). */
export async function fetchDistricts(): Promise<string[]> {
  const data = await apiFetch<string[]>("/finder/meta/districts");
  return ["Any District", ...data];
}

/** Live course list for the dropdown (replaces static COURSE_OPTIONS array). */
export async function fetchCourses(): Promise<string[]> {
  const data = await apiFetch<string[]>("/finder/meta/courses");
  return ["Any Course", ...data];
}