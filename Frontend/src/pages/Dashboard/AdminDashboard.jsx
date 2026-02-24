import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import AdminStatCard from "../../components/admin/AdminStatCard";
import "../../styles/dashboard.css";

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await apiClient.get("/admin/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOverview(response.data.platform_overview);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-layout">
      <AdminSidebar />

      <div className="dashboard-main">
        <AdminTopbar title="Admin Dashboard 📊" />

        <div className="dashboard-content">
          <h1 className="dashboard-title">Platform Overview</h1>
          <p className="dashboard-subtitle">
            Real-time system statistics
          </p>

          {loading ? (
            <p>Loading dashboard data...</p>
          ) : overview ? (
            <div className="stats-row">

              <AdminStatCard
                title="Registered Companies"
                value={overview.total_registered_companies}
                color="teal"
              />

              <AdminStatCard
                title="Active Companies"
                value={overview.total_active_companies}
                color="green"
              />

              <AdminStatCard
                title="Suspended Companies"
                value={overview.total_suspended_companies}
                color="red"
              />

              <AdminStatCard
                title="Total Users"
                value={overview.total_users_in_system}
                color="yellow"
              />

              <AdminStatCard
                title="Files Uploaded"
                value={overview.total_files_uploaded}
                color="teal"
              />

              <AdminStatCard
                title="Cleaned Files"
                value={overview.total_cleaned_files_generated}
                color="green"
              />

              <AdminStatCard
                title="Total Rows Stored"
                value={overview.total_rows_stored}
                color="yellow"
              />

            </div>
          ) : (
            <p>No data available</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;