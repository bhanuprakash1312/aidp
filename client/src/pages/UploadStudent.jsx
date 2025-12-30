import { useState } from "react";
import api from "../services/api";

export default function UploadStudent() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post(
        "/students/upload-excel",
        formData
      );

      setMessage(res.data.detail);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || "Upload failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Upload Students (Excel)
      </h2>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
