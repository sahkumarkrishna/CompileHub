import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiUser, FiCalendar, FiTrash2, FiAlertCircle, FiRefreshCw, FiEye, FiX } from "react-icons/fi";

const AdminErrors = () => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedError, setSelectedError] = useState(null);
  const API_BASE = import.meta.env.VITE_API_ADMIN_URL;

  const fetchErrors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/errors`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 12 }
      });
      if (res.data.success) {
        setErrors(res.data.errors);
        setTotalPages(res.data.totalPages);
        setTotal(res.data.total);
      }
    } catch (err) {
      toast.error("Failed to fetch errors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrors();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this error code?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/code/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Error code deleted");
      fetchErrors();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const languageColors = {
    javascript: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    python: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    java: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    c: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    cpp: "bg-blue-600/20 text-blue-500 border-blue-600/30",
    typescript: "bg-blue-400/20 text-blue-300 border-blue-400/30",
    go: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    rust: "bg-orange-600/20 text-orange-500 border-orange-600/30",
  };

  const errorTypes = [
    { pattern: /syntax/i, label: "Syntax Error", color: "text-red-400" },
    { pattern: /runtime/i, label: "Runtime Error", color: "text-orange-400" },
    { pattern: /undefined/i, label: "Undefined", color: "text-yellow-400" },
    { pattern: /null/i, label: "Null Error", color: "text-pink-400" },
    { pattern: /import|require/i, label: "Import Error", color: "text-purple-400" },
    { pattern: /memory/i, label: "Memory Error", color: "text-cyan-400" },
  ];

  const getErrorType = (output) => {
    for (const type of errorTypes) {
      if (type.pattern.test(output)) return type;
    }
    return { label: "Error", color: "text-red-400" };
  };

  return (
    <div className="min-h-screen pb-8">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 rounded-2xl blur-lg animate-pulse" />
              <div className="relative p-3 sm:p-4 bg-red-500/20 rounded-2xl border border-red-500/30">
                <FiAlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-red-400" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Error Codes</h1>
              <p className="text-gray-400 text-sm">Monitor and manage failed executions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 sm:px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20">
              <span className="text-red-400 font-bold">{total}</span>
              <span className="text-gray-500 ml-1 text-sm">errors</span>
            </div>
            <button
              onClick={fetchErrors}
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
                <div className="w-10 h-10 border-3 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-500">Loading errors...</p>
              </div>
            </div>
          ) : errors.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-gray-400 font-medium">No errors found</p>
              <p className="text-gray-600 text-sm mt-1">All code executions are successful!</p>
            </div>
          ) : errors.map((error) => {
            const errorType = getErrorType(error.output || "");
            const langStyle = languageColors[error.language] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
            
            return (
              <div key={error._id} className="group bg-white/[0.03] border border-red-500/10 rounded-xl p-4 hover:border-red-500/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${langStyle}`}>
                      {error.language}
                    </span>
                    <span className={`text-xs font-medium ${errorType.color}`}>
                      {errorType.label}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedError(error)}
                    className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="text-white font-medium text-sm mb-2 truncate" title={error.title}>
                  {error.title}
                </h3>
                
                <div className="bg-black/40 rounded-lg p-2 font-mono text-[10px] text-red-400/80 mb-3 max-h-16 overflow-hidden">
                  <pre className="truncate">{error.output?.slice(0, 100) || "No output"}</pre>
                </div>

                <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white text-[8px] font-medium">
                      {error.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <span className="truncate max-w-[80px]">{error.user?.name || "Anonymous"}</span>
                  </div>
                  <span>{new Date(error.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="w-8 h-8 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto mb-2"></div>
              Loading...
            </div>
          ) : errors.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FiAlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              No errors found
            </div>
          ) : errors.map((error) => {
            const langStyle = languageColors[error.language] || "bg-gray-500/20 text-gray-400";
            return (
              <div key={error._id} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${langStyle}`}>
                    {error.language}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(error.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-white font-medium text-sm mb-2 truncate">{error.title}</h3>
                <p className="text-xs text-red-400/80 font-mono truncate mb-3">{error.output?.slice(0, 60)}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedError(error)} 
                    className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleDelete(error._id)} 
                    className="py-2 px-3 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white/[0.03] rounded-xl border border-white/5">
            <span className="text-xs sm:text-sm text-gray-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 text-gray-400 rounded-lg text-xs sm:text-sm disabled:opacity-50 hover:bg-white/10">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 text-gray-400 rounded-lg text-xs sm:text-sm disabled:opacity-50 hover:bg-white/10">Next</button>
            </div>
          </div>
        )}
      </div>

      {selectedError && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedError(null)}>
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedError.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${languageColors[selectedError.language] || 'bg-gray-500/20 text-gray-400'}`}>
                    {selectedError.language}
                  </span>
                  <span className="text-xs text-gray-500">
                    {selectedError.user?.name || "Anonymous"}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedError(null)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
              {selectedError.input && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Input</h4>
                  <pre className="bg-black/50 rounded-xl p-4 text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">
                    {selectedError.input}
                  </pre>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-red-400 mb-2">Error Output</h4>
                <pre className="bg-black/50 rounded-xl p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap text-red-400/90">
                  {selectedError.output || "No output"}
                </pre>
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <span>Execution Time: {selectedError.executionTime || "N/A"}</span>
                <span>Memory: {selectedError.memoryUsed || "N/A"}</span>
                <span>Date: {new Date(selectedError.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-white/5 flex justify-end">
              <button 
                onClick={() => { handleDelete(selectedError._id); setSelectedError(null); }}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete Error
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminErrors;
