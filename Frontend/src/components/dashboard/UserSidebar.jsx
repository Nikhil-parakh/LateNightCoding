import { useNavigate, useLocation } from "react-router-dom";

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">Salesify</h2>

      <ul className="sidebar-menu">
        <li
          className={isActive("/user/dashboard") ? "active" : ""}
          onClick={() => navigate("/user/dashboard")}
        >
          Dashboard
        </li>

        <li
          className={isActive("/user/upload") ? "active" : ""}
          onClick={() => navigate("/user/upload")}
        >
          Upload File
        </li>

        <li
          className={isActive("/user/charts") ? "active" : ""}
          onClick={() => navigate("/user/charts")}
        >
          Charts
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;