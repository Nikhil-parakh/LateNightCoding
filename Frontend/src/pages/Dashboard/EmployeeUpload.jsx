import { useState } from "react";
import axios from "axios";
import ColumnMapping from "./ColumnMapping";

const EmployeeUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [cleaningReport, setCleaningReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/employee/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setResponseData(res.data);

      if (res.data.cleaning_report) {
        setCleaningReport(res.data.cleaning_report);
        onUploadSuccess();
      }

    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="content-box">

      {/* DRAG & DROP AREA */}
      <div
        className={`drop-zone ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDragIn}
        onDragOver={handleDrag}
        onDragLeave={handleDragOut}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input"
        />

        <p>
          {file
            ? `Selected File: ${file.name}`
            : "Drag & Drop CSV file here or Click to select"}
        </p>
      </div>

      <button
        className="action-btn edit-btn"
        onClick={handleUpload}
        disabled={loading}
        style={{ marginTop: "15px" }}
      >
        {loading ? "Uploading..." : "Upload File"}
      </button>

      {/* Mapping */}
      {responseData?.message === "Column mapping required" && (
        <ColumnMapping
          data={responseData}
          onSuccess={(report) => {
            setCleaningReport(report);
            setResponseData(null);
            onUploadSuccess();
          }}
        />
      )}

      {/* Cleaning Report */}
      {cleaningReport && (
        <div style={{ marginTop: "20px" }}>
          <h3>Cleaning Report</h3>
          <p>{cleaningReport.message}</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeUpload;