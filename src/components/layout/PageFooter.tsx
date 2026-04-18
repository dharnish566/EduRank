import { BarChart3 } from "lucide-react";

export function PageFooter() {
  return (
    <footer
      className="py-6"
      style={{
        background: "oklch(0.16 0.055 258)",
        borderTop: "1px solid oklch(1 0 0 / 0.08)",
      }}
    >
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Left — brand */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "oklch(0.80 0.16 86 / 0.15)", border: "0.5px solid oklch(0.80 0.16 86 / 0.25)" }}
          >
            <BarChart3 className="w-3.5 h-3.5" style={{ color: "oklch(0.80 0.16 86)" }} />
          </div>
          <span
            className="text-sm font-semibold tracking-wide"
            style={{ color: "oklch(0.90 0.04 265)" }}
          >
            College Ranking Analytics
          </span>
        </div>

        {/* Center — tagline */}
        <p
          className="text-xs text-center"
          style={{ color: "oklch(0.55 0.05 265)" }}
        >
          Powered by NAAC · NIRF · TNEA data
        </p>

        {/* Right — copyright */}
        <p
          className="text-xs"
          style={{ color: "oklch(0.50 0.04 265)" }}
        >
          © {new Date().getFullYear()} All rights reserved.
        </p>

      </div>
    </footer>
  );
}