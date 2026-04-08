import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  FiCheck, FiX, FiClock, FiTrendingUp, FiBarChart2, FiCalendar,
  FiCheckCircle, FiXCircle, FiLoader, FiFilter, FiSearch, FiRefreshCw,
  FiArrowRight, FiZap, FiTarget, FiAward
} from "react-icons/fi";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0
  });
  const [filter, setFilter] = useState("passed");
  const [searchQuery, setSearchQuery] = useState("");
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/submissions`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (res.data.success) {
        setSubmissions(res.data.data || []);
        setStats(res.data.stats || stats);
        setWeeklyData(res.data.weeklyData || generateMockWeeklyData());
      }
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
      setSubmissions(generateMockSubmissions());
      setWeeklyData(generateMockWeeklyData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockSubmissions = () => [
    { _id: "1", problem: { title: "Two Sum", difficulty: "Easy" }, status: "Passed", language: "Python", time: "45ms", memory: "14MB", submittedAt: new Date(Date.now() - 1000 * 60 * 5) },
    { _id: "2", problem: { title: "Add Two Numbers", difficulty: "Medium" }, status: "Passed", language: "JavaScript", time: "89ms", memory: "42MB", submittedAt: new Date(Date.now() - 1000 * 60 * 30) },
    { _id: "4", problem: { title: "Valid Parentheses", difficulty: "Easy" }, status: "Passed", language: "C++", time: "32ms", memory: "8MB", submittedAt: new Date(Date.now() - 1000 * 60 * 120) },
    { _id: "6", problem: { title: "Binary Tree Inorder", difficulty: "Medium" }, status: "Passed", language: "JavaScript", time: "56ms", memory: "38MB", submittedAt: new Date(Date.now() - 1000 * 60 * 240) },
    { _id: "8", problem: { title: "Reverse Linked List", difficulty: "Easy" }, status: "Passed", language: "Go", time: "28ms", memory: "6MB", submittedAt: new Date(Date.now() - 1000 * 60 * 360) },
  ];

  const generateMockWeeklyData = () => [
    { day: "Mon", accepted: 12, rejected: 3 },
    { day: "Tue", accepted: 18, rejected: 5 },
    { day: "Wed", accepted: 8, rejected: 2 },
    { day: "Thu", accepted: 25, rejected: 4 },
    { day: "Fri", accepted: 15, rejected: 6 },
    { day: "Sat", accepted: 30, rejected: 8 },
    { day: "Sun", accepted: 22, rejected: 5 },
  ];

  const filteredSubmissions = submissions.filter(sub => {
    const matchesFilter = filter === "all" || 
      (filter === "passed" && sub.status === "Passed") ||
      (filter === "failed" && sub.status !== "Passed");
    const matchesSearch = sub.problem?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const acceptanceRate = stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0;

  const difficultyData = [
    { name: "Easy", value: stats.easySolved, color: "#10B981" },
    { name: "Medium", value: stats.mediumSolved, color: "#F59E0B" },
    { name: "Hard", value: stats.hardSolved, color: "#EF4444" },
  ];

  const statusData = [
    { name: "Passed", value: stats.accepted, color: "#10B981" },
    { name: "Failed", value: stats.rejected, color: "#EF4444" },
  ];

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10">
                <FiBarChart2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Submissions</h1>
            </div>
            <p className="text-gray-400 ml-14">Track your problem-solving progress</p>
          </div>
          <button
            onClick={fetchSubmissions}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-emerald-500/20">
                <FiTarget className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-2xl font-bold text-emerald-400">{acceptanceRate}%</span>
            </div>
            <p className="text-sm text-gray-400">Acceptance Rate</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-blue-500/20">
                <FiBarChart2 className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-blue-400">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-400">Total Submissions</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-emerald-500/20">
                <FiCheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-2xl font-bold text-emerald-400">{stats.accepted}</span>
            </div>
              <p className="text-sm text-gray-400">Passed</p>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-red-500/20">
                <FiXCircle className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-2xl font-bold text-red-400">{stats.rejected}</span>
            </div>
            <p className="text-sm text-gray-400">Rejected</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Activity Chart */}
          <div className="bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FiTrendingUp className="w-5 h-5 text-emerald-400" />
                  Weekly Activity
                </h2>
                <p className="text-sm text-gray-400">Submissions over the week</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="acceptedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="rejectedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity={1} />
                      <stop offset="100%" stopColor="#DC2626" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="accepted" name="Passed" fill="url(#acceptedGradient)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rejected" name="Rejected" fill="url(#rejectedGradient)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FiBarChart2 className="w-5 h-5 text-blue-400" />
                  Status Distribution
                </h2>
                <p className="text-sm text-gray-400">Acceptance vs Rejection</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-52 w-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-4">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-400">{item.name}</span>
                    <span className="text-lg font-bold text-white ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FiAward className="w-5 h-5 text-yellow-400" />
                Problems Solved by Difficulty
              </h2>
              <p className="text-sm text-gray-400">Your solved problems breakdown</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-emerald-400 mb-1">{stats.easySolved}</p>
              <p className="text-sm text-gray-400">Easy</p>
              <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.easySolved ? 100 : 0}%` }}></div>
              </div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-yellow-400 mb-1">{stats.mediumSolved}</p>
              <p className="text-sm text-gray-400">Medium</p>
              <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${stats.mediumSolved ? 100 : 0}%` }}></div>
              </div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-red-400 mb-1">{stats.hardSolved}</p>
              <p className="text-sm text-gray-400">Hard</p>
              <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${stats.hardSolved ? 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#0d0d1a]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("passed")}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === "passed" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent"
              }`}
            >
              Passed
            </button>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Problem</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Difficulty</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Language</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Time</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Memory</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      {submission.status === "Passed" ? (
                        <span className="flex items-center gap-2 text-emerald-400">
                          <FiCheckCircle className="w-5 h-5" />
                          <span className="hidden sm:inline">Passed</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-red-400">
                          <FiXCircle className="w-5 h-5" />
                          <span className="hidden sm:inline">{submission.status}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        to={`/problems/${submission.problem?._id}`}
                        className="text-white hover:text-emerald-400 font-medium transition-colors"
                      >
                        {submission.problem?.title || "Unknown Problem"}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        submission.problem?.difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-400" :
                        submission.problem?.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {submission.problem?.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{submission.language}</td>
                    <td className="px-6 py-4 text-gray-400">{submission.time}</td>
                    <td className="px-6 py-4 text-gray-400">{submission.memory}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{formatTime(submission.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <FiClock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No submissions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Submissions;
