import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { GraduationCap, Menu } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md px-6 py-3 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-wide">
            Dropout Prediction AI
          </h1>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-6">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/students" className="hover:underline">
            Students
          </Link>
          <Link to="/risk" className="hover:underline">
            Risk
          </Link>
        </div>

        {/* Right: Logout + Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded text-sm font-semibold"
          >
            Logout
          </button>

          {/* Mobile menu icon */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 hover:bg-blue-500 rounded"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
