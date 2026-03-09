import { Button } from "../components/ui/button";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { Award, MapPin } from "lucide-react";

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

function getNaacBadgeStyle(grade: string) {
  if (grade === "A++")
    return "bg-gold/15 text-[oklch(0.55_0.15_75)] border border-gold/40";
  if (grade === "A+")
    return "bg-[oklch(0.65_0.18_145/0.15)] text-[oklch(0.40_0.18_145)] border border-[oklch(0.65_0.18_145/0.40)]";
  return "bg-indigo/10 text-indigo border border-indigo/30";
}

interface TopCollegesSectionProps {
  onNavigateToRankings?: () => void;
}

export function TopCollegesSection({
  onNavigateToRankings,
}: TopCollegesSectionProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="top-colleges" className="py-20 bg-muted/40">
      <div
        ref={ref}
        className={`container mx-auto px-4 ${isVisible ? "section-visible" : "section-enter"}`}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="eyebrow-tag text-navy/60 mb-4 justify-center">
            Top Performers
          </div>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-navy mb-4">
            Top Ranked <span className="text-gradient-primary">Colleges</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Highlights the top performing institutions based on the combined
            analytical ranking model.
          </p>
        </div>

        {/* College Cards */}
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {COLLEGES.map((college, i) => (
            <div
              key={college.rank}
              data-ocid={`colleges.item.${i + 1}`}
              className="group bg-white border border-border rounded-xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 hover:border-indigo/25 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(1.5rem)",
                transition: `all 0.6s ease ${i * 80}ms`,
              }}
            >
              {/* Rank Badge */}
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-navy flex items-center justify-center shadow-sm">
                <span className="font-heading text-xl font-black text-white">
                  #{college.rank}
                </span>
              </div>

              {/* College Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base md:text-lg font-bold text-navy group-hover:text-indigo transition-colors truncate">
                  {college.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-sm">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{college.city}</span>
                </div>
              </div>

              {/* NAAC Grade */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  NAAC
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold font-heading ${getNaacBadgeStyle(college.naacGrade)}`}
                >
                  <Award className="w-3.5 h-3.5" />
                  {college.naacGrade}
                </span>
              </div>

              {/* NIRF Rank */}
              <div className="flex flex-col items-center gap-1 min-w-[60px]">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  NIRF
                </span>
                <span className="font-heading text-lg font-black text-navy">
                  #{college.nirfRank}
                </span>
              </div>

              {/* Overall Score */}
              <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  Overall Score
                </span>
                <span className="font-heading text-lg font-black text-gold">
                  {college.overallScore}
                </span>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-indigo to-gold"
                    style={{
                      width: isVisible ? `${college.overallScore}%` : "0%",
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
          <Button
            data-ocid="colleges.primary_button"
            size="lg"
            onClick={onNavigateToRankings}
            className="bg-navy text-white hover:bg-navy/90 font-semibold px-8"
          >
            View Full Rankings
          </Button>
        </div>
      </div>
    </section>
  );
}
