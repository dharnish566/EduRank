import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { CheckCircle2 } from "lucide-react";

const BENEFITS = [
  "Simplifies the college selection process by aggregating all critical data in one place.",
  "Provides data-driven insights instead of raw, hard-to-interpret information.",
  "Enables easy side-by-side comparison of multiple institutions.",
  "Saves time by integrating multiple ranking sources into a single platform.",
];

export function BenefitsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient background — kept identical, already uses explicit oklch */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.22_0.06_255)] via-[oklch(0.30_0.12_265)] to-[oklch(0.45_0.18_265)]" />

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
      {/* FIXED: "bg-gold/10" (undefined token) → explicit oklch gold */}
      <div
        className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-3xl"
        style={{ background: "oklch(0.78 0.15 85 / 0.10)" }}
      />
      <div className="absolute inset-0 grid-pattern opacity-10" />

      <div
        ref={ref}
        className={`container mx-auto px-4 relative z-10 ${isVisible ? "section-visible" : "section-enter"}`}
      >
        {/* Header */}
        <div className="text-center mb-14">
          {/* FIXED: "text-white/60" + "justify-center" → explicit style (eyebrow-tag is inline-flex) */}
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
            Why Choose us
          </div>

          {/* "text-white" — standard Tailwind, kept as-is */}
          {/* FIXED: "text-gradient-gold" (undefined token) → explicit gold gradient matching HeroSection */}
          <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            Benefits for{" "}
            <span
              style={{
                background: "linear-gradient(135deg, oklch(0.88 0.17 88) 0%, oklch(0.78 0.15 85) 50%, oklch(0.70 0.18 75) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 14px oklch(0.78 0.15 85 / 0.45))",
              }}
            >
              Students
            </span>
          </h2>

          {/* "text-white/65" — standard Tailwind opacity modifier, kept as-is */}
          <p className="text-white/65 max-w-xl mx-auto text-base">
            Designed with students and decision-makers in mind, the platform
            removes friction from the college research process.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {BENEFITS.map((benefit, i) => (
            <div
              key={benefit}
              data-ocid={`benefits.item.${i + 1}`}
              className="group flex items-start gap-4 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(1.5rem)",
                transition: `all 0.6s ease ${i * 100}ms`,
              }}
            >
              <div className="flex-shrink-0 mt-0.5">
                {/* FIXED: "text-gold" (undefined token) → explicit oklch gold */}
                <CheckCircle2
                  className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                  style={{ color: "oklch(0.78 0.15 85)" }}
                />
              </div>
              {/* "text-white/90" — standard Tailwind, kept as-is */}
              <p className="text-white/90 text-sm md:text-base leading-relaxed font-medium">
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}