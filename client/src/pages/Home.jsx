import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiSolidChevronDown } from "react-icons/bi";
import { FiCode, FiZap, FiCloud, FiPlay, FiCheck, FiArrowRight, FiTerminal, FiLayers, FiClock, FiUsers, FiStar, FiTrendingUp, FiAward, FiHeart, FiShare2, FiEdit3, FiGlobe, FiShield, FiLock, FiDatabase, FiCpu, FiMessageSquare, FiTarget, FiBookOpen, FiCode as FiCodeIcon, FiGitBranch, FiFile, FiHash, FiMessageSquare as FiMessageSquareIcon, FiThumbsUp } from "react-icons/fi";
import Loading from "../components/Loading";
import Feedback from "../pages/Feedback";
import StatsSection from "./StatsSection";
import Footer from "../components/Footer";


const Home = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const faqList = [
    { question: "How do I start practicing coding?", answer: "Simply click the 'Start Practice' button, choose your preferred programming language, and start solving problems. No account required!" },
    { question: "What topics are covered in the practice problems?", answer: "We cover a wide range of topics including algorithms, data structures, web development, databases, and more. New problems are added regularly." },
    { question: "Can I track my progress?", answer: "Yes! Create a free account to track your progress, save your solutions, and see your improvement over time with detailed statistics." },
    { question: "Are there solutions and explanations?", answer: "Yes! After solving a problem, you can view community solutions and explanations to learn different approaches." },
  ];

  const features = [
    { icon: <FiTarget className="w-7 h-7" />, title: "Structured Practice", desc: "Follow a curated learning path from beginner to advanced levels.", color: "from-emerald-500 to-teal-500", bg: "bg-emerald-500/10" },
    { icon: <FiCodeIcon className="w-7 h-7" />, title: "Code Editor", desc: "Practice coding directly in our built-in editor with syntax highlighting.", color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10" },
    { icon: <FiBookOpen className="w-7 h-7" />, title: "50+ Languages", desc: "Practice in any programming language you want to learn.", color: "from-purple-500 to-pink-500", bg: "bg-purple-500/10" },
    { icon: <FiGitBranch className="w-7 h-7" />, title: "All Difficulty Levels", desc: "From easy warm-ups to challenging problems for experts.", color: "from-orange-500 to-red-500", bg: "bg-orange-500/10" },
    { icon: <FiDatabase className="w-7 h-7" />, title: "Real-time Output", desc: "See your code execution results instantly.", color: "from-indigo-500 to-violet-500", bg: "bg-indigo-500/10" },
    { icon: <FiTrendingUp className="w-7 h-7" />, title: "Track Progress", desc: "Monitor your improvement with detailed statistics.", color: "from-yellow-500 to-amber-500", bg: "bg-yellow-500/10" },
  ];

  const steps = [
    { icon: <FiTarget className="w-8 h-8" />, title: "Choose Topic", desc: "Select a topic or difficulty level to practice." },
    { icon: <FiEdit3 className="w-8 h-8" />, title: "Solve Problem", desc: "Write your solution in the code editor." },
    { icon: <FiPlay className="w-8 h-8" />, title: "Run & Test", desc: "Test your code against multiple test cases." },
    { icon: <FiAward className="w-8 h-8" />, title: "Learn & Improve", desc: "View solutions and explanations to improve." },
  ];

  const topics = [
    { name: "Arrays", problems: 180, icon: <FiHash className="w-8 h-8" />, color: "from-blue-500 to-cyan-500", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop" },
    { name: "Strings", problems: 142, icon: <FiFile className="w-8 h-8" />, color: "from-emerald-500 to-teal-500", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop" },
    { name: "Linked Lists", problems: 98, icon: <FiLayers className="w-8 h-8" />, color: "from-purple-500 to-pink-500", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop" },
    { name: "Trees", problems: 156, icon: <FiGitBranch className="w-8 h-8" />, color: "from-orange-500 to-red-500", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop" },
    { name: "Graphs", problems: 112, icon: <FiHash className="w-8 h-8" />, color: "from-yellow-500 to-amber-500", image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=300&fit=crop" },
    { name: "Dynamic Programming", problems: 165, icon: <FiCpu className="w-8 h-8" />, color: "from-indigo-500 to-violet-500", image: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=400&h=300&fit=crop" },
  ];

  const testimonials = [
    { name: "Alex Thompson", role: "Computer Science Student", content: "This platform helped me prepare for my coding interviews. The structured problems are amazing!", rating: 5, avatar: "👨‍💻" },
    { name: "Priya Sharma", role: "Software Developer", content: "I love practicing here during my commute. The mobile-friendly interface is great!", rating: 5, avatar: "👩‍💻" },
    { name: "James Wilson", role: "Beginner Programmer", content: "Perfect for beginners like me. The easy problems helped me build confidence.", rating: 5, avatar: "🧑‍🎓" },
  ];

  const homeTestimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "CompileHub helped me land my dream job at Google! The problem variety and explanations are top-notch.",
      company: "Google"
    },
    {
      name: "Michael Rodriguez",
      role: "Full Stack Developer at Meta",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "The weekly contests and company-specific tags made my interview prep so much easier.",
      company: "Meta"
    },
    {
      name: "Emily Watson",
      role: "Backend Engineer at Amazon",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Best coding practice platform I've used. Got hired at Amazon within 3 months!",
      company: "Amazon"
    },
    {
      name: "David Kim",
      role: "Software Engineer at Netflix",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "The community solutions and discussions are incredibly helpful. I learned so much.",
      company: "Netflix"
    },
  ];

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="min-h-screen bg-[#030712]" onMouseMove={handleMouseMove}>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div 
            className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[150px] transition-transform duration-1000 ease-out"
            style={{ transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` }}
          ></div>
          <div 
            className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[150px] transition-transform duration-1000 ease-out"
            style={{ transform: `translate(${-mousePosition.x * 0.02}px, ${-mousePosition.y * 0.02}px)` }}
          ></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-500/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-cyan-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm animate-fade-in-up">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-emerald-300">Master coding through practice</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] tracking-tight">
                <span className="block animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Practice.</span>
                <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Learn.</span>
                <span className="block animate-fade-in-up" style={{ animationDelay: '0.3s' }}>Succeed.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                The ultimate coding practice platform. Solve problems, improve your skills, and prepare for coding interviews in 50+ programming languages.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <Link to="/compiler" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105">
                  Start Practice
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/watchDemo" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold rounded-xl transition-all duration-200 backdrop-blur-sm hover:border-white/30">
                  <FiPlay className="w-5 h-5" />
                  Watch Demo
                </Link>
              </div>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-2 text-emerald-400"><FiCheck className="w-5 h-5" /><span className="text-sm">500+ Problems</span></div>
                <div className="flex items-center gap-2 text-emerald-400"><FiCheck className="w-5 h-5" /><span className="text-sm">50+ Languages</span></div>
                <div className="flex items-center gap-2 text-emerald-400"><FiCheck className="w-5 h-5" /><span className="text-sm">Free Forever</span></div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-xl lg:max-w-2xl animate-fade-in-left" style={{ animationDelay: '0.3s' }}>
              {!isImageLoaded && <div className="flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-[1.02]"></div>
                <img src="/vscode.png" alt="Code Editor" onLoad={() => setIsImageLoaded(true)} className={`relative rounded-2xl shadow-2xl border border-white/10 transition-all duration-700 hover:scale-[1.01] ${isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} />
                <div className="absolute -bottom-4 -right-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-white text-sm font-medium shadow-lg flex items-center gap-2">
                  <FiTarget className="w-4 h-4" />
                  Start Solving
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <BiSolidChevronDown className="w-8 h-8 text-gray-500" />
        </div>
      </section>

      <StatsSection />

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Coding</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={topic.image} 
                    alt={topic.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className={`hidden absolute inset-0 bg-gradient-to-br ${topic.color} opacity-20 items-center justify-center`}>
                    {topic.icon}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center mb-3 text-white shadow-lg`}>
                    {topic.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1">{topic.name}</h3>
                  <p className="text-gray-400 text-sm">{topic.problems} problems</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#030712] via-emerald-950/10 to-[#030712]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">How It Works</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">4 Simple Steps</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Get started with coding practice in seconds</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-emerald-400">
                  {step.icon}
                </div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-emerald-400 font-bold text-sm">{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">Features</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Powerful tools to help you become a better programmer</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f, i) => (
              <div key={i} className="group p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.05]">
                <div className={`w-14 h-14 rounded-xl ${f.bg} flex items-center justify-center mb-5 text-gray-300 group-hover:text-white group-hover:scale-110 transition-all duration-300`}>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${f.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                    {f.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">About Us</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">Empowering Coders Worldwide</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                CompileHub is a free, online coding practice platform that supports 50+ programming languages. We built it to make coding accessible to everyone, anywhere, anytime.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Whether you're a student learning to code, a developer testing snippets, or preparing for coding interviews, CompileHub provides the tools you need without any installation.
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                <div>
                  <p className="text-3xl font-bold text-white">1M+</p>
                  <p className="text-gray-400 text-sm">Active Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">50+</p>
                  <p className="text-gray-400 text-sm">Languages</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">500+</p>
                  <p className="text-gray-400 text-sm">Problems</p>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop" alt="About CompileHub" className="relative rounded-2xl shadow-2xl border border-white/10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#030712] via-emerald-950/5 to-[#030712]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <FiMessageSquareIcon className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join thousands of developers who have successfully landed their dream jobs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeTestimonials.map((testimonial, i) => (
              <div key={i} className="group relative bg-[#0a0a14]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-2">
                <FiMessageSquareIcon className="w-10 h-10 text-emerald-500/20 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, idx) => (
                    <FiStar key={idx} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/30"
                  />
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full">
                    {testimonial.company}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">FAQ</h2>
            <p className="text-gray-400 text-lg">Frequently asked questions</p>
          </div>

          <div className="space-y-4">
            {faqList.map(({ question, answer }, idx) => (
              <div key={idx} onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white">{question}</h3>
                  <BiSolidChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ${openIndex === idx ? "rotate-180" : ""}`} />
                </div>
                {openIndex === idx && <p className="mt-4 text-gray-400 leading-relaxed">{answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-3xl overflow-hidden p-10 sm:p-16">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Ready to Start Practicing?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Join thousands of programmers who are improving their skills every day.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/home" className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg text-lg hover:scale-105">
                  Start Practice Now
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Feedback />

    </div>
  );
};

export default Home;
