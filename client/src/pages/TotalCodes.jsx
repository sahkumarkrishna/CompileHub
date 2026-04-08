import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiCode, FiClock, FiPlay, FiArrowRight, FiRefreshCw, FiFilter, FiSearch } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TotalCodesPage = () => {
    const [snippets, setSnippets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ total: 0, languages: {} });

    const fetchTotalCodes = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Please login to view your codes");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/snippets?limit=100`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                const allSnippets = res.data.snippets;
                const total = res.data.pagination.total;
                
                const langCounts = {};
                allSnippets.forEach(s => {
                    langCounts[s.language] = (langCounts[s.language] || 0) + 1;
                });

                setStats({ total, languages: langCounts });
                setSnippets(allSnippets.slice(0, 20));
                setError(null);
            }
        } catch (err) {
            console.error("Failed to fetch codes:", err);
            setError(err.response?.data?.message || "Failed to load codes");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTotalCodes();
    }, []);

    const languageColors = {
        javascript: "#F7DF1E",
        python: "#3776AB",
        java: "#ED8B00",
        c: "#A8B9CC",
        cpp: "#00599C",
        typescript: "#3178C6",
        go: "#00ADD8",
        rust: "#DEA584",
        csharp: "#239120",
        ruby: "#CC342D",
        php: "#777BB4",
        swift: "#FA7343",
        kotlin: "#7F52FF",
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Total Codes</h1>
                    <p className="text-gray-400">View all your saved code snippets</p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-center">
                        {error}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2.5 rounded-xl bg-emerald-500/20">
                                        <FiCode className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <span className="text-sm text-emerald-400 font-semibold">Total Codes</span>
                                </div>
                                <p className="text-4xl font-bold text-white">{stats.total}</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2.5 rounded-xl bg-blue-500/20">
                                        <FiFilter className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <span className="text-sm text-blue-400 font-semibold">Languages Used</span>
                                </div>
                                <p className="text-4xl font-bold text-white">{Object.keys(stats.languages).length}</p>
                            </div>

                            <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2.5 rounded-xl bg-violet-500/20">
                                        <FiRefreshCw className="w-5 h-5 text-violet-400" />
                                    </div>
                                    <span className="text-sm text-violet-400 font-semibold">Recent</span>
                                </div>
                                <p className="text-4xl font-bold text-white">{snippets.length}</p>
                            </div>
                        </div>

                        {Object.keys(stats.languages).length > 0 ? (
                            <div className="bg-gradient-to-b from-[#0a0a14] to-[#0d0d1a] border border-white/5 rounded-2xl overflow-hidden">
                                <div className="p-6 border-b border-white/5">
                                    <h2 className="text-xl font-semibold text-white">Code Breakdown by Language</h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {Object.entries(stats.languages).map(([lang, count]) => (
                                            <div key={lang} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div 
                                                        className="w-3 h-3 rounded-full" 
                                                        style={{ backgroundColor: languageColors[lang?.toLowerCase()] || "#6366F1" }}
                                                    />
                                                    <span className="text-gray-300 font-medium capitalize">{lang}</span>
                                                </div>
                                                <p className="text-2xl font-bold text-white">{count}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-b from-[#0a0a14] to-[#0d0d1a] border border-white/5 rounded-2xl p-8 text-center">
                                <p className="text-gray-400">No codes saved yet. Start coding to see your statistics!</p>
                            </div>
                        )}

                        {snippets.length > 0 && (
                            <div className="mt-8 bg-gradient-to-b from-[#0a0a14] to-[#0d0d1a] border border-white/5 rounded-2xl overflow-hidden">
                                <div className="p-6 border-b border-white/5">
                                    <h2 className="text-xl font-semibold text-white">Recent Codes</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="text-left p-4 text-gray-400 font-medium">Title</th>
                                                <th className="text-left p-4 text-gray-400 font-medium">Language</th>
                                                <th className="text-left p-4 text-gray-400 font-medium">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {snippets.map((snippet) => (
                                                <tr key={snippet._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-4">
                                                        <span className="text-white font-medium">{snippet.title || "Untitled"}</span>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300 capitalize">
                                                            {snippet.language}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-gray-400">
                                                        {new Date(snippet.createdAt).toLocaleDateString()}
                                                    </td>
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

export default TotalCodesPage;