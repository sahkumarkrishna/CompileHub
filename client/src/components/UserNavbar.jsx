import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiCode, FiMail, FiMenu, FiUser, FiGrid, FiLogOut } from "react-icons/fi";

const UserNavbar = ({ onMenuClick }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userPhoto, setUserPhoto] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const name = localStorage.getItem("userName") || "User";
      const photo = localStorage.getItem("userProfilePhoto") || "";
      setIsLoggedIn(loggedIn);
      setUserName(name);
      setUserPhoto(photo);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("profileUpdated", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("profileUpdated", checkAuth);
    };
  }, [location]);

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : "U";

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/coding") return location.pathname === "/coding";
    if (path === "/contact") return location.pathname === "/contact";
    if (path === "/dashboard") return location.pathname === "/dashboard";
    if (path === "/settings") return location.pathname === "/settings";
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-30 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg">
                <FiCode className="text-white w-5 h-5" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">CompileHub</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/") 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FiCode className="w-4 h-4" />
              Home
            </Link>
            <Link 
              to="/coding" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/coding") 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FiCode className="w-4 h-4" />
              Coding
            </Link>
            <Link 
              to="/contact" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/contact") 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FiMail className="w-4 h-4" />
              Contact
            </Link>
            {isLoggedIn && (
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("/dashboard") 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <FiGrid className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link to="/settings" className="flex items-center gap-2">
                {userPhoto ? (
                  <img 
                    src={userPhoto} 
                    alt={userName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/30"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center border-2 border-emerald-500/30">
                    <span className="text-white text-sm font-bold">
                      {getInitials(userName)}
                    </span>
                  </div>
                )}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-all">
                  Login
                </Link>
                <Link to="/login" className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all">
                  Signup
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              {mobileMenuOpen ? (
                <span className="text-lg">✕</span>
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-1">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive("/") 
                    ? "bg-emerald-500/10 text-emerald-400" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <FiCode className="w-5 h-5" />
                Home
              </Link>
              <Link 
                to="/coding" 
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive("/coding") 
                    ? "bg-emerald-500/10 text-emerald-400" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <FiCode className="w-5 h-5" />
                Coding
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive("/contact") 
                    ? "bg-emerald-500/10 text-emerald-400" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <FiMail className="w-5 h-5" />
                Contact
              </Link>
              {isLoggedIn && (
                <Link 
                  to="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive("/dashboard") 
                      ? "bg-emerald-500/10 text-emerald-400" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <FiGrid className="w-5 h-5" />
                  Dashboard
                </Link>
              )}
              {isLoggedIn && (
                <>
                  <Link 
                    to="/settings" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive("/settings") 
                        ? "bg-emerald-500/10 text-emerald-400" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <FiUser className="w-5 h-5" />
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <FiLogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              )}
              {!isLoggedIn && (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;
