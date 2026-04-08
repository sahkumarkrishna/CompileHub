import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCode, FiSearch, FiArrowLeft, FiArrowRight, FiHeart, FiCheckCircle, FiClock, FiChevronDown, FiGrid, FiList, FiX, FiFilter, FiTrendingUp, FiTarget, FiAward, FiLayers } from "react-icons/fi";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AllProblems = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [totalPages, setTotalPages] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);
  const [stats, setStats] = useState({ total: 0, easy: 0, medium: 0, hard: 0 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProblems();
  }, [activeDifficulty, currentPage]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery) {
        fetchProblems();
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/problems/stats`);
      if (res.data.success) {
        setStats({
          total: res.data.data.total || 0,
          easy: res.data.data.easy || 0,
          medium: res.data.data.medium || 0,
          hard: res.data.data.hard || 0,
          best: res.data.data.best || 0
        });
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", 24);
      if (activeDifficulty !== "all") params.append("difficulty", activeDifficulty);
      if (searchQuery) params.append("search", searchQuery);
      params.append("sort", sortBy);

      const res = await axios.get(`${API_URL}/problems?${params.toString()}`);
      if (res.data.success) {
        setProblems(res.data.data || []);
        setTotalProblems(res.data.pagination?.totalProblems || 0);
        setTotalPages(res.data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch problems:", err);
    } finally {
      setLoading(false);
    }
  };

  const difficulties = [
    { key: "all", name: "All Problems", count: stats.total, color: "#3B82F6", gradient: "from-blue-600 to-cyan-500", icon: FiCode },
    { key: "easy", name: "Easy", count: stats.easy, color: "#10B981", gradient: "from-emerald-600 to-teal-500", icon: FiTarget },
    { key: "medium", name: "Medium", count: stats.medium, color: "#F59E0B", gradient: "from-amber-600 to-orange-500", icon: FiTrendingUp },
    { key: "hard", name: "Hard", count: stats.hard, color: "#EF4444", gradient: "from-red-600 to-rose-500", icon: FiAward },
    { key: "best", name: "Best", count: stats.best, color: "#8B5CF6", gradient: "from-purple-600 to-pink-500", icon: FiAward },
  ];

  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = activeDifficulty === "all" || problem.difficulty?.toLowerCase() === activeDifficulty;
    const matchesSearch = problem.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030712] via-[#0a0a14] to-[#0f0f1a]">
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-emerald-400 text-sm font-medium">{totalProblems} Problems Available</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Master Coding Problems
              </span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Practice with {totalProblems}+ coding challenges from top companies. Prepare for your next interview.
            </p>
          </div>

          {/* Difficulty Cards - Full Width Hero Style */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {difficulties.map((diff, index) => {
              const IconComponent = diff.icon;
              return (
                <button
                  key={diff.key}
                  onClick={() => setActiveDifficulty(diff.key)}
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 ${
                    activeDifficulty === diff.key 
                      ? `bg-gradient-to-br ${diff.gradient} border-transparent shadow-lg` 
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${diff.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className="relative p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        activeDifficulty === diff.key 
                          ? "bg-white/20" 
                          : "bg-white/5 group-hover:bg-white/10"
                      }`}>
                        <IconComponent className={`w-6 h-6 ${activeDifficulty === diff.key ? "text-white" : "text-gray-400"}`} />
                      </div>
                      {activeDifficulty === diff.key && (
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      )}
                    </div>
                    <div className={`text-3xl sm:text-4xl font-bold mb-1 ${activeDifficulty === diff.key ? "text-white" : "text-white"}`}>
                      {diff.count}
                    </div>
                    <div className={`text-sm font-medium ${activeDifficulty === diff.key ? "text-white/80" : "text-gray-400"}`}>
                      {diff.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <FiSearch className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by problem title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`lg:hidden px-4 py-3 rounded-xl border transition-all ${
                    showFilters 
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" 
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  <FiFilter className="w-5 h-5" />
                </button>
                
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest First</option>
                    <option value="difficulty">Difficulty</option>
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>

                <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-emerald-500/20 text-emerald-400" : "text-gray-400 hover:text-white"}`}
                  >
                    <FiGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-lg transition-all ${viewMode === "list" ? "bg-emerald-500/20 text-emerald-400" : "text-gray-400 hover:text-white"}`}
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Problems Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400">Loading problems...</p>
                  </div>
                </div>
              ) : problems.length === 0 ? (
                <div className="col-span-full flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <FiCode className="w-10 h-10 text-gray-600" />
                    </div>
                    <p className="text-gray-400 text-lg mb-2">No problems found</p>
                    <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                  </div>
                </div>
              ) : (
                problems.map((problem, index) => (
                  <div 
                    key={problem._id || problem.id}
                    onClick={() => window.location.href = `/problems/${problem.slug}`}
                    className="group bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer hover:bg-white/[0.05] hover:shadow-xl hover:shadow-emerald-500/5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        problem.status === 'solved' ? 'bg-emerald-500/20' :
                        problem.status === 'attempted' ? 'bg-yellow-500/20' : 'bg-white/5'
                      }`}>
                        {problem.status === 'solved' ? (
                          <FiCheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : problem.status === 'attempted' ? (
                          <FiClock className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <FiCode className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      {problem.premium && (
                        <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-[10px] font-bold text-white shadow-lg shadow-amber-500/20">
                          PREMIUM
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-base font-semibold text-white mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                      {problem.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        problem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        problem.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {problem.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">{problem.acceptance || '0%'} acceptance</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        {problem.timeComplexity || 'O(n)'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiLayers className="w-3 h-3" />
                        {problem.spaceComplexity || 'O(1)'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {problem.topics?.slice(0, 2).map((topic, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                          {topic}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-all"
                      >
                        <FiHeart className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-gray-500">Problem #{index + 1 + (currentPage - 1) * 24}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</div>
                <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</div>
                <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Difficulty</div>
                <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Complexity</div>
                <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acceptance</div>
                <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</div>
              </div>

              {filteredProblems.map((problem, index) => (
                <div 
                  key={problem._id || problem.id}
                  onClick={() => window.location.href = `/problems/${problem.slug}`}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="hidden lg:flex col-span-1 items-center">
                    {problem.status === 'solved' ? (
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <FiCheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                    ) : problem.status === 'attempted' ? (
                      <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                        <FiClock className="w-4 h-4 text-yellow-400" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg border-2 border-gray-600"></div>
                    )}
                  </div>

                  <div className="col-span-12 lg:col-span-3">
                    <h3 className="text-sm font-semibold text-white hover:text-emerald-400 transition-colors mb-1">
                      {problem.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {problem.topics?.slice(0, 3).map((topic, idx) => (
                        <span key={idx} className="text-xs text-gray-500">{topic}</span>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-4 lg:col-span-2 flex lg:items-center">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      problem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      problem.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>

                  <div className="hidden lg:flex col-span-2 items-center gap-2">
                    <span className="text-gray-400 text-xs" title="Time Complexity">
                      <FiClock className="w-3 h-3 inline mr-1" />
                      {problem.timeComplexity || 'O(n)'}
                    </span>
                    <span className="text-gray-500 text-xs" title="Space Complexity">
                      <FiLayers className="w-3 h-3 inline mr-1" />
                      {problem.spaceComplexity || 'O(1)'}
                    </span>
                  </div>

                  <div className="hidden lg:flex col-span-2 items-center">
                    <span className="text-gray-400 text-sm">{problem.acceptance || '0%'}</span>
                  </div>

                  <div className="col-span-8 lg:col-span-2 flex items-center gap-2 lg:justify-end">
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-all"
                    >
                      <FiHeart className="w-4 h-4" />
                    </button>
                    {problem.premium && (
                      <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded text-[10px] font-bold text-white">PREMIUM</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-6 py-4 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl">
            <p className="text-gray-400 text-sm">
              Showing <span className="text-white font-medium">{(currentPage - 1) * 24 + 1}</span> to <span className="text-white font-medium">{Math.min(currentPage * 24, totalProblems)}</span> of <span className="text-white font-medium">{totalProblems}</span> problems
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                      currentPage === pageNum
                        ? "bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
              >
                <FiArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProblems;
