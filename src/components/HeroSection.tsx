import { Button } from "../components/ui/button";
import { ArrowRight, BarChart2, Database, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const TITLE_WORDS = ["Smart", "College", "Ranking", "Analytics", "Platform"];

const STATS = [
  { icon: BarChart2, label: "1000+ Colleges" },
  { icon: Database, label: "3 Data Sources" },
  { icon: TrendingUp, label: "Real-time Analytics" },
];

interface HeroSectionProps {
  onNavigateToRankings?: () => void;
}

export function HeroSection({ onNavigateToRankings }: HeroSectionProps) {
  const [visibleWords, setVisibleWords] = useState(0);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    // Small delay before starting animation so page assets settle
    const initDelay = setTimeout(() => setContentReady(true), 200);
    return () => clearTimeout(initDelay);
  }, []);

  useEffect(() => {
    if (!contentReady) return;
    if (visibleWords < TITLE_WORDS.length) {
      const timeout = setTimeout(() => {
        setVisibleWords((v) => v + 1);
      }, 160);
      return () => clearTimeout(timeout);
    }
  }, [visibleWords, contentReady]);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const allWordsVisible = visibleWords >= TITLE_WORDS.length;

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/generated/hero-bg.dim_1920x1080.jpg')",
          animation: "hero-entrance 1.2s ease forwards",
        }}
      />
      {/* Multi-stop overlay for depth: dark top, slightly less dark middle, dark bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            oklch(0.12 0.055 255 / 0.92) 0%,
            oklch(0.18 0.06 258 / 0.78) 40%,
            oklch(0.16 0.055 255 / 0.88) 70%,
            oklch(0.10 0.04 255 / 0.97) 100%
          )`,
        }}
      />
      {/* Subtle radial light source at center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 42%, oklch(0.45 0.18 265 / 0.18) 0%, transparent 65%)",
        }}
      />
      {/* Decorative dot grid */}
      <div className="absolute inset-0 grid-pattern opacity-15" />

      {/* ── Content ── */}
      <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center gap-5 pt-24">
        {/* Eyebrow badge */}
        <div
          className="eyebrow-tag text-gold/90 mb-1"
          style={{
            opacity: contentReady ? 1 : 0,
            transition: "opacity 0.8s ease 0.1s",
          }}
        >
          Data-driven insights for smarter college selection
        </div>

        {/* ── Animated Display Title ── */}
        <h1
          className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] text-white max-w-5xl mx-auto"
          style={{ wordSpacing: "-0.02em" }}
        >
          {TITLE_WORDS.map((word, i) => {
            const isGold = i === 2 || i === 3;
            return (
              <span
                key={word}
                className="inline-block"
                style={{
                  marginRight: "0.22em",
                  opacity: i < visibleWords ? 1 : 0,
                  transform:
                    i < visibleWords
                      ? "translateY(0) scale(1)"
                      : "translateY(0.5em) scale(0.97)",
                  transition:
                    "opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                  transitionDelay: `${i * 55}ms`,
                }}
              >
                {isGold ? (
                  <span className="word-highlight text-gradient-gold">
                    {word}
                  </span>
                ) : (
                  word
                )}
              </span>
            );
          })}
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg md:text-xl text-white/75 max-w-2xl leading-relaxed mt-1"
          style={{
            opacity: allWordsVisible ? 1 : 0,
            transform: allWordsVisible ? "translateY(0)" : "translateY(1rem)",
            transition: "all 0.65s cubic-bezier(0.22,1,0.36,1) 0.15s",
          }}
        >
          Analyze, compare, and explore college rankings using integrated data
          from <strong className="text-white font-semibold">NAAC</strong>,{" "}
          <strong className="text-white font-semibold">NIRF</strong>, and{" "}
          <strong className="text-white font-semibold">TNEA</strong> — in one
          centralized platform.
        </p>

        {/* Short description */}
        <p
          className="text-sm md:text-base text-white/50 max-w-xl"
          style={{
            opacity: allWordsVisible ? 1 : 0,
            transform: allWordsVisible
              ? "translateY(0)"
              : "translateY(0.75rem)",
            transition: "all 0.65s cubic-bezier(0.22,1,0.36,1) 0.28s",
          }}
        >
          Make informed academic decisions by exploring verified ranking
          metrics, cutoff trends, and detailed institutional insights.
        </p>

        {/* ── CTA Buttons ── */}
        <div
          className="flex flex-col sm:flex-row gap-4 mt-3"
          style={{
            opacity: allWordsVisible ? 1 : 0,
            transform: allWordsVisible ? "translateY(0)" : "translateY(1rem)",
            transition: "all 0.65s cubic-bezier(0.22,1,0.36,1) 0.42s",
          }}
        >
          {/* Primary — gold glow */}
          <div className="relative">
            {/* Glow halo behind button */}
            <div
              className="absolute inset-0 rounded-xl blur-xl"
              style={{
                background: "oklch(0.78 0.15 85 / 0.45)",
                transform: "scale(1.15)",
              }}
            />
            <Button
              data-ocid="hero.primary_button"
              onClick={() => {
                if (onNavigateToRankings) onNavigateToRankings();
                else scrollTo("#top-colleges");
              }}
              size="lg"
              className="relative bg-amber-300 text-[oklch(0.12_0.04_255)] hover:brightness-105 font-bold text-base px-9 py-6 shadow-xl animate-pulse-glow rounded-xl"
            >
              🔎 Explore Rankings
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <Button
            data-ocid="hero.secondary_button"
            onClick={() => scrollTo("#analytics")}
            size="lg"
            variant="outline"
            className="border-2 border-white/40 text-white bg-white/8 hover:bg-white/15 hover:border-white/60 backdrop-blur-sm font-bold text-base px-9 py-6 rounded-xl transition-all duration-300"
          >
            📊 View Analytics Dashboard
          </Button>
        </div>

        {/* ── Floating Stat Badges ── */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mt-12"
          style={{
            opacity: allWordsVisible ? 1 : 0,
            transition: "all 0.65s cubic-bezier(0.22,1,0.36,1) 0.58s",
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold text-white ${
                i === 0
                  ? "animate-float"
                  : i === 1
                    ? "animate-float-delay-1"
                    : "animate-float-delay-2"
              }`}
              style={{
                background: "oklch(1 0 0 / 0.08)",
                border: "1px solid oklch(1 0 0 / 0.18)",
                backdropFilter: "blur(12px)",
              }}
            >
              <stat.icon className="w-4 h-4 text-gold" />
              {stat.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{
          opacity: allWordsVisible ? 0.5 : 0,
          transition: "opacity 1s ease 1s",
        }}
      >
        <span className="text-white text-[10px] font-semibold tracking-[0.2em] uppercase">
          Scroll
        </span>
        <div
          className="w-px h-10 overflow-hidden"
          style={{ background: "oklch(1 0 0 / 0.2)" }}
        >
          <div
            className="w-full bg-gold rounded"
            style={{
              height: "40%",
              animation: "scrollPulse 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Inline keyframe for scroll pulse (avoids adding to global CSS) */}
      <style>{`
        @keyframes scrollPulse {
          0%   { transform: translateY(-100%); opacity: 1; }
          80%  { transform: translateY(260%); opacity: 0.3; }
          100% { transform: translateY(260%); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
