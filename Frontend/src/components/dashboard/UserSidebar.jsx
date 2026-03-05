import { NavLink } from "react-router-dom";

import dashboardIcon from "../../assets/icons/dashboard.png";
import uploadIcon from "../../assets/icons/upload.png";
import chartIcon from "../../assets/icons/chart.png";

const UserSidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">Salesify</h2>

      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/user/dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <img src={dashboardIcon} className="sidebar-icon" />
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/user/upload"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <img src={uploadIcon} className="sidebar-icon" />
            Upload File
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/user/charts"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <img src={chartIcon} className="sidebar-icon" />
            Charts
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;
