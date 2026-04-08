import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiUser, FiCode, FiShield } from "react-icons/fi";

const AuthForm = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/Practice", { replace: true });
    }
  }, [navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = e.target["signin-email"].value;
    const password = e.target["signin-password"].value;

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/login`, { email, password });
      const { token, user } = response.data;

      if (token) localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", user.name || "");
        localStorage.setItem("userEmail", user.email || "");
        if (user.profilePhoto) {
          localStorage.setItem("userProfilePhoto", user.profilePhoto);
        }
        window.dispatchEvent(new Event("profileUpdated"));
      }

      toast.success("Sign In Successful!");
      e.target.reset();
      navigate("/");
    } catch (error) {
      const msg = error.response?.data?.message || "Sign In failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const name = e.target["signup-name"].value;
    const email = e.target["signup-email"].value;
    const password = e.target["signup-password"].value;

    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE}signup`, { name, email, password });
      toast.success("Account created successfully!");
      e.target.reset();
      setIsSignIn(true);
    } catch (error) {
      const msg = error.response?.data?.message || "Sign Up failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 bg-[#030712] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, transparent 0%, #030712 70%)`,
        }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
            <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute inset-8 rounded-full border border-purple-500/20 animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
            <div className="absolute inset-16 rounded-full border border-cyan-500/20 animate-pulse" style={{ animationDuration: '5s', animationDelay: '0.5s' }}></div>
          </div>
        </div>

        <div className="relative z-10 w-full flex flex-col justify-between p-8 lg:p-12 xl:p-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-500/30">
              <FiCode className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xl font-semibold text-white">CompileHub</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              {isSignIn ? "Welcome back" : "Get Started"}
            </h1>
            <p className="text-base xl:text-lg text-gray-400 max-w-md leading-relaxed">
              {isSignIn
                ? "Sign in to access your powerful online compiler and continue coding instantly."
                : "Create your account and start compiling code in over 50 programming languages."}
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-gray-900"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-gray-900"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-gray-900"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-gray-900"></div>
              </div>
              <span className="text-sm text-gray-400">Join 10,000+ developers</span>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            © CompileHub · Privacy · Terms
          </div>
        </div>
      </div>

      <div className="lg:hidden bg-[#030712] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-[#030712] to-purple-900/30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex items-center justify-center gap-3 py-6 px-4">
          <div className="w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-500/30">
            <FiCode className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-lg font-semibold text-white">CompileHub</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-950">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="mb-6 sm:mb-8">
            <div className="flex gap-2 p-1 bg-gray-900 rounded-xl mb-6">
              <button
                onClick={() => setIsSignIn(true)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isSignIn
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsSignIn(false)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  !isSignIn
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {isSignIn ? "Sign in" : "Create account"}
            </h2>
            <p className="text-sm sm:text-base text-gray-400">
              {isSignIn ? "Welcome back! Please sign in to continue." : "Fill in your details to get started."}
            </p>
          </div>

          {isSignIn ? (
            <form className="space-y-4" onSubmit={handleSignIn}>
              <div className="space-y-2">
                <label htmlFor="signin-email" className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-150 shadow-sm shadow-black/10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="signin-password" className="block text-sm font-medium text-gray-300">Password</label>
                <input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-150 shadow-sm shadow-black/10"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer py-1">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500/50" />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <button
                type="submit"
                className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-lg shadow-blue-500/25 text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Signing In...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
              <Link
                to="/admin/login"
                className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-lg shadow-emerald-500/25 text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <FiShield className="w-4 h-4" />
                Admin Login
              </Link>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleSignUp}>
              <div className="space-y-2">
                <label htmlFor="signup-name" className="block text-sm font-medium text-gray-300">Full Name</label>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-150 shadow-sm shadow-black/10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-150 shadow-sm shadow-black/10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-300">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  className="w-full px-4 py-3 sm:py-3.5 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-150 shadow-sm shadow-black/10"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-lg shadow-blue-500/25 text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Creating Account...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthForm;
