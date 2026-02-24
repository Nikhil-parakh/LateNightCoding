import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";
import UserDashboard from "./UserDashboard";

const DashboardPage = () => {
  const role = localStorage.getItem("role");

  // Safety check (edge case)
  if (!role) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
        <h2>No role found</h2>
        <p>Please login again.</p>
      </div>
    );
  }

  // Role-based rendering
  switch (role) {
    case "admin":
      return <AdminDashboard />;

    case "manager":
      return <ManagerDashboard />;

    case "employee":
      return <UserDashboard />;

    default:
      return (
        <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
          <h2>Invalid role</h2>
          <p>Contact support.</p>
        </div>
      );
  }
};

export default DashboardPage;
