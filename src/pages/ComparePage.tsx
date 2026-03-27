// ─────────────────────────────────────────────────────────
//  src/pages/ComparePage.tsx  (FINAL)
//
//  selectedColleges derived from API-fetched collegeDetailMap,
//  not from the static local COLLEGES array.
//  canCompare requires selectedColleges.length >= 2 so the table
//  only renders once real data is loaded (not just ids selected).
// ─────────────────────────────────────────────────────────

import { Button }       from "../components/ui/button";
import {
  ArrowLeft, BarChart3, GitCompare, Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { PageFooter }       from "../components/layout/PageFooter";
import { CollegeSelector }  from "../components/compare/collegeSelector";
import { ComparisonTable }  from "../components/compare/CompareTable";
import { CompareBottomBar } from "../components/compare/CompareBottomBar";
import { T }                from "../utils/compareTokens";
import type { College }     from "../data/colleges";

interface ComparePageProps {
  initialIds?:          number[];
  onNavigateHome:       () => void;
  onNavigateToRankings: () => void;
}

const MAX_COMPARE = 4;

export function ComparePage({
  initialIds = [],
  onNavigateHome,
  onNavigateToRankings,
}: ComparePageProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>(
    initialIds.slice(0, MAX_COMPARE),
  );

  // Holds the full College objects fetched from the compare API.
  // CollegeSelector owns the fetch and calls this setter whenever its map changes.
  const [collegeDetailMap, setCollegeDetailMap] = useState<Map<number, College>>(new Map());

  // Ordered to match selectedIds, skips ids not yet loaded
  const selectedColleges: College[] = selectedIds
    .map((id) => collegeDetailMap.get(id))
    .filter((c): c is College => c !== undefined);

  // Only enable comparison once real data is loaded for ≥2 colleges
  const canCompare = selectedColleges.length >= 2;

  const handleAdd = (id: number) =>
    setSelectedIds((p) => p.length >= MAX_COMPARE || p.includes(id) ? p : [...p, id]);

  const handleRemove = (idx: number) =>
    setSelectedIds((p) => p.filter((id) => id > 0).filter((_, i) => i !== idx));

  const handleClearAll = () => {
    setSelectedIds([]);
    setCollegeDetailMap(new Map());
  };

  return (
    <div className="min-h-screen bg-background font-body antialiased">

      {/* ════ HERO ════ */}
      <header
        className="relative overflow-hidden"
        style={{ background: T.heroBg, paddingTop: "5rem", paddingBottom: "4rem" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(1 0 0 / 0.25) 1px, transparent 1px)",
            backgroundSize:  "28px 28px",
          }}
        />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 80% at 10% 50%, ${T.indigo}4D 0%, transparent 65%)` }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 50% 60% at 90% 20%, ${T.gold}1A 0%, transparent 60%)` }} />
        <div
          className="absolute right-0 bottom-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: T.gold, opacity: 0.035, transform: "translate(42%, 42%)" }}
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-sm mb-8">
            <button type="button" data-ocid="compare.link" onClick={onNavigateHome}
              className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Home
            </button>
            <span className="text-white/25">/</span>
            <button type="button" data-ocid="compare.rankings_link" onClick={onNavigateToRankings}
              className="text-white/60 hover:text-white transition-colors"
            >
              Rankings
            </button>
            <span className="text-white/25">/</span>
            <span className="text-white/80 font-medium">Compare Colleges</span>
          </nav>

          <div className="max-w-3xl">
            <div className="eyebrow-tag mb-4" style={{ color: `${T.gold}CC` }}>Side-by-Side Analysis</div>
            <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-white mb-4 tracking-tight">
              Compare{" "}
              <span style={{
                background: "linear-gradient(135deg, oklch(0.92 0.18 90), oklch(0.72 0.18 72))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Colleges
              </span>
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl leading-relaxed">
              Select up to{" "}
              <span className="text-white/80 font-semibold">{MAX_COMPARE}</span>{" "}
              colleges and compare them side-by-side across rankings, placements, fees, and more.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { label: "Parameters Compared", value: "10"                    },
              { label: "Max Colleges",         value: `${MAX_COMPARE}`        },
              { label: "Selected",             value: `${selectedIds.length}` },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                style={{ background: "oklch(1 0 0 / 0.055)", border: "1px solid oklch(1 0 0 / 0.10)", backdropFilter: "blur(12px)" }}
              >
                <div>
                  <p className="text-[10px] text-white/45 uppercase tracking-wider font-medium leading-none mb-0.5">{stat.label}</p>
                  <p className="text-white font-bold text-sm font-heading leading-none">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ════ MAIN ════ */}
      <main className="container mx-auto px-4 sm:px-6 py-8">

        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-lg flex items-center gap-2" style={{ color: T.navy }}>
              <GitCompare className="w-5 h-5" style={{ color: T.indigo }} />
              Select Colleges to Compare
            </h2>
            <button type="button" data-ocid="compare.rankings_link" onClick={onNavigateToRankings}
              className="text-sm font-medium transition-colors flex items-center gap-1 hover:opacity-75"
              style={{ color: T.indigo }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Rankings
            </button>
          </div>

          <CollegeSelector
            selectedIds={selectedIds}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onClearAll={handleClearAll}
            onDetailMapChange={setCollegeDetailMap}
          />
        </section>

        <AnimatePresence mode="wait">
          {!canCompare ? (
            <motion.div
              key="empty"
              data-ocid="compare.empty_state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: `linear-gradient(135deg, ${T.indigo}14, ${T.gold}0F)`, border: `1px solid ${T.indigo}1F` }}
              >
                <GitCompare className="w-11 h-11" style={{ color: `${T.indigo}66` }} />
              </motion.div>
              <h3 className="font-heading text-2xl font-bold mb-3" style={{ color: T.navy }}>No comparison yet</h3>
              <p className="text-base max-w-sm mb-8 leading-relaxed" style={{ color: T.muted }}>
                Select at least <strong style={{ color: T.navy }}>2 colleges</strong> above to start comparing their rankings, placements, and metrics.
              </p>
              <Button data-ocid="compare.primary_button" onClick={onNavigateToRankings}
                className="bg-navy text-white hover:bg-navy/90 font-semibold px-6"
              >
                Browse Rankings
              </Button>
            </motion.div>
          ) : (
            <motion.div key="table" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading font-bold text-lg flex items-center gap-2" style={{ color: T.navy }}>
                  <BarChart3 className="w-5 h-5" style={{ color: T.indigo }} />
                  Comparison Results
                  <span className="ml-1 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white" style={{ background: T.indigo }}>
                    {selectedColleges.length}
                  </span>
                </h2>
                <div className="flex items-center gap-2 text-sm" style={{ color: T.muted }}>
                  <Trophy className="w-4 h-4" style={{ color: `${T.gold}B3` }} />
                  <span>Gold = best value in row</span>
                </div>
              </div>
              <ComparisonTable colleges={selectedColleges} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <CompareBottomBar
        canCompare={canCompare}
        selectedColleges={selectedColleges}
        onClearAll={handleClearAll}
        onNavigateToRankings={onNavigateToRankings}
      />

      <PageFooter />
    </div>
  );
}