import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  FiPlay, FiDownload, FiCopy, FiCode, FiZap, FiClock, FiCpu, FiBarChart2, 
  FiSettings, FiMaximize2, FiMinimize2, FiTerminal, FiChevronDown, FiSearch, FiX,
  FiSave, FiShare2, FiTrash2, FiRotateCcw, FiMoon, FiSun, FiType, FiAlignLeft,
  FiGrid, FiList, FiChevronRight, FiInfo, FiHash, FiBold, FiItalic, FiArrowLeft
} from "react-icons/fi";

const defaultCode = {
  javascript: `// JavaScript - Write your code here
console.log("Hello, World!");

// Variables
let name = "CompileHub";
console.log("Welcome to " + name);

// Functions
function greet(user) {
  return \`Hello, \${user}!\`;
}
console.log(greet(name));`,
  python: `# Python - Write your code here
print("Hello, World!")

# Variables
name = "CompileHub"
print(f"Welcome to {name}")

# Functions
def greet(user):
    return f"Hello, {user}!"

print(greet(name))`,
  c: `// C Programming
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    
    // Variables
    char name[] = "CompileHub";
    printf("Welcome to %s\\n", name);
    
    return 0;
}
`,
  cpp: `// C++ Programming
#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    // Variables
    string name = "CompileHub";
    cout << "Welcome to " << name << endl;
    
    return 0;
}`,
  java: `// Java Programming
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Variables
        String name = "CompileHub";
        System.out.println("Welcome to " + name);
    }
}`,
  typescript: `// TypeScript - Write your code here
console.log("Hello, World!");

// Variables with types
let name: string = "CompileHub";
console.log(\`Welcome to \${name}\`);

// Functions with types
function greet(user: string): string {
    return \`Hello, \${user}!\`;
}
console.log(greet(name));`,
  csharp: `// C# Programming
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
        
        string name = "CompileHub";
        Console.WriteLine($"Welcome to {name}");
    }
}`,
  go: `// Go Programming
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    
    name := "CompileHub"
    fmt.Printf("Welcome to %s\\n", name)
}`,
  rust: `// Rust Programming
fn main() {
    println!("Hello, World!");
    
    let name = "CompileHub";
    println!("Welcome to {}", name);
}`,
  ruby: `# Ruby Programming
puts "Hello, World!"

name = "CompileHub"
puts "Welcome to #{name}"`,
  php: `<?php
// PHP Programming
echo "Hello, World!\\n";

$name = "CompileHub";
echo "Welcome to $name\\n";
?>`,
  swift: `// Swift Programming
import Foundation

print("Hello, World!")

let name = "CompileHub"
print("Welcome to \\(name)")`,
  kotlin: `// Kotlin Programming
fun main() {
    println("Hello, World!")
    
    val name = "CompileHub"
    println("Welcome to $name")
}`,
  scala: `// Scala Programming
object Main extends App {
    println("Hello, World!")
    
    val name = "CompileHub"
    println(s"Welcome to $name")
}`,
  perl: `#!/usr/bin/perl
# Perl Programming
use strict;
use warnings;

print "Hello, World!\\n";

my $name = "CompileHub";
print "Welcome to $name\\n";`,
  r: `# R Programming
cat("Hello, World!\\n")

name <- "CompileHub"
cat("Welcome to", name, "\\n")`,
  lua: `-- Lua Programming
print("Hello, World!")

local name = "CompileHub"
print("Welcome to " .. name)`,
  haskell: `-- Haskell Programming
main :: IO ()
main = do
    putStrLn "Hello, World!"
    let name = "CompileHub"
    putStrLn $ "Welcome to " ++ name`,
  elixir: `# Elixir Programming
IO.puts("Hello, World!")

name = "CompileHub"
IO.puts("Welcome to #{name}")`,
  julia: `# Julia Programming
println("Hello, World!")

name = "CompileHub"
println("Welcome to $name")`,
  dart: `// Dart Programming
void main() {
    print('Hello, World!');
    
    var name = "CompileHub";
    print('Welcome to $name');
}`,
  bash: `#!/bin/bash
# Bash Programming
echo "Hello, World!"

name="CompileHub"
echo "Welcome to $name"`,
  powershell: `# PowerShell Programming
Write-Host "Hello, World!"

$name = "CompileHub"
Write-Host "Welcome to $name"`
};

