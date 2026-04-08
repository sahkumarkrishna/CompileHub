import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiCode, FiMenu, FiLogOut, FiX } from "react-icons/fi";

const DashboardNavbar = ({ onMenuClick }) => {
  const [userName, setUserName] = useState("User");
  const [userPhoto, setUserPhoto] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const name = localStorage.getItem("userName") || "User";
      const photo = localStorage.getItem("userProfilePhoto") || "";
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : "U";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userProfilePhoto");
    window.dispatchEvent(new Event("profileUpdated"));
    window.location.href = "/";
  };

  return (
    <nav className={`sticky top-0 z-30 transition-all duration-300 ${
      isScrolled 
        ? "bg-[#0a0a0f]/98 backdrop-blur-2xl border-b border-white/10 shadow-2xl" 
        : "bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              aria-label="Toggle sidebar"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg group-hover:shadow-emerald-500/25 transition-all">
                <FiCode className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Compile<span className="text-emerald-400">Hub</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <Link to="/settings" className="flex items-center">
              {userPhoto ? (
                <img 
                  src={userPhoto} 
                  alt={userName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/30 hover:border-emerald-500/50 transition-all"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center border-2 border-emerald-500/30 hover:border-emerald-500/50 transition-all">
                  <span className="text-white text-sm font-bold">
                    {getInitials(userName)}
                  </span>
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
