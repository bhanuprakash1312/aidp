import { useState } from "react";
import api from "../services/api";
import { Upload, FileSpreadsheet, CheckCircle, XCircle } from "lucide-react";

export default function UploadStudent() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // success | error
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select an Excel file");
      setStatus("error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");
      const res = await api.post("/students/upload-excel", formData);
      setMessage(res.data.detail || "Upload successful");
      setStatus("success");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Upload failed");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };
  // const Evaluate = async () => {
  //   try{
  //     api.post("/risk/evaluate");
  //     setMessage("Evaluation successful");
  //     setStatus("success");
  //   }
  //   catch(err){
  //     console.log(err);
  //     setStatus("error");
  //     setMessage("Evaluation failed");
  //   }

  // }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
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

        {/* <button
          onClick={Evaluate}
          disabled={loading}
          className={`w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white transition
            ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
           Evaluate
          {loading ? "Evaluating..." : "Evaluate"}
        </button> */}

        {/* Message */}
        {message && (
          <div
            className={`mt-4 flex items-center gap-2 justify-center text-sm font-medium p-3 rounded-lg
              ${
                status === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {status === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
