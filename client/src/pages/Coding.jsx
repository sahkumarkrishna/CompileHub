import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiCode, FiPlay, FiCheck, FiTrendingUp, FiClock, FiUsers, FiStar, FiAward, FiTarget, FiZap, FiShield, FiDatabase, FiCpu, FiHash, FiLayers, FiFile, FiGrid, FiSearch, FiFilter, FiArrowRight, FiCheckCircle, FiBookOpen, FiGitBranch, FiServer, FiLock, FiCpu as FiCpuIcon, FiMessageSquare, FiThumbsUp, FiChevronRight, FiTrendingDown, FiEye, FiHeart, FiShare2 } from "react-icons/fi";

const Coding = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };
  const featuredProblems = [
    { id: 1, title: "Two Sum", difficulty: "Easy", acceptance: "49%", topics: ["Array", "Hash Table"], solved: 128450, status: "solved" },
    { id: 2, title: "Add Two Numbers", difficulty: "Medium", acceptance: "38%", topics: ["Linked List", "Math"], solved: 89520, status: "attempted" },
    { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", acceptance: "33%", topics: ["Hash Table", "String"], solved: 67890, status: "solved" },
    { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", acceptance: "40%", topics: ["Array", "Binary Search"], solved: 23456, status: "unsolved" },
    { id: 5, title: "Valid Parentheses", difficulty: "Easy", acceptance: "40%", topics: ["String", "Stack"], solved: 112345, status: "solved" },
    { id: 6, title: "Merge Two Sorted Lists", difficulty: "Easy", acceptance: "61%", topics: ["Linked List"], solved: 98765, status: "solved" },
  ];
  const topics = [
    { 
      name: "Arrays", 
      problems: 180, 
      icon: <FiGrid className="w-8 h-8" />, 
      color: "from-blue-500 to-cyan-500",
      bgGradient: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
      image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=400&fit=crop",
      users: "25K+"
    },
    { 
      name: "Strings", 
      problems: 142, 
      icon: <FiFile className="w-8 h-8" />, 
      color: "from-emerald-500 to-teal-500",
      bgGradient: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
      users: "20K+"
    },
    { 
      name: "Linked Lists", 
      problems: 98, 
      icon: <FiLayers className="w-8 h-8" />, 
      color: "from-purple-500 to-pink-500",
      bgGradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop",
      users: "15K+"
    },
    { 
      name: "Trees", 
      problems: 156, 
      icon: <FiGitBranch className="w-8 h-8" />, 
      color: "from-orange-500 to-red-500",
      bgGradient: "bg-gradient-to-br from-orange-500/20 to-red-500/20",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
      users: "18K+"
    },
    { 
      name: "Graphs", 
      problems: 112, 
      icon: <FiHash className="w-8 h-8" />, 
      color: "from-yellow-500 to-amber-500",
      bgGradient: "bg-gradient-to-br from-yellow-500/20 to-amber-500/20",
      image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop",
      users: "12K+"
    },
    { 
      name: "Dynamic Programming", 
      problems: 165, 
      icon: <FiCpu className="w-8 h-8" />, 
      color: "from-indigo-500 to-violet-500",
      bgGradient: "bg-gradient-to-br from-indigo-500/20 to-violet-500/20",
      image: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=600&h=400&fit=crop",
      users: "22K+"
    },
  ];
  const stats = [
    { label: "Problems", value: "850+", icon: <FiCode className="w-6 h-6" />, color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10" },
    { label: "Solved Today", value: "2.5K", icon: <FiCheck className="w-6 h-6" />, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-500/10" },
    { label: "Active Users", value: "50K+", icon: <FiUsers className="w-6 h-6" />, color: "from-purple-500 to-pink-500", bg: "bg-purple-500/10" },
    { label: "Success Rate", value: "95%", icon: <FiTrendingUp className="w-6 h-6" />, color: "from-orange-500 to-red-500", bg: "bg-orange-500/10" },
  ];
  const difficulties = [
    { key: "all", name: "All", count: 850, color: "text-white" },
    { key: "easy", name: "Easy", count: 280, color: "text-emerald-400" },
    { key: "medium", name: "Medium", count: 420, color: "text-yellow-400" },
    { key: "hard", name: "Hard", count: 150, color: "text-red-400" },
  ];
  const companies = ["Google", "Meta", "Amazon", "Apple", "Microsoft", "Netflix"];
  const premiumFeatures = [
    { icon: <FiZap className="w-5 h-5" />, text: "Premium problems from FAANG interviews" },
    { icon: <FiCheck className="w-5 h-5" />, text: "Detailed video explanations" },
    { icon: <FiTrendingUp className="w-5 h-5" />, text: "Progress tracking & analytics" },
    { icon: <FiAward className="w-5 h-5" />, text: "Certificate of completion" },
  ];
  return (
    <div className="min-h-screen bg-[#030712]" onMouseMove={handleMouseMove}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[200px] transition-transform duration-[3000ms] ease-out"
          style={{ transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` }}
        ></div>
        <div 
          className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[200px] transition-transform duration-[3000ms] ease-out"
          style={{ transform: `translate(${-mousePosition.x * 0.02}px, ${-mousePosition.y * 0.02}px)` }}
        ></div>
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)`, backgroundSize: '60px 60px' }}></div>
      </div>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className={`space-y-8 relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 backdrop-blur-sm animate-pulse-glow">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-300 text-sm font-medium">850+ Premium Problems</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full animate-pulse">NEW</span>
              </div>
              
              <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <span className="block animate-fade-in-up">Master</span>
                <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                  Coding
                </span>
                <span className="block animate-fade-in-up animation-delay-300">Interviews</span>
              </h1>
              
              <p className={`text-gray-400 text-lg sm:text-xl max-w-lg leading-relaxed transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                Practice with curated problems from top tech companies. Track your progress and land your dream job at FAANG.
              </p>
              {/* Premium Features Mini */}
              <div className={`grid grid-cols-2 gap-3 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {premiumFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-400 group hover:text-emerald-400 transition-all duration-300">
                    <span className="group-hover:scale-110 transition-transform duration-300">{feature.icon}</span>
                    {feature.text}
                  </div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Link 
                  to="/problems/all" 
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all duration-500 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <span className="relative">Start Practicing Free</span>
                  <FiArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link 
                  to="/home" 
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-[1.02]"
                >
                  <FiPlay className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Watch Demo
                </Link>
              </div>
              {/* Mini Stats */}
              <div className={`flex items-center gap-8 pt-4 transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {[
                  { value: "50K+", label: "Active Users" },
                  { value: "10M+", label: "Submissions" },
                  { value: "95%", label: "Success Rate" },
                ].map((stat, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <div className="h-12 w-px bg-white/10"></div>}
                    <div className="group hover:scale-105 transition-transform duration-300">
                      <p className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">{stat.value}</p>
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            {/* Right - Code Preview Card */}
            <div className={`relative z-10 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-all duration-700 animate-pulse-glow"></div>
                
                {/* Code Card */}
                <div className="relative bg-[#0a0a14]/95 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-all duration-500">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 hover:scale-125 transition-transform duration-300"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 hover:scale-125 transition-transform duration-300"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500 hover:scale-125 transition-transform duration-300"></div>
                    </div>
                    <span className="text-gray-500 text-sm">two-sum.py</span>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <FiCheckCircle className="w-4 h-4 animate-pulse" />
                      <span className="text-sm">Solved</span>
                    </div>
                  </div>
                  
                  {/* Code Content */}
                  <div className="p-6 font-mono text-sm">
                    <pre className="text-gray-300 leading-relaxed animate-shimmer"><span className="text-purple-400">def</span> <span className="text-blue-400">twoSum</span>(<span className="text-orange-400">self</span>, <span className="text-green-400">nums</span>, <span className="text-green-400">target</span>):{`\n`}
{`  `}<span className="text-purple-400">for</span> i <span className="text-purple-400">in</span> <span className="text-purple-400">range</span>(<span className="text-amber-400">len</span>(<span className="text-green-400">nums</span>)):{`\n`}
{`    `}<span className="text-purple-400">for</span> j <span className="text-purple-400">in</span> <span className="text-purple-400">range</span>(i + <span className="text-amber-400">1</span>, <span className="text-amber-400">len</span>(<span className="text-green-400">nums</span>)):{`\n`}
{`      `}<span className="text-purple-400">if</span> <span className="text-green-400">nums</span>[i] + <span className="text-green-400">nums</span>[j] == <span className="text-green-400">target</span>:{`\n`}
{`        `}<span className="text-purple-400">return</span> [i, j]</pre>
                  </div>
                  
                  {/* Stats Footer */}
                  <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">Easy</span>
                      <span className="text-gray-500 text-sm">Acceptance: 49%</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <span className="flex items-center gap-1 hover:text-emerald-400 transition-colors"><FiClock className="w-4 h-4" /> 5 min</span>
                      <span className="flex items-center gap-1 hover:text-emerald-400 transition-colors"><FiEye className="w-4 h-4" /> 128K</span>
                    </div>
                  </div>
                </div>
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-4 shadow-2xl animate-bounce">
                  <div className="flex items-center gap-3">
                    <FiCheckCircle className="w-6 h-6 text-white animate-pulse" />
                    <div>
                      <p className="text-white font-bold">Solved!</p>
                      <p className="text-white/70 text-sm">+150 XP</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-[#0a0a14]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                      <FiTrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold">Top 5%</p>
                      <p className="text-gray-500 text-sm">Global Ranking</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="relative -mt-16 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className={`group bg-[#0a0a14]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 stagger-item`}
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white text-center group-hover:text-emerald-400 transition-colors duration-300">{stat.value}</p>
                <p className="text-gray-500 text-sm text-center mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Featured Problems Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 animate-pulse">
                <FiStar className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">Most Popular</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Featured Problems
              </h2>
            </div>
            
            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 bg-[#0a0a14]/50 p-1.5 rounded-xl border border-white/5">
              {difficulties.map((diff) => (
                <button
                  key={diff.key}
                  onClick={() => setActiveDifficulty(diff.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeDifficulty === diff.key
                      ? `${diff.color} bg-white/10 border border-white/10 shadow-lg`
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {diff.name} ({diff.count})
                </button>
              ))}
            </div>
          </div>
          {/* Problems Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {featuredProblems.map((problem, i) => (
              <div 
                key={problem.id} 
                className="group relative bg-[#0a0a14]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 hover:bg-[#0a0a14]/80 cursor-pointer stagger-item hover:scale-[1.01]"
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                {/* Status Indicator */}
                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse ${
                  problem.status === 'solved' ? 'bg-emerald-500' : 
                  problem.status === 'attempted' ? 'bg-yellow-500' : 'bg-gray-600'
                }`}></div>
                
                <div className="flex items-start gap-4">
                  {/* Problem Number */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300 truncate">
                        {problem.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        problem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                      {problem.topics.map((topic, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white/5 rounded-md group-hover:bg-white/10 transition-colors duration-300">{topic}</span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="group-hover:text-emerald-400 transition-colors">{problem.acceptance} acceptance</span>
                        <span className="group-hover:text-emerald-400 transition-colors">{problem.solved.toLocaleString()} solves</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-red-400 hover:scale-110 transition-all duration-300">
                          <FiHeart className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-emerald-400 hover:scale-110 transition-all duration-300">
                          <FiShare2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 hover:scale-110 transition-all duration-300 group/btn">
                          <FiPlay className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* View All Button */}
          <div className="mt-12 text-center">
            <Link 
              to="/problems/all" 
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              View All 850+ Problems
              <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
      {/* Topics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <FiBookOpen className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">Categories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Explore by Topic
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Master different areas of programming with our curated problem sets
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, i) => (
              <div 
                key={i} 
                className="group relative overflow-hidden rounded-2xl bg-[#0a0a14]/60 border border-white/5 hover:border-emerald-500/30 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] cursor-pointer stagger-item"
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                {/* Background Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={topic.image} 
                    alt={topic.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-20`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/60 to-transparent" />
                  
                  {/* Icon Badge */}
                  <div className={`absolute top-4 left-4 w-14 h-14 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-white shadow-lg shadow-black/20 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {topic.icon}
                  </div>
                  {/* Users Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-lg flex items-center gap-2 group-hover:bg-black/70 transition-all duration-300">
                    <FiUsers className="w-4 h-4 text-gray-300" />
                    <span className="text-white text-sm font-medium">{topic.users}</span>
                  </div>
                </div>
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">
                      {topic.name}
                    </h3>
                    <FiChevronRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 group-hover:rotate-90 transition-all duration-300" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium group-hover:bg-emerald-500/30 transition-colors">{topic.problems} Problems</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:animate-pulse"></span>
                      <span className="w-2 h-2 rounded-full bg-yellow-500 group-hover:animate-pulse" style={{ animationDelay: '100ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-red-500 group-hover:animate-pulse" style={{ animationDelay: '200ms' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Company Tags Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50 border border-white/10 p-12 sm:p-16 group hover:scale-[1.01] transition-all duration-500">
            <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
            
            <div className="relative text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
                <FiShield className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Company Specific</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Prepare for Your Dream Company
              </h2>
              <p className="text-gray-300 text-lg mb-10">
                Filter problems by your target companies. Practice questions asked in real interviews.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4">
                {companies.map((company, i) => (
                  <span 
                    key={i} 
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white font-medium transition-all cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-white/10 stagger-item"
                    style={{ animationDelay: `${(i + 1) * 100}ms` }}
                  >
                    {company}
                  </span>
                ))}
              </div>
              
              <Link 
                to="/home" 
                className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Start Interview Prep
                <FiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
              <div className="relative overflow-hidden rounded-3xl border border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" 
                  alt="About CompileHub Team"
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent"></div>
              </div>
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -right-6 bg-[#0a0a14]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <FiCode className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">5+</p>
                    <p className="text-gray-500 text-sm">Years Experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <FiTarget className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">About Us</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Empowering Coders
                <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Worldwide
                </span>
              </h2>
              
              <p className="text-gray-400 text-lg leading-relaxed">
                CompileHub is a free, online coding practice platform that supports 50+ programming languages. We built it to make coding accessible to everyone, anywhere, anytime.
              </p>
              
              <p className="text-gray-400 text-lg leading-relaxed">
                Whether you're a student learning to code, a developer testing snippets, or preparing for coding interviews, CompileHub provides the tools you need without any installation.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "1M+", label: "Active Users", icon: <FiUsers className="w-6 h-6" /> },
                  { value: "50+", label: "Languages", icon: <FiCode className="w-6 h-6" /> },
                  { value: "850+", label: "Problems", icon: <FiGrid className="w-6 h-6" /> },
                  { value: "10M+", label: "Submissions", icon: <FiTrendingUp className="w-6 h-6" /> },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link 
                to="/home" 
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
              >
                Learn More About Us
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <FiMessageSquare className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Success Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join thousands of developers who have successfully landed their dream jobs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Sarah Chen", role: "Software Engineer at Google", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", rating: 5, text: "CompileHub helped me land my dream job at Google! The problem variety is top-notch.", company: "Google" },
              { name: "Michael Rodriguez", role: "Full Stack at Meta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", rating: 5, text: "The weekly contests made my interview prep so much easier.", company: "Meta" },
              { name: "Emily Watson", role: "Backend at Amazon", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", rating: 5, text: "Best coding platform. Got hired at Amazon within 3 months!", company: "Amazon" },
              { name: "David Kim", role: "Software at Netflix", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", rating: 5, text: "The community solutions are incredibly helpful. Learned so much.", company: "Netflix" },
            ].map((testimonial, i) => (
              <div 
                key={i} 
                className="group relative bg-[#0a0a14]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-emerald-500/10 stagger-item"
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full">
                  {testimonial.company}
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, idx) => (
                    <FiStar key={idx} className="w-4 h-4 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" style={{ animationDelay: `${idx * 100}ms` }} />
                  ))}
                </div>
                
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">"{testimonial.text}"</p>
                
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/30 group-hover:border-emerald-400 transition-colors duration-300"
                  />
                  <div>
                    <p className="text-white font-semibold text-sm group-hover:text-emerald-400 transition-colors duration-300">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Trust Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "50K+", label: "Happy Users" },
              { value: "95%", label: "Success Rate" },
              { value: "4.9", label: "App Rating" },
              { value: "10M+", label: "Submissions" },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">{stat.value}</p>
                <p className="text-gray-500 mt-2 group-hover:text-emerald-400 transition-colors duration-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl group">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=600&fit=crop" 
                alt="CTA Background"
                className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 via-teal-900/95 to-cyan-900/95"></div>
            </div>
            <div className="relative p-10 sm:p-16 lg:p-20 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of developers preparing for their dream jobs. Start practicing today.
              </p>
              <Link 
                to="/home" 
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-emerald-700 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start Practicing Now - It's Free
                <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Coding;