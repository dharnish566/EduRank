
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Filter, Search, X } from "lucide-react";
import type { SortKey } from "../../types/rankings";

interface RankingsControlsBarProps {
  search: string;
  cityFilter: string;
  typeFilter: string;
  naacFilter: string;
  sortKey: SortKey;
  cities: string[];
  hasActiveFilters: boolean;
  activeFilterCount: number;
  onSearchChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onTypeChange: (v: string) => void;
  onNaacChange: (v: string) => void;
  onSortChange: (v: SortKey) => void;
  onClearFilters: () => void;
}

export function RankingsControlsBar({
  search, cityFilter, typeFilter, naacFilter, sortKey,
  cities, hasActiveFilters, activeFilterCount,
  onSearchChange, onCityChange, onTypeChange,
  onNaacChange, onSortChange, onClearFilters,
}: RankingsControlsBarProps) {

  const selectBase =
    "h-9 text-sm border-0 outline-none ring-0 cursor-pointer " +
    "bg-white/[0.06] text-[rgba(220,210,255,0.85)] " +
    "focus:bg-white/[0.09] focus:border-[rgba(160,140,255,0.45)]";

  return (
    <div
      className="sticky top-0 z-40"
      style={{
        background: "#ffffff",
        borderBottom: "1px solid oklch(0.91 0.01 258)",
        boxShadow: "0 2px 16px oklch(0.22 0.06 258 / 0.08)",
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center gap-2.5">

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-[260px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
              style={{ color: "rgba(160,148,220,0.55)" }}
            />
            <Input
              type="text"
              placeholder="Search colleges..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 text-sm text-foreground placeholder:text-[rgba(160,148,220,0.40)] focus-visible:ring-[rgba(210,207,223,0.55)] focus-visible:border-[rgba(160,148,220,0.55)]"
              style={{
                background: "oklch(0.97 0.005 258)",
                border: "0.5px solid oklch(0.88 0.01 258)",
                borderRadius: "8px",
              }}
            />
          </div>

          {/* Filter label */}
          <div
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest flex-shrink-0"
            style={{ color: "oklch(0.55 0.04 258)" }}
          >
            <Filter className="w-3 h-3" />
            Filters
          </div>

          {/* City */}
          <Select value={cityFilter} onValueChange={onCityChange}>
            <SelectTrigger
              data-ocid="rankings.city_select"
              className={selectBase}
              style={{
                width: "130px",
                background: "oklch(0.97 0.005 258)",
                border: "0.5px solid oklch(0.88 0.01 258)",
                borderRadius: "8px",
                color: "oklch(0.25 0.04 258)",
              }}
            >
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent style={{
              background: "#ffffff",
              border: "0.5px solid oklch(0.88 0.01 258)",
            }}>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Type */}
          <Select value={typeFilter} onValueChange={onTypeChange}>
            <SelectTrigger
              data-ocid="rankings.type_select"
              className={selectBase}
              style={{
                width: "130px",
                background: "oklch(0.97 0.005 258)",
                border: "0.5px solid oklch(0.88 0.01 258)",
                borderRadius: "8px",
                color: "oklch(0.25 0.04 258)",
              }}
            >
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent style={{
              width: "130px",
              background: "oklch(0.97 0.005 258)",
              border: "0.5px solid oklch(0.88 0.01 258)",
              borderRadius: "8px",
              color: "oklch(0.25 0.04 258)",
            }}>
              <SelectItem value="all">All Types</SelectItem>
              {["IIT", "NIT", "Deemed", "State", "Private"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* NAAC */}
          <Select value={naacFilter} onValueChange={onNaacChange}>
            <SelectTrigger
              data-ocid="rankings.naac_select"
              className={selectBase}
              style={{
                width: "130px",
                background: "oklch(0.97 0.005 258)",
                border: "0.5px solid oklch(0.88 0.01 258)",
                borderRadius: "8px",
                color: "oklch(0.25 0.04 258)",
              }}
            >
              <SelectValue placeholder="All Grades" />
            </SelectTrigger>
            <SelectContent style={{
              width: "130px",
              background: "oklch(0.97 0.005 258)",
              border: "0.5px solid oklch(0.88 0.01 258)",
              borderRadius: "8px",
              color: "oklch(0.25 0.04 258)",
            }}>
              <SelectItem value="all">All Grades</SelectItem>
              {["A++", "A+", "A", "B++", "B+", "B", "C"].map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Divider */}
          <div
            className="hidden sm:block w-px h-5 flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.10)" }}
          />

          {/* Sort — gold accent to stand out */}
          <Select value={sortKey} onValueChange={(v) => onSortChange(v as SortKey)}>
            <SelectTrigger
              data-ocid="rankings.sort_select"
              className="h-9 text-sm font-medium outline-none ring-0 cursor-pointer"
              style={{
                width: "165px",
                background: "oklch(0.80 0.16 86 / 0.08)",
                border: "0.5px solid oklch(0.80 0.16 86 / 0.30)",
                borderRadius: "8px",
                color: "oklch(0.52 0.14 72)",
              }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{
              width: "130px",
              background: "oklch(0.97 0.005 258)",
              border: "0.5px solid oklch(0.88 0.01 258)",
              borderRadius: "8px",
              color: "oklch(0.25 0.04 258)",
            }}>
              <SelectItem value="overallScore">Overall Score ↓</SelectItem>
              <SelectItem value="nirfRank">NIRF Rank ↑</SelectItem>
              <SelectItem value="placementPct">Placement % ↓</SelectItem>
              <SelectItem value="avgPackageLPA">Avg Package ↓</SelectItem>
            </SelectContent>
          </Select>

          {/* Active badge + Clear */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 ml-auto">
              <span
                className="inline-flex items-center h-7 px-2.5 rounded-full text-[11px] font-semibold tracking-wide"
                style={{
                  background: "oklch(0.46 0.19 266 / 0.08)",
                  border: "0.5px solid oklch(0.46 0.19 266 / 0.25)",
                  color: "oklch(0.46 0.19 266)",
                }}
              >
                {activeFilterCount} active
              </span>
              <Button
                data-ocid="rankings.cancel_button"
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-7 px-2.5 text-xs gap-1.5 font-medium"
                style={{
                  background: "transparent",
                  border: "0.5px solid oklch(0.85 0.01 258)",
                  borderRadius: "8px",
                  color: "oklch(0.55 0.04 258)",
                }}
              >
                <X className="w-3 h-3" />
                Clear All
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}