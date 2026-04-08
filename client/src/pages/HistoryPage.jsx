import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiDownload, FiShare2, FiEdit2, FiTrash2, FiSave, FiX, FiCode, FiClock, FiPlay, FiSearch, FiFilter, FiGrid, FiList, FiCopy, FiChevronLeft, FiChevronRight, FiFolder, FiArrowLeft, FiTrash, FiRefreshCw } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const HistoryPage = () => {
    const [snippets, setSnippets] = useState([]);
    const [editingIdx, setEditingIdx] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedCode, setEditedCode] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
    const navigate = useNavigate();

    const itemsPerPage = 9;

    const fetchSnippets = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Please login to view history");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: itemsPerPage,
                ...(selectedLanguage !== "all" && { language: selectedLanguage }),
                ...(searchTerm && { search: searchTerm })
            });

            const res = await axios.get(`${API_URL}/snippets?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setSnippets(res.data.snippets);
                setPagination(res.data.pagination);
                setError(null);
            }
        } catch (err) {
            console.error("Failed to fetch snippets:", err);
            setError(err.response?.data?.message || "Failed to load history");
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, selectedLanguage, searchTerm]);

    useEffect(() => {
        fetchSnippets();
    }, [fetchSnippets]);

    const updateLocalStorage = (updatedSnippets) => {
        setSnippets(updatedSnippets);
    };

    const languages = useMemo(() => {
        const langs = [...new Set(snippets.map(s => s.language).filter(Boolean))];
        return ["all", ...langs];
    }, [snippets]);

    const filteredSnippets = useMemo(() => {
        if (!searchTerm && selectedLanguage === "all") return snippets;
        
        let result = snippets;
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(snippet => 
                snippet.code?.toLowerCase().includes(term) ||
                snippet.language?.toLowerCase().includes(term)
            );
        }
        
        if (selectedLanguage !== "all") {
            result = result.filter(snippet => snippet.language === selectedLanguage);
        }
        
        return result;
    }, [snippets, searchTerm, selectedLanguage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedLanguage]);

    const totalPages = pagination.pages || Math.ceil(filteredSnippets.length / itemsPerPage);
    const paginatedSnippets = filteredSnippets.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedLanguage("all");
    };

    const handleDownload = (snippet) => {
        const safeTitle = snippet.language || "code";
        const element = document.createElement("a");
        const file = new Blob([snippet.code], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = safeTitle + ".txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success("Downloaded successfully!");
    };

    const handleShare = async (snippet) => {
        if (navigator.share) {
            try {
                await navigator.share({ title: snippet.language, text: snippet.code });
                toast.success("Shared successfully!");
            } catch (err) {
                navigator.clipboard.writeText(snippet.code);
                toast.success("Code copied to clipboard!");
            }
        } else {
            navigator.clipboard.writeText(snippet.code);
            toast.success("Code copied to clipboard!");
        }
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        toast.success("Code copied to clipboard!");
    };

    const handleDelete = async (idx) => {
        const snippetToDelete = paginatedSnippets[idx];
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/snippets/${snippetToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Deleted successfully!");
            fetchSnippets();
        } catch (err) {
            const updated = [...snippets];
            updated.splice(idx, 1);
            updateLocalStorage(updated);
            toast.success("Deleted from local!");
        }
    };

    const startEditing = (idx) => {
        setEditingIdx(idx);
        setEditedCode(snippets[idx].code);
    };

    const saveEdit = () => {
        const updated = [...snippets];
        updated[editingIdx].code = editedCode;
        updateLocalStorage(updated);
        setEditingIdx(null);
        toast.success("Updated successfully!");
    };

    const runInCompiler = (snippet) => {
        localStorage.setItem("tempCode", JSON.stringify(snippet));
        navigate("/compileCode");
    };

    const getLanguageColor = (lang) => {
        const colors = {
            python: "bg-emerald-500/20 text-emerald-400",
            javascript: "bg-yellow-500/20 text-yellow-400",
            java: "bg-orange-500/20 text-orange-400",
            c: "bg-blue-500/20 text-blue-400",
            cpp: "bg-purple-500/20 text-purple-400",
            typescript: "bg-blue-400/20 text-blue-300",
            default: "bg-indigo-500/20 text-indigo-400"
        };
        return colors[lang?.toLowerCase()] || colors.default;
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "Just now";
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        if (diff < 60000) return "Just now";
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
        return date.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center">
                <div className="text-center">
                    <FiCode className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">{error}</h2>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030712]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] -translate-x-1/2"></div>
                <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] translate-x-1/2"></div>
                <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition-all"
                >
                    <span className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 border border-white/10 transition-all">
                        <FiArrowLeft className="w-4 h-4" />
                    </span>
                    <span className="text-sm font-medium">Back</span>
                </button>

                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/20">
                                <FiFolder className="w-5 h-5 text-indigo-400" />
                            </div>
                            <span className="text-indigo-400 text-sm font-medium">Your Projects</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white">
                            Code <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">History</span>
                        </h1>
                        <p className="text-gray-400">
                            {pagination.total > 0 ? `${pagination.total} saved snippet${pagination.total !== 1 ? 's' : ''}` : "No saved snippets"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchSnippets}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                            title="Refresh"
                        >
                            <FiRefreshCw className="w-5 h-5 text-gray-400" />
                        </button>
                        <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-indigo-500/20 text-indigo-400" : "text-gray-400 hover:text-white"}`}
                            >
                                <FiGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2.5 rounded-lg transition-all ${viewMode === "list" ? "bg-indigo-500/20 text-indigo-400" : "text-gray-400 hover:text-white"}`}
                            >
                                <FiList className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by title, code, or language..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-10 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 transition-all"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="pl-12 pr-10 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none cursor-pointer appearance-none min-w-[160px]"
                        >
                            {languages.map(lang => (
                                <option key={lang} value={lang} className="bg-gray-900 py-2">
                                    {lang === "all" ? "All Languages" : lang.charAt(0).toUpperCase() + lang.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    {(searchTerm || selectedLanguage !== "all") && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-4 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                        >
                            <FiTrash className="w-4 h-4" />
                            Clear
                        </button>
                    )}
                </div>

                {filteredSnippets.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                            <FiCode className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {searchTerm || selectedLanguage !== "all" ? "No matches found" : "No snippets yet"}
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {searchTerm || selectedLanguage !== "all"
                                ? "Try adjusting your search or filter"
                                : "Start coding to build your collection"}
                        </p>
                        <button
                            onClick={() => navigate("/compileCode")}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all"
                        >
                            <FiPlay className="w-5 h-5" />
                            Start Coding
                        </button>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedSnippets.map((snippet, idx) => (
                            <div
                                key={snippet._id || idx}
                                className="group rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden hover:bg-white/[0.05]"
                            >
                                {editingIdx === idx ? (
                                    <div className="p-6 space-y-4">
                                        <textarea
                                            value={editedCode}
                                            onChange={(e) => setEditedCode(e.target.value)}
                                            className="w-full bg-white/5 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-white/10 font-mono text-sm h-48 resize-none"
                                            placeholder="Code"
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={saveEdit} className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-3 rounded-xl font-semibold transition-all text-sm">
                                                <FiSave className="w-4 h-4" /> Save
                                            </button>
                                            <button onClick={() => setEditingIdx(null)} className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 px-4 py-3 rounded-xl font-semibold transition-all text-sm">
                                                <FiX className="w-4 h-4" /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-6">
                                            <div className="flex items-start justify-between gap-3 mb-4">
                                                <h3 className="text-white font-semibold truncate flex-1 text-base capitalize">
                                                    {snippet.language || "Untitled"}
                                                </h3>
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getLanguageColor(snippet.language)} border border-white/10 flex-shrink-0`}>
                                                    {formatDate(snippet.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="px-6 pb-4">
                                            <pre className="bg-[#0d0d1a] p-5 rounded-xl text-sm overflow-x-auto max-h-48 font-mono text-gray-300 border border-white/5 leading-relaxed">
                                                {snippet.code?.length > 200 ? snippet.code.substring(0, 200) + "..." : snippet.code}
                                            </pre>
                                        </div>
                                        <div className="px-6 pb-6 flex gap-2">
                                            <button
                                                onClick={() => runInCompiler(snippet)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-3 rounded-xl font-semibold transition-all text-sm text-white shadow-lg shadow-emerald-500/20"
                                            >
                                                <FiPlay className="w-4 h-4" /> Run Code
                                            </button>
                                            <button onClick={() => handleCopy(snippet.code)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all" title="Copy">
                                                <FiCopy className="w-5 h-5 text-gray-400" />
                                            </button>
                                            <button onClick={() => startEditing(idx)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all" title="Edit">
                                                <FiEdit2 className="w-5 h-5 text-gray-400" />
                                            </button>
                                            <button onClick={() => handleShare(snippet)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all" title="Share">
                                                <FiShare2 className="w-5 h-5 text-gray-400" />
                                            </button>
                                            <button onClick={() => handleDownload(snippet)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all" title="Download">
                                                <FiDownload className="w-5 h-5 text-gray-400" />
                                            </button>
                                            <button onClick={() => handleDelete(idx)} className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all" title="Delete">
                                                <FiTrash2 className="w-5 h-5 text-red-400" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {paginatedSnippets.map((snippet, idx) => (
                            <div
                                key={snippet._id || idx}
                                className="rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-5 flex flex-col lg:flex-row lg:items-center gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h3 className="text-white font-semibold truncate capitalize">{snippet.language || "Untitled"}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLanguageColor(snippet.language)} border border-white/10`}>
                                                {snippet.language || "Code"}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                                <FiClock className="w-3 h-3" />
                                                {formatDate(snippet.createdAt)}
                                            </span>
                                        </div>
                                        <pre className="bg-[#0d0d1a] p-3 rounded-lg text-xs font-mono text-gray-400 overflow-x-auto max-h-24 border border-white/5">
                                            {snippet.code?.length > 400 ? snippet.code.substring(0, 400) + "..." : snippet.code}
                                        </pre>
                                    </div>
                                    <div className="flex flex-wrap gap-2 lg:flex-shrink-0">
                                        <button onClick={() => runInCompiler(snippet)} className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg font-medium text-sm text-white transition-all">
                                            <FiPlay className="w-4 h-4" /> Run
                                        </button>
                                        <button onClick={() => handleCopy(snippet.code)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                                            <FiCopy className="w-4 h-4 text-gray-400" />
                                        </button>
                                        <button onClick={() => startEditing(idx)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                                            <FiEdit2 className="w-4 h-4 text-gray-400" />
                                        </button>
                                        <button onClick={() => handleShare(snippet)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                                            <FiShare2 className="w-4 h-4 text-gray-400" />
                                        </button>
                                        <button onClick={() => handleDownload(snippet)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                                            <FiDownload className="w-4 h-4 text-gray-400" />
                                        </button>
                                        <button onClick={() => handleDelete(idx)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all">
                                            <FiTrash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <FiChevronLeft className="w-5 h-5 text-gray-400" />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-xl font-medium transition-all ${
                                    currentPage === i + 1
                                        ? "bg-indigo-500 text-white"
                                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <FiChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
