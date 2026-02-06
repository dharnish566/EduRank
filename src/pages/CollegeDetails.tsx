import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, Building2, BarChart3, Briefcase, Info, ChevronDown, ChevronUp, ExternalLink, GraduationCap, Target, Shield, Star, Zap, TrendingDown } from 'lucide-react';

// Sample data structure
const collegeData = {
  name: "IIT Madras",
  location: "Chennai, Tamil Nadu",
  type: "Govt Institute",
  website: "https://www.iitm.ac.in",
  established: 1959,
  logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/IIT_Madras_Logo.svg/150px-IIT_Madras_Logo.svg.png",

  nirf: {
    rank: 1,
    year: 2024,
    category: "Engineering Institutions",
    score: 89.93
  },

  naac: {
    grade: "A++",
    score: 3.9,
    cycle: "4th Cycle",
    criteria: [
      { name: "Teaching-Learning & Evaluation", score: 3.8, icon: "📚" },
      { name: "Infrastructure & Learning Resources", score: 3.9, icon: "🏛️" },
      { name: "Research & Innovation", score: 4.0, icon: "🔬" },
      { name: "Student Support & Progression", score: 3.7, icon: "🎯" },
      { name: "Governance & Leadership", score: 3.9, icon: "⚖️" },
      { name: "Institutional Values", score: 3.8, icon: "💎" }
    ]
  },

  cutoffs: [
    { course: "Computer Science & Engineering", general: 65, trend: "up" },
    { course: "Electronics & Communication", general: 145, trend: "stable" },
    { course: "Mechanical Engineering", general: 320, trend: "down" },
    { course: "Civil Engineering", general: 580, trend: "stable" }
  ],

  infrastructure: {
    score: 3.9,
    facilities: {
      laboratories: "Available",
      library: "Central library present",
      hostel: "Separate hostel facilities",
      sports: "Advanced"
    }
  }
};

