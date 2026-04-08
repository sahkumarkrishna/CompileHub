import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  Code, Play, AlertTriangle, Languages, 
  Activity, Target, Zap, TrendingUp,
  ChevronRight, Sparkles, RefreshCw, CheckCircle, Trophy, Timer
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
  RadialBarChart, RadialBar
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCodes: 0,
    totalRuns: 0,
    errorCount: 0,
    languagesUsed: 0
  });
  const [problemStats, setProblemStats] = useState({
    solved: 0,
    attempted: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalSolved: 0
  });
  const [showDemoStats, setShowDemoStats] = useState(false);
  const [topLanguages, setTopLanguages] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to view dashboard");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const { stats, topLanguages, weeklyData, monthlyData } = response.data;
        setStats(stats);
        setTopLanguages(topLanguages);
        setWeeklyData(weeklyData);
        setMonthlyData(monthlyData);
        setError(null);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProblemStats = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowDemoStats(true);
      return;
    }

    try {
      const userStatsRes = await axios.get(`${API_URL}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (userStatsRes.data.success) {
        setProblemStats(userStatsRes.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch problem stats:", err);
      setShowDemoStats(true);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchProblemStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats, fetchProblemStats]);

  const languageColors = {
    javascript: { primary: '#F7DF1E', secondary: '#D4B800', glow: 'rgba(247, 223, 30, 0.3)' },
    python: { primary: '#3776AB', secondary: '#FFD43B', glow: 'rgba(55, 118, 171, 0.3)' },
    java: { primary: '#ED8B00', secondary: '#5382A1', glow: 'rgba(237, 139, 0, 0.3)' },
    c: { primary: '#A8B9CC', secondary: '#00599C', glow: 'rgba(168, 185, 204, 0.3)' },
    cpp: { primary: '#00599C', secondary: '#004482', glow: 'rgba(0, 89, 156, 0.3)' },
    typescript: { primary: '#3178C6', secondary: '#235A97', glow: 'rgba(49, 120, 198, 0.3)' },
    go: { primary: '#00ADD8', secondary: '#0088CC', glow: 'rgba(0, 173, 216, 0.3)' },
    rust: { primary: '#DEA584', secondary: '#B7410E', glow: 'rgba(222, 165, 132, 0.3)' },
    default: { primary: '#6366F1', secondary: '#4F46E5', glow: 'rgba(99, 102, 241, 0.3)' }
  };

  const pieData = topLanguages.map(([lang, count]) => ({
    name: lang,
    value: count,
    ...(languageColors[lang?.toLowerCase()] || languageColors.default)
  }));

  const successRate = stats.totalCodes > 0 
    ? Math.round(((stats.totalCodes - stats.errorCount) / stats.totalCodes) * 100) 
    : 0;

  const statCards = [
    { 
      icon: <CheckCircle className="w-7 h-7" />, 
      label: "Problems Solved", 
      value: problemStats.totalSolved, 
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bgGradient: "from-emerald-500/20 to-teal-500/10",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      trend: problemStats.totalSolved > 0 ? `+${problemStats.totalSolved}` : "0"
    },
    { 
      icon: <Code className="w-7 h-7" />, 
      label: "Total Codes", 
      value: stats.totalCodes, 
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      bgGradient: "from-blue-500/20 to-indigo-500/10",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      trend: stats.totalCodes > 0 ? `+${stats.totalCodes}` : "0"
    },
    { 
      icon: <Play className="w-7 h-7" />, 
      label: "Total Runs", 
      value: stats.totalRuns, 
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      bgGradient: "from-purple-500/20 to-pink-500/10",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      trend: stats.totalRuns > 0 ? `+${stats.totalRuns}` : "0"
    },
    { 
      icon: <AlertTriangle className="w-7 h-7" />, 
      label: "Error Codes", 
      value: stats.errorCount, 
      gradient: "from-red-500 via-rose-500 to-pink-500",
      bgGradient: "from-red-500/20 to-pink-500/10",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      trend: stats.errorCount > 0 ? `${stats.errorCount}` : "0"
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
          <p className="text-white font-semibold">{label}</p>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <Sparkles className="w-8 h-8 text-emerald-400 absolute animate-pulse" />
          <p className="text-gray-400 mt-16">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">{error}</h2>
          <p className="text-gray-400 mb-4">Please login to view your dashboard</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10">
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Dashboard
              </h1>
            </div>
            <p className="text-gray-400 ml-14">Track your coding journey and statistics</p>
          </div>
          <button
            onClick={fetchStats}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="relative group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className={`relative p-5 sm:p-6 rounded-2xl bg-gradient-to-br ${stat.bgGradient} border border-white/5 hover:border-white/10 transition-all duration-300`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.iconBg} backdrop-blur-sm`}>
                    <span className={stat.iconColor}>{stat.icon}</span>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 text-gray-400">
                    {stat.trend} total
                  </span>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-white mb-1 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 p-6 backdrop-blur-sm hover:border-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  Weekly Activity
                  <span className="px-2 py-0.5 text-xs font-normal bg-emerald-500/20 text-emerald-400 rounded-full">Live</span>
                </h2>
                <p className="text-sm text-gray-400">Code submissions this week</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="codes" 
                    name="Codes" 
                    fill="url(#barGradient)" 
                    radius={[8, 8, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 p-6 backdrop-blur-sm hover:border-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Language Distribution</h2>
                <p className="text-sm text-gray-400">Top languages used</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-52 w-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.primary}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-3 pr-4">
                {topLanguages.slice(0, 4).map(([lang, count], index) => {
                  const colors = languageColors[lang?.toLowerCase()] || languageColors.default;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full shadow-lg"
                        style={{ backgroundColor: colors.primary, boxShadow: `0 0 8px ${colors.glow}` }}
                      ></div>
                      <span className="text-sm text-white capitalize font-medium">{lang}</span>
                      <span className="text-xs text-gray-500 ml-auto">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 p-6 backdrop-blur-sm hover:border-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Success Rate</h2>
                <p className="text-sm text-gray-400">Overall code success percentage</p>
              </div>
              <div className="p-2 rounded-xl bg-emerald-500/20">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="70%" 
                      outerRadius="100%" 
                      barSize={20}
                      data={[
                        { name: 'Success', value: successRate, fill: '#10B981' },
                        { name: 'Total', value: 100, fill: '#1F2937' }
                      ]}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar
                        background={{ fill: '#1F2937' }}
                        dataKey="value"
                        cornerRadius={10}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white">{successRate}%</span>
                  <span className="text-sm text-gray-400">Success</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 rounded-xl bg-white/5">
                <p className="text-2xl font-bold text-emerald-400">{stats.totalCodes - stats.errorCount}</p>
                <p className="text-xs text-gray-400">Successful</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <p className="text-2xl font-bold text-red-400">{stats.errorCount}</p>
                <p className="text-xs text-gray-400">Errors</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 p-6 backdrop-blur-sm hover:border-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">30-Day Trend</h2>
                <p className="text-sm text-gray-400">Code activity over time</p>
              </div>
              <div className="p-2 rounded-xl bg-blue-500/20">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 11 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="codes"
                    name="Codes"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fill="url(#areaGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/20">
                <Trophy className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-sm text-emerald-400 font-semibold">Problems Breakdown</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-sm text-gray-400">Easy</span>
                </div>
                <span className="text-lg font-bold text-emerald-400">{problemStats.easySolved}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-sm text-gray-400">Medium</span>
                </div>
                <span className="text-lg font-bold text-yellow-400">{problemStats.mediumSolved}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-sm text-gray-400">Hard</span>
                </div>
                <span className="text-lg font-bold text-red-400">{problemStats.hardSolved}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/20">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm text-blue-400 font-semibold">Success Rate</span>
            </div>
            <p className="text-4xl font-bold text-white mb-1">{successRate}%</p>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-3">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                style={{ width: `${successRate}%` }}
              ></div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/20 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-violet-500/20">
                <Activity className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-sm text-violet-400 font-semibold">Avg Codes/Day</span>
            </div>
            <p className="text-4xl font-bold text-white mb-1">
              {stats.totalCodes > 0 ? (stats.totalCodes / 7).toFixed(1) : 0}
            </p>
            <p className="text-xs text-gray-400 mt-3">Based on last 7 days</p>
          </div>
        </div>

        {/* Problems Progress */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link 
            to="/problems/all?difficulty=easy"
            className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 hover:bg-emerald-500/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-emerald-400 font-medium">Easy Solved</span>
              <Trophy className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white">{problemStats.easySolved}</p>
          </Link>
          <Link 
            to="/problems/all?difficulty=medium"
            className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4 hover:bg-yellow-500/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yellow-400 font-medium">Medium Solved</span>
              <Timer className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-white">{problemStats.mediumSolved}</p>
          </Link>
          <Link 
            to="/problems/all?difficulty=hard"
            className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 hover:bg-red-500/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-red-400 font-medium">Hard Solved</span>
              <Zap className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white">{problemStats.hardSolved}</p>
          </Link>
          <Link 
            to="/problems/all"
            className="rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 p-4 hover:from-emerald-500/30 hover:to-teal-500/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-emerald-400 font-medium">Total Solved</span>
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white">{problemStats.totalSolved}</p>
          </Link>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-white/10 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10">
                <Sparkles className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Ready to code?</h2>
                <p className="text-gray-400">Start coding in 23+ languages with our online compiler</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/problems/all"
                className="group flex items-center gap-2 px-5 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 font-semibold rounded-xl transition-all whitespace-nowrap"
              >
                <CheckCircle className="w-5 h-5" />
                Solve Problems
              </Link>
              <Link
                to="/home"
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 whitespace-nowrap"
              >
                Open Compiler
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
