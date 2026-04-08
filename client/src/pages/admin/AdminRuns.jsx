import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiPlay, FiUser, FiCalendar, FiClock, FiEye, FiCheckCircle,
  FiXCircle, FiRefreshCw, FiX, FiTerminal, FiDatabase
} from "react-icons/fi";

const AdminRuns = () => {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedRun, setSelectedRun] = useState(null);
  const API_BASE = import.meta.env.VITE_API_ADMIN_URL;

  const fetchRuns = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}runs`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 12 }
      });
      if (res.data.success) {
        setRuns(res.data.runs);
        setTotalPages(res.data.totalPages);
        setTotal(res.data.total);
      }
    } catch (err) {
      toast.error("Failed to fetch runs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRuns();
  }, [page]);

  const languageColors = {
    javascript: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
    python: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
    java: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
    c: { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30" },
    cpp: { bg: "bg-blue-600/20", text: "text-blue-500", border: "border-blue-600/30" },
    typescript: { bg: "bg-blue-400/20", text: "text-blue-300", border: "border-blue-400/30" },
    go: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" },
    rust: { bg: "bg-orange-600/20", text: "text-orange-500", border: "border-orange-600/30" },
    ruby: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
    php: { bg: "bg-indigo-500/20", text: "text-indigo-400", border: "border-indigo-500/30" },
    swift: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
    kotlin: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
    csharp: { bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/30" },
    bash: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
  };

  const isError = (output) => output && /error|Error|exception|Exception/i.test(output);
  const isSuccess = (output) => output && !isError(output);

  const getAvatarGradient = (index) => {
    const gradients = [
      "from-pink-500 to-purple-500", "from-blue-500 to-cyan-500",
      "from-emerald-500 to-teal-500", "from-orange-500 to-red-500",
      "from-yellow-500 to-orange-500", "from-indigo-500 to-purple-500",
      "from-fuchsia-500 to-pink-500", "from-teal-500 to-cyan-500"
    ];
    return gradients[index % gradients.length];
  };

  const successCount = runs.filter(r => isSuccess(r.output)).length;
  const errorCount = runs.filter(r => isError(r.output)).length;

  return (
    <div className="min-h-screen pb-8">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-pink-500/30 rounded-2xl blur-lg animate-pulse" />
                <div className="relative p-3 sm:p-4 bg-pink-500/20 rounded-2xl border border-pink-500/30">
                  <FiPlay className="w-6 h-6 sm:w-7 sm:h-7 text-pink-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">All Runs</h1>
                <p className="text-gray-400 text-sm">Monitor code executions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 sm:px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <FiCheckCircle className="w-4 h-4 text-emerald-400 inline mr-1" />
                <span className="text-emerald-400 font-bold">{successCount}</span>
              </div>
              <div className="px-3 sm:px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20">
                <FiXCircle className="w-4 h-4 text-red-400 inline mr-1" />
                <span className="text-red-400 font-bold">{errorCount}</span>
              </div>
              <button
                onClick={fetchRuns}
                disabled={loading}
                className="p-2 sm:p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-10 h-10 border-3 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-500">Loading runs...</p>
                </div>
              </div>
            ) : runs.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiTerminal className="w-8 h-8 text-pink-400" />
                </div>
                <p className="text-gray-400 font-medium">No runs found</p>
                <p className="text-gray-600 text-sm mt-1">All executions will appear here</p>
              </div>
            ) : runs.map((run, index) => {
              const langStyle = languageColors[run.language] || { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30" };
              const hasError = isError(run.output);
              const hasSuccess = isSuccess(run.output);
              
              return (
                <div
                  key={run._id}
                  className="group bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:border-pink-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${langStyle.bg} ${langStyle.text}`}>
                        {run.language}
                      </span>
                      {hasError && <FiXCircle className="w-4 h-4 text-red-400" />}
                      {hasSuccess && <FiCheckCircle className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <button
                      onClick={() => setSelectedRun(run)}
                      className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-500/30"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-white font-medium text-sm mb-2 truncate" title={run.title}>
                    {run.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${getAvatarGradient(index)} flex items-center justify-center text-white text-[8px] font-medium`}>
                      {run.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <span className="truncate">{run.user?.name || "Anonymous"}</span>
                  </div>

                  {run.output && (
                    <div className="bg-black/40 rounded-lg p-2 font-mono text-[10px] sm:text-xs mb-3 max-h-16 overflow-hidden">
                      <pre className={`${hasError ? 'text-red-400' : 'text-gray-400'} truncate`}>
                        {run.output.slice(0, 100)}
                      </pre>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      {new Date(run.createdAt).toLocaleDateString()}
                    </span>
                    {run.executionTime && (
                      <span className="flex items-center gap-1 text-pink-400">
                        <FiClock className="w-3 h-3" />
                        {run.executionTime}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="md:hidden space-y-3">
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-8 h-8 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mx-auto mb-2"></div>
                Loading...
              </div>
            ) : runs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FiPlay className="w-12 h-12 mx-auto mb-3 opacity-50" />
                No runs found
              </div>
            ) : runs.map((run) => {
              const langStyle = languageColors[run.language] || { bg: "bg-gray-500/20", text: "text-gray-400" };
              const hasError = isError(run.output);
              
              return (
                <div key={run._id} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${langStyle.bg} ${langStyle.text}`}>
                        {run.language}
                      </span>
                      {hasError ? (
                        <FiXCircle className="w-4 h-4 text-red-400" />
                      ) : (
                        <FiCheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(run.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-white font-medium text-sm mb-2 truncate">{run.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{run.user?.name || "Anonymous"}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedRun(run)} 
                      className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium"
                    >
                      View Output
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white/[0.03] rounded-xl border border-white/5">
              <span className="text-xs sm:text-sm text-gray-500">
                Page {page} of {totalPages} ({total} runs)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 text-gray-400 rounded-lg text-xs sm:text-sm disabled:opacity-50 hover:bg-white/10"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 text-gray-400 rounded-lg text-xs sm:text-sm disabled:opacity-50 hover:bg-white/10"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedRun && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedRun(null)}>
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedRun.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${languageColors[selectedRun.language]?.bg || 'bg-gray-500/20'} ${languageColors[selectedRun.language]?.text || 'text-gray-400'}`}>
                    {selectedRun.language}
                  </span>
                  <span className="text-xs text-gray-500">
                    {selectedRun.user?.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs text-gray-500">
                    {new Date(selectedRun.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedRun(null)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {selectedRun.input && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    Input
                  </h4>
                  <pre className="bg-black/50 rounded-xl p-4 text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">
                    {selectedRun.input}
                  </pre>
                </div>
              )}
              <div>
                <h4 className={`text-sm font-medium mb-2 flex items-center gap-2 ${isError(selectedRun.output) ? 'text-red-400' : 'text-gray-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${isError(selectedRun.output) ? 'bg-red-400' : 'bg-purple-400'}`}></span>
                  Output
                </h4>
                <pre className={`bg-black/50 rounded-xl p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap ${
                  isError(selectedRun.output) ? 'text-red-400' : 'text-gray-300'
                }`}>
                  {selectedRun.output || "No output"}
                </pre>
              </div>
              <div className="flex items-center gap-6 mt-4 text-xs text-gray-500">
                {selectedRun.executionTime && (
                  <span className="flex items-center gap-1">
                    <FiClock className="w-4 h-4" />
                    {selectedRun.executionTime}
                  </span>
                )}
                {selectedRun.memoryUsed && (
                  <span className="flex items-center gap-1">
                    <FiDatabase className="w-4 h-4" />
                    {selectedRun.memoryUsed}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRuns;
