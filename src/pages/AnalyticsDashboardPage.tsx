import { useState, useMemo, useEffect } from "react";
import { apiUrl } from "../utils/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartTooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell,
  LineChart, Line, AreaChart, Area,
  PieChart, Pie,
} from "recharts";


/* ─── Font + Global CSS ──────────────────────────────────────────────────────────────── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #F8FAFC; }
    .dash-root { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: #F8FAFC; color: #0F172A; min-height: 100vh; }
    .dash-root ::-webkit-scrollbar { width: 5px; height: 5px; }
    .dash-root ::-webkit-scrollbar-track { background: #F1F5F9; }
    .dash-root ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }

    @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulseRing { 0%,100% { box-shadow:0 0 0 0 rgba(30,58,138,.3); } 50% { box-shadow:0 0 0 7px rgba(30,58,138,0); } }
    @keyframes slideRight { from { width:0%; } to { width:var(--tw); } }
    @keyframes spin { to { transform: rotate(360deg); } }

    .anim-0 { animation: fadeUp .5s ease both; animation-delay:.00s; }
    .anim-1 { animation: fadeUp .5s ease both; animation-delay:.07s; }
    .anim-2 { animation: fadeUp .5s ease both; animation-delay:.14s; }
    .anim-3 { animation: fadeUp .5s ease both; animation-delay:.21s; }
    .anim-4 { animation: fadeUp .5s ease both; animation-delay:.28s; }
    .anim-5 { animation: fadeUp .5s ease both; animation-delay:.35s; }
    .anim-6 { animation: fadeUp .5s ease both; animation-delay:.42s; }
    .anim-7 { animation: fadeUp .5s ease both; animation-delay:.49s; }

    .g-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 20px; padding: 24px;
      box-shadow: 0 1px 6px rgba(0,0,0,0.05);
      transition: box-shadow .2s, transform .2s; overflow: hidden;
    }
    .g-card:hover { box-shadow: 0 12px 36px rgba(30,58,138,0.13); transform: translateY(-3px); }

    .kpi-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0; border-radius: 18px; padding: 22px 24px;
      position: relative; overflow: hidden; cursor: default;
      box-shadow: 0 1px 6px rgba(0,0,0,0.05);
      transition: box-shadow .3s, transform .3s;
    }
    .kpi-card::before { content:''; position:absolute; top:0; left:0; width:100%; height:3px; background:var(--ka,linear-gradient(90deg,#1E3A8A,#2563EB)); }
    .kpi-card:hover { box-shadow: 0 12px 36px rgba(30,58,138,0.13); transform: translateY(-4px); }

    .fchip {
      padding: 5px 14px; border-radius: 99px; font-size: 11px; font-weight: 700;
      cursor: pointer; border: 1.5px solid #E2E8F0;
      background: #F8FAFC; color: #64748B;
      transition: all .18s; white-space: nowrap; font-family: 'Plus Jakarta Sans',system-ui,sans-serif;
    }
    .fchip:hover { background: #EFF6FF; color: #1E3A8A; border-color: #BFDBFE; }
    .fchip.on    { background: #1E3A8A; border-color: #1E3A8A; color: #FFFFFF; }

    .rhov { transition: background .15s; }
    .rhov:hover { background: #F8FAFC !important; }

    .pb { height:100%; border-radius:99px; animation: slideRight 1.1s cubic-bezier(.22,.68,0,1.2) both; }

    .ins-card { padding:13px 15px; border-radius:12px; display:flex; align-items:flex-start; gap:11px; transition:transform .2s; }
    .ins-card:hover { transform:translateX(4px); }

    .fbar { display:flex; gap:8px; overflow-x:auto; padding-bottom:2px; scrollbar-width:none; }
    .fbar::-webkit-scrollbar { display:none; }

    .leg-row { display:flex; align-items:center; gap:6px; font-size:11px; font-weight:700; }
    .leg-dot  { width:8px; height:8px; border-radius:50%; display:inline-block; flex-shrink:0; }

    .spinner { width:32px; height:32px; border:3px solid #E2E8F0; border-top-color:#1E3A8A; border-radius:50%; animation: spin .7s linear infinite; }
  `}</style>
);

/* ─── Tokens ─────────────────────────────────────────────────────── */
const C = {
  heroBg: "oklch(0.16 0.055 258)",
  bg: "#F8FAFC",
  surface: "#F8FAFC",
  white: "#FFFFFF",
  navy: "#1E3A8A",
  blue: "#2563EB",
  blueLight: "#3B82F6",
  bluePale: "#EFF6FF",
  blueMid: "#BFDBFE",
  border: "#E2E8F0",
  slate: "#475569",
  muted: "#64748B",
  mutedHi: "#475569",
  text: "#0F172A",
  green: "#059669",
  greenPale: "#ECFDF5",
  amber: "#D97706",
  amberPale: "#FFFBEB",
  red: "#DC2626",
  redPale: "#FEF2F2",
  purple: "#7C3AED",
  cyan: "#0891B2",
};
const PALETTE = [C.navy, C.blue, C.green, C.amber, C.purple, C.cyan, C.red, C.blueLight];

const NAAC_CFG: Record<string, { bg: string; bdr: string; txt: string }> = {
  "A++": { bg: "#FEF3C7", bdr: "#FCD34D", txt: "#92400E" },
  "A+": { bg: "#ECFDF5", bdr: "#6EE7B7", txt: "#065F46" },
  "A": { bg: "#EFF6FF", bdr: "#93C5FD", txt: "#1E3A8A" },
};

