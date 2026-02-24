import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import UserSidebar from "../../components/dashboard/UserSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import "../../styles/dashboard.css";

const UserDashboard = () => {
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const res = await apiClient.get("/employee/available-charts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setCharts(res.data.available_charts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCharts();
  }, []);

  return (
    <div className="dashboard-layout">
      <UserSidebar />

      <div className="dashboard-main">
        <AdminTopbar title="Employee Dashboard 📊" />

        <div className="dashboard-content">
          <h1 className="dashboard-title">Available Charts</h1>
          <p className="dashboard-subtitle">
            Charts available for your uploaded sales data
          </p>

          <div className="content-box">
            <ul className="list">
              {charts.map((chart, index) => (
                <li key={index}>• {chart}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;