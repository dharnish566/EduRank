import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { Award, GraduationCap, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DataSource {
  icon: LucideIcon;
  acronym: string;
  fullName: string;
  description: string;
  // CHANGED: color/bgColor/borderColor now hold explicit oklch values instead of Tailwind token strings
  color: string;
  bgColor: string;
  borderColor: string;
  hoverBorderColor: string;
  hoverShadow: string;
}

const SOURCES: DataSource[] = [
  {
    icon: Award,
    acronym: "NAAC",
    fullName: "National Assessment and Accreditation Council",
    description:
      "Accreditation grades and quality scores assigned to higher education institutions across India based on comprehensive evaluation criteria.",
    // FIXED: "text-gold" / "bg-gold/10" / "border-gold/30" → explicit oklch
    color: "oklch(0.78 0.15 85)",
    bgColor: "oklch(0.78 0.15 85 / 0.10)",
    borderColor: "oklch(0.78 0.15 85 / 0.30)",
    hoverBorderColor: "oklch(0.78 0.15 85 / 0.55)",
    hoverShadow: "0 10px 32px oklch(0.78 0.15 85 / 0.14), 0 2px 8px oklch(0 0 0 / 0.06)",
  },
  {
    icon: TrendingUp,
    acronym: "NIRF",
    fullName: "National Institutional Ranking Framework",
    description:
      "Official national rankings published by the Ministry of Education, evaluating institutions across research, teaching, and outcomes.",
    // FIXED: "text-indigo" / "bg-indigo/10" / "border-indigo/30" → explicit oklch
    color: "oklch(0.55 0.18 265)",
    bgColor: "oklch(0.55 0.18 265 / 0.10)",
    borderColor: "oklch(0.55 0.18 265 / 0.30)",
    hoverBorderColor: "oklch(0.55 0.18 265 / 0.55)",
    hoverShadow: "0 10px 32px oklch(0.55 0.18 265 / 0.14), 0 2px 8px oklch(0 0 0 / 0.06)",
  },
  {
    icon: GraduationCap,
    acronym: "TNEA",
    fullName: "Tamil Nadu Engineering Admissions",
    description:
      "Annual engineering admission cutoff data for Tamil Nadu colleges, reflecting real-time demand and competitive selectivity.",
    // Already used explicit oklch in original — kept identical values
    color: "oklch(0.55 0.18 145)",
    bgColor: "oklch(0.65 0.18 145 / 0.10)",
    borderColor: "oklch(0.65 0.18 145 / 0.30)",
    hoverBorderColor: "oklch(0.65 0.18 145 / 0.55)",
    hoverShadow: "0 10px 32px oklch(0.65 0.18 145 / 0.12), 0 2px 8px oklch(0 0 0 / 0.06)",
  },
];

export function DataSourcesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    // FIXED: "bg-muted/40" → explicit cool off-white matching section theme
    <section className="py-20" style={{ background: "oklch(0.97 0.012 258)" }}>
      <div
        ref={ref}
        className={`container mx-auto px-4 ${isVisible ? "section-visible" : "section-enter"}`}
      >
        {/* Header */}
        <div className="text-center mb-14">
          {/* FIXED: "text-navy/60" + "justify-center" → explicit style */}
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
            Data Integrity
          </div>

          {/* FIXED: "text-navy" → explicit; "text-gradient-primary" → explicit indigo→gold */}
          <h2
            className="heading-display text-4xl md:text-5xl lg:text-6xl mb-4"
            style={{ color: "oklch(0.18 0.07 258)" }}
          >
            Trusted{" "}
            <span
              style={{
                background: "linear-gradient(135deg, oklch(0.55 0.18 265) 0%, oklch(0.78 0.15 85) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Data Sources
            </span>
          </h2>

          {/* FIXED: "text-muted-foreground" → explicit */}
          <p className="max-w-xl mx-auto text-base md:text-lg" style={{ color: "oklch(0.52 0.04 258)" }}>
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
              // FIXED: "border-2 ${source.borderColor}" / "shadow-card" / "hover:shadow-card-hover"
              //        / "hover:-translate-y-2.5" → explicit style + mouse handlers
              className="group bg-white rounded-2xl p-9"
              style={{
                border: `2px solid ${source.borderColor}`,
                boxShadow: "0 1px 6px oklch(0 0 0 / 0.06)",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(1.5rem)",
                transition: `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms, border-color 0.3s, box-shadow 0.3s`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = source.hoverBorderColor;
                el.style.boxShadow = source.hoverShadow;
                el.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = source.borderColor;
                el.style.boxShadow = "0 1px 6px oklch(0 0 0 / 0.06)";
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Icon — FIXED: "${source.bgColor}" className string → explicit style */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{ background: source.bgColor }}
              >
                {/* FIXED: "${source.color}" className string → explicit style */}
                <source.icon className="w-8 h-8" style={{ color: source.color }} />
              </div>

              {/* Acronym Badge — FIXED: "${source.color}" className → explicit style */}
              <span
                className="inline-block font-heading text-3xl font-black mb-1"
                style={{ color: source.color }}
              >
                {source.acronym}
              </span>

              {/* FIXED: "text-navy/60" → explicit */}
              <p className="text-xs font-medium mb-4 leading-tight" style={{ color: "oklch(0.22 0.08 258 / 0.60)" }}>
                {source.fullName}
              </p>

              {/* FIXED: "text-muted-foreground" → explicit */}
              <p className="text-sm leading-relaxed" style={{ color: "oklch(0.52 0.04 258)" }}>
                {source.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional line */}
        <div className="mt-12 text-center">
          {/* FIXED: "border-border" / "shadow-xs" / "text-muted-foreground" / "text-navy" → explicit */}
          <div
            className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3"
            style={{
              border: "1px solid oklch(0.88 0.02 258)",
              boxShadow: "0 1px 4px oklch(0 0 0 / 0.06)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            <p className="text-sm" style={{ color: "oklch(0.52 0.04 258)" }}>
              All data is processed and presented in a{" "}
              <strong style={{ color: "oklch(0.18 0.07 258)" }}>
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