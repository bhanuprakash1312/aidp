import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

/* 🔹 Parent-friendly labels */
const RISK_LABELS = {
  dropout: "Needs Immediate Attention",
  enrolled: "On Track (Monitor)",
  graduate: "Doing Well",
};

/* 🔹 Tailwind color styles */
const RISK_BADGE_CLASSES = {
  dropout: "bg-red-100 text-red-700",
  enrolled: "bg-yellow-100 text-yellow-700",
  graduate: "bg-green-100 text-green-700",
};

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    api
      .get("/students/")
      .then((res) => {
        setStudents(res.data);
      })
      .catch(() => setStudents([]));
  }, []);

  return (
    <div className="flex">
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 bg-slate-50 min-h-screen">
        <Navbar toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-blue-700">
            Students List
          </h2>

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
                {students.map((s) => {
                  // 🔥 IMPORTANT FIX
                  const riskKey = s.risk_level
                    ?.toLowerCase()
                    .trim();

                  return (
                    <tr
                      key={s.id}
                      className="border-b hover:bg-blue-50 transition"
                    >
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
                })}

                {students.length === 0 && (
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

        </div>
      </div>
    </div>
  );
}
