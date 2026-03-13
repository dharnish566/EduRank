import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const STATS = [
  { label: "Colleges Analyzed", value: "1,200+", color: "text-gold" },
  { label: "Data Sources", value: "3", color: "text-gold" },
  { label: "Rankings Updated", value: "Weekly", color: "text-gold" },
];

export function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    // FIXED: "bg-muted/40" (undefined token) → explicit cool off-white matching section theme
    <section id="about" className="py-20" style={{ background: "oklch(0.97 0.012 258)" }} data-ocid="about.section">
      <div
        ref={ref}
        className={`container mx-auto px-4 ${isVisible ? "section-visible" : "section-enter"}`}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left: Text */}
          <div>
            {/* FIXED: "text-indigo" (undefined token) → explicit oklch indigo with bg/border */}
            <div
              className="eyebrow-tag mb-4"
              style={{
                display: "inline-flex",
                color: "oklch(0.55 0.18 265)",
                background: "oklch(0.55 0.18 265 / 0.08)",
                border: "1px solid oklch(0.55 0.18 265 / 0.25)",
              }}
            >
              About the Platform
            </div>

            {/* FIXED: "text-navy" → explicit; "text-gradient-primary" → explicit indigo→gold */}
            <h2
              className="heading-display text-4xl md:text-5xl lg:text-6xl mb-6"
              style={{ color: "oklch(0.18 0.07 258)" }}
            >
              Why College Ranking{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, oklch(0.55 0.18 265) 0%, oklch(0.78 0.15 85) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Analytics?
              </span>
            </h2>

            {/* FIXED: "text-muted-foreground" (×2) → explicit */}
            <p className="text-base md:text-lg leading-relaxed mb-4" style={{ color: "oklch(0.52 0.04 258)" }}>
              Choosing the right college is a critical decision for students.
              However, ranking information is often scattered across multiple
              official sources such as NAAC accreditation reports, NIRF
              rankings, and TNEA admission cutoffs.
            </p>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: "oklch(0.52 0.04 258)" }}>
              This platform integrates these metrics into a unified system and
              provides analytical tools that help users{" "}
              {/* FIXED: "text-navy" on <strong> → explicit */}
              <strong style={{ color: "oklch(0.18 0.07 258)" }}>compare colleges</strong>,{" "}
              <strong style={{ color: "oklch(0.18 0.07 258)" }}>analyze rankings</strong>, and
              understand institutional performance — all in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {["NAAC Integrated", "NIRF Rankings", "TNEA Cutoffs", "Smart Analytics"].map((tag) => (
                <span
                  key={tag}
                  // FIXED: "border-border" / "text-navy" / "bg-indigo" dot (all undefined tokens) → explicit
                  className="inline-flex items-center gap-1.5 bg-white text-sm font-medium px-3 py-1 rounded-full"
                  style={{
                    border: "1px solid oklch(0.88 0.02 258)",
                    color: "oklch(0.18 0.07 258)",
                    boxShadow: "0 1px 3px oklch(0 0 0 / 0.06)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "oklch(0.55 0.18 265)" }}
                  />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Stats Card */}
          <div className="relative">
            {/* FIXED: "bg-indigo/8" / "bg-gold/12" (undefined tokens) → explicit oklch */}
            <div
              className="absolute -top-4 -right-4 w-48 h-48 rounded-full blur-3xl"
              style={{ background: "oklch(0.55 0.18 265 / 0.08)" }}
            />
            <div
              className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full blur-2xl"
              style={{ background: "oklch(0.78 0.15 85 / 0.12)" }}
            />

            {/* FIXED: "bg-navy" / "shadow-card-deep" (undefined tokens) → explicit gradient + shadow */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, oklch(0.14 0.07 258) 0%, oklch(0.22 0.08 258) 100%)",
                boxShadow: "0 8px 40px oklch(0.16 0.07 258 / 0.38), 0 2px 8px oklch(0 0 0 / 0.12)",
              }}
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-white/10">
                <p className="text-white/60 text-sm font-medium uppercase tracking-wider">
                  Platform Overview
                </p>
                <h3 className="text-white font-heading text-xl font-bold mt-1">
                  Data at a Glance
                </h3>
              </div>

              {/* Stats */}
              <div className="px-8 py-6 flex flex-col gap-5">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* FIXED: "bg-indigo/60" (undefined token) → explicit */}
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: "oklch(0.55 0.18 265 / 0.70)" }}
                      />
                      <span className="text-white/75 text-sm font-medium">
                        {stat.label}
                      </span>
                    </div>
                    {/* FIXED: "text-gold" (undefined token) → explicit oklch gold */}
                    <span
                      className="font-heading text-2xl font-bold"
                      style={{ color: "oklch(0.78 0.15 85)" }}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom accent — kept identical, uses standard opacity utilities */}
              <div className="px-8 py-4 bg-white/5 text-white/50 text-xs text-center">
                Data refreshed weekly from official sources
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}