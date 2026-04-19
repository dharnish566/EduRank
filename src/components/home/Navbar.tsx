import { Button } from "../ui/button";
import { BarChart3, Menu, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface NavLink {
  label: string;
  href: string;
  isRankings?: boolean;
  isCompare?: boolean;
  isAnalytics?: boolean;
  isFinder?: boolean;
}

const navLinks: NavLink[] = [
  { label: "Home",               href: "#home" },
  { label: "Rankings",           href: "#top-colleges", isRankings: true },
  { label: "College Finder",     href: "#finder",       isFinder: true },
  { label: "Compare Colleges",   href: "#features",     isCompare: true },
  { label: "Analytics Dashboard",href: "#analytics",    isAnalytics: true },
  { label: "About",              href: "#about" },
];

interface NavbarProps {
  onNavigateToRankings?: () => void;
  onNavigateToCompare?:  () => void;
  onNavigateToAnalytics?: () => void;
  onNavigateToFinder?:   () => void;
}

// ─── scroll direction hook ────────────────────────────────────────────────────
function useScrollState() {
  const [scrolled,   setScrolled]   = useState(false);   // past threshold
  const [hidden,     setHidden]     = useState(false);   // scrolling down → hide
  const [atTop,      setAtTop]      = useState(true);    // exactly at top
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      setAtTop(y < 8);
      setScrolled(y > 20);

      // hide on scroll-down, reveal on scroll-up
      if (y > lastY.current + 6 && y > 80) {
        setHidden(true);
      } else if (y < lastY.current - 4) {
        setHidden(false);
      }
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { scrolled, hidden, atTop };
}

export function Navbar({
  onNavigateToRankings,
  onNavigateToCompare,
  onNavigateToAnalytics,
  onNavigateToFinder,
}: NavbarProps) {
  const { scrolled, hidden, atTop } = useScrollState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");

  // track active section via IntersectionObserver
  useEffect(() => {
    const sections = navLinks.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
    if (!sections.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveLink(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const handleNavClick = (link: NavLink) => {
    setMobileOpen(false);
    setActiveLink(link.href);

    if (link.isRankings  && onNavigateToRankings)  { onNavigateToRankings();  return; }
    if (link.isCompare   && onNavigateToCompare)   { onNavigateToCompare();   return; }
    if (link.isAnalytics && onNavigateToAnalytics) { onNavigateToAnalytics(); return; }
    if (link.isFinder    && onNavigateToFinder)    { onNavigateToFinder();    return; }

    document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
  };

  // ── derived style tokens ────────────────────────────────────────────────────
  const isTransparent = atTop && !mobileOpen;

  const headerBase = [
    "fixed top-0 left-0 right-0 z-50",
    "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
    hidden ? "-translate-y-full" : "translate-y-0",
  ].join(" ");

  const headerBg = isTransparent
    ? "bg-transparent"
    : "bg-white/[0.97] backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.06),0_4px_24px_-4px_rgba(0,0,0,0.08)]";

  const logoColor  = isTransparent ? "text-white"                      : "text-navy";
  const linkColor  = isTransparent ? "text-white/80 hover:text-white"  : "text-foreground/70 hover:text-navy";

  return (
    <header className={`${headerBase} ${headerBg}`}>

      {/* ── progress bar ──────────────────────────────────────────────────── */}
      <ScrollProgressBar />

      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNavClick(navLinks[0])}
          className={`
            flex items-center gap-2 font-heading font-bold text-xl
            transition-all duration-300 hover:opacity-80 active:scale-95
            ${logoColor}
          `}
        >
          <span
            className={`
              p-1 rounded-lg transition-all duration-300
              ${isTransparent ? "bg-white/15" : "bg-indigo/10"}
            `}
          >
            <BarChart3 className={`w-5 h-5 ${isTransparent ? "text-white" : "text-indigo"}`} />
          </span>
          <span>EduRank</span>
        </button>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link, i) => {
            const isActive = activeLink === link.href;
            return (
              <li key={link.href} className="relative">
                <button
                  type="button"
                  data-ocid={
                    link.isCompare   ? "nav.compare_link"   :
                    link.isAnalytics ? "nav.analytics_link" :
                    link.isFinder    ? "nav.finder_link"    :
                    `nav.link.${i + 1}`
                  }
                  onClick={() => handleNavClick(link)}
                  className={`
                    relative px-3.5 py-2 text-sm font-medium rounded-lg
                    transition-all duration-200 outline-none
                    focus-visible:ring-2 focus-visible:ring-indigo/40
                    ${isActive
                      ? isTransparent
                        ? "text-white bg-white/15"
                        : "text-navy bg-navy/8"
                      : `${linkColor} hover:bg-black/5`
                    }
                  `}
                >
                  {link.label}

                  {/* active dot indicator */}
                  {isActive && (
                    <span
                      className={`
                        absolute -bottom-0.5 left-1/2 -translate-x-1/2
                        w-1 h-1 rounded-full
                        transition-all duration-300
                        ${isTransparent ? "bg-white" : "bg-indigo"}
                      `}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            data-ocid="nav.primary_button"
            onClick={() => onNavigateToRankings ? onNavigateToRankings() : handleNavClick(navLinks[1])}
            className={`
              relative overflow-hidden font-semibold text-sm px-5
              transition-all duration-200 active:scale-95
              ${isTransparent
                ? "bg-white text-navy hover:bg-white/90 shadow-lg shadow-black/10"
                : "bg-gold text-foreground hover:brightness-95"
              }
            `}
          >
            Explore Rankings
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className={`
            md:hidden p-2 rounded-lg transition-all duration-200
            active:scale-95
            ${isTransparent
              ? "text-white hover:bg-white/10"
              : "text-foreground hover:bg-muted"
            }
          `}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span
            className="block transition-all duration-300"
            style={{ transform: mobileOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            {mobileOpen
              ? <X    className="w-5 h-5" />
              : <Menu className="w-5 h-5" />
            }
          </span>
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`
          md:hidden overflow-hidden
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"}
          bg-white border-b border-border shadow-lg
        `}
      >
        <ul className="container mx-auto px-4 py-3 flex flex-col gap-0.5">
          {navLinks.map((link, i) => {
            const isActive = activeLink === link.href;
            return (
              <li key={link.href}>
                <button
                  type="button"
                  data-ocid={
                    link.isCompare   ? "nav.compare_link"   :
                    link.isAnalytics ? "nav.analytics_link" :
                    link.isFinder    ? "nav.finder_link"    :
                    `nav.link.${i + 1}`
                  }
                  onClick={() => handleNavClick(link)}
                  className={`
                    w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg
                    transition-all duration-150 flex items-center gap-2.5
                    ${isActive
                      ? "text-navy bg-navy/6 font-semibold"
                      : "text-foreground hover:text-navy hover:bg-muted"
                    }
                  `}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo flex-shrink-0" />
                  )}
                  {link.label}
                </button>
              </li>
            );
          })}
          <li className="pt-2 pb-1">
            <Button
              data-ocid="nav.primary_button"
              onClick={() => {
                setMobileOpen(false);
                onNavigateToRankings ? onNavigateToRankings() : handleNavClick(navLinks[1]);
              }}
              className="w-full bg-gold text-foreground hover:brightness-95 font-semibold active:scale-98"
            >
              Explore Rankings
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}

// ── Thin scroll progress bar at very top of navbar ───────────────────────────
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const pct = scrollHeight - clientHeight > 0
        ? (scrollTop / (scrollHeight - clientHeight)) * 100
        : 0;
      setProgress(pct);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (progress <= 0) return null;

  return (
    <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden z-10">
      <div
        className="h-full transition-[width] duration-100 ease-linear"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, oklch(0.55 0.18 265), oklch(0.78 0.15 85))",
        }}
      />
    </div>
  );
}