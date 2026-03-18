// ─────────────────────────────────────────────────────────
//  src/components/layout/PageFooter.tsx
//  Extracted from: RankingsPage.tsx
//    → The <footer> block at the bottom of the page
//  JSX is 100% identical — no changes at all.
// ─────────────────────────────────────────────────────────

import { BarChart3 } from "lucide-react";

export function PageFooter() {
  return (
    <footer
      className="mt-16 py-8 border-t border-border"
      style={{ background: "oklch(0.975 0.005 258)" }}
    >
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo" />
          <span>College Ranking Analytics Platform</span>
        </div>
        <p>
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}