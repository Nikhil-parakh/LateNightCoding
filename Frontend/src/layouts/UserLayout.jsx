import { useState } from "react";
import UserSidebar from "../components/dashboard/UserSidebar";
import UserTopbar from "../components/dashboard/UserTopbar";
import Chatbot from "../components/chatbot/Chatbot";

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-layout">
      {sidebarOpen && <UserSidebar />}

      <div className={`dashboard-main ${!sidebarOpen ? "full-width" : ""}`}>
        <UserTopbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="dashboard-content">{children}</div>
      </div>

      {/* CHATBOT FLOATING BUTTON */}
      <Chatbot />
    </div>
  );
};

export default UserLayout;
