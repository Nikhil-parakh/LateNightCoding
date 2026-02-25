import { NavLink } from "react-router-dom";

const ManagerSidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-top">

        <div className="sidebar-logo">Data Analytics</div>

        <ul className="sidebar-menu">

          <li>
            <NavLink 
              to="/manager/dashboard"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
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