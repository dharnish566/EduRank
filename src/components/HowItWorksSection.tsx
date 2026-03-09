import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { Cpu, Database, Globe, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    icon: Globe,
    title: "Data Collection",
    description:
      "Data is collected from official portals including NAAC, NIRF, and TNEA using automated scraping techniques.",
  },
  {
    icon: Database,
    title: "Data Processing",
    description:
      "Collected data is cleaned, normalized, and stored in a structured database for consistent analysis.",
  },
  {
    icon: Cpu,
    title: "Ranking Algorithm",
    description:
      "A weighted ranking algorithm combines multiple ranking parameters to generate a unified composite score.",
  },
  {
    icon: Users,
    title: "User Exploration",
    description:
      "Users explore rankings, compare colleges, and analyze insights through interactive dashboards.",
  },
];

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div
        ref={ref}
        className={`container mx-auto px-4 relative z-10 ${isVisible ? "section-visible" : "section-enter"}`}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <div className="eyebrow-tag text-navy/60 mb-4 justify-center">
            Process
          </div>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-navy mb-4">
            How It <span className="text-gradient-primary">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
            From raw official data to actionable college insights — in four
            structured steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 z-0">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-indigo/40 to-transparent" />
            {/* Dashed animated line */}
            <svg
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              aria-hidden="true"
              role="presentation"
            >
              <line
                x1="0"
                y1="1"
                x2="100%"
                y2="1"
                stroke="oklch(0.45 0.18 265 / 0.4)"
                strokeWidth="2"
                strokeDasharray="8 6"
                style={{ animation: "dash-flow 1s linear infinite" }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                data-ocid={`howworks.item.${i + 1}`}
                className="flex flex-col items-center text-center"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(1.5rem)",
                  transition: `all 0.6s ease ${i * 120}ms`,
                }}
              >
                {/* Step number circle */}
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center shadow-card-hover">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                    <span className="text-[oklch(0.16_0.05_255)] text-xs font-black font-heading">
                      {i + 1}
                    </span>
                  </div>
                </div>

                <h3 className="font-heading text-lg font-bold text-navy mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[200px] mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
