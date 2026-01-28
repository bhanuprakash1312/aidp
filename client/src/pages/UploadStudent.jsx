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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative">

        {/* 🔙 Back to Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-4 left-4 flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-blue-700">
            Upload Students
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload an Excel file (.xls or .xlsx)
          </p>
        </div>

        {/* ℹ️ Excel Requirements */}
        <div className="mb-5 rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
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
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-mono"
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
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-6 cursor-pointer hover:bg-blue-50 transition">
          <FileSpreadsheet className="w-10 h-10 text-blue-500 mb-2" />
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
          className={`w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white transition
            ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          <Upload className="w-5 h-5" />
          {loading ? "Uploading..." : "Upload File"}
        </button>

        {/* ❌ Error Message */}
        {status === "error" && errorContent && (
          <div className="mt-4 p-4 rounded-lg bg-red-100 text-red-700 text-sm">
            <div className="font-semibold mb-1 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              {errorContent.title}
            </div>
            <div className="ml-7">{errorContent.description}</div>
          </div>
        )}

        {/* ✅ Success Message */}
        {status === "success" && successMessage && (
          <div className="mt-4 flex items-center gap-2 justify-center text-sm font-medium p-3 rounded-lg bg-green-100 text-green-700">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}
