import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiCode, FiMail, FiMenu, FiUser, FiGrid, FiLogOut, FiX } from "react-icons/fi";

const UserNavbar = ({ onMenuClick }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userPhoto, setUserPhoto] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
    window.addEventListener("logout", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("profileUpdated", checkAuth);
      window.removeEventListener("logout", checkAuth);
    };
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
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
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userProfilePhoto");
    window.dispatchEvent(new Event("profileUpdated"));
    window.location.href = "/";
  };

  const navLinks = [
    { path: "/", label: "Home", icon: FiCode },
    { path: "/coding", label: "Coding", icon: FiCode },
    { path: "/contact", label: "Contact", icon: FiMail },
    ...(isLoggedIn ? [{ path: "/dashboard", label: "Dashboard", icon: FiGrid }] : []),
  ];

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-[#0a0a0f]/98 backdrop-blur-2xl border-b border-white/10 shadow-2xl" 
          : "bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg group-hover:shadow-emerald-500/25 transition-all">
                <FiCode className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Compile<span className="text-emerald-400">Hub</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/5"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth / Profile */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <Link 
                    to="/settings" 
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
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
              ) : (
                <div className="flex items-center gap-2">
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-all"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="px-4 py-4 space-y-1 border-t border-white/10 bg-[#0a0a0f]/98 backdrop-blur-xl">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive(link.path)
                    ? "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/settings"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                      isActive("/settings")
                        ? "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <FiUser className="w-5 h-5" />
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <FiLogOut className="w-5 h-5" />
                    Logout
                  </button>
                  <div className="flex items-center gap-3 px-4 py-3">
                    {userPhoto ? (
                      <img 
                        src={userPhoto} 
                        alt={userName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center border-2 border-emerald-500/30">
                        <span className="text-white text-sm font-bold">
                          {getInitials(userName)}
                        </span>
                      </div>
                    )}
                    <span className="text-white font-medium">{userName}</span>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center w-full px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all border border-white/10"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center w-full px-4 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default UserNavbar;
