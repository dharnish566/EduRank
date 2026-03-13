import { BarChart3, ExternalLink } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Rankings", href: "#top-colleges" },
  { label: "College Finder", href: "#finder" },
  { label: "Compare Colleges", href: "#features" },
  { label: "Analytics Dashboard", href: "#analytics" },
  { label: "About", href: "#about" },
];

const DATA_LINKS = [
  { label: "NAAC Official Portal", href: "https://naac.gov.in" },
  { label: "NIRF Rankings", href: "https://www.nirfindia.org" },
  { label: "TNEA Admissions", href: "https://www.tneaonline.org" },
];

interface FooterProps {
  onNavigateToCompare?: () => void;
  onNavigateToAnalytics?: () => void;
  onNavigateToFinder?: () => void;
}

export function Footer({
  onNavigateToCompare,
  onNavigateToAnalytics,
  onNavigateToFinder,
}: FooterProps) {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  )}`;

  const handleNavClick = (
    href: string,
    isCompare?: boolean,
    isAnalytics?: boolean,
    isFinder?: boolean,
  ) => {
    if (isCompare && onNavigateToCompare) {
      onNavigateToCompare();
      return;
    }
    if (isAnalytics && onNavigateToAnalytics) {
      onNavigateToAnalytics();
      return;
    }
    if (isFinder && onNavigateToFinder) {
      onNavigateToFinder();
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // FIXED: "bg-navy" (undefined token) → explicit deep navy gradient matching HeroSection
    <footer
      className="text-white"
      style={{
        background: "linear-gradient(135deg, oklch(0.12 0.055 255) 0%, oklch(0.16 0.07 258) 100%)",
      }}
    >
      <div className="container mx-auto px-4 pt-14 pb-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">

          {/* Col 1: Logo + Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/* FIXED: "text-gold" (undefined token) → explicit oklch */}
              <BarChart3 className="w-6 h-6" style={{ color: "oklch(0.78 0.15 85)" }} />
              <span className="font-heading text-lg font-bold text-white">
                CollegeRank
              </span>
            </div>
            {/* "text-white/60" / "text-white/40" — standard Tailwind opacity, kept as-is */}
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              College Ranking Analytics Platform provides integrated academic
              ranking insights to support informed educational decisions.
            </p>
            <p className="text-white/40 text-xs">
              Data refreshed weekly from official government sources.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-heading text-sm font-bold text-white/80 uppercase tracking-widest mb-5">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link, i) => (
                <li key={link.href}>
                  <button
                    type="button"
                    data-ocid={
                      link.href === "#features"
                        ? "footer.compare_link"
                        : link.href === "#analytics"
                          ? "footer.analytics_link"
                          : link.href === "#finder"
                            ? "footer.finder_link"
                            : `footer.link.${i + 1}`
                    }
                    onClick={() =>
                      handleNavClick(
                        link.href,
                        link.href === "#features",
                        link.href === "#analytics",
                        link.href === "#finder",
                      )
                    }
                    // FIXED: "hover:text-gold" (undefined token) → explicit via mouse handlers
                    className="text-white/60 text-sm transition-colors duration-150 cursor-pointer"
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color = "oklch(0.78 0.15 85)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color = "")
                    }
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Data Sources */}
          <div>
            <h4 className="font-heading text-sm font-bold text-white/80 uppercase tracking-widest mb-5">
              Data Sources
            </h4>
            <ul className="flex flex-col gap-2.5">
              {DATA_LINKS.map((link) => (
                <li key={link.href}>
                  {/* FIXED: "hover:text-gold" (undefined token) → explicit via mouse handlers */}
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 text-sm transition-colors duration-150 inline-flex items-center gap-1.5"
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.78 0.15 85)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "")
                    }
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/40 text-xs leading-relaxed">
                Project developed using{" "}
                <span className="text-white/60 font-medium">MERN Stack</span>{" "}
                and{" "}
                <span className="text-white/60 font-medium">
                  Python Automation
                </span>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <p className="text-white/40 text-xs text-center sm:text-left">
            © {year} College Ranking Analytics Platform. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
}