const languages = [
  { value: "javascript", label: "JavaScript", monaco: "javascript", color: "bg-yellow-500", category: "Web" },
  { value: "typescript", label: "TypeScript", monaco: "typescript", color: "bg-blue-500", category: "Web" },
  { value: "python", label: "Python", monaco: "python", color: "bg-green-500", category: "General" },
  { value: "java", label: "Java", monaco: "java", color: "bg-orange-500", category: "Enterprise" },
  { value: "c", label: "C", monaco: "c", color: "bg-blue-600", category: "Systems" },
  { value: "cpp", label: "C++", monaco: "cpp", color: "bg-purple-500", category: "Systems" },
  { value: "csharp", label: "C#", monaco: "csharp", color: "bg-violet-500", category: "Enterprise" },
  { value: "go", label: "Go", monaco: "go", color: "bg-cyan-500", category: "Backend" },
  { value: "rust", label: "Rust", monaco: "rust", color: "bg-orange-600", category: "Systems" },
  { value: "ruby", label: "Ruby", monaco: "ruby", color: "bg-red-500", category: "Web" },
  { value: "php", label: "PHP", monaco: "php", color: "bg-indigo-500", category: "Web" },
  { value: "swift", label: "Swift", monaco: "swift", color: "bg-orange-500", category: "Mobile" },
  { value: "kotlin", label: "Kotlin", monaco: "kotlin", color: "bg-purple-600", category: "Mobile" },
  { value: "scala", label: "Scala", monaco: "scala", color: "bg-red-600", category: "Backend" },
  { value: "perl", label: "Perl", monaco: "perl", color: "bg-blue-500", category: "Scripting" },
  { value: "r", label: "R", monaco: "r", color: "bg-blue-400", category: "Data Science" },
  { value: "lua", label: "Lua", monaco: "lua", color: "bg-indigo-400", category: "Game Dev" },
  { value: "haskell", label: "Haskell", monaco: "haskell", color: "bg-purple-500", category: "Functional" },
  { value: "elixir", label: "Elixir", monaco: "elixir", color: "bg-purple-600", category: "Backend" },
  { value: "julia", label: "Julia", monaco: "julia", color: "bg-purple-500", category: "Data Science" },
  { value: "dart", label: "Dart", monaco: "dart", color: "bg-cyan-500", category: "Mobile" },
  { value: "bash", label: "Bash", monaco: "shell", color: "bg-green-500", category: "Scripting" },
  { value: "powershell", label: "PowerShell", monaco: "powershell", color: "bg-blue-600", category: "Scripting" }
];

