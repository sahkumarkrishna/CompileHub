import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FiCode, FiClock, FiUser, FiLogOut, FiPlay, FiAlertTriangle, FiHelpCircle, 
  FiFileText, FiBarChart, FiGrid, FiList, FiHome, FiTrendingUp, FiCheckCircle,
  FiX, FiMenu
} from "react-icons/fi";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  
  useEffect(() => {
    setActiveItem(location.pathname);
    const name = localStorage.getItem("userName") || "User";
    const photo = localStorage.getItem("userProfilePhoto") || "";
    setUserName(name);
    setUserPhoto(photo);
  }, [location.pathname]);

  const menuItems = [
    { icon: <FiHome className="w-5 h-5" />, label: "Home", path: "/", color: "#10B981" },
    { icon: <FiGrid className="w-5 h-5" />, label: "Dashboard", path: "/dashboard", color: "#10B981" },
    { icon: <FiCode className="w-5 h-5" />, label: "Submissions", path: "/submissions", color: "#F59E0B" },
  ];

  const statsItems = [
    { icon: <FiFileText className="w-5 h-5" />, label: "Total Codes", path: "/totalCodes", color: "#3B82F6" },
    { icon: <FiPlay className="w-5 h-5" />, label: "Total Runs", path: "/totalRuns", color: "#EC4899" },
    { icon: <FiAlertTriangle className="w-5 h-5" />, label: "Error Codes", path: "/errorCodes", color: "#F59E0B" },
    { icon: <FiClock className="w-5 h-5" />, label: "History", path: "/history", color: "#F59E0B" },
  ];

  const settingsItems = [
    { icon: <FiUser className="w-5 h-5" />, label: "Profile", path: "/settings", color: "#EC4899" },
    { icon: <FiHelpCircle className="w-5 h-5" />, label: "Help", path: "/help", color: "#06B6D4" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : "U";

  const MenuSection = ({ title, items }) => (
    <div className="mb-4">
      <h3 className="px-4 mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
      <div className="space-y-0.5">
        {items.map((item, index) => {
          const isActive = activeItem === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={index}
              to={item.path || "#"}
              onClick={handleLinkClick}
              className={`
                group flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <span style={{ color: isActive ? '#10B981' : item.color }} className="group-hover:text-white">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-xl z-40 transition-all duration-300 lg:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      
      <aside className={`
        fixed top-0 left-0 h-full bg-[#0a0a0f] border-r border-white/5 z-50 flex flex-col
        transition-all duration-300 ease-out
        ${isOpen ? 'translate-x-0 w-64 sm:w-72' : '-translate-x-full w-64 sm:w-72'}
        lg:translate-x-0 lg:w-64 xl:w-72
      `}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
              <FiCode className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">CompileHub</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <MenuSection title="Menu" items={menuItems} />
          <MenuSection title="Statistics" items={statsItems} />
          <MenuSection title="Settings" items={settingsItems} />
        </div>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
