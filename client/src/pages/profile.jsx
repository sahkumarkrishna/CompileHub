import { useState, useRef, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { FiLogOut, FiLayout, FiSettings, FiChevronRight, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function ProfileIcon() {
  const [open, setOpen] = useState(false);
  const [, setRefresh] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleProfileUpdate = () => {
      setRefresh(n => n + 1);
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    
    const interval = setInterval(() => {
      setRefresh(n => n + 1);
    }, 2000);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setOpen(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "user@example.com";
  const photo = localStorage.getItem("userProfilePhoto");

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const renderProfilePhoto = () => {
    if (photo && photo !== '') {
      if (photo.includes('data:') || photo.startsWith('http') || photo.startsWith('/')) {
        return (
          <img 
            src={photo} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        );
      } else if (photo.length <= 2) {
        return <span className="text-lg font-bold">{photo}</span>;
      }
    }
    return <CgProfile className="text-gray-300" size={28} />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 transition-all duration-200"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center overflow-hidden">
          {photo && photo !== '' && !photo.includes('data:') && photo.length <= 2 ? (
            <span className="text-white font-bold text-sm">{photo}</span>
          ) : photo && (photo.includes('data:') || photo.startsWith('http') || photo.startsWith('/')) ? (
            <img src={photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-bold text-sm">{getInitials(userName)}</span>
          )}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-64 origin-top-right"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-[#0a0a14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-2">
                  <button
                    onClick={() => { navigate("/dashboard"); setOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                      <FiLayout className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">Dashboard</p>
                    </div>
                    <FiChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                  </button>
                </div>

                <div className="p-2 border-t border-white/5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                      <FiLogOut className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">Logout</p>
                      <p className="text-xs text-red-400/60">Sign out of account</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
