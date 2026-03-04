import { NavLink } from "react-router-dom";
import dashboardIcon from "../../assets/icons/dashboard.png";
import usersIcon from "../../assets/icons/users.png";
import requestsIcon from "../../assets/icons/request.png";
import reportsIcon from "../../assets/icons/report.png";
import settingsIcon from "../../assets/icons/setting.png";

const ManagerSidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">Salesify</div>

        <ul className="sidebar-menu">
          <li>
            <NavLink
              to="/manager/dashboard"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <img src={dashboardIcon} alt="" className="sidebar-icon" />
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/manager/employees"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <img src={usersIcon} alt="" className="sidebar-icon" />
              Users
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/manager/requests"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <img src={requestsIcon} alt="" className="sidebar-icon" />
              Requests
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/manager/reports"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <img src={reportsIcon} alt="" className="sidebar-icon" />
              Reports
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/manager/settings"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <img src={settingsIcon} alt="" className="sidebar-icon" />
              Settings
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="sidebar-image-wrapper">
        {/* optional bottom content */}
      </div>
    </div>
  );
};

export default ManagerSidebar;
