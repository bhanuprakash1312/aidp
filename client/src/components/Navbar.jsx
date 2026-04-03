import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { GraduationCap, Menu } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm px-6 py-3 sticky top-0 z-50 text-slate-800 transition-all duration-300">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">
            Dropout Prediction AI
          </h1>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-6">
          <Link to="/dashboard" className="text-slate-600 font-medium hover:text-indigo-600 transition-colors duration-300">
            Dashboard
          </Link>
          <Link to="/students" className="text-slate-600 font-medium hover:text-indigo-600 transition-colors duration-300">
            Students
          </Link>
          <Link to="/risk" className="text-slate-600 font-medium hover:text-indigo-600 transition-colors duration-300">
            Risk
          </Link>
        </div>

        {/* Right: Logout + Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={logout}
            className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Logout
          </button>

          {/* Mobile menu icon */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 hover:bg-indigo-50 text-indigo-600 rounded transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
