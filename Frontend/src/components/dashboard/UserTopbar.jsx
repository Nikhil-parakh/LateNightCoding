import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../utils/logout";

const UserTopbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(navigate);
  };

  return (
    <div className="topbar">
      <div className="topbar-left">Welcome User 👋</div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default UserTopbar;
