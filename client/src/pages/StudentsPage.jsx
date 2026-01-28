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
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  /* 🔐 TEMP: replace with auth role */
  const isSuperAdmin = user?.role === "super_admin";

  /* Filters */
  const [filters, setFilters] = useState({
    class: "",
    status: "",
    grade: "",
    minAttendance: "",
    feeDue: "",
  });

  useEffect(() => {
    api
      .get("/students/")
      .then((res) => {
        setStudents(res.data);
        setFilteredStudents(res.data);
      })
      .catch(() => {
        setStudents([]);
        setFilteredStudents([]);
      });
  }, []);

  /* Apply filters */
useEffect(() => {
  let data = [...students];

  if (filters.class) {
    data = data.filter(
      (s) => s.class_name === filters.class
    );
  }

  if (filters.status) {
    data = data.filter(
      (s) =>
        s.risk_level
          ?.toLowerCase()
          .trim()
          .includes(filters.status)
    );
  }

  if (filters.grade) {
    data = data.filter(
      (s) =>
        s.grade
          ?.toLowerCase()
          .trim() ===
        filters.grade.toLowerCase().trim()
    );
  }

  if (filters.minAttendance) {
    data = data.filter(
      (s) =>
        parseFloat(s.attendance) >=
        parseFloat(filters.minAttendance)
    );
  }

  if (filters.feeDue === "yes") {
    data = data.filter(
      (s) => Number(s.fee_due) > 0
    );
  }

  if (filters.feeDue === "no") {
    data = data.filter(
      (s) => Number(s.fee_due) === 0
    );
  }

  setFilteredStudents(data);
}, [filters, students]);

  /* Unique class list */
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

          {/* 🔥 Super Admin Filters */}
          {isSuperAdmin && (
            <div className="bg-white shadow rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Class */}
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

              {/* Status */}
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

              {/* Grade */}
              <input
                type="text"
                placeholder="Grade (A/B/C)"
                className="border rounded px-3 py-2"
                value={filters.grade}
                onChange={(e) =>
                  setFilters({ ...filters, grade: e.target.value })
                }
              />

              {/* Attendance */}
              <input
                type="number"
                placeholder="Min Attendance %"
                className="border rounded px-3 py-2"
                value={filters.minAttendance}
                onChange={(e) =>
                  setFilters({ ...filters, minAttendance: e.target.value })
                }
              />

              {/* Fee Due */}
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
                {filteredStudents.map((s) => {
                  const riskKey = s.risk_level?.toLowerCase()?.trim();

                  return (
                    <tr key={s.id} className="border-b hover:bg-blue-50">
                      <td className="px-6 py-3">{s.name}</td>
                      <td className="px-6 py-3">{s.class_name}</td>
                      <td className="px-6 py-3">{s.attendance}%</td>
                      <td className="px-6 py-3">{s.grade}</td>
                      <td className="px-6 py-3">₹{s.fee_due}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${RISK_BADGE_CLASSES[riskKey] ||
                            "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {RISK_LABELS[riskKey] || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-500"
                    >
                      No students match the filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
