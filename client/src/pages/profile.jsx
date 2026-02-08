import { useState, useRef, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { FiLogOut, FiClock } from "react-icons/fi";
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
            className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-xl shadow-2xl rounded-xl border border-gray-700/50 p-2 z-50"
          >
            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all"
              onClick={() => setOpen(false)}
            >
              <CgProfile size={18} /> Profile
            </Link>

            <Link
              to="/history"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all"
              onClick={() => setOpen(false)}
            >
              <FiClock size={18} /> History
            </Link>

            <hr className="my-2 border-gray-700" />

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
            >
              <FiLogOut size={18} /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
