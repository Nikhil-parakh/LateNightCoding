import { useState } from "react";
import UserSidebar from "../../components/dashboard/UserSidebar";
import AdminTopbar from "../../components/dashboard/UserTopbar";
import EmployeeUpload from "./EmployeeUpload";
import "../../styles/dashboard.css";

const UserDashboard = () => {
  const [refreshCharts, setRefreshCharts] = useState(false);

  return (
    <div className="dashboard-layout">
      <UserSidebar />

      <div className="dashboard-main">
        <AdminTopbar title="Employee Dashboard 📊" />

        <div className="dashboard-content">
          <h1 className="dashboard-title">Upload Sales Data</h1>
          <p className="dashboard-subtitle">
            Upload CSV file to generate insights & charts
          </p>

          <EmployeeUpload onUploadSuccess={() => setRefreshCharts(!refreshCharts)} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;