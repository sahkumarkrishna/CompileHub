import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { FiMenu, FiX } from "react-icons/fi";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col">
      <DashboardNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <FiX className="w-6 h-6" />
        </button>
      )}

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col transition-all duration-300 lg:ml-64 xl:ml-72">
        <div className="flex-1">
          {children || <Outlet />}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default DashboardLayout;
