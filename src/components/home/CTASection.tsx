import { Button } from "../ui/button";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { Sparkles } from "lucide-react";

interface CTASectionProps {
  onNavigateToRankings?: () => void;
  onNavigateToCompare?: () => void;
}

export function CTASection({
  onNavigateToRankings,
  onNavigateToCompare,
}: CTASectionProps) {
  const { ref, isVisible } = useScrollAnimation();

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // FIXED: "bg-muted/40" (undefined token) → explicit cool off-white matching section theme
    <section className="py-20" style={{ background: "oklch(0.97 0.012 258)" }}>
      <div
        ref={ref}
        className={`container mx-auto px-4 ${isVisible ? "section-visible" : "section-enter"}`}
      >
        {/* FIXED: "border-border" / "shadow-card" (undefined tokens) → explicit values */}
        <div
          className="max-w-2xl mx-auto bg-white rounded-2xl p-10 text-center relative overflow-hidden"
          style={{
            border: "1.5px solid oklch(0.88 0.02 258)",
            boxShadow: "0 4px 24px oklch(0 0 0 / 0.07), 0 1px 4px oklch(0 0 0 / 0.04)",
          }}
        >
          {/* Decorative bg elements */}
          {/* FIXED: "bg-indigo/6" / "bg-gold/8" (undefined tokens) → explicit oklch */}
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl"
            style={{ background: "oklch(0.55 0.18 265 / 0.06)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl"
            style={{ background: "oklch(0.78 0.15 85 / 0.08)" }}
          />

          <div className="relative z-10">
            {/* FIXED: "bg-navy/8" / "text-navy" (undefined tokens) → explicit oklch */}
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
              style={{ background: "oklch(0.22 0.08 258 / 0.08)" }}
            >
              <Sparkles className="w-7 h-7" style={{ color: "oklch(0.22 0.08 258)" }} />
            </div>

            {/* FIXED: "text-navy" → explicit; "text-gradient-primary" → explicit indigo→gold gradient */}
            <h2
              className="heading-display text-4xl md:text-5xl mb-4"
              style={{ color: "oklch(0.18 0.07 258)" }}
            >
              Start Exploring{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, oklch(0.55 0.18 265) 0%, oklch(0.78 0.15 85) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                College Rankings
              </span>
            </h2>

            {/* FIXED: "text-muted-foreground" → explicit */}
            <p
              className="text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto"
              style={{ color: "oklch(0.52 0.04 258)" }}
            >
              Discover top institutions, compare performance metrics, and
              analyze academic insights through a centralized ranking platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* FIXED: "bg-navy" / "hover:bg-navy/90" → explicit gradient + hover handler */}
              <Button
                data-ocid="cta.primary_button"
                onClick={() => {
                  if (onNavigateToRankings) onNavigateToRankings();
                  else scrollTo("#top-colleges");
                }}
                size="lg"
                className="text-white font-bold px-8"
                style={{
                  background: "linear-gradient(135deg, oklch(0.14 0.07 258) 0%, oklch(0.22 0.08 258) 100%)",
                  boxShadow: "0 4px 16px oklch(0.16 0.07 258 / 0.28)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "linear-gradient(135deg, oklch(0.22 0.08 258) 0%, oklch(0.28 0.09 258) 100%)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "linear-gradient(135deg, oklch(0.14 0.07 258) 0%, oklch(0.22 0.08 258) 100%)")
                }
              >
                Explore Colleges
              </Button>

              {/* FIXED: "border-navy" / "text-navy" / "hover:bg-navy/5" → explicit oklch */}
              <Button
                data-ocid="cta.secondary_button"
                onClick={() => {
                  if (onNavigateToCompare) onNavigateToCompare();
                  else scrollTo("#features");
                }}
                size="lg"
                variant="outline"
                className="font-bold px-8"
                style={{
                  border: "2px solid oklch(0.22 0.08 258)",
                  color: "oklch(0.22 0.08 258)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "oklch(0.22 0.08 258 / 0.05)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "transparent";
                }}
              >
                Compare Colleges
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}