import React, { useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

const AuthForm = () => {
  const [isSignIn, setIsSignIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

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
      const response = await axios.post(`${API_BASE}login`, { email, password });
      const { token, user } = response.data;

      if (token) localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("isLoggedIn", "true");
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
    <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="card max-w-6xl w-full p-0 overflow-hidden animate-fadeIn relative z-10">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          <div className="md:w-2/5 w-full bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white flex flex-col justify-center items-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
            <div className="text-center space-y-6 relative z-10">
              <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 animate-float">
                <FiLock className="w-10 h-10" />
              </div>
              <h2 className="text-5xl font-bold drop-shadow-lg">
                {isSignIn ? "Welcome Back!" : "Join Us Today!"}
              </h2>
              <p className="text-emerald-50 text-base max-w-xs mx-auto leading-relaxed">
                {isSignIn
                  ? "Sign in to access your powerful online compiler and continue coding."
                  : "Create an account and start compiling code in multiple languages instantly!"}
              </p>
              <button
                onClick={() => setIsSignIn(!isSignIn)}
                className="mt-8 border-2 border-white px-10 py-3.5 rounded-full font-bold text-sm tracking-wide hover:bg-white hover:text-emerald-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl backdrop-blur-sm"
              >
                {isSignIn ? "CREATE ACCOUNT" : "SIGN IN"}
              </button>
            </div>
          </div>

          <div className="md:w-3/5 w-full bg-gray-900/50 backdrop-blur-xl text-white flex flex-col justify-center items-center p-12">
            {isSignIn ? (
              <>
                <h2 className="text-5xl font-bold gradient-text mb-3">
                  Sign In
                </h2>
                <p className="text-gray-400 mb-8">Access your compiler account</p>
                <form
                  className="flex flex-col items-center space-y-6 w-full max-w-md"
                  onSubmit={handleSignIn}
                >
                  <div className="relative w-full group">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      id="signin-email"
                      type="email"
                      placeholder="Email Address"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                  <div className="relative w-full group">
                    <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      id="signin-password"
                      type="password"
                      placeholder="Password"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-full py-4 text-base font-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Signing In...
                      </span>
                    ) : "SIGN IN"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-5xl font-bold gradient-text mb-3">
                  Create Account
                </h2>
                <p className="text-gray-400 mb-8">Start your coding journey</p>
                <form
                  className="flex flex-col items-center space-y-6 w-full max-w-md"
                  onSubmit={handleSignUp}
                >
                  <div className="relative w-full group">
                    <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      id="signup-name"
                      type="text"
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                  <div className="relative w-full group">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      id="signup-email"
                      type="email"
                      placeholder="Email Address"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                  <div className="relative w-full group">
                    <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      id="signup-password"
                      type="password"
                      placeholder="Password"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-full py-4 text-base font-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Creating Account...
                      </span>
                    ) : "CREATE ACCOUNT"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
