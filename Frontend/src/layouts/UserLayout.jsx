import { useState } from "react";
import UserSidebar from "../components/dashboard/UserSidebar";
import UserTopbar from "../components/dashboard/UserTopbar";

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-layout">
      {sidebarOpen && <UserSidebar />}

      <div className={`dashboard-main ${!sidebarOpen ? "full-width" : ""}`}>
        <UserTopbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
};

export default UserLayout;
