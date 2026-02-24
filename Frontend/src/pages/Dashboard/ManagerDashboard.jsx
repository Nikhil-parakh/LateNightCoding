//import { useState } from "react";
import ManagerSidebar from "../../components/dashboard/ManagerSidebar";
import ManagerTopbar from "../../components/dashboard/ManagerTopbar";
import ManagerStatCard from "../../components/dashboard/ManagerStatCard";
import MonthlyRevenueChart from "../../components/dashboard/MonthlyRevenueChart";
import "../../styles/dashboard.css";

const ManagerDashboard = () => {
  // ✅ hooks hamesha yahan
  // const [users] = useState([
  //   {
  //     id: 1,
  //     name: "Rohit Sharma",
  //     email: "rohit@test.com",
  //     role: "User",
  //     status: "Active",
  //   },
  //   {
  //     id: 2,
  //     name: "Anita Verma",
  //     email: "anita@test.com",
  //     role: "User",
  //     status: "Inactive",
  //   },
  //   {
  //     id: 3,
  //     name: "Kunal Singh",
  //     email: "kunal@test.com",
  //     role: "User",
  //     status: "Active",
  //   },
  // ]);

  const salesData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 15000 },
  { month: "Apr", revenue: 22000 },
  { month: "May", revenue: 26000 },
  ];

  return (
    <div className="dashboard-layout">
    <ManagerSidebar />

    <div className="dashboard-main">
      <ManagerTopbar title="Manager Dashboard" />

      <div className="dashboard-content">

        <h1 className="dashboard-title">Dashboard Overview</h1>
        <p className="dashboard-subtitle">
          Quick snapshot of system statistics
        </p>

        <div className="stats-row">
          <ManagerStatCard title="Total Users" value="67,343" />
          <ManagerStatCard title="Requests" value="2,343" />
          <ManagerStatCard title="Orders" value="35,343" />
          <ManagerStatCard title="Active Rate" value="70%" />
        </div>

        <h2 className="section-title">Monthly Revenue</h2>
        <div className="content-box">
          <MonthlyRevenueChart data={salesData} />
        </div>

        <h2 className="section-title">Users</h2>

        <div className="content-box">
          {/* table */}
        </div>

        <h2 className="section-title">Activity</h2>

        <div className="content-box">
          <p>System usage is healthy ✔️</p>
        </div>

      </div>
    </div>
  </div>
  );
};

export default ManagerDashboard;
