import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiSolidChevronDown } from "react-icons/bi";
import { FiCode, FiZap, FiCloud, FiCpu } from "react-icons/fi";
import Loading from "../components/Loading";
import Feedback from "../pages/Feedback";
import StatsSection from "./StatsSection";

const Home = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const faqList = [
    {
      question: "🤖 Which programming languages does CompileHub support?",
      answer: "CompileHub supports a wide range of popular programming languages including Python, JavaScript, C++, Java, and many others.",
    },
    {
      question: "💻 Do I need to install anything?",
      answer: "No, there's absolutely no need to install anything! CompileHub is completely web-based and works directly in your browser.",
    },
    {
      question: "☁️ Can I save my projects?",
      answer: "Yes! CompileHub allows you to save your code projects securely in the cloud by creating an account.",
    },
    {
      question: "🎁 Is CompileHub free to use?",
      answer: "Absolutely! CompileHub offers a robust free tier with all essential features, and affordable upgrades for premium features.",
    },
  ];

  const features = [
    {
      icon: <FiZap className="text-yellow-500" size={40} />,
      title: "Real-time Preview",
      desc: "Instantly see output as you write code—no need to refresh or re-run manually.",
    },
    {
      icon: <FiCode className="text-blue-500" size={40} />,
      title: "Intelligent Autocompletion",
      desc: "Smart suggestions tailored to your language and context. Great for beginners and pros alike.",
    },
    {
      icon: <FiCpu className="text-purple-500" size={40} />,
      title: "Multi-Language Support",
      desc: "Easily switch between Python, JS, Java, C++, etc. Ideal for full-stack or competitive coding.",
    },
    {
      icon: <FiCloud className="text-green-500" size={40} />,
      title: "Cloud Integration",
      desc: "Save and sync all projects in the cloud. Continue from anywhere on any device.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900">
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 space-y-8 animate-fadeIn">
              <div className="inline-block animate-float">
                <span className="bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-300 px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2">
                  <FiZap className="w-4 h-4" /> Lightning Fast Compiler
                </span>
              </div>
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black leading-tight">
                <span className="gradient-text block mb-2">
                  Code.
                </span>
                <span className="gradient-text block mb-2">
                  Compile.
                </span>
                <span className="gradient-text block">
                  Create.
                </span>
              </h1>
              <p className="text-gray-300 text-xl md:text-2xl leading-relaxed">
                Experience the future of coding with our blazing-fast online compiler. Real-time execution, intelligent autocompletion, and seamless cloud integration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/compileCode" className="btn-primary text-center text-lg px-8 py-4 group">
                  Start Coding Free
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link to="/watchDemo" className="btn-secondary text-center text-lg px-8 py-4">
                  Watch Demo
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">No Installation</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Browser Based</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">100% Free</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative">
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Loading />
                </div>
              )}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-3xl blur-3xl opacity-30 group-hover:opacity-50 transition-opacity animate-pulse"></div>
                <img
                  src="/vscode.png"
                  alt="Code Editor"
                  onLoad={() => setIsImageLoaded(true)}
                  className={`relative rounded-2xl shadow-2xl border-2 border-emerald-500/30 transition-all duration-700 group-hover:scale-105 ${
                    isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      <section className="py-20 px-4 sm:px-6 md:px-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-5xl sm:text-6xl font-black gradient-text mb-6">
              Powerful Features
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Everything you need to code, compile, and create amazing projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card group hover:scale-105 hover:border-emerald-500/50 transition-all duration-300 text-center p-8">
                <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform">
                  <div className="p-4 bg-gray-800/50 rounded-2xl group-hover:bg-emerald-500/10 transition-colors">
                    {f.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 md:px-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="card p-12 lg:p-16">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <img
                    src="/About.avif"
                    alt="About"
                    className="relative rounded-2xl shadow-2xl border-2 border-emerald-500/30"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <h2 className="text-5xl sm:text-6xl font-black gradient-text">
                  About CompileHub
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  At <strong className="text-emerald-400">CompileHub</strong>, we believe coding should be intuitive, accessible, and seamless—whether you're just starting or you're an experienced developer.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Built with modern developers in mind, we eliminate the hassle of switching tools or installing compilers. With real-time previews, intelligent autocompletion, and cloud storage, your workflow stays uninterrupted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl sm:text-6xl font-black text-center gradient-text mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqList.map(({ question, answer }, idx) => (
              <div
                key={idx}
                className="card cursor-pointer hover:border-emerald-500/50 transition-all"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{question}</h3>
                  <BiSolidChevronDown
                    className={`text-emerald-400 text-2xl transition-transform duration-300 ${
                      openIndex === idx ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {openIndex === idx && (
                  <p className="mt-4 text-gray-400 leading-relaxed animate-fadeIn">
                    {answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Feedback />
    </div>
  );
};

export default Home;
