import { Button } from "../ui/button";
import { ArrowRight, BarChart2, Database, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── types ────────────────────────────────────────────────────────────────────
interface HeroSectionProps {
  onNavigateToRankings?: () => void;
}

// ─── title word animation ─────────────────────────────────────────────────────
const TITLE_WORDS = ["Smart", "College", "Ranking", "Analytics", "Platform"];

// ─── stat cards data ──────────────────────────────────────────────────────────
const STATS = [
  {
    icon: BarChart2,
    countTo: 400  ,
    display: "1,200+",
    label: "Colleges Indexed",
    sub: "Across Tamil Nadu",
    animates: true,
    delay: 0,
  },
  {
    icon: Database,
    countTo: 3,
    display: "3",
    label: "Official Sources",
    sub: "NAAC · NIRF · TNEA",
    animates: true,
    delay: 120,
  },
  {
    icon: TrendingUp,
    countTo: null,
    display: "Live",
    label: "Real-time Analytics",
    sub: "Updated weekly",
    animates: false,
    delay: 240,
  },
];

// ─── animated number counter ──────────────────────────────────────────────────
function AnimatedNumber({
  target,
  suffix = "",
  play,
}: {
  target: number;
  suffix?: string;
  play: boolean;
}) {
  const [val, setVal] = useState(0);
  const raf   = useRef<number>(0);
  const t0    = useRef<number | null>(null);
  const DURATION = 1600;

  useEffect(() => {
    if (!play) return;
    t0.current = null;
    const step = (ts: number) => {
      if (!t0.current) t0.current = ts;
      const p = Math.min((ts - t0.current) / DURATION, 1);
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setVal(Math.round(e * target));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [play, target]);

  return <>{val.toLocaleString()}{suffix}</>;
}

// ─── component ────────────────────────────────────────────────────────────────
export function HeroSection({ onNavigateToRankings }: HeroSectionProps) {
  const [visibleWords, setVisibleWords] = useState(0);
  const [ready,        setReady]        = useState(false);
  const [statsPlay,    setStatsPlay]    = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready || visibleWords >= TITLE_WORDS.length) return;
    const t = setTimeout(() => setVisibleWords((v) => v + 1), 155);
    return () => clearTimeout(t);
  }, [ready, visibleWords]);

  const allVisible = visibleWords >= TITLE_WORDS.length;

  useEffect(() => {
    if (!allVisible) return;
    const t = setTimeout(() => setStatsPlay(true), 650);
    return () => clearTimeout(t);
  }, [allVisible]);

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <style>{`
        /* ── tokens ── */
        :root {
          --gold:        oklch(0.78 0.15 85);
          --gold-hi:     oklch(0.88 0.17 88);
          --gold-glow:   oklch(0.78 0.15 85 / 0.45);
          --navy-deep:   oklch(0.11 0.05 255);
          --navy-mid:    oklch(0.17 0.06 258);
          --about-bg:    oklch(0.97 0.012 258);
        }

        /* ── hero title ── */
        .hero-title {
          font-family: "Georgia", "Times New Roman", serif;
          font-weight: 800;
          line-height: 1.07;
          letter-spacing: -0.03em;
          color: #fff;
        }
        .text-gold-grad {
          background: linear-gradient(135deg, oklch(0.90 0.17 90) 0%, oklch(0.78 0.15 85) 45%, oklch(0.68 0.18 74) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 20px oklch(0.78 0.15 85 / 0.55));
        }

        /* ── eyebrow ── */
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 18px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--gold);
          background: oklch(0.78 0.15 85 / 0.10);
          border: 1px solid oklch(0.78 0.15 85 / 0.30);
        }
        .hero-eyebrow::before {
          content: "";
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 8px 2px var(--gold-glow);
          animation: orb 2s ease-in-out infinite;
        }
        @keyframes orb {
          0%,100% { opacity:1; transform:scale(1);   }
          50%      { opacity:.55; transform:scale(1.35); }
        }

        /* ── dot grid ── */
        .dot-grid {
          background-image: radial-gradient(circle, oklch(1 0 0 / 0.22) 1px, transparent 1px);
          background-size: 30px 30px;
        }

        /* ── hero entrance ── */
        @keyframes heroIn {
          from { opacity:0; transform:scale(1.045); }
          to   { opacity:1; transform:scale(1); }
        }

        /* ── gold glow pulse on primary btn ── */
        @keyframes goldPulse {
          0%,100% { box-shadow: 0 0 16px 4px oklch(0.78 0.15 85 / 0.50); }
          50%      { box-shadow: 0 0 32px 10px oklch(0.78 0.15 85 / 0.72); }
        }
        .btn-gold-pulse { animation: goldPulse 2.4s ease-in-out infinite; }

        /* ── stat card ── */
        .stat-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 22px;
          border-radius: 16px;
          /* solid opaque background — always readable */
          background: oklch(0.16 0.055 258 / 0.92);
          border: 1px solid oklch(1 0 0 / 0.14);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: transform 0.25s ease, border-color 0.25s ease;
          min-width: 200px;
          flex: 1;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: oklch(0.78 0.15 85 / 0.45);
        }
        .stat-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: linear-gradient(135deg, oklch(1 0 0 / 0.04) 0%, transparent 60%);
          pointer-events: none;
        }

        /* ── stat icon wrapper ── */
        .stat-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          background: oklch(0.78 0.15 85 / 0.14);
          border: 1px solid oklch(0.78 0.15 85 / 0.25);
        }

        /* ── stat number ── */
        .stat-num {
          font-family: "Georgia", serif;
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.03em;
          color: var(--gold-hi);
          display: block;
        }
        .stat-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: oklch(1 0 0 / 0.90);
          letter-spacing: 0.01em;
          margin-top: 2px;
        }
        .stat-sub {
          font-size: 0.72rem;
          color: oklch(1 0 0 / 0.45);
          margin-top: 1px;
        }

        /* ── stat card float ── */
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }
        .float-0 { animation: float 3.6s ease-in-out infinite; }
        .float-1 { animation: float 3.6s ease-in-out 0.6s infinite; }
        .float-2 { animation: float 3.6s ease-in-out 1.2s infinite; }

        /* ── stat card slide-in ── */
        @keyframes cardIn {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ── divider shimmer ── */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-line {
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            oklch(0.78 0.15 85 / 0.55) 40%,
            oklch(0.88 0.17 88 / 0.85) 50%,
            oklch(0.78 0.15 85 / 0.55) 60%,
            transparent 100%);
          background-size: 200% auto;
          animation: shimmer 3.5s linear infinite;
        }

        /* ── source pills ── */
        .source-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: oklch(1 0 0 / 0.65);
          background: oklch(1 0 0 / 0.07);
          border: 1px solid oklch(1 0 0 / 0.12);
        }
        .source-pill::before {
          content: "";
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--gold);
          opacity: 0.7;
        }
      `}</style>

      <section
        id="home"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* ── background image ─────────────────────────────────────────── */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/generated/hero-bg.dim_1920x1080.jpg')",
            animation: "heroIn 1.2s ease forwards",
          }}
        />

        {/* ── base navy overlay ─────────────────────────────────────────── */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              oklch(0.11 0.05 255 / 0.95)  0%,
              oklch(0.15 0.06 258 / 0.82) 40%,
              oklch(0.14 0.055 256 / 0.90) 70%,
              oklch(0.10 0.04 255 / 0.98) 100%
            )`,
          }}
        />

        {/* ── warm radial accent ────────────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 40%, oklch(0.78 0.15 85 / 0.09) 0%, oklch(0.45 0.18 265 / 0.13) 45%, transparent 68%)",
          }}
        />

        {/* ── top vignette ──────────────────────────────────────────────── */}
        <div
          className="absolute top-0 left-0 right-0 h-36 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, oklch(0.08 0.04 255 / 0.72) 0%, transparent 100%)" }}
        />

        {/* ── dot grid texture ──────────────────────────────────────────── */}
        <div className="absolute inset-0 dot-grid opacity-[0.09] pointer-events-none" />

        {/* ── bottom blend → AboutSection bg ───────────────────────────── */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "55%",
            background: `linear-gradient(
              to bottom,
              transparent                              0%,
              oklch(0.20 0.055 258 / 0.0)              2%,
              oklch(0.35 0.040 258 / 0.50)            36%,
              oklch(0.62 0.025 258 / 0.78)            62%,
              oklch(0.84 0.015 258 / 0.92)            80%,
              oklch(0.97 0.012 258)                  100%
            )`,
          }}
        />

        {/* ══ CONTENT ═══════════════════════════════════════════════════════ */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 flex flex-col items-center text-center gap-6 pt-28 pb-20">

          {/* eyebrow */}
          <div
            className="hero-eyebrow"
            style={{
              opacity:    ready ? 1 : 0,
              transform:  ready ? "translateY(0)" : "translateY(-8px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}
          >
            Data-driven insights for smarter college selection
          </div>

          {/* headline */}
          <h1
            className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] max-w-5xl"
            style={{ wordSpacing: "-0.02em" }}
          >
            {TITLE_WORDS.map((word, i) => (
              <span
                key={word}
                className="inline-block"
                style={{
                  marginRight: "0.22em",
                  opacity:    i < visibleWords ? 1 : 0,
                  transform:  i < visibleWords ? "translateY(0) scale(1)" : "translateY(0.45em) scale(0.96)",
                  transition: "opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                  transitionDelay: `${i * 50}ms`,
                }}
              >
                {i === 2 || i === 3
                  ? <span className="text-gold-grad">{word}</span>
                  : word
                }
              </span>
            ))}
          </h1>

          {/* subtitle */}
          <p
            className="text-lg md:text-xl max-w-2xl leading-relaxed"
            style={{
              color:      "oklch(1 0 0 / 0.76)",
              opacity:    allVisible ? 1 : 0,
              transform:  allVisible ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.6s ease 0.12s, transform 0.6s ease 0.12s",
            }}
          >
            Analyze, compare, and explore college rankings using integrated data from{" "}
            <strong style={{ color: "#fff", fontWeight: 700 }}>NAAC</strong>,{" "}
            <strong style={{ color: "#fff", fontWeight: 700 }}>NIRF</strong>, and{" "}
            <strong style={{ color: "#fff", fontWeight: 700 }}>TNEA</strong>{" "}
            — in one centralized platform.
          </p>

          {/* description */}
          <p
            className="text-sm md:text-base max-w-xl"
            style={{
              color:      "oklch(1 0 0 / 0.48)",
              opacity:    allVisible ? 1 : 0,
              transform:  allVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.6s ease 0.24s, transform 0.6s ease 0.24s",
            }}
          >
            Make informed academic decisions by exploring verified ranking
            metrics, cutoff trends, and detailed institutional insights.
          </p>

          {/* ── data source pills ─────────────────────────────────────────── */}
          <div
            className="flex flex-wrap items-center justify-center gap-2"
            style={{
              opacity:    allVisible ? 1 : 0,
              transform:  allVisible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.6s ease 0.32s, transform 0.6s ease 0.32s",
            }}
          >
            {["NAAC Accreditation", "NIRF Rankings", "TNEA Cutoffs"].map((s) => (
              <span key={s} className="source-pill">{s}</span>
            ))}
          </div>

          {/* ── CTAs — UNCHANGED ──────────────────────────────────────────── */}
          <div
            className="flex flex-col sm:flex-row gap-4 mt-2"
            style={{
              opacity:    allVisible ? 1 : 0,
              transform:  allVisible ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.65s ease 0.40s, transform 0.65s ease 0.40s",
            }}
          >
            {/* primary — gold */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-xl blur-xl"
                style={{ background: "oklch(0.78 0.15 85 / 0.42)", transform: "scale(1.15)" }}
              />
              <Button
                data-ocid="hero.primary_button"
                onClick={() => {
                  if (onNavigateToRankings) onNavigateToRankings();
                  else scrollTo("#top-colleges");
                }}
                size="lg"
                className="btn-gold-pulse relative font-bold text-base px-9 py-6 rounded-xl shadow-xl"
                style={{
                  background: "linear-gradient(135deg, oklch(0.86 0.17 88) 0%, oklch(0.76 0.16 82) 100%)",
                  color:  "oklch(0.12 0.04 255)",
                  border: "none",
                }}
              >
                🔎 Explore Rankings
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* secondary — ghost */}
            <Button
              data-ocid="hero.secondary_button"
              onClick={() => scrollTo("#analytics")}
              size="lg"
              variant="outline"
              className="font-bold text-base px-9 py-6 rounded-xl backdrop-blur-sm transition-all duration-300"
              style={{
                background:  "oklch(1 0 0 / 0.06)",
                border:      "1.5px solid oklch(1 0 0 / 0.35)",
                color:       "oklch(1 0 0 / 0.92)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background    = "oklch(1 0 0 / 0.12)";
                (e.currentTarget as HTMLButtonElement).style.borderColor   = "oklch(1 0 0 / 0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background    = "oklch(1 0 0 / 0.06)";
                (e.currentTarget as HTMLButtonElement).style.borderColor   = "oklch(1 0 0 / 0.35)";
              }}
            >
              📊 View Analytics Dashboard
            </Button>
          </div>

          {/* ── STAT CARDS ────────────────────────────────────────────────── */}
          {/* Solid opaque dark cards — always readable against any bg       */}
          <div
            className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
            style={{
              opacity:    allVisible ? 1 : 0,
              transition: "opacity 0.5s ease 0.55s",
            }}
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`stat-card float-${i}`}
                style={{
                  opacity:   statsPlay ? 1 : 0,
                  transform: statsPlay ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${stat.delay}ms,
                               transform 0.55s cubic-bezier(0.22,1,0.36,1) ${stat.delay}ms`,
                }}
              >
                {/* icon */}
                <div className="stat-icon">
                  <stat.icon style={{ width: 20, height: 20, color: "oklch(0.82 0.15 85)" }} />
                </div>

                {/* text */}
                <div>
                  <span className="stat-num">
                    {stat.animates && stat.countTo !== null
                      ? <AnimatedNumber
                          target={stat.countTo}
                          suffix={stat.countTo === 400 ? "+" : ""}
                          play={statsPlay}
                        />
                      : stat.display
                    }
                  </span>
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-sub">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </section>
    </>
  );
}