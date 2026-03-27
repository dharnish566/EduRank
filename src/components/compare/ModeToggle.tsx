import { motion } from "motion/react";
import { BarChart3, Trophy } from "lucide-react";
import { T } from "../../utils/compareTokens";

export type ComparisonMode = "overall" | "naac";

interface ModeToggleProps {
  mode: ComparisonMode;
  onChange: (mode: ComparisonMode) => void;
}

const OPTIONS: { value: ComparisonMode; label: string; icon: React.ReactNode }[] = [
  {
    value: "overall",
    label: "Overall",
    icon: <BarChart3 className="w-3.5 h-3.5" />,
  },
  {
    value: "naac",
    label: "NAAC",
    icon: <Trophy className="w-3.5 h-3.5" />,
  },
];

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      className="relative flex items-center rounded-lg p-0.5"
      style={{
        background: `oklch(0.14 0.04 258 / 0.06)`,
        border: `1px solid ${T.border}`,
      }}
    >
      {OPTIONS.map((opt) => {
        const isActive = mode === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[11px] font-semibold z-10 transition-colors duration-150 focus:outline-none select-none"
            style={{ color: isActive ? "#fff" : T.muted }}
          >
            {isActive && (
              <motion.span
                layoutId="mode-toggle-bg"
                className="absolute inset-0 rounded-md"
                style={{
                  background:
                    opt.value === "naac"
                      ? `linear-gradient(135deg, ${T.indigo}, ${T.gold})`
                      : `linear-gradient(135deg, ${T.navy}, ${T.indigo})`,
                  boxShadow: `0 1px 6px ${T.indigo}55`,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {opt.icon}
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}