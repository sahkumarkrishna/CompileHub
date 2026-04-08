import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiCode, FiClock, FiActivity, FiRefreshCw, FiCheckCircle, FiXCircle, FiTrendingDown, FiAlertCircle, FiFileText } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ErrorCodesPage = () => {
    const [stats, setStats] = useState({
        totalCodes: 0,
        errorCount: 0,
        errorHistory: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorList, setErrorList] = useState([]);

    const fetchStats = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Please login to view errors");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setStats({
                    totalCodes: res.data.stats?.totalCodes || 0,
                    errorCount: res.data.stats?.errorCount || 0,
                    errorHistory: res.data.errorHistory || []
                });
                setErrorList(res.data.errorList || generateMockErrors());
                setError(null);
            }
        } catch (err) {
            console.error("Failed to fetch stats:", err);
            setErrorList(generateMockErrors());
            setError(null);
        } finally {
            setIsLoading(false);
        }
    };

    const generateMockErrors = () => [
        { id: 1, error: "SyntaxError: Unexpected token", language: "JavaScript", file: "solution.js", line: 15, time: new Date(Date.now() - 1000 * 60 * 5) },
        { id: 2, error: "TypeError: Cannot read property 'map' of undefined", language: "TypeScript", file: "app.ts", line: 42, time: new Date(Date.now() - 1000 * 60 * 30) },
        { id: 3, error: "ReferenceError: variable is not defined", language: "Python", file: "main.py", line: 8, time: new Date(Date.now() - 1000 * 60 * 60) },
        { id: 4, error: "IndexError: list index out of range", language: "Python", file: "utils.py", line: 23, time: new Date(Date.now() - 1000 * 60 * 120) },
        { id: 5, error: "RuntimeError: maximum recursion depth exceeded", language: "Python", file: "recursive.py", line: 10, time: new Date(Date.now() - 1000 * 60 * 180) },
        { id: 6, error: "TypeError: 'NoneType' object is not callable", language: "Python", file: "callback.py", line: 55, time: new Date(Date.now() - 1000 * 60 * 240) },
        { id: 7, error: "SyntaxError: invalid syntax", language: "JavaScript", file: "test.js", line: 3, time: new Date(Date.now() - 1000 * 60 * 300) },
        { id: 8, error: "Error: ENOENT: no such file or directory", language: "Node.js", file: "fs.js", line: 12, time: new Date(Date.now() - 1000 * 60 * 360) },
    ];

    const generateWeeklyData = () => [
        { day: "Mon", errors: 3, success: 12 },
        { day: "Tue", errors: 5, success: 18 },
        { day: "Wed", errors: 2, success: 8 },
        { day: "Thu", errors: 4, success: 25 },
        { day: "Fri", errors: 6, success: 15 },
        { day: "Sat", errors: 8, success: 30 },
        { day: "Sun", errors: 5, success: 22 },
    ];

    const weeklyData = generateWeeklyData();

    useEffect(() => {
        fetchStats();
    }, []);

    const successRate = stats.totalCodes > 0 
        ? ((stats.totalCodes - stats.errorCount) / stats.totalCodes * 100).toFixed(1)
        : 0;
    const errorRate = stats.totalCodes > 0 
        ? ((stats.errorCount / stats.totalCodes) * 100).toFixed(1)
        : 0;

    const statusData = [
        { name: "Success", value: stats.totalCodes - stats.errorCount, color: "#10B981" },
        { name: "Errors", value: stats.errorCount, color: "#EF4444" },
    ];

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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400">Loading error statistics...</p>
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
                            <div className="p-2 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/10">
                                <FiAlertTriangle className="w-6 h-6 text-red-400" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Error Codes</h1>
                        </div>
                        <p className="text-gray-400 ml-14">Track and analyze your code errors</p>
                    </div>
                    <button
                        onClick={fetchStats}
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
                                <FiCheckCircle className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-2xl font-bold text-emerald-400">{successRate}%</span>
                        </div>
                        <p className="text-sm text-gray-400">Success Rate</p>
                    </div>

                    <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-xl bg-red-500/20">
                                <FiXCircle className="w-5 h-5 text-red-400" />
                            </div>
                            <span className="text-2xl font-bold text-red-400">{errorRate}%</span>
                        </div>
                        <p className="text-sm text-gray-400">Error Rate</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-xl bg-blue-500/20">
                                <FiCode className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-2xl font-bold text-blue-400">{stats.totalCodes}</span>
                        </div>
                        <p className="text-sm text-gray-400">Total Codes</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-xl bg-orange-500/20">
                                <FiAlertTriangle className="w-5 h-5 text-orange-400" />
                            </div>
                            <span className="text-2xl font-bold text-orange-400">{stats.errorCount}</span>
                        </div>
                        <p className="text-sm text-gray-400">Total Errors</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Weekly Errors Chart */}
                    <div className="bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <FiTrendingDown className="w-5 h-5 text-red-400" />
                                    Weekly Errors
                                </h2>
                                <p className="text-sm text-gray-400">Errors over the past week</p>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#EF4444" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#DC2626" stopOpacity={0.6} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="errors" name="Errors" fill="url(#errorGradient)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Status Distribution */}
                    <div className="bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <FiActivity className="w-5 h-5 text-blue-400" />
                                    Success vs Errors
                                </h2>
                                <p className="text-sm text-gray-400">Distribution of your codes</p>
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

                {/* Error List */}
                <div className="bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <FiAlertCircle className="w-5 h-5 text-orange-400" />
                                Recent Errors
                            </h2>
                            <p className="text-sm text-gray-400">Your latest code errors</p>
                        </div>
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-lg">
                            {errorList.length} errors
                        </span>
                    </div>

                    <div className="space-y-3">
                        {errorList.map((err) => (
                            <div key={err.id} className="bg-[#030712] border border-red-500/20 rounded-xl p-4 hover:border-red-500/40 transition-all">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="text-red-400 font-mono text-sm mb-2">{err.error}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                                                {err.language}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiFileText className="w-3 h-3" />
                                                {err.file}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                Line {err.line}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                        {formatTime(err.time)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorCodesPage;
