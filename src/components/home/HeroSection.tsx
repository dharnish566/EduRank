import { Button } from "../ui/button";
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
    <>
      <style>{`
        :root {
          --gold: oklch(0.78 0.15 85);
          --gold-soft: oklch(0.82 0.13 85);
          --gold-glow: oklch(0.78 0.15 85 / 0.45);
          --navy-deep: oklch(0.12 0.055 255);
          --navy-mid: oklch(0.18 0.06 258);
          --navy-light: oklch(0.22 0.06 258);
          --white-high: oklch(1 0 0);
          --white-mid: oklch(1 0 0 / 0.75);
          --white-low: oklch(1 0 0 / 0.50);
          --white-subtle: oklch(1 0 0 / 0.08);
          --white-border: oklch(1 0 0 / 0.18);
        }

        /* Eyebrow badge */
        .eyebrow-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 1.1rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--gold);
          background: oklch(0.78 0.15 85 / 0.12);
          border: 1px solid oklch(0.78 0.15 85 / 0.35);
          backdrop-filter: blur(8px);
        }

        .eyebrow-tag::before {
          content: "";
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 6px 2px var(--gold-glow);
          animation: pulseOrb 2s ease-in-out infinite;
        }

        @keyframes pulseOrb {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }

        /* Hero title */
        .hero-title {
          font-family: "Georgia", "Times New Roman", serif;
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: var(--white-high);
        }

        /* Gold gradient text */
        .text-gradient-gold {
          background: linear-gradient(
            135deg,
            oklch(0.88 0.17 88) 0%,
            oklch(0.78 0.15 85) 40%,
            oklch(0.70 0.18 75) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 18px oklch(0.78 0.15 85 / 0.5));
        }

        /* Word highlight wrapper */
        .word-highlight {
          position: relative;
          display: inline-block;
        }

        /* Dot-grid pattern */
        .grid-pattern {
          background-image: radial-gradient(circle, oklch(1 0 0 / 0.25) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* Stat badge float animations */
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float          { animation: floatBadge 3.2s ease-in-out infinite; }
        .animate-float-delay-1  { animation: floatBadge 3.2s ease-in-out 0.55s infinite; }
        .animate-float-delay-2  { animation: floatBadge 3.2s ease-in-out 1.1s infinite; }

        /* Hero background entrance */
        @keyframes hero-entrance {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* Gold pulse glow on primary button */
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 18px 4px oklch(0.78 0.15 85 / 0.55); }
          50%       { box-shadow: 0 0 34px 10px oklch(0.78 0.15 85 / 0.75); }
        }
        .animate-pulse-glow { animation: pulseGlow 2.4s ease-in-out infinite; }

        /* Scroll indicator pulse */
        @keyframes scrollPulse {
          0%   { transform: translateY(-100%); opacity: 1; }
          80%  { transform: translateY(260%);  opacity: 0.3; }
          100% { transform: translateY(260%);  opacity: 0; }
        }

        /* Divider shimmer at bottom */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-line {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            oklch(0.78 0.15 85 / 0.6) 40%,
            oklch(0.88 0.17 88 / 0.9) 50%,
            oklch(0.78 0.15 85 / 0.6) 60%,
            transparent 100%
          );
          background-size: 200% auto;
          animation: shimmer 3.5s linear infinite;
        }
      `}</style>

      <section
        id="home"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* ── Background image ── */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/generated/hero-bg.dim_1920x1080.jpg')",
            animation: "hero-entrance 1.2s ease forwards",
          }}
        />

        {/* ── Multi-stop deep navy overlay ── */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              oklch(0.12 0.055 255 / 0.94) 0%,
              oklch(0.16 0.06 258 / 0.80) 35%,
              oklch(0.16 0.055 255 / 0.88) 65%,
              oklch(0.10 0.04 255 / 0.98) 100%
            )`,
          }}
        />

        {/* ── Radial gold accent at center ── */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 55% at 50% 42%, oklch(0.78 0.15 85 / 0.10) 0%, oklch(0.45 0.18 265 / 0.14) 40%, transparent 70%)",
          }}
        />

        {/* ── Top vignette ── */}
        <div
          className="absolute top-0 left-0 right-0 h-32"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.08 0.04 255 / 0.7) 0%, transparent 100%)",
          }}
        />

        {/* ── Decorative dot grid ── */}
        <div className="absolute inset-0 grid-pattern opacity-10" />

        {/* ── Content ── */}
        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center gap-5 pt-24">

          {/* Eyebrow badge */}
          <div
            className="eyebrow-tag mb-1"
            style={{
              opacity: contentReady ? 1 : 0,
              transition: "opacity 0.8s ease 0.1s",
            }}
          >
            Data-driven insights for smarter college selection
          </div>

          {/* ── Animated Display Title ── */}
          <h1
            className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] max-w-5xl mx-auto"
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
                    <span className="word-highlight text-gradient-gold">{word}</span>
                  ) : (
                    word
                  )}
                </span>
              );
            })}
          </h1>

          {/* ── Subtitle ── */}
          <p
            className="text-lg md:text-xl max-w-2xl leading-relaxed mt-1"
            style={{
              color: "oklch(1 0 0 / 0.78)",
              opacity: allWordsVisible ? 1 : 0,
              transform: allWordsVisible ? "translateY(0)" : "translateY(1rem)",
              transition: "all 0.65s cubic-bezier(0.22,1,0.36,1) 0.15s",
            }}
          >
            Analyze, compare, and explore college rankings using integrated data
            from{" "}
            <strong style={{ color: "oklch(1 0 0)", fontWeight: 700 }}>NAAC</strong>,{" "}
            <strong style={{ color: "oklch(1 0 0)", fontWeight: 700 }}>NIRF</strong>, and{" "}
            <strong style={{ color: "oklch(1 0 0)", fontWeight: 700 }}>TNEA</strong>{" "}
            — in one centralized platform.
          </p>

          {/* ── Short description ── */}
          <p
            className="text-sm md:text-base max-w-xl"
            style={{
              color: "oklch(1 0 0 / 0.52)",
              opacity: allWordsVisible ? 1 : 0,
              transform: allWordsVisible ? "translateY(0)" : "translateY(0.75rem)",
              transition: "all 0.65s cubic-bezier(0.22,1,0.36,1) 0.28s",
            }}
          >
            Make informed academic decisions by exploring verified ranking
            metrics, cutoff trends, and detailed institutional insights.
          </p>

          {/* ── CTA Buttons ── */}
          <div
            className="flex flex-col sm:flex-row gap-4 mt-4"
            style={{
              opacity: allWordsVisible ? 1 : 0,
              transform: allWordsVisible ? "translateY(0)" : "translateY(1rem)",
              transition: "all 0.65s cubic-bezier(0.22,1,0.36,1) 0.42s",
            }}
          >
            {/* Primary — gold glow */}
            <div className="relative">
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
                className="animate-pulse-glow relative font-bold text-base px-9 py-6 rounded-xl shadow-xl"
                style={{
                  background: "linear-gradient(135deg, oklch(0.86 0.17 88) 0%, oklch(0.76 0.16 82) 100%)",
                  color: "oklch(0.12 0.04 255)",
                  border: "none",
                }}
              >
                🔎 Explore Rankings
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Secondary — ghost outline */}
            <Button
              data-ocid="hero.secondary_button"
              onClick={() => scrollTo("#analytics")}
              size="lg"
              variant="outline"
              className="font-bold text-base px-9 py-6 rounded-xl backdrop-blur-sm transition-all duration-300"
              style={{
                background: "oklch(1 0 0 / 0.06)",
                border: "1.5px solid oklch(1 0 0 / 0.35)",
                color: "oklch(1 0 0 / 0.92)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "oklch(1 0 0 / 0.12)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "oklch(1 0 0 / 0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "oklch(1 0 0 / 0.06)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "oklch(1 0 0 / 0.35)";
              }}
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
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold ${
                  i === 0
                    ? "animate-float"
                    : i === 1
                      ? "animate-float-delay-1"
                      : "animate-float-delay-2"
                }`}
                style={{
                  background: "oklch(1 0 0 / 0.07)",
                  border: "1px solid oklch(1 0 0 / 0.18)",
                  backdropFilter: "blur(14px)",
                  color: "oklch(1 0 0 / 0.88)",
                }}
              >
                <stat.icon
                  className="w-4 h-4 "
                  style={{ color: "oklch(0.82 0.15 85)" }}
                />
                {stat.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Shimmer divider at bottom ── */}
        <div
          className="absolute bottom-0 left-0 right-0 shimmer-line"
          style={{ opacity: allWordsVisible ? 1 : 0, transition: "opacity 1s ease 1.2s" }}
        />

        {/* ── Scroll indicator ── */}
        {/* <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          style={{
            opacity: allWordsVisible ? 0.55 : 0,
            transition: "opacity 1s ease 1s",
          }}
        >
          <span
            className="text-[10px] font-bold tracking-[0.22em] uppercase"
            style={{ color: "oklch(1 0 0 / 0.55)" }}
          >
            Scroll
          </span>
          <div
            className="w-px h-10 overflow-hidden rounded"
            style={{ background: "oklch(1 0 0 / 0.15)" }}
          >
            <div
              className="w-full rounded"
              style={{
                height: "40%",
                background: "oklch(0.82 0.15 85)",
                animation: "scrollPulse 1.8s ease-in-out infinite",
              }}
            />
          </div>
        </div> */}
      </section>
    </>
  );
}