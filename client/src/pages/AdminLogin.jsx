import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiCode, FiShield, FiArrowLeft } from "react-icons/fi";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/auth";
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/dashboard";

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isAdmin && isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const email = e.target["admin-email"].value;
    const password = e.target["admin-password"].value;

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/admin/login`, { email, password });
      const { token, user, isAdmin } = response.data;

      if (token) localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
        localStorage.setItem("userName", user.name || "");
        localStorage.setItem("userEmail", user.email || "");
      }

      toast.success("Admin Login Successful!");
      e.target.reset();
      navigate(from, { replace: true });
    } catch (error) {
      const msg = error.response?.data?.message || "Admin login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 bg-[#030712] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-teal-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, transparent 0%, #030712 70%)`,
        }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
            <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute inset-8 rounded-full border border-teal-500/20 animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
            <div className="absolute inset-16 rounded-full border border-emerald-500/20 animate-pulse" style={{ animationDuration: '5s', animationDelay: '0.5s' }}></div>
          </div>
        </div>

        <div className="relative z-10 w-full flex flex-col justify-between p-8 lg:p-12 xl:p-16">
          <div className="flex items-center gap-3">
            <Link to="/login" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-emerald-500/30">
                <FiCode className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xl font-semibold text-white">CompileHub</span>
            </Link>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Admin Portal
            </h1>
            <p className="text-base xl:text-lg text-gray-400 max-w-md leading-relaxed">
              Access the admin dashboard to manage users, monitor statistics, and control CompileHub settings.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <FiShield className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-sm text-gray-400">Secure Admin Access</span>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            © CompileHub · Privacy · Terms
          </div>
        </div>
      </div>

      <div className="lg:hidden bg-[#030712] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-[#030712] to-teal-900/30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex items-center justify-center gap-3 py-6 px-4">
          <Link to="/login" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-emerald-500/30">
              <FiCode className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-lg font-semibold text-white">CompileHub</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-950">
        <div className="w-full max-w-sm sm:max-w-md">
          <Link 
            to="/login"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to User Login
          </Link>
          
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <FiShield className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Admin Login
            </h2>
            <p className="text-sm sm:text-base text-gray-400">
              Enter your admin credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-300">Email</label>
              <input
                id="admin-email"
                name="admin-email"
                type="email"
                placeholder="Admin email"
                className="w-full px-4 py-3 sm:py-3.5 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-150 shadow-sm shadow-black/10"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300">Password</label>
              <input
                id="admin-password"
                name="admin-password"
                type="password"
                placeholder="Admin password"
                className="w-full px-4 py-3 sm:py-3.5 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-150 shadow-sm shadow-black/10"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-lg shadow-emerald-500/25 text-sm sm:text-base flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Logging In...
                </span>
              ) : (
                <>
                  <FiShield className="w-4 h-4" />
                  Admin Login
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
