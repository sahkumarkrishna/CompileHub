import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiCode, FiArrowRight, FiChevronRight, FiX } from 'react-icons/fi';

const WatchDemo = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const languages = [
    {
      id: 'python',
      name: 'Python',
      icon: '🐍',
      color: 'from-yellow-500 to-green-500',
      borderColor: 'border-yellow-500/30',
      videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
      description: 'Python is a powerful, easy-to-learn language used for web development, data analysis, AI, and automation.',
      tags: ['Beginner Friendly', 'Data Science', 'AI/ML']
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      icon: '🟨',
      color: 'from-yellow-400 to-amber-500',
      borderColor: 'border-yellow-500/30',
      videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
      description: 'JavaScript is the backbone of web development, enabling dynamic and interactive user experiences.',
      tags: ['Web Dev', 'Frontend', 'Backend']
    },
    {
      id: 'java',
      name: 'Java',
      icon: '☕',
      color: 'from-orange-500 to-red-500',
      borderColor: 'border-orange-500/30',
      videoUrl: 'https://www.youtube.com/embed/grEKMHGYyns',
      description: 'Java is a robust, object-oriented language widely used for enterprise applications.',
      tags: ['Enterprise', 'Android', 'Backend']
    },
    {
      id: 'c',
      name: 'C',
      icon: '🔵',
      color: 'from-blue-500 to-indigo-500',
      borderColor: 'border-blue-500/30',
      videoUrl: 'https://www.youtube.com/embed/KJgsSFOSQv0',
      description: 'C is a foundational programming language known for performance and low-level memory manipulation.',
      tags: ['Systems', 'Embedded', 'Performance']
    },
    {
      id: 'cpp',
      name: 'C++',
      icon: '🔷',
      color: 'from-blue-600 to-purple-500',
      borderColor: 'border-blue-600/30',
      videoUrl: 'https://www.youtube.com/embed/vLnPwxZdW4Y',
      description: 'C++ is an extension of C, supporting both procedural and object-oriented programming.',
      tags: ['Game Dev', 'Systems', 'Performance']
    },
    {
      id: 'go',
      name: 'Go',
      icon: '🐹',
      color: 'from-cyan-500 to-teal-500',
      borderColor: 'border-cyan-500/30',
      videoUrl: 'https://www.youtube.com/embed/un6ZyFkqFKo',
      description: 'Go (Golang) is a statically typed, compiled language designed at Google for simplicity and efficiency.',
      tags: ['Backend', 'Cloud', 'Microservices']
    },
    {
      id: 'rust',
      name: 'Rust',
      icon: '🦀',
      color: 'from-orange-600 to-red-600',
      borderColor: 'border-orange-600/30',
      videoUrl: 'https://www.youtube.com/embed/zF34dRTVpAM',
      description: 'Rust is a systems programming language focused on safety, speed, and concurrency.',
      tags: ['Systems', 'Memory Safe', 'WebAssembly']
    },
    {
      id: 'ruby',
      name: 'Ruby',
      icon: '💎',
      color: 'from-red-500 to-pink-500',
      borderColor: 'border-red-500/30',
      videoUrl: 'https://www.youtube.com/embed/t_ispmWmdNY',
      description: 'Ruby is a dynamic, reflective, object-oriented language known for its simplicity and productivity.',
      tags: ['Web Dev', 'Rails', 'Scripting']
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      icon: '🔷',
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-500/30',
      videoUrl: 'https://www.youtube.com/embed/zQnBQ4tB3ZA',
      description: 'TypeScript is a strongly typed programming language that builds on JavaScript.',
      tags: ['Web Dev', 'Type Safety', 'Scalable']
    },
    {
      id: 'swift',
      name: 'Swift',
      icon: '🟠',
      color: 'from-orange-500 to-red-500',
      borderColor: 'border-orange-500/30',
      videoUrl: 'https://www.youtube.com/embed/nAchMctX4YA',
      description: 'Swift is a powerful and intuitive programming language created by Apple for iOS and macOS.',
      tags: ['iOS', 'macOS', 'Apple Ecosystem']
    },
    {
      id: 'kotlin',
      name: 'Kotlin',
      icon: '🟣',
      color: 'from-purple-500 to-indigo-500',
      borderColor: 'border-purple-500/30',
      videoUrl: 'https://www.youtube.com/embed/F9UC9DYZRfm',
      description: 'Kotlin is a modern, concise, and safe programming language for Android development.',
      tags: ['Android', 'JVM', 'Modern']
    },
    {
      id: 'php',
      name: 'PHP',
      icon: '🐘',
      color: 'from-indigo-500 to-purple-600',
      borderColor: 'border-indigo-500/30',
      videoUrl: 'https://www.youtube.com/embed/OK7onuiQ5hQ',
      description: 'PHP is a popular server-side scripting language especially suited for web development.',
      tags: ['Web Dev', 'WordPress', 'Backend']
    },
    {
      id: 'csharp',
      name: 'C#',
      icon: '🟪',
      color: 'from-purple-600 to-violet-600',
      borderColor: 'border-purple-600/30',
      videoUrl: 'https://www.youtube.com/embed/ALXpVlPYqYE',
      description: 'C# is a modern, object-oriented language developed by Microsoft for building Windows applications.',
      tags: ['.NET', 'Game Dev', 'Windows']
    },
    {
      id: 'dart',
      name: 'Dart',
      icon: '🎯',
      color: 'from-cyan-400 to-blue-500',
      borderColor: 'border-cyan-400/30',
      videoUrl: 'https://www.youtube.com/embed/Ej_Pcr4uC2Q',
      description: 'Dart is a language optimized for building web, server, and mobile applications.',
      tags: ['Flutter', 'Mobile', 'Web']
    },
    {
      id: 'scala',
      name: 'Scala',
      icon: '⚡',
      color: 'from-red-600 to-orange-500',
      borderColor: 'border-red-600/30',
      videoUrl: 'https://www.youtube.com/embed/MwJdswsUB0',
      description: 'Scala combines object-oriented and functional programming in a concise language.',
      tags: ['JVM', 'Big Data', 'Functional']
    },
    {
      id: 'r',
      name: 'R',
      icon: '📊',
      color: 'from-blue-400 to-cyan-500',
      borderColor: 'border-blue-400/30',
      videoUrl: 'https://www.youtube.com/embed/_UKGZLjyd0c',
      description: 'R is a language and environment for statistical computing and graphics.',
      tags: ['Statistics', 'Data Science', 'Visualization']
    },
    {
      id: 'lua',
      name: 'Lua',
      icon: '🌙',
      color: 'from-indigo-400 to-purple-500',
      borderColor: 'border-indigo-400/30',
      videoUrl: 'https://www.youtube.com/embed/1S_lR4sOfq8',
      description: 'Lua is a lightweight, high-level scripting language designed for embedded use.',
      tags: ['Game Dev', 'Scripting', 'Embedded']
    },
    {
      id: 'perl',
      name: 'Perl',
      icon: '🐪',
      color: 'from-blue-600 to-indigo-600',
      borderColor: 'border-blue-600/30',
      videoUrl: 'https://www.youtube.com/embed/XFLmocC1ePE',
      description: 'Perl is a highly capable, feature-rich programming language with over 30 years of development.',
      tags: ['Text Processing', 'Scripting', 'Web']
    },
    {
      id: 'haskell',
      name: 'Haskell',
      icon: 'λ',
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500/30',
      videoUrl: 'https://www.youtube.com/embed/FqiGfv2f1To',
      description: 'Haskell is a purely functional programming language with strong static typing.',
      tags: ['Functional', 'Academic', 'Type Safety']
    },
    {
      id: 'elixir',
      name: 'Elixir',
      icon: '💧',
      color: 'from-purple-600 to-indigo-600',
      borderColor: 'border-purple-600/30',
      videoUrl: 'https://www.youtube.com/embed/pBNOaycXKvY',
      description: 'Elixir is a dynamic, functional language designed for building scalable applications.',
      tags: ['Concurrency', 'Fault Tolerant', 'Phoenix']
    },
    {
      id: 'clojure',
      name: 'Clojure',
      icon: '🌀',
      color: 'from-green-500 to-teal-500',
      borderColor: 'border-green-500/30',
      videoUrl: 'https://www.youtube.com/embed/NaogZFYtC3w',
      description: 'Clojure is a dynamic, general-purpose programming language supporting functional programming.',
      tags: ['Lisp', 'JVM', 'Concurrency']
    },
    {
      id: 'matlab',
      name: 'MATLAB',
      icon: '📐',
      color: 'from-blue-500 to-yellow-500',
      borderColor: 'border-blue-500/30',
      videoUrl: 'https://www.youtube.com/embed/gCwGNA6Cp3A',
      description: 'MATLAB is a high-performance language for technical computing and simulation.',
      tags: ['Engineering', 'Simulation', 'Mathematics']
    },
    {
      id: 'fortran',
      name: 'Fortran',
      icon: '🔢',
      color: 'from-blue-600 to-green-500',
      borderColor: 'border-blue-600/30',
      videoUrl: 'https://www.youtube.com/embed/gA1soUUDzTU',
      description: 'Fortran is a general-purpose programming language still widely used in scientific computing.',
      tags: ['Scientific', 'High Performance', 'Legacy']
    },
    {
      id: 'cobol',
      name: 'COBOL',
      icon: '📋',
      color: 'from-green-600 to-emerald-500',
      borderColor: 'border-green-600/30',
      videoUrl: 'https://www.youtube.com/embed/L3h30bk7QmU',
      description: 'COBOL is an aging language still used in many mainframe business applications.',
      tags: ['Mainframe', 'Business', 'Legacy']
    },
    {
      id: 'assembly',
      name: 'Assembly',
      icon: '⚙️',
      color: 'from-gray-500 to-gray-700',
      borderColor: 'border-gray-500/30',
      videoUrl: 'https://www.youtube.com/embed/4gwYc1TLR6I',
      description: 'Assembly language provides direct control over hardware at the lowest level.',
      tags: ['Low Level', 'Systems', 'Performance']
    },
    {
      id: 'powershell',
      name: 'PowerShell',
      icon: '💻',
      color: 'from-blue-600 to-blue-800',
      borderColor: 'border-blue-600/30',
      videoUrl: 'https://www.youtube.com/embed/4MJJGatUbzY',
      description: 'PowerShell is a task automation and configuration management framework from Microsoft.',
      tags: ['Windows', 'Automation', 'DevOps']
    },
    {
      id: 'bash',
      name: 'Bash',
      icon: '🖥️',
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-500/30',
      videoUrl: 'https://www.youtube.com/embed/I4EWvMFj37g',
      description: 'Bash is a Unix shell and command language for Linux and macOS scripting.',
      tags: ['Shell', 'Linux', 'Scripting']
    },
    {
      id: 'groovy',
      name: 'Groovy',
      icon: '🔄',
      color: 'from-blue-500 to-sky-500',
      borderColor: 'border-blue-500/30',
      videoUrl: 'https://www.youtube.com/embed/gxRVhqW-NY8',
      description: 'Groovy is an object-oriented programming language for the Java platform.',
      tags: ['JVM', 'Scripting', 'Automation']
    },
    {
      id: 'fsharp',
      name: 'F#',
      icon: '🔱',
      color: 'from-blue-600 to-indigo-700',
      borderColor: 'border-blue-600/30',
      videoUrl: 'https://www.youtube.com/embed/bJqHBgsJ-B0',
      description: 'F# is a functional-first programming language that runs on .NET.',
      tags: ['Functional', '.NET', 'Data Science']
    },
    {
      id: 'erlang',
      name: 'Erlang',
      icon: '📞',
      color: 'from-red-500 to-orange-500',
      borderColor: 'border-red-500/30',
      videoUrl: 'https://www.youtube.com/embed/L35Yvhg5e9s',
      description: 'Erlang is a functional language designed for building scalable real-time systems.',
      tags: ['Telecom', 'Concurrency', 'Fault Tolerant']
    },
    {
      id: 'lisp',
      name: 'Lisp',
      icon: '👁️',
      color: 'from-orange-500 to-amber-500',
      borderColor: 'border-orange-500/30',
      videoUrl: 'https://www.youtube.com/embed/ZgWbxdvRCPc',
      description: 'Lisp is one of the oldest high-level programming languages with a unique syntax.',
      tags: ['AI', 'Functional', 'Academic']
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4 border border-indigo-500/20">
            <FiPlay className="w-4 h-4" /> Video Tutorials
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight">
            Learn Any{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Language
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-4">
            Watch comprehensive video tutorials for 50+ programming languages and start coding today.
          </p>
        </div>

        {selectedVideo ? (
          <div className="mb-8 lg:mb-12">
            <button
              onClick={() => setSelectedVideo(null)}
              className="mb-4 lg:mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
            >
              <FiChevronRight className="w-5 h-5 rotate-180" />
              <span>Back to all languages</span>
            </button>
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2">
                <div className="bg-[#0a0a14] rounded-xl lg:rounded-2xl border border-white/10 overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={selectedVideo.videoUrl}
                      title={`${selectedVideo.name} Tutorial`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-4 lg:p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl lg:text-3xl">{selectedVideo.icon}</span>
                      <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-white">{selectedVideo.name} Tutorial</h2>
                        <p className="text-gray-400 text-sm">Complete tutorial on CompileHub</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4 text-sm lg:text-base">{selectedVideo.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedVideo.tags.map((tag, index) => (
                        <span key={index} className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${selectedVideo.color} bg-opacity-20 text-white border border-white/10`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg">Start Coding Now</h3>
                <Link
                  to="/compileCode"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25"
                >
                  <FiCode className="w-5 h-5" />
                  Open Compiler
                </Link>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-white font-medium mb-2">What you'll learn</h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      Basic syntax & data types
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      Control flow & loops
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      Functions & modules
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      Real-world examples
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 lg:mb-12">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedVideo(lang)}
                  className={`group relative p-4 sm:p-6 rounded-xl lg:rounded-2xl bg-white/[0.02] border ${lang.borderColor} hover:bg-white/[0.05] transition-all duration-300 text-left overflow-hidden`}
                >
                  <div className={`absolute top-0 right-0 w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br ${lang.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                  <div className="relative">
                    <span className="text-3xl sm:text-4xl mb-3 sm:mb-4 block">{lang.icon}</span>
                    <h3 className="text-white font-semibold text-base sm:text-lg mb-2">{lang.name}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{lang.description}</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                      {lang.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 sm:py-1 rounded-full bg-white/5 text-gray-400 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium bg-gradient-to-r ${lang.color} bg-clip-text text-transparent`}>
                      <FiPlay className="w-3 h-3 sm:w-4 sm:h-4" />
                      Watch Tutorial
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
              <div className="relative p-6 sm:p-10 lg:p-16 text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                  Ready to Start Coding?
                </h2>
                <p className="text-white/80 text-sm sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto">
                  Practice what you learn with our instant online compiler. No setup required.
                </p>
                <Link
                  to="/compileCode"
                  className="group inline-flex items-center justify-center gap-2 px-6 sm:px-10 py-3 sm:py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg text-sm sm:text-lg"
                >
                  Start Coding Free
                  <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WatchDemo;
