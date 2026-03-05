import { useState, useEffect } from "react";
import axios from "axios";
import ColumnMapping from "./ColumnMapping";
import uploadCloud from "../../assets/icons/upload.png";
import { useNavigate } from "react-router-dom";

const EmployeeUpload = ({ onUploadSuccess = () => {} }) => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState(null);
  const [cleaningReport, setCleaningReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [availableCharts, setAvailableCharts] = useState([]);
  const [selectedCharts, setSelectedCharts] = useState([]);

  useEffect(() => {
    if (cleaningReport) {
      fetchAvailableCharts();
    }
  }, [cleaningReport]);

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
        },
      );

      setResponseData(res.data);

      if (res.data.cleaning_report) {
        setCleaningReport(res.data.cleaning_report);

        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };
  const toggleChart = (chartName) => {
    if (selectedCharts.includes(chartName)) {
      setSelectedCharts(selectedCharts.filter((c) => c !== chartName));
    } else {
      setSelectedCharts([...selectedCharts, chartName]);
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

  const fetchAvailableCharts = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:5000/employee/available-charts",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setAvailableCharts(res.data.available_charts);
    } catch (error) {
      console.error("Error fetching charts:", error);
    }
  };

  // const handleChartClick = (chartName) => {
  //   const charts = [chartName];

  //   localStorage.setItem("selectedCharts", JSON.stringify(charts));

  //   navigate("/user/charts", {
  //     state: { charts },
  //   });
  // };

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

        <img src={uploadCloud} className="upload-icon" />

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
            fetchAvailableCharts(); // ⭐ ADD THIS
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

      {/* Loading Charts */}
      {availableCharts.length === 0 && cleaningReport && (
        <p style={{ marginTop: "15px" }}>Loading available charts...</p>
      )}

      {/* Available Charts */}
      {availableCharts.length > 0 && (
        <div className="table-card" style={{ marginBottom: "30px" }}>
          <h3>Select Charts</h3>

          <div className="charts-grid">
            {availableCharts.map((chart) => (
              <div
                key={chart}
                className={`chart-card ${
                  selectedCharts.includes(chart) ? "selected" : ""
                }`}
                onClick={() => toggleChart(chart)}
              >
                <div className="chart-icon">
                  {chart === "revenue_over_time" && "📈"}
                  {chart === "sales_volume_over_time" && "📊"}
                  {chart === "sales_by_state" && "🌍"}
                  {chart === "top_10_products" && "🏆"}
                  {chart === "category_performance" && "🛍️"}
                  {chart === "online_vs_offline" && "💻"}
                  {chart === "payment_mode_distribution" && "💳"}
                </div>

                <div className="chart-title">{chart.replaceAll("_", " ")}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCharts.length > 0 && (
        <button
          className="action-btn edit-btn"
          style={{ marginTop: "20px" }}
          onClick={() =>
            navigate("/user/charts", {
              state: { charts: selectedCharts },
            })
          }
        >
          Generate Charts
        </button>
      )}
    </div>
  );
};

export default EmployeeUpload;
