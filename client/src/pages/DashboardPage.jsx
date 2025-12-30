import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { TrendingUp, Users, AlertTriangle } from "lucide-react";
import RiskDistributionChart from "./RiskDistributionChart";
import { useEffect } from "react";
import api from "../services/api";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // ✅ ADD
  const [summary, setSummary] = useState([]);
  useEffect(() => {
  api.get("/dashboard/summary")
    .then((res) => {
      setSummary(res.data);
    })
    .catch(() => {
      setSummary([]);
    });
}, []);
    console.log(summary)

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-6 overflow-y-auto bg-slate-100">
          {/* HEADER + BUTTON */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-blue-700">
              Dashboard Overview
            </h1>

            {/* ✅ NEW BUTTON */}
            <button
              onClick={() => navigate("/upload-students")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Upload Students
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition">
              <Users className="text-blue-600 w-10 h-10" />
              <div>
                <h2 className="text-gray-600">Total Students</h2>
                <p className="text-2xl font-bold">{summary.total_students}</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition">
              <TrendingUp className="text-green-500 w-10 h-10" />
              <div>
                <h2 className="text-gray-600">Average Attendance</h2>
                <p className="text-2xl font-bold">{summary.average_attendance}</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition">
              <AlertTriangle className="text-red-500 w-10 h-10" />
              <div>
                <h2 className="text-gray-600">At Risk</h2>
                <p className="text-2xl font-bold">{summary.risk_distribution?.find(r => r.risk === "At Risk")?.count || 0}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-2">Overall Summary</h2>
            <RiskDistributionChart data={summary?.risk_distribution} />

          </div>
        </main>
      </div>
    </div>
  );
}
