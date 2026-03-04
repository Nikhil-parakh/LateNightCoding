import { useState } from "react";
import ManagerSidebar from "../components/dashboard/ManagerSidebar";
import ManagerTopbar from "../components/dashboard/ManagerTopbar";

const ManagerLayout = ({ children, darkMode, toggleDarkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-layout">
      {sidebarOpen && <ManagerSidebar />}

      <div className={`dashboard-main ${!sidebarOpen ? "full-width" : ""}`}>
        <ManagerTopbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
};

export default ManagerLayout;
