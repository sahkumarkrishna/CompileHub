import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FiShield, FiHome, FiUsers, FiCode, FiPlay, FiAlertTriangle, 
  FiUser, FiLogOut, FiChevronRight, FiGrid, FiPlus, FiMail, FiSend
} from "react-icons/fi";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Admin";
    const email = localStorage.getItem("userEmail") || "";
    setAdminName(name);
    setAdminEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { 
      icon: <FiHome className="w-5 h-5" />, 
      label: "Dashboard", 
      path: "/admin/dashboard", 
      color: "#10B981",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30"
    },
    { 
      icon: <FiUsers className="w-5 h-5" />, 
      label: "Users", 
      path: "/admin/users", 
      color: "#3B82F6",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30"
    },
    { 
      icon: <FiGrid className="w-5 h-5" />, 
      label: "Problem Dashboard", 
      path: "/admin/problem-dashboard", 
      color: "#F59E0B",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30"
    },
    { 
      icon: <FiPlus className="w-5 h-5" />, 
      label: "Create Problem", 
      path: "/admin/create-problem", 
      color: "#10B981",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30"
    },
    { 
      icon: <FiCode className="w-5 h-5" />, 
      label: "All Codes", 
      path: "/admin/codes", 
      color: "#8B5CF6",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30"
    },
    { 
      icon: <FiPlay className="w-5 h-5" />, 
      label: "All Runs", 
      path: "/admin/runs", 
      color: "#EC4899",
      bg: "bg-pink-500/10",
      border: "border-pink-500/30"
    },
    { 
      icon: <FiAlertTriangle className="w-5 h-5" />, 
      label: "Error Codes", 
      path: "/admin/errors", 
      color: "#EF4444",
      bg: "bg-red-500/10",
      border: "border-red-500/30"
    },
    { 
      icon: <FiSend className="w-5 h-5" />, 
      label: "Submissions", 
      path: "/admin/submissions", 
      color: "#10B981",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30"
    },
    { 
      icon: <FiMail className="w-5 h-5" />, 
      label: "Contacts", 
      path: "/admin/contacts", 
      color: "#8B5CF6",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30"
    },
    { 
      icon: <FiUser className="w-5 h-5" />, 
      label: "Profile", 
      path: "/admin/profile", 
      color: "#06B6D4",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30"
    },
  ];

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : "A";

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-xl z-40 transition-all duration-300 lg:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      
      <aside className={`
        fixed top-0 left-0 h-full w-64 sm:w-72 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f18] border-r border-white/5 z-50 flex flex-col
        transition-all duration-300 ease-out shadow-2xl shadow-black/50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 sm:p-6 border-b border-white/5 bg-gradient-to-r from-emerald-500/5 to-transparent">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all">
                <FiShield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0f]"></div>
            </div>
            <div className="min-w-0">
              <span className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Admin Panel</span>
              <p className="text-[10px] sm:text-xs text-gray-500">CompileHub Management</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4 sm:py-6 px-2 sm:px-4">
          <div className="mb-2 sm:mb-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-2 sm:px-4">Navigation</span>
          </div>
          <nav className="space-y-0.5 sm:space-y-1">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    group relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? `${item.bg} ${item.border} border` 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {isActive && (
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 sm:h-8 ${item.bg.replace('/10', '')} rounded-r-full`} />
                  )}
                  <span className={isActive ? '' : 'group-hover:scale-110 transition-transform'}>
                    {React.cloneElement(item.icon, { style: { color: isActive ? item.color : undefined } })}
                  </span>
                  <span className={`text-xs sm:text-sm font-medium flex-1 ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                  {isActive && (
                    <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${item.bg} ${item.border} border`} style={{ color: item.color }}>
                      Active
                    </span>
                  )}
                  {!isActive && (
                    <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-2 sm:p-4 border-t border-white/5 bg-gradient-to-t from-black/20 to-transparent">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
          >
            <div className="p-1.5 sm:p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
              <FiLogOut className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium">Logout</span>
          </button>
          
          <Link 
            to="/admin/profile"
            className="mt-2 block px-3 sm:px-4 py-3 sm:py-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-lg sm:text-xl font-bold text-white">{getInitials(adminName)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-bold text-white truncate">{adminName}</p>
                <p className="text-[10px] sm:text-xs text-gray-400 truncate">{adminEmail || "Admin"}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-[9px] sm:text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Super Admin</span>
                </div>
              </div>
              <FiChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
