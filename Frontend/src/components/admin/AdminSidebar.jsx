import { NavLink } from "react-router-dom";
import dashboardIcon from "../../assets/icons/dashboard.png";
import companyIcon from "../../assets/icons/companies.png";
import auditIcon from "../../assets/icons/auditlog.png";
import settingsIcon from "../../assets/icons/setting.png";

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      {/* LOGO */}
      <div className="sidebar-logo">Salesify</div>

      {/* MENU */}
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/dashboard"
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
            to="/companies"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <img src={companyIcon} alt="" className="sidebar-icon" />
            Companies
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/audit-logs"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <img src={auditIcon} alt="" className="sidebar-icon" />
            Audit Logs
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/settings"
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
  );
};

export default AdminSidebar;
