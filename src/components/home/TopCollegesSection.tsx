import { Button } from "../ui/button";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { Award, MapPin , ArrowRight } from "lucide-react";

interface College {
  rank: number;
  name: string;
  city: string;
  naacGrade: string;
  nirfRank: number;
  overallScore: number;
}

const COLLEGES: College[] = [
  {
    rank: 1,
    name: "IIT Madras",
    city: "Chennai",
    naacGrade: "A++",
    nirfRank: 1,
    overallScore: 98.5,
  },
  {
    rank: 2,
    name: "Anna University",
    city: "Chennai",
    naacGrade: "A+",
    nirfRank: 3,
    overallScore: 91.2,
  },
  {
    rank: 3,
    name: "PSG College of Technology",
    city: "Coimbatore",
    naacGrade: "A+",
    nirfRank: 15,
    overallScore: 87.8,
  },
  {
    rank: 4,
    name: "Sri Sivasubramaniya Nadar College of Engineering",
    city: "Chennai",
    naacGrade: "A+",
    nirfRank: 28,
    overallScore: 85.4,
  },
  {
    rank: 5,
    name: "Coimbatore Institute of Technology",
    city: "Coimbatore",
    naacGrade: "A",
    nirfRank: 42,
    overallScore: 82.1,
  },
];

// FIXED: was returning broken Tailwind strings like "bg-gold/15", "text-indigo", "bg-indigo/10"
// that require custom theme config. Now returns a style object with explicit oklch values.
// className structure (inline-flex, px-3, py-1, rounded-full, text-sm, font-bold) kept intact.
function getNaacBadgeStyle(grade: string): React.CSSProperties {
  if (grade === "A++")
    return {
      background: "oklch(0.78 0.15 85 / 0.12)",
      color: "oklch(0.52 0.15 75)",
      border: "1px solid oklch(0.78 0.15 85 / 0.40)",
    };
  if (grade === "A+")
    return {
      background: "oklch(0.65 0.18 145 / 0.15)",
      color: "oklch(0.40 0.18 145)",
      border: "1px solid oklch(0.65 0.18 145 / 0.40)",
    };
  // grade "A"
  return {
    background: "oklch(0.55 0.18 265 / 0.10)",
    color: "oklch(0.55 0.18 265)",
    border: "1px solid oklch(0.55 0.18 265 / 0.30)",
  };
}

interface TopCollegesSectionProps {
  onNavigateToRankings?: () => void;
}

