import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { Award, GraduationCap, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DataSource {
  icon: LucideIcon;
  acronym: string;
  fullName: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const SOURCES: DataSource[] = [
  {
    icon: Award,
    acronym: "NAAC",
    fullName: "National Assessment and Accreditation Council",
    description:
      "Accreditation grades and quality scores assigned to higher education institutions across India based on comprehensive evaluation criteria.",
    color: "text-gold",
    bgColor: "bg-gold/10",
    borderColor: "border-gold/30",
  },
  {
    icon: TrendingUp,
    acronym: "NIRF",
    fullName: "National Institutional Ranking Framework",
    description:
      "Official national rankings published by the Ministry of Education, evaluating institutions across research, teaching, and outcomes.",
    color: "text-indigo",
    bgColor: "bg-indigo/10",
    borderColor: "border-indigo/30",
  },
  {
    icon: GraduationCap,
    acronym: "TNEA",
    fullName: "Tamil Nadu Engineering Admissions",
    description:
      "Annual engineering admission cutoff data for Tamil Nadu colleges, reflecting real-time demand and competitive selectivity.",
    color: "text-[oklch(0.55_0.18_145)]",
    bgColor: "bg-[oklch(0.65_0.18_145/0.10)]",
    borderColor: "border-[oklch(0.65_0.18_145/0.30)]",
  },
];

export function DataSourcesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 bg-muted/40">
      <div
        ref={ref}
        className={`container mx-auto px-4 ${isVisible ? "section-visible" : "section-enter"}`}
      >
        {/* Header */}
        <div className="text-center mb-14">
          <div className="eyebrow-tag text-navy/60 mb-4 justify-center">
            Data Integrity
          </div>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-navy mb-4">
            Trusted <span className="text-gradient-primary">Data Sources</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
            The platform collects and analyzes information from reliable
            official sources to ensure accuracy and transparency.
          </p>
        </div>

        {/* Source Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SOURCES.map((source, i) => (
            <div
              key={source.acronym}
              data-ocid={`datasources.item.${i + 1}`}
              className={`group bg-white border-2 ${source.borderColor} rounded-2xl p-9 shadow-card hover:shadow-card-hover hover:-translate-y-2.5 transition-all duration-300`}
              style={{
                transitionDelay: `${i * 100}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(1.5rem)",
                transition: `all 0.6s ease ${i * 100}ms`,
              }}
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 ${source.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <source.icon className={`w-8 h-8 ${source.color}`} />
              </div>

              {/* Acronym Badge */}
              <span
                className={`inline-block font-heading text-3xl font-black ${source.color} mb-1`}
              >
                {source.acronym}
              </span>
              <p className="text-navy/60 text-xs font-medium mb-4 leading-tight">
                {source.fullName}
              </p>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {source.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional line */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-white border border-border rounded-full px-6 py-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-sm text-muted-foreground">
              All data is processed and presented in a{" "}
              <strong className="text-navy">
                structured analytical format
              </strong>{" "}
              to support better decision-making.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

