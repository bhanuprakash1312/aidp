import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

/* Labels */
const RISK_TEXT = {
  dropout: "Needs Immediate Attention",
  enrolled: "On Track (Needs Monitoring)",
  graduate: "Doing Well",
};

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
  const [loading, setLoading] = useState(false);

  /* ✅ Pagination state */
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  /* ✅ Optimized fetch */
  const fetchRisks = async () => {
    const res = await api.get("/risk/risk", {
      params: { page, limit },
    });

    setRisks(res.data?.data || []);
    setTotal(res.data?.total || 0);
  };

  useEffect(() => {
    fetchRisks();
  }, [page]);

  const statusBadge = (riskLevel) => {
    const key = riskLevel?.toLowerCase()?.trim() || "enrolled";

    return (
      <span className={`flex items-center gap-2 ${RISK_STYLE[key]}`}>
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

          {/* ✅ Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>

              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  First
                </button>

                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(totalPages)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
