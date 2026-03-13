import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import {
  BarChart2,
  BookOpen,
  Filter,
  GitCompare,
  GitMerge,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: GitMerge,
    title: "Unified Ranking System",
    description:
      "Combines NAAC scores, NIRF rankings, and TNEA cutoff trends into a centralized ranking model for easy comparison across institutions.",
  },
  {
    icon: Filter,
    title: "Smart Filtering & Sorting",
    description:
      "Filter colleges based on city, accreditation score, ranking order, or cutoff trends to find your ideal match quickly.",
  },
  {
    icon: GitCompare,
    title: "College Comparison",
    description:
      "Compare multiple colleges side-by-side to analyze their strengths, rankings, and admission statistics in a clear format.",
  },
  {
    icon: BookOpen,
    title: "Detailed College Profiles",
    description:
      "Each college page provides complete information including accreditation scores, ranking data, and admission cutoff details.",
  },
  {
    icon: BarChart2,
    title: "Interactive Analytics Dashboard",
    description:
      "Visual dashboards help users understand ranking trends and institutional performance through dynamic charts and visualizations.",
  },
];

export function FeaturesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    // FIXED: "bg-white" → explicit cool off-white matching section theme
    <section id="features" className="py-20" style={{ background: "oklch(0.97 0.012 258)" }}>
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
            Platform Capabilities
          </div>

          {/* FIXED: "text-navy" → explicit; "text-gradient-primary" → explicit indigo→gold */}
          <h2
            className="heading-display text-4xl md:text-5xl lg:text-6xl mb-4"
            style={{ color: "oklch(0.18 0.07 258)" }}
          >
            Core Features of the{" "}
            <span
              style={{
                background: "linear-gradient(135deg, oklch(0.55 0.18 265) 0%, oklch(0.78 0.15 85) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Platform
            </span>
          </h2>

          {/* FIXED: "text-muted-foreground" → explicit */}
          <p className="max-w-xl mx-auto text-base md:text-lg" style={{ color: "oklch(0.52 0.04 258)" }}>
            Everything you need to make a well-informed college decision — in
            one unified system.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              data-ocid={`features.item.${i + 1}`}
              // FIXED: "border-border" / "shadow-card" / "hover:shadow-card-hover" /
              //        "hover:border-indigo/40" (all undefined tokens) → explicit style + mouse handlers
              className="group relative bg-white rounded-xl p-7"
              style={{
                border: "1.5px solid oklch(0.88 0.02 258)",
                boxShadow: "0 1px 6px oklch(0 0 0 / 0.06)",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(1.5rem)",
                transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms, border-color 0.3s, box-shadow 0.3s`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "oklch(0.55 0.18 265 / 0.40)";
                el.style.boxShadow = "0 8px 28px oklch(0.55 0.18 265 / 0.12), 0 2px 8px oklch(0 0 0 / 0.06)";
                el.style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "oklch(0.88 0.02 258)";
                el.style.boxShadow = "0 1px 6px oklch(0 0 0 / 0.06)";
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Icon — FIXED: "bg-indigo/10" / "group-hover:bg-indigo/15" / "text-indigo" → explicit */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                style={{ background: "oklch(0.55 0.18 265 / 0.10)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background = "oklch(0.55 0.18 265 / 0.16)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background = "oklch(0.55 0.18 265 / 0.10)")
                }
              >
                <feature.icon className="w-6 h-6" style={{ color: "oklch(0.55 0.18 265)" }} />
              </div>

              {/* Step number — FIXED: "text-muted-foreground/40" → explicit */}
              <span
                className="absolute top-5 right-5 text-xs font-bold font-heading"
                style={{ color: "oklch(0.60 0.04 258 / 0.40)" }}
              >
                0{i + 1}
              </span>

              {/* Title — FIXED: "text-navy" / "group-hover:text-indigo" → explicit + mouse handler */}
              <h3
                className="font-heading text-lg font-bold mb-2 transition-colors duration-200"
                style={{ color: "oklch(0.18 0.07 258)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "oklch(0.55 0.18 265)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "oklch(0.18 0.07 258)")
                }
              >
                {feature.title}
              </h3>

              {/* Description — FIXED: "text-muted-foreground" → explicit */}
              <p className="text-sm leading-relaxed" style={{ color: "oklch(0.52 0.04 258)" }}>
                {feature.description}
              </p>

              {/* Bottom accent line — FIXED: "bg-indigo/0" / "group-hover:bg-indigo/30" → explicit via mouse handler */}
              <div
                className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full transition-all duration-300"
                style={{ background: "oklch(0.55 0.18 265 / 0)" }}
                ref={(el) => {
                  if (!el) return;
                  const card = el.closest(".group") as HTMLDivElement | null;
                  if (!card) return;
                  const show = () => (el.style.background = "oklch(0.55 0.18 265 / 0.30)");
                  const hide = () => (el.style.background = "oklch(0.55 0.18 265 / 0)");
                  card.addEventListener("mouseenter", show);
                  card.addEventListener("mouseleave", hide);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}