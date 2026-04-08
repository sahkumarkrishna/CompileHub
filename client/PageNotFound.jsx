import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiHome, FiAlertTriangle, FiArrowLeft, FiCode } from "react-icons/fi";

const PageNotFound = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center relative overflow-hidden cursor-default select-none"
      style={{
        transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
        transition: "transform 0.1s ease-out"
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]"
        />
        <div 
          className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[80px]"
        />
        <div 
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[60px]"
        />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-2 h-2 bg-emerald-500/30 rounded-full animate-ping" />
        <div className="absolute top-[40%] right-[25%] w-1.5 h-1.5 bg-purple-500/30 rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-[30%] left-[30%] w-1 h-1 bg-cyan-500/30 rounded-full animate-ping" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[60%] right-[20%] w-2 h-2 bg-emerald-500/20 rounded-full animate-ping" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-[20%] right-[40%] w-1.5 h-1.5 bg-purple-500/20 rounded-full animate-ping" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
            <div className="relative">
              <span className="text-[100px] sm:text-[140px] md:text-[180px] lg:text-[220px] font-black leading-none block">
                <span className="bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_60px_rgba(16,185,129,0.3)]">
                  404
                </span>
              </span>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-32 md:w-40 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full opacity-50" />
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-500/10 border border-amber-500/20 rounded-full animate-pulse">
            <FiAlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
            <span className="text-amber-400 text-xs sm:text-sm font-medium">Page Not Found</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight px-2">
            Lost in the{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                Code Void
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
            </span>
          </h1>
          
          <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4">
            The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          <Link
            to="/"
            className="group flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95"
          >
            <FiHome className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm sm:text-base">Back to Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="group flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm sm:text-base">Go Back</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center justify-center gap-6 md:gap-8 text-gray-500 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Online</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <span>Error Code: 404</span>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <FiCode className="w-3 h-3" />
            <span>CompileHub</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 sm:hidden text-gray-500 text-xs">
          <span>404</span>
          <span>•</span>
          <span>Error</span>
          <span>•</span>
          <span>Not Found</span>
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
        <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.3)); }
          50% { filter: drop-shadow(0 0 40px rgba(16, 185, 129, 0.5)); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PageNotFound;
