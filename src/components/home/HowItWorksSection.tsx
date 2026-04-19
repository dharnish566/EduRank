import { useScrollAnimation } from "../../hooks/useScrollAnimation";
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
    // FIXED: "bg-white" → explicit cool off-white matching the page's navy-tinted background tone
    <section className="py-20 relative overflow-hidden" style={{ background: "oklch(0.97 0.012 258)" }}>

      {/* Grid pattern overlay — kept identical */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div
        ref={ref}
        className={`container mx-auto px-4 relative z-10 ${isVisible ? "section-visible" : "section-enter"}`}
      >
        {/* Header */}
        <div className="text-center mb-16">
          {/* FIXED: "text-navy/60" + "justify-center" (undefined token) → explicit style */}
          <div
            className="eyebrow-tag mb-4"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "5px 14px",
              borderRadius: "999px",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "oklch(0.46 0.10 75)",
              background: "oklch(0.78 0.15 85 / 0.10)",
              border: "1px solid oklch(0.78 0.15 85 / 0.28)",
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "oklch(0.65 0.14 82)", flexShrink: 0, display: "inline-block" }} />
            Process
          </div>

          {/* FIXED: "text-navy" → explicit; "text-gradient-primary" → explicit indigo→gold gradient */}
          <h2
            className="heading-display text-4xl md:text-5xl lg:text-6xl mb-4"
            style={{ color: "oklch(0.18 0.07 258)" }}
          >
            How It{" "}
            <span
              style={{
                background: "linear-gradient(135deg, oklch(0.55 0.18 265) 0%, oklch(0.78 0.15 85) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Works
            </span>
          </h2>

          {/* FIXED: "text-muted-foreground" → explicit muted navy-grey */}
          <p className="max-w-xl mx-auto text-base md:text-lg" style={{ color: "oklch(0.52 0.04 258)" }}>
            From raw official data to actionable college insights — in four
            structured steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop — kept identical */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 z-0">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-indigo/40 to-transparent" />
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
                {/* Step icon circle */}
                <div className="relative mb-5">
                  {/* FIXED: "bg-navy" (undefined token) → explicit navy gradient;
                      "shadow-card-hover" (undefined token) → explicit shadow */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.14 0.07 258) 0%, oklch(0.22 0.08 258) 100%)",
                      boxShadow: "0 6px 20px oklch(0.16 0.07 258 / 0.30)",
                    }}
                  >
                    <step.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* FIXED: "bg-gold" (undefined token) → explicit gold matching HeroSection */}
                  <div
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: "oklch(0.78 0.15 85)",
                      boxShadow: "0 2px 8px oklch(0.78 0.15 85 / 0.40)",
                    }}
                  >
                    <span
                      className="text-xs font-black font-heading"
                      style={{ color: "oklch(0.16 0.05 255)" }}
                    >
                      {i + 1}
                    </span>
                  </div>
                </div>

                {/* FIXED: "text-navy" → explicit */}
                <h3
                  className="font-heading text-lg font-bold mb-2"
                  style={{ color: "oklch(0.18 0.07 258)" }}
                >
                  {step.title}
                </h3>

                {/* FIXED: "text-muted-foreground" → explicit */}
                <p
                  className="text-sm leading-relaxed max-w-[200px] mx-auto"
                  style={{ color: "oklch(0.52 0.04 258)" }}
                >
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