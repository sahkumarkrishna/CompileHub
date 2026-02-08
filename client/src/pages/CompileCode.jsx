import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiPlay, FiDownload, FiCopy, FiCode, FiZap, FiClock, FiCpu } from "react-icons/fi";

const defaultCode = {
  javascript: `// Write JS code here\nconsole.log("Hello, world!");`,
  python: `# Write Python code here\nprint("Hello, world!")`,
  c: `#include <stdio.h>\nint main() {\n  printf("Hello, world!\\n");\n  return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, world!" << endl;\n  return 0;\n}`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, world!");\n  }\n}`,

};

const CompileCode = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(defaultCode.javascript);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [complexity, setComplexity] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const API_URL = import.meta.env.VITE_API_COMPILE_URL;

  useEffect(() => {
    const tempCode = localStorage.getItem("tempCode");
    if (tempCode) {
      const snippet = JSON.parse(tempCode);
      setLanguage(snippet.language);
      setCode(snippet.code);
      setInput(snippet.input || "");
      localStorage.removeItem("tempCode");
    }
  }, []);

  const handleEditorChange = (value) => setCode(value);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(defaultCode[lang] || "");
    setOutput("");
    setComplexity(null);
    setMetrics(null);
  };

  const runCode = async () => {
    // Check if code uses prompt/input and warn if input is empty
    if ((code.includes('prompt(') || code.includes('input(') || code.includes('scanf') || code.includes('Scanner')) && !input.trim()) {
      toast.error('Please enter input values in the Input (stdin) field!');
      return;
    }

    setLoading(true);
    setOutput("");
    setComplexity(null);
    setMetrics(null);
    try {
      const res = await axios.post(`${API_URL}compile`, { language, code, input });
      const data = res.data;
      setOutput(data.output);
      setComplexity(data.complexity);
      setMetrics({ executionTime: data.executionTime, memoryUsed: data.memoryUsed });

      const savedSnippets = JSON.parse(localStorage.getItem("codeSnippets")) || [];
      savedSnippets.unshift({
        title: `Snippet ${new Date().toLocaleString()}`,
        language,
        code,
        input,
        output: data.output,
        saved: false,
      });
      localStorage.setItem("codeSnippets", JSON.stringify(savedSnippets));

      toast.success("Code executed successfully!");
    } catch (err) {
      setOutput("Error: " + (err.response?.data?.error || err.message));
      toast.error("Failed to run code.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `code.${language === 'cpp' ? 'cpp' : language}`;
    document.body.appendChild(element);
    element.click();
    toast.success("Downloaded!");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-[1900px] mx-auto">
        <div className="mb-8 text-center animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3 animate-float">
            Code Compiler
          </h1>
          <p className="text-gray-400 text-lg">Write, compile, and run code with real-time complexity analysis</p>
        </div>

        <div className="glass rounded-3xl p-6 mb-6 animate-fadeIn">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="flex-1">
              <label className="block mb-2 text-sm font-bold text-green-400 flex items-center gap-2">
                <FiCode size={16} /> Language
              </label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-full bg-slate-800/50 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 border border-slate-700 backdrop-blur-sm transition-all"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block mb-2 text-sm font-bold text-green-400">Input (stdin)</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input for your code (one value per line)"
                rows={3}
                className="w-full bg-slate-800/50 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 border border-slate-700 backdrop-blur-sm transition-all resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={runCode}
                disabled={loading}
                className="flex items-center gap-2 btn-primary disabled:opacity-50"
              >
                <FiPlay /> {loading ? "Running..." : "Run"}
              </button>
              <button
                onClick={copyCode}
                className="flex items-center gap-2 glass hover:bg-white/20 px-4 py-3 rounded-xl font-semibold transition-all"
                title="Copy Code"
              >
                <FiCopy />
              </button>
              <button
                onClick={downloadCode}
                className="flex items-center gap-2 glass hover:bg-white/20 px-4 py-3 rounded-xl font-semibold transition-all"
                title="Download Code"
              >
                <FiDownload />
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-3xl overflow-hidden animate-fadeIn">
            <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="font-bold text-green-400 flex items-center gap-2">
                <FiCode size={18} /> Code Editor
              </h3>
              <span className="text-xs text-gray-400 uppercase font-bold px-3 py-1 bg-slate-700/50 rounded-full">{language}</span>
            </div>
            <Editor
              height="70vh"
              language={language}
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                fontSize: 16,
                minimap: { enabled: false },
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                renderLineHighlight: "all",
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                tabSize: 2,
                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                padding: { top: 16, bottom: 16 }
              }}
            />
          </div>

          <div className="space-y-6 animate-fadeIn">
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-green-400 flex items-center gap-2">
                  <FiZap size={18} /> Output
                </h3>
                {output && (
                  <button
                    onClick={() => { navigator.clipboard.writeText(output); toast.success("Output copied!"); }}
                    className="text-xs text-gray-400 hover:text-green-400 transition-colors"
                  >
                    Copy
                  </button>
                )}
              </div>
              <pre className="whitespace-pre-wrap break-words bg-slate-900/50 p-4 rounded-xl text-sm max-h-[35vh] overflow-y-auto border border-slate-700/50 font-mono">
                {output || "No output yet. Click Run to execute your code."}
              </pre>
            </div>

            {metrics && (
              <div className="glass rounded-3xl p-6 animate-fadeIn">
                <h3 className="font-bold text-green-400 flex items-center gap-2 mb-4">
                  <FiClock size={18} /> Performance
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-gray-400 text-sm">Execution Time</span>
                    <span className="font-bold text-cyan-400">{metrics.executionTime}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-gray-400 text-sm">Memory Used</span>
                    <span className="font-bold text-purple-400">{metrics.memoryUsed}</span>
                  </div>
                </div>
              </div>
            )}

            {complexity && (
              <div className="glass rounded-3xl p-6 animate-fadeIn">
                <h3 className="font-bold text-green-400 flex items-center gap-2 mb-4">
                  <FiCpu size={18} /> Complexity Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-gray-400 text-sm">Best Case</span>
                    <span className="font-bold text-green-400">{complexity.bestCase}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-gray-400 text-sm">Average Case</span>
                    <span className="font-bold text-yellow-400">{complexity.averageCase}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-gray-400 text-sm">Worst Case</span>
                    <span className="font-bold text-red-400">{complexity.worstCase}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-gray-400 text-sm">Space</span>
                    <span className="font-bold text-blue-400">{complexity.spaceComplexity}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompileCode;