const CompileCode = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(defaultCode.javascript);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [complexity, setComplexity] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [langSearch, setLangSearch] = useState("");
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(18);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [lineCount, setLineCount] = useState(0);

  const editorRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const COMPILE_URL = `${API_URL}/compile`;

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

  const filteredLanguages = languages.filter(lang => 
    lang.label.toLowerCase().includes(langSearch.toLowerCase()) ||
    lang.category.toLowerCase().includes(langSearch.toLowerCase())
  );

  const handleEditorChange = (value) => setCode(value || "");

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({ line: e.position.lineNumber, column: e.position.column });
    });

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2015,
      allowNonTsExtensions: true,
      allowJs: true,
      checkJs: true,
    });
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(defaultCode[lang] || "");
    setOutput("");
    setComplexity(null);
    setMetrics(null);
    setError(null);
    setShowLangDropdown(false);
    setLangSearch("");
  };

  const runCode = async () => {
    setLoading(true);
    setOutput("");
    setComplexity(null);
    setMetrics(null);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(COMPILE_URL, { language, code, input, title: `${language} - ${new Date().toLocaleString()}` }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = res.data;
      setOutput(data.output);
      setComplexity(data.complexity);
      setMetrics({ executionTime: data.executionTime, memoryUsed: data.memoryUsed });

      const savedSnippets = JSON.parse(localStorage.getItem("codeSnippets")) || [];
      savedSnippets.unshift({
        title: `${language} - ${new Date().toLocaleString()}`,
        language,
        code,
        input,
        output: data.output,
        timestamp: Date.now(),
        saved: false,
      });
      localStorage.setItem("codeSnippets", JSON.stringify(savedSnippets));

      toast.success("Code executed successfully!");
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      setOutput("Error: " + errorMsg);
      toast.error("Failed to run code");
    } finally {
      setLoading(false);
    }
  };

  const downloadCode = () => {
    const extensions = {
      javascript: "js", typescript: "ts", python: "py", java: "java",
      c: "c", cpp: "cpp", csharp: "cs", go: "go", rust: "rs",
      ruby: "rb", php: "php", swift: "swift", kotlin: "kt",
      scala: "scala", perl: "pl", r: "r", lua: "lua",
      haskell: "hs", elixir: "ex", julia: "jl", dart: "dart",
      bash: "sh", powershell: "ps1"
    };
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `code.${extensions[language] || "txt"}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Downloaded!");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success("Output copied!");
  };

  const shareCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Code", text: code });
        toast.success("Shared!");
      } catch {
        navigator.clipboard.writeText(code);
        toast.success("Code copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(code);
      toast.success("Code copied!");
    }
  };

  const clearCode = () => {
    setCode("");
    setOutput("");
    setError(null);
    toast.success("Code cleared!");
  };

  const resetCode = () => {
    setCode(defaultCode[language] || "");
    setOutput("");
    setError(null);
    toast.success("Code reset!");
  };

  const saveToHistory = () => {
    const savedSnippets = JSON.parse(localStorage.getItem("codeSnippets")) || [];
    savedSnippets.unshift({
      title: `${language} - ${new Date().toLocaleString()}`,
      language,
      code,
      input,
      output: output || "",
      timestamp: Date.now(),
      saved: true,
    });
    localStorage.setItem("codeSnippets", JSON.stringify(savedSnippets));
    toast.success("Saved to history!");
  };

  const currentLang = languages.find(l => l.value === language);

  return (
    <div className={`min-h-screen bg-[#0a0a14] text-white ${isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative max-w-[1920px] mx-auto">
        <div className="border-b border-white/5 bg-[#0a0a14]/90 backdrop-blur-xl sticky top-0 z-40">
          <div className="px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                title="Go Back"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <FiCode className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Code Editor</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">CompileHub - 23+ Languages</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={saveToHistory} className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all" title="Save to History">
                <FiSave className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={shareCode} className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all" title="Share">
                <FiShare2 className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={clearCode} className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all" title="Clear">
                <FiTrash2 className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={resetCode} className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all" title="Reset">
                <FiRotateCcw className="w-4 h-4 text-gray-400" />
              </button>
              <div className="w-px h-8 bg-white/10 hidden lg:block"></div>
              <button
                onClick={() => setTheme(theme === "vs-dark" ? "vs-light" : "vs-dark")}
                className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                title="Toggle Theme"
              >
                {theme === "vs-dark" ? <FiSun className="w-4 h-4 text-gray-400" /> : <FiMoon className="w-4 h-4 text-gray-400" />}
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <FiMinimize2 className="w-4 h-4 text-gray-400" /> : <FiMaximize2 className="w-4 h-4 text-gray-400" />}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2 sm:p-2.5 rounded-xl border transition-all ${showSettings ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}
                  title="Settings"
                >
                  <FiSettings className={`w-4 h-4 ${showSettings ? 'text-emerald-400' : 'text-gray-400'}`} />
                </button>
                {showSettings && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-[#0d0d1a] border border-white/10 rounded-xl shadow-2xl p-4 z-50">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <FiSettings className="w-4 h-4" /> Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm flex items-center gap-2 mb-2">
                          <FiType className="w-4 h-4" /> Font Size
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="12"
                            max="24"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="flex-1 accent-emerald-500"
                          />
                          <span className="text-white text-sm w-8">{fontSize}px</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm flex items-center gap-2 mb-2">
                          <FiAlignLeft className="w-4 h-4" /> Tab Size
                        </label>
                        <div className="flex gap-2">
                          {[2, 4].map((size) => (
                            <button
                              key={size}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-all"
                            >
                              {size} Spaces
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative">
              <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1.5 sm:mb-2">Language</label>
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-3 px-4 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all w-full lg:w-auto lg:min-w-[220px]"
              >
                <span className={`w-3.5 h-3.5 rounded-full ${currentLang?.color || 'bg-gray-500'}`}></span>
                <span className="text-white font-medium flex-1 text-left">{currentLang?.label || 'Select'}</span>
                <span className="hidden sm:inline text-xs text-gray-500 px-2 py-0.5 bg-white/5 rounded-full">{currentLang?.category}</span>
                <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showLangDropdown && (
                <div className="absolute top-full left-0 lg:right-0 mt-2 w-full lg:w-80 max-h-96 overflow-hidden bg-[#0d0d1a] border border-white/10 rounded-xl shadow-2xl z-50">
                  <div className="p-3 border-b border-white/5">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search languages..."
                        value={langSearch}
                        onChange={(e) => setLangSearch(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                      />
                      {langSearch && (
                        <button onClick={() => setLangSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10">
                          <FiX className="w-3 h-3 text-gray-500" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-2 max-h-72 overflow-y-auto">
                    {filteredLanguages.map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => handleLanguageChange(lang.value)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                          language === lang.value ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/5 text-gray-300'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${lang.color}`}></span>
                        <span className="flex-1 text-left text-sm">{lang.label}</span>
                        <span className="text-xs text-gray-500">{lang.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1.5 sm:mb-2">Input</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input for your code..."
                className="w-full px-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none text-base font-mono leading-relaxed"
                rows={1}
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={runCode}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 sm:px-10 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25 text-base"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span className="hidden sm:inline">Running...</span>
                  </>
                ) : (
                  <>
                    <FiPlay className="w-5 h-5" />
                    Run Code
                  </>
                )}
              </button>
              <button onClick={copyCode} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all" title="Copy">
                <FiCopy className="w-5 h-5 text-gray-400" />
              </button>
              <button onClick={downloadCode} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all" title="Download">
                <FiDownload className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
            <div className="xl:col-span-3">
              <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0d0d1a]">
                <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-500"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-yellow-500"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-black font-semibold hidden sm:block">{currentLang?.label || 'Untitled'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${currentLang?.color || 'bg-gray-500'}/20 text-black border border-black/10`}>
                      {currentLang?.label}
                    </span>
                    <div className="hidden sm:flex items-center gap-4 text-xs text-white font-medium">
                      <span className="flex items-center gap-1"><FiHash className="w-3 h-3" /> Ln {cursorPosition.line}</span>
                      <span>Col {cursorPosition.column}</span>
                    </div>
                  </div>
                </div>
                <Editor
                  height={isFullscreen ? "calc(100vh - 140px)" : "65vh"}
                  language={currentLang?.monaco || "javascript"}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme={theme}
                  options={{
                    fontSize: fontSize,
                    minimap: { enabled: false },
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    renderLineHighlight: "all",
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    tabSize: 4,
                    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                    fontLigatures: true,
                    cursorBlinking: "smooth",
                    smoothScrolling: true,
                    padding: { top: 20, bottom: 20 },
                    lineHeight: fontSize * 1.5,
                    letterSpacing: 0.5,
                    cursorWidth: 2,
                    cursorStyle: "line",
                    validate: true,
                    rulers: [],
                    overviewRulerBorder: false,
                    hideCursorInOverviewRuler: true,
                    renderWhitespace: "selection",
                  }}
                />
              </div>
            </div>

            <div className="xl:col-span-1 space-y-4 lg:space-y-6">
              <div className="rounded-2xl border border-white/10 bg-[#0d0d1a] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <FiTerminal className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-medium text-sm">Output</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {output && !error && (
                      <button onClick={copyOutput} className="text-xs text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1">
                        <FiCopy className="w-3 h-3" /> Copy
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-4 min-h-[200px] max-h-[350px] overflow-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex items-center gap-3 text-emerald-400">
                        <span className="w-6 h-6 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></span>
                        <span className="text-base font-medium">Executing...</span>
                      </div>
                    </div>
                  ) : output ? (
                    <pre className={`whitespace-pre-wrap break-words font-mono text-base leading-relaxed ${error ? 'text-red-400' : 'text-gray-200'}`}>
                      {output}
                    </pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <FiTerminal className="w-12 h-12 mb-3 opacity-50" />
                      <p className="text-base">Run code to see output</p>
                    </div>
                  )}
                </div>
              </div>

              {metrics && (
                <div className="rounded-2xl border border-white/10 bg-[#0d0d1a] overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/5">
                    <FiZap className="w-4 h-4 text-cyan-400" />
                    <span className="text-white font-medium text-sm">Performance</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <FiClock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-400 text-sm">Execution Time</span>
                      </div>
                      <span className="text-cyan-400 font-mono font-medium">{metrics.executionTime}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <FiCpu className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-400 text-sm">Memory Used</span>
                      </div>
                      <span className="text-purple-400 font-mono font-medium">{metrics.memoryUsed}</span>
                    </div>
                  </div>
                </div>
              )}

              {complexity && (
                <div className="rounded-2xl border border-white/10 bg-[#0d0d1a] overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/5">
                    <FiBarChart2 className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium text-sm">Complexity</span>
                  </div>
                  <div className="p-4 space-y-3">
                    {[
                      { label: "Best", value: complexity.bestCase, color: "text-emerald-400" },
                      { label: "Average", value: complexity.averageCase, color: "text-yellow-400" },
                      { label: "Worst", value: complexity.worstCase, color: "text-red-400" },
                      { label: "Space", value: complexity.spaceComplexity, color: "text-blue-400" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <span className="text-gray-400 text-sm">{item.label}</span>
                        <span className={`font-mono font-medium ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
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

export default CompileCode;
