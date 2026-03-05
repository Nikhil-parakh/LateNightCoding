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
        },
      );

      onSuccess(response.data.cleaning_report);
    } catch (error) {
      console.error("Mapping Error:", error);

      if (error.response) {
        console.error("Backend Error:", error.response.data);
        alert(error.response.data.message || "Mapping failed");
      } else {
        alert("Mapping failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mapping-container">
      <h2 className="mapping-title">Column Mapping</h2>
      <p className="mapping-desc">Match your CSV columns with system fields</p>

      {/* REQUIRED */}
      <div className="mapping-section required">
        <h3>Required Columns</h3>

        <div className="mapping-grid">
          {data.required_columns.map((col) => (
            <div key={col} className="mapping-item">
              <label>{col}</label>

              <select
                className="mapping-select"
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
        </div>
      </div>

      {/* OPTIONAL */}
      <div className="mapping-section optional">
        <h3>Optional Columns</h3>

        <div className="mapping-grid">
          {data.optional_columns.map((col) => (
            <div key={col} className="mapping-item">
              <label>{col}</label>

              <select
                className="mapping-select"
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
        </div>
      </div>

      {/* SYSTEM */}
      <div className="mapping-section system">
        <h3>System Mapped Columns</h3>

        <div className="mapping-grid">
          {Object.entries(data.system_optional_mapping).map(
            ([systemCol, detectedCol]) => (
              <div key={systemCol} className="mapping-item">
                <label>{systemCol}</label>

                <input className="mapping-input" value={detectedCol} disabled />
              </div>
            ),
          )}
        </div>
      </div>

      <button
        className="mapping-submit"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Processing..." : "Submit Mapping"}
      </button>
    </div>
  );
};

export default ColumnMapping;
