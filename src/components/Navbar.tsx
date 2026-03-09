import { Button } from "../components/ui/button";
import { BarChart3, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

interface NavLink {
  label: string;
  href: string;
  isRankings?: boolean;
  isCompare?: boolean;
  isAnalytics?: boolean;
  isFinder?: boolean;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Rankings", href: "#top-colleges", isRankings: true },
  { label: "College Finder", href: "#finder", isFinder: true },
  { label: "Compare Colleges", href: "#features", isCompare: true },
  { label: "Analytics Dashboard", href: "#analytics", isAnalytics: true },
  { label: "About", href: "#about" },
];

interface NavbarProps {
  onNavigateToRankings?: () => void;
  onNavigateToCompare?: () => void;
  onNavigateToAnalytics?: () => void;
  onNavigateToFinder?: () => void;
}

export function Navbar({
  onNavigateToRankings,
  onNavigateToCompare,
  onNavigateToAnalytics,
  onNavigateToFinder,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (link: NavLink) => {
    setMobileOpen(false);
    if (link.isRankings && onNavigateToRankings) {
      onNavigateToRankings();
      return;
    }
    if (link.isCompare && onNavigateToCompare) {
      onNavigateToCompare();
      return;
    }
    if (link.isAnalytics && onNavigateToAnalytics) {
      onNavigateToAnalytics();
      return;
    }
    if (link.isFinder && onNavigateToFinder) {
      onNavigateToFinder();
      return;
    }
    const el = document.querySelector(link.href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNavClick(navLinks[0])}
          className="flex items-center gap-2 font-heading font-bold text-xl text-navy hover:opacity-80 transition-opacity"
        >
          <BarChart3 className="w-6 h-6 text-indigo" />
          <span>CollegeRank</span>
        </button>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <button
                type="button"
                data-ocid={
                  link.isCompare
                    ? "nav.compare_link"
                    : link.isAnalytics
                      ? "nav.analytics_link"
                      : link.isFinder
                        ? "nav.finder_link"
                        : `nav.link.${i + 1}`
                }
                onClick={() => handleNavClick(link)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  scrolled
                    ? "text-foreground hover:text-navy hover:bg-muted"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex">
          <Button
            data-ocid="nav.primary_button"
            onClick={() => {
              if (onNavigateToRankings) onNavigateToRankings();
              else handleNavClick(navLinks[1]);
            }}
            className="bg-gold text-foreground hover:brightness-95 font-semibold text-sm px-5"
          >
            Explore Rankings
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className={`md:hidden p-2 rounded-md transition-colors ${
            scrolled ? "text-foreground" : "text-white"
          }`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-border shadow-lg">
          <ul className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <button
                  type="button"
                  data-ocid={
                    link.isCompare
                      ? "nav.compare_link"
                      : link.isAnalytics
                        ? "nav.analytics_link"
                        : link.isFinder
                          ? "nav.finder_link"
                          : `nav.link.${i + 1}`
                  }
                  onClick={() => handleNavClick(link)}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-foreground hover:text-navy hover:bg-muted rounded-md transition-colors"
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li className="pt-2 pb-1">
              <Button
                data-ocid="nav.primary_button"
                onClick={() => {
                  setMobileOpen(false);
                  if (onNavigateToRankings) onNavigateToRankings();
                  else handleNavClick(navLinks[1]);
                }}
                className="w-full bg-gold text-foreground hover:brightness-95 font-semibold"
              >
                Explore Rankings
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
