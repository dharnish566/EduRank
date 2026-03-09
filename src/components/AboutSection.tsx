import { useScrollAnimation } from "../hooks/useScrollAnimation";

const STATS = [
  { label: "Colleges Analyzed", value: "1,200+", color: "text-gold" },
  { label: "Data Sources", value: "3", color: "text-gold" },
  { label: "Rankings Updated", value: "Weekly", color: "text-gold" },
];

export function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-20 bg-muted/40" data-ocid="about.section">
      <div
        ref={ref}
        className={`container mx-auto px-4 ${isVisible ? "section-visible" : "section-enter"}`}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <div className="eyebrow-tag text-indigo mb-4">
              About the Platform
            </div>
            <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-navy mb-6">
              Why College Ranking{" "}
              <span className="text-gradient-primary">Analytics?</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
              Choosing the right college is a critical decision for students.
              However, ranking information is often scattered across multiple
              official sources such as NAAC accreditation reports, NIRF
              rankings, and TNEA admission cutoffs.
            </p>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              This platform integrates these metrics into a unified system and
              provides analytical tools that help users{" "}
              <strong className="text-navy">compare colleges</strong>,{" "}
              <strong className="text-navy">analyze rankings</strong>, and
              understand institutional performance — all in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "NAAC Integrated",
                "NIRF Rankings",
                "TNEA Cutoffs",
                "Smart Analytics",
              ].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 bg-white border border-border text-navy text-sm font-medium px-3 py-1 rounded-full shadow-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Stats Card */}
          <div className="relative">
            {/* Decorative background accent */}
            <div className="absolute -top-4 -right-4 w-48 h-48 rounded-full bg-indigo/8 blur-3xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-gold/12 blur-2xl" />

            <div className="relative bg-navy rounded-2xl overflow-hidden shadow-card-deep">
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
                {STATS.map((stat, _i) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo/60 flex-shrink-0" />
                      <span className="text-white/75 text-sm font-medium">
                        {stat.label}
                      </span>
                    </div>
                    <span
                      className={`font-heading text-2xl font-bold ${stat.color}`}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom accent */}
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
