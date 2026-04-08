import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiBarChart2, FiUsers, FiCode, FiPlay, FiAlertTriangle,
  FiTrendingUp, FiCalendar, FiRefreshCw, FiActivity, FiTarget
} from "react-icons/fi";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from "recharts";

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const API_BASE = import.meta.env.VITE_API_ADMIN_URL;

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setStats(res.data);
      }
    } catch (err) {
      toast.error("Failed to fetch statistics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#06B6D4', '#EF4444', '#6366F1'];

  const pieData = stats?.languageStats?.slice(0, 8).map((item, index) => ({
    name: item._id,
    value: item.count,
    fill: COLORS[index % COLORS.length]
  })) || [];

  const statCards = [
    {
      icon: <FiUsers className="w-6 h-6" />,
      label: "Total Users",
      value: stats?.stats?.totalUsers || 0,
      trend: stats?.stats?.newUsersToday || 0,
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-500/20",
      color: "text-blue-400",
      border: "border-blue-500/30"
    },
    {
      icon: <FiCode className="w-6 h-6" />,
      label: "Total Codes",
      value: stats?.stats?.totalCodes || 0,
      trend: stats?.stats?.newCodesToday || 0,
      gradient: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-500/20",
      color: "text-emerald-400",
      border: "border-emerald-500/30"
    },
    {
      icon: <FiPlay className="w-6 h-6" />,
      label: "Successful Runs",
      value: stats?.stats?.successfulRuns || 0,
      gradient: "from-purple-500 to-purple-600",
      bg: "bg-purple-500/20",
      color: "text-purple-400",
      border: "border-purple-500/30"
    },
    {
      icon: <FiAlertTriangle className="w-6 h-6" />,
      label: "Error Codes",
      value: stats?.stats?.errorCodes || 0,
      trend: `-${((stats?.stats?.errorCodes || 0) / (stats?.stats?.totalCodes || 1) * 100).toFixed(1)}%`,
      gradient: "from-red-500 to-red-600",
      bg: "bg-red-500/20",
      color: "text-red-400",
      border: "border-red-500/30"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <div className="absolute inset-3 border-4 border-purple-500/20 border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            <FiBarChart2 className="absolute inset-0 m-auto w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <p className="text-gray-400">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/30 rounded-2xl blur-lg animate-pulse" />
                <div className="relative p-3 sm:p-4 bg-cyan-500/20 rounded-2xl border border-cyan-500/30">
                  <FiBarChart2 className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Statistics</h1>
                <p className="text-gray-400 text-sm">Platform analytics and insights</p>
              </div>
            </div>
            <button
              onClick={fetchStats}
              disabled={refreshing}
              className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <FiRefreshCw className={`w-4 h-4 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm text-gray-400">Refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} p-[1px]`}
              >
                <div className="relative h-full rounded-2xl bg-[#0d0d1a] p-4 sm:p-5 transition-transform group-hover:scale-[1.02]">
                  <div className={`p-2 sm:p-3 ${stat.bg} rounded-xl w-fit mb-3`}>
                    <span className={stat.color}>{stat.icon}</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
                  {stat.trend !== undefined && (
                    <p className="text-xs text-gray-600 mt-2">+{stat.trend} today</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 sm:p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                    <FiTarget className="w-5 h-5 text-purple-400" />
                    Language Distribution
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">Top programming languages</p>
                </div>
              </div>
              <div className="h-52 sm:h-64">
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

            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 sm:p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                    <FiActivity className="w-5 h-5 text-emerald-400" />
                    Daily Activity
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">Last 30 days</p>
                </div>
              </div>
              <div className="h-52 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.dailyStats || []}>
                    <defs>
                      <linearGradient id="statsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(13, 13, 26, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px'
                      }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} fill="url(#statsGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <FiTrendingUp className="w-5 h-5 text-cyan-400" />
                  Top Languages by Usage
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">Ranked by submission count</p>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {stats?.languageStats?.slice(0, 8).map((lang, index) => {
                const maxCount = stats?.languageStats?.[0]?.count || 1;
                const percentage = (lang.count / maxCount) * 100;
                return (
                  <div key={index} className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                      index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                      'bg-gradient-to-br from-blue-500 to-purple-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-white font-medium capitalize w-20 sm:w-24 text-sm">{lang._id}</span>
                    <div className="flex-1 bg-white/5 rounded-full h-2 sm:h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: COLORS[index % COLORS.length] }}
                      />
                    </div>
                    <span className="text-gray-400 text-xs sm:text-sm w-10 sm:w-12 text-right font-medium">{lang.count}</span>
                  </div>
                );
              })}
              {(!stats?.languageStats || stats.languageStats.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <FiCode className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No language data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 sm:p-6 backdrop-blur-sm">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FiCalendar className="w-5 h-5 text-blue-400" />
                Success Rate
              </h3>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke="#10B981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(stats?.stats?.successRate || 0) * 2.83} 283`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-bold text-white">{stats?.stats?.successRate || 0}%</span>
                    <span className="text-xs text-gray-500">Success</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-gray-400">Success ({stats?.stats?.successfulRuns || 0})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-gray-400">Error ({stats?.stats?.errorCodes || 0})</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 sm:p-6 backdrop-blur-sm">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FiActivity className="w-5 h-5 text-cyan-400" />
                Recent Activity
              </h3>
              <div className="space-y-3 max-h-48 sm:max-h-56 overflow-y-auto">
                {stats?.recentCodes?.slice(0, 6).map((code, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 sm:p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                      ['bg-gradient-to-br from-blue-500 to-cyan-500', 'bg-gradient-to-br from-purple-500 to-pink-500',
                       'bg-gradient-to-br from-emerald-500 to-teal-500', 'bg-gradient-to-br from-orange-500 to-red-500',
                       'bg-gradient-to-br from-yellow-500 to-orange-500', 'bg-gradient-to-br from-indigo-500 to-purple-500'][index % 6]
                    }`}>
                      {code.user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-xs sm:text-sm truncate">{code.title}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">{code.user?.name || 'Anonymous'} · {code.language}</p>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500 flex-shrink-0">
                      {new Date(code.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
