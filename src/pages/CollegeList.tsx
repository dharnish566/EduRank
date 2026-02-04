import React, { useState } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  GitCompare,
  Award,
  MapPin,
  TrendingUp,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Building2,
  Star,
  Briefcase,
} from 'lucide-react';

/* =======================
   Types & Interfaces
======================= */

type SortOrder = 'asc' | 'desc';

interface College {
  id: number;
  name: string;
  city: string;
  state: string;
  type: 'Government' | 'Private' | 'Autonomous';
  naac: number;
  nirf: number;
  placement: number;
  overallScore: number;
}

/* =======================
   Component
======================= */

const CollegeListingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [collegeType, setCollegeType] = useState<string>('');
  const [naacRange, setNaacRange] = useState<[number, number]>([0, 4]);
  const [nirfRange, setNirfRange] = useState<[number, number]>([1, 500]);
  const [placementRange, setPlacementRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<keyof College>('overallScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedColleges, setSelectedColleges] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 10;

  /* =======================
     Sample Data
  ======================= */

  const colleges: College[] = [
    { id: 1, name: 'IIT Bombay', city: 'Mumbai', state: 'Maharashtra', type: 'Government', naac: 3.8, nirf: 3, placement: 95, overallScore: 98.5 },
    { id: 2, name: 'IIT Delhi', city: 'Delhi', state: 'Delhi', type: 'Government', naac: 3.7, nirf: 2, placement: 94, overallScore: 97.2 },
    { id: 3, name: 'IIT Madras', city: 'Chennai', state: 'Tamil Nadu', type: 'Government', naac: 3.8, nirf: 1, placement: 96, overallScore: 96.8 },
    { id: 4, name: 'BITS Pilani', city: 'Pilani', state: 'Rajasthan', type: 'Private', naac: 3.6, nirf: 30, placement: 92, overallScore: 95.4 },
    { id: 5, name: 'IIT Kanpur', city: 'Kanpur', state: 'Uttar Pradesh', type: 'Government', naac: 3.7, nirf: 4, placement: 93, overallScore: 94.9 },
    { id: 6, name: 'Anna University', city: 'Chennai', state: 'Tamil Nadu', type: 'Government', naac: 3.5, nirf: 45, placement: 85, overallScore: 89.5 },
    { id: 7, name: 'VIT Vellore', city: 'Vellore', state: 'Tamil Nadu', type: 'Private', naac: 3.3, nirf: 15, placement: 88, overallScore: 88.2 },
    { id: 8, name: 'NIT Trichy', city: 'Tiruchirappalli', state: 'Tamil Nadu', type: 'Government', naac: 3.6, nirf: 10, placement: 90, overallScore: 91.3 },
    { id: 9, name: 'Delhi University', city: 'Delhi', state: 'Delhi', type: 'Government', naac: 3.4, nirf: 11, placement: 82, overallScore: 87.6 },
    { id: 10, name: 'Manipal Institute', city: 'Manipal', state: 'Karnataka', type: 'Private', naac: 3.2, nirf: 48, placement: 80, overallScore: 84.5 },
    { id: 11, name: 'IIT Kharagpur', city: 'Kharagpur', state: 'West Bengal', type: 'Government', naac: 3.7, nirf: 5, placement: 92, overallScore: 94.2 },
    { id: 12, name: 'IIIT Hyderabad', city: 'Hyderabad', state: 'Telangana', type: 'Government', naac: 3.5, nirf: 25, placement: 89, overallScore: 90.1 },
  ];

  /* =======================
     Derived Data
  ======================= */

  const states = [...new Set(colleges.map(c => c.state))].sort();

  const cities = selectedState
    ? [...new Set(colleges.filter(c => c.state === selectedState).map(c => c.city))].sort()
    : [];

  /* =======================
     Handlers
  ======================= */

  const handleSort = (field: keyof College): void => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectCollege = (collegeId: number): void => {
    if (selectedColleges.includes(collegeId)) {
      setSelectedColleges(prev => prev.filter(id => id !== collegeId));
    } else if (selectedColleges.length < 3) {
      setSelectedColleges(prev => [...prev, collegeId]);
    }
  };

  const clearFilters = (): void => {
    setSearchQuery('');
    setSelectedState('');
    setSelectedCity('');
    setCollegeType('');
    setNaacRange([0, 4]);
    setNirfRange([1, 500]);
    setPlacementRange([0, 100]);
  };

  /* =======================
     Filtering & Sorting
  ======================= */

  const filteredColleges = colleges
    .filter(college => {
      return (
        college.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!selectedState || college.state === selectedState) &&
        (!selectedCity || college.city === selectedCity) &&
        (!collegeType || college.type === collegeType) &&
        college.naac >= naacRange[0] &&
        college.naac <= naacRange[1] &&
        college.nirf >= nirfRange[0] &&
        college.nirf <= nirfRange[1] &&
        college.placement >= placementRange[0] &&
        college.placement <= placementRange[1]
      );
    })
    .sort((a, b) => {
      const aValue = a[sortBy] as number;
      const bValue = b[sortBy] as number;
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  /* =======================
     Pagination
  ======================= */

  const totalPages = Math.ceil(filteredColleges.length / itemsPerPage);

  const paginatedColleges = filteredColleges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* =======================
     JSX (UNCHANGED)
  ======================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Award className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">College Rankings</h1>
                <p className="text-sm text-gray-600">{filteredColleges.length} colleges found</p>
              </div>
            </div>
            
            {selectedColleges.length > 0 && (
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center gap-2">
                <GitCompare className="w-5 h-5" />
                Compare {selectedColleges.length} Colleges
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                  Filters
                </h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search College
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type college name..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* State Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCity('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All States</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedState}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* College Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    College Type
                  </label>
                  <select
                    value={collegeType}
                    onChange={(e) => setCollegeType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Autonomous">Autonomous</option>
                  </select>
                </div>

                {/* NAAC Score Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    NAAC Score: {naacRange[0].toFixed(1)} - {naacRange[1].toFixed(1)}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="0.1"
                      value={naacRange[0]}
                      onChange={(e) => setNaacRange([parseFloat(e.target.value), naacRange[1]])}
                      className="w-full accent-blue-600"
                    />
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="0.1"
                      value={naacRange[1]}
                      onChange={(e) => setNaacRange([naacRange[0], parseFloat(e.target.value)])}
                      className="w-full accent-blue-600"
                    />
                  </div>
                </div>

                {/* NIRF Rank Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    NIRF Rank: {nirfRange[0]} - {nirfRange[1]}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={nirfRange[0]}
                      onChange={(e) => setNirfRange([parseInt(e.target.value) || 1, nirfRange[1]])}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={nirfRange[1]}
                      onChange={(e) => setNirfRange([nirfRange[0], parseInt(e.target.value) || 500])}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Placement Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Placement %: {placementRange[0]}% - {placementRange[1]}%
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={placementRange[0]}
                      onChange={(e) => setPlacementRange([parseInt(e.target.value), placementRange[1]])}
                      className="w-full accent-blue-600"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={placementRange[1]}
                      onChange={(e) => setPlacementRange([placementRange[0], parseInt(e.target.value)])}
                      className="w-full accent-blue-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full px-4 py-3 bg-white rounded-lg shadow-md flex items-center justify-center gap-2 font-semibold"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            {/* Sort Bar */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="font-semibold">Sort by:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'overallScore', label: 'Overall Score' },
                    { key: 'nirf', label: 'NIRF Rank' },
                    { key: 'placement', label: 'Placement %' },
                    { key: 'naac', label: 'NAAC Score' }
                  ].map(option => (
                    <button
                      key={option.key}
                      onClick={() => handleSort(option.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        sortBy === option.key
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                      {sortBy === option.key && (
                        sortOrder === 'asc' ? <ChevronUp className="inline w-4 h-4 ml-1" /> : <ChevronDown className="inline w-4 h-4 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* College Cards */}
            <div className="space-y-4">
              {paginatedColleges.length > 0 ? (
                paginatedColleges.map((college, index) => (
                  <div
                    key={college.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        {/* Left: Rank Badge */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                            <div className="text-center">
                              <div className="text-2xl font-bold">#{(currentPage - 1) * itemsPerPage + index + 1}</div>
                            </div>
                          </div>
                        </div>

                        {/* Middle: College Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                            {college.name}
                          </h3>
                          
                          <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              {college.city}, {college.state}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Building2 className="w-4 h-4 text-blue-600" />
                              {college.type}
                            </div>
                          </div>

                          {/* Metrics */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
                              <div className="text-xs text-gray-600 mb-1">NAAC Score</div>
                              <div className="text-lg font-bold text-blue-600 flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                {college.naac}
                              </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
                              <div className="text-xs text-gray-600 mb-1">NIRF Rank</div>
                              <div className="text-lg font-bold text-purple-600 flex items-center gap-1">
                                <Award className="w-4 h-4" />
                                {college.nirf}
                              </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
                              <div className="text-xs text-gray-600 mb-1">Placement</div>
                              <div className="text-lg font-bold text-green-600 flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {college.placement}%
                              </div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3">
                              <div className="text-xs text-gray-600 mb-1">Overall</div>
                              <div className="text-lg font-bold text-orange-600 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {college.overallScore}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-2 whitespace-nowrap">
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View Details</span>
                          </button>
                          <button
                            onClick={() => handleSelectCollege(college.id)}
                            disabled={!selectedColleges.includes(college.id) && selectedColleges.length >= 3}
                            className={`px-4 py-2 rounded-lg transition shadow-md flex items-center gap-2 whitespace-nowrap ${
                              selectedColleges.includes(college.id)
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : selectedColleges.length >= 3
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
                            }`}
                          >
                            <GitCompare className="w-4 h-4" />
                            <span className="hidden sm:inline">
                              {selectedColleges.includes(college.id) ? 'Selected' : 'Compare'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No colleges found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredColleges.length)} of {filteredColleges.length} colleges
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg transition ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CollegeListingPage;
