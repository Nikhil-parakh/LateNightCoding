import { useState } from "react";
import apiClient from "../../services/apiClient";

const ColumnMapping = ({ data, onSuccess }) => {
  const [requiredMapping, setRequiredMapping] = useState({});
  const [optionalMapping, setOptionalMapping] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await apiClient.post(
        "/employee/map-columns",
        {
          uploaded_file_id: data.uploaded_file_id,
          required_mapping: requiredMapping,
          optional_mapping: optionalMapping,
          system_optional_mapping: data.system_optional_mapping,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onSuccess(response.data.cleaning_report);

    } catch (error) {
      console.error(error);
      alert("Mapping failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="table-card" style={{ marginTop: "20px" }}>
      <h2>Column Mapping</h2>

      {/* ================= REQUIRED ================= */}
      <h3 style={{ marginTop: "20px", color: "#ef4444" }}>
        Required Columns
      </h3>

      {data.required_columns.map((col) => (
        <div key={col} style={{ marginBottom: "10px" }}>
          <label>{col}</label>
          <select
            className="search-input"
            onChange={(e) =>
              setRequiredMapping({
                ...requiredMapping,
                [col]: e.target.value,
              })
            }
          >
            <option value="">Select Column</option>
            {data.detected_columns.map((dc) => (
              <option key={dc} value={dc}>
                {dc}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* ================= OPTIONAL ================= */}
      <h3 style={{ marginTop: "30px", color: "#f59e0b" }}>
        Optional Columns
      </h3>

      {data.optional_columns.map((col) => (
        <div key={col} style={{ marginBottom: "10px" }}>
          <label>{col}</label>
          <select
            className="search-input"
            onChange={(e) =>
              setOptionalMapping({
                ...optionalMapping,
                [col]: e.target.value,
              })
            }
          >
            <option value="">Skip (Optional)</option>
            {data.detected_columns.map((dc) => (
              <option key={dc} value={dc}>
                {dc}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* ================= SYSTEM OPTIONAL ================= */}
      <h3 style={{ marginTop: "30px", color: "#3b82f6" }}>
        System Mapped Columns
      </h3>

      {Object.entries(data.system_optional_mapping).map(
        ([systemCol, detectedCol]) => (
          <div key={systemCol} style={{ marginBottom: "10px" }}>
            <label>{systemCol}</label>
            <input
              className="search-input"
              value={detectedCol}
              disabled
            />
          </div>
        )
      )}

      {/* ================= SUBMIT ================= */}
      <button
        className="action-btn edit-btn"
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: "20px" }}
      >
        {loading ? "Processing..." : "Submit Mapping"}
      </button>
    </div>
  );
};

export default ColumnMapping;