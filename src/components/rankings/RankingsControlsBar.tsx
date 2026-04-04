import { Badge }  from "../ui/badge";
import { Button } from "../ui/button";
import { Input }  from "../ui/input";
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
  search:     string;
  cityFilter: string;
  typeFilter: string;
  naacFilter: string;
  sortKey:    SortKey;
  cities:     string[];
  hasActiveFilters:  boolean;
  activeFilterCount: number;
  onSearchChange:     (v: string) => void;
  onCityChange:       (v: string) => void;
  onTypeChange:       (v: string) => void;
  onNaacChange:       (v: string) => void;
  onSortChange:       (v: SortKey) => void;
  onClearFilters:     () => void;
}

export function RankingsControlsBar({
  search,
  cityFilter,
  typeFilter,
  naacFilter,
  sortKey,
  cities,
  hasActiveFilters,
  activeFilterCount,
  onSearchChange,
  onCityChange,
  onTypeChange,
  onNaacChange,
  onSortChange,
  onClearFilters,
}: RankingsControlsBarProps) {
  return (
    <div
      className="sticky top-0 z-40 bg-white border-b border-border"
      style={{
        boxShadow:
          "0 2px 16px oklch(0.22 0.06 258 / 0.08), 0 1px 0 oklch(0.91 0.01 258)",
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              data-ocid="rankings.search_input"
              type="text"
              placeholder="Search colleges..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 text-sm border-border focus:border-indigo focus:ring-indigo/20"
            />
          </div>

          {/* Filter label */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground font-medium shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Filters:
          </div>

          {/* City filter */}
          <Select
            value={cityFilter}
            onValueChange={onCityChange}
          >
            <SelectTrigger
              data-ocid="rankings.city_select"
              className="h-9 text-sm w-[140px] border-border"
            >
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type filter */}
          <Select
            value={typeFilter}
            onValueChange={onTypeChange}
          >
            <SelectTrigger
              data-ocid="rankings.type_select"
              className="h-9 text-sm w-[130px] border-border"
            >
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="IIT">IIT</SelectItem>
              <SelectItem value="NIT">NIT</SelectItem>
              <SelectItem value="Deemed">Deemed</SelectItem>
              <SelectItem value="State">State</SelectItem>
              <SelectItem value="Private">Private</SelectItem>
            </SelectContent>
          </Select>

          {/* NAAC filter */}
          <Select
            value={naacFilter}
            onValueChange={onNaacChange}
          >
            <SelectTrigger
              data-ocid="rankings.naac_select"
              className="h-9 text-sm w-[140px] border-border"
            >
              <SelectValue placeholder="All Grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="A++">A++</SelectItem>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B++">B++</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={sortKey}
            onValueChange={(v) => onSortChange(v as SortKey)}
          >
            <SelectTrigger
              data-ocid="rankings.sort_select"
              className="h-9 text-sm w-[175px] border-border"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overallScore">Overall Score ↓</SelectItem>
              <SelectItem value="nirfRank">NIRF Rank ↑</SelectItem>
              <SelectItem value="placementPct">Placement % ↓</SelectItem>
              <SelectItem value="avgPackageLPA">Avg Package ↓</SelectItem>
            </SelectContent>
          </Select>

          {/* Active filter count + Clear */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 ml-auto">
              <Badge
                className="h-7 px-2.5 text-xs font-semibold bg-indigo/10 text-indigo border-indigo/25 hover:bg-indigo/15"
                variant="outline"
              >
                {activeFilterCount} active
              </Badge>
              <Button
                data-ocid="rankings.cancel_button"
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1"
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