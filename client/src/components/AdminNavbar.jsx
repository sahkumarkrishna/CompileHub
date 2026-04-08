import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiShield, FiMenu } from "react-icons/fi";

const AdminNavbar = ({ onMenuClick }) => {
  const [adminName, setAdminName] = useState("Admin");
  const [adminPhoto, setAdminPhoto] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Admin";
    const photo = localStorage.getItem("userProfilePhoto") || "";
    setAdminName(name);
    setAdminPhoto(photo);

    const handleUpdate = () => {
      setAdminName(localStorage.getItem("userName") || "Admin");
      setAdminPhoto(localStorage.getItem("userProfilePhoto") || "");
    };

    window.addEventListener("profileUpdated", handleUpdate);
    return () => window.removeEventListener("profileUpdated", handleUpdate);
  }, []);

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : "A";

  return (
    <nav className="sticky top-0 z-30 bg-[#0a0a14]/90 backdrop-blur-xl border-b border-white/5">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <FiShield className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-white">Admin Panel</span>
            </Link>
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <FiMenu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {adminPhoto ? (
              <img 
                src={adminPhoto} 
                alt={adminName}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center border-2 border-emerald-500/30">
                <span className="text-white text-sm font-bold">
                  {getInitials(adminName)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
