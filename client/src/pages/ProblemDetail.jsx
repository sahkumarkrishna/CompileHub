import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  FiPlay, FiCopy, FiCheck, FiX, FiArrowLeft, FiClock,
  FiBook, FiCode, FiAlertCircle, FiLoader, FiSun, FiMoon, 
  FiMaximize2, FiMinimize2, FiHeart, FiShare2, FiBookmark,
  FiCheckCircle, FiMessageSquare, FiHelpCircle, FiChevronRight,
  FiSettings, FiRotateCcw, FiTrash2,
  FiTrendingUp, FiEye, FiEyeOff, FiTerminal, FiZap, FiRefreshCw
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const COMPILE_URL = `${API_URL}/compile`;

const defaultCode = {
  javascript: `// JavaScript - Print Hello World
console.log("Hello World");`,
  python: `# Python - Print Hello World
print("Hello World")`,
  python3: `# Python 3 - Print Hello World
print("Hello World")`,
  cpp: `// C++ - Print Hello World
#include <iostream>
using namespace std;
int main() {
    cout << "Hello World" << endl;
    return 0;
}`,
  java: `// Java - Print Hello World
class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
  c: `// C - Print Hello World
#include <stdio.h>
int main() {
    printf("Hello World\\n");
    return 0;
}
`,
  csharp: `// C# - Print Hello World
using System;
class Program {
    static void Main() {
        Console.WriteLine("Hello World");
    }
}`,
  go: `// Go - Print Hello World
package main
import "fmt"
func main() {
    fmt.Println("Hello World")
}`,
  rust: `// Rust - Print Hello World
fn main() {
    println!("Hello World");
}`,
  swift: `// Swift - Print Hello World
print("Hello World")`,
  kotlin: `// Kotlin - Print Hello World
fun main() {
    println("Hello World")
}`
};

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "python3", label: "Python 3" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
];

const tabs = [
  { id: 'description', label: 'Description', icon: FiBook },
  { id: 'solutions', label: 'Solutions', icon: FiCode },
  { id: 'discussion', label: 'Discussion', icon: FiMessageSquare },
];

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [mobileView, setMobileView] = useState("problem");
  
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(defaultCode.javascript);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [executionTime, setExecutionTime] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const [runSpecificTest, setRunSpecificTest] = useState(false);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorContainerRef = useRef(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [problemStats, setProblemStats] = useState({ solved: 0, attempts: 0, acceptance: 0 });
  const [fontSize, setFontSize] = useState(14);
  const [editorTheme, setEditorTheme] = useState(() => localStorage.getItem('editorTheme') || "vs-dark");
  const [isDarkTheme, setIsDarkTheme] = useState(() => localStorage.getItem('editorTheme') !== 'vs-light');
  
  const editorRef = useRef(null);

  useEffect(() => {
    fetchProblem();
    loadSavedState();
    // Load default code when problem loads
    setCode(defaultCode[language] || defaultCode.javascript);
  }, [id]);

  useEffect(() => {
    if (problem?._id && localStorage.getItem('token')) {
      checkIfSolved();
    }
  }, [problem?._id]);

  const loadSavedState = () => {
    const likedProblems = JSON.parse(localStorage.getItem('likedProblems') || '[]');
    setIsLiked(likedProblems.includes(id));
  };
  
  const checkIfSolved = async () => {
    if (!problem?._id) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/compile/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const solvedProblem = res.data.data.find(s => s.problemId === problem?._id && s.status === 'Passed');
        if (solvedProblem) {
          setIsSolved(true);
        } else {
          setIsSolved(false);
        }
      }
    } catch (err) {
      console.error("Failed to check solved status:", err);
    }
  };

  const fetchProblem = async () => {
    setLoading(true);
    try {
      let res = await axios.get(`${API_URL}/problems/slug/${id}`);
      
      if (!res.data.data) {
        res = await axios.get(`${API_URL}/problems/${id}`);
      }
      
      if (res.data.data) {
        setProblem(res.data.data);
        setProblemStats({
          solved: res.data.data.solvedCount || 0,
          attempts: res.data.data.submissions || 0,
          acceptance: res.data.data.acceptance || 0
        });
      } else {
        toast.error("Problem not found");
      }
    } catch (err) {
      console.error("Failed to fetch problem:", err);
      toast.error("Failed to load problem");
    } finally {
      setLoading(false);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    monaco.editor.defineTheme('compilehub-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'class', foreground: '4EC9B0' },
        { token: 'interface', foreground: '4EC9B0' },
        { token: 'namespace', foreground: '4EC9B0' },
        { token: 'operator', foreground: 'D4D4D4' },
        { token: 'delimiter', foreground: 'D4D4D4' },
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#2a2d2e',
        'editor.selectionBackground': '#264f78',
        'editorCursor.foreground': '#aeafad',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#c6c6c6',
        'editor.inactiveSelectionBackground': '#3a3d41',
        'editorIndentGuide.background': '#404040',
        'editorIndentGuide.activeBackground': '#707070',
      }
    });
    
    monaco.editor.setTheme('compilehub-dark');
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const editorEl = editorRef.current?.containerDomNode || editorContainerRef.current;
        if (editorEl) {
          await editorEl.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
      setIsFullscreen(!isFullscreen);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (!isSaved) {
      setCode(defaultCode[lang] || defaultCode.javascript);
    }
    setOutput("");
    setTestResults([]);
    setShowResults(false);
    setExecutionTime(null);
  };

  const runCode = useCallback(async () => {
    setRunning(true);
    setOutput("");
    setShowResults(false);
    setExecutionTime(null);
    
    try {
      const inputToUse = runSpecificTest 
        ? problem?.testCases?.[selectedTestCase]?.input || customInput
        : customInput || problem?.testCases?.[selectedTestCase]?.input || "";
      
      const startTime = Date.now();
      const res = await axios.post(COMPILE_URL, {
        language,
        code,
        input: inputToUse
      });
      
      if (res.data.success) {
        const outputData = res.data.output;
        if (!outputData || outputData === "No output" || outputData === "(no output)") {
          setOutput("Error: No output. Make sure your function prints the result using console.log()");
          toast.error("No output generated");
        } else {
          setOutput(outputData);
          setExecutionTime(res.data.executionTime || (Date.now() - startTime));
          toast.success("Code executed successfully!");
        }
      } else {
        setOutput(`Error: ${res.data.error || 'Unknown error'}`);
        toast.error("Execution failed");
      }
    } catch (err) {
      console.error("Compile error:", err);
      setOutput(`Error: ${err.response?.data?.error || err.message}`);
      toast.error("Connection error");
    } finally {
      setRunning(false);
    }
  }, [language, code, customInput, selectedTestCase, runSpecificTest, problem]);

  const submitCode = useCallback(async () => {
    setSubmitting(true);
    setShowResults(true);
    setTestResults([]);
    
    const testCases = problem?.testCases || [];
    
    if (testCases.length === 0) {
      toast.error("No test cases available for this problem");
      setSubmitting(false);
      return;
    }
    
    try {
      const results = await Promise.all(
        testCases.map(async (tc, idx) => {
          const startTime = Date.now();
          try {
            console.log(`Submitting test ${idx+1}: language=${language}`);
            console.log(`Input: ${tc.input}`);
            
            const res = await axios.post(COMPILE_URL, {
              language,
              code,
              input: tc.input
            });
            
            console.log(`Test ${idx+1} output: "${res.data.output}"`);
            console.log(`Test ${idx+1} expected: "${tc.output}"`);
            
            let actualOutput = res.data.output?.trim() || "";
            let expectedOutput = tc.output?.trim() || "";
            
            // Handle case where output is missing or "No output"
            if (!actualOutput || actualOutput === "No output") {
              actualOutput = "(no output - function not printing result)";
            }
            
            // More robust comparison - handle whitespace and newlines
            const actualClean = actualOutput.replace(/\s+/g, ' ').trim();
            const expectedClean = expectedOutput.replace(/\s+/g, ' ').trim();
            
            const passed = res.data.success && (actualClean === expectedClean);
            
            return {
              id: idx,
              input: tc.input,
              expected: tc.output,
              actual: actualOutput,
              passed,
              error: !res.data.success ? res.data.error : null,
              time: Date.now() - startTime
            };
          } catch (err) {
            return {
              id: idx,
              input: tc.input,
              expected: tc.output,
              actual: err.message,
              passed: false,
              error: err.message,
              time: Date.now() - startTime
            };
          }
        })
      );
      
      setTestResults(results);
      saveSubmission(results);
      
      const passedCount = results.filter(r => r.passed).length;
      if (passedCount === results.length) {
        toast.success(`All ${results.length} test cases passed!`);
        setIsSaved(true);
        setIsSolved(true);
      } else {
        toast.error(`${passedCount}/${results.length} test cases passed`);
      }
    } catch (err) {
      toast.error("Submission failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }, [language, code, problem, isSolved]);

  const saveSubmission = async (results) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const allPassed = results.every(r => r.passed);
      await axios.post(`${API_URL}/compile/save`, {
        problemId: problem?._id,
        problemTitle: problem?.title,
        code,
        language,
        status: allPassed ? 'success' : 'failed',
        results
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Failed to save submission:", err);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const saveCode = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login to save your code");
      return;
    }
    
    try {
      await axios.post(`${API_URL}/compile/save`, {
        problemId: problem?._id,
        problemTitle: problem?.title,
        code,
        language,
        status: 'draft'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSaved(true);
      toast.success("Code saved successfully!");
    } catch (err) {
      toast.error("Failed to save code");
    }
  };

  const toggleLike = () => {
    const likedProblems = JSON.parse(localStorage.getItem('likedProblems') || '[]');
    if (isLiked) {
      const updated = likedProblems.filter(p => p !== id);
      localStorage.setItem('likedProblems', JSON.stringify(updated));
      setIsLiked(false);
      toast.success("Removed from favorites");
    } else {
      likedProblems.push(id);
      localStorage.setItem('likedProblems', JSON.stringify(likedProblems));
      setIsLiked(true);
      toast.success("Added to favorites!");
    }
  };

  const shareCode = async () => {
    const shareData = {
      title: problem?.title || 'Coding Problem',
      text: `Check out this problem: ${problem?.title}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const resetCode = () => {
    if (window.confirm("Reset code to default template?")) {
      setCode(defaultCode[language] || defaultCode.javascript);
      setOutput("");
      setTestResults([]);
      setExecutionTime(null);
      setIsSaved(false);
      toast.success("Code reset to default");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        submitCode();
      }
    };
    
    const handleClickOutside = (e) => {
      if (!e.target.closest('.language-dropdown')) setShowLanguageDropdown(false);
      if (!e.target.closest('.settings-dropdown')) setShowSettings(false);
      if (!e.target.closest('.share-dropdown')) setShowShare(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [runCode, submitCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#030712] via-[#0a0a14] to-[#0f0f1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#030712] via-[#0a0a14] to-[#0f0f1a] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Problem Not Found</h2>
          <p className="text-gray-400 mb-6">The problem you're looking for doesn't exist or has been removed.</p>
          <Link to="/problems" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-500 hover:to-teal-500 transition-all">
            <FiArrowLeft className="w-4 h-4" />
            Browse Problems
          </Link>
        </div>
      </div>
    );
  }

  const passedCount = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#030712] via-[#0a0a14] to-[#0f0f1a] overflow-hidden">
      {/* Top Header */}
      <div className="bg-white/[0.02] backdrop-blur-xl border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between px-2 sm:px-4 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <button 
              onClick={() => navigate('/problems')} 
              className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg sm:rounded-xl text-gray-400 hover:text-white transition-all flex-shrink-0"
            >
              <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className={`px-2 sm:px-3 py-1 rounded text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold flex-shrink-0 ${
              problem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
              problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {problem.difficulty}
            </span>
            <h1 className="text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[30px] font-bold text-white truncate hidden xs:block">
              {problem.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={toggleLike}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${isLiked ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-400 hover:text-white'}`}
              title={isLiked ? "Remove from favorites" : "Add to favorites"}
            >
              <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={saveCode}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${isSaved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-400 hover:text-white'}`}
              title="Save code"
            >
              <FiBookmark className="w-4 h-4" />
            </button>
            
            <div className="relative share-dropdown">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowShare(!showShare); }}
                className="p-1.5 sm:p-2 bg-white/5 rounded-lg sm:rounded-xl text-gray-400 hover:text-white transition-all"
              >
                <FiShare2 className="w-4 h-4" />
              </button>
              {showShare && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-[#0a0a14] border border-white/10 rounded-xl p-2 shadow-2xl min-w-36">
                  <button onClick={shareCode} className="w-full px-3 py-2 text-left text-xs sm:text-sm text-gray-300 hover:bg-white/5 rounded-lg flex items-center gap-2">
                    <FiShare2 className="w-3 h-3 sm:w-4 sm:h-4" /> Share
                  </button>
                  <button onClick={copyLink} className="w-full px-3 py-2 text-left text-xs sm:text-sm text-gray-300 hover:bg-white/5 rounded-lg flex items-center gap-2">
                    <FiCopy className="w-3 h-3 sm:w-4 sm:h-4" /> Copy Link
                  </button>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => {
                const newTheme = isDarkTheme ? 'vs-light' : 'vs-dark';
                setEditorTheme(newTheme);
                setIsDarkTheme(!isDarkTheme);
                localStorage.setItem('editorTheme', newTheme);
              }}
              className="p-1.5 sm:p-2 bg-white/5 rounded-lg sm:rounded-xl text-gray-400 hover:text-white transition-all"
            >
              {isDarkTheme ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); setShowLanguageDropdown(false); }}
              className="p-1.5 sm:p-2 bg-white/5 rounded-lg sm:rounded-xl text-gray-400 hover:text-white transition-all"
            >
              <FiSettings className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Tabs - Always visible at top */}
        <div className="flex border-t border-white/5 px-2 sm:px-4 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-3 sm:py-3.5 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
            >
              <tab.icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile View Toggle & Stats */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-white/[0.01] border-b border-white/5">
        <div className="flex items-center gap-4 text-[12px] sm:text-[14px] md:text-[16px] text-gray-500">
          <span>{problem.acceptance || 0}% acceptance</span>
          <span>{problemStats.solved || 0} solved</span>
        </div>
        <div className="flex bg-white/5 rounded p-1">
          <button
            onClick={() => setMobileView("problem")}
            className={`px-4 py-1.5 rounded text-[12px] sm:text-[14px] md:text-[16px] font-medium transition-all ${
              mobileView === "problem" ? "bg-emerald-500/20 text-emerald-400" : "text-gray-400"
            }`}
          >
            Problem
          </button>
          <button
            onClick={() => setMobileView("code")}
            className={`px-4 py-1.5 rounded text-[12px] sm:text-[14px] md:text-[16px] font-medium transition-all ${
              mobileView === "code" ? "bg-emerald-500/20 text-emerald-400" : "text-gray-400"
            }`}
          >
            Code
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Panel - Problem Description */}
        <div className={`flex-1 lg:flex-none lg:w-2/5 overflow-y-auto bg-[#030712] border-r border-white/5 transition-all ${
          mobileView === "code" ? "hidden lg:block" : "flex"
        }`}>
          
          <div className="p-4 sm:p-5 lg:p-6 xl:p-7 space-y-4 sm:space-y-6 xl:space-y-7">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {problem.topics?.slice(0, 4).map(topic => (
                <span key={topic} className="px-2.5 sm:px-3 py-1 bg-white/5 text-gray-400 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] rounded">
                  {topic}
                </span>
              ))}
              {problem.companies?.slice(0, 2).map(company => (
                <span key={company} className="px-2.5 sm:px-3 py-1 bg-blue-500/10 text-blue-400 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] rounded">
                  {company}
                </span>
              ))}
            </div>

            {activeTab === 'description' && (
              <>
                <div>
                  <h3 className="text-[15px] sm:text-[17px] md:text-[19px] lg:text-[21px] xl:text-[23px] font-semibold text-white mb-2 sm:mb-3">Problem Statement</h3>
                  <div className="text-gray-400 text-[13px] sm:text-[15px] md:text-[17px] lg:text-[19px] xl:text-[21px] leading-relaxed whitespace-pre-wrap">
                    {problem.description || 'No description available.'}
                  </div>
                </div>

                {/* Test Case Selector */}
                {problem.testCases?.length > 1 && (
                  <div>
                    <h3 className="text-[15px] sm:text-[17px] md:text-[19px] lg:text-[21px] xl:text-[23px] font-semibold text-white mb-2 sm:mb-3">Test Cases</h3>
                    <div className="space-y-2.5 sm:space-y-3">
                      {problem.testCases.map((tc, idx) => (
                        <div 
                          key={idx} 
                          className={`p-2.5 sm:p-3 lg:p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedTestCase === idx 
                              ? 'bg-emerald-500/10 border-emerald-500/30' 
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                          }`}
                          onClick={() => setSelectedTestCase(idx)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[13px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium text-emerald-400">
                              {idx === 0 ? 'Visible' : `Hidden Test ${idx}`}
                            </span>
                            {selectedTestCase === idx && (
                              <FiCheckCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-emerald-400" />
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-[12px] sm:text-[14px] md:text-[15px] lg:text-[17px]">
                            <div>
                              <div className="text-gray-500 mb-1">Input</div>
                              <pre className="bg-[#0a0a14] p-2 sm:p-3 rounded text-gray-300 font-mono truncate">
                                {tc.input || '(empty)'}
                              </pre>
                            </div>
                            <div>
                              <div className="text-gray-500 mb-1">Expected</div>
                              <pre className="bg-[#0a0a14] p-2 sm:p-3 rounded text-gray-300 font-mono truncate">
                                {tc.output || '(empty)'}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {problem.examples?.length > 0 && (
                  <div className="space-y-2.5 sm:space-y-3 xl:space-y-4">
                    <h3 className="text-[15px] sm:text-[17px] md:text-[19px] lg:text-[21px] xl:text-[23px] font-semibold text-white">Examples</h3>
                    {problem.examples.map((example, idx) => (
                      <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden">
                        <div className="px-3 sm:px-4 py-2 bg-emerald-500/10 text-emerald-400 text-[13px] sm:text-[15px] md:text-[16px] lg:text-[18px] font-medium border-b border-white/10">
                          Example {idx + 1}
                        </div>
                        <div className="p-3 sm:p-4 lg:p-5 space-y-2.5 sm:space-y-3">
                          <div>
                            <div className="text-[12px] sm:text-[14px] md:text-[15px] lg:text-[17px] text-gray-500 mb-1">Input</div>
                            <pre className="bg-[#0a0a14] p-2.5 sm:p-3 rounded-lg text-gray-300 text-[12px] sm:text-[14px] md:text-[15px] lg:text-[17px] font-mono overflow-x-auto">
                              {example.input}
                            </pre>
                          </div>
                          <div>
                            <div className="text-[12px] sm:text-[14px] md:text-[15px] lg:text-[17px] text-gray-500 mb-1">Output</div>
                            <pre className="bg-[#0a0a14] p-2.5 sm:p-3 rounded-lg text-gray-300 text-[12px] sm:text-[14px] md:text-[15px] lg:text-[17px] font-mono overflow-x-auto">
                              {example.output}
                            </pre>
                          </div>
                          {example.explanation && (
                            <div>
                              <div className="text-[12px] sm:text-[14px] md:text-[15px] lg:text-[17px] text-gray-500 mb-1">Explanation</div>
                              <p className="text-gray-400 text-[13px] sm:text-[15px] md:text-[16px] lg:text-[18px]">{example.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {problem.constraints?.length > 0 && (
                  <div>
                    <h3 className="text-[15px] sm:text-[17px] md:text-[19px] lg:text-[21px] xl:text-[23px] font-semibold text-white mb-2 sm:mb-3">Constraints</h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {problem.constraints.filter(c => c).map((constraint, idx) => (
                        <li key={idx} className="flex items-start gap-2 sm:gap-3 text-gray-400 text-[13px] sm:text-[15px] md:text-[16px] lg:text-[18px]">
                          <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 text-[12px] sm:text-[13px] mt-0.5">✓</span>
                          <code className="font-mono">{constraint}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {problem.hints?.length > 0 && (
                  <div>
                    <button 
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 hover:text-yellow-300 text-[13px] sm:text-[15px] md:text-[16px] lg:text-[18px] font-medium transition-all"
                    >
                      <FiHelpCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                      {showHint ? 'Hide Hints' : 'Show Hints'}
                    </button>
                    {showHint && (
                      <div className="mt-2.5 sm:mt-3 space-y-2 sm:space-y-2.5">
                        {problem.hints.filter(h => h).map((hint, idx) => (
                          <div key={idx} className="p-2.5 sm:p-3 lg:p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-[13px] sm:text-[15px] md:text-[16px] lg:text-[18px]">
                            💡 {hint}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {(problem.timeComplexity || problem.spaceComplexity) && (
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:gap-4">
                    {problem.timeComplexity && (
                      <div className="p-2.5 sm:p-3 lg:p-4 bg-white/[0.02] border border-white/10 rounded-lg">
                        <div className="text-[12px] sm:text-[14px] md:text-[15px] lg:text-[17px] text-gray-500 mb-1">Time</div>
                        <div className="text-white font-bold text-[13px] sm:text-[15px] md:text-[16px] lg:text-[18px]">{problem.timeComplexity}</div>
                      </div>
                    )}
                    {problem.spaceComplexity && (
                      <div className="p-2.5 sm:p-3 lg:p-4 bg-white/[0.02] border border-white/10 rounded-lg">
                        <div className="text-[12px] sm:text-[14px] md:text-[15px] lg:text-[17px] text-gray-500 mb-1">Space</div>
                        <div className="text-white font-bold text-[13px] sm:text-[15px] md:text-[16px] lg:text-[18px]">{problem.spaceComplexity}</div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {activeTab === 'solutions' && (
              <div className="text-center py-10 sm:py-12 xl:py-14">
                <div className="w-20 h-20 sm:w-24 sm:h-24 xl:w-28 xl:h-28 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-5 sm:mb-6">
                  <FiCode className="w-10 h-10 sm:w-12 sm:h-12 xl:w-14 xl:h-14 text-gray-600" />
                </div>
                <p className="text-gray-400 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px]">Solutions available after solving</p>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="text-center py-10 sm:py-12 xl:py-14">
                <div className="w-20 h-20 sm:w-24 sm:h-24 xl:w-28 xl:h-28 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-5 sm:mb-6">
                  <FiMessageSquare className="w-10 h-10 sm:w-12 sm:h-12 xl:w-14 xl:h-14 text-gray-600" />
                </div>
                <p className="text-gray-400 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px]">Start a discussion about this problem</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className={`flex-1 lg:flex-none lg:w-3/5 flex flex-col min-h-0 ${mobileView === "problem" ? "hidden lg:flex" : "flex"}`}>
          
          {/* Settings Panel */}
          {showSettings && (
            <div className="absolute right-2 top-20 sm:right-4 z-50 bg-[#0a0a14] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 w-72 overflow-hidden settings-dropdown">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FiSettings className="w-4 h-4 text-emerald-400" />
                  Editor Settings
                </h3>
                <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors">
                  <FiX className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Font Size */}
                <div>
                  <label className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400">Font Size</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">{fontSize}px</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFontSize(Math.max(10, fontSize - 2))}
                      className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                    >
                      <span className="text-xs">A-</span>
                    </button>
                    <input
                      type="range"
                      min="10"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                    <button
                      onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                      className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                    >
                      <span className="text-sm">A+</span>
                    </button>
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-gray-600">
                    <span>10px</span>
                    <span>24px</span>
                  </div>
                </div>
                
                {/* Theme */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Theme</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setEditorTheme('vs-dark'); setIsDarkTheme(true); localStorage.setItem('editorTheme', 'vs-dark'); }}
                      className={`p-3 rounded-xl border transition-all ${
                        editorTheme === 'vs-dark'
                          ? 'bg-gray-800 border-emerald-500/50 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="w-full h-6 bg-gray-900 rounded-lg mb-2 border border-gray-700"></div>
                      <span className="text-[10px] font-medium">Dark</span>
                    </button>
                    <button
                      onClick={() => { setEditorTheme('vs-light'); setIsDarkTheme(false); localStorage.setItem('editorTheme', 'vs-light'); }}
                      className={`p-3 rounded-xl border transition-all ${
                        editorTheme === 'vs-light'
                          ? 'bg-white border-emerald-500/50 text-gray-900'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="w-full h-6 bg-white rounded-lg mb-2 border border-gray-200"></div>
                      <span className="text-[10px] font-medium">Light</span>
                    </button>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="border-t border-white/5 pt-4 space-y-2">
                  <button 
                    onClick={resetCode}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 text-xs transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <FiRotateCcw className="w-4 h-4 text-gray-400 group-hover:text-white" />
                      Reset Code
                    </span>
                    <span className="text-gray-600">Ctrl+R</span>
                  </button>
                  <button 
                    onClick={() => { setCode(""); setIsSaved(false); toast.success("Code cleared"); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 text-xs transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <FiTrash2 className="w-4 h-4" />
                      Clear Code
                    </span>
                    <span className="text-red-500/50">Ctrl+Del</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Editor Container - IDE Style */}
          <div ref={editorContainerRef} className="flex-1 min-h-[250px] sm:min-h-[300px] lg:min-h-[350px] flex flex-col bg-[#1e1e1e] rounded-lg overflow-hidden border border-[#333]">
            {/* Editor Tab Bar */}
            <div className="flex items-center bg-[#252526] border-b border-[#333]">
              {/* Left: Language Selector */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowLanguageDropdown(!showLanguageDropdown); }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#2d2d2d] text-gray-300 transition-all"
                >
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-medium">{languages.find(l => l.value === language)?.label || language}</span>
                  <FiChevronRight className={`w-3 h-3 transition-transform ${showLanguageDropdown ? 'rotate-90' : ''}`} />
                </button>
                
                {showLanguageDropdown && (
                  <div className="absolute left-0 top-full mt-1 z-50 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-2xl w-56 max-h-80 overflow-y-auto">
                    <div className="p-2">
                      {languages.map((lang, idx) => (
                        <button
                          key={lang.value}
                          onClick={() => { handleLanguageChange(lang.value); setShowLanguageDropdown(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                            language === lang.value 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'text-gray-300 hover:bg-[#2d2d2d] hover:text-white'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${language === lang.value ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                          <span className="flex-1 text-left">{lang.label}</span>
                          {language === lang.value && <FiCheck className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Active File Tab */}
              <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e1e] border-t-2 border-t-emerald-500 text-gray-300 ml-2">
                <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                  <path d="M14 2v6h6M9 15h6M9 11h6M9 7h4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span className="text-sm font-medium">solution.{language === 'javascript' ? 'js' : language === 'python' || language === 'python3' ? 'py' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : language === 'c' ? 'c' : language === 'csharp' ? 'cs' : language === 'go' ? 'go' : language === 'rust' ? 'rs' : language === 'swift' ? 'swift' : language === 'kotlin' ? 'kt' : 'txt'}</span>
              </div>
              
              {/* Right side controls */}
              <div className="ml-auto flex items-center gap-1 px-2">
                <button
                  onClick={copyCode}
                  className="p-2 rounded hover:bg-[#333] text-gray-400 hover:text-white transition-all"
                  title="Copy code"
                >
                  <FiCopy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setEditorTheme(editorTheme === 'vs-dark' ? 'vs-light' : 'vs-dark'); setIsDarkTheme(!isDarkTheme); localStorage.setItem('editorTheme', editorTheme === 'vs-dark' ? 'vs-light' : 'vs-dark'); }}
                  className="p-2 rounded hover:bg-[#333] text-gray-400 hover:text-white transition-all"
                  title="Toggle theme"
                >
                  {editorTheme === 'vs-dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded hover:bg-[#333] text-gray-400 hover:text-white transition-all"
                  title="Fullscreen"
                >
                  {isFullscreen ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {/* Editor Area */}
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || "")}
                onMount={handleEditorDidMount}
                theme={editorTheme}
                options={{
                  fontSize: fontSize,
                  minimap: { enabled: true, maxColumn: 80 },
                  scrollBeyondLastLine: false,
                  padding: { top: 16, bottom: 16 },
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                  fontLigatures: true,
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                  automaticLayout: true,
                  wordWrap: 'on',
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  smoothScrolling: true,
                  bracketPairColorization: { enabled: true },
                  guides: { bracketPairs: true, indentation: true },
                  renderWhitespace: 'selection',
                }}
              />
            </div>
            
            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-[#007acc] text-white text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="opacity-75">Problems</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="opacity-75">Errors</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="opacity-75">Ln</span>
                  <span className="font-medium">1</span>
                  <span className="opacity-75">,</span>
                  <span className="font-medium">Col</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="opacity-75">UTF-8</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="opacity-75">{language.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="opacity-75">Spaces:</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Input/Output Panel */}
          <div className="border-t border-white/5 bg-[#030712]">
            <div className="flex border-b border-white/5">
              <button
                onClick={() => setShowResults(false)}
                className={`flex-1 px-3 sm:px-4 py-2 text-[10px] sm:text-xs lg:text-sm font-medium transition-all ${
                  !showResults ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                Input
              </button>
              <button
                onClick={() => setShowResults(true)}
                className={`flex-1 px-3 sm:px-4 py-2 text-[10px] sm:text-xs lg:text-sm font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 ${
                  showResults ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                Results
                {testResults.length > 0 && (
                  <span className={`px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs ${
                    passedCount === totalTests ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {passedCount}/{totalTests}
                  </span>
                )}
              </button>
            </div>

            {!showResults ? (
              <div className="p-2 sm:p-3 lg:p-4">
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter custom input (optional)"
                  className="w-full h-16 sm:h-20 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-gray-300 text-[10px] sm:text-xs lg:text-sm p-2 sm:p-3 font-mono focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            ) : (
              <div className="p-2 sm:p-3 lg:p-4 max-h-32 sm:max-h-40 lg:max-h-56 overflow-y-auto">
                {testResults.length === 0 ? (
                  <div className="text-center py-4 sm:py-6">
                    <FiTerminal className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 mx-auto mb-1 sm:mb-2" />
                    <p className="text-gray-500 text-[10px] sm:text-xs">Run or submit to see results</p>
                    <p className="text-gray-600 text-[10px] mt-1 hidden sm:block">Ctrl+Enter to run, Ctrl+Shift+Enter to submit</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 sm:space-y-2">
                    {testResults.map((result, idx) => (
                      <div key={idx} className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border text-[10px] sm:text-xs ${
                        result.passed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className={`font-semibold ${result.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                            Test {idx + 1}: {result.passed ? 'Passed' : 'Failed'}
                          </div>
                          {result.time && <span className="text-gray-500">{result.time}ms</span>}
                        </div>
                        {!result.passed && (
                          <div className="mt-1 sm:mt-2 space-y-1 text-gray-400">
                            <div>Expected: <code className="text-white bg-white/10 px-1 rounded">{result.expected}</code></div>
                            <div>Actual: <code className="text-white bg-white/10 px-1 rounded">{result.actual || '(no output)'}</code></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 border-t border-white/5 bg-white/[0.01]">
            <button
              onClick={runCode}
              disabled={running}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs lg:text-sm font-medium transition-all disabled:opacity-50"
            >
              {running ? <FiLoader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> : <FiPlay className="w-3 h-3 sm:w-4 sm:h-4" />}
              Run
            </button>
            <button
              onClick={submitCode}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs lg:text-sm font-medium transition-all bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {submitting ? (
                <FiLoader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
              ) : (
                <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              Submit
            </button>
          </div>

          {/* Output */}
          {output ? (
            <div className="p-2 sm:p-3 lg:p-4 border-t border-white/5 bg-[#0a0a14]">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-[10px] sm:text-xs text-gray-500">Output</span>
                  {executionTime && (
                    <span className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-0.5 sm:gap-1">
                      <FiClock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {executionTime}ms
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setOutput(""); checkIfSolved(); }} className="text-gray-500 hover:text-white">
                    <FiRefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button onClick={() => setOutput("")} className="text-gray-500 hover:text-white">
                    <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
              <pre className="text-gray-300 text-[10px] sm:text-xs lg:text-sm font-mono whitespace-pre-wrap max-h-16 sm:max-h-24 overflow-y-auto">{output}</pre>
            </div>
          ) : (
            <div className="p-2 sm:p-3 lg:p-4 border-t border-white/5 bg-[#0a0a14] text-gray-500 text-xs">
              Run code to see output
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