export function TopCollegesSection({
  onNavigateToRankings,
}: TopCollegesSectionProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    // FIXED: "bg-muted/40" (undefined token) → explicit cool off-white matching hero's navy palette
    <section id="top-colleges" className="py-20" style={{ background: "oklch(0.97 0.012 258)" }}>
      <div
        ref={ref}
        className={`container mx-auto px-4 ${isVisible ? "section-visible" : "section-enter"}`}
      >
        {/* Header */}
        <div className="text-center mb-12">
          {/* FIXED: "text-navy/60" (undefined token) → explicit oklch navy; "justify-center" added
              as inline style since eyebrow-tag is inline-flex and needs centering */}
          <div
            className="eyebrow-tag mb-4"
            style={{
              display: "inline-flex",
              justifyContent: "center",
              color: "oklch(0.22 0.08 258 / 0.65)",
              background: "oklch(0.22 0.08 258 / 0.07)",
              border: "1px solid oklch(0.22 0.08 258 / 0.18)",
            }}
          >
            Top Performers
          </div>

          {/* FIXED: "text-navy" (undefined token) → explicit; "text-gradient-primary" (undefined)
              → explicit indigo-to-gold gradient matching HeroSection's gold gradient direction */}
          <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-4" style={{ color: "oklch(0.18 0.07 258)" }}>
            Top Ranked{" "}
            <span
              style={{
                background: "linear-gradient(135deg, oklch(0.55 0.18 265) 0%, oklch(0.78 0.15 85) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Colleges
            </span>
          </h2>

          {/* FIXED: "text-muted-foreground" (undefined token) → explicit muted navy-grey */}
          <p className="max-w-xl mx-auto text-base" style={{ color: "oklch(0.52 0.04 258)" }}>
            Highlights the top performing institutions based on the combined
            analytical ranking model.
          </p>
        </div>

        {/* College Cards — structure 100% unchanged */}
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {COLLEGES.map((college, i) => (
            <div
              key={college.rank}
              data-ocid={`colleges.item.${i + 1}`}
              // FIXED: "border-border" / "shadow-card" / "hover:shadow-card-hover" / "hover:border-indigo/25"
              // all undefined tokens → explicit inline style values. Hover via onMouse handlers.
              // All layout classes (group, bg-white, rounded-xl, p-5, flex, gap-4, etc.) kept intact.
              className="group bg-white rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{
                border: "1.5px solid oklch(0.88 0.02 258)",
                boxShadow: "0 1px 6px oklch(0 0 0 / 0.06)",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(1.5rem)",
                transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms, border-color 0.25s, box-shadow 0.25s`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "oklch(0.55 0.18 265 / 0.28)";
                el.style.boxShadow = "0 8px 28px oklch(0.55 0.18 265 / 0.10), 0 2px 8px oklch(0 0 0 / 0.06)";
                el.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "oklch(0.88 0.02 258)";
                el.style.boxShadow = "0 1px 6px oklch(0 0 0 / 0.06)";
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Rank Badge — FIXED: "bg-navy" (undefined token) → explicit navy gradient */}
              <div
                className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-sm"
                style={{
                  background: "linear-gradient(135deg, oklch(0.14 0.07 258) 0%, oklch(0.22 0.08 258) 100%)",
                  boxShadow: "0 3px 10px oklch(0.16 0.07 258 / 0.28)",
                }}
              >
                <span className="font-heading text-xl font-black text-white">
                  #{college.rank}
                </span>
              </div>

              {/* College Info */}
              <div className="flex-1 min-w-0">
                {/* FIXED: "text-navy" + "group-hover:text-indigo" (both undefined) → explicit colors via handlers */}
                <h3
                  className="font-heading text-base md:text-lg font-bold transition-colors truncate"
                  style={{ color: "oklch(0.18 0.07 258)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.55 0.18 265)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.18 0.07 258)")}
                >
                  {college.name}
                </h3>
                {/* FIXED: "text-muted-foreground" → explicit */}
                <div className="flex items-center gap-1.5 mt-1 text-sm" style={{ color: "oklch(0.60 0.04 258)" }}>
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{college.city}</span>
                </div>
              </div>

              {/* NAAC Grade */}
              <div className="flex flex-col items-center gap-1">
                {/* FIXED: "text-muted-foreground" → explicit */}
                <span className="text-[10px] uppercase tracking-wide font-medium" style={{ color: "oklch(0.60 0.04 258)" }}>
                  NAAC
                </span>
                {/* FIXED: getNaacBadgeStyle now returns CSSProperties; applied via style prop.
                    className string kept identical (layout + typography only, no color tokens) */}
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold font-heading"
                  style={getNaacBadgeStyle(college.naacGrade)}
                >
                  <Award className="w-3.5 h-3.5" />
                  {college.naacGrade}
                </span>
              </div>

              {/* NIRF Rank */}
              <div className="flex flex-col items-center gap-1 min-w-[60px]">
                {/* FIXED: "text-muted-foreground" → explicit */}
                <span className="text-[10px] uppercase tracking-wide font-medium" style={{ color: "oklch(0.60 0.04 258)" }}>
                  NIRF
                </span>
                {/* FIXED: "text-navy" → explicit */}
                <span className="font-heading text-lg font-black" style={{ color: "oklch(0.18 0.07 258)" }}>
                  #{college.nirfRank}
                </span>
              </div>

              {/* Overall Score */}
              <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
                {/* FIXED: "text-muted-foreground" → explicit */}
                <span className="text-[10px] uppercase tracking-wide font-medium" style={{ color: "oklch(0.60 0.04 258)" }}>
                  Overall Score
                </span>
                {/* FIXED: "text-gold" (undefined token) → explicit gold matching HeroSection */}
                <span className="font-heading text-lg font-black" style={{ color: "oklch(0.78 0.15 85)" }}>
                  {college.overallScore}
                </span>
                {/* FIXED: "bg-muted" → explicit track color */}
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "oklch(0.90 0.02 258)" }}>
                  {/* FIXED: "bg-gradient-to-r from-indigo to-gold" (both undefined tokens)
                      → explicit linear-gradient matching HeroSection's indigo→gold direction */}
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: isVisible ? `${college.overallScore}%` : "0%",
                      background: "linear-gradient(90deg, oklch(0.55 0.18 265) 0%, oklch(0.78 0.15 85) 100%)",
                      transitionDelay: `${i * 100 + 400}ms`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          {/* FIXED: "bg-navy" / "hover:bg-navy/90" (undefined tokens) → explicit style + hover handler */}
          <Button
            data-ocid="colleges.primary_button"
            size="lg"
            onClick={onNavigateToRankings}
            className="text-white font-semibold px-8"
            style={{
              background: "linear-gradient(135deg, oklch(0.14 0.07 258) 0%, oklch(0.22 0.08 258) 100%)",
              boxShadow: "0 4px 16px oklch(0.16 0.07 258 / 0.28)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "linear-gradient(135deg, oklch(0.22 0.08 258) 0%, oklch(0.28 0.09 258) 100%)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "linear-gradient(135deg, oklch(0.14 0.07 258) 0%, oklch(0.22 0.08 258) 100%)")
            }
          >
            View Full Rankings
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}