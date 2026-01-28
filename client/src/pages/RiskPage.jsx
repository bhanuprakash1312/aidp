import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

/* Parent-friendly labels */
const RISK_TEXT = {
  dropout: "Needs Immediate Attention",
  enrolled: "On Track (Needs Monitoring)",
  graduate: "Doing Well",
};

/* Tailwind styles */
const RISK_STYLE = {
  dropout: "text-red-700",
  enrolled: "text-yellow-700",
  graduate: "text-green-700",
};

const RISK_DOT = {
  dropout: "bg-red-500",
  enrolled: "bg-yellow-400",
  graduate: "bg-green-500",
};

export default function RiskPage() {
  const [risks, setRisks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Call both APIs at once
    api.get(`/risk/risk?page=${page}&limit=${limit}`)
      .then((res) => {
        setRisks(res.data.data);
        setTotal(res.data.total);
      })
      .catch(() => setRisks([]));
  }, [page]); // Still only runs once after the website is opened
  const totalPages = Math.ceil(total / limit);

  const handleEvaluate = async () => {
    try {
      setEvaluating(true);
      await api.post("/risk/evaluate");   // 👈 backend POST
      const res = await api.get("/risk/risk"); // 👈 reuse existing logic
      setRisks(res.data);
    } catch (err) {
      console.error("Risk evaluation failed", err);
    } finally {
      setEvaluating(false);
    }
  };


  const statusBadge = (riskLevel) => {
    const key = riskLevel?.toLowerCase()?.trim() || "enrolled";

    return (
      <span
        className={`flex items-center justify-center gap-2 font-medium ${RISK_STYLE[key]}`}
      >
        <span className={`w-3 h-3 rounded-full ${RISK_DOT[key]}`} />
        {RISK_TEXT[key]}
      </span>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-blue-700">
              Risk Flags
            </h2>

            <button
              onClick={handleEvaluate}
              disabled={evaluating}
              className={`
      px-4 py-2 rounded-md text-white text-sm font-medium
      transition
      ${evaluating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"}
    `}
            >
              {evaluating ? "Evaluating..." : "Evaluate Risk"}
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            Risk Flags
          </h2>

          {/* Legend */}
          <div className="flex items-center gap-6 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span>Needs Immediate Attention</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span>On Track (Needs Monitoring)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span>Doing Well</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">Student ID</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Class</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>

              <tbody>
                {risks.map((r) => (
                  <tr
                    key={`${r.id}-${r.student_id}`}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{r.student_id}</td>
                    <td className="p-3">{r.name}</td>
                    <td className="p-3">{r.class_name}</td>
                    <td className="p-3 text-center">
                      {statusBadge(r.risk_level)}
                    </td>
                    <td className="p-3">{r.notes || "-"}</td>
                  </tr>
                ))}

                {risks.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-6 text-center text-gray-500"
                    >
                      No risk data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
