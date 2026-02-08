import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProfileIcon from "../pages/profile";
import { FiCode, FiMenu, FiX } from "react-icons/fi";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, [location]);

  useEffect(() => {
    const handleStorageChange = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <nav className="bg-gray-900/95 backdrop-blur-xl shadow-2xl sticky top-0 z-50 border-b border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-emerald-500/50 group-hover:scale-110 transition-all duration-300">
              <FiCode className="text-white" size={32} />
            </div>
            <span className="text-2xl font-black gradient-text">
              CompileHub
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-300 hover:text-emerald-400 font-semibold transition-all hover:scale-105">Home</Link>
            <Link to="/compileCode" className="text-gray-300 hover:text-emerald-400 font-semibold transition-all hover:scale-105">Compiler</Link>
            <Link to="/watchDemo" className="text-gray-300 hover:text-emerald-400 font-semibold transition-all hover:scale-105">Demo</Link>
            {isLoggedIn ? (
              <ProfileIcon />
            ) : (
              <Link to="/login" className="btn-primary px-6 py-2">
                Login
              </Link>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-300 hover:text-emerald-400">
            {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 animate-fadeIn">
            <Link to="/" className="block text-gray-300 hover:text-emerald-400 font-semibold py-2">Home</Link>
            <Link to="/compileCode" className="block text-gray-300 hover:text-emerald-400 font-semibold py-2">Compiler</Link>
            <Link to="/watchDemo" className="block text-gray-300 hover:text-emerald-400 font-semibold py-2">Demo</Link>
            {!isLoggedIn && (
              <Link to="/login" className="block btn-primary text-center">Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
