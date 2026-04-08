import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiCode, FiSearch, FiTrash2, FiCalendar, FiPlay,
  FiEye, FiRefreshCw, FiX, FiTerminal, FiChevronDown, FiCheck
} from "react-icons/fi";

const AdminCodes = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [selectedCode, setSelectedCode] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const API_BASE = import.meta.env.VITE_API_ADMIN_URL;

  const languages = [
    { id: "javascript", name: "JavaScript", color: "from-yellow-500 to-amber-500" },
    { id: "python", name: "Python", color: "from-blue-500 to-cyan-500" },
    { id: "java", name: "Java", color: "from-orange-500 to-red-500" },
    { id: "c", name: "C", color: "from-gray-500 to-slate-500" },
    { id: "cpp", name: "C++", color: "from-blue-600 to-blue-400" },
    { id: "typescript", name: "TypeScript", color: "from-blue-400 to-blue-300" },
    { id: "go", name: "Go", color: "from-cyan-500 to-teal-500" },
    { id: "rust", name: "Rust", color: "from-orange-600 to-orange-400" },
    { id: "ruby", name: "Ruby", color: "from-red-500 to-pink-500" },
    { id: "php", name: "PHP", color: "from-indigo-500 to-purple-500" },
    { id: "swift", name: "Swift", color: "from-orange-400 to-yellow-500" },
    { id: "kotlin", name: "Kotlin", color: "from-purple-500 to-violet-500" },
    { id: "csharp", name: "C#", color: "from-violet-500 to-purple-400" },
    { id: "bash", name: "Bash", color: "from-green-500 to-emerald-500" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCodes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}codes`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, search, language, limit: 12 }
      });
      if (res.data.success) {
        setCodes(res.data.codes);
        setTotalPages(res.data.totalPages);
        setTotal(res.data.total);
      }
    } catch (err) {
      toast.error("Failed to fetch codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, [page, search, language]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this code?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}code/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Code deleted");
      fetchCodes();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const languageColors = {
    javascript: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30", gradient: "from-yellow-500 to-amber-500" },
    python: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30", gradient: "from-blue-500 to-cyan-500" },
    java: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30", gradient: "from-orange-500 to-red-500" },
    c: { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30", gradient: "from-gray-500 to-slate-500" },
    cpp: { bg: "bg-blue-600/20", text: "text-blue-500", border: "border-blue-600/30", gradient: "from-blue-600 to-blue-400" },
    typescript: { bg: "bg-blue-400/20", text: "text-blue-300", border: "border-blue-400/30", gradient: "from-blue-400 to-blue-300" },
    go: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30", gradient: "from-cyan-500 to-teal-500" },
    rust: { bg: "bg-orange-600/20", text: "text-orange-500", border: "border-orange-600/30", gradient: "from-orange-600 to-orange-400" },
    ruby: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30", gradient: "from-red-500 to-pink-500" },
    php: { bg: "bg-indigo-500/20", text: "text-indigo-400", border: "border-indigo-500/30", gradient: "from-indigo-500 to-purple-500" },
    swift: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30", gradient: "from-orange-400 to-yellow-500" },
    kotlin: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30", gradient: "from-purple-500 to-violet-500" },
    csharp: { bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/30", gradient: "from-violet-500 to-purple-400" },
    bash: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30", gradient: "from-green-500 to-emerald-500" },
  };

  const getLanguageName = (id) => languages.find(l => l.id === id)?.name || id;

  const getAvatarGradient = (index) => {
    const gradients = [
      "from-blue-500 to-cyan-500", "from-purple-500 to-pink-500",
      "from-emerald-500 to-teal-500", "from-orange-500 to-red-500",
      "from-yellow-500 to-orange-500", "from-indigo-500 to-purple-500",
      "from-pink-500 to-rose-500", "from-teal-500 to-cyan-500"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen pb-8">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 rounded-2xl blur-lg animate-pulse" />
                <div className="relative p-3 sm:p-4 bg-purple-500/20 rounded-2xl border border-purple-500/30">
                  <FiCode className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">All Codes</h1>
                <p className="text-gray-400 text-sm">View and manage code submissions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 sm:px-4 py-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <span className="text-purple-400 font-bold">{total}</span>
                <span className="text-gray-500 ml-1 text-sm">codes</span>
              </div>
              <button
                onClick={fetchCodes}
                disabled={loading}
                className="p-2 sm:p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by title or code..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full sm:w-[180px] px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm flex items-center justify-between gap-2 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-center gap-2">
                  {language ? (
                    <>
                      <div className={`w-5 h-5 rounded bg-gradient-to-br ${languages.find(l => l.id === language)?.color || 'from-gray-500 to-gray-600'}`} />
                      <span className="text-white">{languages.find(l => l.id === language)?.name || language}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-pink-500" />
                      <span className="text-gray-400">All Languages</span>
                    </>
                  )}
                </div>
                <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl shadow-black/50 z-50 max-h-[280px] overflow-y-auto">
                  <div className="p-2">
                    <button
                      onClick={() => { setLanguage(""); setPage(1); setDropdownOpen(false); }}
                      className="w-full px-3 py-2.5 rounded-lg flex items-center gap-3 hover:bg-white/5 transition-colors text-left group"
                    >
                      <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold">A</span>
                      </div>
                      <span className="text-gray-400 group-hover:text-white transition-colors flex-1">All Languages</span>
                      {!language && <FiCheck className="w-4 h-4 text-purple-400" />}
                    </button>
                    
                    <div className="h-px bg-white/5 my-2" />
                    
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => { setLanguage(lang.id); setPage(1); setDropdownOpen(false); }}
                        className="w-full px-3 py-2.5 rounded-lg flex items-center gap-3 hover:bg-white/5 transition-colors text-left group"
                      >
                        <div className={`w-5 h-5 rounded bg-gradient-to-br ${lang.color} flex items-center justify-center`}>
                          <span className="text-[10px] text-white font-bold">{lang.name.charAt(0)}</span>
                        </div>
                        <span className="text-gray-400 group-hover:text-white transition-colors flex-1">{lang.name}</span>
                        {language === lang.id && <FiCheck className="w-4 h-4 text-purple-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-10 h-10 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-500">Loading codes...</p>
                </div>
              </div>
            ) : codes.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiTerminal className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-gray-400 font-medium">No codes found</p>
                <p className="text-gray-600 text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : codes.map((code, index) => {
              const langStyle = languageColors[code.language] || { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30" };
              const hasError = code.output && /error|Error|ERROR/i.test(code.output);
              
              return (
                <div
                  key={code._id}
                  className="group bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded bg-gradient-to-br ${langStyle.gradient || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
                        <span className="text-[10px] text-white font-bold">{getLanguageName(code.language).charAt(0)}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${langStyle.bg} ${langStyle.text}`}>
                        {getLanguageName(code.language)}
                      </span>
                      {hasError && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                          Error
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => setSelectedCode(code)}
                        className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(code._id)}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                      <FiPlay className="w-3 h-3 text-emerald-400" />
                    </div>
                    <h3 className="text-white font-medium text-sm truncate flex-1" title={code.title}>
                      {code.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${getAvatarGradient(index)} flex items-center justify-center text-white text-[8px] font-medium`}>
                      {code.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <span className="truncate">{code.user?.name || "Anonymous"}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      {new Date(code.createdAt).toLocaleDateString()}
                    </span>
                    {code.executionTime && (
                      <span className="text-purple-400">{code.executionTime}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="md:hidden space-y-3">
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-2"></div>
                Loading...
              </div>
            ) : codes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FiCode className="w-12 h-12 mx-auto mb-3 opacity-50" />
                No codes found
              </div>
            ) : codes.map((code) => {
              const langStyle = languageColors[code.language] || { bg: "bg-gray-500/20", text: "text-gray-400", gradient: "from-gray-500 to-gray-600" };
              return (
                <div key={code._id} className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FiPlay className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-white font-medium text-sm truncate">{code.title}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`w-5 h-5 rounded bg-gradient-to-br ${langStyle.gradient || 'from-gray-500 to-gray-600'}`} />
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${langStyle.bg} ${langStyle.text}`}>
                        {getLanguageName(code.language)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{code.user?.name || "Anonymous"}</span>
                    <span>{new Date(code.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedCode(code)} className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium">
                      View
                    </button>
                    <button onClick={() => handleDelete(code._id)} className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white/[0.03] rounded-xl border border-white/5">
              <span className="text-xs sm:text-sm text-gray-500">
                Page {page} of {totalPages} ({total} codes)
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

      {selectedCode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedCode(null)}>
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedCode.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-5 h-5 rounded bg-gradient-to-br ${languageColors[selectedCode.language]?.gradient || 'from-gray-500 to-gray-600'}`} />
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${languageColors[selectedCode.language]?.bg || 'bg-gray-500/20'} ${languageColors[selectedCode.language]?.text || 'text-gray-400'}`}>
                    {getLanguageName(selectedCode.language)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {selectedCode.user?.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs text-gray-500">
                    {new Date(selectedCode.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedCode(null)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {selectedCode.input && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    Input
                  </h4>
                  <pre className="bg-black/50 rounded-xl p-4 text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">
                    {selectedCode.input}
                  </pre>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  Code
                </h4>
                <pre className="bg-black/50 rounded-xl p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap text-gray-200">
                  {selectedCode.code}
                </pre>
              </div>
              {selectedCode.output && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${/error|Error/i.test(selectedCode.output) ? 'bg-red-400' : 'bg-purple-400'}`}></span>
                    Output
                  </h4>
                  <pre className={`bg-black/50 rounded-xl p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap ${
                    /error|Error/i.test(selectedCode.output) ? 'text-red-400' : 'text-gray-300'
                  }`}>
                    {selectedCode.output}
                  </pre>
                </div>
              )}
              {(selectedCode.executionTime || selectedCode.memoryUsed) && (
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                  {selectedCode.executionTime && <span>Execution: {selectedCode.executionTime}</span>}
                  {selectedCode.memoryUsed && <span>Memory: {selectedCode.memoryUsed}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCodes;
