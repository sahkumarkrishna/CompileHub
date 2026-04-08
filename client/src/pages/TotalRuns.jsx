import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiPlay, FiClock, FiActivity, FiTrendingUp, FiRefreshCw } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TotalRunsPage = () => {
    const [stats, setStats] = useState({
        totalRuns: 0,
        weeklyRuns: [],
        dailyStats: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Please login to view runs");
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
                    totalRuns: res.data.stats.totalRuns,
                    weeklyRuns: res.data.weeklyData,
                    dailyStats: res.data.monthlyData
                });
                setError(null);
            }
        } catch (err) {
            console.error("Failed to fetch stats:", err);
            setError(err.response?.data?.message || "Failed to load stats");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const getDailyRunCount = () => {
        if (!stats.weeklyRuns.length) return 0;
        return stats.weeklyRuns.reduce((sum, day) => sum + (day.runs || 0), 0);
    };

    const getAverageRuns = () => {
        if (!stats.weeklyRuns.length) return 0;
        const total = stats.weeklyRuns.reduce((sum, day) => sum + (day.runs || 0), 0);
        return Math.round(total / stats.weeklyRuns.length);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Total Runs</h1>
                    <p className="text-gray-400">Track your code execution history</p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-center">
                        {error}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2.5 rounded-xl bg-blue-500/20">
                                        <FiPlay className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <span className="text-sm text-blue-400 font-semibold">Total Runs</span>
                                </div>
                                <p className="text-4xl font-bold text-white">{stats.totalRuns}</p>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2.5 rounded-xl bg-emerald-500/20">
                                        <FiActivity className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <span className="text-sm text-emerald-400 font-semibold">Daily Average</span>
                                </div>
                                <p className="text-4xl font-bold text-white">{getAverageRuns()}</p>
                            </div>

                            <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2.5 rounded-xl bg-violet-500/20">
                                        <FiTrendingUp className="w-5 h-5 text-violet-400" />
                                    </div>
                                    <span className="text-sm text-violet-400 font-semibold">This Week</span>
                                </div>
                                <p className="text-4xl font-bold text-white">{getDailyRunCount()}</p>
                            </div>

                            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2.5 rounded-xl bg-orange-500/20">
                                        <FiClock className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <span className="text-sm text-orange-400 font-semibold">Days Active</span>
                                </div>
                                <p className="text-4xl font-bold text-white">{stats.weeklyRuns.filter(d => d.codes > 0).length}</p>
                            </div>
                        </div>

                        {stats.weeklyRuns.length > 0 ? (
                            <div className="bg-gradient-to-b from-[#0a0a14] to-[#0d0d1a] border border-white/5 rounded-2xl overflow-hidden">
                                <div className="p-6 border-b border-white/5">
                                    <h2 className="text-xl font-semibold text-white">Last 7 Days Activity</h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-7 gap-4">
                                        {stats.weeklyRuns.map((day, index) => (
                                            <div key={index} className="text-center">
                                                <div className="bg-white/5 rounded-xl p-4 mb-2 border border-white/5">
                                                    <p className="text-2xl font-bold text-white">{day.runs || 0}</p>
                                                </div>
                                                <p className="text-gray-400 text-sm">{day.day || `Day ${index + 1}`}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-b from-[#0a0a14] to-[#0d0d1a] border border-white/5 rounded-2xl p-8 text-center">
                                <p className="text-gray-400">No run data yet. Start running code to see your statistics!</p>
                            </div>
                        )}

                        {stats.dailyStats.length > 0 && (
                            <div className="mt-8 bg-gradient-to-b from-[#0a0a14] to-[#0d0d1a] border border-white/5 rounded-2xl overflow-hidden">
                                <div className="p-6 border-b border-white/5">
                                    <h2 className="text-xl font-semibold text-white">Monthly Overview</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                                                <th className="text-left p-4 text-gray-400 font-medium">Runs</th>
                                                <th className="text-left p-4 text-gray-400 font-medium">Codes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.dailyStats.slice(-10).map((day, index) => (
                                                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-4 text-gray-300">{day.name || "Day"}</td>
                                                    <td className="p-4">
                                                        <span className="text-blue-400 font-semibold">{day.runs || 0}</span>
                                                    </td>
                                                    <td className="p-4 text-gray-400">{day.codes || 0}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TotalRunsPage;