import { Button } from "../components/ui/button";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Chart 1: NIRF Ranking Distribution by City
const nirfByCity = [
  { city: "Chennai", colleges: 45 },
  { city: "Coimbatore", colleges: 32 },
  { city: "Trichy", colleges: 18 },
  { city: "Madurai", colleges: 15 },
  { city: "Others", colleges: 22 },
];

// Chart 2: NAAC Grade Distribution
const naacDistribution = [
  { name: "A++", value: 5 },
  { name: "A+", value: 25 },
  { name: "A", value: 40 },
  { name: "B++", value: 20 },
  { name: "Others", value: 10 },
];
const PIE_COLORS = [
  "oklch(0.78 0.15 85)",
  "oklch(0.65 0.18 145)",
  "oklch(0.45 0.18 265)",
  "oklch(0.22 0.06 255)",
  "oklch(0.65 0.08 255)",
];

// Chart 3: Cutoff Trends 2019-2024
const cutoffTrends = [
  { year: "2019", CS: 198, ECE: 185, Mech: 172 },
  { year: "2020", CS: 195, ECE: 182, Mech: 168 },
  { year: "2021", CS: 200, ECE: 186, Mech: 165 },
  { year: "2022", CS: 196, ECE: 184, Mech: 170 },
  { year: "2023", CS: 199, ECE: 187, Mech: 168 },
  { year: "2024", CS: 197, ECE: 183, Mech: 166 },
];

// Chart 4: City-wise Average NIRF Score
const cityNirf = [
  { city: "Chennai", avg: 78 },
  { city: "Coimbatore", avg: 71 },
  { city: "Trichy", avg: 65 },
  { city: "Madurai", avg: 58 },
];

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "oklch(1 0 0)",
  border: "1px solid oklch(0.88 0.01 255)",
  borderRadius: "8px",
  fontSize: "12px",
};

interface AnalyticsPreviewSectionProps {
  onNavigateToAnalytics?: () => void;
}

export function AnalyticsPreviewSection({
  onNavigateToAnalytics,
}: AnalyticsPreviewSectionProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="analytics" className="py-20 bg-white">
      <div
        ref={ref}
        className={`container mx-auto px-4 ${isVisible ? "section-visible" : "section-enter"}`}
      >
        {/* Header */}
        <div className="text-center mb-14">
          <div className="eyebrow-tag text-indigo mb-4 justify-center">
            Analytics
          </div>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-navy mb-4">
            Data-Driven <span className="text-gradient-primary">Insights</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
            The analytics dashboard presents institutional data in a visual
            format to help users understand trends and performance at a glance.
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart 1 */}
          <div
            data-ocid="analytics.chart.1"
            className="bg-white border border-border rounded-xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(1.5rem)",
              transition: "all 0.6s ease 0ms",
            }}
          >
            <h3 className="font-heading text-base font-bold text-navy mb-1">
              Colleges by City
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              NIRF-ranked institutions distribution
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={nirfByCity}
                margin={{ top: 0, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.93 0.01 255)"
                />
                <XAxis
                  dataKey="city"
                  tick={{ fontSize: 11, fill: "oklch(0.45 0.04 255)" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.45 0.04 255)" }} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar
                  dataKey="colleges"
                  fill="oklch(0.45 0.18 265)"
                  radius={[4, 4, 0, 0]}
                  name="Colleges"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2 */}
          <div
            data-ocid="analytics.chart.2"
            className="bg-white border border-border rounded-xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(1.5rem)",
              transition: "all 0.6s ease 100ms",
            }}
          >
            <h3 className="font-heading text-base font-bold text-navy mb-1">
              NAAC Grade Distribution
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Proportion of colleges per grade band
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={naacDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {naacDistribution.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={(value) => [`${value}%`, "Share"]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 3 */}
          <div
            data-ocid="analytics.chart.3"
            className="bg-white border border-border rounded-xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(1.5rem)",
              transition: "all 0.6s ease 200ms",
            }}
          >
            <h3 className="font-heading text-base font-bold text-navy mb-1">
              Cutoff Trends 2019–2024
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Branch-wise cutoff marks over time
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={cutoffTrends}
                margin={{ top: 0, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.93 0.01 255)"
                />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "oklch(0.45 0.04 255)" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "oklch(0.45 0.04 255)" }}
                  domain={[155, 205]}
                />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px" }}
                />
                <Line
                  type="monotone"
                  dataKey="CS"
                  stroke="oklch(0.45 0.18 265)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="ECE"
                  stroke="oklch(0.78 0.15 85)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Mech"
                  stroke="oklch(0.65 0.18 145)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 4 */}
          <div
            data-ocid="analytics.chart.4"
            className="bg-white border border-border rounded-xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(1.5rem)",
              transition: "all 0.6s ease 300ms",
            }}
          >
            <h3 className="font-heading text-base font-bold text-navy mb-1">
              City-wise Average NIRF Score
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Mean composite performance score by city
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={cityNirf}
                margin={{ top: 0, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.93 0.01 255)"
                />
                <XAxis
                  dataKey="city"
                  tick={{ fontSize: 11, fill: "oklch(0.45 0.04 255)" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "oklch(0.45 0.04 255)" }}
                  domain={[40, 90]}
                />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar
                  dataKey="avg"
                  fill="oklch(0.78 0.15 85)"
                  radius={[4, 4, 0, 0]}
                  name="Avg Score"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            data-ocid="analytics.primary_button"
            size="lg"
            onClick={() => onNavigateToAnalytics?.()}
            className="bg-navy text-white hover:bg-navy/90 font-semibold px-8"
          >
            Open Analytics Dashboard
          </Button>
        </div>
      </div>
    </section>
  );
}