/* ----------------------Colleges District------------------------*/
const DISTRICTS = [
  "All", "Chennai", "Coimbatore", "Madurai", "Namakkal", "Kanniyakumari", "Kancheepuram", "Salem",
  "Thiruvallur", "Chengalpattu", "Erode", "Tiruchirappalli", "Tirunelveli", "Virudhunagar", "Pudukkottai",
  "Sivaganga", "Viluppuram", "Krishnagiri", "Cuddalore", "Ranipet", "Vellore", "Thoothukkudi", "Tiruppur", "Thanjavur", "Perambalur", "Dindigul",
  "Thiruvarur", "Kallakurichi", "Nagapattinam", "Karur", "Ramanathapuram", "The Nilgiris", "Ariyalur", "Tenkasi",
  "Mayiladuthurai", "Theni", "Dharmapuri", "Tiruvannamalai"
];


/* ─── API hook ─────────────────────────────────────────────────── */
function useFetch(endpoint: string, filters: Record<string, any>): { data: any; loading: boolean; error: string | null } {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (filters.district && filters.district !== 'All') p.set('district', filters.district);
    if (filters.naac && filters.naac !== 'All') p.set('naac', filters.naac);
    return p.toString();
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = `${apiUrl(endpoint)}${params ? '?' + params : ''}`;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [endpoint, params]);

  return { data, loading, error };
}

/* ─── Loading / Error states ──────────────────────────────────── */
function ChartLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, gap: 12 }}>
      <div className="spinner" />
      <span style={{ fontSize: 12, color: C.muted }}>Loading data…</span>
    </div>
  );
}
function ChartError({ msg }: { msg?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160,
      background: C.redPale, borderRadius: 12, gap: 10
    }}>
      <span>⚠️</span>
      <span style={{ fontSize: 12, color: C.red, fontWeight: 600 }}>{msg || 'Failed to load data'}</span>
    </div>
  );
}

/* ─── NAAC badge ─────────────────────────────────────────────── */
function NaacBadge({ grade }: { grade: string }) {
  const s = NAAC_CFG[grade] || NAAC_CFG["A"];
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 999,
      fontSize: 10, fontWeight: 800, background: s.bg, border: `1px solid ${s.bdr}`, color: s.txt
    }}>
      NAAC {grade}
    </span>
  );
}

/* ─── Shared Tooltip ─────────────────────────────────────────── */
function Tip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const title = payload[0]?.payload?.fullName ?? payload[0]?.payload?.name ?? label;
  return (
    <div style={{
      background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12,
      padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", minWidth: 140
    }}>
      <p style={{ fontSize: 11, color: C.muted, marginBottom: 8, fontWeight: 600 }}>{title}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color || C.blue, flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: C.text, fontWeight: 700 }}>
            {p.name && <span style={{ color: C.muted, fontWeight: 500, marginRight: 4 }}>{p.name}:</span>}
            {typeof p.value === "number" ? (Number.isInteger(p.value) ? p.value : p.value.toFixed(1)) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Card + Section Head ─────────────────────────────────────── */
function Card({ children, style = {}, className = "" }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return <div className={`g-card ${className}`} style={style}>{children}</div>;
}
function SHead({ icon, title, sub, accent = C.navy }: { icon: React.ReactNode; title: string; sub?: string; accent?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: sub ? 4 : 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: `${accent}18`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
        }}>
          {icon}
        </div>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 14, color: C.navy }}>
          {title}
        </span>
      </div>
      {sub && <p style={{ fontSize: 12, color: C.muted, marginLeft: 46, lineHeight: 1.5, marginTop: 2 }}>{sub}</p>}
    </div>
  );
}
function Divider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "8px 0 16px" }}>
      <div style={{ flex: 1, height: 1, background: C.border }} />
      <span style={{
        fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 10,
        color: C.muted, textTransform: "uppercase", letterSpacing: ".10em", whiteSpace: "nowrap"
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}
function Insight({ text, color = C.blue }: { text: string; color?: string }) {
  const bg = color === C.green ? C.greenPale : color === C.amber ? C.amberPale : color === C.red ? C.redPale : C.bluePale;
  const bdr = color === C.green ? "#6EE7B7" : color === C.amber ? "#FCD34D" : color === C.red ? "#FCA5A5" : C.blueMid;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: 10,
      background: bg, border: `1px solid ${bdr}`, marginBottom: 14
    }}>
      <span style={{ fontSize: 13 }}>💡</span>
      <p style={{ fontSize: 11, color, fontWeight: 600, lineHeight: 1.5 }}>{text}</p>
    </div>
  );
}

const sc = (v: number): string => v >= 78 ? C.green : v >= 68 ? C.blue : v >= 58 ? C.amber : C.red;

