import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      {/* LOGO */}
      <div className="sidebar-logo">
        Salesify
      </div>

      {/* MENU */}
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
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
            Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;