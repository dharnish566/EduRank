import type { ReactNode } from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    Award,
    ChevronRight,
    Search,
    Sliders,
    GitCompare,
    Shield,
    Database
} from 'lucide-react';
import NavBarHome from '../component/navBar/NavBarHome';
import { useNavigate } from 'react-router-dom';


/* -------------------- Interfaces -------------------- */
interface Feature {
    icon: ReactNode;
    title: string;
    description: string;
}

interface Stat {
    number: string;
    label: string;
}

interface Step {
    icon: ReactNode;
    title: string;
    desc: string;
}

/* -------------------- Component -------------------- */
export default function LandingPage() {
    
    const navigate = useNavigate();
    
    const features: Feature[] = [
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Dynamic Rankings",
            description:
            "Real-time college rankings based on multiple performance metrics with transparent scoring"
        },
        {
            icon: <Sliders className="w-6 h-6" />,
            title: "Custom Weights",
            description:
            "Adjust metric importance based on your preferences for personalized rankings"
        },
        {
            icon: <GitCompare className="w-6 h-6" />,
            title: "Compare Colleges",
            description:
                "Side-by-side comparison of up to 5 colleges with detailed metric analysis"
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: "Analytics Dashboard",
            description:
                "Comprehensive insights with charts, trends, and city-wise performance data"
        },
        {
            icon: <Award className="w-6 h-6" />,
            title: "Explainable Results",
            description:
                "Understand exactly why each college achieved its specific rank"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Admin Control",
            description:
                "Secure admin panel for managing college data and system configurations"
        }
    ];

    const metrics: string[] = [
        "NAAC Accreditation",
        "Placement Rate",
        "Average Salary",
        "Faculty Ratio",
        "Research Output",
        "Infrastructure",
        "Academic Perception"
    ];

    const stats: Stat[] = [
        { number: "500+", label: "Colleges Ranked" },
        { number: "7", label: "Performance Metrics" },
        { number: "100%", label: "Transparent Algorithm" },
        { number: "Real-time", label: "Dynamic Updates" }
    ];

    const steps: Step[] = [
        { icon: <Database />, title: "Data Collection", desc: "Admin uploads comprehensive college data" },
        { icon: <Sliders />, title: "Normalization", desc: "Metrics are processed and normalized" },
        { icon: <BarChart3 />, title: "Calculation", desc: "Weighted algorithm computes scores" },
        { icon: <TrendingUp />, title: "Rankings", desc: "Colleges are ranked dynamically" },
        { icon: <Users />, title: "Exploration", desc: "Users explore and compare results" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

            {/* ---------------- Navigation ---------------- */}
            <NavBarHome/>

            {/* ---------------- Hero ---------------- */}
            <section id="home" className=" py-25 max-w-8xl mx-auto px-4 bg-emerald-50">
                <div className="grid md:grid-cols-2 gap-12 items-center border border-amber-950">
                    {/* Left Content */}
                    <div className="space-y-7 border px-20  border-pink-950">
                        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            🎓 Data-Driven Rankings
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                            Transparent <span className="text-blue-600">College Rankings</span>
                        </h1>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            Data-driven, customizable and explainable college ranking analytics to help you make informed decisions.
                        </p>

                        <div className="flex gap-4">
                            <button className="group bg-blue-600 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-lg cursor-pointer" 
                            onClick={() => navigate("/college")}>
                                Explore Rankings
                                <ChevronRight className="mr-1 mt-1 transition-transform duration-300 group-hover:translate-x-2" />
                            </button>

                            <button className="border-2 border-gray-300 px-6 py-3 rounded-lg flex items-center gap-2 hover:border-blue-600 hover:text-blue-600 transition">
                                <Search /> Compare
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-gray-200">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-blue-600">{stat.number}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* right Content */}
                    <div className="border border-purple-950">
                        
                    </div>
                </div>
            </section>

            {/* ---------------- Features ---------------- */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                    {features.map((feature, i) => (
                        <div key={i} className="p-6 border rounded-xl hover:shadow-lg">
                            <div className="mb-4 text-blue-600">{feature.icon}</div>
                            <h3 className="font-bold">{feature.title}</h3>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------------- Metrics ---------------- */}
            <section id="metrics" className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics.map((metric, i) => (
                        <div key={i} className="bg-white/10 p-6 rounded-xl">
                            <div className="text-3xl font-bold opacity-50">0{i + 1}</div>
                            <div>{metric}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------------- How It Works ---------------- */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-5 gap-8">
                    {steps.map((step, i) => (
                        <div key={i} className="text-center">
                            <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-full mx-auto mb-4">
                                {step.icon}
                            </div>
                            <h4 className="font-bold">{step.title}</h4>
                            <p className="text-sm text-gray-600">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------------- Footer ---------------- */}
            <footer className="bg-gray-900 text-gray-300 py-10 text-center">
                © 2024 College Ranking Analytics
            </footer>
        </div>
    );
}
