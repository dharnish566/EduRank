import { useScrollAnimation } from "../hooks/useScrollAnimation";
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
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.22_0.06_255)] via-[oklch(0.30_0.12_265)] to-[oklch(0.45_0.18_265)]" />
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute inset-0 grid-pattern opacity-10" />

      <div
        ref={ref}
        className={`container mx-auto px-4 relative z-10 ${isVisible ? "section-visible" : "section-enter"}`}
      >
        {/* Header */}
        <div className="text-center mb-14">
          <div className="eyebrow-tag text-white/60 mb-4 justify-center">
            Why Choose Us
          </div>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            Benefits for <span className="text-gradient-gold">Students</span>
          </h2>
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
                <CheckCircle2 className="w-6 h-6 text-gold group-hover:scale-110 transition-transform duration-200" />
              </div>
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
