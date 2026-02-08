import { useState, useRef, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { FiLogOut, FiClock, FiHome, FiCode, FiPlay, FiSettings } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function ProfileIcon() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false"); // clear auth
    setOpen(false); // close dropdown
    toast.success("Logged out successfully!");
    navigate("/"); // redirect home
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center p-2 rounded-full bg-gray-800/50 hover:bg-emerald-500/20 border border-gray-700 hover:border-emerald-500/50 transition-all"
      >
        <CgProfile className="text-gray-300 hover:text-emerald-400" size={32} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-52 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl shadow-2xl rounded-xl border border-emerald-500/30 p-2 z-50"
          >
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-blue-600/20 hover:text-blue-300 transition-all group"
              onClick={() => setOpen(false)}
            >
              <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-all">
                <FiHome size={18} className="text-blue-400" />
              </div>
              <span className="font-medium">Home</span>
            </Link>

            <Link
              to="/compileCode"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-purple-600/20 hover:text-purple-300 transition-all group"
              onClick={() => setOpen(false)}
            >
              <div className="p-1.5 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-all">
                <FiCode size={18} className="text-purple-400" />
              </div>
              <span className="font-medium">Compiler</span>
            </Link>

            <Link
              to="/watchDemo"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-pink-600/20 hover:text-pink-300 transition-all group"
              onClick={() => setOpen(false)}
            >
              <div className="p-1.5 bg-pink-500/10 rounded-lg group-hover:bg-pink-500/20 transition-all">
                <FiPlay size={18} className="text-pink-400" />
              </div>
              <span className="font-medium">Demo</span>
            </Link>

            <hr className="my-2 border-gray-700/50" />

            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-emerald-600/20 hover:text-emerald-300 transition-all group"
              onClick={() => setOpen(false)}
            >
              <div className="p-1.5 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-all">
                <FiSettings size={18} className="text-emerald-400" />
              </div>
              <span className="font-medium">Profile</span>
            </Link>

            <Link
              to="/history"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-amber-600/20 hover:text-amber-300 transition-all group"
              onClick={() => setOpen(false)}
            >
              <div className="p-1.5 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-all">
                <FiClock size={18} className="text-amber-400" />
              </div>
              <span className="font-medium">History</span>
            </Link>

            <hr className="my-2 border-gray-700/50" />

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 text-red-400 hover:text-red-300 transition-all group"
            >
              <div className="p-1.5 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-all">
                <FiLogOut size={18} className="text-red-400" />
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
