import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiCode, FiMenu } from "react-icons/fi";

const DashboardNavbar = ({ onMenuClick }) => {
  const [userName, setUserName] = useState("User");
  const [userPhoto, setUserPhoto] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : "U";

  return (
    <nav className="sticky top-0 z-30 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg">
                <FiCode className="text-white w-5 h-5" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">CompileHub</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;