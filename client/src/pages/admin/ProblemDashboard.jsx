import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiCode, FiTrendingUp, FiPlus, FiEdit, FiTrash2, FiSearch, 
  FiCheck, FiClock, FiAlertCircle, FiBarChart2, FiActivity, FiGrid, 
  FiList, FiLoader, FiX, FiUsers, FiFolder, FiTarget, FiFilter,
  FiDownload, FiRefreshCw, FiMoreVertical, FiToggleLeft, FiStar,
  FiCalendar, FiAward, FiLayers, FiPieChart, FiCheckCircle
} from "react-icons/fi";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ProblemDashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: "" });
  const [bulkSelected, setBulkSelected] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProblems();
    fetchStats();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await axios.get(`${API_URL}/problems?limit=100`);
      setProblems(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/problems/stats`);
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProblems(), fetchStats()]);
    setRefreshing(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/problems/${deleteModal.id}`);
      setProblems(problems.filter(p => p._id !== deleteModal.id));
      setDeleteModal({ open: false, id: null, title: "" });
      fetchStats();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (bulkSelected.length === 0) return;
    try {
      await Promise.all(bulkSelected.map(id => axios.delete(`${API_URL}/problems/${id}`)));
      setProblems(problems.filter(p => !bulkSelected.includes(p._id)));
      setBulkSelected([]);
      fetchStats();
    } catch (error) {
      console.error("Failed to bulk delete:", error);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredProblems, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', 'problems.json');
    link.click();
  };

  const toggleSelectAll = () => {
    if (bulkSelected.length === filteredProblems.length) {
      setBulkSelected([]);
    } else {
      setBulkSelected(filteredProblems.map(p => p._id));
    }
  };

  const toggleSelect = (id) => {
    setBulkSelected(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filteredProblems = problems
    .filter(p => {
      const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === "all" || p.difficulty?.toLowerCase() === difficultyFilter;
      const matchesTopic = topicFilter === "all" || p.topics?.includes(topicFilter);
      const matchesCompany = companyFilter === "all" || p.companies?.includes(companyFilter);
      return matchesSearch && matchesDifficulty && matchesTopic && matchesCompany;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "difficulty") {
        const order = { Easy: 1, Medium: 2, Hard: 3 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return 0;
    });

  const topicStats = stats?.topics?.slice(0, 8).map((t, i) => ({
    name: t._id,
    count: t.count,
    color: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#6366F1", "#EC4899", "#14B8A6"][i]
  })) || [];

  const companiesData = stats?.companies?.slice(0, 5).map(c => ({ name: c._id, count: c.count })) || [];

  const difficultyPieData = stats ? [
    { name: "Easy", value: stats.easy, color: "#10B981" },
    { name: "Medium", value: stats.medium, color: "#F59E0B" },
    { name: "Hard", value: stats.hard, color: "#EF4444" },
  ] : [];

  const weeklyData = [
    { day: "Mon", submissions: 45 },
    { day: "Tue", submissions: 52 },
    { day: "Wed", submissions: 48 },
    { day: "Thu", submissions: 65 },
    { day: "Fri", submissions: 78 },
    { day: "Sat", submissions: 92 },
    { day: "Sun", submissions: 85 },
  ];
  const maxSubmissions = Math.max(...weeklyData.map(d => d.submissions));

  const getPieSegments = () => {
    const total = difficultyPieData.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) return [];
    let cumulative = 0;
    return difficultyPieData.map(d => {
      const start = cumulative;
      cumulative += (d.value / total) * 360;
      return { ...d, startAngle: start, endAngle: cumulative };
    });
  };
  const pieSegments = getPieSegments();

  const allTopics = [...new Set(problems.flatMap(p => p.topics || []))];
  const allCompanies = [...new Set(problems.flatMap(p => p.companies || []))];

  return (
    <div className="min-h-screen bg-[#030712] p-6">
      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0a0a14] border border-white/10 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <FiAlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Delete Problem</h3>
            </div>
            <p className="text-gray-400 mb-6">Are you sure you want to delete "{deleteModal.title}"? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, id: null, title: "" })}
                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Problem Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage and monitor all coding problems</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <FiRefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <FiDownload className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => navigate('/admin/create-problem')}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/25"
          >
            <FiPlus className="w-4 h-4" />
            Add Problem
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4 mb-6">
        {[
          { label: "Total", value: stats?.total || 0, icon: FiCode, color: "blue", sub: "problems" },
          { label: "Easy", value: stats?.easy || 0, icon: FiCheck, color: "green", sub: "problems" },
          { label: "Medium", value: stats?.medium || 0, icon: FiActivity, color: "yellow", sub: "problems" },
          { label: "Hard", value: stats?.hard || 0, icon: FiAlertCircle, color: "red", sub: "problems" },
          { label: "Best", value: stats?.best || 0, icon: FiAward, color: "purple", sub: "problems" },
          { label: "Premium", value: stats?.premium || 0, icon: FiStar, color: "pink", sub: "problems" },
          { label: "Submissions", value: stats?.totalSubmissions || stats?.submissions?.total || 0, icon: FiTrendingUp, color: "cyan", sub: "total" },
          { label: "Users", value: stats?.totalUniqueUsers || 0, icon: FiUsers, color: "orange", sub: "users" },
          { label: "Solved", value: stats?.totalSolved || 0, icon: FiCheckCircle, color: "emerald", sub: "problems" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0a0a14]/80 backdrop-blur-xl border border-white/5 rounded-xl p-4 hover:border-emerald-500/30 transition-all">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
              stat.color === 'blue' ? 'bg-blue-500/10' :
              stat.color === 'green' ? 'bg-emerald-500/10' :
              stat.color === 'yellow' ? 'bg-yellow-500/10' :
              stat.color === 'red' ? 'bg-red-500/10' :
              stat.color === 'purple' ? 'bg-purple-500/10' :
              stat.color === 'pink' ? 'bg-pink-500/10' :
              stat.color === 'emerald' ? 'bg-emerald-500/10' :
              stat.color === 'orange' ? 'bg-orange-500/10' : 'bg-cyan-500/10'
            }`}>
              <stat.icon className={`w-5 h-5 ${
                stat.color === 'blue' ? 'text-blue-400' :
                stat.color === 'green' ? 'text-emerald-400' :
                stat.color === 'yellow' ? 'text-yellow-400' :
                stat.color === 'red' ? 'text-red-400' :
                stat.color === 'purple' ? 'text-purple-400' :
                stat.color === 'pink' ? 'text-pink-400' :
                stat.color === 'emerald' ? 'text-emerald-400' :
                stat.color === 'orange' ? 'text-orange-400' : 'text-cyan-400'
              }`} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid - 5 Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        
        {/* 1. Weekly Submissions */}
        <div className="bg-[#0a0a14]/80 backdrop-blur-xl border border-white/5 rounded-xl p-5 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Weekly Activity</h3>
            <FiTrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-end justify-between h-32 gap-2">
            {weeklyData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-white/5 rounded-t hover:bg-emerald-500/50 transition-all relative group" style={{ height: `${(day.submissions / maxSubmissions) * 110}px` }}>
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.submissions}
                  </div>
                </div>
                <span className="text-xs text-gray-500">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Difficulty Pie Chart */}
        <div className="bg-[#0a0a14]/80 backdrop-blur-xl border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Difficulty</h3>
            <FiPieChart className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="relative w-28 h-28 mx-auto mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {pieSegments.map((seg, i) => {
                const radius = 40;
                const circumference = 2 * Math.PI * radius;
                const strokeDasharray = ((seg.endAngle - seg.startAngle) / 360) * circumference;
                const strokeDashoffset = -(seg.startAngle / 360) * circumference;
                return (
                  <circle key={i} cx="50" cy="50" r={radius} fill="none" stroke={seg.color} strokeWidth="20"
                    strokeDasharray={`${strokeDasharray} ${circumference}`} strokeDashoffset={strokeDashoffset} />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{stats?.total || 0}</span>
            </div>
          </div>
          <div className="space-y-1">
            {difficultyPieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-400">{item.name}</span>
                </div>
                <span className="font-medium text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Topics */}
        <div className="bg-[#0a0a14]/80 backdrop-blur-xl border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Topics</h3>
            <FiLayers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="space-y-2">
            {topicStats.slice(0, 5).map((topic, i) => {
              const maxCount = Math.max(...topicStats.map(t => t.count));
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">{topic.name}</span>
                    <span className="text-xs font-medium text-white">{topic.count}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(topic.count / maxCount) * 100}%`, backgroundColor: topic.color }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Companies */}
        <div className="bg-[#0a0a14]/80 backdrop-blur-xl border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Companies</h3>
            <FiAward className="w-4 h-4 text-blue-400" />
          </div>
          <div className="space-y-2">
            {companiesData.length > 0 ? companiesData.map((company, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-[#030712] rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="text-xs text-gray-300">{company.name}</span>
                </div>
                <span className="text-xs font-medium text-gray-500">{company.count}</span>
              </div>
            )) : (
              <p className="text-xs text-gray-500 text-center py-4">No companies yet</p>
            )}
          </div>
        </div>

        {/* 5. Quick Stats */}
        <div className="bg-[#0a0a14]/80 backdrop-blur-xl border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Insights</h3>
            <FiBarChart2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <div className="text-xs text-emerald-400">Acceptance Rate</div>
              <div className="text-lg font-bold text-emerald-400">42%</div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-xs text-blue-400">Avg Solve Time</div>
              <div className="text-lg font-bold text-blue-400">2.3 min</div>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="text-xs text-purple-400">Success Rate</div>
              <div className="text-lg font-bold text-purple-400">78%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-[#0a0a14]/80 backdrop-blur-xl border border-white/5 rounded-xl">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 border-b border-white/5">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">All Problems</h2>
            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">{filteredProblems.length}</span>
            {bulkSelected.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors flex items-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete ({bulkSelected.length})
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-[#030712] border border-white/5 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 w-56"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg text-sm flex items-center gap-2 transition-colors ${
                showFilters ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-[#030712] border-white/5 text-gray-400 hover:text-white"
              }`}
            >
              <FiFilter className="w-4 h-4" />
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-[#030712] border border-white/5 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">By Title</option>
              <option value="difficulty">By Difficulty</option>
            </select>


          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-5 border-b border-white/5 bg-[#030712]/50">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-2">Difficulty</label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-3 py-2 bg-[#0a0a14] border border-white/5 rounded-lg text-white text-sm"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="best">Best</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">Topic</label>
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  className="px-3 py-2 bg-[#0a0a14] border border-white/5 rounded-lg text-white text-sm"
                >
                  <option value="all">All Topics</option>
                  {allTopics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">Company</label>
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="px-3 py-2 bg-[#0a0a14] border border-white/5 rounded-lg text-white text-sm"
                >
                  <option value="all">All Companies</option>
                  {allCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => { setDifficultyFilter("all"); setTopicFilter("all"); setCompanyFilter("all"); }}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <FiLoader className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-16">
            <FiCode className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No problems found</p>
            <button
              onClick={() => navigate('/admin/create-problem')}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Create first problem
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProblems.map((problem) => (
              <div key={problem._id} className={`bg-[#030712] border rounded-lg p-4 hover:border-emerald-500/30 transition-all relative group ${bulkSelected.includes(problem._id) ? 'border-emerald-500' : 'border-white/5'}`}>
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={bulkSelected.includes(problem._id)}
                    onChange={() => toggleSelect(problem._id)}
                    className="w-4 h-4 rounded border-gray-600 bg-[#0a0a14] text-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex items-center justify-between mb-3 mt-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-medium ${
                    problem.difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-400" :
                    problem.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                    problem.difficulty === "Hard" ? "bg-red-500/20 text-red-400" :
                    "bg-purple-500/20 text-purple-400"
                  }`}>
                    {problem.difficulty}
                  </span>
                  <div className="flex items-center gap-1">
                    {problem.premium && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-[10px] font-bold text-white">PREMIUM</span>
                    )}
                  </div>
                </div>
                <h3 className="font-medium text-white mb-2 line-clamp-1">{problem.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-1">{problem.topics?.slice(0, 2).join(", ") || "No topics"}</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiTrendingUp className="w-3 h-3" />
                      {problem.submissions || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUsers className="w-3 h-3" />
                      -
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => navigate(`/admin/edit-problem/${problem._id}`)} className="p-2 bg-white/5 hover:bg-emerald-500/20 rounded text-gray-500 hover:text-emerald-400 transition-colors">
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteModal({ open: true, id: problem._id, title: problem.title })} className="p-2 bg-white/5 hover:bg-red-500/20 rounded text-gray-500 hover:text-red-400 transition-colors">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={bulkSelected.length === filteredProblems.length && filteredProblems.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-600 bg-[#0a0a14] text-emerald-500 focus:ring-emerald-500"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Submissions</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Users</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Topics</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Premium</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((problem, i) => (
                  <tr key={problem._id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${bulkSelected.includes(problem._id) ? 'bg-emerald-500/5' : ''}`}>
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={bulkSelected.includes(problem._id)}
                        onChange={() => toggleSelect(problem._id)}
                        className="w-4 h-4 rounded border-gray-600 bg-[#0a0a14] text-emerald-500 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white font-medium">{problem.title}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        problem.difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-400" :
                        problem.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                        problem.difficulty === "Hard" ? "bg-red-500/20 text-red-400" :
                        "bg-purple-500/20 text-purple-400"
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">{problem.submissions || 0}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <FiUsers className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-400 text-sm">-</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-400 text-sm">{problem.topics?.slice(0, 2).join(", ") || "-"}</td>
                    <td className="py-4 px-4">
                      {problem.premium ? <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">Premium</span> : <span className="text-gray-500">-</span>}
                    </td>
                    <td className="py-4 px-4 text-gray-500 text-sm">
                      {problem.createdAt ? new Date(problem.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/admin/edit-problem/${problem._id}`)} className="p-2 hover:bg-emerald-500/20 rounded text-gray-500 hover:text-emerald-400">
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteModal({ open: true, id: problem._id, title: problem.title })} className="p-2 hover:bg-red-500/20 rounded text-gray-500 hover:text-red-400">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDashboard;