const CollegeProfile = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Calculate derived metrics
  const academicIndex = (
    (collegeData.naac.criteria[0].score +
      collegeData.naac.criteria[2].score +
      collegeData.naac.criteria[4].score) / 3
  ).toFixed(2);

  const careerScore = (
    (collegeData.naac.criteria[3].score +
      collegeData.naac.criteria[2].score +
      collegeData.naac.criteria[1].score) / 3
  ).toFixed(2);

  const reputationScore = (
    (collegeData.naac.score * 2 + (100 - collegeData.nirf.rank) / 10) / 3
  ).toFixed(1);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getQualityLevel = (score: number) => {
    if (score >= 3.7) return { level: "Excellent", color: "from-emerald-600 to-teal-600" };
    if (score >= 3.4) return { level: "Very Good", color: "from-blue-600 to-indigo-600" };
    if (score >= 3.0) return { level: "Good", color: "from-amber-600 to-orange-600" };
    return { level: "Average", color: "from-slate-600 to-gray-600" };
  };

  const maxScore = Math.max(...collegeData.naac.criteria.map(c => c.score));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sophisticated Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #1e293b 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}></div>
      </div>

      <div className="relative max-w-[1500px] mx-auto py-12">

        {/* Hero Profile Card */}
        <div className={`bg-white rounded-3xl shadow-2xl shadow-slate-900/5 overflow-hidden mb-12 border border-slate-200/60 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl"></div>

            <div className="relative grid md:grid-cols-6 min-h-[500px]">
              {/* Left Section - College Image (80%) */}
              <div className="md:col-span-4 flex items-center justify-center p-12 border-r border-white/10">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <img
                    src={collegeData.logo}
                    alt={collegeData.name}
                    className="relative w-72 h-72 object-contain bg-white rounded-3xl p-8 shadow-2xl"
                  />
                </div>
              </div>

              {/* Right Section - College Info (20%) */}
              <div className="md:col-span-2 flex flex-col justify-between p-8 space-y-6">
                <div className="space-y-4">
                  {/* College Name */}
                  <div>
                    <h2 className="text-5xl font-light text-white mb-2 tracking-tight leading-tight">{collegeData.name}</h2>
                    <p className="text-slate-400 text-[15px]">
                      <Building2 className="w-3 h-3 inline mr-1" />
                      {collegeData.location}
                    </p>
                    <p className="text-slate-400 text-[15px] mt-1">
                      {collegeData.type} • Est. {collegeData.established}
                    </p>
                  </div>
                  {/* Website Link */}
                  <div>
                    <a
                      href={collegeData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg hover:shadow-xl hover:scale-105 transition-all font-medium text-xs w-1/4"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Visit
                    </a>
                  </div>

                  {/* NIRF Rank */}
                  <div className="relative group border border-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <Award className="w-5 h-5 text-amber-400" />
                        <span className="text-[10px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                          NIRF
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-light text-white">#</span>
                        <span className="text-3xl font-semibold text-white">{collegeData.nirf.rank}</span>
                      </div>
                      <p className="text-slate-400 text-[15px] mt-1">{collegeData.nirf.year}</p>
                    </div>
                  </div>

                  {/* NAAC Grade */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        <span className="text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                          NAAC
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-semibold text-white">{collegeData.naac.grade}</span>
                      </div>
                      <p className="text-slate-400 text-[15px] mt-1">{collegeData.naac.score}/4.0</p>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Column - Primary Metrics */}
          <div className="lg:col-span-2 space-y-8">

            {/* NAAC Deep Dive */}
            <div className={`bg-white rounded-3xl shadow-xl shadow-slate-900/5 p-8 border border-slate-200/60 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-700 mb-3">
                    <Shield className="w-3 h-3" />
                    Quality Assessment
                  </div>
                  <h3 className="text-3xl font-light text-slate-900 mb-2">NAAC Accreditation</h3>
                  <p className="text-slate-600">Criterion-wise performance breakdown</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs font-medium text-slate-500 mb-1">Overall Grade</p>
                  <p className="text-4xl font-semibold text-slate-900">{collegeData.naac.grade}</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs font-medium text-slate-500 mb-1">Score</p>
                  <p className="text-4xl font-semibold text-slate-900">{collegeData.naac.score}</p>
                  <p className="text-xs text-slate-500">out of 4.0</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs font-medium text-slate-500 mb-1">Cycle</p>
                  <p className="text-4xl font-semibold text-slate-900">{collegeData.naac.cycle.split(' ')[0]}</p>
                  <p className="text-xs text-slate-500">Assessment</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {collegeData.naac.criteria.map((criterion, idx) => {
                  const percentage = (criterion.score / 4) * 100;
                  const isMax = criterion.score === maxScore;

                  return (
                    <div
                      key={idx}
                      className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{criterion.icon}</span>
                          <div>
                            <p className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                              {criterion.name}
                            </p>
                            {isMax && (
                              <span className="inline-flex items-center gap-1 mt-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold w-fit">
                                <Zap className="w-3 h-3" />
                                Peak
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="font-semibold text-slate-900 text-lg">
                          {criterion.score.toFixed(1)} / 4.0
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${isMax
                              ? 'from-emerald-500 to-teal-500'
                              : 'from-slate-400 to-slate-500'
                            }`}
                          style={{
                            width: `${percentage}%`,
                            transitionDelay: `${idx * 100}ms`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>


              <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-sm text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-900">Analysis:</span> Criterion-wise assessment provides granular insights into institutional quality across teaching, infrastructure, research, student support, governance, and values.
                </p>
              </div>
            </div>

            {/* Cutoff Analysis */}
            <div className={`bg-white rounded-3xl shadow-xl shadow-slate-900/5 p-8 border border-slate-200/60 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-700 mb-3">
                  <TrendingUp className="w-3 h-3" />
                  Admission Metrics
                </div>
                <h3 className="text-3xl font-light text-slate-900 mb-2">Cutoff Analysis</h3>
                <p className="text-slate-600">Course-wise competitive positioning</p>
              </div>

              <div className="space-y-6">
                {collegeData.cutoffs.map((cutoff, idx) => {
                  const maxCutoff = Math.max(...collegeData.cutoffs.map(c => c.general));
                  const barWidth = (cutoff.general / maxCutoff) * 100;
                  const isHighDemand = cutoff.general < 200;

                  return (
                    <div key={idx} className="group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 mb-1">{cutoff.course}</h4>
                          <div className="flex items-center gap-2">
                            {cutoff.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
                            {cutoff.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-500" />}
                            <span className="text-sm text-slate-500">
                              {cutoff.trend === 'up' ? 'Increasing competition' :
                                cutoff.trend === 'down' ? 'Easing trend' : 'Stable demand'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold ${isHighDemand
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                            <span className="text-xs opacity-70">Rank</span>
                            <span className="text-xl">{cutoff.general}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute h-full rounded-full transition-all duration-1000 ${isHighDemand
                            ? 'bg-gradient-to-r from-red-500 to-orange-500'
                            : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                            }`}
                          style={{
                            width: `${barWidth}%`,
                            transitionDelay: `${idx * 150}ms`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-200">
                <p className="text-sm text-amber-900 leading-relaxed">
                  <span className="font-semibold">Interpretation:</span> Lower cutoff ranks indicate higher selectivity and program demand. General category closing ranks shown.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Supporting Metrics */}
          <div className="space-y-8">

            {/* Academic Index */}
            <div className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl shadow-slate-900/5 p-8 text-white transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-medium mb-3">
                  <Target className="w-3 h-3" />
                  Derived Metric
                </div>
                <h3 className="text-2xl font-light mb-2">Academic Index</h3>
                <p className="text-slate-400 text-sm">Analytical strength assessment</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-light">{academicIndex}</span>
                  <span className="text-2xl text-slate-400">/ 4.0</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                    style={{ width: `${(parseFloat(academicIndex) / 4) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-slate-300 text-sm">Teaching-Learning</span>
                  <span className="font-semibold">{collegeData.naac.criteria[0].score}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-slate-300 text-sm">Research</span>
                  <span className="font-semibold">{collegeData.naac.criteria[2].score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Governance</span>
                  <span className="font-semibold">{collegeData.naac.criteria[4].score}</span>
                </div>
              </div>

              <p className="mt-6 text-xs text-slate-400 leading-relaxed">
                Computed from accreditation parameters focusing on core academic dimensions
              </p>
            </div>

            {/* Infrastructure */}
            <div className={`bg-white rounded-3xl shadow-xl shadow-slate-900/5 p-8 border border-slate-200/60 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-700 mb-3">
                  <Building2 className="w-3 h-3" />
                  Facilities
                </div>
                <h3 className="text-2xl font-light text-slate-900 mb-2">Infrastructure</h3>
                <p className="text-slate-600 text-sm">NAAC assessed resources</p>
              </div>

              <div className="mb-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-light text-slate-900">{collegeData.infrastructure.score}</span>
                  <span className="text-xl text-slate-500">/ 4.0</span>
                </div>
                <p className={`text-sm font-semibold bg-gradient-to-r ${getQualityLevel(collegeData.infrastructure.score).color} bg-clip-text text-transparent`}>
                  {getQualityLevel(collegeData.infrastructure.score).level} Grade
                </p>
              </div>

              <div className="space-y-3">
                {Object.entries(collegeData.infrastructure.facilities).map(([key, value], idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-sm text-slate-600 capitalize">{key}</span>
                    <span className="text-sm font-medium text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Readiness */}
            <div className={`bg-white rounded-3xl shadow-xl shadow-slate-900/5 p-8 border border-slate-200/60 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-700 mb-3">
                  <Briefcase className="w-3 h-3" />
                  Career Support
                </div>
                <h3 className="text-2xl font-light text-slate-900 mb-2">Career Readiness</h3>
                <p className="text-slate-600 text-sm">Derived assessment</p>
              </div>

              <div className="mb-6 p-6 bg-indigo-50 rounded-2xl border border-indigo-200">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-light text-indigo-900">{careerScore}</span>
                  <span className="text-xl text-indigo-600">/ 4.0</span>
                </div>
                <div className="h-2 bg-indigo-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                    style={{ width: `${(parseFloat(careerScore) / 4) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-sm text-slate-600">Placement Cell</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-sm text-slate-600">Internships</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Available</span>
                </div>
              </div>

              <p className="mt-6 text-xs text-slate-500 leading-relaxed">
                Based on Student Support, Research & Infrastructure parameters
              </p>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className={`mt-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-slate-900/20 p-10 text-white transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-medium mb-3">
              <BarChart3 className="w-3 h-3" />
              Comprehensive View
            </div>
            <h3 className="text-3xl font-light mb-2">Overall Performance</h3>
            <p className="text-slate-400">Institutional excellence summary</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
              <p className="text-slate-400 text-xs mb-2">Academic Quality</p>
              <p className="text-3xl font-light mb-1">{getQualityLevel(parseFloat(academicIndex)).level}</p>
              <p className="text-slate-400 text-sm">{academicIndex} / 4.0</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
              <p className="text-slate-400 text-xs mb-2">Infrastructure</p>
              <p className="text-3xl font-light mb-1">{getQualityLevel(collegeData.infrastructure.score).level}</p>
              <p className="text-slate-400 text-sm">{collegeData.infrastructure.score} / 4.0</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
              <p className="text-slate-400 text-xs mb-2">Selectivity</p>
              <p className="text-3xl font-light mb-1">High</p>
              <p className="text-slate-400 text-sm">National Rank #{collegeData.nirf.rank}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
              <p className="text-slate-400 text-xs mb-2">Reputation</p>
              <p className="text-3xl font-light mb-1">Excellent</p>
              <p className="text-slate-400 text-sm">{reputationScore} / 10</p>
            </div>
          </div>

          <div className="mt-8 p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <p className="text-sm text-slate-300 leading-relaxed">
              <span className="font-semibold text-white">Methodology:</span> Metrics derived from publicly available NAAC accreditation data, NIRF rankings, and institutional performance indicators.
            </p>
          </div>
        </div>

        {/* Data Transparency */}
        <div className={`mt-8 bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-200/60 overflow-hidden transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={() => toggleSection('transparency')}
            className="w-full p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-slate-200 transition-colors">
                <Info className="w-5 h-5 text-slate-700" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-medium text-slate-900">Data Transparency & Sources</h3>
                <p className="text-slate-600 text-sm">Methodology and limitations disclosure</p>
              </div>
            </div>
            {expandedSection === 'transparency' ? (
              <ChevronUp className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors" />
            ) : (
              <ChevronDown className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors" />
            )}
          </button>

          {expandedSection === 'transparency' && (
            <div className="px-8 pb-8 space-y-8 border-t border-slate-100">
              <div className="grid md:grid-cols-2 gap-8 pt-8">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">Primary Data Sources</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">NAAC Official Portal</p>
                        <p className="text-slate-600 text-xs">Accreditation scores and criteria</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">NIRF Rankings</p>
                        <p className="text-slate-600 text-xs">National ranking framework data</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">Institutional Records</p>
                        <p className="text-slate-600 text-xs">Official college documentation</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">Important Limitations</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                      <p className="text-slate-700 text-sm">Direct placement statistics not institution-reported</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                      <p className="text-slate-700 text-sm">Derived metrics are analytical estimates</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                      <p className="text-slate-700 text-sm">Subject to official institutional verification</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <p className="text-sm text-blue-900 leading-relaxed">
                  <span className="font-semibold">Transparency Commitment:</span> This dashboard presents only publicly available, verifiable data from official sources. Where metrics are derived or estimated, methodology is explicitly stated. Users are encouraged to verify critical information through official institutional channels.
                </p>
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-slate-500">Last Updated: February 2026</p>
              </div>
            </div>
          )}
        </div>

        {/* Sophisticated Footer */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm font-light">
            Institutional Profile Analysis System
          </p>
          <p className="text-slate-300 text-xs mt-1">
            Designed for academic evaluation and institutional assessment
          </p>
        </div>
      </div>
    </div>
  );
};

export default CollegeProfile;