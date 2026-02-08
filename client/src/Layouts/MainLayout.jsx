import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 animate-fadeIn">
        <Outlet />
      </main>

      <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white pt-20 pb-10 w-full mt-auto overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">CompileHub</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The fastest way to run and preview code online. Built for developers, by developers.
              </p>
              <div className="flex space-x-3">
                <Link to="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-green-500 flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <FaFacebookF size={18} />
                </Link>
                <Link to="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-green-500 flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <FaTwitter size={18} />
                </Link>
                <Link to="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-green-500 flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <FaInstagram size={18} />
                </Link>
                <Link to="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-green-500 flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <FaLinkedinIn size={18} />
                </Link>
                <Link to="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-green-500 flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <FaGithub size={18} />
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-green-400">Quick Links</h4>
              <div className="space-y-3 text-sm">
                <Link to="/" className="block text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 transform duration-300">→ Home</Link>
                <Link to="/compileCode" className="block text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 transform duration-300">→ Compiler</Link>
                <Link to="/watchDemo" className="block text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 transform duration-300">→ Demo</Link>
                <Link to="/history" className="block text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 transform duration-300">→ History</Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-green-400">Resources</h4>
              <div className="space-y-3 text-sm">
                <Link to="#" className="block text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 transform duration-300">→ Documentation</Link>
                <Link to="#" className="block text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 transform duration-300">→ API Reference</Link>
                <Link to="#" className="block text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 transform duration-300">→ Tutorials</Link>
                <Link to="#" className="block text-gray-400 hover:text-green-400 transition-colors hover:translate-x-1 transform duration-300">→ Support</Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-green-400">Contact</h4>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <FiMail className="text-green-400" />
                  <span>kumarkrishna9801552@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-green-400" />
                  <span>+91 9334554413</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-green-400" />
                  <span>India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; 2026 <span className="font-bold text-green-400">CompileHub</span>. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="#" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-green-400 transition-colors">Terms of Service</Link>
              <Link to="#" className="hover:text-green-400 transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
