import { Home, Users, AlertTriangle, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, closeSidebar }) {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-indigo-100 text-indigo-700 font-semibold shadow-sm"
      : "text-slate-600 hover:bg-indigo-50/80 hover:text-indigo-700";

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden transition-all duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-white/70 backdrop-blur-md border-r border-indigo-100 text-slate-800 shadow-xl
        transform transition-transform duration-300 ease-in-out
        fixed md:relative top-0 left-0
        h-screen md:h-full w-64 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        flex flex-col`}
      >
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center px-4 py-3 border-b border-indigo-100 bg-indigo-50/50 backdrop-blur-md">
          <h2 className="text-lg font-bold text-indigo-800">Menu</h2>
          <button onClick={closeSidebar}>
            <X className="w-6 h-6 text-indigo-800" />
          </button>
        </div>

        {/* Menu */}
        <div className="mt-6 space-y-2 flex-1 px-4 overflow-y-auto">
          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive(
              "/dashboard"
            )}`}
          >
            <Home className="w-5 h-5" /> Dashboard
          </Link>

          <Link
            to="/students"
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive(
              "/students"
            )}`}
          >
            <Users className="w-5 h-5" /> Students
          </Link>

          <Link
            to="/risk"
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive(
              "/risk"
            )}`}
          >
            <AlertTriangle className="w-5 h-5" /> Risk Flags
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-blue-500 py-4">
          v1.0 © 2025
        </div>
      </div>
    </>
  );
}