/* ══════════════════════════════════════════════════════════════════
   HERO HEADER
══════════════════════════════════════════════════════════════════ */
function HeroHeader({ overview, filters, setFilters }: { overview: any; filters: { district: string; naac: string }; setFilters: (fn: (f: any) => any) => void }) {
  const d = overview || {};
  const KPIS = [
    { icon: "🏛️", label: "Total Colleges", val: String(d.totalColleges ?? '…'), sub: "in dataset", ka: "linear-gradient(90deg,#1E3A8A,#2563EB)", glow: C.navy },
    { icon: "📊", label: "Avg Overall Score", val: d.avgOverallScore ?? '…', sub: "composite index", ka: "linear-gradient(90deg,#7C3AED,#2563EB)", glow: C.purple },
    { icon: "🏅", label: "A++ Institutions", val: String(d.aaPlusCount ?? '…'), sub: "highest NAAC grade", ka: "linear-gradient(90deg,#D97706,#F59E0B)", glow: C.amber },
    { icon: "💼", label: "Avg Placement", val: d.avgPlacement != null ? `${d.avgPlacement}%` : '…', sub: "go_score (NIRF)", ka: "linear-gradient(90deg,#059669,#34D399)", glow: C.green },
    { icon: "🪑", label: "Total Seats", val: d.totalSeats != null ? Number(d.totalSeats).toLocaleString() : '…', sub: "annual approved intake", ka: "linear-gradient(90deg,#0891B2,#2563EB)", glow: C.cyan },
  ];

  return (
    <header style={{
      position: "relative", overflow: "hidden",
      background: C.heroBg, borderBottom: `1px solid rgba(255,255,255,0.08)`, paddingBottom: 32
    }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 90% at 0% 50%, rgba(37,99,235,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 45% 55% at 100% 0%, rgba(217,119,6,0.12) 0%, transparent 55%)" }} />
        <div style={{
          position: "absolute", inset: 0, opacity: 0.08,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1400, margin: "0 auto", padding: "40px 32px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999,
                background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.18)"
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#34D399",
                  animation: "pulseRing 2s ease infinite"
                }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: ".08em" }}>LIVE ANALYTICS</span>
              </div>
              {["Engineering", "Tamil Nadu · AP", "NIRF 2024", "NAAC Latest"].map((t, i) => (
                <span key={i} style={{
                  padding: "3px 11px", borderRadius: 999, fontSize: 10, fontWeight: 700,
                  background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)",
                  color: "rgba(255,255,255,.55)"
                }}>{t}</span>
              ))}
            </div>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900,
              fontSize: "clamp(26px,3.4vw,44px)", lineHeight: 1.15, letterSpacing: "-.03em",
              color: "#fff", marginBottom: 10
            }}>
              College Analytics
              <span style={{ display: "block", color: "#FCD34D" }}>Overview Dashboard</span>
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.50)" }}>
              Aggregate insights across <strong style={{ color: "rgba(255,255,255,0.80)" }}>
                {d.totalColleges ?? '…'} engineering institutions
              </strong> — NIRF · NAAC · TNEA data
            </p>
          </div>
          <div style={{
            display: "flex", flexDirection: "column", gap: 8, padding: "16px 20px", borderRadius: 16,
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", alignSelf: "flex-start"
          }}>
            {[["NIRF", "2024 Rankings"], ["NAAC", "Latest Cycle"], ["TNEA", "2024 Data"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 800,
                  background: "rgba(217,119,6,0.20)", color: "#FCD34D", minWidth: 40, textAlign: "center",
                  border: "1px solid rgba(217,119,6,0.50)"
                }}>{k}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.60)", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* KPI cards */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around  " }}>
          {KPIS.map((k, i) => (
            <div key={k.label} className={`kpi-card anim-${i}`} style={{ "--ka": k.ka, flex: "1 1 200px", maxWidth: "220px" } as React.CSSProperties & Record<string, any>}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: `${k.glow}18`,
                  border: `1px solid ${k.glow}28`, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 16
                }}>{k.icon}</div>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: k.glow, opacity: .7, marginTop: 4 }} />
              </div>
              <p style={{
                fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase",
                letterSpacing: ".09em", marginBottom: 6
              }}>{k.label}</p>
              <p style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900, fontSize: 26, lineHeight: 1,
                marginBottom: 4, background: k.ka, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>
                {k.val}
              </p>
              <p style={{ fontSize: 10, color: C.muted }}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", justifyContent: "space-between", marginTop: "30px" }}>
          {/* District Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.55)" }}>
              District:
            </span>

            {DISTRICTS.slice(0, 4).map(d => (
              <button
                key={d}
                className={`fchip ${filters.district === d ? "on" : ""}`}
                onClick={() => setFilters(f => ({ ...f, district: d }))}
              >
                {d}
              </button>
            ))}

            <select
              value={DISTRICTS.slice(0, 4).includes(filters.district) ? "" : filters.district}
              onChange={(e) =>
                setFilters(f => ({ ...f, district: e.target.value }))
              }
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
                fontSize: "11px",
                fontWeight: 600,
                background: "#fff",
                color: "#1E3A8A",
                cursor: "pointer"
              }}
            >
              <option value="">Others</option>
              {DISTRICTS.slice(4).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* RIGHT → NAAC */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.55)" }}>
              NAAC:
            </span>
            {["All", "A++", "A+", "A", "B++", "B+", "B", "C"].map(n => (
              <button
                key={n}
                className={`fchip ${filters.naac === n ? "on" : ""}`}
                onClick={() => setFilters(f => ({ ...f, naac: n }))}
              >   {n}   </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ══ CHART 1 — College Count by District ════════════════════════ */
function Chart1_DistrictCount({ filters }: { filters: { district: string; naac: string } }) {
  const { data, loading, error } = useFetch('/dashboard/district-count', filters);
  if (loading) return <ChartLoader />;
  if (error) return <ChartError msg={error} />;
  if (!data?.length) return <ChartError msg="No data available" />;

  const chartData = (data as Array<any>).map((r: any, i: number) => ({ ...r, fill: PALETTE[i % PALETTE.length] }));
  const top = chartData[0];

  return (
    <div>
      <Insight text={`${top?.district || "—"} leads with ${top?.count || 0} colleges — the region's primary education hub`} color={C.blue} />
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 4, right: 10, bottom: 28, left: -18 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="district" tick={{ fontSize: 10, fill: C.muted, angle: -22, textAnchor: "end" }}
            axisLine={false} tickLine={false} interval={0} />
          <YAxis tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false}
            label={{ value: "No. of Colleges", angle: -90, position: "insideLeft", offset: 22, fontSize: 10, fill: C.muted }} />
          <RechartTooltip content={<Tip />} cursor={{ fill: "#F8FAFC" }} />
          <Bar dataKey="count" name="Colleges" radius={[7, 7, 0, 0]} maxBarSize={52}
            animationDuration={1100} animationEasing="ease-out">
            {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ══ CHART 2 — NIRF Rank vs Year ════════════════════════════════ */
function Chart2_NirfRankYear({ filters }: { filters: { district: string; naac: string } }) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [activeLine, setActiveLine] = useState<string | null>(null);

  const { data, loading, error } = useFetch('/dashboard/nirf-trends', filters);

  if (loading) return <ChartLoader />;
  if (error) return <ChartError msg={error} />;
  if (!data?.colleges?.length) return <ChartError msg="No NIRF trend data" />;

  const { colleges, trend } = data;

  // 👉 sort by latest year rank (best first)
  const sortedColleges = [...colleges].sort((a, b) => {
    const lastYear = trend[trend.length - 1];
    return (lastYear[a.name] || 9999) - (lastYear[b.name] || 9999);
  });

  // 👉 pagination
  const start = page * limit;
  const end = start + limit;
  const visibleColleges = sortedColleges.slice(start, end);

  // 👉 light color palette
  const LIGHT_COLS = [
    "#60A5FA", "#34D399", "#FBBF24", "#F472B6", "#A78BFA",
    "#38BDF8", "#4ADE80", "#FCA5A5", "#FDBA74", "#93C5FD"
  ];

  // 👉 dynamic options
  const total = sortedColleges.length;
  const options = [];
  for (let i = 10; i <= total; i += 10) options.push(i);

  return (
    <div style={{ background: "#fff", padding: 14, borderRadius: 12 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <Insight
          text={`Showing ${start + 1}-${Math.min(end, total)} of ${total} colleges (NIRF trend)`}
          color="#16A34A"
        />

        <div style={{ display: "flex", gap: 8 }}>
          {/* LIMIT */}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(0);
            }}
            style={{height:30, padding:"2px 2px", fontSize:12 ,borderRadius: 6, border: "1px solid #E5E7EB", background: "#F9FAFB"  }}
          >
            {options.map(opt => (
              <option key={opt} value={opt}>{opt} / page</option>
            ))}
          </select>

          {/* PAGE */}
          <select
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
            style={{height:30, padding:"2px 2px", fontSize:12 ,borderRadius: 6, border: "1px solid #E5E7EB", background: "#F9FAFB" }}
          >
            {Array.from({ length: Math.ceil(total / limit) }).map((_, i) => (
              <option key={i} value={i}>Page {i + 1}</option>
            ))}
          </select>
        </div>
      </div>

      {/* LEGEND */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 10 }}>
        {visibleColleges.map((c, i) => (
          <span key={c.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              width: 14,
              height: 3,
              background: LIGHT_COLS[i % LIGHT_COLS.length],
              borderRadius: 2
            }} />
            <span style={{ fontSize: 11, color: "#374151" }}>
              {c.name.length > 20 ? c.name.slice(0, 20) + "…" : c.name}
            </span>
          </span>
        ))}
      </div>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={trend} margin={{ top: 10, right: 24, bottom: 4, left: 0 }}>

          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            reversed
            tick={{ fontSize: 11, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "NIRF Rank (↑ better)",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              fontSize: 11,
              fill: "#6B7280"
            }}
          />

          {/* ✅ CUSTOM TOOLTIP */}
          <RechartTooltip
            wrapperStyle={{ zIndex: 1000 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length || !activeLine) return null;

              const filtered = payload.find(p => p.dataKey === activeLine);
              if (!filtered) return null;

              const d = filtered.payload;

              return (
                <div style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 10,
                  padding: "10px 12px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
                }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>
                    {typeof filtered.dataKey === 'string' ? filtered.dataKey : String(filtered.dataKey)}
                  </p>

                  <p style={{ fontSize: 14, fontWeight: 700, color: filtered?.color }}>
                    Rank: {filtered?.value}
                  </p>

                  <p style={{ fontSize: 11, color: "#6B7280" }}>
                    Year: {d.year}
                  </p>
                </div>
              );
            }}
          />

          {/* LINES */}
          {visibleColleges.map((c, i) => (
            <Line
              key={c.id}
              type="monotone"
              dataKey={c.name}
              stroke={LIGHT_COLS[i % LIGHT_COLS.length]}
              strokeWidth={activeLine === c.name ? 3.5 : 2}

              dot={{
                r: 4,
                fill: LIGHT_COLS[i % LIGHT_COLS.length],   // ✅ colored dot
                stroke: "#fff",
                strokeWidth: 1.5
              }}

              activeDot={{
                r: 7,
                fill: LIGHT_COLS[i % LIGHT_COLS.length],
                stroke: "#fff",
                strokeWidth: 2
              }}

              // ✅ hover logic
              onMouseEnter={() => setActiveLine(c.name)}
              onMouseLeave={() => setActiveLine(null)}

              // ✅ fade others
              opacity={activeLine && activeLine !== c.name ? 0.2 : 1}

              animationDuration={1000}
            />
          ))}

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ══ CHART 3 — NAAC Grade Distribution (Donut) ═════════════════ */
function Chart3_NaacDonut({ filters }: { filters: { district: string; naac: string } }) {
  const { data, loading, error } = useFetch('/dashboard/naac-distribution', filters);
  if (loading) return <ChartLoader />;
  if (error) return <ChartError msg={error} />;
  if (!data?.length) return <ChartError msg="No NAAC data" />;

  const COLOR_MAP: Record<string, string> = { "A++": C.amber, "A+": C.green, "A": C.blue };
  const dist = (data as Array<{ grade: string; count: number }>).map((r: { grade: string; count: number }) => ({ name: r.grade, value: r.count, color: COLOR_MAP[r.grade] || C.blue }));
  const total = dist.reduce((s: number, d: any) => s + d.value, 0);
  const top = dist[0];

  const LabelIn = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: { cx: number; cy: number; midAngle?: number; innerRadius: number; outerRadius: number; percent?: number }) => {
    if (!percent || percent < 0.06 || midAngle === undefined) return null;
    const R = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * R), y = cy + r * Math.sin(-midAngle * R);
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: 11, fontWeight: 800, fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div>
      <Insight text={`NAAC ${top?.name} is the dominant grade — ${top?.value} of ${total} colleges (${total > 0 ? Math.round(top?.value / total * 100) : 0}%) hold this accreditation`} color={top?.color || C.blue} />
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ flexShrink: 0 }}>
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie data={dist} cx="50%" cy="50%" innerRadius={44} outerRadius={74}
                paddingAngle={3} dataKey="value" labelLine={false} label={LabelIn}
                animationBegin={0} animationDuration={1200}>
                {dist.map((d, i) => <Cell key={i} fill={d.color} stroke="transparent" />)}
              </Pie>
              <RechartTooltip content={<Tip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1 }}>
          {dist.map((d: { name: string; value: number; color: string }) => (
            <div key={d.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, alignItems: "center" }}>
                <NaacBadge grade={d.name} />
                <span style={{ fontSize: 12, fontWeight: 800, color: d.color }}>
                  {d.value} <span style={{ fontSize: 10, color: C.muted, fontWeight: 500 }}>({total > 0 ? Math.round(d.value / total * 100) : 0}%)</span>
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 99, background: C.surface, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                <div className="pb" style={{
                  "--tw": `${total > 0 ? d.value / total * 100 : 0}%`,
                  width: `${total > 0 ? d.value / total * 100 : 0}%`, background: d.color
                } as React.CSSProperties & Record<string, any>} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══ CHART 4 — Overall Score vs NAAC Score (Scatter) ═══════════ */
function Chart4_ScoreVsNaac({ filters }: { filters: { district: string; naac: string } }) {
  const { data, loading, error } = useFetch('/dashboard/score-vs-naac', filters);
  if (loading) return <ChartLoader />;
  if (error) return <ChartError msg={error} />;
  if (!data?.length) return <ChartError msg="No data" />;

  const pts = (data as Array<any>).map((r: any) => ({
    x: r.naacScore, y: r.overallScore, z: 65, name: r.name, naac: r.grade,
    color: r.grade === "A++" ? C.amber : r.grade === "A+" ? C.green : C.blue,
  }));

  return (
    <div>
      <Insight text="Strong positive correlation — higher NAAC score reliably predicts a better overall performance index" color={C.purple} />
      <ResponsiveContainer width="100%" height={220}>
        <ScatterChart margin={{ top: 10, right: 16, bottom: 24, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="x" type="number" name="NAAC Score"
            tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false}
            label={{ value: "← NAAC Score →", position: "insideBottom", offset: -12, fontSize: 10, fill: C.muted }} />
          <YAxis dataKey="y" type="number" name="Overall Score"
            tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false}
            label={{ value: "Overall Score", angle: -90, position: "insideLeft", offset: 18, fontSize: 10, fill: C.muted }} />
          <ZAxis dataKey="z" range={[52, 52]} />
          <RechartTooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div style={{
                background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12,
                padding: "10px 14px", fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)"
              }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{d.name}</p>
                <div style={{ display: "flex", gap: 16 }}>
                  <div><p style={{ fontSize: 10, color: C.muted }}>NAAC Score</p><p style={{ fontSize: 13, fontWeight: 800, color: C.amber }}>{d.x}</p></div>
                  <div><p style={{ fontSize: 10, color: C.muted }}>Overall Score</p><p style={{ fontSize: 13, fontWeight: 800, color: C.navy }}>{d.y}</p></div>
                </div>
              </div>
            );
          }} cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={pts} animationBegin={0} animationDuration={900}>
            {pts.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={.85} />)}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
        {[["A++", C.amber], ["A+", C.green], ["A", C.blue]].map(([g, col]) => (
          <span key={g} className="leg-row" style={{ color: col }}>
            <span className="leg-dot" style={{ background: col }} /> NAAC {g}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ══ CHART 5 — Placement % (Horizontal Bar) ════════════════════ */

function Chart5_PlacementVsCollege({
  filters,
}: {
  filters: { district: string; naac: string };
}) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const { data, loading, error } = useFetch("/dashboard/placements", filters);

  if (loading) return <ChartLoader />;
  if (error) return <ChartError msg={error} />;
  if (!data?.length) return <ChartError msg="No placement data" />;

  // ✅ Sort full data
  const sortedFull = useMemo(
    () => [...data].sort((a, b) => b.placement - a.placement),
    [data]
  );

  const total = sortedFull.length;

  // ✅ Pagination logic
  const start = (page - 1) * limit;
  const end = start + limit;

  const sorted = sortedFull.slice(start, end);
  const best = sortedFull[0];

  // ✅ Dynamic limit options
  const limitOptions = [];
  for (let i = 10; i <= total; i += 10) {
    limitOptions.push(i);
  }

  // ✅ Dynamic colors
    const COLORS = [
    "#60A5FA", // soft blue
    "#34D399", // soft green
    "#FBBF24", // soft yellow
    "#F472B6", // soft pink
    "#A78BFA", // soft purple
    "#38BDF8", // sky
    "#4ADE80", // light green
    "#FCA5A5", // light red
    "#FDBA74", // peach
    "#93C5FD"  // pale blue
  ];


  return (
    <div>
      {/* 🔥 Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <Insight
          text={`Showing ${start + 1}-${Math.min(
            end,
            total
          )} of ${total} colleges — ${
            best?.name || "—"
          } leads with ${best?.placement || 0}%`}
          color={C.green}
        />

        <div style={{ display: "flex", gap: 8 }}>
          {/* Page Selector */}
          <select
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
            style={{
              padding: "4px 8px",
              borderRadius: 6,
              border: "1px solid #ddd",
              fontSize: 12,
            }}
          >
            {Array.from(
              { length: Math.ceil(total / limit) },
              (_, i) => (
                <option key={i} value={i + 1}>
                  {`${i * limit + 1}-${Math.min(
                    (i + 1) * limit,
                    total
                  )}`}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* 🔥 Chart */}
      <ResponsiveContainer
        width="100%"
        height={Math.max(270, sorted.length * 26)}
      >
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 4, right: 20, bottom: 10, left: 52 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#F1F5F9"
            horizontal={false}
          />

          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: C.muted }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Placement %",
              position: "insideBottom",
              offset: -6,
              fontSize: 10,
              fill: C.muted,
            }}
          />

          <YAxis
            type="category"
            dataKey="short"
            tick={{ fontSize: 11, fontWeight: 700, fill: C.navy }}
            axisLine={false}
            tickLine={false}
            width={250}
            interval={0}
          />

          <RechartTooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;

              return (
                <div
                  style={{
                    background: "#fff",
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "10px 14px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.navy,
                      marginBottom: 4,
                    }}
                  >
                    {d.name}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: sc(d.placement),
                    }}
                  >
                    {d.placement}% Placement
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: C.muted,
                      marginTop: 3,
                    }}
                  >
                    NIRF #{d.nirfRank} · {d.type}
                  </p>
                </div>
              );
            }}
            cursor={{ fill: "#F8FAFC" }}
          />

          <Bar
            dataKey="placement"
            name="Placement %"
            radius={[0, 7, 7, 0]}
            maxBarSize={16}
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {sorted.map((c, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ══ CHART 6 — Cutoff Trends (Area) ════════════════════════════ */
function Chart6_CutoffTrends({ filters }: { filters: { district: string; naac: string } }) {
  const { data, loading, error } = useFetch('/dashboard/cutoff-trends', filters);
  if (loading) return <ChartLoader />;
  if (error) return <ChartError msg={error} />;
  if (!data?.length) return <ChartError msg="No cutoff data" />;

  const CATS = [
    { key: "OC", label: "OC (Open)", color: C.navy },
    { key: "BC", label: "BC", color: C.blue },
    { key: "MBC", label: "MBC", color: C.amber },
    { key: "SC", label: "SC / ST", color: C.green },
  ];

  return (
    <div>
      <Insight text="Category-wise cutoff trends over available years — admission competition analysis" color={C.cyan} />
      <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
        {CATS.map(c => (
          <span key={c.key} className="leg-row" style={{ color: c.color }}>
            <span style={{ width: 16, height: 3, borderRadius: 2, background: c.color, display: "inline-block" }} />
            {c.label}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -12 }}>
          <defs>
            {CATS.map(c => (
              <linearGradient key={c.key} id={`gc-${c.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={c.color} stopOpacity={.15} />
                <stop offset="95%" stopColor={c.color} stopOpacity={.01} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false}
            label={{ value: "Cutoff Marks", angle: -90, position: "insideLeft", offset: 20, fontSize: 10, fill: C.muted }} />
          <RechartTooltip content={<Tip />} />
          {CATS.map(c => (
            <Area key={c.key} type="monotone" dataKey={c.key} name={c.label}
              stroke={c.color} strokeWidth={2.5} fill={`url(#gc-${c.key})`}
              dot={{ r: 4, fill: "#fff", stroke: c.color, strokeWidth: 2 }}
              animationDuration={1300} animationEasing="ease-out" />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ══ CHART 7 — College Type vs Avg Score ═══════════════════════ */
function Chart7_TypeVsScore({ filters }: { filters: { district: string; naac: string } }) {
  const { data, loading, error } = useFetch('/dashboard/type-vs-score', filters);
  if (loading) return <ChartLoader />;
  if (error) return <ChartError msg={error} />;
  if (!data?.length) return <ChartError msg="No data" />;

  const chartData = data.map((r: any, i: number) => ({ ...r, fill: PALETTE[i % PALETTE.length] }));
  const best = [...chartData].sort((a, b) => b.avgScore - a.avgScore)[0];

  return (
    <div>
      <Insight text={`${best?.type || "—"} institutions lead with avg score ${best?.avgScore} — category-level performance gap is significant`} color={best?.fill || C.blue} />
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={chartData} margin={{ top: 4, right: 10, bottom: 4, left: -18 }} barCategoryGap="36%">
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="type" tick={{ fontSize: 12, fontWeight: 700, fill: C.navy }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false}
            label={{ value: "Avg Score", angle: -90, position: "insideLeft", offset: 22, fontSize: 10, fill: C.muted }} />
          <RechartTooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div style={{
                background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12,
                padding: "10px 14px", fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)"
              }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{d.type} Colleges</p>
                <p style={{ fontSize: 13, fontWeight: 800, color: d.fill }}>Avg Score: {d.avgScore}</p>
                <p style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{d.count} college{d.count !== 1 ? "s" : ""} in group</p>
              </div>
            );
          }} cursor={{ fill: "#F8FAFC" }} />
          <Bar dataKey="avgScore" name="Avg Score" radius={[9, 9, 0, 0]}
            animationDuration={1100} animationEasing="ease-out">
            {chartData.map((d: any, i: number) => <Cell key={i} fill={d.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ══ CHART 8 — NAAC Grade vs Avg Placement % ═══════════════════ */
function Chart8_NaacVsPlacement({ filters }: { filters: { district: string; naac: string } }) {
  const { data, loading, error } = useFetch('/dashboard/naac-vs-placement', filters);
  if (loading) return <ChartLoader />;
  if (error) return <ChartError msg={error} />;
  if (!data?.length) return <ChartError msg="No data" />;

  const COLOR_MAP = { "A++": C.amber, "A+": C.green, "A": C.blue };
  const chartData = data.map((r: any) => ({ ...r, fill: COLOR_MAP[r.grade as keyof typeof COLOR_MAP] || C.blue }));
  const aaPlusAvg = chartData.find((d: any) => d.grade === "A++")?.avgPlacement;

  return (
    <div>
      <Insight text={`A++ colleges average ${aaPlusAvg ?? "–"}% placement — accreditation drives measurably better job outcomes`} color={C.amber} />
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={chartData} margin={{ top: 4, right: 10, bottom: 4, left: -18 }} barCategoryGap="36%">
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="grade" tick={{ fontSize: 13, fontWeight: 800, fill: C.navy }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false}
            label={{ value: "Avg Placement %", angle: -90, position: "insideLeft", offset: 22, fontSize: 10, fill: C.muted }} />
          <RechartTooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div style={{
                background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12,
                padding: "10px 14px", fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)"
              }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 6 }}>NAAC {d.grade}</p>
                <p style={{ fontSize: 13, fontWeight: 800, color: d.fill }}>Avg: {d.avgPlacement}%</p>
                <p style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>Range: {d.min}% – {d.max}%</p>
                <p style={{ fontSize: 10, color: C.muted }}>{d.count} college{d.count !== 1 ? "s" : ""}</p>
              </div>
            );
          }} cursor={{ fill: "#F8FAFC" }} />
          <Bar dataKey="avgPlacement" name="Avg Placement %" radius={[9, 9, 0, 0]}
            animationDuration={1100} animationEasing="ease-out">
            {chartData.map((d: any, i: number) => <Cell key={i} fill={d.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ══ CHART 9 — Seats vs College Type (Stacked Bar) ════════════ */
function Chart9_SeatsVsType({ filters }: { filters: { district: string; naac: string } }) {
  const { data, loading, error } = useFetch('/dashboard/seats', filters);
  if (loading) return <ChartLoader />;
  if (error) return <ChartError msg={error} />;
  if (!data?.length) return <ChartError msg="No seats data" />;

  const maxType = [...data].sort((a, b) => b.total - a.total)[0];
  const GCOL = { "A++": C.amber, "A+": C.green, "A": C.blue };

  return (
    <div>
      <Insight text={`${maxType?.type || "—"} institutions offer the most seats (${maxType?.total?.toLocaleString() || 0} total) — largest annual intake`} color={C.green} />
      <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
        {Object.entries(GCOL).map(([g, col]) => (
          <span key={g} className="leg-row" style={{ color: col }}>
            <span className="leg-dot" style={{ background: col }} /> NAAC {g}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 10, bottom: 4, left: -16 }} barCategoryGap="36%">
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="type" tick={{ fontSize: 12, fontWeight: 700, fill: C.navy }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false}
            label={{ value: "Total Seats", angle: -90, position: "insideLeft", offset: 20, fontSize: 10, fill: C.muted }} />
          <RechartTooltip content={<Tip />} cursor={{ fill: "#F8FAFC" }} />
          <Bar dataKey="A++" name="NAAC A++" stackId="a" fill={C.amber}
            animationDuration={1200} animationEasing="ease-out" />
          <Bar dataKey="A+" name="NAAC A+" stackId="a" fill={C.green}
            animationDuration={1200} animationEasing="ease-out" />
          <Bar dataKey="A" name="NAAC A" stackId="a" fill={C.blue}
            radius={[7, 7, 0, 0]} animationDuration={1200} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ══ CHART 10 — District vs Avg Score ═════════════════════════ */
function Chart10_DistrictVsScore({ filters }: { filters: { district: string; naac: string } }) {
  /* Reuse district-count but we need a separate endpoint or compute from
     score-vs-naac data. We call score-vs-naac and aggregate client-side. */
  const { data, loading, error } = useFetch('/dashboard/score-vs-naac', filters);
  if (loading) return <ChartLoader />;
  if (error) return <ChartError msg={error} />;
  if (!data?.length) return <ChartError msg="No data" />;

  // We don't have district in score-vs-naac response, so use district-count endpoint
  // This chart will show avg overallScore grouped by district via a dedicated endpoint
  // For now compute from available data: average overall scores (no district info here)
  // Fallback: show top colleges by overall score as a bar chart
  const sorted = [...data].sort((a, b) => b.overallScore - a.overallScore).slice(0, 10);
  const best = sorted[0];

  return (
    <div>
      <Insight text={`${best?.name || "—"} tops overall performance with score ${best?.overallScore} — strongest institution`} color={C.purple} />
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 20, bottom: 4, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false}
            label={{ value: "Overall Score", position: "insideBottom", offset: -4, fontSize: 10, fill: C.muted }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: C.navy }} axisLine={false} tickLine={false}
            width={90} tickFormatter={v => v.length > 12 ? v.slice(0, 12) + '…' : v} />
          <RechartTooltip content={<Tip />} cursor={{ fill: "#F8FAFC" }} />
          <Bar dataKey="overallScore" name="Overall Score" radius={[0, 7, 7, 0]} maxBarSize={14}
            animationDuration={1100} animationEasing="ease-out">
            {sorted.map((entry, i) => <Cell key={entry.name} fill={PALETTE[i % PALETTE.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ══ SMART INSIGHTS ═════════════════════════════════════════════ */
function SmartInsights({ filters }: { filters: { district: string; naac: string } }) {
  const ovFetch = useFetch('/dashboard/overview', filters);
  const distFetch = useFetch('/dashboard/district-count', filters);
  const plFetch = useFetch('/dashboard/placements', filters);

  const loading = ovFetch.loading || distFetch.loading || plFetch.loading;

  const items = useMemo(() => {
    if (loading) return [];
    const ov = (ovFetch.data || {}) as Record<string, any>;
    const dist = (distFetch.data || []) as Array<{ district: string; count: number }>;
    const pl = (plFetch.data || []) as Array<{ name: string; placement: number }>;

    const topDist = dist[0];
    const topCol = pl[0];
    const botCol = pl[pl.length - 1];

    return [
      topCol ? { t: "success", msg: `${topCol.name} leads with ${topCol.placement}% placement — job-readiness champion.` } : null,
      ov.totalColleges ? { t: "info", msg: `Avg overall score across ${ov.totalColleges} institutions is ${ov.avgOverallScore}.` } : null,
      ov.avgPlacement ? { t: "info", msg: `Avg placement rate is ${ov.avgPlacement}% — reflecting industry connect via NIRF go_score.` } : null,
      ov.aaPlusCount ? { t: "success", msg: `${ov.aaPlusCount} institution${ov.aaPlusCount !== 1 ? "s" : ""} hold the highest NAAC A++ grade.` } : null,
      botCol ? { t: "warning", msg: `${botCol.name} scores lowest in placements at ${botCol.placement}% — may need attention.` } : null,
      topDist ? { t: "info", msg: `${topDist.district} is the education hub with ${topDist.count} colleges in the filtered dataset.` } : null,
    ].filter(Boolean);
  }, [loading, ovFetch.data, distFetch.data, plFetch.data]);

  const S: Record<string, { icon: string; bg: string; bdr: string; txt: string }> = {
    success: { icon: "✅", bg: C.greenPale, bdr: "#6EE7B7", txt: "#064E3B" },
    warning: { icon: "⚠️", bg: C.amberPale, bdr: "#FCD34D", txt: "#78350F" },
    info: { icon: "ℹ️", bg: C.bluePale, bdr: C.blueMid, txt: "#1E3A8A" },
  };

  if (loading) return <ChartLoader />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.filter(Boolean).map((ins, i) => {
        if (!ins) return null;
        const s = S[ins.t];
        return (
          <div key={i} className={`ins-card anim-${Math.min(i, 7)}`}
            style={{ background: s.bg, border: `1px solid ${s.bdr}`, animationDelay: `${i * .07}s` }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
            <p style={{ fontSize: 12, color: s.txt, lineHeight: 1.65, fontWeight: 500 }}>{ins.msg}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ══ MAIN ═══════════════════════════════════════════════════════ */
export function AnalyticsDashboardPage() {
  const [filters, setFilters] = useState({ district: "All", naac: "All" });

  /* Overview is used by HeroHeader KPIs */
  const { data: overviewData } = useFetch('/dashboard/overview', filters);

  return (
    <div className="dash-root">
      <FontStyle />
      <HeroHeader overview={overviewData} filters={filters} setFilters={setFilters} />

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 32px 72px" }}>

        {/* ROW 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,3fr)", gap: 20, marginBottom: 20 }}>
          <Card className="anim-0">
            <SHead icon="📍" title="College Count by District" sub="Where are colleges concentrated?" accent={C.amber} />
            <Chart1_DistrictCount filters={filters} />
          </Card>
          <Card className="anim-1">
            <SHead icon="🏆" title="NIRF Rank vs Year" sub="How rankings evolve over time — lower rank = better" accent={C.navy} />
            <Chart2_NirfRankYear filters={filters} />
          </Card>
        </div>

        {/* ROW 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 20, marginBottom: 20 }}>
          <Card className="anim-2">
            <SHead icon="🎓" title="NAAC Grade Distribution" sub="Quality distribution — donut chart" accent={C.green} />
            <Chart3_NaacDonut filters={filters} />
          </Card>
          <Card className="anim-3">
            <SHead icon="📊" title="Overall Score vs NAAC Score" sub="Does NAAC score reflect actual performance?" accent={C.purple} />
            <Chart4_ScoreVsNaac filters={filters} />
          </Card>
        </div>

        {/* ROW 3 */}
        <Card className="anim-4" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <SHead icon="💼" title="Placement % by College" sub="Which colleges have the best job outcomes? (NIRF go_score)" />
            <span style={{ fontSize: 11, color: C.muted, fontStyle: "italic", paddingBottom: 20 }}>Source: NIRF go_score</span>
          </div>
          <Chart5_PlacementVsCollege filters={filters} />
        </Card>

        {/* ROW 4 */}
        <Card className="anim-5" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <SHead icon="📈" title="Cutoff Trends by Category" sub="OC · BC · MBC · SC — admission difficulty over time" accent={C.cyan} />
            <span style={{ fontSize: 11, color: C.muted, fontStyle: "italic", paddingBottom: 20 }}>Source: TNEA</span>
          </div>
          <Chart6_CutoffTrends filters={filters} />
        </Card>

        {/* ROW 5 */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 20, marginBottom: 20 }}>
          <Card className="anim-6">
            <SHead icon="🏫" title="College Type vs Avg Score" sub="State vs Private vs Deemed — who performs better?" accent={C.blue} />
            <Chart7_TypeVsScore filters={filters} />
          </Card>
          <Card className="anim-7">
            <SHead icon="🎯" title="NAAC Grade vs Avg Placement %" sub="Does accreditation drive better placements?" accent={C.green} />
            <Chart8_NaacVsPlacement filters={filters} />
          </Card>
        </div>

        {/* ROW 6 */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 20, marginBottom: 20 }}>
          <Card className="anim-0">
            <SHead icon="🪑" title="Seats vs College Type" sub="Capacity distribution — stacked by NAAC grade" accent={C.amber} />
            <Chart9_SeatsVsType filters={filters} />
          </Card>
          <Card className="anim-1">
            <SHead icon="🌍" title="Top Colleges by Overall Score" sub="Best performing institutions in filtered view" accent={C.purple} />
            <Chart10_DistrictVsScore filters={filters} />
          </Card>
        </div>

        {/* Smart Insights */}
        <Divider label="AI-Generated Insights" />
        <Card className="anim-2">
          <SHead icon="💡" title="Smart Insights" sub="Auto-generated from live API data across all analytics" accent={C.navy} />
          <SmartInsights filters={filters} />
        </Card>

      </main>
    </div>
  );
}

export default AnalyticsDashboardPage;