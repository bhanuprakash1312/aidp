import { Home, Users, AlertTriangle, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, closeSidebar }) {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-100 text-blue-700 font-semibold"
      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700";

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-blue-50 to-blue-100
        border-r border-blue-200 text-gray-800 shadow
        transform transition-transform duration-300 ease-in-out
        fixed md:relative top-0 left-0
        h-screen md:h-full w-64 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        flex flex-col`}
      >
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center px-4 py-3 border-b border-blue-200 bg-blue-100">
          <h2 className="text-lg font-bold text-blue-800">Menu</h2>
          <button onClick={closeSidebar}>
            <X className="w-6 h-6 text-blue-800" />
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
