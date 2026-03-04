import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import AdminStatCard from "../../components/admin/AdminStatCard";
import ManagerLayout from "../../layouts/ManagerLayout";
import "../../styles/dashboard.css";

const ManagerDashboard = ({ darkMode, toggleDarkMode }) => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await apiClient.get("/company/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOverview(response.data.company_overview);
      } catch (error) {
        console.error("Error fetching manager dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <ManagerLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      {/* ===== Dashboard Content Only ===== */}

      <h1 className="dashboard-title">
        {overview?.company_name
          ? `${overview.company_name} Dashboard`
          : "Company Dashboard"}
      </h1>

      <p className="dashboard-subtitle">
        {overview?.industry
          ? `${overview.industry} Industry • Real-time company statistics`
          : "Real-time company statistics"}
      </p>

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : overview ? (
        <div className="stats-row">
          <AdminStatCard
            title="Total Employees"
            value={overview.total_employees}
            color="teal"
          />

          <AdminStatCard
            title="Total Uploads"
            value={overview.total_uploads}
            color="yellow"
          />

          <AdminStatCard
            title="Cleaned Files"
            value={overview.total_cleaned_files}
            color="green"
          />

          <AdminStatCard
            title="Total Revenue"
            value={`₹ ${overview.total_revenue}`}
            color="teal"
          />

          <AdminStatCard
            title="Total Rows Stored"
            value={overview.total_rows_stored}
            color="yellow"
          />

          <AdminStatCard
            title="Last Upload Date"
            value={overview.last_upload_date || "No uploads yet"}
            color="red"
          />
        </div>
      ) : (
        <p>No data available</p>
      )}
    </ManagerLayout>
  );
};

export default ManagerDashboard;
