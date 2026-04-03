import { useState } from "react";
import api from "../services/api";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

/* ✅ Required Excel schema */
const REQUIRED_COLUMNS = [
  "name",
  "class_name",
  "attendance",
  "grade",
  "fee_due",
];

export default function UploadStudent() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(""); // success | error
  const [loading, setLoading] = useState(false);

  const [errorContent, setErrorContent] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  /* 🔍 Validate Excel headers BEFORE upload */
  const validateExcelHeaders = async (file) => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const headers = XLSX.utils
      .sheet_to_json(sheet, { header: 1 })[0]
      .map((h) => h?.toString().trim().toLowerCase());

    const missing = REQUIRED_COLUMNS.filter(
      (col) => !headers.includes(col)
    );

    const extra = headers.filter(
      (col) => !REQUIRED_COLUMNS.includes(col)
    );

    return { missing, extra };
  };

  const handleUpload = async () => {
    setStatus("");
    setErrorContent(null);
    setSuccessMessage("");

    if (!file) {
      setStatus("error");
      setErrorContent({
        title: "No file selected",
        description: "Please select an Excel file to upload.",
      });
      return;
    }

    /* ✅ Frontend schema validation */
    const { missing, extra } = await validateExcelHeaders(file);

    if (missing.length > 0 || extra.length > 0) {
      setStatus("error");
      setErrorContent({
        title: "Invalid Excel format",
        description: (
          <>
            <div>
              <strong>Required columns:</strong>{" "}
              {REQUIRED_COLUMNS.join(", ")}
            </div>

            {missing.length > 0 && (
              <div className="mt-1">
                <strong>Missing columns:</strong>{" "}
                <span className="text-red-700">
                  {missing.join(", ")}
                </span>
              </div>
            )}

            {extra.length > 0 && (
              <div className="mt-1">
                <strong>Extra columns found:</strong>{" "}
                <span className="text-yellow-700">
                  {extra.join(", ")}
                </span>
              </div>
            )}
          </>
        ),
      });
      return; // ⛔ stop upload
    }

    /* ✅ Upload only if valid */
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/students/upload-excel", formData);

      setStatus("success");
      setSuccessMessage(res.data?.detail || "Upload successful");
    } catch (err) {
      setStatus("error");
      setErrorContent({
        title: "Upload failed",
        description:
          err.response?.data?.detail ||
          "Server error while uploading file.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-indigo-100/50 p-8 relative border border-white">

        {/* 🔙 Back to Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-4 left-4 flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-indigo-100 p-3 rounded-full shadow-sm">
              <Upload className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">
            Upload Students
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload an Excel file (.xls or .xlsx)
          </p>
        </div>

        {/* ℹ️ Excel Requirements */}
        <div className="mb-5 rounded-xl bg-indigo-50/50 backdrop-blur border border-indigo-100 p-4 text-sm text-indigo-800 shadow-sm">
          <div className="font-semibold mb-1">
            Excel Requirements
          </div>

          <div className="mb-2">
            Your Excel file must include the following columns:
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {REQUIRED_COLUMNS.map((col) => (
              <span
                key={col}
                className="px-2 py-1 bg-indigo-100/80 text-indigo-700 rounded text-xs font-mono border border-indigo-200/50"
              >
                {col}
              </span>
            ))}
          </div>

          <ul className="list-disc list-inside space-y-1">
            <li>Column names are case-insensitive (Name or name both work)</li>
            <li>Extra or missing columns are not allowed</li>
            <li>Attendance and Fee Due must be numeric</li>
          </ul>
        </div>

        {/* File Input */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 rounded-2xl p-6 cursor-pointer hover:bg-white/50 hover:border-indigo-400 hover:shadow-md transition-all duration-300 group">
          <FileSpreadsheet className="w-10 h-10 text-indigo-300 group-hover:text-indigo-500 mb-2 transition-colors" />
          <span className="text-sm text-gray-600">
            {file ? file.name : "Click to select Excel file"}
          </span>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white shadow-md transition-all duration-300
            ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5"
            }`}
        >
          <Upload className="w-5 h-5" />
          {loading ? "Uploading..." : "Upload File"}
        </button>

        {/* ❌ Error Message */}
        {status === "error" && errorContent && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 shadow-sm text-sm">
            <div className="font-semibold mb-1 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              {errorContent.title}
            </div>
            <div className="ml-7">{errorContent.description}</div>
          </div>
        )}

        {/* ✅ Success Message */}
        {status === "success" && successMessage && (
          <div className="mt-4 flex items-center gap-2 justify-center text-sm font-medium p-3 rounded-xl bg-green-50 text-green-700 border border-green-100 shadow-sm">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}
