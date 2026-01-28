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

/* Styles */
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

  /* Pagination state */
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  /* Fetch risks (optimized & safe) */
  const fetchRisks = async () => {
    try {
      const res = await api.get("/risk/risk", {
        params: { page, limit },
      });

      setRisks(res.data?.data || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.error("Failed to fetch risks", err);
      setRisks([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchRisks();
  }, [page]);

  /* Generate page numbers */
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const statusBadge = (riskLevel) => {
    const key = riskLevel?.toLowerCase()?.trim() || "enrolled";

    return (
      <span className={`flex items-center justify-center gap-2 ${RISK_STYLE[key]}`}>
        <span className={`w-3 h-3 rounded-full ${RISK_DOT[key]}`} />
        {RISK_TEXT[key]}
      </span>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            Risk Flags
          </h2>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">Student ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Class</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(risks) && risks.length > 0 ? (
                  risks.map((r) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-500">
                      No risk data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Old-style pagination (page numbers) */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2 flex-wrap">
                {getPageNumbers().map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded border text-sm transition
                      ${
                        page === p
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
