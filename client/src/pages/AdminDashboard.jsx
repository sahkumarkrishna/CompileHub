import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiShield, FiUsers, FiCode, FiPlay, FiAlertTriangle,
  FiTrendingUp, FiTrendingDown, FiActivity, FiTarget,
  FiClock, FiCheckCircle, FiXCircle, FiRefreshCw,
  FiServer, FiDatabase, FiZap, FiBarChart2, FiPieChart,
  FiArrowUpRight, FiArrowDownRight, FiEye, FiTrash2,
  FiDownload, FiUpload, FiSettings, FiUserPlus, FiMail
} from "react-icons/fi";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("");
  const [contactCount, setContactCount] = useState(0);
  const [problemStats, setProblemStats] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setStats(res.data);
    } catch (err) {
      toast.error("Failed to fetch statistics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchProblemStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/problems/stats`);
      if (res.data.success) setProblemStats(res.data.data);
    } catch (err) {
      console.error("Failed to fetch problem stats");
    }
  };

  const fetchContactCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/contact`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setContactCount(res.data.count || res.data.data?.length || 0);
      }
    } catch (err) {
      console.error("Failed to fetch contact count");
    }
  };

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Admin";
    const email = localStorage.getItem("userEmail") || "";
    setAdminName(name);
    setAdminEmail(email);
    
    fetchStats();
    fetchContactCount();
    fetchProblemStats();
    const interval = setInterval(() => setTime(new Date()), 1000);
    const refreshInterval = setInterval(() => {
      fetchStats();
      fetchProblemStats();
    }, 30000);
    return () => {
      clearInterval(interval);
      clearInterval(refreshInterval);
    };
  }, []);

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#06B6D4', '#EF4444', '#6366F1'];
  const GRADIENT_COLORS = ['#10B981', '#059669', '#047857'];

  const statCards = [
    {
      icon: <FiUsers className="w-6 h-6" />,
      label: "Total Users",
      value: stats?.stats?.totalUsers || 0,
      trend: stats?.stats?.newUsersToday || 0,
      trendLabel: "today",
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      bg: "bg-blue-500/20",
      color: "text-blue-400",
      border: "border-blue-500/30",
      glow: "shadow-blue-500/20"
    },
    {
      icon: <FiCode className="w-6 h-6" />,
      label: "Total Codes",
      value: stats?.stats?.totalCodes || 0,
      trend: stats?.stats?.newCodesToday || 0,
      trendLabel: "today",
      gradient: "from-emerald-500 via-emerald-600 to-emerald-700",
      bg: "bg-emerald-500/20",
      color: "text-emerald-400",
      border: "border-emerald-500/30",
      glow: "shadow-emerald-500/20"
    },
    {
      icon: <FiMail className="w-6 h-6" />,
      label: "Messages",
      value: contactCount || 0,
      trend: undefined,
      gradient: "from-purple-500 via-purple-600 to-purple-700",
      bg: "bg-purple-500/20",
      color: "text-purple-400",
      border: "border-purple-500/30",
      glow: "shadow-purple-500/20"
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      label: "Success Rate",
      value: `${stats?.stats?.successRate || 0}%`,
      trend: stats?.stats?.successRate > 80,
      gradient: "from-pink-500 via-pink-600 to-pink-700",
      bg: "bg-pink-500/20",
      color: "text-pink-400",
      border: "border-pink-500/30",
      glow: "shadow-pink-500/20"
    },
    {
      icon: <FiZap className="w-6 h-6" />,
      label: "Avg Exec Time",
      value: `${stats?.stats?.avgExecutionTime || 0}s`,
      gradient: "from-orange-500 via-orange-600 to-orange-700",
      bg: "bg-orange-500/20",
      color: "text-orange-400",
      border: "border-orange-500/30",
      glow: "shadow-orange-500/20"
    },
    {
      icon: <FiTarget className="w-6 h-6" />,
      label: "Total Problems",
      value: problemStats?.total || 0,
      trend: problemStats?.easy || 0,
      trendLabel: "Easy",
      gradient: "from-cyan-500 via-cyan-600 to-cyan-700",
      bg: "bg-cyan-500/20",
      color: "text-cyan-400",
      border: "border-cyan-500/30",
      glow: "shadow-cyan-500/20"
    },
    {
      icon: <FiActivity className="w-6 h-6" />,
      label: "Easy Problems",
      value: problemStats?.easy || 0,
      gradient: "from-green-500 via-green-600 to-green-700",
      bg: "bg-green-500/20",
      color: "text-green-400",
      border: "border-green-500/30",
      glow: "shadow-green-500/20"
    },
    {
      icon: <FiAlertTriangle className="w-6 h-6" />,
      label: "Medium Problems",
      value: problemStats?.medium || 0,
      gradient: "from-yellow-500 via-yellow-600 to-yellow-700",
      bg: "bg-yellow-500/20",
      color: "text-yellow-400",
      border: "border-yellow-500/30",
      glow: "shadow-yellow-500/20"
    },
    {
      icon: <FiXCircle className="w-6 h-6" />,
      label: "Hard Problems",
      value: problemStats?.hard || 0,
      gradient: "from-red-500 via-red-600 to-red-700",
      bg: "bg-red-500/20",
      color: "text-red-400",
      border: "border-red-500/30",
      glow: "shadow-red-500/20"
    },
  ];

  const pieData = stats?.languageStats?.slice(0, 6).map((item, index) => ({
    name: item._id,
    value: item.count,
    fill: COLORS[index % COLORS.length]
  })) || [];

  const radarData = stats?.languageStats?.slice(0, 6).map((item) => ({
    language: item._id,
    count: item.count,
    fullMark: Math.max(...(stats?.languageStats?.map(l => l.count) || [1]))
  })) || [];

  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hourData = stats?.hourlyActivity?.find(h => h._id === i);
    return { hour: `${i}:00`, count: hourData?.count || 0 };
  });

  const statusData = stats?.statusBreakdown?.map((item, index) => ({
    name: item._id,
    value: item.count,
    fill: index === 0 ? '#10B981' : '#EF4444'
  })) || [];

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <div className="absolute inset-3 border-4 border-blue-500/20 border-b-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            <FiShield className="absolute inset-0 m-auto w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-gray-400 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/30 rounded-2xl blur-lg animate-pulse" />
                <div className="relative p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl border border-emerald-500/30">
                  <FiShield className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  {getGreeting()}, {adminName}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <FiMail className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-400 text-sm">{adminEmail || "admin@compilehub.com"}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-sm font-medium">Live</span>
              </div>
              <div className="hidden md:block px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <span className="text-gray-400 text-sm">
                  {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span className="text-white text-sm ml-2 font-medium">
                  {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <button
                onClick={fetchStats}
                disabled={refreshing}
                className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} p-[1px]`}
              >
                <div className="relative h-full rounded-2xl bg-[#0d0d1a] p-4 sm:p-6 transition-transform group-hover:scale-[1.02]">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 ${stat.bg} rounded-xl`}>
                      <span className={stat.color}>{stat.icon}</span>
                    </div>
                    {stat.trend !== undefined && typeof stat.trend === 'number' && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${stat.trend > 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                        {stat.trend > 0 ? (
                          <FiArrowUpRight className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <FiArrowDownRight className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-xs font-medium ${stat.trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {stat.trend}
                        </span>
                      </div>
                    )}
                    {typeof stat.trend === 'boolean' && (
                      <div className={`p-2 rounded-lg ${stat.trend ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                        {stat.trend ? (
                          <FiTrendingUp className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <FiTrendingDown className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  {stat.trendLabel && (
                    <p className="text-xs text-gray-600 mt-1">+{stat.trend} {stat.trendLabel}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 rounded-2xl bg-white/[0.03] border border-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FiActivity className="w-5 h-5 text-emerald-400" />
                    Code Activity
                  </h3>
                  <p className="text-sm text-gray-500">Submission trends over time</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Daily</span>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.dailyStats || []}>
                    <defs>
                      <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.5} />
                        <stop offset="50%" stopColor="#10B981" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(13, 13, 26, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)'
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="url(#lineGradient)" strokeWidth={3} fill="url(#dailyGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 backdrop-blur-sm">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FiTarget className="w-5 h-5 text-purple-400" />
                  Language Distribution
                </h3>
                <p className="text-sm text-gray-500">Top programming languages</p>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(13, 13, 26, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-xs text-gray-400 capitalize truncate">{item.name}</span>
                    <span className="text-xs text-gray-600 ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FiUsers className="w-5 h-5 text-blue-400" />
                    Top Contributors
                  </h3>
                  <p className="text-sm text-gray-500">Most active users</p>
                </div>
              </div>
              <div className="space-y-4">
                {stats?.topUsers?.slice(0, 5).map((user, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                      index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                      'bg-gradient-to-br from-blue-500 to-purple-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{user?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || 'No email'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-semibold">{user?.codeCount || 0}</p>
                      <p className="text-xs text-gray-600">codes</p>
                    </div>
                  </div>
                ))}
                {(!stats?.topUsers || stats.topUsers.length === 0) && (
                  <div className="text-center py-8 text-gray-500">No users yet</div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 backdrop-blur-sm">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FiBarChart2 className="w-5 h-5 text-cyan-400" />
                  Language Usage
                </h3>
                <p className="text-sm text-gray-500">By number of submissions</p>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.languageStats?.slice(0, 8) || []} layout="vertical">
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
                    <YAxis dataKey="_id" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} width={50} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(13, 13, 26, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px'
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {stats?.languageStats?.slice(0, 8).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 backdrop-blur-sm">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FiPieChart className="w-5 h-5 text-emerald-400" />
                  Success vs Error
                </h3>
                <p className="text-sm text-gray-500">Compilation status</p>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(13, 13, 26, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-gray-400">Success ({statusData[0]?.value || 0})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-400">Error ({statusData[1]?.value || 0})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FiActivity className="w-5 h-5 text-emerald-400" />
                    Recent Activity
                  </h3>
                  <p className="text-sm text-gray-500">Latest code submissions</p>
                </div>
                <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  View all
                </button>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {stats?.recentCodes?.slice(0, 8).map((code, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold uppercase ${
                      ['bg-gradient-to-br from-blue-500 to-cyan-500', 'bg-gradient-to-br from-purple-500 to-pink-500',
                       'bg-gradient-to-br from-emerald-500 to-teal-500', 'bg-gradient-to-br from-orange-500 to-red-500',
                       'bg-gradient-to-br from-yellow-500 to-orange-500', 'bg-gradient-to-br from-indigo-500 to-purple-500',
                       'bg-gradient-to-br from-pink-500 to-rose-500', 'bg-gradient-to-br from-teal-500 to-cyan-500'][index % 8]
                    }`}>
                      {code.user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{code.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{code.user?.name || 'Anonymous'}</span>
                        <span className="text-xs text-gray-700">•</span>
                        <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-gray-400 uppercase">{code.language}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-500">
                        {new Date(code.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(code.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {(!stats?.recentCodes || stats.recentCodes.length === 0) && (
                  <div className="text-center py-12 text-gray-500">
                    <FiCode className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No recent codes</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FiServer className="w-5 h-5 text-orange-400" />
                    Quick Stats
                  </h3>
                  <p className="text-sm text-gray-500">System overview</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <FiUsers className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-sm text-gray-400">Users</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats?.stats?.totalUsers || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">+{stats?.stats?.newUsersToday || 0} today</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl border border-emerald-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <FiCode className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-sm text-gray-400">Codes</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats?.stats?.totalCodes || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">+{stats?.stats?.newCodesToday || 0} today</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <FiMail className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-sm text-gray-400">Messages</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{contactCount || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Contact messages</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl border border-red-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <FiXCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <span className="text-sm text-gray-400">Errors</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats?.stats?.errorCodes || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">{((stats?.stats?.errorCodes || 0) / (stats?.stats?.totalCodes || 1) * 100).toFixed(1)}% of total</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-xl">
                <h4 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-gray-400" />
                  Hourly Activity
                </h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyData}>
                      <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 8 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 9 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(13, 13, 26, 0.95)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
