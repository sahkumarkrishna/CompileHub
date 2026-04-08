import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiSave, FiPlus, FiTrash2, FiCheck, FiX, FiArrowLeft, FiDatabase, 
  FiZap, FiAlertCircle, FiLoader, FiLayout, FiCode, FiToggleLeft, 
  FiEye, FiCopy, FiRotateCcw, FiTarget, FiAward, FiClock, FiLayers, FiChevronDown
} from "react-icons/fi";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CreateProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [activeTab, setActiveTab] = useState("description");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [message, setMessage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeExample, setActiveExample] = useState(0);
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [problem, setProblem] = useState({
    title: "",
    slug: "",
    difficulty: "Easy",
    topics: [],
    companies: [],
    premium: false,
    description: "",
    examples: [{ input: "", output: "", explanation: "" }],
    constraints: [""],
    testCases: [{ input: "", output: "", isHidden: false }],
    difficultyRating: "",
    acceptance: "",
    timeComplexity: "",
    spaceComplexity: "",
    hints: [""],
    tags: [],
    relatedProblems: []
  });

  useEffect(() => {
    if (isEditMode) {
      fetchProblem();
    }
  }, [id]);

  const fetchProblem = async () => {
    try {
      const response = await axios.get(`${API_URL}/problems/${id}`);
      const data = response.data.data;
      setProblem({
        ...data,
        examples: data.examples?.length ? data.examples : [{ input: "", output: "", explanation: "" }],
        constraints: data.constraints?.length ? data.constraints : [""],
        testCases: data.testCases?.length ? data.testCases : [{ input: "", output: "", isHidden: false }],
        hints: data.hints?.length ? data.hints : [""]
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load problem" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProblem(prev => ({ ...prev, [field]: value }));
  };

  const addExample = () => {
    setProblem(prev => ({
      ...prev,
      examples: [...prev.examples, { input: "", output: "", explanation: "" }]
    }));
  };

  const removeExample = (index) => {
    if (problem.examples.length > 1) {
      setProblem(prev => ({
        ...prev,
        examples: prev.examples.filter((_, i) => i !== index)
      }));
      if (activeExample >= index && activeExample > 0) {
        setActiveExample(activeExample - 1);
      }
    }
  };

  const updateExample = (index, field, value) => {
    setProblem(prev => ({
      ...prev,
      examples: prev.examples.map((ex, i) => i === index ? { ...ex, [field]: value } : ex)
    }));
  };

  const addTestCase = () => {
    setProblem(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: "", output: "", isHidden: false }]
    }));
  };

  const removeTestCase = (index) => {
    if (problem.testCases.length > 1) {
      setProblem(prev => ({
        ...prev,
        testCases: prev.testCases.filter((_, i) => i !== index)
      }));
      if (activeTestCase >= index && activeTestCase > 0) {
        setActiveTestCase(activeTestCase - 1);
      }
    }
  };

  const updateTestCase = (index, field, value) => {
    setProblem(prev => ({
      ...prev,
      testCases: prev.testCases.map((tc, i) => i === index ? { ...tc, [field]: value } : tc)
    }));
  };

  const addConstraint = () => {
    setProblem(prev => ({
      ...prev,
      constraints: [...prev.constraints, ""]
    }));
  };

  const removeConstraint = (index) => {
    if (problem.constraints.length > 1) {
      setProblem(prev => ({
        ...prev,
        constraints: prev.constraints.filter((_, i) => i !== index)
      }));
    }
  };

  const updateConstraint = (index, value) => {
    setProblem(prev => ({
      ...prev,
      constraints: prev.constraints.map((c, i) => i === index ? value : c)
    }));
  };

  const toggleTopic = (topic) => {
    setProblem(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const toggleCompany = (company) => {
    setProblem(prev => ({
      ...prev,
      companies: prev.companies.includes(company)
        ? prev.companies.filter(c => c !== company)
        : [...prev.companies, company]
    }));
  };

  const handleSave = async () => {
    if (!problem.title || !problem.slug) {
      setMessage({ type: "error", text: "Title and slug are required" });
      return;
    }

    // Validate examples
    const invalidExamples = problem.examples.filter(ex => !ex.input || !ex.output);
    if (invalidExamples.length > 0) {
      setMessage({ type: "error", text: "All examples must have input and output" });
      return;
    }

    // Validate test cases
    const invalidTestCases = problem.testCases.filter(tc => !tc.input || !tc.output);
    if (invalidTestCases.length > 0) {
      setMessage({ type: "error", text: "All test cases must have input and output" });
      return;
    }

    setSaving(true);
    setMessage(null);

    const payload = {
      ...problem,
      status: 'active',
      constraints: problem.constraints.filter(c => c.trim()),
      hints: problem.hints.filter(h => h.trim()),
      testCases: problem.testCases.map(tc => ({
        input: tc.input,
        output: tc.output,
        isHidden: tc.isHidden || false
      }))
    };

    console.log("Saving problem:", payload);

    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/problems/${id}`, payload);
        setMessage({ type: "success", text: "Problem updated successfully!" });
        setTimeout(() => navigate('/admin/problem-dashboard'), 1000);
      } else {
        await axios.post(`${API_URL}/problems`, payload);
        setMessage({ type: "success", text: "Problem created successfully!" });
        setTimeout(() => navigate('/admin/problem-dashboard'), 1000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to save problem"
      });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setProblem({
      title: "",
      slug: "",
      difficulty: "Easy",
      topics: [],
      companies: [],
      premium: false,
      description: "",
      examples: [{ input: "", output: "", explanation: "" }],
      constraints: [""],
      testCases: [{ input: "", output: "", isHidden: false }],
      difficultyRating: "",
      acceptance: "",
      timeComplexity: "",
      spaceComplexity: "",
      hints: [""],
      tags: [],
      relatedProblems: []
    });
    setActiveTab("description");
    setMessage(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: "success", text: "Copied to clipboard!" });
    setTimeout(() => setMessage(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#030712] via-[#0a0a14] to-[#0f0f1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading problem...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "description", label: "Description", icon: <FiLayout className="w-4 h-4" /> },
    { id: "examples", label: "Examples", icon: <FiCode className="w-4 h-4" /> },
    { id: "testcases", label: "Test Cases", icon: <FiZap className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <FiToggleLeft className="w-4 h-4" /> },
  ];

  const difficulties = [
    { value: "Easy", color: "from-emerald-600 to-teal-500", bg: "bg-emerald-500/20", text: "text-emerald-400", icon: FiTarget },
    { value: "Medium", color: "from-amber-600 to-orange-500", bg: "bg-yellow-500/20", text: "text-yellow-400", icon: FiClock },
    { value: "Hard", color: "from-red-600 to-rose-500", bg: "bg-red-500/20", text: "text-red-400", icon: FiAward },
    { value: "Best", color: "from-purple-600 to-pink-500", bg: "bg-purple-500/20", text: "text-purple-400", icon: FiAward },
  ];

  const timeComplexities = [
    { value: "O(1)", label: "O(1) - Constant" },
    { value: "O(log n)", label: "O(log n) - Logarithmic" },
    { value: "O(n)", label: "O(n) - Linear" },
    { value: "O(n log n)", label: "O(n log n) - Linearithmic" },
    { value: "O(n²)", label: "O(n²) - Quadratic" },
    { value: "O(2^n)", label: "O(2^n) - Exponential" },
    { value: "O(n³)", label: "O(n³) - Cubic" },
  ];

  const spaceComplexities = [
    { value: "O(1)", label: "O(1) - Constant" },
    { value: "O(log n)", label: "O(log n) - Logarithmic" },
    { value: "O(n)", label: "O(n) - Linear" },
    { value: "O(n²)", label: "O(n²) - Quadratic" },
    { value: "O(n log n)", label: "O(n log n) - Linearithmic" },
    { value: "O(2^n)", label: "O(2^n) - Exponential" },
  ];

  const allTopics = ["Array", "String", "Linked List", "Tree", "Graph", "Dynamic Programming", "Hash Table", "Two Pointers", "Binary Search", "Math", "Stack", "Queue", "Heap", "Recursion", "Sliding Window", "Backtracking", "Divide and Conquer", "Greedy", "Sorting", "Bit Manipulation"];
  const allCompanies = ["Google", "Meta", "Amazon", "Apple", "Microsoft", "Netflix", "Adobe", "Uber", "LinkedIn", "Salesforce"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030712] via-[#0a0a14] to-[#0f0f1a]">
      {/* Header */}
      <div className="bg-white/[0.02] backdrop-blur-xl border-b border-white/10 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/problem-dashboard')}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    {isEditMode ? 'Edit Problem' : 'Create Problem'}
                  </span>
                </h1>
                <p className="text-sm text-gray-400 mt-1">{isEditMode ? 'Update problem details' : 'Add a new coding problem'}</p>
              </div>
            </div>
            
            {message && (
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${
                message.type === "success" 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}>
                {message.type === "success" ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
                {message.text}
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="hidden sm:flex px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all items-center gap-2"
              >
                <FiEye className="w-4 h-4" />
                Preview
              </button>
              {!isEditMode && (
                <button
                  onClick={resetForm}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl font-medium transition-all items-center gap-2"
                >
                  <FiRotateCcw className="w-4 h-4" />
                  Reset
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                {saving ? "Saving..." : isEditMode ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Problem Info Card */}
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <FiDatabase className="w-4 h-4 text-emerald-400" />
                Problem Info
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Title</label>
                  <input
                    type="text"
                    value={problem.title}
                    onChange={(e) => {
                      handleInputChange("title", e.target.value);
                      if (!isEditMode) {
                        handleInputChange("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                      }
                    }}
                    placeholder="Problem title"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Slug</label>
                  <input
                    type="text"
                    value={problem.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="problem-slug"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Difficulty</label>
                  <div className="space-y-2">
                    {difficulties.map((diff) => {
                      const IconComponent = diff.icon;
                      return (
                        <button
                          key={diff.value}
                          onClick={() => handleInputChange("difficulty", diff.value)}
                          className={`w-full p-3 rounded-xl border transition-all flex items-center gap-3 ${
                            problem.difficulty === diff.value
                              ? `bg-gradient-to-r ${diff.color} border-transparent text-white`
                              : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="text-sm font-medium">{diff.value}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-sm text-gray-400">Premium</span>
                  <button
                    onClick={() => handleInputChange("premium", !problem.premium)}
                    className={`w-12 h-7 rounded-full transition-colors relative ${problem.premium ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-600"}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform shadow-lg ${problem.premium ? "translate-x-6" : "translate-x-1"}`}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <FiLayers className="w-4 h-4 text-blue-400" />
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-white">{problem.topics.length}</div>
                  <div className="text-xs text-gray-400">Topics</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-white">{problem.companies.length}</div>
                  <div className="text-xs text-gray-400">Companies</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-white">{problem.examples.length}</div>
                  <div className="text-xs text-gray-400">Examples</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-white">{problem.testCases.length}</div>
                  <div className="text-xs text-gray-400">Test Cases</div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-5">
              <h3 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4" />
                Tips
              </h3>
              <ul className="text-xs text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  Use clear, descriptive titles
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  Add 2-4 examples for clarity
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  Include comprehensive constraints
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  First test case is visible to users
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex border-b border-white/10 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                        : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl">
              {activeTab === "description" && (
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Problem Description</label>
                    <textarea
                      value={problem.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe the problem in detail. You can use Markdown formatting..."
                      rows={10}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-mono resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">Markdown is supported</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-white">Constraints</label>
                      <button onClick={addConstraint} className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-xs font-medium flex items-center gap-1 transition-all">
                        <FiPlus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {problem.constraints.map((constraint, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm w-6">{index + 1}.</span>
                          <input
                            type="text"
                            value={constraint}
                            onChange={(e) => updateConstraint(index, e.target.value)}
                            placeholder="e.g., 1 <= nums.length <= 10^4"
                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                          />
                          {problem.constraints.length > 1 && (
                            <button onClick={() => removeConstraint(index)} className="p-2.5 bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-xl text-gray-500 hover:text-red-400 transition-all">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-white">Hints</label>
                      <button onClick={() => setProblem(prev => ({ ...prev, hints: [...prev.hints, ""] }))} className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-medium flex items-center gap-1 transition-all">
                        <FiPlus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {problem.hints.map((hint, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">Hint {index + 1}:</span>
                          <input
                            type="text"
                            value={hint}
                            onChange={(e) => {
                              const newHints = [...problem.hints];
                              newHints[index] = e.target.value;
                              handleInputChange("hints", newHints);
                            }}
                            placeholder="Optional hint..."
                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                          />
                          {problem.hints.length > 1 && (
                            <button onClick={() => {
                              const newHints = problem.hints.filter((_, i) => i !== index);
                              handleInputChange("hints", newHints);
                            }} className="p-2.5 bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-xl text-gray-500 hover:text-red-400 transition-all">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "examples" && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">Examples</h3>
                    <button onClick={addExample} className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl text-sm font-medium flex items-center gap-2 transition-all">
                      <FiPlus className="w-4 h-4" /> Add Example
                    </button>
                  </div>

                  {problem.examples.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {problem.examples.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveExample(index)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                            activeExample === index
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                          }`}
                        >
                          Example {index + 1}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="space-y-4">
                    {problem.examples.map((example, index) => (
                      <div key={index} className={`border border-white/10 rounded-2xl p-5 ${index === activeExample ? 'block' : index !== activeExample && problem.examples.length > 1 ? 'hidden' : ''} ${
                        index === 0 ? 'bg-emerald-500/5' : ''
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                            <FiCode className="w-4 h-4" />
                            Example {index + 1}
                          </span>
                          {problem.examples.length > 1 && (
                            <button onClick={() => removeExample(index)} className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg text-gray-500 hover:text-red-400 transition-all">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2">Input</label>
                            <div className="relative">
                              <textarea
                                value={example.input}
                                onChange={(e) => updateExample(index, "input", e.target.value)}
                                placeholder="Enter input..."
                                rows={4}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all resize-none"
                              />
                              <button 
                                onClick={() => copyToClipboard(example.input)}
                                className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all"
                              >
                                <FiCopy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2">Output</label>
                            <textarea
                              value={example.output}
                              onChange={(e) => updateExample(index, "output", e.target.value)}
                              placeholder="Enter output..."
                              rows={3}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2">Explanation (optional)</label>
                            <textarea
                              value={example.explanation}
                              onChange={(e) => updateExample(index, "explanation", e.target.value)}
                              placeholder="Explain this example..."
                              rows={2}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "testcases" && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-white">Test Cases</h3>
                      <p className="text-xs text-gray-500 mt-1">First test case is visible to users</p>
                    </div>
                    <button onClick={addTestCase} className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl text-sm font-medium flex items-center gap-2 transition-all">
                      <FiPlus className="w-4 h-4" /> Add Test Case
                    </button>
                  </div>

                  {problem.testCases.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {problem.testCases.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveTestCase(index)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                            activeTestCase === index
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                          }`}
                        >
                          {index === 0 ? "Visible" : `Hidden ${index}`}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="space-y-4">
                    {problem.testCases.map((tc, index) => (
                      <div key={index} className={`border border-white/10 rounded-2xl p-5 ${index === activeTestCase ? 'block' : index !== activeTestCase && problem.testCases.length > 1 ? 'hidden' : ''} ${
                        index === 0 ? 'bg-emerald-500/5' : ''
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                              index === 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"
                            }`}>
                              {index === 0 ? "Visible" : "Hidden"}
                            </span>
                            <span className="text-sm font-semibold text-white">Test Case {index + 1}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={tc.isHidden}
                                onChange={(e) => updateTestCase(index, "isHidden", e.target.checked)}
                                className="w-4 h-4 rounded border-gray-600 bg-white/5 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                              />
                              Hidden
                            </label>
                            {problem.testCases.length > 1 && (
                              <button onClick={() => removeTestCase(index)} className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg text-gray-500 hover:text-red-400 transition-all">
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2">Input</label>
                            <textarea
                              value={tc.input}
                              onChange={(e) => updateTestCase(index, "input", e.target.value)}
                              placeholder="Enter input..."
                              rows={5}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2">Expected Output</label>
                            <textarea
                              value={tc.output}
                              onChange={(e) => updateTestCase(index, "output", e.target.value)}
                              placeholder="Enter expected output..."
                              rows={5}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">Topics</label>
                    <div className="flex flex-wrap gap-2">
                      {allTopics.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => toggleTopic(topic)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            problem.topics.includes(topic)
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:border-white/20"
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-3">Company Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {allCompanies.map((company) => (
                        <button
                          key={company}
                          onClick={() => toggleCompany(company)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            problem.companies.includes(company)
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:border-white/20"
                          }`}
                        >
                          {company}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Time Complexity</label>
                      <div className="relative">
                        <select
                          value={problem.timeComplexity}
                          onChange={(e) => handleInputChange("timeComplexity", e.target.value)}
                          className="w-full px-4 py-3 bg-[#1e1e1e] border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer appearance-none"
                        >
                          <option value="">Select Time Complexity</option>
                          {timeComplexities.map(tc => (
                            <option key={tc.value} value={tc.value} className="bg-[#1e1e1e]">{tc.label}</option>
                          ))}
                        </select>
                        <FiClock className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Space Complexity</label>
                      <div className="relative">
                        <select
                          value={problem.spaceComplexity}
                          onChange={(e) => handleInputChange("spaceComplexity", e.target.value)}
                          className="w-full px-4 py-3 bg-[#1e1e1e] border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer appearance-none"
                        >
                          <option value="">Select Space Complexity</option>
                          {spaceComplexities.map(sc => (
                            <option key={sc.value} value={sc.value} className="bg-[#1e1e1e]">{sc.label}</option>
                          ))}
                        </select>
                        <FiLayers className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Acceptance Rate (%)</label>
                      <input
                        type="text"
                        value={problem.acceptance}
                        onChange={(e) => handleInputChange("acceptance", e.target.value)}
                        placeholder="e.g., 45"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Difficulty Rating</label>
                      <input
                        type="text"
                        value={problem.difficultyRating}
                        onChange={(e) => handleInputChange("difficultyRating", e.target.value)}
                        placeholder="e.g., 4.5"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProblem;
