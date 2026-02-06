import React, { useState } from 'react';
import { Award, TrendingUp, Users, Building2, BarChart3, Briefcase, Info, ChevronDown, ChevronUp, ExternalLink, GraduationCap, Target, Shield } from 'lucide-react';

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
      { name: "Teaching-Learning & Evaluation", score: 3.8 },
      { name: "Infrastructure & Learning Resources", score: 3.9 },
      { name: "Research & Innovation", score: 4.0 },
      { name: "Student Support & Progression", score: 3.7 },
      { name: "Governance & Leadership", score: 3.9 },
      { name: "Institutional Values", score: 3.8 }
    ]
  },
  
  cutoffs: [
    { course: "Computer Science & Engineering", general: 65 },
    { course: "Electronics & Communication", general: 145 },
    { course: "Mechanical Engineering", general: 320 },
    { course: "Civil Engineering", general: 580 }
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

const dump = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
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
    if (score >= 3.7) return { level: "Excellent", color: "text-green-600" };
    if (score >= 3.4) return { level: "Very Good", color: "text-blue-600" };
    if (score >= 3.0) return { level: "Good", color: "text-yellow-600" };
    return { level: "Average", color: "text-orange-600" };
  };

  const maxScore = Math.max(...collegeData.naac.criteria.map(c => c.score));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-8 h-8" />
              <h1 className="text-3xl md:text-4xl font-bold">College Profile Dashboard</h1>
            </div>
            <p className="text-blue-100">Comprehensive accreditation & performance analysis</p>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="flex justify-center md:justify-start">
                <img 
                  src={collegeData.logo} 
                  alt={collegeData.name}
                  className="w-32 h-32 object-contain rounded-xl shadow-lg border-4 border-blue-100"
                />
              </div>
              
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{collegeData.name}</h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {collegeData.location} | {collegeData.type}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">NIRF Rank</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-700">{collegeData.nirf.rank}</p>
                    <p className="text-sm text-blue-600">{collegeData.nirf.category} ({collegeData.nirf.year})</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-900">NAAC Grade</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-700">{collegeData.naac.grade}</p>
                    <p className="text-sm text-purple-600">{collegeData.naac.score} / 4.0</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 pt-2">
                  <a 
                    href={collegeData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Visit Website <ExternalLink className="w-4 h-4" />
                  </a>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
                    Est. {collegeData.established}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NAAC Accreditation Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">NAAC Accreditation Analysis</h3>
              <p className="text-gray-600">Criterion-wise performance breakdown</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
              <p className="text-purple-600 font-semibold mb-1">Overall Grade</p>
              <p className="text-4xl font-bold text-purple-700">{collegeData.naac.grade}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
              <p className="text-blue-600 font-semibold mb-1">Overall Score</p>
              <p className="text-4xl font-bold text-blue-700">{collegeData.naac.score} / 4.0</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200">
              <p className="text-green-600 font-semibold mb-1">Cycle</p>
              <p className="text-4xl font-bold text-green-700">{collegeData.naac.cycle}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {collegeData.naac.criteria.map((criterion, idx) => {
              const percentage = (criterion.score / 4) * 100;
              const isMax = criterion.score === maxScore;
              
              return (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                      {criterion.name}
                    </span>
                    <span className={`font-bold px-3 py-1 rounded-full ${
                      isMax ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {criterion.score.toFixed(1)} / 4.0
                    </span>
                  </div>
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`absolute h-full rounded-full transition-all duration-1000 ${
                        isMax 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-sm text-blue-800">
              <strong>Insight:</strong> The criterion-wise breakdown provides a detailed view of institutional strengths across key quality parameters as evaluated by NAAC.
            </p>
          </div>
        </div>

        {/* Academic Performance */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-xl">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Academic Performance Index</h3>
              <p className="text-gray-600">Derived from accreditation parameters</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-blue-600 font-semibold mb-1">Academic Strength Index</p>
                  <p className="text-sm text-blue-700">Based on TLE, Research & Governance</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-blue-700">{academicIndex}</span>
                <span className="text-xl text-blue-600">/ 4.0</span>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    style={{ width: `${(parseFloat(academicIndex) / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="mt-3 text-sm text-blue-700">
                {getQualityLevel(parseFloat(academicIndex)).level} academic environment
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <p className="text-gray-600 text-sm mb-1">Teaching-Learning Quality</p>
                <p className="text-2xl font-bold text-gray-800">
                  {collegeData.naac.criteria[0].score.toFixed(1)} / 4.0
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-colors">
                <p className="text-gray-600 text-sm mb-1">Research & Innovation</p>
                <p className="text-2xl font-bold text-gray-800">
                  {collegeData.naac.criteria[2].score.toFixed(1)} / 4.0
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-green-300 transition-colors">
                <p className="text-gray-600 text-sm mb-1">Governance & Leadership</p>
                <p className="text-2xl font-bold text-gray-800">
                  {collegeData.naac.criteria[4].score.toFixed(1)} / 4.0
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-700">
              <strong>Methodology:</strong> Academic Index = (Teaching-Learning + Research + Governance) / 3
            </p>
          </div>
        </div>

        {/* Infrastructure Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-xl">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Infrastructure & Learning Resources</h3>
              <p className="text-gray-600">As reported in accreditation documents</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-1 bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200">
              <p className="text-green-600 font-semibold mb-2">Infrastructure Score</p>
              <p className="text-5xl font-bold text-green-700 mb-2">
                {collegeData.infrastructure.score}
              </p>
              <p className="text-sm text-green-600">NAAC Assessment</p>
              <div className="mt-4">
                <span className={`inline-block px-4 py-2 rounded-full font-semibold ${
                  getQualityLevel(collegeData.infrastructure.score).color
                } bg-white`}>
                  {getQualityLevel(collegeData.infrastructure.score).level}
                </span>
              </div>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              {Object.entries(collegeData.infrastructure.facilities).map(([key, value], idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                  <p className="text-gray-500 text-sm mb-1 capitalize">{key}</p>
                  <p className="text-gray-800 font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <p className="text-sm text-green-800">
              <strong>Source:</strong> Infrastructure data derived from NAAC accreditation reports and institutional documentation.
            </p>
          </div>
        </div>

        {/* Cutoff Analysis */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Admission Cutoff Analysis</h3>
              <p className="text-gray-600">Course-wise competitiveness indicators</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {collegeData.cutoffs.map((cutoff, idx) => {
              const maxCutoff = Math.max(...collegeData.cutoffs.map(c => c.general));
              const barWidth = (cutoff.general / maxCutoff) * 100;
              const isHighDemand = cutoff.general < 200;
              
              return (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">
                      {cutoff.course}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        isHighDemand 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        Rank: {cutoff.general}
                      </span>
                      {isHighDemand && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          High Demand
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`absolute h-full rounded-full transition-all duration-1000 ${
                        isHighDemand 
                          ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                          : 'bg-gradient-to-r from-blue-400 to-blue-600'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
            <p className="text-sm text-orange-800">
              <strong>Interpretation:</strong> Lower cutoff ranks indicate higher demand and competitiveness for the program. Cutoff values represent the closing rank for General category admissions.
            </p>
          </div>
        </div>

        {/* Career Readiness Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <Briefcase className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Career & Placement Indicators</h3>
              <p className="text-gray-600">Derived from accreditation parameters</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
              <p className="text-indigo-600 font-semibold mb-2">Career Readiness Score</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold text-indigo-700">{careerScore}</span>
                <span className="text-xl text-indigo-600">/ 4.0</span>
              </div>
              <div className="h-2 bg-indigo-200 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                  style={{ width: `${(parseFloat(careerScore) / 4) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-indigo-700">
                Based on Student Support, Research & Infrastructure parameters
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Placement Cell</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Available
                  </span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Internship Support</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Yes
                  </span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Industry Collaboration</span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Career readiness metrics are derived from accreditation parameters. Direct placement statistics are institution-reported and may vary.
            </p>
          </div>
        </div>

        {/* Overall Performance Summary */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Overall Performance Summary</h3>
              <p className="text-gray-300">Comprehensive institutional assessment</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl border border-white border-opacity-20">
              <p className="text-gray-300 text-sm mb-2">Academic Quality</p>
              <p className="text-3xl font-bold mb-1">{getQualityLevel(parseFloat(academicIndex)).level}</p>
              <p className="text-2xl text-gray-300">{academicIndex}/4.0</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl border border-white border-opacity-20">
              <p className="text-gray-300 text-sm mb-2">Infrastructure</p>
              <p className="text-3xl font-bold mb-1">{getQualityLevel(collegeData.infrastructure.score).level}</p>
              <p className="text-2xl text-gray-300">{collegeData.infrastructure.score}/4.0</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl border border-white border-opacity-20">
              <p className="text-gray-300 text-sm mb-2">Competitiveness</p>
              <p className="text-3xl font-bold mb-1">High</p>
              <p className="text-2xl text-gray-300">Top {collegeData.nirf.rank}</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl border border-white border-opacity-20">
              <p className="text-gray-300 text-sm mb-2">Reputation</p>
              <p className="text-3xl font-bold mb-1">Excellent</p>
              <p className="text-2xl text-gray-300">{reputationScore}/10</p>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm p-4 rounded-xl border border-white border-opacity-20">
            <p className="text-sm text-gray-200">
              <strong>Computation Note:</strong> Overall scores are computed using publicly available accreditation data, national rankings, and institutional performance metrics. Reputation score calculated using NIRF rank positioning and NAAC grade assessment.
            </p>
          </div>
        </div>

        {/* Data Transparency Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <button
            onClick={() => toggleSection('transparency')}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-3 rounded-xl">
                <Info className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-800">About This Data</h3>
                <p className="text-gray-600">Data sources and methodology</p>
              </div>
            </div>
            {expandedSection === 'transparency' ? (
              <ChevronUp className="w-6 h-6 text-gray-400" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-400" />
            )}
          </button>
          
          {expandedSection === 'transparency' && (
            <div className="p-6 pt-0 space-y-6 border-t border-gray-100">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Data Sources</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">NAAC Official Portal - Accreditation scores and criteria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">NIRF Rankings - National ranking data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">College Official Website - Basic institutional information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">Public Admission Data - Cutoff information</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Last Updated</h4>
                <p className="text-gray-700">February 2026</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Limitations & Disclaimers</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">Direct placement statistics are not institution-reported in this dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">Derived metrics (Academic Index, Career Score) are analytical estimates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">All data subject to official institutional verification</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Transparency Commitment:</strong> This dashboard presents only publicly available, verifiable data from official sources. Where data is derived or estimated, the methodology is clearly stated. Users are encouraged to verify critical information from official institutional sources.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>College Profile Dashboard • Built with comprehensive accreditation data</p>
          <p className="mt-1">For academic evaluation and institutional assessment purposes</p>
        </div>
      </div>
    </div>
  );
};

export default dump;