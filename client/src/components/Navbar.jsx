import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProfileIcon from "../pages/profile";
import { FiCode } from "react-icons/fi";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    <nav className="bg-gray-900/95 backdrop-blur-xl shadow-2xl sticky top-0 z-50 border-b border-emerald-500/20 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-emerald-500/50 group-hover:scale-110 transition-all duration-300">
              <FiCode className="text-white" size={32} />
            </div>
            <span className="text-2xl font-black gradient-text hidden sm:block">
              CompileHub
            </span>
          </Link>

          <div className="flex items-center gap-3 md:gap-8">
            {isLoggedIn ? (
              <>
                <Link to="/" className="hidden md:block text-gray-300 hover:text-emerald-400 font-semibold transition-all hover:scale-105">Home</Link>
                <Link to="/compileCode" className="hidden md:block text-gray-300 hover:text-emerald-400 font-semibold transition-all hover:scale-105">Compiler</Link>
                <Link to="/watchDemo" className="hidden md:block text-gray-300 hover:text-emerald-400 font-semibold transition-all hover:scale-105">Demo</Link>
                <ProfileIcon />
              </>
            ) : (
              <Link to="/login" className="btn-primary px-4 md:px-6 py-2 text-sm md:text-base">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
