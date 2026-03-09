import { useScrollAnimation } from "../hooks/useScrollAnimation";
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
    <section id="features" className="py-20 bg-white">
      <div
        ref={ref}
        className={`container mx-auto px-4 ${isVisible ? "section-visible" : "section-enter"}`}
      >
        {/* Header */}
        <div className="text-center mb-14">
          <div className="eyebrow-tag text-navy/60 mb-4 justify-center">
            Platform Capabilities
          </div>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-navy mb-4">
            Core Features of the{" "}
            <span className="text-gradient-primary">Platform</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
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
              className="group relative bg-white border border-border rounded-xl p-7 shadow-card hover:shadow-card-hover hover:-translate-y-2 hover:border-indigo/40 transition-all duration-300"
              style={{
                transitionDelay: `${i * 80}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(1.5rem)",
                transition: `all 0.6s ease ${i * 80}ms`,
              }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-indigo/10 group-hover:bg-indigo/15 flex items-center justify-center mb-4 transition-colors">
                <feature.icon className="w-6 h-6 text-indigo" />
              </div>

              {/* Step number */}
              <span className="absolute top-5 right-5 text-xs font-bold text-muted-foreground/40 font-heading">
                0{i + 1}
              </span>

              <h3 className="font-heading text-lg font-bold text-navy mb-2 group-hover:text-indigo transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-indigo/0 group-hover:bg-indigo/30 rounded-full transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
