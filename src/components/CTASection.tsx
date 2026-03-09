import { Button } from "../components/ui/button";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
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
    <section className="py-20 bg-muted/40">
      <div
        ref={ref}
        className={`container mx-auto px-4 ${isVisible ? "section-visible" : "section-enter"}`}
      >
        <div className="max-w-2xl mx-auto bg-white border border-border rounded-2xl p-10 shadow-card text-center relative overflow-hidden">
          {/* Decorative bg elements */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-indigo/6 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-gold/8 blur-2xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy/8 mb-6">
              <Sparkles className="w-7 h-7 text-navy" />
            </div>

            <h2 className="heading-display text-4xl md:text-5xl text-navy mb-4">
              Start Exploring{" "}
              <span className="text-gradient-primary">College Rankings</span>
            </h2>

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
              Discover top institutions, compare performance metrics, and
              analyze academic insights through a centralized ranking platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                data-ocid="cta.primary_button"
                onClick={() => {
                  if (onNavigateToRankings) onNavigateToRankings();
                  else scrollTo("#top-colleges");
                }}
                size="lg"
                className="bg-navy text-white hover:bg-navy/90 font-bold px-8"
              >
                Explore Colleges
              </Button>
              <Button
                data-ocid="cta.secondary_button"
                onClick={() => {
                  if (onNavigateToCompare) onNavigateToCompare();
                  else scrollTo("#features");
                }}
                size="lg"
                variant="outline"
                className="border-2 border-navy text-navy hover:bg-navy/5 font-bold px-8"
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
