import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiUser, FiCalendar, FiCode, FiCheck, FiX, FiEye,
  FiSearch, FiChevronDown, FiLoader, FiMail, FiClock, FiHardDrive
} from "react-icons/fi";

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("success");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const API_BASE = import.meta.env.VITE_API_ADMIN_URL;

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}submissions`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, search, status: statusFilter !== 'all' ? statusFilter : '', limit: 20 }
      });
      if (res.data.success) {
        setSubmissions(res.data.submissions);
        setTotalPages(res.data.totalPages);
        setTotal(res.data.total);
      }
    } catch (err) {
      toast.error("Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [page, search, statusFilter]);

  const languageColors = {
    javascript: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
    python: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
    java: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
    c: { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30" },
    cpp: { bg: "bg-blue-600/20", text: "text-blue-500", border: "border-blue-600/30" },
    typescript: { bg: "bg-blue-400/20", text: "text-blue-300", border: "border-blue-400/30" },
    go: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" },
    rust: { bg: "bg-orange-600/20", text: "text-orange-500", border: "border-orange-600/30" },
    swift: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
    kotlin: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
    csharp: { bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/30" },
    ruby: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
    php: { bg: "bg-indigo-500/20", text: "text-indigo-400", border: "border-indigo-500/30" },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getAvatarGradient = (index) => {
    const gradients = [
      'from-rose-500 to-pink-500',
      'from-violet-500 to-purple-500',
      'from-indigo-500 to-blue-500',
      'from-cyan-500 to-teal-500',
      'from-emerald-500 to-green-500',
      'from-amber-500 to-orange-500',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030712] via-[#0a0a14] to-[#0f0f1a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Submissions
              </span>
            </h1>
            <p className="text-gray-400 mt-1">View all user submissions with details</p>
          </div>
          <div className="text-sm text-gray-500">
            Total: <span className="text-white font-medium">{total}</span> submissions
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by user name, email or problem title..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="appearance-none px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 cursor-pointer"
            >
              <option value="success">Passed</option>
              <option value="failed">Failed</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <FiLoader className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-16">
              <FiCode className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Problem</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Language</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Memory</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Submitted</th>
                    <th className="text-right py-4 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, index) => {
                    const langStyle = languageColors[sub.language] || { bg: "bg-gray-500/20", text: "text-gray-400" };
                    const difficultyColors = {
                      Easy: 'bg-emerald-500/20 text-emerald-400',
                      Medium: 'bg-yellow-500/20 text-yellow-400',
                      Hard: 'bg-red-500/20 text-red-400',
                      Best: 'bg-purple-500/20 text-purple-400'
                    };
                    return (
                      <tr key={sub._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(sub.status)}`}>
                            {sub.status === 'success' ? (
                              <span className="flex items-center gap-1">
                                <FiCheck className="w-3 h-3" /> Passed
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <FiX className="w-3 h-3" /> Failed
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white text-sm">{sub.problemTitle || 'N/A'}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${difficultyColors[sub.difficulty] || 'bg-gray-500/20 text-gray-400'}`}>
                            {sub.difficulty || 'Easy'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${langStyle.bg} ${langStyle.text}`}>
                            {sub.language || 'javascript'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-400 text-sm flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            {sub.executionTime ? `${sub.executionTime}ms` : '0ms'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-400 text-sm flex items-center gap-1">
                            <FiHardDrive className="w-3 h-3" />
                            {sub.memoryUsed ? `${sub.memoryUsed}KB` : '0KB'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarGradient(index)} flex items-center justify-center text-white text-xs font-medium`}>
                              {sub.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">{sub.user?.name || 'Anonymous'}</p>
                              <p className="text-gray-500 text-xs">{sub.user?.email || ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-500 text-sm">
                          {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-500 text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Modal for viewing submission details */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0a14] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Submission Details</h2>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(0)} flex items-center justify-center text-white font-medium`}>
                    {selectedSubmission.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{selectedSubmission.user?.name || 'Anonymous'}</p>
                    <p className="text-gray-500 text-sm">{selectedSubmission.user?.email || 'No email'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-gray-500 text-xs mb-1">Problem</p>
                    <p className="text-white font-medium">{selectedSubmission.problemTitle}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-gray-500 text-xs mb-1">Language</p>
                    <p className="text-white font-medium">{selectedSubmission.language}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-gray-500 text-xs mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(selectedSubmission.status)}`}>
                      {selectedSubmission.status}
                    </span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-gray-500 text-xs mb-1">Date</p>
                    <p className="text-white font-medium">
                      {selectedSubmission.createdAt ? new Date(selectedSubmission.createdAt).toLocaleString() : '-'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-2">Code</p>
                  <pre className="bg-[#1e1e1e] p-4 rounded-xl text-gray-300 text-sm overflow-x-auto max-h-64">
                    {selectedSubmission.code || 'No code'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubmissions;