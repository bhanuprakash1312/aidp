import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

/* Labels */
const RISK_LABELS = {
  dropout: "Needs Immediate Attention",
  enrolled: "On Track (Monitor)",
  graduate: "Doing Well",
};

/* Badge styles */
const RISK_BADGE_CLASSES = {
  dropout: "bg-red-100 text-red-700",
  enrolled: "bg-yellow-100 text-yellow-700",
  graduate: "bg-green-100 text-green-700",
};

export default function StudentsPage() {
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Pagination state */
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);
  const PAGE_WINDOW = 10;

  const isSuperAdmin = user?.role === "super_admin";

  /* Filters */
  const [filters, setFilters] = useState({
    class: "",
    status: "",
    grade: "",
    minAttendance: "",
    feeDue: "",
  });

  /* Fetch students (backend pagination) */
  const fetchStudents = async () => {
    try {
      const res = await api.get("/students/", {
        params: { page, limit },
      });

      setStudents(res.data?.data || []);
      setFilteredStudents(res.data?.data || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.error("Failed to fetch students", err);
      setStudents([]);
      setFilteredStudents([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  /* Apply filters (client-side) */
  useEffect(() => {
    let data = [...students];

    if (filters.class) {
      data = data.filter((s) => s.class_name === filters.class);
    }

    if (filters.status) {
      data = data.filter((s) =>
        s.risk_level?.toLowerCase().includes(filters.status)
      );
    }

    if (filters.grade) {
      data = data.filter(
        (s) =>
          s.grade?.toLowerCase().trim() ===
          filters.grade.toLowerCase().trim()
      );
    }

    if (filters.minAttendance) {
      data = data.filter(
        (s) => Number(s.attendance) >= Number(filters.minAttendance)
      );
    }

    if (filters.feeDue === "yes") {
      data = data.filter((s) => Number(s.fee_due) > 0);
    }

    if (filters.feeDue === "no") {
      data = data.filter((s) => Number(s.fee_due) === 0);
    }

    setFilteredStudents(data);
    setPage(1); // reset to first page after filter
  }, [filters, students]);

  /* Pagination window logic */
  const currentWindow = Math.floor((page - 1) / PAGE_WINDOW);
  const startPage = currentWindow * PAGE_WINDOW + 1;
  const endPage = Math.min(startPage + PAGE_WINDOW - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const classOptions = [...new Set(students.map((s) => s.class_name))];

  return (
    <div className="h-screen bg-slate-100 flex flex-col">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-6 overflow-y-auto bg-slate-50">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            Students List
          </h2>

          {/* Filters */}
          {isSuperAdmin && (
            <div className="bg-white shadow rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <select
                className="border rounded px-3 py-2"
                value={filters.class}
                onChange={(e) =>
                  setFilters({ ...filters, class: e.target.value })
                }
              >
                <option value="">All Classes</option>
                {classOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                className="border rounded px-3 py-2"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="dropout">At Risk</option>
                <option value="enrolled">On Track</option>
                <option value="graduate">Doing Well</option>
              </select>

              <input
                type="text"
                placeholder="Grade (A/B/C)"
                className="border rounded px-3 py-2"
                value={filters.grade}
                onChange={(e) =>
                  setFilters({ ...filters, grade: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Min Attendance %"
                className="border rounded px-3 py-2"
                value={filters.minAttendance}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minAttendance: e.target.value,
                  })
                }
              />

              <select
                className="border rounded px-3 py-2"
                value={filters.feeDue}
                onChange={(e) =>
                  setFilters({ ...filters, feeDue: e.target.value })
                }
              >
                <option value="">Fee Due?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-xl">
            <table className="w-full text-sm text-left">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Attendance</th>
                  <th className="px-6 py-3">Grade</th>
                  <th className="px-6 py-3">Fee Due</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => {
                    const riskKey = s.risk_level?.toLowerCase() || "enrolled";

                    return (
                      <tr key={s.id} className="border-b hover:bg-blue-50">
                        <td className="px-6 py-3">{s.name}</td>
                        <td className="px-6 py-3">{s.class_name}</td>
                        <td className="px-6 py-3">{s.attendance}%</td>
                        <td className="px-6 py-3">{s.grade}</td>
                        <td className="px-6 py-3">₹{s.fee_due}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              RISK_BADGE_CLASSES[riskKey] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {RISK_LABELS[riskKey] || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-500"
                    >
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination (10 pages + arrows) */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  disabled={startPage === 1}
                  onClick={() => setPage(startPage - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  ←
                </button>

                {pageNumbers.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded border text-sm transition ${
                      page === p
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={endPage === totalPages}
                  onClick={() => setPage(endPage + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
